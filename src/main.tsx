import { StrictMode, useCallback, useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { mockAiring, mockSeasonal } from './mocks';
import type { ActiveFilters, Anime, FilterKey } from './types/types';
import type { JikanAnimeRaw } from './types/jikan-raw-type';
import type { Season, Format, Status } from './types/filter-options';

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
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [searchResults, setSearchResults] = useState<Anime[] | null>(null);
  const [trending, setTrending] = useState<Anime[] | null>(null);
  const [seasonal, setSeasonal] = useState<Anime[] | null>(null);

  function normalizeAnimeData(anime: JikanAnimeRaw): Anime {
    return {
      mal_id: anime.mal_id,
      titleEnglish: anime.title,
      titleJp: anime.title_japanese,
      image: anime.images.jpg.image_url,
      score: anime.score ?? null,
      episodes: anime.episodes ?? null,
      year: anime.year ?? null,
      season: anime.season ?? null,
      format: anime.type,
      status: anime.status,
      genres: anime.genres.map((g: JikanAnimeRaw['genres'][0]) => g.name),
      studios: anime.studios.map((s: JikanAnimeRaw['studios'][0]) => s.name),
    };
  }

  const yearsMatch = (yearOptions: string[], animeYear: number) => {
    if (yearOptions) {
      return yearOptions.some((yearOption) => {
        if (yearOption === '2000s' && animeYear >= 2000 && animeYear <= 2009) {
          return true;
        } else if (yearOption === '2010s' && animeYear >= 2010 && animeYear <= 2019) {
          return true;
        } else if (yearOption === '2020s' && animeYear >= 2020 && animeYear <= 2029) {
          return true;
        }
      })
    } else {
      return null;
    }
  }

  const doesMatchFilter = useCallback((anime: Anime): boolean => {
    const activeSeasonFilterLowerCase = activeFilters.Season?.map(s => s.toLowerCase() as Season) ?? null;

    if (!activeFilters.Genre && !activeFilters.Year && !activeFilters.Season && !activeFilters.Format && !activeFilters.Status) {
      return true;
    } 
    if (activeFilters.Genre && !activeFilters.Genre.some(g => anime.genres.includes(g))) {
      return false;
    }
    if (activeFilters.Year && anime.year && !yearsMatch(activeFilters.Year, anime.year)) {
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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchSeasonal = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/seasons/now?limit=${limit}`);
        const data = await response.json();
        const normalizedAnimeData: Anime[] = data.data.map((anime: JikanAnimeRaw) => {
          return normalizeAnimeData(anime);
        });
        setSeasonal(normalizedAnimeData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSeasonal();
  }, []);

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
        /* TODO */
        setLoading(true);
        setError(null);
        setSubmitted(query);
        const fetchSearchResults = async () => {
          try {
            const response = await fetch(`${BASE_URL}/anime?q=${query}&limit=24&order_by=score&sort=desc`);
            const data = await response.json();
            const normalizedAnimeData: Anime[] = data.data.map((anime: JikanAnimeRaw) => {
              return normalizeAnimeData(anime);
            });
            const sortedAnimeData: Anime[] = normalizedAnimeData.sort((a, b) => {
              const aTitle = a.titleEnglish.toLowerCase();
              const bTitle = b.titleEnglish.toLowerCase();
              const queryLower = query.toLowerCase();
              const aMatch = aTitle.includes(queryLower);
              const bMatch = bTitle.includes(queryLower);
              if (aMatch && !bMatch) return -1;
              if (!aMatch && bMatch) return 1;
              return 0;
            });
            setSearchResults(sortedAnimeData);
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError('An unknown error occurred');
            }
          } finally {
            setLoading(false);
          }
        }
        fetchSearchResults();
      }
      }
      onClearSearch={() => {
        setQuery('');
        setSubmitted('');
        setSearchResults(null);
      }}
      onRetry={() => {
        /* TODO */
      }}
      onOpenFilter={(key: FilterKey | null) => {
        setOpenFilter(key);
      }}
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