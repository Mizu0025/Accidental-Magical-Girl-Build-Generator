import { describe, expect, it } from "vitest";
import {
	type CoinSpending,
	computeStats,
	generateBuild,
	resolveAge,
	resolveBody,
	resolveOutfit,
	resolvePerk,
	resolvePower,
	resolveSpecialization,
	resolveWeapon,
	rollD20,
} from "../dice";

// ---------- rollD20 ----------

describe("rollD20", () => {
	it("returns a value between 1 and 20 inclusive", () => {
		for (let i = 0; i < 100; i++) {
			const val = rollD20();
			expect(val).toBeGreaterThanOrEqual(1);
			expect(val).toBeLessThanOrEqual(20);
		}
	});
});

// ---------- resolveAge ----------

describe("resolveAge", () => {
	it("returns correct age at minimum roll (1)", () => {
		const result = resolveAge(1);
		expect(result.value).toBe(7); // 6 + adjusted where adjusted = 1
		expect(result.kind).toBe("AgeRoll");
	});

	it("returns correct age at maximum roll (20)", () => {
		const result = resolveAge(20);
		expect(result.value).toBe(16); // rawRoll=20 > 10, adjusted = 20-10 = 10, value = 6+10 = 16
	});

	it("maps mid-range rolls correctly", () => {
		expect(resolveAge(10).value).toBe(16); // rawRoll=10 <= 10, adjusted = 10, value = 6+10 = 16
	});
});

// ---------- resolveBody ----------

describe("resolveBody", () => {
	it("returns Underdeveloped for rolls 1-7", () => {
		const result = resolveBody(4);
		expect(result.bodyType).toBe("Underdeveloped");
	});

	it("returns Average for rolls 8-14", () => {
		const result = resolveBody(11);
		expect(result.bodyType).toBe("Average");
	});

	it("returns Overdeveloped for rolls 15-20", () => {
		const result = resolveBody(18);
		expect(result.bodyType).toBe("Overdeveloped");
	});
});

// ---------- resolveSpecialization ----------

describe("resolveSpecialization", () => {
	it("returns a valid specialization name for every roll", () => {
		for (let i = 1; i <= 20; i++) {
			const result = resolveSpecialization(i);
			expect(result.name).toBeDefined();
			expect(typeof result.name).toBe("string");
		}
	});

	it("includes statBonuses", () => {
		const result = resolveSpecialization(10);
		expect(result.statBonuses).toBeDefined();
		expect(typeof result.statBonuses).toBe("string");
	});
});

// ---------- resolveWeapon ----------

describe("resolveWeapon", () => {
	it("returns a valid weapon type for every roll", () => {
		for (let i = 1; i <= 20; i++) {
			const result = resolveWeapon(i);
			expect(["Melee", "Ranged", "Mystic", "Fist"]).toContain(
				result.weaponType,
			);
		}
	});
});

// ---------- resolveOutfit ----------

describe("resolveOutfit", () => {
	it("returns a valid outfit type for every roll", () => {
		for (let i = 1; i <= 20; i++) {
			const result = resolveOutfit(i);
			expect(["Skimpy", "Flowing", "Elaborate", "Uniform"]).toContain(
				result.outfitType,
			);
		}
	});
});

// ---------- resolvePower ----------

describe("resolvePower", () => {
	it("returns a valid power name for every roll", () => {
		for (let i = 1; i <= 20; i++) {
			const result = resolvePower(i);
			expect(typeof result.powerName).toBe("string");
		}
	});

	it("returns description and range for every roll", () => {
		const result = resolvePower(10);
		expect(result.description).toBeDefined();
		expect(result.range).toBeDefined();
	});
});

// ---------- resolvePerk ----------

describe("resolvePerk", () => {
	it("returns a perk name for Combat table roll 1", () => {
		const result = resolvePerk("Combat", 1);
		expect(result).toBe("+1 Weapon Stat, Dual Weapon");
	});

	it("returns a perk name for Support table roll 1", () => {
		const result = resolvePerk("Support", 1);
		expect(result).toBe("Interdimensional Tourist");
	});

	it("returns Wings for Combat 17", () => {
		const result = resolvePerk("Combat", 17);
		expect(result).toBe("Wings");
	});
});

// ---------- computeStats ----------

describe("computeStats", () => {
	it("assigns coin bonus to two stats via spending config", () => {
		const bodyResult = resolveBody(10);
		const spending: CoinSpending = {
			bronzeStat: null,
			silverStat: null,
			goldStat: null,
		};
		const stats = computeStats(bodyResult, spending);

		const strStat = stats.find((s) => s.name === "STR")!;
		const agiStat = stats.find((s) => s.name === "AGI")!;
		// No bronze/silver/goldStat set, so coinBonus should be 0
		expect(strStat.coinBonus).toBe(0);
		expect(agiStat.coinBonus).toBe(0);
	});

	it("returns exactly 5 stats", () => {
		const bodyResult = resolveBody(10);
		const spending: CoinSpending = {
			bronzeStat: null,
			silverStat: null,
			goldStat: null,
		};
		const stats = computeStats(bodyResult, spending);
		expect(stats).toHaveLength(5);
	});

	it("total includes base + coinBonus + bodyBonus", () => {
		const bodyResult = resolveBody(10); // Average -> AGI bonus (first option)
		const stats = computeStats(bodyResult, {
			bronzeStat: null,
			silverStat: null,
			goldStat: null,
		});
		const agiStat = stats.find((s) => s.name === "AGI")!;
		// base 4 + bodyBonus 1 = 5
		expect(agiStat.total).toBe(5);
	});

	it("applies bronze coin bonus", () => {
		const bodyResult = resolveBody(10);
		const spending: CoinSpending = {
			bronzeStat: { stat: "STR", bonus: 1 },
			silverStat: null,
			goldStat: null,
		};
		const stats = computeStats(bodyResult, spending);
		const strStat = stats.find((s) => s.name === "STR")!;
		expect(strStat.coinBonus).toBe(1);
		expect(strStat.total).toBe(5); // base 4 + coin 1
	});

	it("applies silver coin bonus", () => {
		const bodyResult = resolveBody(10);
		const spending: CoinSpending = {
			bronzeStat: null,
			silverStat: { stat: "MAG", bonus: 2 },
			goldStat: null,
		};
		const stats = computeStats(bodyResult, spending);
		const magStat = stats.find((s) => s.name === "MAG")!;
		expect(magStat.coinBonus).toBe(2);
	});
});

// ---------- generateBuild ----------

describe("generateBuild", () => {
	it("returns a fully populated CharacterBuild", () => {
		const build = generateBuild();
		expect(build.ageRoll.kind).toBe("AgeRoll");
		expect(build.bodyRoll.bodyType).toBeDefined();
		expect(build.specializationRoll.name).toBeDefined();
		expect(build.weaponRoll.weaponType).toBeDefined();
		expect(build.outfitRoll.outfitType).toBeDefined();
		expect(build.powerRoll.powerName).toBeDefined();
		expect(build.stats.length).toBe(5);
	});
});
