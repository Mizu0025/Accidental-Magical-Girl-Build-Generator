import { CharGenData } from "../constants/character";
import type { ElementByMaxRange } from "../types/character";

export const findCharAge = (roll: number) => 6 + roll + (roll > 10 ? -10 : 0);

export const findByMax = (arr: ElementByMaxRange[], roll: number) =>
	arr.find((item) => roll <= item.max);

export const findSpecialisationRoll = (roll: number) =>
	CharGenData.specialisation.find(
		(specialisation) => specialisation.roll === roll,
	);

export const findPerks = (category: "combat" | "support", roll: number) =>
	CharGenData.perks[category].find((p) => p.roll === roll);

export const assertFound: <T>(result: T | undefined, message: string) => T = <
	T,
>(
	result: T | undefined,
	message: string,
) => {
	if (result === undefined) throw new Error(message);
	return result;
};
