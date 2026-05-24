import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';
import path from 'node:path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  imports: false,
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/webextension-polyfill'],
  hooks: {
    'build:manifestGenerated': (_wxt, manifest) => {
      if (!manifest.host_permissions) return;
      manifest.host_permissions = manifest.host_permissions.filter(
        (permission) => permission !== '<all_urls>',
      );
      if (manifest.host_permissions.length === 0) {
        delete manifest.host_permissions;
      }
    },
  },
  // @ts-ignore
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $lib: path.resolve(__dirname, './src/lib'),
      },
    },
  }),
  manifest: {
    name: 'Oval',
    description: 'Oval - summarize web page with AI',
    action: {
      default_title: 'Oval',
    },
    permissions: ['activeTab', 'storage', 'scripting'],
    // host_permissions: ['https://oval-worker.hs.workers.dev/*'],
    icons: {
      16: '/icon/oval-16.png',
      32: '/icon/oval-32.png',
      48: '/icon/oval-48.png',
      128: '/icon/oval-128.png',
    },
  },
});
