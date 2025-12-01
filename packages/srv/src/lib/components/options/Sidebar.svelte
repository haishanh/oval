<script lang="ts">
  import { InfoIcon, KeyRoundIcon, Settings2Icon } from '@lucide/svelte';

  const items = [
    { Icon0: Settings2Icon, text: 'General' },
    { Icon0: KeyRoundIcon, text: 'Provider' },
    { Icon0: InfoIcon, text: 'About' }
  ];

  type Props = {
    onclickitem?: (key: string) => void;
    active: string;
  };

  let { onclickitem = () => {}, active }: Props = $props();
</script>

<ul class="border-r border-r-bo-sidebar pr-5">
  {#each items as { text, Icon0 } (text)}
    <li class={['my-1 ', {}]}>
      <button
        onclick={() => onclickitem(text)}
        class={[
          'flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5',
          {
            'bg-oval-green/30 text-oval-green': active === text
          }
        ]}><Icon0 size={16} /><span>{text}</span></button
      >
    </li>
  {/each}
</ul>
