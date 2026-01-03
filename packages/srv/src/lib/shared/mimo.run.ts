import { MimoService } from './mimo.service';
import assert from 'node:assert';

(async () => {
  const apiKey = process.env.MIMO_API_KEY;
  assert(apiKey);
  const mimo = new MimoService({ apiKey });
  const res = await mimo.complete([
    {
      role: 'system',
      content:
        'You are MiMo, an AI assistant developed by Xiaomi. Today is date: Tuesday, December 16, 2025. Your knowledge cutoff date is December 2024.',
    },
    {
      role: 'user',
      content: 'please introduce yourself',
    },
  ]);

  const ai = MimoService.createAsyncIterableTextStreamFromResponse(res);
  for await (const chunk of ai) {
    process.stdout.write(chunk);
  }
})();
