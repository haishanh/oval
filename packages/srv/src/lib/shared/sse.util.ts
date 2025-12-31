export function createAsyncIterableFromSSEResponse<Chunk>(
  res: Response,
  sep = '\n\n',
  parseDataLine: (line: string) => Chunk | undefined
) {
  const reader = res.body?.getReader();
  if (!reader) throw new Error('res.body is not readable');

  const decoder = new TextDecoder('utf-8');
  let left = '';

  const ai = {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const decoded = decoder.decode(value, { stream: true });
          const withLeft = left + decoded;
          const dataLines = withLeft.split(sep);

          if (dataLines.length === 1) {
            left += decoded;
            continue;
          }
          left = dataLines.pop() || '';

          for (const ln of dataLines) {
            if (!ln.startsWith('data: ')) continue;
            const t = parseDataLine(ln);
            if (t) yield t;
          }
        }
      } catch (error) {
        console.error('Error consuming stream:', error);
      } finally {
        // Release the lock on the stream
        reader.releaseLock();
      }

      if (left) {
        const text = parseDataLine(left);
        if (text) yield text;
      }
    }
  };
  return ai;
}
