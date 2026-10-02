import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://sudharsana.dev',
  outDir: process.env.SITE_OUTPUT_DIR ?? './dist',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'never' },
  vite: { build: { assetsInlineLimit: 0 } },
});
