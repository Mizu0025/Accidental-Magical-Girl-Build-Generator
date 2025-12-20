import { describe, it, expect } from 'vitest';
import { rollD20, getResult, pRange, checkOverlap } from '../js/utils.js';

describe('Utility Functions', () => {
    describe('rollD20', () => {
        it('should return a number between 1 and 20', () => {
            for (let i = 0; i < 100; i++) {
                const roll = rollD20();
                expect(roll).toBeGreaterThanOrEqual(1);
                expect(roll).toBeLessThanOrEqual(20);
                expect(Number.isInteger(roll)).toBe(true);
            }
        });
    });

    describe('getResult', () => {
        it('should calculate age correctly for roll <= 10', () => {
            const res = getResult('age', 5);
            expect(res.result).toBe('11 years old');
        });

        it('should calculate age correctly for roll > 10', () => {
            const res = getResult('age', 15);
            expect(res.result).toBe('11 years old'); // 15 - 10 = 5, 6 + 5 = 11
        });

        it('should return correct body type for roll in range', () => {
            const res = getResult('body', 3);
            expect(res.result).toBe('Underdeveloped');
        });

        it('should return Unknown for roll out of range', () => {
            const res = getResult('body', 25);
            expect(res.result).toBe('Unknown');
        });
    });

    describe('pRange', () => {
        it('should handle single numbers', () => {
            expect(pRange(5)).toEqual([5, 5]);
            expect(pRange("5")).toEqual([5, 5]);
        });

        it('should handle range strings', () => {
            expect(pRange("1-10")).toEqual([1, 10]);
        });

        it('should handle empty/missing input', () => {
            expect(pRange(null)).toEqual([0, 0]);
        });
    });

    describe('checkOverlap', () => {
        it('should return true for overlapping ranges', () => {
            // roll 5, tolerance 1 => [4, 6]. range "5-10" => [5, 10]. Overlap at [5, 6].
            expect(checkOverlap(5, "5-10", 1)).toBe(true);
        });

        it('should return false for non-overlapping ranges', () => {
            // roll 2, tolerance 1 => [1, 3]. range "5-10" => [5, 10]. No overlap.
            expect(checkOverlap(2, "5-10", 1)).toBe(false);
        });
    });
});
