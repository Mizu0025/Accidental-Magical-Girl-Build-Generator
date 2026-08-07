/** Power entries from Roll 6 (accidentalMahou.md). */
export interface PowerEntry {
	/** Name displayed in the result column. */
	name: string;
	/** Roll range that maps to this power (1-indexed, inclusive). */
	rollMin: number;
	rollMax: number;
	/** Bonus text shown to the player. */
	bonus: string;
}

export const POWERS: PowerEntry[] = [
	{
		name: "Killing Blow",
		rollMin: 1,
		rollMax: 2,
		bonus: "+1 STR or MAG",
	},
	{
		name: "Hammerspace",
		rollMin: 3,
		rollMax: 4,
		bonus: "",
	},
	{
		name: "Twinned Soul",
		rollMin: 5,
		rollMax: 6,
		bonus: "-1 in all stats",
	},
	{
		name: "Focused Assault",
		rollMin: 7,
		rollMax: 8,
		bonus: "",
	},
	{
		name: "Barrage",
		rollMin: 9,
		rollMax: 10,
		bonus: "",
	},
	{
		name: "Power of Friendship",
		rollMin: 11,
		rollMax: 12,
		bonus: "",
	},
	{
		name: "Duplication",
		rollMin: 13,
		rollMax: 14,
		bonus: "",
	},
	{
		name: "Third Eye",
		rollMin: 15,
		rollMax: 16,
		bonus: "",
	},
	{
		name: "Regeneration",
		rollMin: 17,
		rollMax: 18,
		bonus: "",
	},
	{
		name: "Tentacles",
		rollMin: 19,
		rollMax: 20,
		bonus: "",
	},
];

/** Resolve the power name for a given d20 roll. */
export function resolvePower(roll: number): string {
	return (
		POWERS.find((e) => roll >= e.rollMin && roll <= e.rollMax)?.name ??
		"Tentacles"
	);
}
