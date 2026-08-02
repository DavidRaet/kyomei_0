export type AnimeListParams =
  | { mode: 'trending'; limit: number }
  | { mode: 'seasonal'; limit: number }
  | { mode: 'search'; query: string };
