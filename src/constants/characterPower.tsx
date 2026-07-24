import type { ElementByMaxRange } from "../types/character";

export const characterPower: ElementByMaxRange[] = [
	{
		max: 2,
		name: "Killing Blow",
		description: "Overwhelming single attack.",
		bonus: [
			{ stat: "STR", value: 1, isChoice: true },
			{ stat: "MAG", value: 1, isChoice: true },
		],
	},
	{
		max: 4,
		name: "Hammerspace",
		description: "Extra-dimensional storage.",
		bonus: [],
	},
	{
		max: 6,
		name: "Twinned Soul",
		description: "Splits soul into two bodies.",
		bonus: [
			{ stat: "STR", value: -1, isChoice: false },
			{ stat: "AGI", value: -1, isChoice: false },
			{ stat: "VIT", value: -1, isChoice: false },
			{ stat: "MAG", value: -1, isChoice: false },
			{ stat: "LCK", value: -1, isChoice: false },
		],
	},
	{
		max: 8,
		name: "Focused Assault",
		description: "Punishing blows on single enemy.",
		bonus: [],
	},
	{
		max: 10,
		name: "Barrage",
		description: "Rapid succession attacks.",
		bonus: [],
	},
	{
		max: 12,
		name: "Power of Friendship",
		description: "Instinctive social skills.",
		bonus: [],
	},
	{
		max: 14,
		name: "Duplication",
		description: "Create solid duplicates.",
		bonus: [],
	},
	{ max: 16, name: "Third Eye", description: "See magic flows.", bonus: [] },
	{
		max: 18,
		name: "Regeneration",
		description: "Heal & recover fast.",
		bonus: [],
	},
	{
		max: 20,
		name: "Tentacles",
		description: "Command tentacle-like appendages.",
		bonus: [],
	},
];
