<script lang="ts">
  import Button from '../base/Button.svelte';
  import ExternalLink from '../base/ExternalLink.svelte';
  import Field from './Field.svelte';
  import FieldSelect from './FieldSelect.svelte';
  import {
    DEFAULT_MODEL_GEMINI,
    DEFAULT_MODEL_GROK,
    PROVIDER_GOOGLE_GEMINI,
    PROVIDER_OPTIONS,
    PROVIDER_XAI_GROK,
  } from './constant';
  import { ProviderSchema, type TProvider } from './schema';
  import type { TOptionsHandlers } from './type';
  import { createForm, revalidateLogic } from '@tanstack/svelte-form';
  import * as z from 'zod';

  type Props = Pick<TOptionsHandlers, 'onAddProvider' | 'onEditProvider'> & {
    current?: TProvider;
  };
  let { onAddProvider, onEditProvider, current }: Props = $props();

  const form = createForm(() => ({
    defaultValues: current || {
      provider: PROVIDER_GOOGLE_GEMINI,
      apiKey: '',
      model: '',
      apiBaseUrl: '',
      createdAt: Date.now(),
      key: crypto.randomUUID(),
    },
    onSubmit: async ({ value }) => {
      try {
        const v = ProviderSchema.parse(value);
        if (current) {
          onEditProvider(v);
        } else {
          onAddProvider(v);
        }
      } catch (e) {
        if (e instanceof z.ZodError) {
          const msg = e.issues.map((i) => i.message).join(', ');
          // TODO this is bad user is not get to see this message
          // better add a form level error message display
          console.error(msg);
        } else {
          throw e;
        }
      }
    },
    validationLogic: revalidateLogic(),
  }));
  const provider = form.useStore((state) => state.values.provider);
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }}
>
  <div class="space-y-2">
    <form.Field name="provider">
      {#snippet children(field)}
        <FieldSelect
          label="Provider"
          value={field.state.value}
          options={PROVIDER_OPTIONS.map((o) => ({ value: o, label: o }))}
          onChange={field.handleChange}
        />
      {/snippet}
    </form.Field>

    <form.Field
      name="apiKey"
      validators={{
        onDynamic: ({ value }) => (value && value.length > 0 ? undefined : 'API Key is required'),
      }}
    >
      {#snippet children(field)}
        <Field
          label="API Key"
          error={field.state.meta.errorMap.onDynamic}
          kind="hidden"
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
        >
          {#snippet info()}
            {#if provider.current === PROVIDER_GOOGLE_GEMINI}You can get API key from <ExternalLink
                href="https://aistudio.google.com/">Google AI Studio</ExternalLink
              >{:else if provider.current === PROVIDER_XAI_GROK}You can get API key from <ExternalLink
                href="https://console.x.ai/home">xAI Cloud Console</ExternalLink
              >{/if}
          {/snippet}
        </Field>
      {/snippet}
    </form.Field>
    <form.Field name="model">
      {#snippet children(field)}
        <Field
          label="Model (Optional)"
          placeholder={provider.current === PROVIDER_GOOGLE_GEMINI
            ? DEFAULT_MODEL_GEMINI
            : provider.current === PROVIDER_XAI_GROK
              ? DEFAULT_MODEL_GROK
              : ''}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
        />
      {/snippet}
    </form.Field>
    <form.Field name="apiBaseUrl">
      {#snippet children(field)}
        <Field
          label="API Base URL (Optional)"
          placeholder={provider.current === PROVIDER_GOOGLE_GEMINI
            ? 'https://generativelanguage.googleapis.com'
            : provider.current === PROVIDER_XAI_GROK
              ? 'https://api.x.ai'
              : ''}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
        />
      {/snippet}
    </form.Field>
  </div>
  <div class="flex justify-end pt-6">
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {#snippet children(state)}
        <Button type="submit" disabled={!state.canSubmit}>Save</Button>
      {/snippet}
    </form.Subscribe>
  </div>
</form>
