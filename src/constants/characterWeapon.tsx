import type { ElementByMaxRange } from "../types/character";

export const characterWeapon: ElementByMaxRange[] = [
	{
		max: 5,
		name: "Melee",
		description: "Blades, hammers, axes, polearms...",
		bonus: [
			{ stat: "STR", value: 1, isChoice: false },
			{ stat: "VIT", value: 1, isChoice: false },
		],
	},
	{
		max: 10,
		name: "Ranged",
		description: "Bows, rifles, slingshots...",
		bonus: [{ stat: "AGI", value: 1, isChoice: false }],
	},
	{
		max: 15,
		name: "Mystic",
		description: "Rods, staves, orbs, wands...",
		bonus: [{ stat: "MAG", value: 1, isChoice: false }],
	},
	{
		max: 20,
		name: "Fist",
		description: "Gauntlets, boots, fists...",
		bonus: [{ stat: "STR", value: 2, isChoice: false }],
	},
];
