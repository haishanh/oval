<script lang="ts">
  import { CircleCheckBigIcon, CircleIcon, TrashIcon } from '@lucide/svelte';
  import Modal from './Modal.svelte';
  import ProviderConfigForm from './ProviderConfigForm.svelte';
  import type { TOptionsHandlers } from './type';
  import { RadioGroup } from 'bits-ui';
  import Button from '../base/Button.svelte';
  import type { TProviderOptions } from './schema';
  import { DEFAULT_MODEL_GEMINI, DEFAULT_MODEL_GROK } from './constant';

  type Props = {
    value: TProviderOptions;
  } & Pick<TOptionsHandlers, 'onDeleteProvider' | 'onAddProvider' | 'onSelectActiveProvider'>;

  let { value, onDeleteProvider, onAddProvider, onSelectActiveProvider }: Props = $props();
  let open = $state(false);
</script>

<p class="mb-1">Oval currently supports Google Gemini and xAI Grok.</p>

{#if value.providers.length > 0}
  <RadioGroup.Root class="pt-4" value={value.activeKey} onValueChange={onSelectActiveProvider}>
    <div class="group flex flex-col items-center gap-2 text-foreground transition-all select-none">
      {#each value.providers as item (item.key)}
        {@const model =
          item.model ||
          (item.provider === 'Google Gemini' ? DEFAULT_MODEL_GEMINI : DEFAULT_MODEL_GROK)}
        <div class="flex w-full items-center gap-2">
          <RadioGroup.Item
            value={item.key}
            class="flex w-full grow cursor-pointer gap-3 rounded-[10px] border border-bo p-2.5 hover:bg-neutral-100 data-[state=checked]:border-oval-green hover:dark:bg-neutral-800"
          >
            <span class="inline-flex items-center justify-center">
              {#if value.activeKey === item.key}
                <CircleCheckBigIcon size={18} class="text-oval-green" />
              {:else}
                <CircleIcon size={18} class="text-neutral-350 dark:text-neutral-600" />
              {/if}
            </span>
            <div class="flex flex-col items-start gap-1">
              <h3>{item.provider}</h3>
              <span class="text-sm text-muted-foreground">{model}</span>
              {#if item.apiBaseUrl}
                <span class="text-sm text-muted-foreground">{item.apiBaseUrl}</span>
              {/if}
              <span class="text-sm text-muted-foreground"
                >{new Date(item.createdAt).toLocaleString()}</span
              >
            </div>
          </RadioGroup.Item>
          <div class="flex items-center gap-1">
            <Button iconOnly onclick={() => onDeleteProvider(item.key)}>
              <TrashIcon size={13} />
              <span class="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </RadioGroup.Root>
{/if}

<div class="py-2 pt-4">
  <Modal bind:open>
    <ProviderConfigForm
      onAddProvider={(v) => {
        onAddProvider(v);
        open = false;
      }}
    />
  </Modal>
</div>
