import type { StatResult } from "../lib/dice";

interface StatTableProps {
	stats: StatResult[];
}

export function StatTable({ stats }: StatTableProps): React.JSX.Element {
	return (
		<table className="border-collapse w-fit mr-4">
			<thead>
				<tr className="bg-primary-600 text-white">
					<th className="px-3 py-2 text-left" scope="col">
						Stat
					</th>
					<th className="px-3 py-2 text-left" scope="col">
						Total
					</th>
				</tr>
			</thead>
			<tbody>
				{stats.map((s) => (
					<tr key={s.name} className="border-b border-primary-200">
						<td className="px-3 py-2 font-medium">{s.name}</td>
						<td className="px-3 py-2">
							{s.total} (base {s.baseValue}, +{s.coinBonus} coin, +{s.bodyBonus} body)
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
