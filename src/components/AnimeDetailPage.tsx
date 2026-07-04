import type { AnimeDetail, CharacterEntry } from '../types/anime-detail';
import type { Anime } from '../types/types';
import { ErrorState } from './ErrorState';
import { WatchlistCover } from './WatchlistCover';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// ── helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function cap(s: string | null | undefined): string | null {
  if (!s) return null;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function bannerOf(a: AnimeDetail): string | null {
  return a.trailer?.images?.maximum_image_url || a.trailer?.images?.large_image_url || null;
}

// ── sub-components ────────────────────────────────────────────────────────────

function MetaItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="d-meta-item">
      <div className="d-meta-label">{label}</div>
      <div className="d-meta-value">{value || '—'}</div>
    </div>
  );
}

function CharCard({ entry }: { entry: CharacterEntry }) {
  const ch = entry.character;
  const va =
    entry.voice_actors.find((v) => v.language === 'Japanese') || entry.voice_actors[0];
  const chImg = ch.images?.webp?.image_url || ch.images?.jpg?.image_url;
  const vaImg = va?.person.images.jpg.image_url ?? '';

  return (
    <div className="d-char">
      <div className="d-char-side left">
        <div className="d-char-thumb">
          {chImg && <img src={chImg} alt={ch.name} loading="lazy" />}
        </div>
        <div className="d-char-text">
          <div className="d-char-name">{ch.name}</div>
          <div className="d-char-role">{entry.role}</div>
        </div>
      </div>
      {va && (
        <div className="d-char-side right">
          <div className="d-char-text r">
            <div className="d-char-name">{va.person.name}</div>
            <div className="d-char-role">{va.language}</div>
          </div>
          <div className="d-char-thumb">
            {vaImg && <img src={vaImg} alt={va.person.name} loading="lazy" />}
          </div>
        </div>
      )}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="detail">
      <div className="d-banner skeleton" />
      <div className="d-head">
        <div className="skeleton" style={{ width: 220, aspectRatio: '2/3', borderRadius: 6 }} />
        <div style={{ flex: 1, paddingTop: 24 }}>
          <div className="skeleton sk-line" style={{ width: '55%', height: 28 }} />
          <div className="skeleton sk-line w-40" style={{ height: 14, marginTop: 18 }} />
          <div className="skeleton sk-line w-60" style={{ height: 12, marginTop: 14 }} />
        </div>
      </div>
    </div>
  );
}




// ── main component ────────────────────────────────────────────────────────────

