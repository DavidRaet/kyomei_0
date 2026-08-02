import type { Anime } from '../types/types';
import type { AnimeDetail, CharacterEntry } from '../types/anime-detail';
import type { AnimeListParams } from './types';
import { withCache } from './cache';
import { anilistGetAnimeList, anilistGetAnimeById } from './anilist';
import { jikanGetAnimeList, jikanGetAnimeById, jikanGetCharacters } from './jikan';

export type { AnimeListParams } from './types';

const TTL_MS = {
  trending: 15 * 60 * 1000,
  seasonal: 60 * 60 * 1000,
  search: 2 * 60 * 1000,
  detail: 30 * 60 * 1000,
} as const;

function logSource(op: string, source: 'anilist' | 'jikan-fallback'): void {
  if (import.meta.env.DEV) {
    console.info(`[animeProvider] ${op} served by ${source}`);
  }
}

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
    async () => {
      try {
        const result = await anilistGetAnimeList(params);
        logSource(`getAnimeList(${params.mode})`, 'anilist');
        return result;
      } catch {
        logSource(`getAnimeList(${params.mode})`, 'jikan-fallback');
        return jikanGetAnimeList(params);
      }
    },
    { persist }
  );
}

export async function getAnimeById(id: number): Promise<AnimeDetail> {
  return withCache(`detail:${id}`, TTL_MS.detail, async () => {
    try {
      const { detail } = await anilistGetAnimeById(id);
      logSource(`getAnimeById(${id})`, 'anilist');
      return detail;
    } catch {
      logSource(`getAnimeById(${id})`, 'jikan-fallback');
      return jikanGetAnimeById(id);
    }
  });
}

export async function getCharacters(id: number): Promise<CharacterEntry[]> {
  return withCache(`characters:${id}`, TTL_MS.detail, async () => {
    try {
      const { characters } = await anilistGetAnimeById(id);
      logSource(`getCharacters(${id})`, 'anilist');
      return characters;
    } catch {
      logSource(`getCharacters(${id})`, 'jikan-fallback');
      return jikanGetCharacters(id);
    }
  });
}
