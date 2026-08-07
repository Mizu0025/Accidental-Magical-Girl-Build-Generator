import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const CATEGORIES = [
	"age",
	"body",
	"specialisation",
	"weapon",
	"outfit",
	"power",
	"perks",
] as const;

const SINGLE_DIE_CATEGORIES = [
	"age",
	"body",
	"specialisation",
	"weapon",
	"outfit",
	"power",
] as const;

// ── Helpers ──────────────────────────────────────────────────────────

/** Extract all numeric roll tokens from a table's value cells. */
function extractRolls(table: HTMLElement): number[] {
	const rolls: number[] = [];
	for (const row of table.querySelectorAll("tr")) {
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
	user: ReturnType<typeof userEvent.setup>,
): Promise<{ category: string; result: string; roll: number }[]> {
	await user.click(screen.getByRole("button", { name: /generate/i }));
	const table = screen.getByRole("table");
	const rows = Array.from(table.querySelectorAll("tbody tr"));
	return rows.map((row) => ({
		category: row.cells[0]?.textContent?.trim().toLowerCase() ?? "",
		result: row.cells[1]?.textContent?.trim() ?? "",
		roll: Number(row.cells[2]?.textContent?.trim()),
	}));
}

// ── Tests ────────────────────────────────────────────────────────────

describe("App", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('shows a "Generate" button initially', () => {
		render(<App />);
		expect(screen.getByRole("button", { name: /generate/i })).toBeVisible();
	});

	it("changes button text to Reroll after first press", async () => {
		render(<App />);
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		expect(screen.getByRole("button", { name: /reroll/i })).toBeVisible();
	});

	it("generates 11 d20 rolls and displays them in a table", async () => {
		render(<App />);
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByRole("table");
		const rows = table.querySelectorAll("tr");
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
		render(<App />);
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByRole("table");
		const rows = Array.from(table.querySelectorAll("tr"));

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
		render(<App />);
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByRole("table");
		const rows = Array.from(table.querySelectorAll("tr"));

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
		render(<App />);
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const firstRolls = extractRolls(screen.getByRole("table"));

		await user.click(screen.getByRole("button", { name: /reroll/i }));
		const secondRolls = extractRolls(screen.getByRole("table"));

		expect(secondRolls.length).toBe(11);
		const same =
			firstRolls.length === secondRolls.length &&
			firstRolls.every((v, i) => v === secondRolls[i]);
		expect(same).toBe(false);
	});

	it("renders 3 table columns (Category, Result, Roll) with build info", async () => {
		render(<App />);
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByRole("table");
		const headerRow = table.querySelector("thead tr");
		const bodyRows = table.querySelectorAll("tbody tr");

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
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const ageRow = data.find((r) => r.category === "age");
				expect(ageRow).toBeTruthy();
				expect(ageRow?.result).toContain(String(6 + roll));
			}
		});

		it("subtracts 10 for rolls 11-20 before adding 6", async () => {
			for (const roll of [11, 15, 20]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const ageRow = data.find((r) => r.category === "age");
				expect(ageRow).toBeTruthy();
				expect(ageRow?.result).toContain(String(6 + (roll - 10)));
			}
		});
	});

	describe("BODY rules (Roll 2)", () => {
		it("maps rolls 1-6 to Underdeveloped", async () => {
			for (const roll of [1, 3, 6]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const bodyRow = data.find((r) => r.category === "body");
				expect(bodyRow).toBeTruthy();
				expect(bodyRow?.result.toLowerCase()).toContain("underdeveloped");
			}
		});

		it("maps rolls 7-14 to Average", async () => {
			for (const roll of [7, 10, 14]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const bodyRow = data.find((r) => r.category === "body");
				expect(bodyRow).toBeTruthy();
				expect(bodyRow?.result.toLowerCase()).toContain("average");
			}
		});

		it("maps rolls 15-20 to Overdeveloped", async () => {
			for (const roll of [15, 18, 20]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const bodyRow = data.find((r) => r.category === "body");
				expect(bodyRow).toBeTruthy();
				expect(bodyRow?.result.toLowerCase()).toContain("overdeveloped");
			}
		});
	});

	describe("SPECIALIZATION rules (Roll 3)", () => {
		const specMap: Record<number, string> = {
			1: "fire",
			2: "ice",
			3: "air",
			4: "spirit",
			5: "reinforcement",
			6: "psychic",
			7: "time",
			8: "lightning",
			9: "sound",
			10: "darkness",
			11: "illusion",
			12: "light",
			13: "wood",
			14: "empathic",
			15: "water",
			16: "gravity",
			17: "stone",
			18: "beast",
			19: "metal",
			20: "oddball",
		};

		it("maps each roll 1-20 to its unique specialization", async () => {
			for (const [roll, expected] of Object.entries(specMap)) {
				mockDice(Number(roll));
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
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const weaponRow = data.find((r) => r.category === "weapon");
				expect(weaponRow).toBeTruthy();
				expect(weaponRow?.result.toLowerCase()).toContain("melee");
			}
		});

		it("maps rolls 6-10 to Ranged", async () => {
			for (const roll of [6, 8, 10]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const weaponRow = data.find((r) => r.category === "weapon");
				expect(weaponRow).toBeTruthy();
				expect(weaponRow?.result.toLowerCase()).toContain("ranged");
			}
		});

		it("maps rolls 11-15 to Mystic", async () => {
			for (const roll of [11, 13, 15]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const weaponRow = data.find((r) => r.category === "weapon");
				expect(weaponRow).toBeTruthy();
				expect(weaponRow?.result.toLowerCase()).toContain("mystic");
			}
		});

		it("maps rolls 16-20 to Fist", async () => {
			for (const roll of [16, 18, 20]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const weaponRow = data.find((r) => r.category === "weapon");
				expect(weaponRow).toBeTruthy();
				expect(weaponRow?.result.toLowerCase()).toContain("fist");
			}
		});
	});

	describe("OUTFIT rules (Roll 5)", () => {
		it("maps rolls 1-5 to Skimpy", async () => {
			for (const roll of [1, 3, 5]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const outfitRow = data.find((r) => r.category === "outfit");
				expect(outfitRow).toBeTruthy();
				expect(outfitRow?.result.toLowerCase()).toContain("skimpy");
			}
		});

		it("maps rolls 6-10 to Flowing", async () => {
			for (const roll of [6, 8, 10]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const outfitRow = data.find((r) => r.category === "outfit");
				expect(outfitRow).toBeTruthy();
				expect(outfitRow?.result.toLowerCase()).toContain("flowing");
			}
		});

		it("maps rolls 11-15 to Elaborate", async () => {
			for (const roll of [11, 13, 15]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const outfitRow = data.find((r) => r.category === "outfit");
				expect(outfitRow).toBeTruthy();
				expect(outfitRow?.result.toLowerCase()).toContain("elaborate");
			}
		});

		it("maps rolls 16-20 to Uniform", async () => {
			for (const roll of [16, 18, 20]) {
				mockDice(roll);
				render(<App />);

				const user = userEvent.setup();
				const data = await generateAndGetData(user);
				const outfitRow = data.find((r) => r.category === "outfit");
				expect(outfitRow).toBeTruthy();
				expect(outfitRow?.result.toLowerCase()).toContain("uniform");
			}
		});
	});

	describe("POWER rules (Roll 6)", () => {
		const powerMap: Record<string, number[]> = {
			"killing blow": [1, 2],
			hammerspace: [3, 4],
			"twinned soul": [5, 6],
			"focused assault": [7, 8],
			barrage: [9, 10],
			"power of friendship": [11, 12],
			duplication: [13, 14],
			"third eye": [15, 16],
			regeneration: [17, 18],
			tentacles: [19, 20],
		};

		it("maps each roll pair to its power", async () => {
			for (const [power, rolls] of Object.entries(powerMap)) {
				for (const roll of rolls) {
					mockDice(roll);
					render(<App />);

					const user = userEvent.setup();
					const data = await generateAndGetData(user);
					const powerRow = data.find((r) => r.category === "power");
					expect(powerRow).toBeTruthy();
					expect(powerRow?.result.toLowerCase()).toContain(power.toLowerCase());
				}
			}
		});
	});

	describe("PERKS rules (Rolls 7-11)", () => {
		const combatPerks: Record<number, string> = {
			1: "dual weapon",
			2: "martial training",
			3: "enhanced weapon",
			4: "mystic artifact",
			5: "gifted",
			6: "flexibility",
			7: "enhanced transformation",
			8: "disguise artifact",
			9: "blood magic",
			10: "hammerspace handbag",
			11: "enhanced sustenance",
			12: "enhanced outfit",
			13: "healing artifact",
			14: "ally",
			15: "monstrous metamorphosis",
			16: "sorcery",
			17: "wings",
			18: "purification artifact",
			19: "awareness",
			20: "power artifact",
		};

		const supportPerks: Record<number, string> = {
			1: "interdimensional tourist",
			2: "closure",
			3: "fated",
			4: "training",
			5: "interdimensional home",
			6: "incognito",
			7: "environmental sealing",
			8: "get out of jail",
			9: "big damn hero",
			10: "absolute direction",
			11: "big backpack",
			12: "natural aging",
			13: "masculinity",
			14: "overcity shift",
			15: "money",
			16: "familiar",
			17: "soul jar",
			18: "eternal style",
			19: "a way out",
			20: "fake parents",
		};

		it("rolls 7-8 map to Combat table perks", async () => {
			for (const [roll, expected] of Object.entries(combatPerks)) {
				const diceValues = [1, 1, 1, 1, 1, 1, Number(roll)];
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
			for (const [roll, expected] of Object.entries(supportPerks)) {
				const diceValues = [1, 1, 1, 1, 1, 1, 1, 1, Number(roll)];
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
	});
});
