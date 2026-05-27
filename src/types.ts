export interface Anime {
  mal_id: number;
  title: string;
  titleJp?: string;
  image: string;
  score: number | null;
  episodes: number | null;
  type: string;
  year: number | null;
  season: string | null;
  status: string;
  genres: string[];
  studios: string[];
}

export type CardVariant = 'poster' | 'editorial' | 'minimal';

export type FilterKey = 'Genre' | 'Year' | 'Season' | 'Format' | 'Status';

export type ActiveFilters = Record<FilterKey, string | null>;
