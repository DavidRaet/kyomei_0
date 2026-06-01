
export const GENRE_OPTIONS = [
    'Action', 'Romance', 'Comedy', 'Drama',
    'Fantasy', 'Sci-Fi', 'Slice of Life', 'Horror'
] as const;

export const SEASON_OPTIONS = ['Winter', 'Spring', 'Summer', 'Fall'] as const;

export const FORMAT_OPTIONS = ['TV', 'Movie', 'OVA', 'Special'] as const;

export const STATUS_OPTIONS = ["Finished Airing", "Currently Airing", "Not yet aired"] as const;

export const YEAR_OPTIONS = ['2000s', '2010s', '2020s'] as const;

export type Genre = typeof GENRE_OPTIONS[number];
export type Season = typeof SEASON_OPTIONS[number];
export type Format = typeof FORMAT_OPTIONS[number];
export type Status = typeof STATUS_OPTIONS[number];
export type Year = typeof YEAR_OPTIONS[number];

export type Option = Genre | Season | Format | Status | Year;