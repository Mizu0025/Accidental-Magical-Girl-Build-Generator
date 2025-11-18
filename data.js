// --- CYOA DATA MAPPING ---

const initialStats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };
const coinValues = { Bronze: 1, Silver: 2, Gold: 3 };

// Roll 2: Body (1-6: Underdeveloped, 7-14: Average, 15-20: Overdeveloped)
const bodyMap = {
    '1-6': { type: 'Underdeveloped', options: [{ stat: 'LCK', mod: 1, text: '+1 LCK' }, { stat: 'MAG', mod: 1, text: '+1 MAG' }] },
    '7-14': { type: 'Average', options: [{ stat: 'AGI', mod: 1, text: '+1 AGI' }, { stat: 'VIT', mod: 1, text: '+1 VIT' }] },
    '15-20': { type: 'Overdeveloped', options: [{ stat: 'STR', mod: 1, text: '+1 STR' }, { stat: 'VIT', mod: 1, text: '+1 VIT' }] },
};

// Roll 3: Specialization (Exact Key Map: 1-20)
const specializationMap = {
    1: { name: 'Fire', mods: [{ stat: 'STR', mod: 3, text: '+3 STR' }, { stat: 'MAG', mod: 3, text: '+3 MAG' }] },
    2: { name: 'Ice', mods: [{ stat: 'STR', mod: 2, text: '+2 STR' }, { stat: 'MAG', mod: 2, text: '+2 MAG' }, { stat: 'VIT', mod: 1, text: '+1 VIT (Fixed)' }] },
    3: { name: 'Air', mods: [{ stat: 'AGI', mod: 4, text: '+4 AGI (Fixed)' }] },
    4: { name: 'Spirit', mods: [{ stat: 'MAG', mod: 1, text: '+1 MAG' }, { stat: 'LCK', mod: 2, text: '+2 LCK (Fixed)' }] },
    5: { name: 'Reinforcement', mods: [{ stat: 'STR', mod: 1, text: '+1 STR (Fixed)' }, { stat: 'AGI', mod: 1, text: '+1 AGI' }, { stat: 'VIT', mod: 1, text: '+1 VIT' }, { stat: 'LCK', mod: 1, text: '+1 LCK (Fixed)' }] },
    6: { name: 'Psychic', mods: [{ stat: 'MAG', mod: 2, text: '+2 MAG (Fixed)' }, { stat: 'LCK', mod: 2, text: '+2 LCK (Fixed)' }] },
    7: { name: 'Time', mods: [{ stat: 'AGI', mod: 1, text: '+1 AGI' }, { stat: 'VIT', mod: 2, text: '+2 VIT (Fixed)' }] },
    8: { name: 'Lightning', mods: [{ stat: 'STR', mod: 1, text: '+1 STR' }, { stat: 'MAG', mod: 1, text: '+1 MAG' }, { stat: 'AGI', mod: 2, text: '+2 AGI (Fixed)' }] },
    // Missing entries 9-18 were in original, adding placeholder/filling gaps:
    9: { name: 'Water', mods: [{ stat: 'MAG', mod: 2, text: '+2 MAG' }, { stat: 'VIT', mod: 2, text: '+2 VIT (Fixed)' }] },
    10: { name: 'Earth', mods: [{ stat: 'STR', mod: 2, text: '+2 STR' }, { stat: 'VIT', mod: 2, text: '+2 VIT (Fixed)' }] },
    11: { name: 'Darkness', mods: [{ stat: 'MAG', mod: 3, text: '+3 MAG' }, { stat: 'LCK', mod: 1, text: '+1 LCK (Fixed)' }] },
    12: { name: 'Light', mods: [{ stat: 'MAG', mod: 3, text: '+3 MAG' }, { stat: 'LCK', mod: 1, text: '+1 LCK (Fixed)' }] },
    13: { name: 'Healing', mods: [{ stat: 'VIT', mod: 2, text: '+2 VIT' }, { stat: 'MAG', mod: 1, text: '+1 MAG (Fixed)' }] },
    14: { name: 'Weapon Master', mods: [{ stat: 'STR', mod: 2, text: '+2 STR' }, { stat: 'AGI', mod: 2, text: '+2 AGI' }] },
    15: { name: 'Trap Master', mods: [{ stat: 'AGI', mod: 2, text: '+2 AGI' }, { stat: 'LCK', mod: 2, text: '+2 LCK' }] },
    16: { name: 'Beast Master', mods: [{ stat: 'VIT', mod: 2, text: '+2 VIT' }, { stat: 'MAG', mod: 2, text: '+2 MAG' }] },
    17: { name: 'Aura', mods: [{ stat: 'STR', mod: 1, text: '+1 STR (Fixed)' }, { stat: 'VIT', mod: 3, text: '+3 VIT' }] },
    18: { name: 'Alchemy', mods: [{ stat: 'MAG', mod: 3, text: '+3 MAG (Fixed)' }, { stat: 'LCK', mod: 1, text: '+1 LCK (Fixed)' }] },
    19: { name: 'Symmetry', mods: [{ stat: 'STR', mod: 3, text: '+3 STR' }, { stat: 'LCK', mod: 3, text: '+3 LCK' }] },
    20: { name: 'Oddball', mods: [{ stat: 'Choice', mod: 2, text: '+2 to one stat' }, { stat: 'Choice', mod: 1, text: '+1 to one other stat' }] },
};

