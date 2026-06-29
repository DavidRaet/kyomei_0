import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <>
      <nav className="nav">
        {/* TODO: replace with <Link to="/">Browse</Link> and <Link to="/watchlist">Watchlist</Link> */}
        <button>Browse</button>
        <button>Watchlist</button>
      </nav>
      {/* TODO: <Outlet /> goes here — this renders the matched child route */}
    </>
  );
}
