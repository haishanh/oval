import * as z from 'zod';

export const MessageType = {
  Summarize: 'Summarize',
  Screenshot: 'Screenshot',
  TextChunk: 'TextChunk',
  Article: 'Article',
} as const;

export const Message = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(MessageType.Article),
    payload: z.object({ content: z.string(), title: z.string() }),
  }),
  z.object({
    type: z.literal(MessageType.Screenshot),
    payload: z.object({ b64ImgSrc: z.string() }),
  }),
  z.object({
    type: z.literal(MessageType.TextChunk),
    payload: z.object({
      text: z.string(),
      isFirstChunk: z.boolean().optional(),
    }),
  }),
  z.object({
    type: z.literal(MessageType.Summarize),
  }),
]);
