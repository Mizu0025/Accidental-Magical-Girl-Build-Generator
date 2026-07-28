import React, { useMemo } from "react";
import type { RenderCellContentProps } from "../types/chargen";
import { generateCharacter } from "./generateCharacter";
import "./style.css";

const RenderCellContent = React.memo(({ result }: RenderCellContentProps) => {
	if (Array.isArray(result)) {
		return (
			<ul>
				{result.map(({ id, name }) => (
					<li key={id}>{name}</li>
				))}
			</ul>
		);
	}
	return <>{result}</>;
});

const CharacterResults = ({ diceRolls }: { diceRolls: number[] }) => {
	const tableRows = useMemo(() => generateCharacter(diceRolls), [diceRolls]);

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
								<RenderCellContent result={result} />
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
