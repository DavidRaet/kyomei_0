export interface AnimeDetail {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: {
    jpg: { image_url: string; large_image_url: string };
    webp: { image_url: string; large_image_url: string };
  };
  score: number | null;
  episodes: number | null;
  synopsis: string | null;
  genres: { mal_id: number; name: string }[];
  trailer: {
    images?: { maximum_image_url?: string; large_image_url?: string };
  } | null;
  status: string;
  rating: string | null;
  type: string | null;
  duration: string | null;
  aired: { from: string | null; to: string | null } | null;
  season: string | null;
  year: number | null;
  studios: { mal_id: number; name: string }[];
}

export interface CharacterEntry {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: { image_url: string };
      webp?: { image_url: string };
    };
  };
  role: string;
  favorites: number;
  voice_actors: {
    language: string;
    person: {
      name: string;
      images: { jpg: { image_url: string } };
    };
  }[];
}
