/** Weapon type entries from Roll 4 (accidentalMahou.md). */
export interface WeaponEntry {
	/** Name displayed in the result column. */
	name: string;
	/** Roll range that maps to this weapon type (1-indexed, inclusive). */
	rollMin: number;
	rollMax: number;
	/** Bonus text shown to the player. */
	bonus: string;
	/** Example weapons for flavor. */
	examples: string;
}

export const WEAPON_TYPES: WeaponEntry[] = [
	{
		name: "Melee",
		rollMin: 1,
		rollMax: 5,
		bonus: "+1 STR, +1 VIT",
		examples:
			"Blades, hammers, axes, polearms, bludgeons, guitars, sharp sticks.",
	},
	{
		name: "Ranged",
		rollMin: 6,
		rollMax: 10,
		bonus: "+1 AGI",
		examples: "Bows, rifles, slingshots, pistols, muskets, laser guns.",
	},
	{
		name: "Mystic",
		rollMin: 11,
		rollMax: 15,
		bonus: "+1 MAG",
		examples: "Rods, staves, orbs, wands, amulets, charms.",
	},
	{
		name: "Fist",
		rollMin: 16,
		rollMax: 20,
		bonus: "+2 STR",
		examples: "Gauntlets, boots, fists, feet, elbows.",
	},
];

/** Resolve the weapon type name for a given d20 roll. */
export function resolveWeapon(roll: number): string {
	return (
		WEAPON_TYPES.find((e) => roll >= e.rollMin && roll <= e.rollMax)?.name ??
		"Melee"
	);
}
