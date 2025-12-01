<script>
  /** eslint-disable svelte/no-navigation-without-resolve */
  import { resolve } from '$app/paths';
</script>

<ul class="mx-auto max-w-lg py-4">
  <li><a href={resolve('/play/content')}>Content</a></li>
  <li><a href={resolve('/play/popup')}>Popup</a></li>
  <li><a href={resolve('/play/options')}>Options</a></li>
</ul>
