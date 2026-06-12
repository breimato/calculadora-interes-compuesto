import {
  readFileSync,
  existsSync,
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { Client } from 'basic-ftp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.deploy.local');

const PARENT_REDIRECT_MARKER = '# calculadora-interes-compuesto redirects';
const PARENT_REDIRECT_BLOCK = `<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^calculadora-intereses$ /calculadora-intereses/ [R=301,L]
RewriteRule ^calculadora-intereses/?$ /calculadora-intereses/index.php [R=302,L]
RewriteRule ^calculadora/?$ /calculadora-intereses/ [R=301,L]
</IfModule>`;

function loadDeployEnv() {
  if (!existsSync(envPath)) {
    console.error('Falta .env.deploy.local (copia desde .env.deploy.example)');
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const indexOfEquals = trimmed.indexOf('=');
    if (indexOfEquals === -1) continue;
    env[trimmed.slice(0, indexOfEquals).trim()] = trimmed.slice(indexOfEquals + 1).trim();
  }
  return env;
}

function runBuild(deployConfig) {
  return new Promise((resolvePromise, reject) => {
    const environment = { ...process.env };
    if (deployConfig.VITE_BASE_PATH) {
      environment.VITE_BASE_PATH = deployConfig.VITE_BASE_PATH;
    }

    const child = spawn('npm', ['run', 'build'], {
      cwd: root,
      env: environment,
      stdio: 'inherit',
      shell: true,
    });
    child.on('close', (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`build falló (${code})`)),
    );
  });
}

function normalizeRemoteDir(remoteDir) {
  return (remoteDir || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

async function clearRemoteDirectory(ftpClient, remoteDir) {
  if (!remoteDir) return;

  await ftpClient.cd('/');
  try {
    await ftpClient.cd(remoteDir);
  } catch {
    await ftpClient.ensureDir(remoteDir);
    await ftpClient.cd('/');
    await ftpClient.cd(remoteDir);
  }

  console.log(`Limpiando /${remoteDir}…`);
  try {
    await ftpClient.clearWorkingDir();
  } catch (error) {
    console.warn(`No se pudo limpiar /${remoteDir}: ${error.message}`);
  }
}

function upsertParentRedirectBlock(existingContent, marker, block) {
  const start = existingContent.indexOf(marker);
  if (start === -1) {
    return `${existingContent.trimEnd()}\n\n${marker}\n${block}\n`;
  }

  const afterMarker = existingContent.slice(start + marker.length);
  const nextMarkerMatch = afterMarker.match(/\n# [a-z0-9-]+ redirects/);
  const endOfBlock = nextMarkerMatch
    ? start + marker.length + nextMarkerMatch.index
    : existingContent.length;
  const before = existingContent.slice(0, start).trimEnd();
  const after = existingContent.slice(endOfBlock).trimStart();
  return `${before}\n\n${marker}\n${block}${after ? `\n\n${after}` : ''}\n`;
}

async function ensureParentRedirects(ftpClient) {
  const parentHtaccessPath = 'breimato.es/public_html/.htaccess';
  let existingContent = '';

  await ftpClient.cd('/');
  const tempDir = mkdtempSync(join(tmpdir(), 'ftp-deploy-'));
  const tempFile = join(tempDir, '.htaccess');
  try {
    await ftpClient.downloadTo(tempFile, parentHtaccessPath);
    existingContent = readFileSync(tempFile, 'utf8');
  } catch {
    existingContent = '';
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  const nextContent = upsertParentRedirectBlock(
    existingContent,
    PARENT_REDIRECT_MARKER,
    PARENT_REDIRECT_BLOCK,
  );
  const { Readable } = await import('node:stream');
  await ftpClient.uploadFrom(Readable.from([nextContent]), parentHtaccessPath);
  console.log('Redirects actualizados en public_html/.htaccess.');
}

async function deployFtp(deployConfig) {
  const ftpClient = new Client(60_000);
  ftpClient.ftp.verbose = process.env.FTP_VERBOSE === '1';

  const port = Number(deployConfig.FTP_PORT || 21);
  const secure = deployConfig.FTP_SECURE === 'true';
  const remoteDir = normalizeRemoteDir(deployConfig.FTP_REMOTE_DIR);
  const distPath = resolve(root, 'dist');

  await ftpClient.access({
    host: deployConfig.FTP_HOST,
    user: deployConfig.FTP_USER,
    password: deployConfig.FTP_PASSWORD,
    port,
    secure,
  });

  await clearRemoteDirectory(ftpClient, remoteDir);
  await ftpClient.cd('/');
  console.log(`Subiendo ${distPath} → /${remoteDir}…`);
  await ftpClient.uploadFromDir(distPath, remoteDir);
  await ensureParentRedirects(ftpClient);
  ftpClient.close();
}

const deployConfig = loadDeployEnv();
const requiredKeys = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'];
for (const requiredKey of requiredKeys) {
  if (!deployConfig[requiredKey]) {
    console.error(`Falta ${requiredKey} en .env.deploy.local`);
    process.exit(1);
  }
}

console.log('Build de producción…');
if (deployConfig.VITE_BASE_PATH) {
  console.log(`  VITE_BASE_PATH=${deployConfig.VITE_BASE_PATH}`);
}

await runBuild(deployConfig);
await deployFtp(deployConfig);
console.log('Despliegue FTP completado.');
