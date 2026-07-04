// Types for the watchlist feature. Reuses `Anime` (the app's canonical normalized
// anime shape) rather than re-deriving `AnimeResult` from the PRD text.

import type { Anime } from './types';

export type WatchlistStatus = 'watching' | 'completed' | 'planning';

export interface WatchlistEntry extends Anime {
  status: WatchlistStatus;
  addedAt: number;
}
