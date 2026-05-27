import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { mockAiring, mockSeasonal } from './mocks';

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


createRoot(document.getElementById('root')!).render(  
  
  <StrictMode>
    <App
      trending={mockAiring}
      seasonal={mockSeasonal}
      searchResults={null}
      loading={false}
      error={null}
      query=""
      submitted=""
      activeFilters={{ Genre: null, Year: null, Season: null, Format: null, Status: null }}
      onQueryChange={() => {
        /* TODO */
        // What it does: At a high-level, this function is responsible for 
        // returning the result the user wants to query. e.g, if they want 
        // to look up One Piece, the onQueryChange will look up anime most relevant 
        // to One Piece. 
        
      }}
      //
      onSubmit={() => {
        /* TODO */

      }}
      onClearSearch={() => {
        /* TODO */
      }}
      onRetry={() => {
        /* TODO */
      }}
      onFilterToggle={() => {
        /* TODO */
      }}
    />
  </StrictMode>,
);
