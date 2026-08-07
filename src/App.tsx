import { useCallback, useState } from "react";
import "./App.css";

import { resolveBody } from "./constants/body";
import { resolveCombatPerk } from "./constants/combatPerks";
import { resolveOutfit } from "./constants/outfit";
import { resolvePower } from "./constants/power";
import { resolveSpecialisation } from "./constants/specialisation";
import { resolveSupportPerk } from "./constants/supportPerks";
import { resolveWeapon } from "./constants/weapon";

type RollData = { id: string; category: string; result: string; roll: number };

function rollD20(): number {
	return Math.floor(Math.random() * 20) + 1;
}

function computeAge(roll: number): number {
	return 6 + (roll > 10 ? roll - 10 : roll);
}

function generateBuild(): RollData[] {
	const rolls = Array.from({ length: 11 }, () => rollD20());

	const rows: RollData[] = [];
	let id = 0;

	rows.push({
		id: String(id++),
		category: "age",
		result: String(computeAge(rolls[0])),
		roll: rolls[0],
	});
	rows.push({
		id: String(id++),
		category: "body",
		result: resolveBody(rolls[1]),
		roll: rolls[1],
	});
	rows.push({
		id: String(id++),
		category: "specialisation",
		result: resolveSpecialisation(rolls[2]),
		roll: rolls[2],
	});
	rows.push({
		id: String(id++),
		category: "weapon",
		result: resolveWeapon(rolls[3]),
		roll: rolls[3],
	});
	rows.push({
		id: String(id++),
		category: "outfit",
		result: resolveOutfit(rolls[4]),
		roll: rolls[4],
	});
	rows.push({
		id: String(id++),
		category: "power",
		result: resolvePower(rolls[5]),
		roll: rolls[5],
	});

	const perkRolls = rolls.slice(6); // rolls[6..10], indices 0..4 for perks
	const givenPerks = new Set<string>();

	for (let i = 0; i < perkRolls.length; i++) {
		const roll = perkRolls[i];
		const isCombatSlot = i < 2;

		const normalPerk = isCombatSlot
			? resolveCombatPerk(roll)
			: resolveSupportPerk(roll);
		const oppositePerk = isCombatSlot
			? resolveSupportPerk(roll)
			: resolveCombatPerk(roll);

		let result: string;
		let table: string;

		if (normalPerk && !givenPerks.has(normalPerk)) {
			result = normalPerk;
			table = isCombatSlot ? "Combat" : "Support";
			givenPerks.add(normalPerk);
		} else if (oppositePerk && !givenPerks.has(oppositePerk)) {
			result = oppositePerk;
			table = isCombatSlot ? "Support" : "Combat";
			givenPerks.add(oppositePerk);
		} else if (normalPerk) {
			// Normal perk is taken; opposite unavailable
			result = "Free Pick";
			table = "";
		} else {
			// Both tables have no perk for this roll
			result = "Free Pick";
			table = "";
		}

		rows.push({
			id: String(id++),
			category: "perks",
			result: table ? `${result} [${table}]` : result,
			roll,
		});
	}

	return rows;
}

function App() {
	const [rows, setRows] = useState<RollData[] | null>(null);

	const handleRoll = useCallback(() => {
		setRows(generateBuild());
	}, []);

	return (
		<>
			<button type="button" onClick={handleRoll}>
				{rows ? "Reroll" : "Generate"}
			</button>
			{rows && (
				<table data-testid="character-sheet">
					<thead>
						<tr>
							<th>Category</th>
							<th>Result</th>
							<th>Roll</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.id}>
								<td>{row.category}</td>
								<td>{row.result}</td>
								<td>{row.roll}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	);
}

export default App;
