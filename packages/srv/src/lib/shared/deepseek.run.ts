import { OpenaiBaseService } from './openai.base.service';
import assert from 'node:assert';

(async () => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  assert(apiKey);
  const client = new OpenaiBaseService({ apiKey, baseUrl: 'https://api.deepseek.com', model: 'deepseek-v4-flash' });
  const res = await client.complete([
    {
      role: 'system',
      content: 'You are a tech-savvy writer.',
    },
    {
      role: 'user',
      content: 'Write a poem on Bitcoin',
    },
  ]);

  const ai = OpenaiBaseService.createAsyncIterableTextStreamFromResponse(res);
  for await (const chunk of ai) {
    process.stdout.write(chunk);
  }
})();
