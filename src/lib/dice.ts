export function rollD20(): number {
	return Math.floor(Math.random() * 20) + 1;
}

// ---------- Types ----------

export type BodyType = "Underdeveloped" | "Average" | "Overdeveloped";

export interface BodyResult {
	kind: "BodyRoll";
	bodyType: BodyType;
	statBonusText: string;
	rawRoll: number;
}

export interface AgeResult {
	kind: "AgeRoll";
	value: number;
	rawRoll: number;
}

export interface SpecializationResult {
	kind: "SpecializationRoll";
	name: string;
	statBonuses: string;
	rawRoll: number;
}

export type WeaponType = "Melee" | "Ranged" | "Mystic" | "Fist";

export interface WeaponResult {
	kind: "WeaponRoll";
	weaponType: WeaponType;
	range: string;
	statBonus: string;
	rawRoll: number;
}

export type OutfitType = "Skimpy" | "Flowing" | "Elaborate" | "Uniform";

export interface OutfitResult {
	kind: "OutfitRoll";
	outfitType: OutfitType;
	range: string;
	statBonus: string;
	rawRoll: number;
}

export interface PowerResult {
	kind: "PowerRoll";
	powerName: string;
	range: string;
	description: string;
	rawRoll: number;
}

export type PerkTable = "Combat" | "Support";

export interface PerkResult {
	kind: "PerkRoll";
	table: PerkTable;
	perkName: string;
	roll: number;
	isFirstTwo: boolean;
}

export type StatName = "STR" | "AGI" | "VIT" | "MAG" | "LCK";

export interface CoinSpending {
	bronzeStat: { stat: StatName; bonus: 1 } | null;
	silverStat: { stat: StatName; bonus: 2 } | null;
	goldStat: { stat: StatName; bonus: 4 } | null;
}

export interface StatResult {
	name: StatName;
	baseValue: number;
	coinBonus: number;
	bodyBonus: number;
	total: number;
}

// ---------- Tables ----------

interface SpecEntry {
	roll: number;
	name: string;
	statBonuses: string;
}

const SPECIALIZATIONS: readonly SpecEntry[] = [
	{ roll: 1, name: "Fire", statBonuses: "+3 STR or MAG" },
	{ roll: 2, name: "Ice", statBonuses: "+2 STR or MAG, +1 VIT" },
	{ roll: 3, name: "Air", statBonuses: "+4 AGI" },
	{ roll: 4, name: "Spirit", statBonuses: "+2 MAG, +1 MAG or LCK, +2 LCK" },
	{
		roll: 5,
		name: "Reinforcement",
		statBonuses: "+1 STR, +1 AGI, +1 MAG, +1 LCK",
	},
	{ roll: 6, name: "Psychic", statBonuses: "+2 MAG, +2 LCK" },
	{ roll: 7, name: "Time", statBonuses: "+1 AGI or VIT, +2 LCK" },
	{ roll: 8, name: "Lightning", statBonuses: "+1 STR or MAG, +2 AGI" },
	{ roll: 9, name: "Sound", statBonuses: "+1 AGI, +2 MAG, +1 LCK" },
	{ roll: 10, name: "Darkness", statBonuses: "+2 STR or MAG, +1 VIT" },
	{ roll: 11, name: "Illusion", statBonuses: "+2 STR, +1 VIT, +1 LCK" },
	{ roll: 12, name: "Light", statBonuses: "+1 AGI, +2 VIT, +1 MAG" },
	{ roll: 13, name: "Wood", statBonuses: "+1 STR, +1 VIT, +2 MAG" },
	{ roll: 14, name: "Empathic", statBonuses: "+1 STR or MAG, +2 LCK" },
	{ roll: 15, name: "Water", statBonuses: "+1 STR, +2 AGI, +1 MAG" },
	{ roll: 16, name: "Gravity", statBonuses: "+4 MAG" },
	{ roll: 17, name: "Stone", statBonuses: "+3 STR or VIT" },
	{ roll: 18, name: "Beast", statBonuses: "+1 STR, +1 AGI, +1 VIT or LCK" },
	{ roll: 19, name: "Metal", statBonuses: "+3 STR or LCK" },
	{
		roll: 20,
		name: "Oddball",
		statBonuses: "+2 to one stat, +1 to one other stat",
	},
];

