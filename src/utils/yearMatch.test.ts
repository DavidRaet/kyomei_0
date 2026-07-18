import { describe, expect, it } from 'vitest';
import { matchesDecadeYear } from './yearMatch';

describe('matchesDecadeYear', () => {
    it('matches years inside the 2000s band', () => {
        expect(matchesDecadeYear(['2000s'], 2005)).toBe(true);
        expect(matchesDecadeYear(['2000s'], 2010)).toBe(false);
    });

    it('matches years inside the 2010s and 2020s bands', () => {
        expect(matchesDecadeYear(['2010s'], 2016)).toBe(true);
        expect(matchesDecadeYear(['2020s'], 2026)).toBe(true);
    });

    it('returns false when there are no year options', () => {
        expect(matchesDecadeYear([], 2026)).toBe(false);
        expect(matchesDecadeYear(null, 2026)).toBe(false);
    });
});