// Watchlist store — localStorage-backed. This is the persistence layer for the
// watchlist feature: state/logic here is intentionally left as stubs for you to
// implement (see CLAUDE.md's scaffolding convention).

import { useState, useEffect } from 'react';
import type { Anime } from '../types/types';
import type { WatchlistEntry, WatchlistStatus } from '../types/watchlist';

export const WATCHLIST_STORAGE_KEY = 'kyomei.watchlist';

const readWatchlistFromStorage = (): WatchlistEntry[] => {
  const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
  if (!stored) return []; 
  try {
    const parsed = JSON.parse(stored) as WatchlistEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return []; 
  }
}

/**
 * Returns the current watchlist, kept in sync with localStorage.
 * TODO:
 * - useState to hold the list, initialized by reading WATCHLIST_STORAGE_KEY from localStorage
 * - useEffect that subscribes to a sync event (e.g. a custom "kyomei-watchlist" event
 *   dispatched by addToWatchlist/removeFromWatchlist, plus the native "storage" event
 *   for cross-tab updates) and re-reads localStorage when it fires
*/
export function useWatchlist(): WatchlistEntry[] {
  const [animeWatchlist, setAnimeWatchlist] = useState<WatchlistEntry[]>(readWatchlistFromStorage);

  const syncFromStorage = () => {
    setAnimeWatchlist(readWatchlistFromStorage());
  }

  useEffect(() => {
    window.addEventListener('kyomei-watchlist', syncFromStorage);
    window.addEventListener('storage', syncFromStorage);

    return () => {
      window.removeEventListener('kyomei-watchlist', syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    }
  }, [])
  return animeWatchlist;
}

/**
 * Adds an anime to the watchlist (or updates its status if already present).
 *
 * TODO:
 * - read the current list from localStorage
 * - dedupe by mal_id (replace existing entry rather than adding a second one)
 * - write the updated list back to localStorage
 * - notify other useWatchlist() instances (e.g. dispatch the sync event)
 */
export function addToWatchlist(anime: Anime, status: WatchlistStatus = 'watching'): void {
  // TODO: implement
  const currentAnimeWatchlist = readWatchlistFromStorage();
  const updatedAnimeWatchlist = currentAnimeWatchlist.filter(entry => entry.mal_id !== anime.mal_id);
  updatedAnimeWatchlist.push({
    ...anime, 
    addedAt: Date.now(),
    status
  });
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updatedAnimeWatchlist));
  window.dispatchEvent(new Event('kyomei-watchlist'));
  }


/**
 * Removes an anime from the watchlist by mal_id.
 *
 * TODO:
 * - read the current list from localStorage
 * - filter out the matching mal_id
 * - write the updated list back to localStorage
 * - notify other useWatchlist() instances
 */
export function removeFromWatchlist(mal_id: number): void {
  // TODO: implement
    const currentAnimeWatchlist = readWatchlistFromStorage();
    const updatedAnimeWatchlist = currentAnimeWatchlist.filter(entry => entry.mal_id !== mal_id);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updatedAnimeWatchlist));
    window.dispatchEvent(new Event('kyomei-watchlist'));
}