interface WeaponEntry {
	range: [number, number];
	type: WeaponType;
	statBonus: string;
}

const WEAPON_TABLE: readonly WeaponEntry[] = [
	{ range: [1, 5], type: "Melee", statBonus: "+1 STR, +1 VIT" },
	{
		range: [6, 10],
		type: "Ranged",
		statBonus:
			"+1 AGI (Heavy weapons will draw more on your mana for ammo if you have a low MAG stat.)",
	},
	{
		range: [11, 15],
		type: "Mystic",
		statBonus: "+1 MAG (Can also fire a weak magical blast or bolt.)",
	},
	{
		range: [16, 20],
		type: "Fist",
		statBonus:
			"+2 STR (You are a rough wrestler or a graceful martial artist.)",
	},
];

interface OutfitEntry {
	range: [number, number];
	type: OutfitType;
	statBonus: string;
}

const OUTFIT_TABLE: readonly OutfitEntry[] = [
	{ range: [1, 5], type: "Skimpy", statBonus: "+1 AGI" },
	{ range: [6, 10], type: "Flowing", statBonus: "+1 STR" },
	{ range: [11, 15], type: "Elaborate", statBonus: "+1 MAG" },
	{ range: [16, 20], type: "Uniform", statBonus: "+1 VIT" },
];

interface PowerEntry {
	range: [number, number];
	name: string;
	description: string;
	notes?: string;
}

const POWER_TABLE: readonly PowerEntry[] = [
	{
		range: [1, 2],
		name: "Killing Blow",
		description: "Overwhelming attack",
		notes: "+1 STR or MAG",
	},
	{
		range: [3, 4],
		name: "Hammerspace",
		description: "Extra-dimensional storage",
	},
	{
		range: [5, 6],
		name: "Twinned Soul",
		description: "Shard body and mind",
		notes: "-1 in all stats",
	},
	{
		range: [7, 8],
		name: "Focused Assault",
		description: "Focus on single target",
	},
	{ range: [9, 10], name: "Barrage", description: "Rapid succession attacks" },
	{
		range: [11, 12],
		name: "Power of Friendship",
		description: "Instinctive empathy",
	},
	{ range: [13, 14], name: "Duplication", description: "Split duplicates" },
	{ range: [15, 16], name: "Third Eye", description: "See magic flows" },
	{
		range: [17, 18],
		name: "Regeneration",
		description: "Heal and recover faster",
	},
	{
		range: [19, 20],
		name: "Tentacles",
		description: "Command tentacle-like appendages",
	},
];

const COMBAT_PERKS: Readonly<Record<number, string>> = {
	1: "+1 Weapon Stat, Dual Weapon",
	2: "+1 STR, Martial Training †",
	3: "+1 Weapon Stat, Enhanced Weapon",
	4: "Mystic Artifact",
	5: "+1 Spec Stat, Gifted †",
	6: "+1 AGI, Flexibility †",
	7: "Enhanced Transformation",
	8: "Disguise Artifact",
	9: "+1 VIT, Blood Magic",
	10: "Hammerspace Handbag",
	11: "+1 VIT, Enhanced Sustenance †",
	12: "+1 Outfit Stat, Enhanced Outfit",
	13: "Healing Artifact",
	14: "+1 Any, Ally",
	15: "Monstrous Metamorphosis",
	16: "+1 MAG, Sorcery †",
	17: "Wings",
	18: "Purification Artifact",
	19: "Awareness",
	20: "Power Artifact",
};

