import type { ElementByMaxRange } from "../types/character";

export const characterOutfit: ElementByMaxRange[] = [
	{
		max: 5,
		name: "Skimpy",
		description: "Skintight, leotards, bikinis...",
		bonus: [{ stat: "AGI", value: 1, isChoice: false }],
	},
	{
		max: 10,
		name: "Flowing",
		description: "Coats, robes, capes, togas...",
		bonus: [{ stat: "STR", value: 1, isChoice: false }],
	},
	{
		max: 15,
		name: "Elaborate",
		description: "Dresses, fancy cosplay, gowns...",
		bonus: [{ stat: "MAG", value: 1, isChoice: false }],
	},
	{
		max: 20,
		name: "Uniform",
		description: "School/military uniforms, business...",
		bonus: [{ stat: "VIT", value: 1, isChoice: false }],
	},
];
