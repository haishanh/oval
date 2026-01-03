import { registry } from '$lib/server/registry';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

// gemini-flash-latest
// gemini-2.5-flash-lite
// gemini-2.5-flash-preview-09-2025
const model = 'gemini-flash-latest';

export const POST: RequestHandler = async ({ params, request }) => {
  const endpoint = params.endpoint;
  if (endpoint !== `v1beta/models/${model}:streamGenerateContent`) {
    return error(404, 'Not Found');
  }
  // const apiKey = request.headers.get('x-goog-api-key');
  const gemini = registry.getGeminiService();
  const json = await request.json();
  try {
    const res = await gemini.streamGenerateContent(json, model);
    return res;
  } catch (err) {
    console.log('Error', err);
    return error(500, 'Internal Server Error');
  }
};
