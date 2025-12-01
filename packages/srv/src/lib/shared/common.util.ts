export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let id = 1;
export function makeId() {
  return id++;
}
