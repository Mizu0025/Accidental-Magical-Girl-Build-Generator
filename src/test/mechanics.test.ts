import { describe, it, expect } from 'vitest';
import {
    calculateAge,
    getRangeKey,
    applyStatMod,
    getInitialCoins,
    spendCoin,
    checkFreePick,
    getPerkCategory,
} from '../utils/mechanics';
import { getOriginByName } from '../utils/mechanics';
import type { Stats } from '../data/gameData';

describe('Age Calculation', () => {
    it('should calculate age correctly for rolls 1-10', () => {
        expect(calculateAge(1)).toBe(7);
        expect(calculateAge(5)).toBe(11);
        expect(calculateAge(10)).toBe(16);
    });

    it('should calculate age correctly for rolls 11-20', () => {
        expect(calculateAge(11)).toBe(7);
        expect(calculateAge(15)).toBe(11);
        expect(calculateAge(20)).toBe(16);
    });
});

describe('Range Key Lookup', () => {
    it('should find correct range for numeric ranges', () => {
        const ranges = ['1-5', '6-10', '11-15', '16-20'];
        expect(getRangeKey(3, ranges)).toBe('1-5');
        expect(getRangeKey(7, ranges)).toBe('6-10');
        expect(getRangeKey(15, ranges)).toBe('11-15');
        expect(getRangeKey(20, ranges)).toBe('16-20');
    });
});

describe('Stat Modification', () => {
    it('should apply stat mod correctly', () => {
        const stats: Stats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };
        const mod = { stat: 'STR' as const, mod: 2, text: '+2 STR' };
        const result = applyStatMod(stats, mod);
        expect(result.STR).toBe(6);
        expect(result.AGI).toBe(4);
    });

    it('should handle choice stat mods', () => {
        const stats: Stats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };
        const mod = { stat: 'Choice' as const, mod: 2, text: '+2 to one stat' };
        const result = applyStatMod(stats, mod, 'MAG');
        expect(result.MAG).toBe(6);
    });
});

describe('Coin Management', () => {
    it('should return default coins for no origin', () => {
        const coins = getInitialCoins(null);
        expect(coins).toEqual({ Bronze: 4, Silver: 3, Gold: 1 });
    });

    it('should return reduced coins for Smug origin', () => {
        const smug = getOriginByName('Smug');
        const coins = getInitialCoins(smug);
        expect(coins).toEqual({ Bronze: 3, Silver: 2, Gold: 0 });
    });

    it('should return extra silver for Death origin', () => {
        const death = getOriginByName('Death');
        const coins = getInitialCoins(death);
        expect(coins).toEqual({ Bronze: 4, Silver: 4, Gold: 1 });
    });

    it('should spend coins correctly', () => {
        const stash = { Bronze: 4, Silver: 3, Gold: 1 };
        const result = spendCoin(stash, 'Bronze');
        expect(result).toEqual({ Bronze: 3, Silver: 3, Gold: 1 });
    });

    it('should return null when trying to spend unavailable coin', () => {
        const stash = { Bronze: 0, Silver: 3, Gold: 1 };
        const result = spendCoin(stash, 'Bronze');
        expect(result).toBeNull();
    });
});

describe('Origin Free Picks', () => {
    it('should allow Smug to pick everything freely', () => {
        const smug = getOriginByName('Smug');
        expect(checkFreePick(smug, 'weapon')).toBe(true);
        expect(checkFreePick(smug, 'outfit')).toBe(true);
        expect(checkFreePick(smug, 'body')).toBe(true);
    });

    it('should allow Contract to pick outfit and perk5', () => {
        const contract = getOriginByName('Contract');
        expect(checkFreePick(contract, 'outfit')).toBe(true);
        expect(checkFreePick(contract, 'perk5')).toBe(true);
        expect(checkFreePick(contract, 'weapon')).toBe(false);
    });

    it('should allow Weapon to pick weapon', () => {
        const weapon = getOriginByName('Weapon');
        expect(checkFreePick(weapon, 'weapon')).toBe(true);
        expect(checkFreePick(weapon, 'outfit')).toBe(false);
    });
});

describe('Perk Categories', () => {
    it('should assign correct categories to perks', () => {
        expect(getPerkCategory(1)).toBe('T2'); // Support
        expect(getPerkCategory(2)).toBe('T2'); // Support
        expect(getPerkCategory(3)).toBe('T1'); // Combat
        expect(getPerkCategory(4)).toBe('T1'); // Combat
        expect(getPerkCategory(5)).toBe('T1'); // Choice (defaults to T1)
    });
});
