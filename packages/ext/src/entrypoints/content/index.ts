import {
  browser,
  type ContentScriptContext,
  createShadowRootUi,
  defineContentScript,
} from '#imports';
import Defuddle from 'defuddle';
import * as z from 'zod';
import { Message, MessageType } from '@/utils/message';

import '../../assets/tailwind.css';

import App from './App.svelte';
import { mount, unmount } from 'svelte';
import { screenshot, title } from './state.svelte';
import { log } from '@/utils/logger';
import { summa, isLoading, summarizeError } from '$lib/components/summa.svelte';

const restore = createRestore();

const handleClose = () => {
  restore.restore();
  screenshot.b64ImgSrc = '';
  title.title = '';
};

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    handleClose();
  }
}

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    armListeners();
    const ui = await createUi(ctx);
    ui.mount();
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: 'oval-ui',
    position: 'inline',
    anchor: 'body',
    onMount: (container) => {
      window.addEventListener('keydown', handleKeyDown);

      // Create the Svelte app inside the UI container
      return mount(App, {
        target: container,
        props: { handleClose },
      });
    },
    onRemove: (app) => {
      // Destroy the app when the UI is removed
      if (app) unmount(app);
    },
  });
}

function armListeners() {
  browser.runtime.onMessage.addListener((m, _sender, _reply) => {
    switch (m.type) {
      case 'not-used': {
        return false;
      }

      default: {
        throw new Error(`Unknown message type: ${m.type}`);
      }
    }
  });

  browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((m, port) => {
      const msg = Message.parse(m);
      log.debug(`content: got message "${msg.type}"`);
      switch (msg.type) {
        case MessageType.Screenshot: {
          screenshot.b64ImgSrc = msg.payload.b64ImgSrc;

          restore.append(preventScroll());

          const result = parseArticle();
          if (result.title) {
            log.debug('setting title');
            title.title = result.title;
          }
          port.postMessage({
            type: MessageType.Article,
            payload: { content: result.content, title: result.title },
          } satisfies z.infer<typeof Message>);

          break;
        }

        case MessageType.TextChunk: {
          if (isLoading.value === true) isLoading.value = false;
          summa.text += msg.payload.text;
          // log.debug(msg.payload.text);
          break;
        }

        case MessageType.SummarizeError: {
          if (isLoading.value === true) isLoading.value = false;
          summarizeError.current = msg.payload.message;
          break;
        }

        default: {
          throw new Error(`Unknown message type: ${msg.type}`);
        }
      }
    });
  });
}

function parseArticle() {
  // const doc = document.cloneNode(true);
  const defuddle = new Defuddle(document);
  return defuddle.parse();
}

function preventScroll() {
  const prevOverflow = document.documentElement.style.overflow || '';
  const prevFonSize = document.documentElement.style.fontSize || '';

  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.fontSize = '100%';
  let restored = false;

  return () => {
    if (restored) return;
    restored = true;
    document.documentElement.style.overflow = prevOverflow;
    document.documentElement.style.fontSize = prevFonSize;
  };
}

function createRestore() {
  const fns: Array<() => void> = [];

  return {
    restore: () => {
      fns.forEach((fn) => fn());
    },

    append: (fn: () => void) => {
      fns.push(fn);
    },
  };
}
