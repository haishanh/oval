import type { Handle } from '@sveltejs/kit';

const API_PREFIX = '/api/';
const ALLOWED_METHODS = 'GET, POST, OPTIONS';
const DEFAULT_ALLOWED_HEADERS = 'Content-Type, X-API-Key';
const PREFLIGHT_MAX_AGE_SECONDS = '86400';

function applyCorsHeaders(response: Response, requestHeaders: Headers) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
  response.headers.set(
    'Access-Control-Allow-Headers',
    requestHeaders.get('access-control-request-headers') ?? DEFAULT_ALLOWED_HEADERS,
  );
  response.headers.set('Access-Control-Max-Age', PREFLIGHT_MAX_AGE_SECONDS);
}

export const handle: Handle = async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith(API_PREFIX)) {
    return resolve(event);
  }

  if (event.request.method === 'OPTIONS') {
    const response = new Response(null, { status: 204 });
    applyCorsHeaders(response, event.request.headers);
    return response;
  }

  const response = await resolve(event);
  applyCorsHeaders(response, event.request.headers);
  return response;
};
