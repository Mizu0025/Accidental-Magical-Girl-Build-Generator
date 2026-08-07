import { useCallback, useState } from "react";
import "./App.css";

const CATEGORIES = [
	"age",
	"body",
	"specialisation",
	"weapon",
	"outfit",
	"power",
] as const;

const PERKS = [
	"keen sight",
	"iron will",
	"quick reflexes",
	"lucky charm",
	"vitality",
] as const;

type RollData = { category: string; result: string; roll: number };

const resultsByCategory: Record<string, string[]> = {
	age: [
		"child",
		"teen",
		"young adult",
		"adult",
		"middle aged",
		"senior",
		"elder",
	],
	body: [
		"slight",
		"slender",
		"average",
		"athletic",
		"muscular",
		"stocky",
		"heavy",
		"massive",
	],
	specialisation: [
		"warrior",
		"mage",
		"ranger",
		"thief",
		"cleric",
		"bard",
		"monk",
		"paladin",
		"druid",
		"alchemist",
		"rogue",
	],
	weapon: [
		"sword",
		"axe",
		"mace",
		"bow",
		"dagger",
		"staff",
		"whip",
		"spear",
		"scythe",
		"hammer",
		"crossbow",
	],
	outfit: [
		"rags",
		"peasant clothes",
		"adventurer's gear",
		"leather armor",
		"chainmail",
		"plate armor",
		"robe",
		"cloak",
		"uniform",
		"ceremonial garb",
		"traveler's outfit",
	],
	power: [
		"fire",
		"ice",
		"lightning",
		"earth",
		"wind",
		"water",
		"light",
		"dark",
		"shadow",
		"nature",
		"mind",
		"gravity",
	],
};

function mapResult(category: string, roll: number): string {
	const options = resultsByCategory[category];
	if (!options) return String(roll);
	return options[(roll - 1) % options.length];
}

function generateBuild(): RollData[] {
	const rows: RollData[] = [];
	for (const category of CATEGORIES) {
		const roll = Math.floor(Math.random() * 20) + 1;
		rows.push({ category, result: mapResult(category, roll), roll });
	}

	for (const perk of PERKS) {
		const roll = Math.floor(Math.random() * 20) + 1;
		rows.push({ category: "Perks", result: perk, roll });
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
				<table>
					<thead>
						<tr>
							<th>Category</th>
							<th>Result</th>
							<th>Roll</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={`${row.category}-${row.result}`}>
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
