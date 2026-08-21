import type { Anime } from '../types/types';

const REQUEST_TIMEOUT_MS = 6000;
const SEARCH_LIMIT = 24; // matches the search limit anilist.ts/jikan.ts already use

function baseUrl(): string {
  return import.meta.env.VITE_KYOMEI_API_BASE_URL ?? 'http://localhost:8000';
}

export function isKyomeiApiEnabled(): boolean {
  return import.meta.env.VITE_USE_KYOMEI_API === 'true';
}

interface AnimeSummaryRaw {
  malId: number;
  titleEnglish: string;
  titleJp?: string | null;
  image: string;
  score: number | null;
  episodes: number | null;
  year: number | null;
  season: string | null;
  status: string;
  format: string;
  genres: string[];
  studios: string[];
}

function mapSummaryToAnime(s: AnimeSummaryRaw): Anime {
  return {
    mal_id: s.malId,
    titleEnglish: s.titleEnglish,
    titleJp: s.titleJp ?? undefined,
    image: s.image,
    score: s.score,
    episodes: s.episodes,
    year: s.year,
    season: s.season,
    status: s.status,
    format: s.format,
    genres: s.genres,
    studios: s.studios,
  };
}

async function kyomeiApiFetchList(path: string): Promise<Anime[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl()}${path}`, { signal: controller.signal });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body) {
      const message = body?.error?.message ?? `kyomei_api request failed (status ${response.status})`;
      throw new Error(message);
    }
    return (body.data as AnimeSummaryRaw[]).map(mapSummaryToAnime);
  } finally {
    clearTimeout(timeout);
  }
}

export function kyomeiApiSearchAnime(query: string): Promise<Anime[]> {
  return kyomeiApiFetchList(`/v1/anime/search?q=${encodeURIComponent(query)}&limit=${SEARCH_LIMIT}`);
}

export function kyomeiApiGetTrending(limit: number): Promise<Anime[]> {
  return kyomeiApiFetchList(`/v1/anime/trending?limit=${limit}`);
}

export function kyomeiApiGetSeasonal(limit: number): Promise<Anime[]> {
  return kyomeiApiFetchList(`/v1/anime/seasonal?limit=${limit}`);
}
