<script lang="ts">
  import { parse as parsePartialJson } from 'partial-json';

  import Summary from './Summary.svelte';
  import { extractMarkdownCodeBlockContent } from '$lib/shared/string.util';
  import { summa, isLoading } from './summa.svelte';
  import { XIcon } from '@lucide/svelte';
  import OvalScrollArea from './base/OvalScrollArea.svelte';

  function parseJson(input: string) {
    try {
      return parsePartialJson(input);
    } catch (err) {
      void err;
      return {};
    }
  }

  type Props = {
    onClickClose?: () => void;
    imgSrc?: string;
    title?: string;
    border?: boolean;
    animate?: boolean;
  };

  let {
    onClickClose,
    imgSrc = 'https://unsplash.it/1200/919?image=519',
    title = '',
    border = false,
    animate = false
  }: Props = $props();
</script>

<div class="fixed inset-0 z-2147483647 bg-white/20 backdrop-blur-lg">
  <div class="a1 absolute inset-0"></div>
  <div
    class={[
      'g1 absolute h-350 w-350 rounded-full',
      isLoading.value || animate ? 'animate-spin3' : ''
    ]}
  ></div>
  <div
    class={[
      'g2 absolute h-400 w-400 rounded-full',
      isLoading.value || animate ? 'animate-spin3' : ''
    ]}
  ></div>
  <div
    class={[
      'absolute inset-0 bg-black/50 backdrop-blur-[140px] transition delay-50 duration-500',
      isLoading.value || animate ? 'bg-black/10' : 'bg-black/70'
    ]}
  ></div>

  <OvalScrollArea
    orientation="vertical"
    type="scroll"
    class="absolute! inset-0"
    viewportClasses="h-full"
  >
    <div class="fixed top-5 right-6 text-neutral-300">
      <button
        onclick={() => onClickClose?.()}
        class="cursor-pointer rounded-full p-2 hover:bg-neutral-400 active:scale-95 active:bg-neutral-500"
        ><XIcon size={18} />
      </button>
    </div>

    <div class="flex justify-center pt-14 pb-8">
      <div
        class={[
          'h-auto w-md overflow-hidden drop-shadow-xl/50 transition-transform',
          { 'scale-75': isLoading.value || animate },
          { 'animate-wiggle': isLoading.value || animate },
          { 'border border-amber-500': border }
        ]}
      >
        {#if title}
          <h3 class="mx-auto mb-2 max-w-10/12 truncate text-center text-neutral-300">
            {title}
          </h3>
        {/if}
        <img class="block h-auto max-w-full rounded-t-2xl" src={imgSrc} alt="Screenshot" />
      </div>
    </div>
    <div class="relative">
      <div class="mx-auto max-w-xl px-3 pb-6 text-neutral-300">
        {#if isLoading.value}
          <p class="text-center text-lg text-neutral-100/60">Summarizing for you...</p>
        {:else if summa.text.length > 0}
          {@const json = extractMarkdownCodeBlockContent(summa.text as unknown as string)}
          {@const summary = parseJson(json)}
          <Summary {summary} />
        {/if}
      </div>
    </div>
  </OvalScrollArea>
</div>