// Roll 4: Weapon (Range Key Map)
const weaponMap = {
    '1-5': { name: 'Melee', mods: [{ stat: 'STR', mod: 1, text: '+1 STR' }, { stat: 'VIT', mod: 1, text: '+1 VIT' }] },
    '6-10': { name: 'Ranged', mods: [{ stat: 'AGI', mod: 1, text: '+1 AGI' }] },
    '11-15': { name: 'Mystic', mods: [{ stat: 'MAG', mod: 1, text: '+1 MAG' }] },
    '16-20': { name: 'Fist', mods: [{ stat: 'STR', mod: 2, text: '+2 STR' }] },
};

// Roll 5: Outfit (Range Key Map)
const outfitMap = {
    '1-5': { name: 'Skimpy', mods: [{ stat: 'AGI', mod: 1, text: '+1 AGI' }] },
    '6-10': { name: 'Flowing', mods: [{ stat: 'STR', mod: 1, text: '+1 STR' }] },
    '11-15': { name: 'Elaborate', mods: [{ stat: 'MAG', mod: 1, text: '+1 MAG' }] },
    '16-20': { name: 'Uniform', mods: [{ stat: 'VIT', mod: 1, text: '+1 VIT' }] },
};

// Roll 6: Power (Range Key Map)
const powerMap = {
    '1-2': { name: 'Killing Blow', effect: 'Overwhelming attack, +1 STR or MAG (Choice)', isChoice: true, choice: [{ stat: 'STR', mod: 1, text: '+1 STR' }, { stat: 'MAG', mod: 1, text: '+1 MAG' }] },
    '3-4': { name: 'Hammerspace', effect: 'Extra-dimensional storage.', isChoice: false },
    '5-6': { name: 'Twinned Soul', effect: 'Splits body/mind. Applies -1 to ALL stats.', isChoice: false, penalty: -1 },
    '7-8': { name: 'Focused Assault', effect: 'Focus/punish target.', isChoice: false },
    '9-10': { name: 'Barrage', effect: 'Put out a lot of fire.', isChoice: false },
    '11-12': { name: 'Power of Friendship', effect: 'Instinctive sense when people are sad.', isChoice: false },
    '13-14': { name: 'Duplication', effect: 'Split off duplicates.', isChoice: false },
    '15-16': { name: 'Third Eye', effect: 'See magic, pierce illusions.', isChoice: false },
    '17-18': { name: 'Regeneration', effect: 'Heal & recover faster.', isChoice: false },
    '19-20': { name: 'Tentacles', effect: 'Command of something tentacle-like.', isChoice: false },
};


// Rolls 7-11: Perks (T1=Combat, T2=Support)
const perkData = {
    T1: { // Combat (Stat mods are simplified: Weapon/Spec mods are mapped to AGI/MAG defaults)
        1: { name: 'Dual Weapon', statMod: { stat: 'AGI', mod: 1, type: 'Weapon' } },
        2: { name: 'Martial Training', statMod: { stat: 'STR', mod: 1, type: 'Fixed' } },
        3: { name: 'Enhanced Weapon', statMod: { stat: 'STR', mod: 1, type: 'Fixed' } },
        4: { name: 'Mystic Artifact/Gifted', statMod: { stat: 'MAG', mod: 1, type: 'Spec' } },
        5: { name: 'Flexibility', statMod: { stat: 'AGI', mod: 1, type: 'Fixed' } },
        11: { name: 'Enhanced Sustenance', statMod: { stat: 'VIT', mod: 1, type: 'Fixed' } },
        15: { name: 'Sorcery', statMod: { stat: 'MAG', mod: 1, type: 'Fixed' } },
        // Others without '†' stat mods (or complex ones simplified)
        6: { name: 'Enhanced Transformation' }, 7: { name: 'Disguise Artifact' }, 8: { name: 'Hammerspace Handbag' }, 9: { name: 'Healing Artifact' }, 10: { name: 'Monstrous Metamorphosis' }, 12: { name: 'Wings' }, 13: { name: 'Purification Artifact' }, 14: { name: 'Awareness' }, 16: { name: 'Interdimensional Tourist' }, 17: { name: 'Training' }, 18: { name: 'Incognito' }, 19: { name: 'Get out of Jail' }, 20: { name: 'Big Damn Hero' },
    },
    T2: { // Support
        2: { name: 'Closure', statMod: { stat: 'LCK', mod: 1, type: 'Fixed' } },
        3: { name: 'Fated', statMod: { stat: 'LCK', mod: 1, type: 'Fixed' } },
        13: { name: 'Masculinity', statMod: { stat: 'LCK', mod: 1, type: 'Fixed' } },
        19: { name: 'A Way Out', statMod: { stat: 'LCK', mod: 1, type: 'Fixed' } },
        // Others
        1: { name: 'Interdimensional Tourist' }, 4: { name: 'Training' }, 5: { name: 'Interdimensional Home' }, 6: { name: 'Incognito' }, 7: { name: 'Environmental Sealing' }, 8: { name: 'Get out of Jail' }, 9: { name: 'Big Damn Hero' }, 10: { name: 'Absolute Direction' }, 11: { name: 'Big Backpack' }, 12: { name: 'Natural Aging' }, 14: { name: 'Overcity Shift' }, 15: { name: 'Money' }, 16: { name: 'Familiar' }, 17: { name: 'Soul Jar' }, 18: { name: 'Eternal Style' }, 20: { name: 'Fake Parents' },
    },
};
