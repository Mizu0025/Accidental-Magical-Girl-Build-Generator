import { cleanup, render, screen } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

import { BODY_TYPES } from "./constants/body";
import { CATEGORIES, SINGLE_DIE_CATEGORIES } from "./constants/categories";
import { COMBAT_PERKS } from "./constants/combatPerks";
import { OUTFIT_TYPES } from "./constants/outfit";
import { POWERS } from "./constants/power";
import { SPECIALISATIONS } from "./constants/specialisation";
import { SUPPORT_PERKS } from "./constants/supportPerks";
import { WEAPON_TYPES } from "./constants/weapon";

// ── Helpers ──────────────────────────────────────────────────────────

/** Extract all numeric roll tokens from a table's value cells. */
function extractRolls(table: HTMLElement): number[] {
	const rolls: number[] = [];
	for (const row of table.querySelectorAll<HTMLTableRowElement>("tr")) {
		const valueCell = row.cells[2]?.textContent?.trim();
		if (!valueCell) continue;
		for (const token of valueCell.split(/[\s,]+/)) {
			const n = Number(token);
			if (!Number.isNaN(n)) rolls.push(n);
		}
	}
	return rolls;
}

/** Assert every value in `rolls` is a valid d20 result (1–20). */
function assertValidD20(rolls: number[]) {
	for (const val of rolls) {
		expect(val).toBeGreaterThanOrEqual(1);
		expect(val).toBeLessThanOrEqual(20);
	}
}

/**
 * Spy on Math.random so `Math.floor(Math.random() * 20) + 1`
 * yields exactly the sequence `values`.
 */
function mockDice(...values: number[]) {
	const spy = vi.spyOn(Math, "random");
	let idx = 0;
	spy.mockImplementation(() => {
		const v = values[idx % values.length];
		idx++;
		return (v - 1) / 20;
	});
	return spy;
}

/**
 * Click the generate button and return the rendered table body rows
 * as an array of { category, result, roll } parsed from cells.
 */
async function generateAndGetData(
	user: UserEvent,
): Promise<{ category: string; result: string; roll: number }[]> {
	await user.click(screen.getByRole("button", { name: /generate/i }));
	const table = screen.getByTestId("character-sheet");
	const rows = Array.from(
		table.querySelectorAll<HTMLTableRowElement>("tbody tr"),
	);
	return rows.map((row) => ({
		category: row.cells[0]?.textContent?.trim().toLowerCase() ?? "",
		result: row.cells[1]?.textContent?.trim() ?? "",
		roll: Number(row.cells[2]?.textContent?.trim()),
	}));
}

/** Compute the expected age number from a d20 roll. */
function expectedAge(roll: number): number {
	const effective = roll > 10 ? roll - 10 : roll;
	return 6 + effective;
}

/** Find the name a given d20 roll maps to for a range-based category. */
function rangeEntryName<
	T extends { rollMin: number; rollMax: number; name: string },
>(entries: readonly T[], roll: number): string {
	return (
		entries.find((e) => roll >= e.rollMin && roll <= e.rollMax)?.name ?? ""
	);
}

// ── Tests ────────────────────────────────────────────────────────────

