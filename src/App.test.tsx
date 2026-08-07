import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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

// ── Tests ────────────────────────────────────────────────────────────

describe("App", () => {
	it('shows a "Generate" button initially', () => {
		// Arrange
		render(<App />);

		// Act + Assert
		expect(screen.getByRole("button", { name: /generate/i })).toBeVisible();
	});

	it("changes button text to Reroll after first press", async () => {
		// Arrange
		render(<App />);
		const user = userEvent.setup();

		// Act
		await user.click(screen.getByRole("button", { name: /generate/i }));

		// Assert
		expect(screen.getByRole("button", { name: /reroll/i })).toBeVisible();
	});

	it("generates 11 d20 rolls and displays them in a table", async () => {
		// Arrange
		render(<App />);
		const user = userEvent.setup();

		// Act
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByRole("table");
		const rows = table.querySelectorAll("tr");
		const categoryNames = Array.from(rows).map((row) =>
			row.cells[0]?.textContent?.trim().toLowerCase(),
		);
		const rolls = extractRolls(table);

		// Assert
		for (const cat of CATEGORIES) {
			expect(categoryNames).toContain(cat);
		}
		expect(rolls.length).toBe(11);
		assertValidD20(rolls);
	});

	it("maps each single-die category to exactly one roll", async () => {
		// Arrange
		render(<App />);
		const user = userEvent.setup();

		// Act
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByRole("table");
		const rows = Array.from(table.querySelectorAll("tr"));

		// Assert
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
		// Arrange
		render(<App />);
		const user = userEvent.setup();

		// Act
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

		// Assert
		expect(perksRows.length).toBeGreaterThan(0);
		expect(perksTokens.length).toBe(5);
		assertValidD20(perksTokens.map(Number));
	});

	it("generates a new set of rolls on reroll", async () => {
		// Arrange
		render(<App />);
		const user = userEvent.setup();

		// Act – first roll
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const firstRolls = extractRolls(screen.getByRole("table"));

		// Act – reroll
		await user.click(screen.getByRole("button", { name: /reroll/i }));
		const secondRolls = extractRolls(screen.getByRole("table"));

		// Assert
		expect(secondRolls.length).toBe(11);
		const same =
			firstRolls.length === secondRolls.length &&
			firstRolls.every((v, i) => v === secondRolls[i]);
		expect(same).toBe(false);
	});

	it("renders 3 table columns (Category, Result, Roll) with build info", async () => {
		// Arrange
		render(<App />);
		const user = userEvent.setup();

		// Act
		await user.click(screen.getByRole("button", { name: /generate/i }));
		const table = screen.getByRole("table");
		const headerRow = table.querySelector("thead tr");
		const bodyRows = table.querySelectorAll("tbody tr");

		// Assert – header row has 3 columns
		expect(headerRow).toBeTruthy();
		if (!headerRow) return;
		const headerCells = headerRow.querySelectorAll("th");
		expect(headerCells.length).toBe(3);
		expect(headerCells[0].textContent?.trim().toLowerCase()).toBe("category");
		expect(headerCells[1].textContent?.trim().toLowerCase()).toBe("result");
		expect(headerCells[2].textContent?.trim().toLowerCase()).toMatch(/^roll/);

		// Assert – each data row has 3 cells with build generation info
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
});
