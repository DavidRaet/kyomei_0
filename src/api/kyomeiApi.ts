import type { Anime } from '../types/types';
import type { AnimeDetail, CharacterEntry } from '../types/anime-detail';

const REQUEST_TIMEOUT_MS = 6000;
const SEARCH_LIMIT = 24; // keeps the client search result set manageable
const API_BASE_PATH = '/api';

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

interface AnimeDetailRaw extends AnimeSummaryRaw {
  titleRomaji?: string;
  synopsis: string | null;
  durationMinutes: number | null;
  airedFrom: string | null;
  airedTo: string | null;
  trailerImage: string | null;
}

interface VoiceActorRaw {
  language: string;
  name: string;
  image: string;
}

interface CharacterSummaryRaw {
  malId: number;
  name: string;
  image: string;
  role: string;
  favorites: number;
  voiceActors: VoiceActorRaw[];
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

function mapDetailRawToAnimeDetail(raw: AnimeDetailRaw): AnimeDetail {
  return {
    ...mapSummaryToAnime(raw),
    titleRomaji: raw.titleRomaji,
    synopsis: raw.synopsis,
    durationMinutes: raw.durationMinutes,
    airedFrom: raw.airedFrom,
    airedTo: raw.airedTo,
    trailerImage: raw.trailerImage,
  };
}

function mapCharacterRawToEntry(raw: CharacterSummaryRaw): CharacterEntry {
  return {
    mal_id: raw.malId,
    name: raw.name,
    image: raw.image,
    role: raw.role,
    favorites: raw.favorites,
    voiceActors: raw.voiceActors,
  };
}

async function kyomeiApiFetch<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_PATH}${path}`, { signal: controller.signal });
    } catch {
      if (controller.signal.aborted) {
        throw new Error('Kyomei API request timed out. Please try again.');
      }
      throw new Error('Could not reach the Kyomei API. Check your connection and try again.');
    }

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const message = body?.error?.message ?? 'The Kyomei API returned an unexpected error.';
      throw new Error(`Kyomei API request failed (status ${response.status}): ${message}`);
    }
    if (!body) {
      throw new Error(`Kyomei API returned an invalid response (status ${response.status}).`);
    }
    return body as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function kyomeiApiFetchList(path: string): Promise<Anime[]> {
  const body = await kyomeiApiFetch<{ data: AnimeSummaryRaw[] }>(path);
  return body.data.map(mapSummaryToAnime);
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

export async function kyomeiApiGetAnimeById(malId: number): Promise<AnimeDetail> {
  const raw = await kyomeiApiFetch<AnimeDetailRaw>(`/v1/anime/${malId}`);
  return mapDetailRawToAnimeDetail(raw);
}

export async function kyomeiApiGetCharacters(malId: number): Promise<CharacterEntry[]> {
  const body = await kyomeiApiFetch<{ data: CharacterSummaryRaw[] }>(`/v1/anime/${malId}/characters`);
  return body.data.map(mapCharacterRawToEntry);
}
