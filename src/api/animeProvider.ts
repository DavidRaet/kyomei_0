import type { Anime } from '../types/types';
import type { AnimeDetail, CharacterEntry } from '../types/anime-detail';
import type { AnimeListParams } from './types';
import { withCache } from './cache';
import {
  kyomeiApiSearchAnime,
  kyomeiApiGetTrending,
  kyomeiApiGetSeasonal,
  kyomeiApiGetAnimeById,
  kyomeiApiGetCharacters,
} from './kyomeiApi';

export type { AnimeListParams } from './types';

const TTL_MS = {
  trending: 15 * 60 * 1000,
  seasonal: 60 * 60 * 1000,
  search: 2 * 60 * 1000,
  detail: 30 * 60 * 1000,
} as const;

function cacheKeyForList(params: AnimeListParams): string {
  if (params.mode === 'search') return `list:search:${params.query.trim().toLowerCase()}`;
  return `list:${params.mode}:${params.limit}`;
}

export async function getAnimeList(params: AnimeListParams): Promise<Anime[]> {
  const key = cacheKeyForList(params);
  const ttl = TTL_MS[params.mode];
  const persist = params.mode !== 'search';

  return withCache(
    key,
    ttl,
    () => {
      if (params.mode === 'search') return kyomeiApiSearchAnime(params.query);
      if (params.mode === 'trending') return kyomeiApiGetTrending(params.limit);
      return kyomeiApiGetSeasonal(params.limit);
    },
    { persist }
  );
}

export async function getAnimeById(id: number): Promise<AnimeDetail> {
  return withCache(`detail:${id}`, TTL_MS.detail, () => kyomeiApiGetAnimeById(id));
}

export async function getCharacters(id: number): Promise<CharacterEntry[]> {
  return withCache(`characters:${id}`, TTL_MS.detail, () => kyomeiApiGetCharacters(id));
}
