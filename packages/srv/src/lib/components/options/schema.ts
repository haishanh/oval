import { PROVIDER_OPTIONS } from './constant';
import * as z from 'zod';

export const ProviderSchema = z.object({
  key: z.string(),
  apiKey: z.string(),
  model: z.string().optional(),
  apiBaseUrl: z.string().optional(),
  provider: z.enum(PROVIDER_OPTIONS),
  createdAt: z.number(),
});

export const ProviderOptionsSchema = z.object({
  providers: z.array(ProviderSchema).default([]),
  activeKey: z.string().default(''),
});

export const OvalExtOptionsSchema = z.object({
  targetLanguage: z.string().default(''),
  llmProvider: ProviderOptionsSchema,
});

export type TOvalExtOptions = z.infer<typeof OvalExtOptionsSchema>;

export type TProvider = z.infer<typeof ProviderSchema>;

export type TProviderOptions = z.infer<typeof ProviderOptionsSchema>;
