<script>
  import Stage from '$lib/components/Stage.svelte';
  import { summa, isLoading, summarizeError } from '$lib/components/summa.svelte';
  import { GeminiService } from '$lib/shared/gemini.service';
  import { onMount } from 'svelte';

  const imgSrc =
    'https://cdn.prod.website-files.com/65217fd9e31608b8b68141ba/653fe4735564be7de6ddfea8_6536e7fdf4c2c7c1471c11e5_64f8b11b97cdc0dfa55475eb_article%25252015-p-1600.png';

  const gemini = new GeminiService({ apiKey: 'placeholder', baseUrl: '/api/mock' });

  const SIMULATE_ERROR = false;

  async function fetchSummary() {
    const res = await gemini.streamGenerateContent('xx', 'gemini-2.5-flash-preview-09-2025');

    isLoading.value = false;

    if (SIMULATE_ERROR) {
      summarizeError.current = 'Something went wrong';
    } else {
      const aig = GeminiService.createAsyncIterableStreamFromGeminiResponse(res);
      for await (const x of aig) {
        const text = x.candidates?.[0]?.content?.parts[0]?.text;
        summa.text = summa.text + text;
      }
    }
  }

  const title =
    'lorem ipsum dolor sit amet consectetur adipiscing elit lorem ipsum dolor sit amet consectetur adipiscing elit';

  onMount(() => {
    fetchSummary();
  });
</script>

<Stage {imgSrc} {title} />
