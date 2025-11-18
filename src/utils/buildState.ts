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
        },
        coinsSpent: {},
    };
}
