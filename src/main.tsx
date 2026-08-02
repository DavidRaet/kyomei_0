import { StrictMode, useCallback, useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { AnimeDetailPage } from './components/AnimeDetailPage';
import { WatchlistPage } from './components/WatchlistPage';
import './index.css';
import App from './App';
import { mockAiring, mockSeasonal } from './mocks';
import type { ActiveFilters, Anime, FilterKey } from './types/types';
import type { Season, Format, Status } from './types/filter-options';
import { matchesDecadeYear } from './utils/yearMatch';
import { getAnimeList } from './api/animeProvider';

const router = createBrowserRouter([
  { path: '/',          element: <Root /> },
  { path: '/anime/:id', element: <AnimeDetailPage /> },
  { path: '/watchlist', element: <WatchlistPage /> }
]);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

export default function Root() {
  const navigate = useNavigate();
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
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [searchResults, setSearchResults] = useState<Anime[] | null>(null);
  const [trending, setTrending] = useState<Anime[] | null>(null);
  const [seasonal, setSeasonal] = useState<Anime[] | null>(null);

  const doesMatchFilter = useCallback((anime: Anime): boolean => {
    const activeSeasonFilterLowerCase = activeFilters.Season?.map(s => s.toLowerCase() as Season) ?? null;

    if (!activeFilters.Genre && !activeFilters.Year && !activeFilters.Season && !activeFilters.Format && !activeFilters.Status) {
      return true;
    }
    if (activeFilters.Genre && !activeFilters.Genre.some(g => anime.genres.includes(g))) {
      return false;
    }
    if (activeFilters.Year && anime.year && !matchesDecadeYear(activeFilters.Year, anime.year)) {
      return false;
    }
    if (activeSeasonFilterLowerCase && anime.season && !activeSeasonFilterLowerCase.includes(anime.season.toLowerCase() as Season)) {
      return false;
    }
    if (activeFilters.Format && anime.format && !activeFilters.Format.includes(anime.format as Format)) {
      return false;
    }
    if (activeFilters.Status && anime.status && !activeFilters.Status.includes(anime.status as Status)) {
      return false;
    }
    return true;
  }, [activeFilters]);

  const filteredSearchResults = useMemo(() => {
    if (!searchResults) return null;
    return searchResults.filter(doesMatchFilter);
  }, [searchResults, doesMatchFilter]);

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    try {
      setTrending(await getAnimeList({ mode: 'trending', limit }));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSeasonal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSeasonal(await getAnimeList({ mode: 'seasonal', limit }));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSearchResults = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      setSearchResults(await getAnimeList({ mode: 'search', query: searchQuery }));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    fetchTrending();
  }, [fetchTrending]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    fetchSeasonal();
  }, [fetchSeasonal]);

  return (
    <App
      trending={trending ? trending : mockAiring}
      seasonal={seasonal ? seasonal : mockSeasonal}
      searchResults={filteredSearchResults}
      loading={loading}
      error={error}
      query={query}
      submitted={submitted}
      activeFilters={activeFilters}
      openFilter={openFilter}
      onQueryChange={(value: string) => {
        setQuery(value);
      }}
      onSubmit={() => {
        setSubmitted(query);
        fetchSearchResults(query);
      }}
      onClearSearch={() => {
        setQuery('');
        setSubmitted('');
        setSearchResults(null);
      }}
      onRetryTrending={() => {
        fetchTrending();
      }}
      onRetrySeasonal={() => {
        fetchSeasonal();
      }}
      onRetrySearch={() => {
        fetchSearchResults(submitted);
      }}
      onOpenFilter={(key: FilterKey | null) => {
        setOpenFilter(key);
      }}
      onNavigate={(id: number) => navigate(`/anime/${id}`)}
      onFilterToggle={(key: FilterKey, option: string) => {
        if (!activeFilters[key]) {
          setActiveFilters(prev => ({ ...prev, [key]: [option] }));
        } else if ((activeFilters[key] as string[]).includes(option)) {
          const removed = activeFilters[key]!.filter(opt => opt !== option);
          setActiveFilters(prev => ({ ...prev, [key]: removed.length > 0 ? removed : null }));
        } else {
          const existingFilters = activeFilters[key];
          setActiveFilters(prev => ({ ...prev, [key]: [...existingFilters, option] }));
        }
      }}
    />
  );
}
