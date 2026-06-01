
// This file contains the type definitions for the Anime data and related types used in the application.

import type {
  Genre, Year, Season, Format, Status
} from './filter-options';

// The Anime interface represents the normalized structure of anime data used in the application.
export interface Anime {
  mal_id: number;
  titleEnglish: string;
  titleJp?: string;
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

// The CardVariant type defines the possible variants for displaying anime cards in the UI.
export type CardVariant = 'poster' | 'editorial' | 'minimal';

// The FilterKey type defines the keys for filtering anime data based on specific criteria.
export type FilterKey = 'Genre' | 'Year' | 'Season' | 'Format' | 'Status';



// The ActiveFilters type represents the currently active filters applied to the anime search results.
export type ActiveFilters = {
  Genre: Genre[] | null;
  Year: Year[] | null;
  Season: Season[] | null;
  Format: Format[] | null;
  Status: Status[] | null;
};