type SSEEvent = { data: string; event?: string; id?: string; retry?: number };

type Ctx = {
  write: (e: SSEEvent) => void;
};

export function streamSSE(fn: (c: Ctx) => Promise<void>) {
  const encoder = new TextEncoder();

  const rs = new ReadableStream({
    start(controller) {
      const c = {
        write(ev: SSEEvent) {
          const dataLines = ev.data
            .split('\n')
            .map((line) => `data: ${line}`)
            .join('\n');

          const sseData =
            [ev.event && `event: ${ev.event}`, dataLines, ev.id && `id: ${ev.id}`, ev.retry && `retry: ${ev.retry}`]
              .filter(Boolean)
              .join('\n') + '\n\n';

          controller.enqueue(encoder.encode(sseData));
        },
      };
      const close = () => controller.close();
      fn(c).then(close, close);
    },
  });

  return new Response(rs, {
    headers: {
      'Transfer-Encoding': 'chunked',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
