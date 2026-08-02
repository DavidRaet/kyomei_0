import type { Anime } from '../types/types';
import type { AnimeDetail, CharacterEntry } from '../types/anime-detail';
import type {
  AniListFormat,
  AniListGraphQLResponse,
  AniListMediaRaw,
  AniListSeason,
  AniListStatus,
} from '../types/anilist-raw-type';
import type { AnimeListParams } from './types';

const ANILIST_URL = 'https://graphql.anilist.co';
const REQUEST_TIMEOUT_MS = 6000;

async function postGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(ANILIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    const body = (await response.json().catch(() => null)) as AniListGraphQLResponse<T> | null;
    if (!response.ok || !body || (body.errors && body.errors.length > 0) || !body.data) {
      const message = body?.errors?.[0]?.message ?? `AniList request failed (status ${response.status})`;
      throw new Error(message);
    }
    return body.data;
  } finally {
    clearTimeout(timeout);
  }
}

const FORMAT_MAP: Record<NonNullable<AniListFormat>, string> = {
  TV: 'TV',
  TV_SHORT: 'TV Short',
  MOVIE: 'Movie',
  SPECIAL: 'Special',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'Music',
  MANGA: 'Manga',
  NOVEL: 'Novel',
  ONE_SHOT: 'One Shot',
};

const STATUS_MAP: Record<NonNullable<AniListStatus>, string> = {
  FINISHED: 'Finished Airing',
  RELEASING: 'Currently Airing',
  NOT_YET_RELEASED: 'Not yet aired',
  CANCELLED: 'Cancelled',
  HIATUS: 'On Hiatus',
};

function mapFormat(format: AniListFormat): string {
  return format ? FORMAT_MAP[format] : 'Unknown';
}

function mapStatus(status: AniListStatus): string {
  return status ? STATUS_MAP[status] : 'Unknown';
}

function mapSeason(season: AniListSeason): string | null {
  return season ? season.toLowerCase() : null;
}

function mainStudios(media: AniListMediaRaw): string[] {
  return media.studios.edges.filter((e) => e.isMain).map((e) => e.node.name);
}

// Dec/Jan/Feb -> Winter, with December rolling to next year's winter, matching
// how Jikan's /seasons/now behaves around the year boundary.
function currentAniListSeason(date = new Date()): { season: AniListSeason; year: number } {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (month === 11) return { season: 'WINTER', year: year + 1 };
  if (month <= 1) return { season: 'WINTER', year };
  if (month <= 4) return { season: 'SPRING', year };
  if (month <= 7) return { season: 'SUMMER', year };
  return { season: 'FALL', year };
}

function mapAniListToAnime(media: AniListMediaRaw): Anime | null {
  if (media.idMal == null) return null;
  return {
    mal_id: media.idMal,
    titleEnglish: media.title.english ?? media.title.romaji ?? media.title.native ?? '',
    titleJp: media.title.native ?? undefined,
    image: media.coverImage.large ?? media.coverImage.extraLarge ?? '',
    score: media.averageScore != null ? media.averageScore / 10 : null,
    episodes: media.episodes ?? null,
    year: media.seasonYear ?? media.startDate?.year ?? null,
    season: mapSeason(media.season),
    format: mapFormat(media.format),
    status: mapStatus(media.status),
    genres: media.genres ?? [],
    studios: mainStudios(media),
  };
}

const MEDIA_LIST_QUERY = /* GraphQL */ `
  query (
    $page: Int
    $perPage: Int
    $sort: [MediaSort]
    $season: MediaSeason
    $seasonYear: Int
    $search: String
  ) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: $sort, season: $season, seasonYear: $seasonYear, search: $search) {
        idMal
        title { romaji english native }
        coverImage { large extraLarge }
        averageScore
        episodes
        seasonYear
        startDate { year month day }
        season
        format
        status
        genres
        studios(sort: [NAME]) {
          edges { isMain node { name } }
        }
      }
    }
  }
`;

