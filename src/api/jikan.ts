import type { Anime } from '../types/types';
import type { AnimeDetail, CharacterEntry } from '../types/anime-detail';
import type { JikanAnimeRaw } from '../types/jikan-raw-type';
import type { AnimeListParams } from './types';

const BASE_URL = 'https://api.jikan.moe/v4';

export const JIKAN_UNREACHABLE_MESSAGE =
  "Jikan (MyAnimeList's API) is temporarily unreachable - please try again in a moment.";

async function fetchWithRetry(url: string, retries = 1, delayMs = 1000): Promise<Response> {
  const response = await fetch(url);
  if (response.status === 504 && retries > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return fetchWithRetry(url, retries - 1, delayMs);
  }
  return response;
}

async function parseJikanList<T>(response: Response): Promise<T[]> {
  const data = await response.json().catch(() => null);
  const body = data as { data?: unknown; message?: string; status?: number } | null;
  if (!response.ok || !Array.isArray(body?.data)) {
    if (response.status === 504 || body?.status === 504) {
      throw new Error(JIKAN_UNREACHABLE_MESSAGE);
    }
    throw new Error(body?.message ?? `Jikan request failed (status ${response.status})`);
  }
  return body.data as T[];
}

async function parseJikanObject<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  const body = data as { data?: unknown; message?: string; status?: number } | null;
  if (!response.ok || !body?.data) {
    if (response.status === 504 || body?.status === 504) {
      throw new Error(JIKAN_UNREACHABLE_MESSAGE);
    }
    throw new Error(body?.message ?? `Jikan request failed (status ${response.status})`);
  }
  return body.data as T;
}

function normalizeJikanAnime(anime: JikanAnimeRaw): Anime {
  return {
    mal_id: anime.mal_id,
    titleEnglish: anime.title_english ?? anime.title,
    titleJp: anime.title_japanese,
    image: anime.images.jpg.image_url,
    score: anime.score ?? null,
    episodes: anime.episodes ?? null,
    year: anime.year ?? null,
    season: anime.season ?? null,
    format: anime.type,
    status: anime.status,
    genres: (anime.genres ?? []).map((g) => g.name),
    studios: (anime.studios ?? []).map((s) => s.name),
  };
}

export async function jikanGetAnimeList(params: AnimeListParams): Promise<Anime[]> {
  let url: string;
  if (params.mode === 'trending') {
    url = `${BASE_URL}/top/anime?limit=${params.limit}`;
  } else if (params.mode === 'seasonal') {
    url = `${BASE_URL}/seasons/now?limit=${params.limit}`;
  } else {
    url = `${BASE_URL}/anime?q=${encodeURIComponent(params.query)}&limit=24&order_by=score&sort=desc`;
  }

  const response = await fetchWithRetry(url);
  const rawData = await parseJikanList<JikanAnimeRaw>(response);
  const mapped = rawData.map(normalizeJikanAnime);

  if (params.mode === 'search') {
    const queryLower = params.query.toLowerCase();
    return mapped.sort((a, b) => {
      const aMatch = a.titleEnglish.toLowerCase().includes(queryLower);
      const bMatch = b.titleEnglish.toLowerCase().includes(queryLower);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }
  return mapped;
}

export async function jikanGetAnimeById(id: number): Promise<AnimeDetail> {
  const response = await fetchWithRetry(`${BASE_URL}/anime/${id}`);
  return parseJikanObject<AnimeDetail>(response);
}

export async function jikanGetCharacters(id: number): Promise<CharacterEntry[]> {
  const response = await fetchWithRetry(`${BASE_URL}/anime/${id}/characters`);
  return parseJikanList<CharacterEntry>(response);
}
