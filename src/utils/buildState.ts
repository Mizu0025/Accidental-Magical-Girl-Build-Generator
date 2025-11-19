import type { Stats } from '../data/gameData';

// Build state represents all the rolls and choices made
export interface BuildState {
    rolls: {
        age: number;
        body: number;
        specialization: number;
        weapon: number;
        outfit: number;
        power: number;
        perks: [number, number, number, number, number];
    };
    originalRolls: {
        age: number;
        body: number;
        specialization: number;
        weapon: number;
        outfit: number;
        power: number;
        perks: [number, number, number, number, number];
    };
    choices: {
        bodyOption?: number; // Index of chosen option (0 or 1)
        specializationMods?: Record<number, keyof Stats>; // For choice mods
        weaponPick?: string; // If using free pick
        outfitPick?: string; // If using free pick
        powerChoice?: number; // For Killing Blow choice
        perkCategories: ['T2', 'T2', 'T1', 'T1', 'T1' | 'T2']; // Can be modified
        perkPicks?: Array<number | null>; // Perk roll or free pick
        // Free pick selections (origin bonuses)
        freePickAge?: number; // Free pick age roll value
        freePickBody?: number; // Free pick body roll value
        freePickSpecialization?: number; // Free pick specialization roll value
        freePickWeapon?: number; // Free pick weapon roll value
        freePickOutfit?: number; // Free pick outfit roll value
        freePickPower?: number; // Free pick power roll value
        freePickPerks?: Array<number | null>; // Free pick perk roll values [perk1, perk2, perk3, perk4, perk5]
        // Gold coin features
        secondWeapon?: number; // Roll value for second weapon (1-20)
        secondPower?: number; // Roll value for second power (1-20)
        secondPowerChoice?: number; // For Killing Blow choice on second power
        bonusPerks?: Array<{
            category: 'T1' | 'T2';
            roll: number;
        }>; // Bonus perks from Gold coins (can have multiple from different perk slots)
        // Stat Spends
        statSpends?: Record<string, { bronze: number; silver: number; gold: number }>;
    };
    coinsSpent: {
        age?: 'Bronze' | 'Silver' | 'Gold';
        body?: 'Bronze' | 'Silver';
        specialization?: 'Bronze' | 'Silver' | 'Gold';
        weapon?: 'Bronze' | 'Silver' | 'Gold';
        outfit?: 'Bronze' | 'Silver';
        power?: 'Bronze' | 'Silver' | 'Gold';
        perks?: Array<'Bronze' | 'Silver' | null>;
    };
}

export function createEmptyBuild(): BuildState {
    const emptyRolls = {
        age: 0,
        body: 0,
        specialization: 0,
        weapon: 0,
        outfit: 0,
        power: 0,
        perks: [0, 0, 0, 0, 0] as [number, number, number, number, number],
    };

    return {
        rolls: { ...emptyRolls },
        originalRolls: { ...emptyRolls },
        choices: {
            perkCategories: ['T2', 'T2', 'T1', 'T1', 'T1'],
            statSpends: {
                STR: { bronze: 0, silver: 0, gold: 0 },
                AGI: { bronze: 0, silver: 0, gold: 0 },
                VIT: { bronze: 0, silver: 0, gold: 0 },
                MAG: { bronze: 0, silver: 0, gold: 0 },
                LCK: { bronze: 0, silver: 0, gold: 0 },
            },
        },
        coinsSpent: {},
    };
}
