export function matchesDecadeYear(yearOptions: readonly string[] | null | undefined, animeYear: number): boolean {
    if (!yearOptions || yearOptions.length === 0) {
        return false;
    }

    return yearOptions.some((yearOption) => {
        if (yearOption === '2000s') {
            return animeYear >= 2000 && animeYear <= 2009;
        }

        if (yearOption === '2010s') {
            return animeYear >= 2010 && animeYear <= 2019;
        }

        if (yearOption === '2020s') {
            return animeYear >= 2020 && animeYear <= 2029;
        }

        return false;
    });
}