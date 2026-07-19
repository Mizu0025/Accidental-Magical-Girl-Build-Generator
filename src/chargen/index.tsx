import { CharGenData } from "../constants/character";
import type {
	ElementByIndividualRoll,
	ElementByMaxRange,
} from "../types/character";
import "./style.css";

type TableRowConfig = {
	category: string;
	result: string | number | string[];
	roll: string | number;
};

const findCharAge = (roll: number) => 6 + roll + (roll > 10 ? -10 : 0);
const findByMax = (arr: ElementByMaxRange[], roll: number) =>
	arr.find((item) => roll <= item.max);
const findSpecialisationRoll = (roll: number) =>
	CharGenData.specialisation.find(
		(specialisation) => specialisation.roll === roll,
	);
const findPerks = (category: "combat" | "support", roll: number) =>
	CharGenData.perks[category].find((p) => p.roll === roll);
const assertFound: <T>(result: T | undefined, message: string) => T = <T,>(
	result: T | undefined,
	message: string,
) => {
	if (result === undefined) throw new Error(message);
	return result;
};

const calculatePerks = (dice: number[]) => {
	return [
		assertFound(
			findPerks("combat", dice[6]),
			`Missing combat perk for roll ${dice[6]}`,
		),
		assertFound(
			findPerks("combat", dice[7]),
			`Missing combat perk for roll ${dice[7]}`,
		),
		assertFound(
			findPerks("support", dice[8]),
			`Missing support perk for roll ${dice[8]}`,
		),
		assertFound(
			findPerks("support", dice[9]),
			`Missing support perk for roll ${dice[9]}`,
		),
		assertFound(
			findPerks("combat", dice[10]),
			`Missing combat perk for roll ${dice[10]}`,
		),
		assertFound(
			findPerks("support", dice[10]),
			`Missing support perk for roll ${dice[10]}`,
		),
	];
};

const generateCharacter = (diceRolls: number[]) => {
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
	const charPerks = calculatePerks(diceRolls);

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
			result: charPerks.map((p) => p?.name).filter(Boolean),
			roll: diceRolls.slice(6, 11).join(", "),
		},
	];

	return tableRows;
};

const CharacterResults = ({ diceRolls }: { diceRolls: number[] }) => {
	const tableRows = generateCharacter(diceRolls);

	return (
		<div className="table-container">
			<table>
				<thead>
					<tr>
						<th>Category</th>
						<th>Result</th>
						<th>Roll</th>
					</tr>
				</thead>
				<tbody>
					{tableRows.map(({ category, result, roll }) => (
						<tr key={category}>
							<td>{category}</td>
							<td>
								{Array.isArray(result) ? (
									<ul>
										{result.map((item, i) => (
											<li key={i}>{item}</li>
										))}
									</ul>
								) : (
									result
								)}
							</td>
							<td>{roll}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default CharacterResults;
