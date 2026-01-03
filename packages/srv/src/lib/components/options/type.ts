import type { TProvider } from './schema';

export type TOptionsHandlers = {
  onDeleteProvider: (key: string) => void;
  onAddProvider: (p: TProvider) => void;
  onEditProvider: (p: TProvider) => void;
  onSelectActiveProvider: (key: string) => void;
  onKvChange: (key: string, value: string) => void;
};
