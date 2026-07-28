import { CharGenData } from "../constants/character";
import type {
	ElementByIndividualRoll,
	ElementByMaxRange,
} from "../types/character";
import type { PerkElement, TableRowConfig } from "../types/chargen";
import {
	assertFound,
	findByMax,
	findCharAge,
	findSpecialisationRoll,
} from "../utils/chargen";
import { calculatePerks } from "./perkCalculation";

export const generateCharacter = (diceRolls: number[]) => {
	const charAge: number = findCharAge(diceRolls[0]);
	const charBody: ElementByMaxRange = assertFound(
		findByMax(CharGenData.body, diceRolls[1]),
		`Missing body data for roll ${diceRolls[1]}`,
	);
	const charSpecialisation: ElementByIndividualRoll = assertFound(
		findSpecialisationRoll(diceRolls[2]),
		`Missing specialisation data for roll ${diceRolls[2]}`,
	);
	const charWeapon: ElementByMaxRange = assertFound(
		findByMax(CharGenData.weapon, diceRolls[3]),
		`Missing weapon data for roll ${diceRolls[3]}`,
	);
	const charOutfit: ElementByMaxRange = assertFound(
		findByMax(CharGenData.outfit, diceRolls[4]),
		`Missing outfit data for roll ${diceRolls[4]}`,
	);
	const charPower: ElementByMaxRange = assertFound(
		findByMax(CharGenData.power, diceRolls[5]),
		`Missing power data for roll ${diceRolls[5]}`,
	);

	const charPerks: PerkElement[] = calculatePerks(diceRolls);
	const tableRows: TableRowConfig[] = [
		{ category: "Age", result: charAge, roll: diceRolls[0] },
		{ category: "Body", result: charBody?.name ?? "", roll: diceRolls[1] },
		{
			category: "Specialisation",
			result: charSpecialisation?.name ?? "",
			roll: diceRolls[2],
		},
		{ category: "Weapon", result: charWeapon?.name ?? "", roll: diceRolls[3] },
		{ category: "Outfit", result: charOutfit?.name ?? "", roll: diceRolls[4] },
		{ category: "Power", result: charPower?.name ?? "", roll: diceRolls[5] },
		{
			category: "Perks",
			result: charPerks.map((p) => ({ id: p.id, name: p.name })),
			roll: diceRolls.slice(6, 11).join(", "),
		},
	];

	return tableRows;
};
