import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ricardo-orozco-sebaz.vercel.app',
  output: 'static',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  build: { format: 'file' },
});
