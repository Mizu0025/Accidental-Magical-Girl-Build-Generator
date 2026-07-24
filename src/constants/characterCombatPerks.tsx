import type { ElementByIndividualRoll } from "../types/character";

export const characterCombatPerks: ElementByIndividualRoll[] = [
	{
		roll: 1,
		name: "Dual Weapon",
		description: "Your weapon gains an additional type",
		bonus: [{ stat: "WPN", value: 1, isChoice: false }],
	},
	{
		roll: 2,
		name: "Martial Training †",
		description:
			"Gain training in tactics, logistics and the intricacies of a large number of weapons.",
		bonus: [{ stat: "STR", value: 1, isChoice: false }],
	},
	{
		roll: 3,
		name: "Enhanced Weapon",
		description: "Your weapon hits harder, is sharper or casts faster.",
		bonus: [{ stat: "WPN", value: 1, isChoice: false }],
	},
	{
		roll: 4,
		name: "Mystic Artifact",
		description:
			"You gain an artifact which can sometimes show past/present/future scenes relevant to your query.",
		bonus: [],
	},
	{
		roll: 5,
		name: "Gifted †",
		description:
			"You are naturally talented in your specialisation in a way other magical girls cannot replicate.",
		bonus: [{ stat: "SPC", value: 1, isChoice: false }],
	},
	{
		roll: 6,
		name: "Flexibility †",
		description: "You are far more flexible than should be possible.",
		bonus: [{ stat: "AGI", value: 1, isChoice: false }],
	},
	{
		roll: 7,
		name: "Enhanced Transformation",
		description: "You can transform in just 3 seconds.",
		bonus: [],
	},
	{
		roll: 8,
		name: "Disguise Artifact",
		description:
			"You gain an artifact which lets you transform into others temporarily, including their clothes and equipment.",
		bonus: [],
	},
	{
		roll: 9,
		name: "Blood Magic",
		description: "You can fuel spells with vitality, not just mana",
		bonus: [{ stat: "VIT", value: 1, isChoice: false }],
	},
	{
		roll: 10,
		name: "Hammerspace Handbag",
		description:
			"Can store objects in a extradimensional space the size of a handbag",
		bonus: [],
	},
	{
		roll: 11,
		name: "Enhanced Sustenance †",
		description:
			"You need only 4 hours sleep, have no nutritional requirements and no longer need to breathe",
		bonus: [{ stat: "VIT", value: 1, isChoice: false }],
	},
	{
		roll: 12,
		name: "Enhanced Outfit",
		description: "Outfit is much tougher and channels magic better.",
		bonus: [{ stat: "OUT", value: 1, isChoice: false }],
	},
	{
		roll: 13,
		name: "Healing Artifact",
		description:
			"You gain a handheld artifact powered by your mana which can heal almost any wound; it's slow and inefficient",
		bonus: [],
	},
	{
		roll: 14,
		name: "Ally",
		description:
			"Encounter a fellow magical girl/monstergirl who decides to fight by your side.",
		bonus: [{ stat: "ANY", value: 1, isChoice: false }],
	},
	{
		roll: 15,
		name: "Monstrous Metamorphosis",
		description:
			"When sufficiently angry or upset, You can transform into a monstrous form which is much tougher and channels magic better. Lose rational thought til you've escaped/defeated the threat.",
		bonus: [],
	},
	{
		roll: 16,
		name: "Sorcery †",
		description:
			"Learn a style of magic even regular folk can use (runecarving, ofuda, divination, etc).",
		bonus: [{ stat: "MAG", value: 1, isChoice: false }],
	},
	{
		roll: 17,
		name: "Wings",
		description:
			"Your outfit has wings, allowing gliding and (with effort) flight.",
		bonus: [],
	},
	{
		roll: 18,
		name: "Purification Artifact",
		description:
			"You gain an artifact which repels monsters from an area surrounding it.",
		bonus: [],
	},
	{
		roll: 19,
		name: "Awareness",
		description:
			"You're much more aware of anything your mundane senses can detect.",
		bonus: [],
	},
	{
		roll: 20,
		name: "Power Artifact",
		description:
			"You gain an artifact which can be used to channel a single ability from another specialisation.",
		bonus: [],
	},
];
