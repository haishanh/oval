<script lang="ts" module>
  export type SelectProps = {
    id: string;
    value: string;
    onChange?: (value: string) => void;
    options?: Option[];
    placeholder?: string;
  };
  export type Option = {
    value: string;
    label: string;
    disabled?: boolean;
  };
</script>

<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from '@lucide/svelte';
  import { Select } from 'bits-ui';

  let {
    id,
    value,
    onChange = () => {},
    options = [
      { value: 'foo', label: 'Foo' },
      { value: 'bar', label: 'Bar' }
    ],
    placeholder = 'Select one'
  }: SelectProps = $props();

  const selectedLabel = $derived(
    value ? options.find((o) => o.value === value)?.label : placeholder
  );
</script>

<Select.Root type="single" onValueChange={onChange} items={options} allowDeselect={true}>
  <Select.Trigger
    class={[
      'w-full min-w-0 rounded-md bg-input/20 dark:bg-input/30',
      'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
      'inline-flex touch-none items-center border border-input py-1.5 pr-1 pl-3 outline-none select-none'
    ]}
    aria-label={placeholder}
    {id}
  >
    {selectedLabel}
    <ChevronDownIcon size={20} class="my-0.5 ml-auto text-neutral-500" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content
      class="z-50 max-h-(--bits-select-content-available-height) w-(--bits-select-anchor-width) min-w-(--bits-select-anchor-width) rounded-md border border-neutral-350 bg-neutral-100 px-1 py-1 shadow outline-hidden select-none data-[side=bottom]:translate-y-0.5 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 dark:border-neutral-600 dark:bg-neutral-800"
      sideOffset={5}
    >
      <Select.Viewport class="max-h-72 p-1">
        {#each options as o, i (i + o.value)}
          <Select.Item
            class="flex h-10 w-full items-center gap-2 rounded-md px-2 py-2 text-sm outline-hidden select-none data-disabled:opacity-50 data-highlighted:bg-oval-green/30"
            value={o.value}
            label={o.label}
            disabled={o.disabled}
          >
            <div class="w-4">
              {#if value === o.value}
                <CheckIcon aria-label="check" class="size-4" />
              {/if}
            </div>
            {o.label}
          </Select.Item>
        {/each}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
