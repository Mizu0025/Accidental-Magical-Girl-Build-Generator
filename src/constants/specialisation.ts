/** Specialization entries from Roll 3 (accidentalMahou.md). */
export interface SpecialisationEntry {
	/** Name displayed in the result column. */
	name: string;
	/** Bonus text shown to the player. */
	bonus: string;
}

/** Ordered 1-to-20 — index is `roll - 1`. */
export const SPECIALISATIONS: SpecialisationEntry[] = [
	{ name: "Fire", bonus: "+3 STR or MAG" },
	{ name: "Ice", bonus: "+2 STR or MAG, +1 VIT" },
	{ name: "Air", bonus: "+4 AGI" },
	{ name: "Spirit", bonus: "+2 MAG, +1 MAG or LCK, +2 LCK" },
	{ name: "Reinforcement", bonus: "+1 STR, +1 AGI, +1 MAG, +1 LCK" },
	{ name: "Psychic", bonus: "+2 MAG, +2 LCK" },
	{ name: "Time", bonus: "+1 AGI or VIT, +2 LCK" },
	{ name: "Lightning", bonus: "+1 STR or MAG, +2 AGI" },
	{ name: "Sound", bonus: "+1 AGI, +2 MAG, +1 LCK" },
	{ name: "Darkness", bonus: "+2 STR or MAG, +1 VIT" },
	{ name: "Illusion", bonus: "+2 STR, +1 VIT, +1 LCK" },
	{ name: "Light", bonus: "+1 AGI, +2 VIT, +1 MAG" },
	{ name: "Wood", bonus: "+1 STR, +1 VIT, +2 MAG" },
	{ name: "Empathic", bonus: "+1 STR or MAG, +2 LCK" },
	{ name: "Water", bonus: "+1 STR, +2 AGI, +1 MAG" },
	{ name: "Gravity", bonus: "+4 MAG" },
	{ name: "Stone", bonus: "+3 STR or VIT" },
	{ name: "Beast", bonus: "+1 STR, +1 AGI, +1 VIT or LCK" },
	{ name: "Metal", bonus: "+3 STR or LCK" },
	{ name: "Oddball", bonus: "+2 to one stat, +1 to one other stat" },
];

/** Resolve the specialization name for a given d20 roll. */
export function resolveSpecialisation(roll: number): string {
	const idx = roll - 1;
	if (idx < 0 || idx >= SPECIALISATIONS.length) return "Oddball";
	return SPECIALISATIONS[idx].name;
}
