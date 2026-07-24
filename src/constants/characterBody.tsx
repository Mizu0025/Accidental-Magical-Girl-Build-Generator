import type { ElementByMaxRange } from "../types/character";

export const characterBody: ElementByMaxRange[] = [
	{
		max: 6,
		name: "Underdeveloped",
		description: "Smaller, sickly, thin, or much younger looking.",
		bonus: [
			{ stat: "LCK", value: 1, isChoice: true },
			{ stat: "MAG", value: 1, isChoice: true },
		],
	},
	{
		max: 14,
		name: "Average",
		description: "Average for your age. No standout features.",
		bonus: [
			{ stat: "AGI", value: 1, isChoice: true },
			{ stat: "VIT", value: 1, isChoice: true },
		],
	},
	{
		max: 20,
		name: "Overdeveloped",
		description:
			"Taller, bigger, wider, more muscular, appears older or has precocious puberty.",
		bonus: [
			{ stat: "STR", value: 1, isChoice: true },
			{ stat: "VIT", value: 1, isChoice: true },
		],
	},
];
