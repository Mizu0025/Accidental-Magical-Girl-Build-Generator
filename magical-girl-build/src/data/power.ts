export interface PowerEntry {
  minRoll: number;
  maxRoll: number;
  name: string;
  description: string;
  notes: string;
}

export const POWERS: PowerEntry[] = [
  { minRoll: 1, maxRoll: 2, name: 'Killing Blow', description: 'An overwhelming attack that dumps all mana into a single blow. Guaranteed kill on most strong monsters if it hits.', notes: '+1 STR or MAG (Physical/Magical). If missed, depleted and vulnerable.' },
  { minRoll: 3, maxRoll: 4, name: 'Hammerspace', description: 'Instant access to an extra-dimensional storage space of infinite capacity.', notes: 'Stores non-living material, food, time-sensitive items in stasis. Cannot store anything you can lift.' },
  { minRoll: 5, maxRoll: 6, name: 'Twinned Soul', description: 'Transformation splits your soul into its own body and mind (same age, development, specialization, and base power roll).', notes: 'Share stats/perks. Only 1 artifact/big friend. Gold/Silver on stats affects both. -1 in all stats.' },
  { minRoll: 7, maxRoll: 8, name: 'Focused Assault', description: 'Focus on a target, allowing far more mana into an attack than normal.', notes: 'Punishing/penetrating blows on single enemy. Takes time to focus. Choose form (melee or ranged).' },
  { minRoll: 9, maxRoll: 10, name: 'Barrage', description: 'Extremely efficient at casting small attacks in rapid succession.', notes: 'Destroy hordes of weak enemies. Secondary explosive effects on larger spells.' },
  { minRoll: 11, maxRoll: 12, name: 'Power of Friendship', description: 'Instinctive sense of when people are sad, how to cheer them up, and get in their good graces.', notes: 'People give second chances. Easy allies/contacts. Can make monsters cease preying on humans.' },
  { minRoll: 13, maxRoll: 14, name: 'Duplication', description: 'Split off duplicates of yourself with a moment of concentration. Costs mana to maintain.', notes: 'Solid bodies, hit as hard as you can. Can merge to relay small experience portion.' },
  { minRoll: 15, maxRoll: 16, name: 'Third Eye', description: 'The Sight — see the flows and after effects of magic. Extremely precise sense.', notes: 'Pierce illusions, trace faded rituals, identify magic type at a glance. Predict incoming spells.' },
  { minRoll: 17, maxRoll: 18, name: 'Regeneration', description: 'Heal and recover mana way faster than normal. Live through almost any injury.', notes: 'Severed limbs reattach by holding to stumps. Spend mana to enhance healing.' },
  { minRoll: 19, maxRoll: 20, name: 'Tentacles', description: 'Command of tentacle-like forces (chains, vines, cords, ropes, actual tentacles).', notes: 'Grow from outfit or designated area. Simple independent minds. No tactile feedback.' },
];

export function getPowerEntry(diceRoll: number): PowerEntry {
  const found = POWERS.find(p => diceRoll >= p.minRoll && diceRoll <= p.maxRoll);
  return found || POWERS[0];
}
