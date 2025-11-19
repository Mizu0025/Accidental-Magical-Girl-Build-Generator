import type { BuildState } from './buildState';
import type { CoinType } from './mechanics';
import { specializationMap, powerMap, perkData } from '../data/gameData';

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
            needsChoice: true,
            choicePrompt: {
                title: 'Adjust Body Roll',
                description: 'Choose to increase or decrease your body roll by 2.',
                options: [
                    { value: 2, label: '+2 to Roll' },
                    { value: -2, label: '-2 to Roll' },
                ],
            },
            apply: (b, choiceValue) => {
                const adjustment = (choiceValue as number) || 2;
                const newRoll = Math.min(20, Math.max(1, b.rolls.body + adjustment));
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
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Body Type',
                description: 'Select your character\'s body type.',
                options: [
                    { value: 3, label: 'Underdeveloped', description: 'Choose +1 LCK or +1 MAG' },
                    { value: 10, label: 'Average', description: 'Choose +1 AGI or +1 VIT' },
                    { value: 17, label: 'Overdeveloped', description: 'Choose +1 STR or +1 VIT' },
                ],
            },
            apply: (b, choiceValue) => {
                const targetRoll = (choiceValue as number) || 10;
                return {
                    ...b,
                    rolls: { ...b.rolls, body: targetRoll },
                    coinsSpent: { ...b.coinsSpent, body: 'Silver' },
                };
            },
        },
    ];
}

