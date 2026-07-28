import type { PerkElement } from "../types/chargen";
import { assertFound, findPerks } from "../utils/chargen";

export const calculatePerks: (dice: number[]) => PerkElement[] = (
	dice: number[],
) => {
	const seenRolls = new Set<number>();
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
	].map((p, i) => {
		const rollKey = i >= 4 ? dice[10] : dice[i + 6];
		const isDuplicate = seenRolls.has(rollKey);
		seenRolls.add(rollKey);
		return {
			...p,
			id: `${p.name}-${i}`,
			isDuplicate,
		};
	});
};
