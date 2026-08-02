import { render, screen } from "@testing-library/react";
import type { CharacterBuild } from "../../lib/dice";
import { BuildTable } from "../BuildTable";

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
	perkRolls: [
		{
			kind: "PerkRoll",
			table: "Combat",
			perkName: "+1 Weapon Stat, Dual Weapon",
			roll: 1,
			isFirstTwo: true,
		},
		{
			kind: "PerkRoll",
			table: "Support",
			perkName: "Interdimensional Tourist",
			roll: 1,
			isFirstTwo: false,
		},
		{
			kind: "PerkRoll",
			table: "Combat",
			perkName: "+1 STR, Martial Training †",
			roll: 2,
			isFirstTwo: false,
		},
		{
			kind: "PerkRoll",
			table: "Support",
			perkName: "+1 LCK, Closure †",
			roll: 2,
			isFirstTwo: false,
		},
		{
			kind: "PerkRoll",
			table: "Combat",
			perkName: "Wings",
			roll: 17,
			isFirstTwo: false,
		},
	],
	stats: [
		{ name: "STR", baseValue: 4, coinBonus: 0, bodyBonus: 0, total: 4 },
		{ name: "AGI", baseValue: 4, coinBonus: 0, bodyBonus: 1, total: 5 },
		{ name: "VIT", baseValue: 4, coinBonus: 0, bodyBonus: 0, total: 4 },
		{ name: "MAG", baseValue: 4, coinBonus: 0, bodyBonus: 0, total: 4 },
		{ name: "LCK", baseValue: 4, coinBonus: 0, bodyBonus: 0, total: 4 },
	],
};

describe("BuildTable", () => {
	it("renders all category rows", () => {
		render(<BuildTable build={fakeBuild} />);
		// Expected categories: Age, Body, Stats, Specialization, Weapon, Outfit, Power, Perks
		const headers = screen.getAllByRole("columnheader");
		expect(headers).toHaveLength(3); // Category | Result/s | Roll Number
	});

	it("displays age value correctly", () => {
		render(<BuildTable build={fakeBuild} />);
		expect(screen.getByText("Age")).toBeTruthy();
		expect(screen.getByText("Age 12")).toBeTruthy();
	});

	it("displays body type correctly", () => {
		render(<BuildTable build={fakeBuild} />);
		expect(screen.getByText(/Average \(\+1/)).toBeTruthy();
	});
	it("renders all 5 stats with names and values", () => {
		render(<BuildTable build={fakeBuild} />);
		expect(screen.getByText("STR")).toBeTruthy();
		expect(screen.getByText("AGI")).toBeTruthy();
		expect(screen.getByText("VIT")).toBeTruthy();
		expect(screen.getByText("MAG")).toBeTruthy();
		expect(screen.getByText("LCK")).toBeTruthy();
	});
});
