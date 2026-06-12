import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { Client } from 'basic-ftp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.deploy.local');
const env = {};

for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const indexOfEquals = trimmed.indexOf('=');
  if (indexOfEquals === -1) continue;
  env[trimmed.slice(0, indexOfEquals).trim()] = trimmed.slice(indexOfEquals + 1).trim();
}

const redirectHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=/calculadora-intereses/" />
    <link rel="canonical" href="https://breimato.es/calculadora-intereses/" />
    <title>Redirigiendo a la calculadora de interés compuesto</title>
    <script>location.replace('/calculadora-intereses/');</script>
  </head>
  <body>
    <p><a href="/calculadora-intereses/">Ir a la calculadora de interés compuesto</a></p>
  </body>
</html>`;

const ftpClient = new Client(60_000);
await ftpClient.access({
  host: env.FTP_HOST,
  user: env.FTP_USER,
  password: env.FTP_PASSWORD,
  port: Number(env.FTP_PORT || 21),
  secure: env.FTP_SECURE === 'true',
});

const legacyHtaccess = `DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /calculadora/
  RewriteRule ^$ index.html [L]
</IfModule>
`;

await ftpClient.cd('/');
await ftpClient.uploadFrom(
  Readable.from([redirectHtml]),
  'breimato.es/public_html/calculadora/index.html',
);
await ftpClient.uploadFrom(
  Readable.from([legacyHtaccess]),
  'breimato.es/public_html/calculadora/.htaccess',
);
ftpClient.close();
console.log('Redirect y .htaccess subidos a /calculadora/');
