import { describe, expect, it } from 'vitest';

import { extractMarkdownCodeBlockContent } from './string.util';

describe('extractMarkdownCodeBlockContent', () => {
  it('extracts content from a fenced code block with a language tag', () => {
    const input = ['```json', '{', '  "name": "oval"', '}', '```'].join('\n');

    expect(extractMarkdownCodeBlockContent(input)).toBe('{\n  "name": "oval"\n}');
  });

  it('extracts content from a fenced code block without a language tag', () => {
    const input = ['```', 'const answer = 42;', '```'].join('\n');

    expect(extractMarkdownCodeBlockContent(input)).toBe('const answer = 42;');
  });

  it('returns the original string when no fenced code block is present', () => {
    const input = 'plain text';

    expect(extractMarkdownCodeBlockContent(input)).toBe(input);
  });

  it('returns valid JSON input unchanged when it is not wrapped in a code block', () => {
    const input = '{\n  "name": "oval",\n  "enabled": true\n}';

    expect(extractMarkdownCodeBlockContent(input)).toBe(input);
  });
});
