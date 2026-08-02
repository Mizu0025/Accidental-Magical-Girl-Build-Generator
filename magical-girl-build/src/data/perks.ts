export interface PerkEntry {
  id: number;
  name: string;
  table: 'combat' | 'support';
}

export const COMBAT_PERKS: PerkEntry[] = [
  { id: 1, name: '+1 Weapon Stat, Dual Weapon', table: 'combat' },
  { id: 2, name: '+1 STR, Martial Training', table: 'combat' },
  { id: 3, name: '+1 Weapon Stat, Enhanced Weapon', table: 'combat' },
  { id: 4, name: 'Mystic Artifact', table: 'combat' },
  { id: 5, name: '+1 Spec Stat, Gifted', table: 'combat' },
  { id: 6, name: '+1 AGI, Flexibility', table: 'combat' },
  { id: 7, name: 'Enhanced Transformation', table: 'combat' },
  { id: 8, name: 'Disguise Artifact', table: 'combat' },
  { id: 9, name: '+1 VIT, Blood Magic', table: 'combat' },
  { id: 10, name: 'Hammerspace Handbag', table: 'combat' },
  { id: 11, name: '+1 VIT, Enhanced Sustenance', table: 'combat' },
  { id: 12, name: '+1 Outfit Stat, Enhanced Outfit', table: 'combat' },
  { id: 13, name: 'Healing Artifact', table: 'combat' },
  { id: 14, name: '+1 Any, Ally', table: 'combat' },
  { id: 15, name: 'Monstrous Metamorphosis', table: 'combat' },
  { id: 16, name: '+1 MAG, Sorcery', table: 'combat' },
  { id: 17, name: 'Wings', table: 'combat' },
  { id: 18, name: 'Purification Artifact', table: 'combat' },
  { id: 19, name: 'Awareness', table: 'combat' },
  { id: 20, name: 'Power Artifact', table: 'combat' },
];

export const SUPPORT_PERKS: PerkEntry[] = [
  { id: 1, name: 'Interdimensional Tourist', table: 'support' },
  { id: 2, name: '+1 LCK, Closure', table: 'support' },
  { id: 3, name: '+1 LCK, Fated', table: 'support' },
  { id: 4, name: 'Training', table: 'support' },
  { id: 5, name: 'Interdimensional Home', table: 'support' },
  { id: 6, name: 'Incognito', table: 'support' },
  { id: 7, name: 'Environmental Sealing', table: 'support' },
  { id: 8, name: 'Get Out of Jail', table: 'support' },
  { id: 9, name: 'Big Damn Hero', table: 'support' },
  { id: 10, name: 'Absolute Direction', table: 'support' },
  { id: 11, name: 'Big Backpack', table: 'support' },
  { id: 12, name: 'Natural Aging', table: 'support' },
  { id: 13, name: '+1 LCK, Masculinity', table: 'support' },
  { id: 14, name: 'Overcity Shift', table: 'support' },
  { id: 15, name: 'Money', table: 'support' },
  { id: 16, name: 'Familiar', table: 'support' },
  { id: 17, name: 'Soul Jar', table: 'support' },
  { id: 18, name: 'Eternal Style', table: 'support' },
  { id: 19, name: '+1 LCK, A Way Out', table: 'support' },
  { id: 20, name: 'Fake Parents', table: 'support' },
];

export function rollCombatPerk(usedIds: Set<number>): number | null {
  const available = COMBAT_PERKS.filter(p => !usedIds.has(p.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)].id;
}

export function rollSupportPerk(usedIds: Set<number>): number | null {
  const available = SUPPORT_PERKS.filter(p => !usedIds.has(p.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)].id;
}

export function getPerkName(id: number, table: 'combat' | 'support'): string {
  const entry = table === 'combat'
    ? COMBAT_PERKS.find(p => p.id === id)
    : SUPPORT_PERKS.find(p => p.id === id);
  return entry?.name || `Unknown Perk (#${id})`;
}

// Roll dice for perk ID (1-20), respecting coin tier modifiers
export function rollPerkId(
  coinTier: 'bronze' | 'silver' | 'gold',
  minRoll?: number,
  maxRoll?: number
): number {
  const baseMin = minRoll ?? 1;
  const baseMax = maxRoll ?? 20;

  if (coinTier === 'bronze') {
    // Roll in range but clamp to 1-20
    const roll = Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin;
    return Math.max(1, Math.min(20, roll));
  }

  if (coinTier === 'gold') {
    // Gold: pick from either table — returns any ID 1-20
    return Math.floor(Math.random() * 20) + 1;
  }

  // Silver: same range as bronze but user can select manually
  const roll = Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin;
  return Math.max(1, Math.min(20, roll));
}
