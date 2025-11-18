import type { BuildState } from '../utils/buildState';
import type { Origin, Stats } from '../data/gameData';
import {
    initialStats,
    bodyMap,
    specializationMap,
    weaponMap,
    outfitMap,
    powerMap,
    perkData,
} from '../data/gameData';
import { getRangeKey, applyStatMod } from './mechanics';

export function calculateFinalStats(build: BuildState, origin: Origin | null): Stats {
    let stats = { ...initialStats };

    // Apply body stats
    if (build.rolls.body > 0) {
        const bodyKey = getRangeKey(build.rolls.body, Object.keys(bodyMap));
        if (bodyKey) {
            const body = bodyMap[bodyKey];
            const chosenOption = build.choices.bodyOption ?? 0;
            if (body.options[chosenOption]) {
                stats = applyStatMod(stats, body.options[chosenOption]);
            }
        }
    }

    // Apply specialization stats
    if (build.rolls.specialization > 0) {
        const spec = specializationMap[build.rolls.specialization];
        if (spec) {
            spec.mods.forEach((mod, index) => {
                if (mod.stat === 'Choice' && build.choices.specializationMods?.[index]) {
                    stats = applyStatMod(stats, mod, build.choices.specializationMods[index]);
                } else if (mod.stat !== 'Choice') {
                    stats = applyStatMod(stats, mod);
                }
            });
        }
    }

    // Apply weapon stats
    if (build.rolls.weapon > 0) {
        const weaponKey = getRangeKey(build.rolls.weapon, Object.keys(weaponMap));
        if (weaponKey) {
            const weapon = weaponMap[weaponKey];
            weapon.mods.forEach((mod) => {
                stats = applyStatMod(stats, mod);
            });
        }
    }

    // Apply outfit stats
    if (build.rolls.outfit > 0) {
        const outfitKey = getRangeKey(build.rolls.outfit, Object.keys(outfitMap));
        if (outfitKey) {
            const outfit = outfitMap[outfitKey];
            outfit.mods.forEach((mod) => {
                stats = applyStatMod(stats, mod);
            });
        }
    }

    // Apply power stats
    if (build.rolls.power > 0) {
        const powerKey = getRangeKey(build.rolls.power, Object.keys(powerMap));
        if (powerKey) {
            const power = powerMap[powerKey];

            // Handle Twinned Soul penalty
            if (power.penalty) {
                Object.keys(stats).forEach((key) => {
                    stats[key as keyof Stats] += power.penalty!;
                });
            }

            // Handle Killing Blow choice
            if (power.isChoice && power.choice && build.choices.powerChoice !== undefined) {
                const chosenMod = power.choice[build.choices.powerChoice];
                if (chosenMod) {
                    stats = applyStatMod(stats, chosenMod);
                }
            }
        }
    }

    // Apply perk stats
    build.rolls.perks.forEach((roll, index) => {
        if (roll > 0) {
            const category = build.choices.perkCategories[index];
            const perk = perkData[category][roll as keyof typeof perkData.T1];
            if (perk && 'statMod' in perk && perk.statMod) {
                stats = applyStatMod(stats, perk.statMod);
            }
        }
    });

    // Apply Weapon origin bonus (+1 to weapon stat)
    if (origin?.name === 'Weapon' && build.rolls.weapon > 0) {
        // This would need additional logic to determine which weapon stat to boost
        // For now, we'll skip this as it requires user choice
    }

    return stats;
}

export function getBodyType(roll: number): string {
    const key = getRangeKey(roll, Object.keys(bodyMap));
    return key ? bodyMap[key].type : 'Unknown';
}

export function getSpecializationName(roll: number): string {
    return specializationMap[roll]?.name || 'Unknown';
}

export function getWeaponName(roll: number): string {
    const key = getRangeKey(roll, Object.keys(weaponMap));
    return key ? weaponMap[key].name : 'Unknown';
}

export function getOutfitName(roll: number): string {
    const key = getRangeKey(roll, Object.keys(outfitMap));
    return key ? outfitMap[key].name : 'Unknown';
}

export function getPowerName(roll: number): string {
    const key = getRangeKey(roll, Object.keys(powerMap));
    return key ? powerMap[key].name : 'Unknown';
}

export function getPerkName(roll: number, category: 'T1' | 'T2'): string {
    const perk = perkData[category][roll as keyof typeof perkData.T1];
    return perk?.name || 'Unknown';
}
