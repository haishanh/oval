import { PROVIDER_OPTIONS } from './constant';
import * as v from 'valibot';

export function parseWith<TSchema extends v.GenericSchema>(schema: TSchema, input: unknown) {
  return v.parse(schema, input);
}

export function safeParseWith<TSchema extends v.GenericSchema>(schema: TSchema, input: unknown) {
  const result = v.safeParse(schema, input);
  if (result.success) {
    return { success: true as const, data: result.output };
  }
  return { success: false as const, error: new v.ValiError(result.issues) };
}

export const ProviderSchema = v.object({
  key: v.string(),
  apiKey: v.string(),
  model: v.optional(v.string()),
  apiBaseUrl: v.optional(v.string()),
  provider: v.picklist(PROVIDER_OPTIONS),
  createdAt: v.number(),
});

export const ProviderOptionsSchema = v.object({
  providers: v.optional(v.array(ProviderSchema), []),
  activeKey: v.optional(v.string(), ''),
});

export const OvalExtOptionsSchema = v.object({
  targetLanguage: v.optional(v.string(), ''),
  llmProvider: ProviderOptionsSchema,
});

export type TOvalExtOptions = v.InferOutput<typeof OvalExtOptionsSchema>;

export type TProvider = v.InferOutput<typeof ProviderSchema>;

export type TProviderOptions = v.InferOutput<typeof ProviderOptionsSchema>;
