import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';
import path from 'node:path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  imports: false,
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/webextension-polyfill'],
  // @ts-ignore
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $lib: path.resolve(__dirname, './src/srvlib'),
      },
    },
  }),
  manifest: {
    name: 'Oval',
    description: 'Oval - summarize web page with AI',
    action: {
      default_title: 'Curve',
    },
    permissions: ['activeTab', 'storage'],
    icons: {
      16: '/icon/oval-16.png',
      32: '/icon/oval-32.png',
      48: '/icon/oval-48.png',
      128: '/icon/oval-128.png',
    },
  },
});