export async function anilistGetAnimeList(params: AnimeListParams): Promise<Anime[]> {
  let variables: Record<string, unknown>;
  if (params.mode === 'trending') {
    variables = { page: 1, perPage: params.limit, sort: ['TRENDING_DESC'] };
  } else if (params.mode === 'seasonal') {
    const { season, year } = currentAniListSeason();
    variables = { page: 1, perPage: params.limit, sort: ['POPULARITY_DESC'], season, seasonYear: year };
  } else {
    variables = { page: 1, perPage: 24, sort: ['SEARCH_MATCH'], search: params.query };
  }

  const data = await postGraphQL<{ Page: { media: AniListMediaRaw[] } }>(MEDIA_LIST_QUERY, variables);
  return data.Page.media.map(mapAniListToAnime).filter((a): a is Anime => a !== null);
}

const MEDIA_DETAIL_QUERY = /* GraphQL */ `
  query ($id: Int) {
    Media(idMal: $id, type: ANIME) {
      idMal
      title { romaji english native }
      coverImage { large extraLarge }
      averageScore
      episodes
      duration
      seasonYear
      startDate { year month day }
      endDate { year month day }
      season
      format
      status
      description(asHtml: false)
      genres
      studios(sort: [NAME]) {
        edges { isMain node { name } }
      }
      trailer { site thumbnail }
      characters(sort: [ROLE, FAVOURITES_DESC], perPage: 25) {
        edges {
          role
          node { id name { full } image { large medium } favourites }
          voiceActors(language: JAPANESE) { name { full } image { large } }
        }
      }
    }
  }
`;

function isoFromParts(date: { year: number | null; month: number | null; day: number | null } | null): string | null {
  if (!date?.year || !date.month || !date.day) return null;
  const mm = String(date.month).padStart(2, '0');
  const dd = String(date.day).padStart(2, '0');
  return `${date.year}-${mm}-${dd}`;
}

function mapAniListToAnimeDetail(media: AniListMediaRaw): AnimeDetail {
  const cover = media.coverImage.large ?? media.coverImage.extraLarge ?? '';
  const large = media.coverImage.extraLarge ?? media.coverImage.large ?? '';
  return {
    mal_id: media.idMal ?? 0,
    title: media.title.romaji ?? media.title.english ?? media.title.native ?? '',
    title_english: media.title.english ?? null,
    title_japanese: media.title.native ?? null,
    images: {
      jpg: { image_url: cover, large_image_url: large },
      webp: { image_url: cover, large_image_url: large },
    },
    score: media.averageScore != null ? media.averageScore / 10 : null,
    episodes: media.episodes ?? null,
    synopsis: media.description ?? null,
    genres: (media.genres ?? []).map((name, i) => ({ mal_id: i, name })),
    trailer: media.trailer?.thumbnail ? { images: { large_image_url: media.trailer.thumbnail } } : null,
    status: mapStatus(media.status),
    rating: null,
    type: mapFormat(media.format),
    duration: media.duration != null ? `${media.duration} min per ep` : null,
    aired: media.startDate ? { from: isoFromParts(media.startDate), to: isoFromParts(media.endDate) } : null,
    season: mapSeason(media.season),
    year: media.seasonYear ?? media.startDate?.year ?? null,
    studios: mainStudios(media).map((name, i) => ({ mal_id: i, name })),
  };
}

function mapAniListToCharacterEntries(media: AniListMediaRaw): CharacterEntry[] {
  return (media.characters?.edges ?? []).map((edge) => ({
    character: {
      mal_id: edge.node.id,
      name: edge.node.name.full ?? 'Unknown',
      images: {
        jpg: { image_url: edge.node.image.medium ?? '' },
        webp: { image_url: edge.node.image.large ?? '' },
      },
    },
    role: edge.role === 'MAIN' ? 'Main' : edge.role === 'SUPPORTING' ? 'Supporting' : 'Background',
    favorites: edge.node.favourites ?? 0,
    voice_actors: edge.voiceActors.map((va) => ({
      language: 'Japanese',
      person: {
        name: va.name.full ?? 'Unknown',
        images: { jpg: { image_url: va.image.large ?? '' } },
      },
    })),
  }));
}

export async function anilistGetAnimeById(
  id: number
): Promise<{ detail: AnimeDetail; characters: CharacterEntry[] }> {
  const data = await postGraphQL<{ Media: AniListMediaRaw }>(MEDIA_DETAIL_QUERY, { id });
  return {
    detail: mapAniListToAnimeDetail(data.Media),
    characters: mapAniListToCharacterEntries(data.Media),
  };
}
