import { streamSSE } from '$lib/server/stream.helper';
import { sleep } from '$lib/shared/common.util';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return streamSSE(async (ctx) => {
    let i = 0;
    while (i < 10) {
      ctx.write({ data: `${i++} ${Date.now()}` });
      await sleep(500);
    }
  });
};
