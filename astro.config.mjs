import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  site: 'https://breimato.es/calculadora',
  base: '/calculadora/',
  build: {
    assets: '/calculadora/',
    siteAssets: true,
  },
  favicon: '/calculadora/calculadora.png',
  trailingSlash: 'always',
});
