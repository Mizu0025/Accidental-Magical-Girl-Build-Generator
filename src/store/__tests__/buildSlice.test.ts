import { describe, expect, it } from "vitest";
import type { CharacterBuild } from "../../lib/dice";
import buildReducer, { resetBuild, setBuild } from "../buildSlice";

const fakeBuild: CharacterBuild = {
	ageRoll: { kind: "AgeRoll", value: 12, rawRoll: 6 },
	bodyRoll: {
		kind: "BodyRoll",
		bodyType: "Average",
		statBonusText: "+1 AGI or VIT",
		rawRoll: 10,
	},
	specializationRoll: {
		kind: "SpecializationRoll",
		name: "Time",
		statBonuses: "+1 AGI or VIT, +2 LCK",
		rawRoll: 7,
	},
	weaponRoll: {
		kind: "WeaponRoll",
		weaponType: "Melee",
		range: "1-5",
		statBonus: "+1 STR, +1 VIT",
		rawRoll: 3,
	},
	outfitRoll: {
		kind: "OutfitRoll",
		outfitType: "Skimpy",
		range: "1-5",
		statBonus: "+1 AGI",
		rawRoll: 2,
	},
	powerRoll: {
		kind: "PowerRoll",
		powerName: "Focused Assault",
		range: "7-8",
		description: "Focus on single target",
		rawRoll: 8,
	},
	perkRolls: [],
	stats: [],
};

describe("buildSlice initial state", () => {
	it("has build null and isGenerating false", () => {
		const result = buildReducer(undefined, { type: "random" });
		expect(result).toEqual({
			build: null,
			isGenerating: false,
		});
	});
});

describe("setBuild", () => {
	it("updates build to the passed CharacterBuild", () => {
		const result = buildReducer(undefined, setBuild(fakeBuild));
		expect(result.build).toBe(fakeBuild);
	});
});

describe("resetBuild", () => {
	it("returns to initial state with null build", () => {
		const result = buildReducer(
			{ build: fakeBuild, isGenerating: false },
			resetBuild(),
		);
		expect(result.build).toBeNull();
		expect(result.isGenerating).toBe(false);
	});
});
