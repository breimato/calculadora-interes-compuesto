# Calculadora de interés compuesto

Calculadora en español para proyectar el crecimiento de tus ahorros con interés compuesto, aportaciones periódicas y tramos de tipo de interés.

La aplicación funciona íntegramente en el navegador: no requiere backend ni registro. Los resultados se actualizan al instante mientras introduces los datos.

Producción: **https://breimato.es/calculadora-intereses/**

## Características

- **Capital inicial** y **aportaciones periódicas** (mensual, trimestral, anual).
- **Tipo de interés** fijo o tramos avanzados por años.
- **Gráfico de evolución** del capital a lo largo del tiempo.
- **Modo básico y avanzado** para distintos niveles de detalle.
- **Modo claro y oscuro** con preferencia compartida entre la suite (`finanzas-theme`).
- **Navegación cruzada** con el hub y las otras calculadoras financieras.
- **SEO básico**: meta tags, Open Graph y datos estructurados.

## Stack tecnológico

| Área | Tecnología |
|------|------------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Tests | Vitest |
| Estilos | CSS con variables (sin librería UI) |
| Gráfico | SVG nativo |
| Tipografías | Fraunces + IBM Plex Sans |

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalación y uso

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Despliegue

```bash
# Copia .env.deploy.example → .env.deploy.local y rellena credenciales FTP
npm run deploy:ftp
```

| Variable | Valor |
|----------|-------|
| `VITE_BASE_PATH` | `/calculadora-intereses/` |
| `FTP_REMOTE_DIR` | `breimato.es/public_html/calculadora-intereses` |

## Suite financiera

Parte del ecosistema de calculadoras en [breimato.es/finanzas/](https://breimato.es/finanzas/):

- [Salario neto](https://breimato.es/salario-neto/)
- [Hipoteca](https://breimato.es/hipoteca/)
- [Interés compuesto](https://breimato.es/calculadora-intereses/)
