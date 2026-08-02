export interface WeaponEntry {
  minRoll: number;
  maxRoll: number;
  name: string;
  description: string;
  statBonus: string;
}

export const WEAPONS: WeaponEntry[] = [
  { minRoll: 1, maxRoll: 5, name: 'Melee', description: 'Blades, hammers, axes, polearms, bludgeons, guitars, sharp sticks.', statBonus: '+1 STR, +1 VIT' },
  { minRoll: 6, maxRoll: 10, name: 'Ranged', description: 'Bows, rifles, slingshots, pistols, muskets, laser guns — anything you can hit from afar.', statBonus: '+1 AGI (Heavy weapons draw more mana for ammo if MAG is low)' },
  { minRoll: 11, maxRoll: 15, name: 'Mystic', description: 'Rods, staves, orbs, wands, amulets, charms — magical focus items.', statBonus: '+1 MAG (weak blast/bolt capability)' },
  { minRoll: 16, maxRoll: 20, name: 'Fist', description: 'Gauntlets, boots, fists, feet, elbows — your body is your weapon.', statBonus: '+2 STR (rough wrestler or graceful martial artist)' },
];

export function getWeaponEntry(diceRoll: number): WeaponEntry {
  const found = WEAPONS.find(w => diceRoll >= w.minRoll && diceRoll <= w.maxRoll);
  return found || WEAPONS[0];
}
