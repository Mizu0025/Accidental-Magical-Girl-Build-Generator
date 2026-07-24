import type { ElementByIndividualRoll } from "../types/character";

export const characterSpecialisation: ElementByIndividualRoll[] = [
	{
		roll: 1,
		name: "Fire",
		description: "Can magically create fire.",
		bonus: [
			{ stat: "STR", value: 3, isChoice: true },
			{ stat: "MAG", value: 3, isChoice: true },
		],
	},
	{
		roll: 2,
		name: "Ice",
		description: "Can magically create ice.",
		bonus: [
			{ stat: "STR", value: 2, isChoice: true },
			{ stat: "MAG", value: 2, isChoice: true },
			{ stat: "VIT", value: 1, isChoice: false },
		],
	},
	{
		roll: 3,
		name: "Air",
		description: "Can magically control air.",
		bonus: [{ stat: "AGI", value: 4, isChoice: false }],
	},
	{
		roll: 4,
		name: "Spirit",
		description: "Can magically create spirit.",
		bonus: [
			{ stat: "MAG", value: 2, isChoice: false },
			{ stat: "MAG", value: 1, isChoice: true },
			{ stat: "LCK", value: 1, isChoice: true },
			{ stat: "LCK", value: 2, isChoice: false },
		],
	},
	{
		roll: 5,
		name: "Reinforcement",
		description:
			"Can magically reinforce yourself and others, alongside healing injuries.",
		bonus: [
			{ stat: "STR", value: 1, isChoice: false },
			{ stat: "AGI", value: 1, isChoice: false },
			{ stat: "MAG", value: 1, isChoice: false },
			{ stat: "LCK", value: 1, isChoice: false },
		],
	},
	{
		roll: 6,
		name: "Psychic",
		description: "Can magically read minds and mentally manipulate people.",
		bonus: [
			{ stat: "MAG", value: 2, isChoice: false },
			{ stat: "LCK", value: 2, isChoice: false },
		],
	},
	{
		roll: 7,
		name: "Time",
		description: "Can magically control time.",
		bonus: [
			{ stat: "AGI", value: 1, isChoice: true },
			{ stat: "VIT", value: 1, isChoice: true },
			{ stat: "LCK", value: 2, isChoice: false },
		],
	},
	{
		roll: 8,
		name: "Lightning",
		description: "Can magically create lightning.",
		bonus: [
			{ stat: "STR", value: 1, isChoice: true },
			{ stat: "MAG", value: 1, isChoice: true },
			{ stat: "AGI", value: 2, isChoice: false },
		],
	},
	{
		roll: 9,
		name: "Sound",
		description: "Can magically create sound.",
		bonus: [
			{ stat: "AGI", value: 1, isChoice: false },
			{ stat: "MAG", value: 2, isChoice: false },
			{ stat: "LCK", value: 1, isChoice: false },
		],
	},
	{
		roll: 10,
		name: "Darkness",
		description: "Can magically create darkness.",
		bonus: [
			{ stat: "STR", value: 2, isChoice: true },
			{ stat: "MAG", value: 2, isChoice: true },
			{ stat: "VIT", value: 1, isChoice: false },
		],
	},
	{
		roll: 11,
		name: "Illusion",
		description: "Can magically create illusions.",
		bonus: [
			{ stat: "STR", value: 2, isChoice: false },
			{ stat: "VIT", value: 1, isChoice: false },
			{ stat: "LCK", value: 1, isChoice: false },
		],
	},
	{
		roll: 12,
		name: "Light",
		description: "Can magically control and generate light.",
		bonus: [
			{ stat: "AGI", value: 1, isChoice: false },
			{ stat: "VIT", value: 2, isChoice: false },
			{ stat: "MAG", value: 1, isChoice: false },
		],
	},
	{
		roll: 13,
		name: "Wood",
		description: "Can magically create wood.",
		bonus: [
			{ stat: "STR", value: 1, isChoice: false },
			{ stat: "VIT", value: 1, isChoice: false },
			{ stat: "MAG", value: 2, isChoice: false },
		],
	},
	{
		roll: 14,
		name: "Empathic",
		description:
			"Empowered by emotions of those around you, can store it for later use. Emotion name determines which specialisation you mimic while reserves last.",
		bonus: [
			{ stat: "STR", value: 1, isChoice: true },
			{ stat: "MAG", value: 1, isChoice: true },
			{ stat: "LCK", value: 2, isChoice: false },
		],
	},
	{
		roll: 15,
		name: "Water",
		description: "Can magically control and generate water.",
		bonus: [
			{ stat: "STR", value: 1, isChoice: false },
			{ stat: "AGI", value: 2, isChoice: false },
			{ stat: "MAG", value: 1, isChoice: false },
		],
	},
	{
		roll: 16,
		name: "Gravity",
		description: "Can magically control gravity.",
		bonus: [{ stat: "MAG", value: 4, isChoice: false }],
	},
	{
		roll: 17,
		name: "Stone",
		description: "Can magically create and control stone.",
		bonus: [
			{ stat: "STR", value: 3, isChoice: true },
			{ stat: "VIT", value: 3, isChoice: true },
		],
	},
	{
		roll: 18,
		name: "Beast",
		description:
			"Can magically summon and enhance animals; can also enhance yourself.",
		bonus: [
			{ stat: "STR", value: 1, isChoice: false },
			{ stat: "AGI", value: 1, isChoice: false },
			{ stat: "VIT", value: 1, isChoice: true },
			{ stat: "LCK", value: 1, isChoice: true },
		],
	},
	{
		roll: 19,
		name: "Metal",
		description: "Can magically control and generate metal.",
		bonus: [
			{ stat: "STR", value: 3, isChoice: true },
			{ stat: "LCK", value: 3, isChoice: true },
		],
	},
	{
		roll: 20,
		name: "Oddball",
		description:
			"Narrowly focused, but useful command of some element or concept (eg; candy, bone, paper, fairy tales).",
		bonus: [
			{ stat: "ANY", value: 2, isChoice: false },
			{ stat: "ANY", value: 1, isChoice: false },
		],
	},
];