// Specialization coin effects
export function getSpecializationCoinEffects(build: BuildState): CoinEffect[] {
    const currentRoll = build.rolls.specialization;
    const currentSpec = specializationMap[currentRoll];

    // Calculate adjacent specializations for Silver
    const adjacentOptions: Array<{ value: number; label: string; description: string }> = [];

    if (currentRoll >= 19) {
        // Special case for 19-20: can only swap between them
        const otherRoll = currentRoll === 19 ? 20 : 19;
        const otherSpec = specializationMap[otherRoll];
        adjacentOptions.push({
            value: otherRoll,
            label: otherSpec.name,
            description: otherSpec.mods.map(m => m.text).join(', '),
        });
    } else {
        // Normal case: can swap to +1 or -1
        const prevRoll = currentRoll === 1 ? 18 : currentRoll - 1;
        const nextRoll = currentRoll === 18 ? 1 : currentRoll + 1;

        const prevSpec = specializationMap[prevRoll];
        const nextSpec = specializationMap[nextRoll];

        adjacentOptions.push(
            {
                value: prevRoll,
                label: prevSpec.name,
                description: prevSpec.mods.map(m => m.text).join(', '),
            },
            {
                value: nextRoll,
                label: nextSpec.name,
                description: nextSpec.mods.map(m => m.text).join(', '),
            }
        );
    }

    return [
        {
            type: 'Bronze',
            description: '±1 to roll',
            needsChoice: true,
            choicePrompt: {
                title: 'Adjust Specialization Roll',
                description: 'Choose to increase or decrease your specialization roll by 1.',
                options: [
                    { value: 1, label: '+1 to Roll' },
                    { value: -1, label: '-1 to Roll' },
                ],
            },
            apply: (b, choiceValue) => {
                const adjustment = (choiceValue as number) || 1;
                const newRoll = Math.min(20, Math.max(1, b.rolls.specialization + adjustment));
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
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Adjacent Specialization',
                description: `Current: ${currentSpec.name}. Choose an adjacent specialization.`,
                options: adjacentOptions,
            },
            apply: (b, choiceValue) => {
                const newRoll = (choiceValue as number) || b.rolls.specialization;
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
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Any Specialization',
                description: 'Select any specialization you want.',
                options: Object.entries(specializationMap).map(([roll, spec]) => ({
                    value: parseInt(roll),
                    label: spec.name,
                    description: spec.mods.map(m => m.text).join(', '),
                })),
            },
            apply: (b, choiceValue) => {
                const newRoll = (choiceValue as number) || 1;
                return {
                    ...b,
                    rolls: { ...b.rolls, specialization: newRoll },
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
            needsChoice: true,
            choicePrompt: {
                title: 'Adjust Weapon Roll',
                description: 'Choose to increase or decrease your weapon roll by 4.',
                options: [
                    { value: 4, label: '+4 to Roll' },
                    { value: -4, label: '-4 to Roll' },
                ],
            },
            apply: (b, choiceValue) => {
                const adjustment = (choiceValue as number) || 4;
                const newRoll = Math.min(20, Math.max(1, b.rolls.weapon + adjustment));
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
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Weapon Type',
                description: 'Select your weapon type.',
                options: [
                    { value: 3, label: 'Melee', description: '+1 STR, +1 VIT' },
                    { value: 8, label: 'Ranged', description: '+1 AGI' },
                    { value: 13, label: 'Mystic', description: '+1 MAG' },
                    { value: 18, label: 'Fist', description: '+2 STR' },
                ],
            },
            apply: (b, choiceValue) => {
                const targetRoll = (choiceValue as number) || 3;
                return {
                    ...b,
                    rolls: { ...b.rolls, weapon: targetRoll },
                    coinsSpent: { ...b.coinsSpent, weapon: 'Silver' },
                };
            },
        },
        {
            type: 'Gold',
            description: 'Get second weapon',
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Second Weapon',
                description: 'Select a second weapon type to add to your arsenal.',
                options: [
                    { value: 3, label: 'Melee', description: '+1 STR, +1 VIT' },
                    { value: 8, label: 'Ranged', description: '+1 AGI' },
                    { value: 13, label: 'Mystic', description: '+1 MAG' },
                    { value: 18, label: 'Fist', description: '+2 STR' },
                ],
            },
            apply: (b, choiceValue) => {
                const targetRoll = (choiceValue as number) || 3;
                return {
                    ...b,
                    choices: {
                        ...b.choices,
                        secondWeapon: targetRoll,
                    },
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
            needsChoice: true,
            choicePrompt: {
                title: 'Adjust Outfit Roll',
                description: 'Choose to increase or decrease your outfit roll by 4.',
                options: [
                    { value: 4, label: '+4 to Roll' },
                    { value: -4, label: '-4 to Roll' },
                ],
            },
            apply: (b, choiceValue) => {
                const adjustment = (choiceValue as number) || 4;
                const newRoll = Math.min(20, Math.max(1, b.rolls.outfit + adjustment));
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
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Outfit Style',
                description: 'Select your outfit style.',
                options: [
                    { value: 3, label: 'Skimpy', description: '+1 AGI' },
                    { value: 8, label: 'Flowing', description: '+1 STR' },
                    { value: 13, label: 'Elaborate', description: '+1 MAG' },
                    { value: 18, label: 'Uniform', description: '+1 VIT' },
                ],
            },
            apply: (b, choiceValue) => {
                const targetRoll = (choiceValue as number) || 8;
                return {
                    ...b,
                    rolls: { ...b.rolls, outfit: targetRoll },
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
            needsChoice: true,
            choicePrompt: {
                title: 'Adjust Power Roll',
                description: 'Choose to increase or decrease your power roll by 2.',
                options: [
                    { value: 2, label: '+2 to Roll' },
                    { value: -2, label: '-2 to Roll' },
                ],
            },
            apply: (b, choiceValue) => {
                const adjustment = (choiceValue as number) || 2;
                const newRoll = Math.min(20, Math.max(1, b.rolls.power + adjustment));
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
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Any Power',
                description: 'Select any power you want.',
                options: Object.entries(powerMap).map(([range, power]) => {
                    const midRoll = parseInt(range.split('-')[0]);
                    return {
                        value: midRoll,
                        label: power.name,
                        description: power.effect,
                    };
                }),
            },
            apply: (b, choiceValue) => {
                const targetRoll = (choiceValue as number) || 3;
                return {
                    ...b,
                    rolls: { ...b.rolls, power: targetRoll },
                    coinsSpent: { ...b.coinsSpent, power: 'Silver' },
                };
            },
        },
        {
            type: 'Gold',
            description: 'Get second power',
            needsChoice: true,
            choicePrompt: {
                title: 'Choose Second Power',
                description: 'Select a second power to add to your abilities.',
                options: Object.entries(powerMap).map(([range, power]) => {
                    const midRoll = parseInt(range.split('-')[0]);
                    return {
                        value: midRoll,
                        label: power.name,
                        description: power.effect,
                    };
                }),
            },
            apply: (b, choiceValue) => {
                const targetRoll = (choiceValue as number) || 3;
                return {
                    ...b,
                    choices: {
                        ...b.choices,
                        secondPower: targetRoll,
                    },
                    coinsSpent: { ...b.coinsSpent, power: 'Gold' },
                };
            },
        },
    ];
}

// Perk coin effects
export function getPerkCoinEffects(build: BuildState, perkIndex: number): CoinEffect[] {
    const category = build.choices.perkCategories[perkIndex];
    const perks = perkData[category];

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
            needsChoice: true,
            choicePrompt: {
                title: `Choose ${category === 'T1' ? 'Combat' : 'Support'} Perk`,
                description: `Select any perk from the ${category === 'T1' ? 'Combat' : 'Support'} category.`,
                options: Object.entries(perks).map(([roll, perk]) => ({
                    value: parseInt(roll),
                    label: perk.name,
                    description: perk.statMod?.text,
                })),
            },
            apply: (b, choiceValue) => {
                const targetRoll = (choiceValue as number) || 1;
                const newPerks = [...b.rolls.perks];
                newPerks[perkIndex] = targetRoll;

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
            needsChoice: true,
            choicePrompt: {
                title: 'Choose First Bonus Perk',
                description: 'Select the first bonus perk from either Combat or Support category.',
                options: [
                    ...Object.entries(perkData.T1).map(([roll, perk]) => ({
                        value: `T1-${roll}`,
                        label: `[Combat] ${perk.name}`,
                        description: perk.statMod?.text,
                    })),
                    ...Object.entries(perkData.T2).map(([roll, perk]) => ({
                        value: `T2-${roll}`,
                        label: `[Support] ${perk.name}`,
                        description: perk.statMod?.text,
                    })),
                ],
            },
            apply: (b, choiceValue) => {
                // This is the first step - we'll need to handle the second step in BuildRoller
                // For now, store a pending state that BuildRoller will handle
                const [category, roll] = (choiceValue as string).split('-');

                const newCoinsSpent = { ...b.coinsSpent };
                if (!newCoinsSpent.perks) newCoinsSpent.perks = [null, null, null, null, null];
                newCoinsSpent.perks[perkIndex] = 'Gold' as any;

                const newBonusPerks = [...(b.choices.bonusPerks || [])];
                newBonusPerks.push({
                    category: category as 'T1' | 'T2',
                    roll: parseInt(roll),
                });

                return {
                    ...b,
                    choices: {
                        ...b.choices,
                        bonusPerks: newBonusPerks,
                    },
                    coinsSpent: newCoinsSpent,
                };
            },
        },
    ];
}
