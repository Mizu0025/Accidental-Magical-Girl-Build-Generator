/** Outfit type entries from Roll 5 (accidentalMahou.md). */
export interface OutfitEntry {
	/** Name displayed in the result column. */
	name: string;
	/** Roll range that maps to this outfit type (1-indexed, inclusive). */
	rollMin: number;
	rollMax: number;
	/** Bonus text shown to the player. */
	bonus: string;
}

export const OUTFIT_TYPES: OutfitEntry[] = [
	{
		name: "Skimpy",
		rollMin: 1,
		rollMax: 5,
		bonus: "+1 AGI",
	},
	{
		name: "Flowing",
		rollMin: 6,
		rollMax: 10,
		bonus: "+1 STR",
	},
	{
		name: "Elaborate",
		rollMin: 11,
		rollMax: 15,
		bonus: "+1 MAG",
	},
	{
		name: "Uniform",
		rollMin: 16,
		rollMax: 20,
		bonus: "+1 VIT",
	},
];

/** Resolve the outfit type name for a given d20 roll. */
export function resolveOutfit(roll: number): string {
	return (
		OUTFIT_TYPES.find((e) => roll >= e.rollMin && roll <= e.rollMax)?.name ??
		"Skimpy"
	);
}