describe("App", () => {
	beforeEach(() => {
		render(<App />);
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it('shows a "Generate" button initially', () => {
		expect(screen.getByRole("button", { name: /generate/i })).toBeVisible();
	});

	it("changes button text to Reroll after first press", async () => {
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		expect(screen.getByRole("button", { name: /reroll/i })).toBeVisible();
	});

	it("generates 11 d20 rolls and displays them in a table", async () => {
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByTestId("character-sheet");
		const rows = table.querySelectorAll<HTMLTableRowElement>("tr");
		const categoryNames = Array.from(rows).map((row) =>
			row.cells[0]?.textContent?.trim().toLowerCase(),
		);
		const rolls = extractRolls(table);

		for (const cat of CATEGORIES) {
			expect(categoryNames).toContain(cat);
		}
		expect(rolls.length).toBe(11);
		assertValidD20(rolls);
	});

	it("maps each single-die category to exactly one roll", async () => {
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByTestId("character-sheet");
		const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>("tr"));

		for (const cat of SINGLE_DIE_CATEGORIES) {
			const matchingRows = rows.filter((row) =>
				row.cells[0]?.textContent?.trim().toLowerCase().includes(cat),
			);
			expect(matchingRows.length).toBe(1);

			const valueCell = matchingRows[0].cells[2]?.textContent?.trim();
			expect(valueCell).toBeTruthy();
			if (!valueCell) continue;
			const tokens = valueCell.split(/[\s,]+/);
			expect(tokens.length).toBe(1);
			assertValidD20([Number(tokens[0])]);
		}
	});

	it("displays multiple dice in the perks category roll column", async () => {
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByTestId("character-sheet");
		const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>("tr"));

		const perksRows = rows.filter((row) =>
			row.cells[0]?.textContent?.trim().toLowerCase().includes("perks"),
		);

		const perksTokens: string[] = [];
		for (const row of perksRows) {
			const valueCell = row.cells[2]?.textContent?.trim();
			if (valueCell) perksTokens.push(...valueCell.split(/[\s,]+/));
		}

		expect(perksRows.length).toBeGreaterThan(0);
		expect(perksTokens.length).toBe(5);
		assertValidD20(perksTokens.map(Number));
	});

	it("generates a new set of rolls on reroll", async () => {
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const firstRolls = extractRolls(screen.getByTestId("character-sheet"));

		await user.click(screen.getByRole("button", { name: /reroll/i }));
		const secondRolls = extractRolls(screen.getByTestId("character-sheet"));

		expect(secondRolls.length).toBe(11);
		const same =
			firstRolls.length === secondRolls.length &&
			firstRolls.every((v, i) => v === secondRolls[i]);
		expect(same).toBe(false);
	});

	it("renders 3 table columns (Category, Result, Roll) with build info", async () => {
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByTestId("character-sheet");
		const bodyRows = table.querySelectorAll<HTMLTableRowElement>("tbody tr");
		const headerRow = table.querySelector("thead tr");
		expect(headerRow).toBeTruthy();
		if (!headerRow) return;
		const headerCells = headerRow.querySelectorAll("th");
		expect(headerCells.length).toBe(3);
		expect(headerCells[0].textContent?.trim().toLowerCase()).toBe("category");
		expect(headerCells[1].textContent?.trim().toLowerCase()).toBe("result");
		expect(headerCells[2].textContent?.trim().toLowerCase()).toMatch(/^roll/);

		expect(bodyRows.length).toBeGreaterThan(0);
		for (const row of bodyRows) {
			const cells = row.querySelectorAll("td");
			expect(cells.length).toBe(3);

			const category = cells[0].textContent?.trim();
			const result = cells[1].textContent?.trim();
			const roll = cells[2].textContent?.trim();

			expect(category).toBeTruthy();
			expect(result).toBeTruthy();
			expect(roll).toBeTruthy();
		}
	});

	// ── Category Rule Tests ────────────────────────────────────────

	describe("AGE rules (Roll 1)", () => {
		it("computes age as 6 + roll for rolls 1-10", async () => {
			for (const roll of [1, 5, 10]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const ageRow = data.find((r) => r.category === "age");
				expect(ageRow).toBeTruthy();
				expect(ageRow?.result).toContain(String(expectedAge(roll)));
			}
		});
		it("subtracts 10 for rolls 11-20 before adding 6", async () => {
			for (const roll of [11, 15, 20]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const ageRow = data.find((r) => r.category === "age");
				expect(ageRow).toBeTruthy();
				expect(ageRow?.result).toContain(String(expectedAge(roll)));
			}
		});
	});

	describe("BODY rules (Roll 2)", () => {
		it("maps rolls 1-6 to Underdeveloped", async () => {
			for (const roll of [1, 3, 6]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const bodyRow = data.find((r) => r.category === "body");
				expect(bodyRow).toBeTruthy();
				expect(bodyRow?.result.toLowerCase()).toContain(
					rangeEntryName(BODY_TYPES, roll).toLowerCase(),
				);
			}
		});

		it("maps rolls 7-14 to Average", async () => {
			for (const roll of [7, 10, 14]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const bodyRow = data.find((r) => r.category === "body");
				expect(bodyRow).toBeTruthy();
				expect(bodyRow?.result.toLowerCase()).toContain(
					rangeEntryName(BODY_TYPES, roll).toLowerCase(),
				);
			}
		});

		it("maps rolls 15-20 to Overdeveloped", async () => {
			for (const roll of [15, 18, 20]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const bodyRow = data.find((r) => r.category === "body");
				expect(bodyRow).toBeTruthy();
				expect(bodyRow?.result.toLowerCase()).toContain(
					rangeEntryName(BODY_TYPES, roll).toLowerCase(),
				);
			}
		});
	});

	describe("SPECIALIZATION rules (Roll 3)", () => {
		it("maps each roll 1-20 to its unique specialization", async () => {
			for (let roll = 1; roll <= 20; roll++) {
				const expected = SPECIALISATIONS[roll - 1].name;
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const specRow = data.find((r) => r.category === "specialisation");
				expect(specRow).toBeTruthy();
				expect(specRow?.result.toLowerCase()).toContain(expected.toLowerCase());
			}
		});
	});

	describe("WEAPON rules (Roll 4)", () => {
		it("maps rolls 1-5 to Melee", async () => {
			for (const roll of [1, 3, 5]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const weaponRow = data.find((r) => r.category === "weapon");
				expect(weaponRow).toBeTruthy();
				expect(weaponRow?.result.toLowerCase()).toContain(
					rangeEntryName(WEAPON_TYPES, roll).toLowerCase(),
				);
			}
		});

		it("maps rolls 6-10 to Ranged", async () => {
			for (const roll of [6, 8, 10]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const weaponRow = data.find((r) => r.category === "weapon");
				expect(weaponRow).toBeTruthy();
				expect(weaponRow?.result.toLowerCase()).toContain(
					rangeEntryName(WEAPON_TYPES, roll).toLowerCase(),
				);
			}
		});

		it("maps rolls 11-15 to Mystic", async () => {
			for (const roll of [11, 13, 15]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const weaponRow = data.find((r) => r.category === "weapon");
				expect(weaponRow).toBeTruthy();
				expect(weaponRow?.result.toLowerCase()).toContain(
					rangeEntryName(WEAPON_TYPES, roll).toLowerCase(),
				);
			}
		});

		it("maps rolls 16-20 to Fist", async () => {
			for (const roll of [16, 18, 20]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const weaponRow = data.find((r) => r.category === "weapon");
				expect(weaponRow).toBeTruthy();
				expect(weaponRow?.result.toLowerCase()).toContain(
					rangeEntryName(WEAPON_TYPES, roll).toLowerCase(),
				);
			}
		});
	});

	describe("OUTFIT rules (Roll 5)", () => {
		it("maps rolls 1-5 to Skimpy", async () => {
			for (const roll of [1, 3, 5]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const outfitRow = data.find((r) => r.category === "outfit");
				expect(outfitRow).toBeTruthy();
				expect(outfitRow?.result.toLowerCase()).toContain(
					rangeEntryName(OUTFIT_TYPES, roll).toLowerCase(),
				);
			}
		});

		it("maps rolls 6-10 to Flowing", async () => {
			for (const roll of [6, 8, 10]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const outfitRow = data.find((r) => r.category === "outfit");
				expect(outfitRow).toBeTruthy();
				expect(outfitRow?.result.toLowerCase()).toContain(
					rangeEntryName(OUTFIT_TYPES, roll).toLowerCase(),
				);
			}
		});

		it("maps rolls 11-15 to Elaborate", async () => {
			for (const roll of [11, 13, 15]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const outfitRow = data.find((r) => r.category === "outfit");
				expect(outfitRow).toBeTruthy();
				expect(outfitRow?.result.toLowerCase()).toContain(
					rangeEntryName(OUTFIT_TYPES, roll).toLowerCase(),
				);
			}
		});

		it("maps rolls 16-20 to Uniform", async () => {
			for (const roll of [16, 18, 20]) {
				cleanup();
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const outfitRow = data.find((r) => r.category === "outfit");
				expect(outfitRow).toBeTruthy();
				expect(outfitRow?.result.toLowerCase()).toContain(
					rangeEntryName(OUTFIT_TYPES, roll).toLowerCase(),
				);
			}
		});
	});

	describe("POWER rules (Roll 6)", () => {
		it("maps each roll pair to its power", async () => {
			for (const power of POWERS) {
				for (let roll = power.rollMin; roll <= power.rollMax; roll++) {
					cleanup();
					mockDice(roll);
					render(<App />);

					const user = userEvent.setup();
					const data = await generateAndGetData(user);
					const powerRow = data.find((r) => r.category === "power");
					expect(powerRow).toBeTruthy();
					expect(powerRow?.result.toLowerCase()).toContain(
						power.name.toLowerCase(),
					);
				}
			}
		});
	});

	describe("PERKS rules (Rolls 7-11)", () => {
		it("rolls 7-8 map to Combat table perks", async () => {
			for (let roll = 1; roll <= 20; roll++) {
				const expected = COMBAT_PERKS[roll - 1].name;
				// Use 99 for non-perk dice to avoid collisions with roll values 1-20
				const diceValues = [99, 99, 99, 99, 99, 99, roll];
				cleanup();
				mockDice(...diceValues);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const perksRows = data.filter((r) => r.category === "perks");
				expect(perksRows.length).toBeGreaterThan(0);
				expect(perksRows[0].result.toLowerCase()).toContain(
					expected.toLowerCase(),
				);
			}
		});

		it("rolls 9-10 map to Support table perks", async () => {
			for (let roll = 1; roll <= 20; roll++) {
				const expected = SUPPORT_PERKS[roll - 1].name;
				// Use 99 for non-tested perk dice to avoid collisions
				const diceValues = [
					99,
					99,
					99,
					99,
					99,
					99, // rolls 0-5 (non-perk)
					99,
					99,
					roll,
					99,
					99, // rolls 6-10 (perk: only slot 2 tested)
				];
				cleanup();
				mockDice(...diceValues);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const perksRows = data.filter((r) => r.category === "perks");
				expect(perksRows.length).toBeGreaterThan(2);
				expect(perksRows[2].result.toLowerCase()).toContain(
					expected.toLowerCase(),
				);
			}
		});

		it("does not show 'free pick' for only two duplicate dice", async () => {
			// Two duplicates — second should shift to opposite table, no free pick
			const perkIdx = 5;
			const diceValues = [1, 1, 1, 1, 1, 1, perkIdx, perkIdx, 1, 2, 3];
			cleanup();
			mockDice(...diceValues);
			render(<App />);

			const user = userEvent.setup();
			const data = await generateAndGetData(user);
			const perksRows = data.filter((r) => r.category === "perks");

			// First perk from combat table
			const expectedCombat =
				COMBAT_PERKS[perkIdx - 1].name.toLowerCase();
			expect(perksRows[0].result.toLowerCase()).toContain(expectedCombat);
			// Second duplicate shifts to support table
			const expectedSupport =
				SUPPORT_PERKS[perkIdx - 1].name.toLowerCase();
			expect(perksRows[1].result.toLowerCase()).toContain(expectedSupport);
			// No free pick
			const results = perksRows.map((r) => r.result.toLowerCase());
			const hasFreePick = results.some((r) => r.includes("free pick"));
			expect(hasFreePick).toBe(false);
		});

		it("shows 'free pick' only on third duplicate dice value", async () => {
			// Three same dice values — second shifts to opposite table, third is 'free pick'
			const perkIdx = 7;
			const diceValues = [1, 1, 1, 1, 1, 1, perkIdx, perkIdx, perkIdx, 2, 3];
			cleanup();
			mockDice(...diceValues);
			render(<App />);

			const user = userEvent.setup();
			const data = await generateAndGetData(user);
			const perksRows = data.filter((r) => r.category === "perks");

			expect(perksRows.length).toBe(5);
			// First from combat table
			const expectedCombat =
				COMBAT_PERKS[perkIdx - 1].name.toLowerCase();
			expect(perksRows[0].result.toLowerCase()).toContain(expectedCombat);
			// Second duplicate shifts to support table
			const expectedSupport =
				SUPPORT_PERKS[perkIdx - 1].name.toLowerCase();
			expect(perksRows[1].result.toLowerCase()).toContain(expectedSupport);
			// Third becomes free pick
			expect(perksRows[2].result.toLowerCase()).toContain("free pick");
			// Remaining perks are unaffected
			expect(perksRows[3].result.toLowerCase()).not.toContain("free pick");
			expect(perksRows[4].result.toLowerCase()).not.toContain("free pick");
		});

		it("shows 'free pick' on third and fourth when four duplicates", async () => {
			const perkIdx = 3;
			const diceValues = [
				1,
				1,
				1,
				1,
				1,
				1,
				perkIdx,
				perkIdx,
				perkIdx,
				perkIdx,
				5,
			];
			cleanup();
			mockDice(...diceValues);
			render(<App />);

			const user = userEvent.setup();
			const data = await generateAndGetData(user);
			const perksRows = data.filter((r) => r.category === "perks");

			expect(perksRows.length).toBe(5);
			// First from combat table
			const expectedCombat =
				COMBAT_PERKS[perkIdx - 1].name.toLowerCase();
			expect(perksRows[0].result.toLowerCase()).toContain(expectedCombat);
			// Second duplicate shifts to support table
			const expectedSupport =
				SUPPORT_PERKS[perkIdx - 1].name.toLowerCase();
			expect(perksRows[1].result.toLowerCase()).toContain(expectedSupport);
			// Third and fourth become free pick
			expect(perksRows[2].result.toLowerCase()).toContain("free pick");
			expect(perksRows[3].result.toLowerCase()).toContain("free pick");
			// Fifth is unaffected
			expect(perksRows[4].result.toLowerCase()).not.toContain("free pick");
		});

		it("shows 'free pick' on 3rd-5th when all five perks roll same value", async () => {
			const perkIdx = 1;
			const diceValues = [
				1,
				1,
				1,
				1,
				1,
				1,
				perkIdx,
				perkIdx,
				perkIdx,
				perkIdx,
				perkIdx,
			];
			cleanup();
			mockDice(...diceValues);
			render(<App />);

			const user = userEvent.setup();
			const data = await generateAndGetData(user);
			const perksRows = data.filter((r) => r.category === "perks");

			expect(perksRows.length).toBe(5);
			// First from combat table
			const expectedCombat =
				COMBAT_PERKS[perkIdx - 1].name.toLowerCase();
			expect(perksRows[0].result.toLowerCase()).toContain(expectedCombat);
			// Second duplicate shifts to support table
			const expectedSupport =
				SUPPORT_PERKS[perkIdx - 1].name.toLowerCase();
			expect(perksRows[1].result.toLowerCase()).toContain(expectedSupport);
			// Third through fifth become free pick
			expect(perksRows[2].result.toLowerCase()).toContain("free pick");
			expect(perksRows[3].result.toLowerCase()).toContain("free pick");
			expect(perksRows[4].result.toLowerCase()).toContain("free pick");
		});

		it("handles two separate duplicate groups independently", async () => {
			// Rolls 7,8,9 = 2 (three duplicates → support shift at 8, free pick at 9)
			// Rolls 10,11 = 5 (two duplicates → combat shift at 11)
			const diceValues = [1, 1, 1, 1, 1, 1, 2, 2, 2, 5, 5];
			cleanup();
			mockDice(...diceValues);
			render(<App />);

			const user = userEvent.setup();
			const data = await generateAndGetData(user);
			const perksRows = data.filter((r) => r.category === "perks");

			expect(perksRows.length).toBe(5);
			// First 2 from combat table
			expect(perksRows[0].result.toLowerCase()).toContain(
				COMBAT_PERKS[1].name.toLowerCase(),
			);
			// Second 2 shifts to support table
			expect(perksRows[1].result.toLowerCase()).toContain(
				SUPPORT_PERKS[1].name.toLowerCase(),
			);
			// Third 2 becomes free pick
			expect(perksRows[2].result.toLowerCase()).toContain("free pick");
			// First 5 from support table
			expect(perksRows[3].result.toLowerCase()).toContain(
				SUPPORT_PERKS[4].name.toLowerCase(),
			);
			// Second 5 shifts to combat table
			expect(perksRows[4].result.toLowerCase()).toContain(
				COMBAT_PERKS[4].name.toLowerCase(),
			);
		});
	});
});
