<script lang="ts">
  import { createForm } from '@tanstack/svelte-form';
  import FieldSelect from './FieldSelect.svelte';
  import { langOptions } from './langOptions';

  type Props = {
    isUsingBuiltInProvider?: boolean;
    targetLanguage: string;
    onKvChange: (key: string, value: string) => void;
  };
  let { isUsingBuiltInProvider, targetLanguage, onKvChange }: Props = $props();

  const form = createForm(() => ({
    defaultValues: {
      targetLanguage
    }
  }));

  const options = [
    { label: 'Based on browser settings', value: '' },
    ...langOptions.map((v) => ({ value: v, label: v }))
  ];
</script>

<section class="space-y-2.5">
  {#if isUsingBuiltInProvider}
    <p>
      You are currently using Oval's built-in LLM API keys. As Oval is a personal project, it's
      recommended to Bring Your Own Keys. To do that, check out "Provider" in the left sidebar.
    </p>
  {/if}

  <form
    onsubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    <form.Field name="targetLanguage">
      {#snippet children(field)}
        <FieldSelect
          label="Target Language"
          value={field.state.value}
          {options}
          onChange={(v) => {
            field.handleChange(v);
            onKvChange('targetLanguage', v);
          }}
        />
      {/snippet}
    </form.Field>
  </form>
</section>
