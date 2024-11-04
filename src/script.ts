type CharacterBuild = {
  origin: string;
  age: number;
  body: string;
  outfit: string;
  weapon: string;
  specialization: string;
  stats: { STR: number; AGI: number; VIT: number; MAG: number; LCK: number };
  perks: string[];
  artifact: string;
};

// Options for each category
const origins = [
  "A Contract",
  "Smug",
  "A Weapon",
  "An Emergency",
  "An Artifact",
  "A Death",
];
const body = [
  { name: "Underdeveloped", bonus: { LCK: 1 } },
  { name: "Average", bonus: { AGI: 1 } },
  { name: "Overdeveloped", bonus: { STR: 1 } },
];
const outfits = [
  { name: "Skintight Suit", bonus: { AGI: 1 } },
  { name: "Armor", bonus: { STR: 1 } },
  { name: "Fancy Dress", bonus: { MAG: 1 } },
  { name: "Uniform", bonus: { VIT: 1 } },
];
const weapons = [
  { name: "Sword", bonus: { STR: 1 } },
  { name: "Bow", bonus: { AGI: 1 } },
  { name: "Staff", bonus: { MAG: 1 } },
  { name: "Fists", bonus: { STR: 2 } },
];
const specializations = [
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

// Combat and support perks from the PDF
const combatPerks = [
  { name: "Dual Weapon", bonus: { AGI: 1 } },
  { name: "Martial Training", bonus: { STR: 1 } },
  { name: "Enhanced Weapon", bonus: { STR: 1 } },
  { name: "Mystic Artifact", bonus: {} },
  { name: "Flexibility", bonus: { AGI: 1 } },
  { name: "Enhanced Transformation", bonus: {} },
  { name: "Blood Magic", bonus: { VIT: 1 } },
  { name: "Enhanced Outfit", bonus: { VIT: 1 } },
  { name: "Monstrous Metamorphosis", bonus: { STR: 2, AGI: 2, VIT: 2 } },
  { name: "Sorcery", bonus: { MAG: 1 } },
];
const supportPerks = [
  { name: "Interdimensional Tourist", bonus: {} },
  { name: "Closure", bonus: { LCK: 1 } },
  { name: "Fated", bonus: { LCK: 1 } },
  { name: "Training", bonus: {} },
  { name: "Incognito", bonus: {} },
  { name: "Environmental Sealing", bonus: {} },
  { name: "Get out of Jail", bonus: {} },
  { name: "Big Damn Hero", bonus: {} },
  { name: "Absolute Direction", bonus: {} },
  { name: "Masculinity", bonus: { LCK: 1 } },
];
const artifacts = [
  "Mystic Artifact",
  "Disguise Artifact",
  "Healing Artifact",
  "Purification Artifact",
  "Power Artifact",
];
let artifactsOwned: string[] = [];

const roll11D20 = (): number[] => {
  const rolls = [];
  for (let i = 0; i < 11; i++) {
    rolls.push(Math.floor(Math.random() * 20) + 1);
  }
  return rolls;
};

const applyStatBonuses = (
  stats: { STR: number; AGI: number; VIT: number; MAG: number; LCK: number },
  bonus: Partial<{
    STR: number;
    AGI: number;
    VIT: number;
    MAG: number;
    LCK: number;
  }>,
) => {
  for (const [key, value] of Object.entries(bonus)) {
    if (value) stats[key as keyof typeof stats] += value;
  }
};

const getUniquePerk = (
  perkRoll: number,
  selectedPerks: Set<string>,
  isCombat: boolean,
): {
  name: string;
  bonus: Partial<{
    STR: number;
    AGI: number;
    VIT: number;
    MAG: number;
    LCK: number;
  }>;
} => {
  const perkGroup = isCombat ? combatPerks : supportPerks;
  let perk = perkGroup[perkRoll % perkGroup.length];

  // If the perk is an artifact, add it to the artifactsOwned list
  if (artifacts.includes(perk.name)) {
    artifactsOwned.push(perk.name);
  }

  // If the perk is a duplicate, switch to the other perk group
  if (selectedPerks.has(perk.name)) {
    perk = (isCombat ? supportPerks : combatPerks)[
      perkRoll % (isCombat ? supportPerks.length : combatPerks.length)
    ];
  }

  selectedPerks.add(perk.name); // Track selected perk to avoid duplicates
  return perk;
};

const getBodyType = (inputNumber: number) => {
  let selectedOption;

  if (inputNumber >= 1 && inputNumber <= 6) {
    selectedOption = body[0]; // Option 1
  } else if (inputNumber >= 7 && inputNumber <= 14) {
    selectedOption = body[1]; // Option 2
  } else {
    selectedOption = body[2]; // Option 3
  }

  return selectedOption;
};

const generateBuild = (): void => {
  const stats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };
  const diceRolls: number[] = roll11D20();

  // Origin selection
  const originRoll = diceRolls[0];
  const selectedOrigin = origins[Math.floor((originRoll - 1) / 5)];

  // Age selection
  const ageRoll = diceRolls[1];
  const selectedAge = (ageRoll > 10 ? ageRoll - 10 : ageRoll) + 6;

  // Body selection
  const bodyRoll = diceRolls[2];
  const selectedBody = getBodyType(bodyRoll);
  applyStatBonuses(stats, selectedBody.bonus);

  // Outfit and weapon selection based on dice roll ranges
  const outfitRoll = diceRolls[3];
  const selectedOutfit = outfits[Math.floor((outfitRoll - 1) / 5)];
  applyStatBonuses(stats, selectedOutfit.bonus);

  const weaponRoll = diceRolls[4];
  const selectedWeapon = weapons[Math.floor((weaponRoll - 1) / 5)];
  applyStatBonuses(stats, selectedWeapon.bonus);

  // Specialization selection with 1d20 roll
  const specalisationRoll = diceRolls[5];
  const selectedSpecialization = specializations[specalisationRoll];

  // Choose unique perks with duplicate handling
  const selectedPerks = new Set<string>();
  const perks = [
    getUniquePerk(diceRolls[6], selectedPerks, true), // Combat perk 1
    getUniquePerk(diceRolls[7], selectedPerks, true), // Combat perk 2
    getUniquePerk(diceRolls[8], selectedPerks, false), // Support perk 1
    getUniquePerk(diceRolls[9], selectedPerks, false), // Support perk 2
    getUniquePerk(diceRolls[10], selectedPerks, diceRolls[0] <= 10), // Last perk, random group
  ];
  perks.forEach((perk) => applyStatBonuses(stats, perk.bonus));

  // Update display in table cells
  (document.getElementById("origin") as HTMLElement).textContent =
    selectedOrigin;
  (document.getElementById("age") as HTMLElement).textContent =
    `${selectedAge}`;
  (document.getElementById("body") as HTMLElement).textContent =
    `${selectedBody.name}`;
  (document.getElementById("outfit") as HTMLElement).textContent =
    `${selectedOutfit.name}`;
  (document.getElementById("weapon") as HTMLElement).textContent =
    `${selectedWeapon.name}`;
  (document.getElementById("specialization") as HTMLElement).textContent =
    selectedSpecialization;
  (document.getElementById("stats") as HTMLElement).textContent =
    `STR ${stats.STR}, AGI ${stats.AGI}, VIT ${stats.VIT}, MAG ${stats.MAG}, LCK ${stats.LCK}`;
  (document.getElementById("perks") as HTMLElement).textContent = perks
    .map((perk) => `${perk.name}`)
    .join(", ");
  (document.getElementById("artifact") as HTMLElement).textContent =
    artifactsOwned.length > 0 ? artifactsOwned.join(", ") : "None";
  (document.getElementById("dice-rolls") as HTMLElement).textContent =
    diceRolls.join(", ");
};

// Initial build on page load
generateBuild();