const SUPPORT_PERKS: Readonly<Record<number, string>> = {
	1: "Interdimensional Tourist",
	2: "+1 LCK, Closure †",
	3: "+1 LCK, Fated †",
	4: "Training",
	5: "Interdimensional Home",
	6: "Incognito",
	7: "Environmental Sealing",
	8: "Get out of Jail",
	9: "Big Damn Hero",
	10: "Absolute Direction",
	11: "Big Backpack",
	12: "Natural Aging",
	13: "+1 LCK, Masculinity †",
	14: "Overcity Shift",
	15: "Money",
	16: "Familiar",
	17: "Soul Jar",
	18: "Eternal Style",
	19: "+1 LCK, A Way Out †",
	20: "Fake Parents",
};

// ---------- Resolvers ----------

export function resolveAge(rawRoll: number): AgeResult {
	const adjusted = rawRoll <= 10 ? rawRoll : rawRoll - 10;
	return { kind: "AgeRoll", value: 6 + adjusted, rawRoll };
}

export function resolveBody(rawRoll: number): BodyResult {
	if (rawRoll <= 6) {
		return {
			kind: "BodyRoll",
			bodyType: "Underdeveloped",
			statBonusText: "+1 LCK or MAG",
			rawRoll,
		};
	}
	if (rawRoll <= 14) {
		return {
			kind: "BodyRoll",
			bodyType: "Average",
			statBonusText: "+1 AGI or VIT",
			rawRoll,
		};
	}
	return {
		kind: "BodyRoll",
		bodyType: "Overdeveloped",
		statBonusText: "+1 STR or VIT",
		rawRoll,
	};
}

export function resolveSpecialization(rawRoll: number): SpecializationResult {
	const entry = SPECIALIZATIONS.find((s) => s.roll === rawRoll);
	if (!entry) throw new Error(`Invalid specialization roll: ${rawRoll}`);
	return {
		kind: "SpecializationRoll",
		name: entry.name,
		statBonuses: entry.statBonuses,
		rawRoll,
	};
}

export function resolveWeapon(rawRoll: number): WeaponResult {
	const entry = WEAPON_TABLE.find(
		(w) => w.range[0] <= rawRoll && rawRoll <= w.range[1],
	);
	if (!entry) throw new Error(`Invalid weapon roll: ${rawRoll}`);
	return {
		kind: "WeaponRoll",
		weaponType: entry.type,
		range: `${entry.range[0]}-${entry.range[1]}`,
		statBonus: entry.statBonus,
		rawRoll,
	};
}

export function resolveOutfit(rawRoll: number): OutfitResult {
	const entry = OUTFIT_TABLE.find(
		(o) => o.range[0] <= rawRoll && rawRoll <= o.range[1],
	);
	if (!entry) throw new Error(`Invalid outfit roll: ${rawRoll}`);
	return {
		kind: "OutfitRoll",
		outfitType: entry.type,
		range: `${entry.range[0]}-${entry.range[1]}`,
		statBonus: entry.statBonus,
		rawRoll,
	};
}

export function resolvePower(rawRoll: number): PowerResult {
	const entry = POWER_TABLE.find(
		(p) => p.range[0] <= rawRoll && rawRoll <= p.range[1],
	);
	if (!entry) throw new Error(`Invalid power roll: ${rawRoll}`);
	return {
		kind: "PowerRoll",
		powerName: entry.name,
		range: `${entry.range[0]}-${entry.range[1]}`,
		description: entry.description,
		rawRoll,
	};
}

export function resolvePerk(table: PerkTable, roll: number): string {
	const perkMap = table === "Combat" ? COMBAT_PERKS : SUPPORT_PERKS;
	return perkMap[roll] ?? `Unknown (${roll})`;
}

// ---------- Stats ----------

