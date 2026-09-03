import { afterEach, describe, expect, it, vi } from 'vitest';
import { kyomeiApiSearchAnime } from './kyomeiApi';

const validListResponse = {
  data: [{
    malId: 20,
    titleEnglish: 'Naruto',
    image: 'https://example.com/naruto.jpg',
    score: 8,
    episodes: 220,
    year: 2002,
    season: 'fall',
    status: 'Finished Airing',
    format: 'TV',
    genres: ['Action'],
    studios: ['Studio Pierrot'],
  }],
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('kyomeiApiSearchAnime', () => {
  it('uses the same-origin API path', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(validListResponse)));
    vi.stubGlobal('fetch', fetchMock);

    await kyomeiApiSearchAnime('naruto');

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/anime/search?q=naruto&limit=24', expect.any(Object));
  });

  it('reports an API status failure distinctly', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { message: 'Rate limit exceeded' },
    }), { status: 429 })));

    await expect(kyomeiApiSearchAnime('naruto')).rejects.toThrow(
      'Kyomei API request failed (status 429): Rate limit exceeded'
    );
  });

  it('reports network failures distinctly', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(kyomeiApiSearchAnime('naruto')).rejects.toThrow(
      'Could not reach the Kyomei API. Check your connection and try again.'
    );
  });

  it('reports request timeouts distinctly', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const request = kyomeiApiSearchAnime('naruto');
    const assertion = expect(request).rejects.toThrow('Kyomei API request timed out. Please try again.');
    await vi.advanceTimersByTimeAsync(6000);

    await assertion;
  });
});
