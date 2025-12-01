const BACKTICK = '`';

export function extractMarkdownCodeBlockContent(input: string) {
  const len = input.length;
  let i = 0;
  let s = 0;
  let e = len;
  while (i < len) {
    const char = input[i];
    if (char === BACKTICK && input[i + 1] === BACKTICK && input[i + 2] === BACKTICK) {
      let j = i + 3;
      while (j < len && input[j] !== '\n') {
        j++;
      }
      s = j + 1;
      break;
    }
    i++;
  }

  i = len - 1;
  while (i >= s) {
    const char = input[i];
    if (char === BACKTICK && input[i - 1] === BACKTICK && input[i - 2] === BACKTICK) {
      // skip "```" and the line feed a head
      e = i - 3;
      break;
    }
    i--;
  }

  return input.substring(s, e);
}

// function isWhiteSpace(char: string) {
//   return (
//     char === '\n' ||
//     char === '\r' ||
//     char === ' ' ||
//     char === '\t' ||
//     char === '\v' ||
//     char === '\f'
//   );
// }
