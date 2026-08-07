/** Body type entries from Roll 2 (accidentalMahou.md). */
export interface BodyEntry {
	/** Name displayed in the result column. */
	name: string;
	/** Roll range that maps to this body type (1-indexed, inclusive). */
	rollMin: number;
	rollMax: number;
	/** Bonus text shown to the player. */
	bonus: string;
}

export const BODY_TYPES: BodyEntry[] = [
	{
		name: "Underdeveloped",
		rollMin: 1,
		rollMax: 6,
		bonus: "+1 LCK or MAG",
	},
	{
		name: "Average",
		rollMin: 7,
		rollMax: 14,
		bonus: "+1 AGI or VIT",
	},
	{
		name: "Overdeveloped",
		rollMin: 15,
		rollMax: 20,
		bonus: "+1 STR or VIT",
	},
];

/** Resolve the body type name for a given d20 roll. */
export function resolveBody(roll: number): string {
	return (
		BODY_TYPES.find((e) => roll >= e.rollMin && roll <= e.rollMax)?.name ??
		"Average"
	);
}
