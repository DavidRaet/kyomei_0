import type { Anime } from './types';

export interface AnimeDetail extends Anime {
  titleRomaji?: string;
  synopsis: string | null;
  durationMinutes: number | null;
  airedFrom: string | null;
  airedTo: string | null;
  trailerImage: string | null;
}

export interface CharacterEntry {
  mal_id: number;
  name: string;
  image: string;
  role: string;
  favorites: number;
  voiceActors: { language: string; name: string; image: string }[];
}
