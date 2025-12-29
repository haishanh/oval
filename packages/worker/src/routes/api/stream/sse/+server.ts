import type { RequestHandler } from './$types';
import { sleep } from '$lib/shared/common.util';
import { streamSSE } from '$lib/server/stream.helper';

export const GET: RequestHandler = async () => {
  return streamSSE(async (ctx) => {
    let i = 0;
    while (i < 10) {
      ctx.write({ data: `${i++} ${Date.now()}` });
      await sleep(500);
    }
  });
};
