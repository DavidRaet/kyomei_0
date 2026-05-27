// This file contains the type definitions for the Anime data and related types used in the application.

// The Anime interface represents the normalized structure of anime data used in the application.
export interface Anime {
  mal_id: number;
  titleEnglish: string;
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

// The CardVariant type defines the possible variants for displaying anime cards in the UI.
export type CardVariant = 'poster' | 'editorial' | 'minimal';

// The FilterKey type defines the keys for filtering anime data based on specific criteria.
export type FilterKey = 'Genre' | 'Year' | 'Season' | 'Format' | 'Status';

// The ActiveFilters type represents the currently active filters applied to the anime search results.
export type ActiveFilters = Record<FilterKey, string | null>;

// The raw Jikan API response (boundary type)
export interface JikanAnimeRaw {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
    images: {
      image_url: string | null;
      small_image_url: string | null;
      maximum_image_url: string | null;
    };
  };
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english: string | null;
  title_japanese: string;
  title_synonyms: string[];
  type: "TV" | "Movie" | "OVA" | "Special" | "ONA" | "Music";
  source: string | null;
  episodes: number | null;
  status: "Finished Airing" | "Currently Airing" | "Not yet aired";
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: { day: number | null; month: number | null; year: number | null };
      to: { day: number | null; month: number | null; year: number | null };
    };
    string: string;
  };
  duration: string;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: "winter" | "spring" | "summer" | "fall" | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  licensors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}
