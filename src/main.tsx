import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { mockAiring, mockSeasonal } from './mocks';
import { useState, useEffect } from 'react';
import type { ActiveFilters, Anime, JikanAnimeRaw } from './types';
// TODO: wire to Jikan v4 (https://docs.api.jikan.moe/). Replace the mock props
// below with real state + fetches. Sketch:
//   - useState for: query, submitted, trending, seasonal, searchResults,
//                   loading, error, activeFilters.
//   - useEffect on mount:
//       GET /top/anime?filter=airing&limit=12   -> setTrending
//       GET /seasons/now?limit=12               -> setSeasonal
//   - onSubmit: GET /anime?q=<query>&limit=24&order_by=score&sort=desc
//   - Normalize raw Jikan responses into the `Anime` shape (see src/types.ts).
//   - Dedupe by id; stagger calls (~400 ms) to respect Jikan's ~3 req/sec limit.
//
// To preview the Results section without wiring fetch, swap the props below:
//   searchResults={mockSearchResults} submitted="frieren"
// To preview loading / empty / error:
//   loading={true} submitted="frieren"
//   searchResults={[]} submitted="zzz"
//   error="Network unreachable" submitted="x"
// RESTAPI Link: https://api.jikan.moe/v4/

// State needed
// error, loading, success?, query, activeFilters, searchResults, trending, seasonal
// the types:
// error

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Root />
  </StrictMode>
);


export default function Root() {
  const BASE_URL = 'https://api.jikan.moe/v4';
  const limit = 12;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [submitted, setSubmitted] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    Genre: null,
    Year: null,
    Season: null,
    Format: null,
    Status: null,
  });
  const [searchResults, setSearchResults] = useState<Anime[] | null>(null);
  const [trending, setTrending] = useState<Anime[] | null>(null);
  // const [seasonal, setSeasonal] = useState<Anime[] | null>(null);

  function normalizeAnimeData(anime: JikanAnimeRaw): Anime {
    return {
      mal_id: anime.mal_id,
      titleEnglish: anime.title,
      titleJp: anime.title_japanese,
      image: anime.images.jpg.image_url,
      score: anime.score ?? null,
      episodes: anime.episodes ?? null,
      type: anime.type,
      year: anime.year ?? null,
      season: anime.season ?? null,
      status: anime.status,
      genres: anime.genres.map((g: JikanAnimeRaw['genres'][0]) => g.name),
      studios: anime.studios.map((s: JikanAnimeRaw['studios'][0]) => s.name),
    };
  }

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/top/anime?limit=${limit}`);
        const data = await response.json();
        const normalizedAnimeData = data.data.map((anime: JikanAnimeRaw) => {
          return normalizeAnimeData(anime);
        });
        setTrending(normalizedAnimeData);
      } catch (err) {
        err instanceof Error ? setError(err.message) : setError('An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);


  return (
    <App
      trending={trending ? trending : mockAiring}
      seasonal={mockSeasonal}
      searchResults={searchResults}
      loading={loading}
      error={error}
      query={query}
      submitted={submitted}
      activeFilters={activeFilters}
      onQueryChange={(value: string) => {
        setQuery(value);
      }}
      onSubmit={() => {
        /* TODO */
      }}
      onClearSearch={() => {
        setQuery('');
        setSubmitted('');
        setSearchResults(null);
      }}
      onRetry={() => {
        /* TODO */
      }}
      onFilterToggle={() => {
        /* TODO */
      }}
    />
  );
}
