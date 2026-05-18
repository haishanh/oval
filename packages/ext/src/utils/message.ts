import * as v from 'valibot';

export const MessageType = {
  Summarize: 'Summarize',
  Screenshot: 'Screenshot',
  TextChunk: 'TextChunk',
  Article: 'Article',
  SummarizeError: 'SummarizeError',
} as const;

export const Message = v.variant('type', [
  v.object({
    type: v.literal(MessageType.Article),
    payload: v.object({ content: v.string(), title: v.string() }),
  }),
  v.object({
    type: v.literal(MessageType.Screenshot),
    payload: v.object({ b64ImgSrc: v.string() }),
  }),
  v.object({
    type: v.literal(MessageType.TextChunk),
    payload: v.object({
      text: v.string(),
      isFirstChunk: v.optional(v.boolean()),
    }),
  }),
  v.object({
    type: v.literal(MessageType.Summarize),
  }),
  v.object({
    type: v.literal(MessageType.SummarizeError),
    payload: v.object({
      message: v.string(),
    }),
  }),
]);

export type TMessage = v.InferOutput<typeof Message>;
