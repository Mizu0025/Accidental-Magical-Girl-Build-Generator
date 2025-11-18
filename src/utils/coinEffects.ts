import type { BuildState } from './buildState';
import type { CoinType } from './mechanics';

// Coin spending effects for each category

export function canSpendCoin(
    category: string,
    coinType: CoinType,
    build: BuildState,
    availableCoins: { Bronze: number; Silver: number; Gold: number }
): boolean {
    // Check if coin is available
    if (availableCoins[coinType] <= 0) return false;

    // Check if already spent a coin on this category
    const spent = (build.coinsSpent as any)[category];
    if (spent) return false;

    return true;
}

export interface CoinEffect {
    type: CoinType;
    description: string;
    needsChoice?: boolean;
    choicePrompt?: {
        title: string;
        description: string;
        options: Array<{ value: string | number; label: string; description?: string }>;
    };
    apply: (build: BuildState, choiceValue?: string | number) => BuildState | null;
}

// Age coin effects
export function getAgeCoinEffects(build: BuildState): CoinEffect[] {
    return [
        {
            type: 'Bronze',
            description: '±1 year',
            needsChoice: true,
            choicePrompt: {
                title: 'Adjust Age',
                description: 'Choose to increase or decrease age by 1 year.',
                options: [
                    { value: 1, label: '+1 Year' },
                    { value: -1, label: '-1 Year' },
                ],
            },
            apply: (b, choiceValue) => {
                const adjustment = (choiceValue as number) || 1;
                const newRoll = Math.min(20, Math.max(1, b.rolls.age + adjustment));
                return {
                    ...b,
                    rolls: { ...b.rolls, age: newRoll },
                    coinsSpent: { ...b.coinsSpent, age: 'Bronze' },
                };
            },
        },
        {
            type: 'Silver',
            description: 'Pick age 7-16',
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Age',
                description: 'Select your character\'s age (7-16 years old).',
                options: Array.from({ length: 10 }, (_, i) => ({
                    value: i + 7,
                    label: `${i + 7} years old`,
                })),
            },
            apply: (b, choiceValue) => {
                const targetAge = (choiceValue as number) || 12;
                const newRoll = targetAge > 10 ? targetAge - 6 + 10 : targetAge - 6;
                return {
                    ...b,
                    rolls: { ...b.rolls, age: newRoll },
                    coinsSpent: { ...b.coinsSpent, age: 'Silver' },
                };
            },
        },
        {
            type: 'Gold',
            description: 'Pick any age',
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Any Age',
                description: 'Select your character\'s age (any value).',
                options: Array.from({ length: 20 }, (_, i) => ({
                    value: i + 1,
                    label: `${i + 1} years old`,
                })),
            },
            apply: (b, choiceValue) => {
                const targetAge = (choiceValue as number) || 16;
                const newRoll = targetAge > 10 ? targetAge - 6 + 10 : targetAge - 6;
                return {
                    ...b,
                    rolls: { ...b.rolls, age: newRoll },
                    coinsSpent: { ...b.coinsSpent, age: 'Gold' },
                };
            },
        },
    ];
}

// Body coin effects
export function getBodyCoinEffects(build: BuildState): CoinEffect[] {
    return [
        {
            type: 'Bronze',
            description: '±2 to roll',
            apply: (b) => {
                // Add 2 to roll (user would need UI to choose +/-)
                const newRoll = Math.min(20, Math.max(1, b.rolls.body + 2));
                return {
                    ...b,
                    rolls: { ...b.rolls, body: newRoll },
                    coinsSpent: { ...b.coinsSpent, body: 'Bronze' },
                };
            },
        },
        {
            type: 'Silver',
            description: 'Pick body type',
            apply: (b) => {
                // Would need UI to pick body type
                // For now, set to Average (roll 10)
                return {
                    ...b,
                    rolls: { ...b.rolls, body: 10 },
                    coinsSpent: { ...b.coinsSpent, body: 'Silver' },
                };
            },
        },
    ];
}

// Specialization coin effects
export function getSpecializationCoinEffects(build: BuildState): CoinEffect[] {
    return [
        {
            type: 'Bronze',
            description: '±1 to roll',
            apply: (b) => {
                const newRoll = Math.min(20, Math.max(1, b.rolls.specialization + 1));
                return {
                    ...b,
                    rolls: { ...b.rolls, specialization: newRoll },
                    coinsSpent: { ...b.coinsSpent, specialization: 'Bronze' },
                };
            },
        },
        {
            type: 'Silver',
            description: 'Swap to adjacent spec',
            apply: (b) => {
                // Swap to next specialization (with wrapping for 19-20)
                let newRoll = b.rolls.specialization + 1;
                if (b.rolls.specialization >= 19) {
                    newRoll = b.rolls.specialization === 19 ? 20 : 19;
                } else if (newRoll > 20) {
                    newRoll = 1;
                }
                return {
                    ...b,
                    rolls: { ...b.rolls, specialization: newRoll },
                    coinsSpent: { ...b.coinsSpent, specialization: 'Silver' },
                };
            },
        },
        {
            type: 'Gold',
            description: 'Pick any spec',
            apply: (b) => {
                // Would need UI to pick
                // Default to Fire (1)
                return {
                    ...b,
                    rolls: { ...b.rolls, specialization: 1 },
                    coinsSpent: { ...b.coinsSpent, specialization: 'Gold' },
                };
            },
        },
    ];
}

