export interface OutfitEntry {
  minRoll: number;
  maxRoll: number;
  name: string;
  description: string;
  statBonus: string;
}

export const OUTFITS: OutfitEntry[] = [
  { minRoll: 1, maxRoll: 5, name: 'Skimpy', description: 'Skintight anything, outfits that show a lot of skin. Leotards, bikinis, etc.', statBonus: '+1 AGI' },
  { minRoll: 6, maxRoll: 10, name: 'Flowing', description: 'Coats, robes, capes, togas, hakama, etc.', statBonus: '+1 STR' },
  { minRoll: 11, maxRoll: 15, name: 'Elaborate', description: 'Dresses, over fancy cosplay, ballroom gowns, etc.', statBonus: '+1 MAG' },
  { minRoll: 16, maxRoll: 20, name: 'Uniform', description: 'School or military uniforms, business attire, etc.', statBonus: '+1 VIT' },
];

export function getOutfitEntry(diceRoll: number): OutfitEntry {
  const found = OUTFITS.find(o => diceRoll >= o.minRoll && diceRoll <= o.maxRoll);
  return found || OUTFITS[0];
}
