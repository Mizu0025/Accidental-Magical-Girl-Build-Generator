/** Combat perk entries from Perks Table 1 (accidentalMahou.md). */
export interface PerkEntry {
	/** Name displayed in the result column. */
	name: string;
	/** Bonus text shown to the player. */
	bonus: string;
}

/** Ordered 1-to-20 — index is `roll - 1`. */
export const COMBAT_PERKS: PerkEntry[] = [
	{ name: "Dual Weapon", bonus: "+1 Weapon Stat" },
	{ name: "Martial Training", bonus: "+1 STR" },
	{ name: "Enhanced Weapon", bonus: "+1 Weapon Stat" },
	{ name: "Mystic Artifact", bonus: "" },
	{ name: "Gifted", bonus: "+1 Spec Stat" },
	{ name: "Flexibility", bonus: "+1 AGI" },
	{ name: "Enhanced Transformation", bonus: "" },
	{ name: "Disguise Artifact", bonus: "" },
	{ name: "Blood Magic", bonus: "+1 VIT" },
	{ name: "Hammerspace Handbag", bonus: "" },
	{ name: "Enhanced Sustenance", bonus: "+1 VIT" },
	{ name: "Enhanced Outfit", bonus: "+1 Outfit Stat" },
	{ name: "Healing Artifact", bonus: "" },
	{ name: "Ally", bonus: "+1 Any" },
	{ name: "Monstrous Metamorphosis", bonus: "" },
	{ name: "Sorcery", bonus: "+1 MAG" },
	{ name: "Wings", bonus: "" },
	{ name: "Purification Artifact", bonus: "" },
	{ name: "Awareness", bonus: "" },
	{ name: "Power Artifact", bonus: "" },
];

/** Resolve the combat perk name for a given d20 roll. */
export function resolveCombatPerk(roll: number): string {
	const idx = roll - 1;
	if (idx < 0 || idx >= COMBAT_PERKS.length) return "Power Artifact";
	return COMBAT_PERKS[idx].name;
}
