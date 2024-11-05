export const origins = [
  "A Contract",
  "Smug",
  "A Weapon",
  "An Emergency",
  "An Artifact",
  "A Death",
];

export const body = [
  { name: "Underdeveloped", bonus: { LCK: 1 } },
  { name: "Average", bonus: { AGI: 1 } },
  { name: "Overdeveloped", bonus: { STR: 1 } },
];

export const outfits = [
  { name: "Skimpy", bonus: { AGI: 1 } },
  { name: "Flowing", bonus: { STR: 1 } },
  { name: "Elaborate", bonus: { MAG: 1 } },
  { name: "Uniform", bonus: { VIT: 1 } },
];

export const weapons = [
  { name: "Melee", bonus: { STR: 1, VIT: 1 } },
  { name: "Ranged", bonus: { AGI: 1 } },
  { name: "Mystic", bonus: { MAG: 1 } },
  { name: "Fists", bonus: { STR: 2 } },
];

export const specializations = [
  "Fire",
  "Ice",
  "Air",
  "Spirit",
  "Reinforcement",
  "Time",
  "Lightning",
  "Sound",
  "Psychic",
  "Darkness",
  "Illusion",
  "Light",
  "Empathic",
  "Wood",
  "Water",
  "Gravity",
  "Earth",
  "Beast",
  "Metal",
  "Oddball",
];

export const powers = [
  { name: "Killing Blow", bonus: { STR: 1 } },
  { name: "Hammerspace", bonus: {} },
  {
    name: "Twinned Soul",
    bonus: { STR: -1, VIT: -1, AGI: -1, MAG: -1, LCK: -1 },
  },
  { name: "Focused Assault", bonus: {} },
  { name: "Barrage", bonus: {} },
  { name: "Power of Friendship", bonus: {} },
  { name: "Duplication", bonus: {} },
  { name: "Third Eye", bonus: {} },
  { name: "Regeneration", bonus: {} },
  { name: "Tentacles", bonus: {} },
];

export const combatPerks = [
  { name: "Dual Weapon", bonus: { AGI: 1 } },
  { name: "Martial Training", bonus: { STR: 1 } },
  { name: "Enhanced Weapon", bonus: { STR: 1 } },
  { name: "Mystic Artifact", bonus: {} },
  { name: "Gifted", bonus: { MAG: 1 } },
  { name: "Flexibility", bonus: { AGI: 1 } },
  { name: "Enhanced Transformation", bonus: {} },
  { name: "Disguise Artifact", bonus: {} },
  { name: "Blood Magic", bonus: { VIT: 1 } },
  { name: "Hammerspace Handbag", bonus: {} },
  { name: "Enhanced Sustenance", bonus: { VIT: 1 } },
  { name: "Enhanced Outfit", bonus: { VIT: 1 } },
  { name: "Healing Artifact", bonus: {} },
  { name: "Ally", bonus: { MAG: 1 } },
  { name: "Monstrous Metamorphosis", bonus: { STR: 2, AGI: 2, VIT: 2 } },
  { name: "Sorcery", bonus: { MAG: 1 } },
  { name: "Wings", bonus: {} },
  { name: "Purification Artifact", bonus: {} },
  { name: "Awareness", bonus: {} },
  { name: "Power Artifact", bonus: {} },
];

export const supportPerks = [
  { name: "Interdimensional Tourist", bonus: {} },
  { name: "Closure", bonus: { LCK: 1 } },
  { name: "Fated", bonus: { LCK: 1 } },
  { name: "Training", bonus: {} },
  { name: "Interdimensional Home", bonus: {} },
  { name: "Incognito", bonus: {} },
  { name: "Environmental Sealing", bonus: {} },
  { name: "Get out of Jail", bonus: {} },
  { name: "Big Damn Hero", bonus: {} },
  { name: "Absolute Direction", bonus: {} },
  { name: "Big Backpack", bonus: {} },
  { name: "Natural Aging", bonus: {} },
  { name: "Masculinity", bonus: { LCK: 1 } },
  { name: "Overcity Shift", bonus: {} },
  { name: "Money", bonus: {} },
  { name: "Familiar", bonus: {} },
  { name: "Soul Jar", bonus: {} },
  { name: "Eternal Style", bonus: {} },
  { name: "A Way Out", bonus: { LCK: 1 } },
  { name: "Fake Parents", bonus: {} },
];

export const artifacts = [
  "Mystic Artifact",
  "Disguise Artifact",
  "Healing Artifact",
  "Purification Artifact",
  "Power Artifact",
];
