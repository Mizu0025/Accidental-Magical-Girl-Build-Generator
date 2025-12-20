import { describe, it, expect } from 'vitest';
import { parseBonuses } from '../script.js';

describe('Twinned Soul Logic', () => {
    it('should calculate twin stats separate from user stats', () => {
        const currentBuild = {
            hasTwin: true,
            purchasedStats: { STR: 0, AGI: 0, VIT: 0, MAG: 0, LCK: 0 },
            userOnlyStats: { STR: 0, AGI: 0, VIT: 0, MAG: 0, LCK: 0 },
            origin: 'Contract'
        };

        const userItems = [
            { category: 'Weapon', stats: '+2 STR' },
            { category: 'Perk 1', stats: '+1 MAG' }
        ];

        const twinItems = [
            { category: 'Weapon', stats: '+2 AGI' }
        ];

        const result = parseBonuses(userItems, currentBuild, twinItems);

        // User: 4 (base) + 2 (Weapon) = 6 STR. 4 (base) + 1 (Perk) = 5 MAG.
        expect(result.stats.STR).toBe(6);
        expect(result.stats.AGI).toBe(4);
        expect(result.stats.MAG).toBe(5);

        // Twin: 4 (base) + 2 (Weapon) = 6 AGI. 4 (base) + 1 (Shared Perk) = 5 MAG.
        expect(result.twinStats.STR).toBe(4);
        expect(result.twinStats.AGI).toBe(6);
        expect(result.twinStats.MAG).toBe(5);
    });

    it('should share flexible bonuses correctly (User only)', () => {
        const currentBuild = {
            hasTwin: true,
            purchasedStats: { STR: 0, AGI: 0, VIT: 0, MAG: 0, LCK: 0 },
            userOnlyStats: { STR: 0, AGI: 0, VIT: 0, MAG: 0, LCK: 0 },
            origin: 'Weapon' // Origin Weapon adds flex bonus
        };

        const userItems = [];
        const twinItems = [];

        const result = parseBonuses(userItems, currentBuild, twinItems);
        expect(result.flexible).toContain('+1 Weapon Stat (Origin Bonus)');
    });

    it('should handle purchased stats for both user and twin', () => {
        const currentBuild = {
            hasTwin: true,
            purchasedStats: { STR: 2, AGI: 0, VIT: 0, MAG: 0, LCK: 0 }, // +2 to both
            userOnlyStats: { STR: 1, AGI: 0, VIT: 0, MAG: 0, LCK: 0 },   // +1 to User only (Bronze)
            origin: 'Contract'
        };

        const userItems = [];
        const twinItems = [];

        const result = parseBonuses(userItems, currentBuild, twinItems);

        // User: 4 (base) + 2 (purchased) + 1 (userOnly) = 7
        expect(result.stats.STR).toBe(7);
        // Twin: 4 (base) + 2 (purchased) = 6
        expect(result.twinStats.STR).toBe(6);
    });
});
