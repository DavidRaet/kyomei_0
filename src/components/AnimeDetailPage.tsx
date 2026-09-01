import type { AnimeDetail, CharacterEntry } from '../types/anime-detail';
import type { Anime } from '../types/types';
import { ErrorState } from './ErrorState';
import { WatchlistCover } from './WatchlistCover';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAnimeById, getCharacters } from '../api/animeProvider';
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

function fmtDuration(minutes: number | null): string | null {
  return minutes != null ? `${minutes} min per ep` : null;
}

// ── sub-components ────────────────────────────────────────────────────────────

function MetaItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="d-meta-item">
      <div className="d-meta-label">{label}</div>
      <div className="d-meta-value">{value || '-'}</div>
    </div>
  );
}

function CharCard({ entry }: { entry: CharacterEntry }) {
  const va =
    entry.voiceActors.find((v) => v.language === 'Japanese') || entry.voiceActors[0];

  return (
    <div className="d-char">
      <div className="d-char-side left">
        <div className="d-char-thumb">
          {entry.image && <img src={entry.image} alt={entry.name} loading="lazy" />}
        </div>
        <div className="d-char-text">
          <div className="d-char-name">{entry.name}</div>
          <div className="d-char-role">{entry.role}</div>
        </div>
      </div>
      {va && (
        <div className="d-char-side right">
          <div className="d-char-text r">
            <div className="d-char-name">{va.name}</div>
            <div className="d-char-role">{va.language}</div>
          </div>
          <div className="d-char-thumb">
            {va.image && <img src={va.image} alt={va.name} loading="lazy" />}
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animeDetail, setAnimeDetail] = useState<AnimeDetail | null>(null);
  const [characters, setCharacters] = useState<CharacterEntry[] | null>(null);
  const [fetchStatus, setFetchStatus] = useState<'loading' | 'success' | 'error'>('success');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setAnimeDetail(null);
      setCharacters(null);
      setFetchStatus('loading');
      try {
        const detail = await getAnimeById(Number(id));
        if (!isMounted) return;
        setAnimeDetail(detail);
        setFetchStatus('success');
      } catch {
        if (isMounted) setFetchStatus('error');
        return;
      }

      try {
        const chars = await getCharacters(Number(id));
        if (isMounted) setCharacters(chars);
      } catch {
        // detail already loaded successfully — leave characters null rather than
        // flipping the whole page to an error state
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  if (fetchStatus === 'loading') return <DetailSkeleton />;
  if (fetchStatus === 'error' || !animeDetail) {
    return <ErrorState message="Could not load anime details." onRetry={() => { }} />;
  }

  const cover = animeDetail.image;
  const banner = animeDetail.trailerImage;
  const studio = animeDetail.studios.join(', ');
  const title = animeDetail.titleEnglish || animeDetail.titleRomaji || '';

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

  const watchlistAnime: Anime = { ...animeDetail, titleEnglish: title };

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
          <span>Live · Kyomei API</span>
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
            {animeDetail.genres.slice(0, 3).join(' · ') || 'Anime'}
          </div>
          <h1 className="d-title">{title}</h1>
          {animeDetail.titleJp && (
            <div className="d-title-jp">{animeDetail.titleJp}</div>
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
          <MetaItem label="Format" value={animeDetail.format} />
          <MetaItem label="Episodes" value={animeDetail.episodes} />
          <MetaItem label="Episode Duration" value={fmtDuration(animeDetail.durationMinutes)} />
          <MetaItem label="Status" value={animeDetail.status} />
          <MetaItem label="Start Date" value={fmtDate(animeDetail.airedFrom)} />
          <MetaItem label="End Date" value={fmtDate(animeDetail.airedTo)} />
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
                <CharCard key={entry.mal_id} entry={entry} />
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="foot">
        <div>© MMXXVI · Kyomei</div>
        <div className="jp">共鳴 - 響き合う物語の索引</div>
        <div>Powered by Kyomei API</div>
      </footer>
    </div>
  );
}
