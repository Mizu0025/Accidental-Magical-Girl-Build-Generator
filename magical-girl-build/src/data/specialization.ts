import { CoinTier } from '../types/buildTypes';

export interface SpecializationEntry {
  roll: number;
  name: string;
  statOptions: [string, string];
}

export const SPECIALIZATIONS: SpecializationEntry[] = [
  { roll: 1, name: 'Fire', statOptions: ['STR', 'MAG'] },
  { roll: 2, name: 'Ice', statOptions: ['STR', 'MAG'] },
  { roll: 3, name: 'Air', statOptions: ['AGI', 'AGI'] },
  { roll: 4, name: 'Spirit', statOptions: ['MAG', 'MAG'] },
  { roll: 5, name: 'Reinforcement', statOptions: ['STR', 'STR'] },
  { roll: 6, name: 'Psychic', statOptions: ['MAG', 'MAG'] },
  { roll: 7, name: 'Time', statOptions: ['AGI', 'VIT'] },
  { roll: 8, name: 'Lightning', statOptions: ['STR', 'MAG'] },
  { roll: 9, name: 'Sound', statOptions: ['AGI', 'AGI'] },
  { roll: 10, name: 'Darkness', statOptions: ['STR', 'MAG'] },
  { roll: 11, name: 'Illusion', statOptions: ['STR', 'STR'] },
  { roll: 12, name: 'Light', statOptions: ['AGI', 'AGI'] },
  { roll: 13, name: 'Wood', statOptions: ['STR', 'STR'] },
  { roll: 14, name: 'Empathic', statOptions: ['STR', 'MAG'] },
  { roll: 15, name: 'Water', statOptions: ['STR', 'STR'] },
  { roll: 16, name: 'Gravity', statOptions: ['MAG', 'MAG'] },
  { roll: 17, name: 'Stone', statOptions: ['STR', 'VIT'] },
  { roll: 18, name: 'Beast', statOptions: ['STR', 'VIT'] },
  { roll: 19, name: 'Metal', statOptions: ['STR', 'LCK'] },
  { roll: 20, name: 'Oddball', statOptions: ['LCK', 'LCK'] },
];

export function getSpecializationEntry(roll: number): SpecializationEntry {
  return SPECIALIZATIONS.find(e => e.roll === roll) || SPECIALIZATIONS[0];
}
