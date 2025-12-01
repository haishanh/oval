import type { RequestHandler } from './$types';
import { sleep } from '$lib/shared/common.util';

export const POST: RequestHandler = async () => {
  const rs = new ReadableStream({
    start(controller) {
      let i = 0;
      (async () => {
        while (i++ < 5) {
          controller.enqueue('data: Hello, world!\n\n');
          await sleep(300);
        }
        controller.close();
      })();
    }
  });
  return new Response(rs, {
    headers: {
      'Transfer-Encoding': 'chunked',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  });
};
