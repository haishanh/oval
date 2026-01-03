import { ApiError } from './api.error';
import { json } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function wrap(fn: () => any) {
  try {
    const t = fn();
    let r = t;
    if (t.then && typeof t.then === 'function') r = await t;
    if (r instanceof Response) return r;
    return json(r);
  } catch (x) {
    if (x instanceof ApiError) {
      return json(x.toJSON(), { status: x.status });
    }
    throw x;
  }
}
