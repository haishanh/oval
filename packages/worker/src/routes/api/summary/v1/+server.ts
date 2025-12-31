import { streamSSE } from '$lib/server/stream.helper';
import { GeminiService } from '$lib/shared/gemini.service';
import { SummaryService } from '$lib/shared/summary.service';
import type { RequestHandler } from './$types';

type Body = {
  content: string;
  title: string;
  lang?: string;
};

export const POST: RequestHandler = async ({
  request,
  // what is platform?
  // see https://svelte.dev/docs/kit/adapter-cloudflare#Runtime-APIs
  platform,
}) => {
  const geminiApiKey = platform?.env.GEMINI_API_KEY;
  if (!geminiApiKey) return new Response('Server error', { status: 500 });

  const ovalApiKey = platform?.env.OVAL_TOKEN_1;
  if (!ovalApiKey) return new Response('Server error', { status: 500 });

  const providedApiKey = request.headers.get('x-api-key');
  if (!providedApiKey || providedApiKey !== ovalApiKey) return new Response('Unauthorized', { status: 401 });

  const body = (await request.json()) as Body;
  if (!body.content) return new Response('Invalid input - missing content', { status: 400 });
  if (!body.title) return new Response('Invalid input - missing title', { status: 400 });

  const ai = new SummaryService(new GeminiService({ apiKey: geminiApiKey })).summarize(
    { content: body.content, title: body.title },
    body.lang,
  );

  return streamSSE(async (ctx) => {
    for await (const data of ai) {
      ctx.write({ data });
    }
  });
};
