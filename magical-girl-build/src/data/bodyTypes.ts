import { BodyTypeCategory } from '../types/buildTypes';

export const BODY_CATEGORIES: {
  min: number;
  max: number;
  category: BodyTypeCategory;
  description: string;
  bonusChoices: [string, string];
}[] = [
  { min: 1, max: 6, category: 'underdeveloped', description: 'Smaller, sickly, thin, or much younger looking.', bonusChoices: ['LCK', 'MAG'] },
  { min: 7, max: 14, category: 'average', description: 'Average for your age. No standout features.', bonusChoices: ['AGI', 'VIT'] },
  { min: 15, max: 20, category: 'overdeveloped', description: 'Taller, bigger, wider, more muscular, appears older or has precocious puberty.', bonusChoices: ['STR', 'VIT'] },
];

export function getBodyCategory(diceRoll: number): BodyTypeCategory {
  if (diceRoll <= 6) return 'underdeveloped';
  if (diceRoll <= 14) return 'average';
  return 'overdeveloped';
}

export function getBodyDescription(category: BodyTypeCategory): string {
  const found = BODY_CATEGORIES.find(c => c.category === category);
  return found ? found.description : '';
}

export function getBodyBonusChoices(category: BodyTypeCategory): [string, string] {
  const found = BODY_CATEGORIES.find(c => c.category === category);
  return found ? found.bonusChoices : ['LCK', 'MAG'];
}