export function computeStats(
	bodyResult: BodyResult,
	coinSpending: CoinSpending,
): StatResult[] {
	const stats: StatResult[] = [
		{ name: "STR", baseValue: 4, coinBonus: 0, bodyBonus: 0, total: 4 },
		{ name: "AGI", baseValue: 4, coinBonus: 0, bodyBonus: 0, total: 4 },
		{ name: "VIT", baseValue: 4, coinBonus: 0, bodyBonus: 0, total: 4 },
		{ name: "MAG", baseValue: 4, coinBonus: 0, bodyBonus: 0, total: 4 },
		{ name: "LCK", baseValue: 4, coinBonus: 0, bodyBonus: 0, total: 4 },
	];

	// Apply coins
	if (coinSpending.bronzeStat) {
		const s = stats.find((st) => st.name === coinSpending.bronzeStat.stat);
		if (s) {
			s.coinBonus += 1;
			s.total += 1;
		}
	}
	if (coinSpending.silverStat) {
		const s = stats.find((st) => st.name === coinSpending.silverStat.stat);
		if (s) {
			s.coinBonus += 2;
			s.total += 2;
		}
	}
	if (coinSpending.goldStat) {
		const s = stats.find((st) => st.name === coinSpending.goldStat.stat);
		if (s) {
			s.coinBonus += 4;
			s.total += 4;
		}
	}

	// Body bonus: parse bodyResult.statBonusText to find the two options and apply +1 to one of them. For the generator, we apply +1 to the first stat listed.
	const match = bodyResult.statBonusText.match(/\+1 (\w+) or (\w+)/);
	if (match) {
		// Apply +1 to the first option
		const chosen = match[1] as StatName;
		const s = stats.find((st) => st.name === chosen);
		if (s) {
			s.bodyBonus += 1;
			s.total += 1;
		}
	} else {
		// No bonus text pattern, nothing to apply
	}

	return stats;
}

// ---------- Build Generator ----------

function resolvePerks(
	dedupCombat: Set<number>,
	dedupSupport: Set<number>,
): PerkResult[] {
	const rolls = [rollD20(), rollD20(), rollD20(), rollD20(), rollD20()];
	const isFistTwo = [true, true, false, false, false];

	return rolls.map((roll, i) => {
		// Rolls 0-1 → Combat, 2-3 → Support, 4 → choice (default Combat)
		let table: PerkTable;
		if (i <= 1) table = "Combat";
		else if (i <= 3) table = "Support";
		else table = "Combat"; // user's choice — default to Combat

		// Deduplication: check if roll already claimed in this table
		const tableSet = table === "Combat" ? dedupCombat : dedupSupport;
		if (tableSet.has(roll)) {
			// Shift to opposite table
			table = table === "Combat" ? "Support" : "Combat";
		}

		// Mark as claimed
		if (table === "Combat") dedupCombat.add(roll);
		else dedupSupport.add(roll);

		return {
			kind: "PerkRoll",
			table,
			perkName: resolvePerk(table, roll),
			roll,
			isFirstTwo: isFistTwo[i],
		};
	});
}

export function generateBuild(): CharacterBuild {
	const ageRoll = rollD20();
	const bodyRoll = rollD20();
	const specRoll = rollD20();
	const weaponRoll = rollD20();
	const outfitRoll = rollD20();
	const powerRoll = rollD20();

	return {
		ageRoll: resolveAge(ageRoll),
		bodyRoll: resolveBody(bodyRoll),
		specializationRoll: resolveSpecialization(specRoll),
		weaponRoll: resolveWeapon(weaponRoll),
		outfitRoll: resolveOutfit(outfitRoll),
		powerRoll: resolvePower(powerRoll),
		perkRolls: resolvePerks(new Set(), new Set()),
		stats: computeStats(resolveBody(bodyRoll), {
			bronzeStat: null,
			silverStat: null,
			goldStat: null,
		}),
	};
}

export interface CharacterBuild {
	ageRoll: AgeResult;
	bodyRoll: BodyResult;
	specializationRoll: SpecializationResult;
	weaponRoll: WeaponResult;
	outfitRoll: OutfitResult;
	powerRoll: PowerResult;
	perkRolls: PerkResult[];
	stats: StatResult[];
}
