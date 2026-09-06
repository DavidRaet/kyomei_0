import { Link } from 'react-router-dom'
import { Show, UserButton } from '@clerk/react'
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
        <Show when="signed-out">
          <Link className="auth-link" to="/sign-in">Sign in</Link>
          <Link className="auth-join" to="/sign-up">Join Kyomei</Link>
        </Show>
        <Show when="signed-in">
          <span className="dot" aria-hidden="true" />
          <span>{status}</span>
          <UserButton />
        </Show>
      </div>
    </header>
  )
}
