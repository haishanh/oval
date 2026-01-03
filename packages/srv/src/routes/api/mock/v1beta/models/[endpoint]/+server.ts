import { generate } from '$lib/shared/mock.util';
import type { RequestHandler } from './$types';

function makeGeminiSseData(input: string) {
  const data = {
    candidates: [{ content: { parts: [{ text: input }], role: 'model' }, index: 0 }],
  };
  return `data: ${JSON.stringify(data)}\r\n\r\n`;
}

// const data = {
//   candidates: [
//     {
//       content: {
//         parts: [
//           {
//             text: "Okay, let's dive ..."
//           }
//         ],
//         role: 'model'
//       },
//       index: 0
//     }
//   ],
//   usageMetadata: {
//     promptTokenCount: 13,
//     candidatesTokenCount: 48,
//     totalTokenCount: 1597,
//     promptTokensDetails: [{ modality: 'TEXT', tokenCount: 13 }],
//     thoughtsTokenCount: 1536
//   },
//   modelVersion: 'gemini-2.5-flash',
//   responseId: 'UPg2aYedFLeHz7IPtJuKyAM'
// };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const POST: RequestHandler = async ({ params }) => {
  const endpoint = params.endpoint;
  console.log({ endpoint });

  // initial ttfb delay
  await sleep(3000);

  const encoder = new TextEncoder();
  const rs = new ReadableStream({
    async start(controller) {
      const ai = generate();
      for await (const text of ai) {
        const events = makeGeminiSseData(text);
        controller.enqueue(encoder.encode(events));
        await sleep(300);
      }
      controller.close();
    },
  });

  return new Response(rs, {
    headers: {
      'content-type': 'text/event-stream',
      'content-disposition': 'attachment',
    },
  });
};
