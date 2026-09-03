import { Link } from 'react-router-dom'
import { IconChevronLeft } from './icons'
import { useWatchlist } from '../hooks/useWatchlist'

interface AppHeaderProps {
  active: 'browse' | 'watchlist'
  status: string
  onBack?: () => void
}

export function AppHeader({ active, status, onBack }: AppHeaderProps) {
  const watchlistCount = useWatchlist().length

  return (
    <header className="topbar">
      <div className="brand">
        {onBack ? (
          <button className="d-back" type="button" onClick={onBack} aria-label="Back to browse">
            <IconChevronLeft />
          </button>
        ) : null}
        <Link className="brand-home" to="/" aria-label="Kyomei browse home">
          <span className="brand-mark">Kyomei</span>
          <span className="brand-jp">共鳴</span>
          <span className="brand-sub">An Anime Index</span>
        </Link>
      </div>
      <nav className="nav" aria-label="Primary navigation">
        <Link className={active === 'browse' ? 'active' : undefined} to="/">
          Browse
        </Link>
        <Link className={active === 'watchlist' ? 'active' : undefined} to="/watchlist">
          Watchlist
          {watchlistCount > 0 ? <span className="nav-count">{watchlistCount}</span> : null}
        </Link>
      </nav>
      <div className="top-meta">
        <span className="dot" aria-hidden="true" />
        <span>{status}</span>
      </div>
    </header>
  )
}
