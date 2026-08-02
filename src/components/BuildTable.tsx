import type { CharacterBuild } from "../lib/dice";
import { StatTable } from "./StatTable";

interface BuildTableProps {
	build: CharacterBuild;
}

export function BuildTable({ build }: BuildTableProps): React.JSX.Element {
	const rows: Array<{ category: string; result: string; roll: string }> = [];

	// Age
	rows.push({
		category: "Age",
		result: `Age ${build.ageRoll.value}`,
		roll: `${build.ageRoll.rawRoll}`,
	});

	// Body
	rows.push({
		category: "Body",
		result: `${build.bodyRoll.bodyType} (${build.bodyRoll.statBonusText})`,
		roll: `${build.bodyRoll.rawRoll}`,
	});

	// Specialization
	rows.push({
		category: "Specialization",
		result: `${build.specializationRoll.name} — ${build.specializationRoll.statBonuses}`,
		roll: `${build.specializationRoll.rawRoll}`,
	});

	// Weapon
	rows.push({
		category: "Weapon",
		result: `${build.weaponRoll.weaponType} (${build.weaponRoll.range}) — ${build.weaponRoll.statBonus}`,
		roll: `${build.weaponRoll.rawRoll}`,
	});

	// Outfit
	rows.push({
		category: "Outfit",
		result: `${build.outfitRoll.outfitType} (${build.outfitRoll.range}) — ${build.outfitRoll.statBonus}`,
		roll: `${build.outfitRoll.rawRoll}`,
	});

	// Power
	rows.push({
		category: "Power",
		result: `${build.powerRoll.powerName} — ${build.powerRoll.description}`,
		roll: `${build.powerRoll.rawRoll}`,
	});

	// Perks
	build.perkRolls.forEach((perk, i) => {
		rows.push({
			category: `Perk #${i + 1}`,
			result: `${perk.table} — ${perk.perkName}`,
			roll: `${perk.roll}`,
		});
	});

	return (
		<div className="flex items-start mt-6">
			<StatTable stats={build.stats} />
			<table className="w-full border-collapse">
				<thead>
					<tr className="bg-primary-600 text-white">
						<th className="px-4 py-2 text-left" scope="col">
							Category
						</th>
						<th className="px-4 py-2 text-left" scope="col">
							Result/s
						</th>
						<th className="px-4 py-2 text-left" scope="col">
							Roll Number
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr
							key={row.category}
							className={`border-b border-primary-200 ${
								row.category === "Body" ? "bg-primary-50/30" : ""
							}`}
						>
							<td className="px-4 py-2 font-medium">{row.category}</td>
							<td className="px-4 py-2">{row.result}</td>
							<td className="px-4 py-2">{row.roll}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
