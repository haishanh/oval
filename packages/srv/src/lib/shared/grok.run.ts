import { GrokService } from './grok.service';
import assert from 'node:assert';

(async () => {
  console.log(process.env.XAI_API_KEY);
  const apiKey = process.env.XAI_API_KEY;
  assert(apiKey, 'env var XAI_API_KEY is required');
  const grok = new GrokService({ apiKey });
  const res = await grok.complete([
    {
      role: 'user',
      content: 'Who are the founders of Tesla, the EV company?',
    },
  ]);
  const ai = GrokService.createAsyncIterableTextStreamFromResponse(res);
  let t = '';
  for await (const chunk of ai) {
    process.stdout.write('.');
    t += chunk;
  }

  console.log(t);
})();
