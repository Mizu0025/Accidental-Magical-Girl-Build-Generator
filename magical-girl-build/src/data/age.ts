import { CoinTier } from '../types/buildTypes';

// Age formula: base = 6 + roll. Rolls of 11-20 count as roll-10.
// Bronze: +/-1 year from calculated age.
// Silver: pick any age between 7 and 16.
// Gold: choose any age you wish.

export function calcBaseAge(diceRoll: number): number {
  const adjusted = diceRoll >= 11 ? diceRoll - 10 : diceRoll;
  return 6 + adjusted;
}

export function applyAgeModifier(
  baseAge: number,
  coinTier: CoinTier
): { calculatedAge: number; adjustmentType: string } {
  switch (coinTier) {
    case 'bronze': {
      // Roll again for +/-1
      const flip = Math.random() > 0.5 ? 1 : -1;
      return { calculatedAge: baseAge + flip, adjustmentType: `±1 year (${baseAge + flip})` };
    }
    case 'silver':
      return { calculatedAge: baseAge, adjustmentType: 'Silver — range 7-16 selected' };
    case 'gold':
      return { calculatedAge: baseAge, adjustmentType: 'Gold — full age freedom' };
    default:
      return { calculatedAge: baseAge, adjustmentType: 'None' };
  }
}

export function getAgeRange(coinTier: CoinTier): [min: number, max: number] {
  switch (coinTier) {
    case 'silver': return [7, 16];
    case 'gold': return [1, 100];
    default: return [0, 0];
  }
}
