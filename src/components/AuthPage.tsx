import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthPageProps {
  children: ReactNode
  mode: 'sign-in' | 'sign-up'
}

const PAGE_COPY = {
  'sign-in': {
    label: 'Return to your index',
    title: 'Pick up where your taste left off.',
    description: 'Sign in to return to the series that caught your attention.',
    japanese: '共鳴',
  },
  'sign-up': {
    label: 'Build your personal index',
    title: 'Keep every promising series within reach.',
    description: 'Create an account to begin shaping a watchlist that feels like your own.',
    japanese: '響',
  },
} as const

export function AuthPage({ children, mode }: AuthPageProps) {
  const copy = PAGE_COPY[mode]

  return (
    <div className="auth-page">
      <aside className="auth-aside" aria-label="Kyomei introduction">
        <Link className="auth-brand" to="/" aria-label="Back to Kyomei browse home">
          <span className="auth-brand-mark">Kyomei</span>
          <span className="auth-brand-jp">共鳴</span>
        </Link>

        <div className="auth-aside-copy">
          <p className="auth-label">{copy.label}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>

        <span className="auth-aside-jp" aria-hidden="true">{copy.japanese}</span>
      </aside>

      <div className="auth-main">
        <header className="auth-mobile-header">
          <Link className="auth-brand" to="/" aria-label="Back to Kyomei browse home">
            <span className="auth-brand-mark">Kyomei</span>
            <span className="auth-brand-jp">共鳴</span>
          </Link>
          <Link className="auth-browse-link" to="/">Browse</Link>
        </header>

        <main className="auth-form-wrap">
          {children}
        </main>
      </div>
    </div>
  )
}
