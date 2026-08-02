// The raw AniList GraphQL API response (boundary type)
export interface AniListTitle {
    romaji: string | null;
    english: string | null;
    native: string | null;
}

export interface AniListCoverImage {
    extraLarge: string | null;
    large: string | null;
}

export interface AniListStudioNode {
    name: string;
}

export interface AniListStudioEdge {
    isMain: boolean;
    node: AniListStudioNode;
}

export interface AniListFuzzyDate {
    year: number | null;
    month: number | null;
    day: number | null;
}

export type AniListFormat =
    | 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC'
    | 'MANGA' | 'NOVEL' | 'ONE_SHOT' | null;

export type AniListStatus =
    | 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS' | null;

export type AniListSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL' | null;

export type AniListCharacterRole = 'MAIN' | 'SUPPORTING' | 'BACKGROUND';

export interface AniListCharacterNode {
    id: number;
    name: { full: string | null };
    image: { large: string | null; medium: string | null };
    favourites: number | null;
}

export interface AniListVoiceActor {
    name: { full: string | null };
    image: { large: string | null };
}

export interface AniListCharacterEdge {
    role: AniListCharacterRole;
    node: AniListCharacterNode;
    voiceActors: AniListVoiceActor[];
}

export interface AniListTrailer {
    site: string | null;
    thumbnail: string | null;
}

export interface AniListMediaRaw {
    idMal: number | null;
    title: AniListTitle;
    coverImage: AniListCoverImage;
    averageScore: number | null;
    episodes: number | null;
    seasonYear: number | null;
    startDate: AniListFuzzyDate | null;
    endDate: AniListFuzzyDate | null;
    season: AniListSeason;
    format: AniListFormat;
    status: AniListStatus;
    genres: string[];
    studios: { edges: AniListStudioEdge[] };
    // detail-only fields (present when queried via the detail query)
    description?: string | null;
    duration?: number | null;
    trailer?: AniListTrailer | null;
    characters?: { edges: AniListCharacterEdge[] };
}

export interface AniListGraphQLResponse<T> {
    data: T | null;
    errors?: { message: string }[];
}
