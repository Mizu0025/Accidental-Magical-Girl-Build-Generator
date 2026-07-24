import type { ElementByIndividualRoll } from "../types/character";

export const characterSupportPerks: ElementByIndividualRoll[] = [
	{
		roll: 1,
		name: "Interdimensional Tourist",
		description: "Encounter an interdimensional traveler who helps you out.",
		bonus: [],
	},
	{
		roll: 2,
		name: "Closure †",
		description:
			"Your family believe you died some time ago, with your possessions redistributed accordingly.",
		bonus: [{ stat: "LCK", value: 1, isChoice: false }],
	},
	{
		roll: 3,
		name: "Fated †",
		description:
			"You're fated for some task, and until it's complete you find events conspiring to help you out.",
		bonus: [{ stat: "LCK", value: 1, isChoice: false }],
	},
	{
		roll: 4,
		name: "Training",
		description:
			"Complete mastery of a single subject, martial art, trade skill or philosophy known by 21st century humanity.",
		bonus: [],
	},
	{
		roll: 5,
		name: "Interdimensional Home",
		description: "You gain access to a pocket dimension apartment",
		bonus: [],
	},
	{
		roll: 6,
		name: "Incognito",
		description: "People often overlook you or forget your identity.",
		bonus: [],
	},
	{
		roll: 7,
		name: "Environmental Sealing",
		description:
			"Immune to environmental hazards of pressure and temperature, generate air in a thin layer around your body. Shared to anyone touching you.",
		bonus: [],
	},
	{
		roll: 8,
		name: "Get out of Jail",
		description:
			"Can teleport to a random safe location if imprisoned or trapped",
		bonus: [],
	},
	{
		roll: 9,
		name: "Big Damn Hero",
		description:
			"Can give someone/a location a token then instinctively know when danger approaches.",
		bonus: [],
	},
	{
		roll: 10,
		name: "Absolute Direction",
		description:
			"Always know which direction to travel in order to reach a destination or object.",
		bonus: [],
	},
	{
		roll: 11,
		name: "Big Backpack",
		description:
			"Big backpack full of useful items (food, identification documents, clothes, local currency).",
		bonus: [],
	},
	{
		roll: 12,
		name: "Natural Aging",
		description: "You can age naturally.",
		bonus: [],
	},
	{
		roll: 13,
		name: "Masculinity †",
		description: "Your gender is male.",
		bonus: [{ stat: "LCK", value: 1, isChoice: false }],
	},
	{
		roll: 14,
		name: "Overcity Shift",
		description:
			"Can shift yourself and a small area surrounding you into/out of the Overcity",
		bonus: [],
	},
	{
		roll: 15,
		name: "Money",
		description:
			"Gain a small amount of local currency each month, equiv. to a low income job (eg; 3000 USD)",
		bonus: [],
	},
	{
		roll: 16,
		name: "Familiar",
		description:
			"You have a small animal companion with knowledge about magic and monsters. Can transform into a human form temporarily, needing rest afterwards.",
		bonus: [],
	},
	{
		roll: 17,
		name: "Soul Jar",
		description:
			"Your body is a puppet controlled by your soul, now residing in a small breakable container; if destroyed you instantly die.",
		bonus: [],
	},
	{
		roll: 18,
		name: "Eternal Style",
		description:
			"Body and clothing always kept pristine. Can summon new clothing at will, but it vanishes 2 hours afterwards when not worn by you.",
		bonus: [],
	},
	{
		roll: 19,
		name: "A Way Out †",
		description:
			"Can willingly make your next death permanent, instead of regenerating your body from mana.",
		bonus: [{ stat: "LCK", value: 1, isChoice: false }],
	},
	{
		roll: 20,
		name: "Fake Parents",
		description:
			"You have a pair of adults who are convinced they're your parents, with documentation proving it, and have just moved into town.",
		bonus: [],
	},
];
