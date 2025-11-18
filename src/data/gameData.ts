// --- TYPE DEFINITIONS ---

export interface StatMod {
    stat: 'STR' | 'AGI' | 'VIT' | 'MAG' | 'LCK' | 'Choice';
    mod: number;
    text: string;
    type?: 'Fixed' | 'Weapon' | 'Spec';
}

export interface BodyOption {
    type: string;
    options: StatMod[];
}

export interface Specialization {
    name: string;
    mods: StatMod[];
}

export interface Weapon {
    name: string;
    mods: StatMod[];
}

export interface Outfit {
    name: string;
    mods: StatMod[];
}

export interface Power {
    name: string;
    effect: string;
    isChoice: boolean;
    choice?: StatMod[];
    penalty?: number;
}

export interface Perk {
    name: string;
    statMod?: StatMod;
}

export interface Origin {
    name: string;
    bonus: string;
    negative: string;
}

export interface Stats {
    STR: number;
    AGI: number;
    VIT: number;
    MAG: number;
    LCK: number;
}

// --- GAME DATA ---

export const initialStats: Stats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };

export const coinValues = { Bronze: 1, Silver: 2, Gold: 3 };

// Roll 2: Body (1-6: Underdeveloped, 7-14: Average, 15-20: Overdeveloped)
export const bodyMap: Record<string, BodyOption> = {
    '1-6': {
        type: 'Underdeveloped',
        options: [
            { stat: 'LCK', mod: 1, text: '+1 LCK' },
            { stat: 'MAG', mod: 1, text: '+1 MAG' },
        ],
    },
    '7-14': {
        type: 'Average',
        options: [
            { stat: 'AGI', mod: 1, text: '+1 AGI' },
            { stat: 'VIT', mod: 1, text: '+1 VIT' },
        ],
    },
    '15-20': {
        type: 'Overdeveloped',
        options: [
            { stat: 'STR', mod: 1, text: '+1 STR' },
            { stat: 'VIT', mod: 1, text: '+1 VIT' },
        ],
    },
};

// Roll 3: Specialization (Exact Key Map: 1-20)
export const specializationMap: Record<number, Specialization> = {
    1: {
        name: 'Fire',
        mods: [
            { stat: 'STR', mod: 3, text: '+3 STR' },
            { stat: 'MAG', mod: 3, text: '+3 MAG' },
        ],
    },
    2: {
        name: 'Ice',
        mods: [
            { stat: 'STR', mod: 2, text: '+2 STR' },
            { stat: 'MAG', mod: 2, text: '+2 MAG' },
            { stat: 'VIT', mod: 1, text: '+1 VIT (Fixed)' },
        ],
    },
    3: {
        name: 'Air',
        mods: [{ stat: 'AGI', mod: 4, text: '+4 AGI (Fixed)' }],
    },
    4: {
        name: 'Spirit',
        mods: [
            { stat: 'MAG', mod: 1, text: '+1 MAG' },
            { stat: 'LCK', mod: 2, text: '+2 LCK (Fixed)' },
        ],
    },
    5: {
        name: 'Reinforcement',
        mods: [
            { stat: 'STR', mod: 1, text: '+1 STR (Fixed)' },
            { stat: 'AGI', mod: 1, text: '+1 AGI' },
            { stat: 'VIT', mod: 1, text: '+1 VIT' },
            { stat: 'LCK', mod: 1, text: '+1 LCK (Fixed)' },
        ],
    },
    6: {
        name: 'Psychic',
        mods: [
            { stat: 'MAG', mod: 2, text: '+2 MAG (Fixed)' },
            { stat: 'LCK', mod: 2, text: '+2 LCK (Fixed)' },
        ],
    },
    7: {
        name: 'Time',
        mods: [
            { stat: 'AGI', mod: 1, text: '+1 AGI' },
            { stat: 'VIT', mod: 2, text: '+2 VIT (Fixed)' },
        ],
    },
    8: {
        name: 'Lightning',
        mods: [
            { stat: 'STR', mod: 1, text: '+1 STR' },
            { stat: 'MAG', mod: 1, text: '+1 MAG' },
            { stat: 'AGI', mod: 2, text: '+2 AGI (Fixed)' },
        ],
    },
    9: {
        name: 'Water',
        mods: [
            { stat: 'MAG', mod: 2, text: '+2 MAG' },
            { stat: 'VIT', mod: 2, text: '+2 VIT (Fixed)' },
        ],
    },
    10: {
        name: 'Earth',
        mods: [
            { stat: 'STR', mod: 2, text: '+2 STR' },
            { stat: 'VIT', mod: 2, text: '+2 VIT (Fixed)' },
        ],
    },
    11: {
        name: 'Darkness',
        mods: [
            { stat: 'MAG', mod: 3, text: '+3 MAG' },
            { stat: 'LCK', mod: 1, text: '+1 LCK (Fixed)' },
        ],
    },
    12: {
        name: 'Light',
        mods: [
            { stat: 'MAG', mod: 3, text: '+3 MAG' },
            { stat: 'LCK', mod: 1, text: '+1 LCK (Fixed)' },
        ],
    },
    13: {
        name: 'Healing',
        mods: [
            { stat: 'VIT', mod: 2, text: '+2 VIT' },
            { stat: 'MAG', mod: 1, text: '+1 MAG (Fixed)' },
        ],
    },
    14: {
        name: 'Weapon Master',
        mods: [
            { stat: 'STR', mod: 2, text: '+2 STR' },
            { stat: 'AGI', mod: 2, text: '+2 AGI' },
        ],
    },
    15: {
        name: 'Trap Master',
        mods: [
            { stat: 'AGI', mod: 2, text: '+2 AGI' },
            { stat: 'LCK', mod: 2, text: '+2 LCK' },
        ],
    },
    16: {
        name: 'Beast Master',
        mods: [
            { stat: 'VIT', mod: 2, text: '+2 VIT' },
            { stat: 'MAG', mod: 2, text: '+2 MAG' },
        ],
    },
    17: {
        name: 'Aura',
        mods: [
            { stat: 'STR', mod: 1, text: '+1 STR (Fixed)' },
            { stat: 'VIT', mod: 3, text: '+3 VIT' },
        ],
    },
    18: {
        name: 'Alchemy',
        mods: [
            { stat: 'MAG', mod: 3, text: '+3 MAG (Fixed)' },
            { stat: 'LCK', mod: 1, text: '+1 LCK (Fixed)' },
        ],
    },
    19: {
        name: 'Symmetry',
        mods: [
            { stat: 'STR', mod: 3, text: '+3 STR' },
            { stat: 'LCK', mod: 3, text: '+3 LCK' },
        ],
    },
    20: {
        name: 'Oddball',
        mods: [
            { stat: 'Choice', mod: 2, text: '+2 to one stat' },
            { stat: 'Choice', mod: 1, text: '+1 to one other stat' },
        ],
    },
};

