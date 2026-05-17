import { mount } from 'svelte';
import App from './Options.svelte';
import './style.css';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
