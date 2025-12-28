import { GrokService } from './grok.service';
import { GeminiService } from './index.service';

export class SummaryService {
  constructor(private readonly llm: GeminiService | GrokService) {}

  summarize(
    input: { content: string; title: string },
    /**
     * can be 'English', 'Simplified Chinese', 'zh-CN', 'ja-JP'
     */
    lang = 'English'
  ) {
    const { content, title } = input;
    const instruction = [
      'As a concise and helpful summarizer, create a one-page summary containing the most important information from the webpage info provided below.',
      'WEBPAGE INFO:',
      `<title>${title}</title>`,
      `<<webpage>${content}</webpage>`
    ].join('\n');
    const user = [
      "The reader opened a webpage that's too long for them to read right now.",
      'Above, I pasted text from this website.',
      'You will:',
      '1. Read the webpage info provided above.',
      '2. Write bullet points providing the most important information and details that they most likely want to now about right now.',
      'For any given page, write at least three bullet points, but try to write more if you can.',
      'Write the summary from the point of view of the author of the webpage and capture the tone and perspective of the author.',
      'Your summary should be fact-filled and SPECIFIC, providing information like prices, review sentiment, dates, addresses, times, instructions, ingredients, top news stories, amounts, timelines, characters, answers, features, comparisons, shipping times.',
      "Admit when you're unsure or don't know how to summarize, and never make a statement without providing a fact or instance to back it up.",
      'Do NOT repeat text or concepts in your summary.',
      'If the webpage is for a recipe, first describe the style and type of dish this is and then provide exact steps for the preparation and cooking instructions. List all ingredients including exact measurements and amounts. Also note number of servings and cooking or preparation times.',
      "If the page is for a restaurant, write a brief description of why it is notable, write a list of what's on the menu and provide opening times, addresses, and contact details.",
      'Provide the summary only in JSON format, according to the `Response` schema below.',
      '```',
      'interface Response {',
      "    details: Detail[] // Ideally 4-7, but no less than three key points, opinions, solutions, items, instructions, or insights. Don't summarize what's already covered by the webpage title.",
      '}',
      'interface Detail {',
      '    label: string // e.g. "Price", "Category", "Story", "Solution 1", "Highlights", "Criticism", "Instructions", "Ingredients", "Available Sizes", "Menu", "Open times"',
      '    icon: string // Relevant Lucide React component name, e.g. "Calendar", "DollarSign"',
      '    info: string // A concise 1-2 sentence summary',
      '}',
      '```',
      `Write the summary (but not JSON keys) in ${lang}.`
    ].join('\n');
    const llm = this.llm;
    return {
      async *[Symbol.asyncIterator]() {
        if (llm instanceof GeminiService) {
          const reqBody = GeminiService.buildGenerateContentRequestBody(user, instruction);
          const res = await llm.streamGenerateContent(reqBody, 'gemini-2.5-flash-preview-09-2025');
          const aig = GeminiService.createAsyncIterableTextStreamFromResponse(res);
          for await (const text of aig) {
            yield text;
          }
        } else if (llm instanceof GrokService) {
          const messages = [
            { role: 'system', content: instruction },
            { role: 'user', content: user }
          ];
          const res = await llm.complete(messages, 'grok-4-1-fast-non-reasoning');
          const aig = GrokService.createAsyncIterableTextStreamFromResponse(res);
          for await (const text of aig) {
            yield text;
          }
        }
      }
    };
  }
}