// Roll 4: Weapon (Range Key Map)
export const weaponMap: Record<string, Weapon> = {
    '1-5': {
        name: 'Melee',
        mods: [
            { stat: 'STR', mod: 1, text: '+1 STR' },
            { stat: 'VIT', mod: 1, text: '+1 VIT' },
        ],
    },
    '6-10': {
        name: 'Ranged',
        mods: [{ stat: 'AGI', mod: 1, text: '+1 AGI' }],
    },
    '11-15': {
        name: 'Mystic',
        mods: [{ stat: 'MAG', mod: 1, text: '+1 MAG' }],
    },
    '16-20': {
        name: 'Fist',
        mods: [{ stat: 'STR', mod: 2, text: '+2 STR' }],
    },
};

// Roll 5: Outfit (Range Key Map)
export const outfitMap: Record<string, Outfit> = {
    '1-5': {
        name: 'Skimpy',
        mods: [{ stat: 'AGI', mod: 1, text: '+1 AGI' }],
    },
    '6-10': {
        name: 'Flowing',
        mods: [{ stat: 'STR', mod: 1, text: '+1 STR' }],
    },
    '11-15': {
        name: 'Elaborate',
        mods: [{ stat: 'MAG', mod: 1, text: '+1 MAG' }],
    },
    '16-20': {
        name: 'Uniform',
        mods: [{ stat: 'VIT', mod: 1, text: '+1 VIT' }],
    },
};

// Roll 6: Power (Range Key Map)
export const powerMap: Record<string, Power> = {
    '1-2': {
        name: 'Killing Blow',
        effect: 'Overwhelming attack, +1 STR or MAG (Choice)',
        isChoice: true,
        choice: [
            { stat: 'STR', mod: 1, text: '+1 STR' },
            { stat: 'MAG', mod: 1, text: '+1 MAG' },
        ],
    },
    '3-4': {
        name: 'Hammerspace',
        effect: 'Extra-dimensional storage.',
        isChoice: false,
    },
    '5-6': {
        name: 'Twinned Soul',
        effect: 'Splits body/mind. Applies -1 to ALL stats.',
        isChoice: false,
        penalty: -1,
    },
    '7-8': {
        name: 'Focused Assault',
        effect: 'Focus/punish target.',
        isChoice: false,
    },
    '9-10': {
        name: 'Barrage',
        effect: 'Put out a lot of fire.',
        isChoice: false,
    },
    '11-12': {
        name: 'Power of Friendship',
        effect: 'Instinctive sense when people are sad.',
        isChoice: false,
    },
    '13-14': {
        name: 'Duplication',
        effect: 'Split off duplicates.',
        isChoice: false,
    },
    '15-16': {
        name: 'Third Eye',
        effect: 'See magic, pierce illusions.',
        isChoice: false,
    },
    '17-18': {
        name: 'Regeneration',
        effect: 'Heal & recover faster.',
        isChoice: false,
    },
    '19-20': {
        name: 'Tentacles',
        effect: 'Command of something tentacle-like.',
        isChoice: false,
    },
};

