/** Support perk entries from Perks Table 2 (accidentalMahou.md). */
export interface PerkEntry {
	/** Name displayed in the result column. */
	name: string;
	/** Bonus text shown to the player. */
	bonus: string;
}

/** Ordered 1-to-20 — index is `roll - 1`. */
export const SUPPORT_PERKS: PerkEntry[] = [
	{ name: "Interdimensional Tourist", bonus: "" },
	{ name: "Closure", bonus: "+1 LCK" },
	{ name: "Fated", bonus: "+1 LCK" },
	{ name: "Training", bonus: "" },
	{ name: "Interdimensional Home", bonus: "" },
	{ name: "Incognito", bonus: "" },
	{ name: "Environmental Sealing", bonus: "" },
	{ name: "Get out of Jail", bonus: "" },
	{ name: "Big Damn Hero", bonus: "" },
	{ name: "Absolute Direction", bonus: "" },
	{ name: "Big Backpack", bonus: "" },
	{ name: "Natural Aging", bonus: "" },
	{ name: "Masculinity", bonus: "+1 LCK" },
	{ name: "Overcity Shift", bonus: "" },
	{ name: "Money", bonus: "" },
	{ name: "Familiar", bonus: "" },
	{ name: "Soul Jar", bonus: "" },
	{ name: "Eternal Style", bonus: "" },
	{ name: "A Way Out", bonus: "+1 LCK" },
	{ name: "Fake Parents", bonus: "" },
];

/** Resolve the support perk name for a given d20 roll. */
export function resolveSupportPerk(roll: number): string {
	const idx = roll - 1;
	if (idx < 0 || idx >= SUPPORT_PERKS.length) return "";
	return SUPPORT_PERKS[idx].name;
}
