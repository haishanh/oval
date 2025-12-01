export const log = {
  debug: (...args: any[]) => {
    if (!import.meta.env.DEV) return;
    console.log(...args);
  },
  info: (...args: any[]) => {
    console.log(...args);
  },
  error: (...args: any[]) => console.error(...args),
  warn: (...args: any[]) => console.warn(...args),
};
