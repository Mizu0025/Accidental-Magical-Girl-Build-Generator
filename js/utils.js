import { data } from './data.js';

export function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}

export function getResult(category, roll) {
    if (category === 'age') {
        // Age Formula: 6 + roll. 1-10 as is, 11-20 subtract 10.
        let ageVal = roll;
        if (roll > 10) ageVal -= 10;
        return {
            result: `${6 + ageVal} years old`,
            stats: "",
            details: "Immortal, no longer ages."
        };
    }

    if (category === 'perk') {
        return null;
    }

    const table = data[category];
    if (!table) return null;

    // Check if table is range-based or direct map
    const item = table.find(entry => {
        if (entry.range) {
            return roll >= entry.range[0] && roll <= entry.range[1];
        }
        return entry.roll === roll;
    });

    if (!item) return { result: "Unknown", stats: "", details: "" };

    let result = item.type || item.name;
    let stats = item.bonus || "";
    let details = item.description || item.examples || item.notes || "";

    return { result, stats, details };
}

export function getPerkResult(roll, tableType) {
    const table = data.perks[tableType];
    const item = table.find(entry => entry.roll === roll);
    return item ? { result: item.name, stats: item.bonus, details: item.description || "" } : { result: "Unknown", stats: "", details: "" };
}

export function pRange(str) {
    if (typeof str === 'number') return [str, str];
    if (!str) return [0, 0];
    if (str.includes('-')) {
        const [min, max] = str.split('-').map(Number);
        return [min, max];
    }
    return [Number(str), Number(str)];
}

export function checkOverlap(roll, rangeStr, tolerance) {
    const [min, max] = pRange(rangeStr);
    // Range Check: [min, max] vs [roll-tol, roll+tol]
    const rMin = roll - tolerance;
    const rMax = roll + tolerance;
    return Math.max(min, rMin) <= Math.min(max, rMax);
}
