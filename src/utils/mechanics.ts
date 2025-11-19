import type { Stats, StatMod, Origin } from '../data/gameData';
import { origins } from '../data/gameData';

// --- DICE ROLLING ---

export function rollDice(count: number, sides: number): number {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
}

export function rollD20(): number {
    return rollDice(1, 20);
}

// --- AGE CALCULATION ---

export function calculateAge(roll: number): number {
    // Age formula: (Roll > 10 ? Roll - 10 : Roll) + 6
    // Range: 7-16
    return (roll > 10 ? roll - 10 : roll) + 6;
}

// --- RANGE HELPERS ---

export function getRangeKey(roll: number, ranges: string[]): string | null {
    for (const range of ranges) {
        if (range.includes('-')) {
            const [min, max] = range.split('-').map(Number);
            if (roll >= min && roll <= max) {
                return range;
            }
        } else {
            if (roll === Number(range)) {
                return range;
            }
        }
    }
    return null;
}

// --- STAT CALCULATION ---

export function applyStatMod(stats: Stats, mod: StatMod, chosenStat?: keyof Stats): Stats {
    const newStats = { ...stats };

    if (mod.stat === 'Choice' && chosenStat) {
        newStats[chosenStat] += mod.mod;
    } else if (mod.stat !== 'Choice') {
        newStats[mod.stat] += mod.mod;
    }

    return newStats;
}

export function applyStatMods(stats: Stats, mods: StatMod[], choices?: Record<number, keyof Stats>): Stats {
    let newStats = { ...stats };

    mods.forEach((mod, index) => {
        if (mod.stat === 'Choice' && choices && choices[index]) {
            newStats = applyStatMod(newStats, mod, choices[index]);
        } else if (mod.stat !== 'Choice') {
            newStats = applyStatMod(newStats, mod);
        }
    });

    return newStats;
}

// --- COIN LOGIC ---

export interface CoinStash {
    Bronze: number;
    Silver: number;
    Gold: number;
}

export function getInitialCoins(origin: Origin | null): CoinStash {
    // Default: 1 Gold, 3 Silver, 4 Bronze
    const defaultCoins: CoinStash = { Bronze: 4, Silver: 3, Gold: 1 };

    if (!origin) return defaultCoins;

    // Smug: only get 2 silver and 3 bronze coins
    if (origin.name === 'Smug') {
        return { Bronze: 3, Silver: 2, Gold: 0 };
    }

    // Death: extra silver coin
    if (origin.name === 'Death') {
        return { Bronze: 4, Silver: 4, Gold: 1 };
    }

    return defaultCoins;
}

export type CoinType = 'Bronze' | 'Silver' | 'Gold';

export function spendCoin(stash: CoinStash, type: CoinType): CoinStash | null {
    if (stash[type] <= 0) return null;

    return {
        ...stash,
        [type]: stash[type] - 1,
    };
}

// --- ORIGIN HELPERS ---

export function checkFreePick(origin: Origin | null, category: string): boolean {
    if (!origin) return false;

    // Smug: free pick for every choice
    if (origin.name === 'Smug') return true;

    // Contract: free pick on outfit and perk5
    if (origin.name === 'Contract' && (category === 'outfit' || category === 'perk5')) {
        return true;
    }

    // Weapon: free pick for weapon
    if (origin.name === 'Weapon' && category === 'weapon') {
        return true;
    }

    // Emergency: free pick on perk1 and perk2 (two non-artifact combat perks)
    if (origin.name === 'Emergency' && (category === 'perk1' || category === 'perk2')) {
        return true;
    }

    return false;
}

export function getOriginByName(name: string): Origin | null {
    return origins.find((o) => o.name === name) || null;
}

// --- PERK CATEGORY HELPERS ---

export type PerkCategory = 'T1' | 'T2'; // T1 = Combat, T2 = Support

export function getPerkCategory(perkIndex: number): PerkCategory {
    // Perks 1-2: Support (T2)
    // Perks 3-4: Combat (T1)
    // Perk 5: Choice
    if (perkIndex === 1 || perkIndex === 2) return 'T2';
    if (perkIndex === 3 || perkIndex === 4) return 'T1';
    // Perk 5 is a choice, default to T1 for now
    return 'T1';
}

export function canShiftPerkCategory(origin: Origin | null, perkIndex: number): boolean {
    // Emergency: can shift perk rolls to combat perk group for free
    if (origin?.name === 'Emergency') return true;
    return false;
}