// Rolls 7-11: Perks (T1=Combat, T2=Support)
export const perkData = {
    T1: {
        // Combat
        1: { name: 'Dual Weapon', statMod: { stat: 'AGI' as const, mod: 1, type: 'Weapon' as const, text: '+1 AGI' } },
        2: { name: 'Martial Training', statMod: { stat: 'STR' as const, mod: 1, type: 'Fixed' as const, text: '+1 STR' } },
        3: { name: 'Enhanced Weapon', statMod: { stat: 'STR' as const, mod: 1, type: 'Fixed' as const, text: '+1 STR' } },
        4: { name: 'Mystic Artifact/Gifted', statMod: { stat: 'MAG' as const, mod: 1, type: 'Spec' as const, text: '+1 MAG' } },
        5: { name: 'Flexibility', statMod: { stat: 'AGI' as const, mod: 1, type: 'Fixed' as const, text: '+1 AGI' } },
        6: { name: 'Enhanced Transformation' },
        7: { name: 'Disguise Artifact' },
        8: { name: 'Hammerspace Handbag' },
        9: { name: 'Healing Artifact' },
        10: { name: 'Monstrous Metamorphosis' },
        11: { name: 'Enhanced Sustenance', statMod: { stat: 'VIT' as const, mod: 1, type: 'Fixed' as const, text: '+1 VIT' } },
        12: { name: 'Wings' },
        13: { name: 'Purification Artifact' },
        14: { name: 'Awareness' },
        15: { name: 'Sorcery', statMod: { stat: 'MAG' as const, mod: 1, type: 'Fixed' as const, text: '+1 MAG' } },
        16: { name: 'Interdimensional Tourist' },
        17: { name: 'Training' },
        18: { name: 'Incognito' },
        19: { name: 'Get out of Jail' },
        20: { name: 'Big Damn Hero' },
    },
    T2: {
        // Support
        1: { name: 'Interdimensional Tourist' },
        2: { name: 'Closure', statMod: { stat: 'LCK' as const, mod: 1, type: 'Fixed' as const, text: '+1 LCK' } },
        3: { name: 'Fated', statMod: { stat: 'LCK' as const, mod: 1, type: 'Fixed' as const, text: '+1 LCK' } },
        4: { name: 'Training' },
        5: { name: 'Interdimensional Home' },
        6: { name: 'Incognito' },
        7: { name: 'Environmental Sealing' },
        8: { name: 'Get out of Jail' },
        9: { name: 'Big Damn Hero' },
        10: { name: 'Absolute Direction' },
        11: { name: 'Big Backpack' },
        12: { name: 'Natural Aging' },
        13: { name: 'Masculinity', statMod: { stat: 'LCK' as const, mod: 1, type: 'Fixed' as const, text: '+1 LCK' } },
        14: { name: 'Overcity Shift' },
        15: { name: 'Money' },
        16: { name: 'Familiar' },
        17: { name: 'Soul Jar' },
        18: { name: 'Eternal Style' },
        19: { name: 'A Way Out', statMod: { stat: 'LCK' as const, mod: 1, type: 'Fixed' as const, text: '+1 LCK' } },
        20: { name: 'Fake Parents' },
    },
};

// Origins
export const origins: Origin[] = [
    {
        name: 'Contract',
        bonus: 'free pick on uniform and perk 5, ignoring roll results',
        negative: 'None',
    },
    {
        name: 'Smug',
        bonus: 'free pick for every choice',
        negative: 'only get 2 silver and 3 bronze coins',
    },
    {
        name: 'Weapon',
        bonus: 'free pick for weapon, additional +1 to one of the weapon stats',
        negative: 'None',
    },
    {
        name: 'Emergency',
        bonus: 'free pick on two non-artifact combat perks, can shift perk rolls to combat perk group for free',
        negative: 'None',
    },
    {
        name: 'Artifact',
        bonus: 'replace any perk roll with an artifact',
        negative: 'None',
    },
    {
        name: 'Death',
        bonus: 'extra silver coin',
        negative: 'None',
    },
];
