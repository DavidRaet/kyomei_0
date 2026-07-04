import type { Anime } from '../types/types';
import type { WatchlistEntry } from '../types/watchlist';
import { IconStar, IconPlus, IconCheck } from './icons';
import { useWatchlist, addToWatchlist, removeFromWatchlist } from '../hooks/useWatchlist';

interface WatchlistCoverProps {
  anime: Anime;
  cover: string;
  score: number | null;
}

export function WatchlistCover({ anime, cover, score }: WatchlistCoverProps) {
  const inList = useWatchlist().some(entry => entry.mal_id === anime.mal_id);

  const toggle = () => {
    if(inList) {
      removeFromWatchlist(anime.mal_id);
    } else {
      addToWatchlist(anime);
    }
  };

  return (
    <div className="d-cover-col">
      <div className={`d-cover ${inList ? 'in-list' : ''}`}>
        <div className="d-cover-media">
          {cover && <img src={cover} alt={anime.titleEnglish} />}
          <div className="d-static" aria-hidden="true" />
          <div className="d-scan" aria-hidden="true" />
          {score ? (
            <div className="score d-score">
              <IconStar /> {score.toFixed(1)}
            </div>
          ) : null}
          {inList && (
            <div className="d-instate">
              <IconCheck size={13} /> Watching
            </div>
          )}
          <button
            type="button"
            className={`d-cover-overlay ${inList ? 'added' : ''}`}
            onClick={toggle}
            aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <span className="d-cover-cta">{inList ? 'In Watchlist' : 'Add to Watchlist'}</span>
            <span className="d-add-plus">{inList ? <IconCheck /> : <IconPlus />}</span>
            {inList && <span className="d-cover-hint">Click to remove</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