// Weapon coin effects
export function getWeaponCoinEffects(build: BuildState): CoinEffect[] {
    return [
        {
            type: 'Bronze',
            description: '±4 to roll',
            apply: (b) => {
                const newRoll = Math.min(20, Math.max(1, b.rolls.weapon + 4));
                return {
                    ...b,
                    rolls: { ...b.rolls, weapon: newRoll },
                    coinsSpent: { ...b.coinsSpent, weapon: 'Bronze' },
                };
            },
        },
        {
            type: 'Silver',
            description: 'Pick weapon type',
            apply: (b) => {
                // Default to Melee (roll 3)
                return {
                    ...b,
                    rolls: { ...b.rolls, weapon: 3 },
                    coinsSpent: { ...b.coinsSpent, weapon: 'Silver' },
                };
            },
        },
        {
            type: 'Gold',
            description: 'Get second weapon',
            apply: (b) => {
                // Would need to track second weapon in build state
                // For now, just mark as spent
                return {
                    ...b,
                    coinsSpent: { ...b.coinsSpent, weapon: 'Gold' },
                };
            },
        },
    ];
}

// Outfit coin effects
export function getOutfitCoinEffects(build: BuildState): CoinEffect[] {
    return [
        {
            type: 'Bronze',
            description: '±4 to roll',
            apply: (b) => {
                const newRoll = Math.min(20, Math.max(1, b.rolls.outfit + 4));
                return {
                    ...b,
                    rolls: { ...b.rolls, outfit: newRoll },
                    coinsSpent: { ...b.coinsSpent, outfit: 'Bronze' },
                };
            },
        },
        {
            type: 'Silver',
            description: 'Pick outfit style',
            apply: (b) => {
                // Default to Flowing (roll 8)
                return {
                    ...b,
                    rolls: { ...b.rolls, outfit: 8 },
                    coinsSpent: { ...b.coinsSpent, outfit: 'Silver' },
                };
            },
        },
    ];
}

// Power coin effects
export function getPowerCoinEffects(build: BuildState): CoinEffect[] {
    return [
        {
            type: 'Bronze',
            description: '±2 to roll',
            apply: (b) => {
                const newRoll = Math.min(20, Math.max(1, b.rolls.power + 2));
                return {
                    ...b,
                    rolls: { ...b.rolls, power: newRoll },
                    coinsSpent: { ...b.coinsSpent, power: 'Bronze' },
                };
            },
        },
        {
            type: 'Silver',
            description: 'Pick any power',
            apply: (b) => {
                // Default to Hammerspace (roll 3)
                return {
                    ...b,
                    rolls: { ...b.rolls, power: 3 },
                    coinsSpent: { ...b.coinsSpent, power: 'Silver' },
                };
            },
        },
        {
            type: 'Gold',
            description: 'Get second power',
            apply: (b) => {
                // Would need to track second power
                return {
                    ...b,
                    coinsSpent: { ...b.coinsSpent, power: 'Gold' },
                };
            },
        },
    ];
}

// Perk coin effects
export function getPerkCoinEffects(build: BuildState, perkIndex: number): CoinEffect[] {
    const category = build.choices.perkCategories[perkIndex];

    return [
        {
            type: 'Bronze',
            description: 'Shift category',
            apply: (b) => {
                const newCategories = [...b.choices.perkCategories];
                newCategories[perkIndex] = category === 'T1' ? 'T2' : 'T1';

                const newCoinsSpent = { ...b.coinsSpent };
                if (!newCoinsSpent.perks) newCoinsSpent.perks = [null, null, null, null, null];
                newCoinsSpent.perks[perkIndex] = 'Bronze';

                return {
                    ...b,
                    choices: { ...b.choices, perkCategories: newCategories as any },
                    coinsSpent: newCoinsSpent,
                };
            },
        },
        {
            type: 'Silver',
            description: 'Pick from category',
            apply: (b) => {
                // Would need UI to pick perk
                // Default to first perk in category
                const newPerks = [...b.rolls.perks];
                newPerks[perkIndex] = 1;

                const newCoinsSpent = { ...b.coinsSpent };
                if (!newCoinsSpent.perks) newCoinsSpent.perks = [null, null, null, null, null];
                newCoinsSpent.perks[perkIndex] = 'Silver';

                return {
                    ...b,
                    rolls: { ...b.rolls, perks: newPerks as any },
                    coinsSpent: newCoinsSpent,
                };
            },
        },
        {
            type: 'Gold',
            description: 'Pick 2 bonus perks',
            apply: (b) => {
                // Would need UI to pick 2 perks
                const newCoinsSpent = { ...b.coinsSpent };
                if (!newCoinsSpent.perks) newCoinsSpent.perks = [null, null, null, null, null];
                newCoinsSpent.perks[perkIndex] = 'Gold' as any; // Gold is valid for perks

                return {
                    ...b,
                    coinsSpent: newCoinsSpent,
                };
            },
        },
    ];
}