export function AnimeDetailPage() {
  const BASE_URL = 'https://api.jikan.moe/v4';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // TODO: add useState and useEffect to fetch anime details and characters from the API using the id param
  const [animeDetail, setAnimeDetail] = useState<AnimeDetail | null>(null);
  const [characters, setCharacters] = useState<CharacterEntry[] | null>(null);
  const [fetchStatus, setFetchStatus] = useState<'loading' | 'success' | 'error'>('success');

  useEffect(() => {
    (async () => {
      let isMounted = true;
      setAnimeDetail(null);
      setCharacters(null);
      setFetchStatus('loading');
      try {
        const fetchAnimeDetails = await fetch(`${BASE_URL}/anime/${id}`);
        const animeDetailsData = await fetchAnimeDetails.json();
        if (isMounted) {
          setAnimeDetail(animeDetailsData.data);
          setFetchStatus('success');
        }
      } catch (error) {
        if (isMounted) {
          setFetchStatus('error');
          return;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const fetchCharacterDetails = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
        const characterEntryData = await fetchCharacterDetails.json();
        if (isMounted) {
          setCharacters(characterEntryData.data);
          setFetchStatus('success');
        }
      } catch (error) {
        if (isMounted) {
          setFetchStatus('error');
          return;
        }
        return () => { isMounted = false }
      }
    })();
  }, [id]);

  if (fetchStatus === 'loading') return <DetailSkeleton />;
  if (fetchStatus === 'error' || !animeDetail) {
    return <ErrorState message="Could not load anime details." onRetry={() => { }} />;
  }

  const cover = animeDetail.images?.webp?.large_image_url || animeDetail.images?.jpg?.large_image_url;
  const banner = bannerOf(animeDetail);
  const studio = animeDetail.studios.map((s) => s.name).join(', ');
  const title = animeDetail.title_english || animeDetail.title;

  const sortedChars = (characters ?? [])
    .slice()
    .sort((a, b) => {
      const roleWeight = (r: string) => (r === 'Main' ? 0 : 1);
      const roleOrder = roleWeight(a.role) - roleWeight(b.role);
      if (roleOrder !== 0) return roleOrder;
      return (b.favorites || 0) - (a.favorites || 0);
    });

  const seasonValue = animeDetail.season
    ? `${cap(animeDetail.season) ?? animeDetail.season} ${animeDetail.year ?? ''}`.trim()
    : animeDetail.year != null
      ? String(animeDetail.year)
      : null;

  const watchlistAnime: Anime = {
    mal_id: animeDetail.mal_id,
    titleEnglish: title,
    titleJp: animeDetail.title_japanese ?? undefined,
    image: cover,
    score: animeDetail.score,
    episodes: animeDetail.episodes,
    year: animeDetail.year,
    season: animeDetail.season,
    status: animeDetail.status,
    format: animeDetail.type ?? 'TV',
    genres: animeDetail.genres.map((g) => g.name),
    studios: animeDetail.studios.map((s) => s.name),
  };

  return (
    <div className="detail">
      {/* Top bar */}
      <header className="topbar d-topbar">
        <div className="brand">
          <button className="d-back" onClick={() => navigate(-1)} aria-label="Back to browse">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="brand-mark">Kyomei</div>
          <div className="brand-jp">共鳴</div>
        </div>
        <nav className="nav">
          <Link to="/">Browse</Link>
          <Link to="/watchlist">Watchlist</Link>
        </nav>
        <div className="top-meta">
          <span className="dot" />
          <span>Live · Jikan</span>
        </div>
      </header>

      {/* Banner — trailer thumbnail or blurred cover fallback */}
      <div
        className="d-banner"
        style={banner ? { backgroundImage: `url(${banner})` } : {}}
      >
        <div className="d-banner-veil" />
        {!banner && cover && (
          <div
            className="d-banner-fallback"
            style={{ backgroundImage: `url(${cover})` }}
          />
        )}
      </div>

      {/* Header: large cover + title block */}
      <div className="d-head">
        <WatchlistCover anime={watchlistAnime} cover={cover ?? ''} score={animeDetail.score} />
        <div className="d-head-text">
          <div className="d-eyebrow">
            <span className="dot" />
            {animeDetail.genres.slice(0, 3).map((g) => g.name).join(' · ') || 'Anime'}
          </div>
          <h1 className="d-title">{title}</h1>
          {animeDetail.title_japanese && (
            <div className="d-title-jp">{animeDetail.title_japanese}</div>
          )}
          {animeDetail.synopsis && <p className="d-synopsis">{animeDetail.synopsis}</p>}
        </div>
      </div>

      {/* Two-column body */}
      <div className="d-body">
        {/* LEFT — info sidebar */}
        <aside className="d-side">
          <div className="d-side-title">
            Information<span className="jp">情報</span>
          </div>
          <MetaItem label="Studio" value={studio} />
          <MetaItem label="Format" value={animeDetail.type} />
          <MetaItem label="Episodes" value={animeDetail.episodes} />
          <MetaItem label="Episode Duration" value={animeDetail.duration} />
          <MetaItem label="Status" value={animeDetail.status} />
          <MetaItem label="Start Date" value={fmtDate(animeDetail.aired?.from)} />
          <MetaItem label="End Date" value={fmtDate(animeDetail.aired?.to)} />
          <MetaItem label="Season" value={seasonValue} />
        </aside>

        {/* RIGHT — characters */}
        <section className="d-main">
          <div className="section-title d-sec-hd">
            <span className="num">◆</span>
            <h2>
              Characters <span className="jp">登場人物</span>
            </h2>
          </div>

          {characters === null ? (
            <div className="d-char-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="d-char skeleton" key={i} style={{ height: 88 }} />
              ))}
            </div>
          ) : sortedChars.length === 0 ? (
            <div className="state" style={{ margin: '8px 0' }}>
              <div className="jp-big">空</div>
              <h3>No cast listed</h3>
              <p>This title doesn't have character data in the catalogue yet.</p>
            </div>
          ) : (
            <div className="d-char-grid">
              {sortedChars.slice(0, 12).map((entry) => (
                <CharCard key={entry.character.mal_id} entry={entry} />
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="foot">
        <div>© MMXXVI · Kyomei</div>
        <div className="jp">共鳴 — 響き合う物語の索引</div>
        <div>Powered by Jikan / MAL</div>
      </footer>
    </div>
  );
}
