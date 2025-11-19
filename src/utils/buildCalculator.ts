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
    const bodyRoll = build.choices.freePickBody ?? build.rolls.body;
    if (bodyRoll > 0) {
        const bodyKey = getRangeKey(bodyRoll, Object.keys(bodyMap));
        if (bodyKey) {
            const body = bodyMap[bodyKey];
            const chosenOption = build.choices.bodyOption ?? 0;
            if (body.options[chosenOption]) {
                stats = applyStatMod(stats, body.options[chosenOption]);
            }
        }
    }

    // Apply specialization stats
    const specRoll = build.choices.freePickSpecialization ?? build.rolls.specialization;
    if (specRoll > 0) {
        const spec = specializationMap[specRoll];
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
    const weaponRoll = build.choices.freePickWeapon ?? build.rolls.weapon;
    if (weaponRoll > 0) {
        const weaponKey = getRangeKey(weaponRoll, Object.keys(weaponMap));
        if (weaponKey) {
            const weapon = weaponMap[weaponKey];
            weapon.mods.forEach((mod) => {
                stats = applyStatMod(stats, mod);
            });
        }
    }

    // Apply outfit stats
    const outfitRoll = build.choices.freePickOutfit ?? build.rolls.outfit;
    if (outfitRoll > 0) {
        const outfitKey = getRangeKey(outfitRoll, Object.keys(outfitMap));
        if (outfitKey) {
            const outfit = outfitMap[outfitKey];
            outfit.mods.forEach((mod) => {
                stats = applyStatMod(stats, mod);
            });
        }
    }

    // Apply power stats
    const powerRoll = build.choices.freePickPower ?? build.rolls.power;
    if (powerRoll > 0) {
        const powerKey = getRangeKey(powerRoll, Object.keys(powerMap));
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
        const perkRoll = build.choices.freePickPerks?.[index] ?? roll;
        if (perkRoll > 0) {
            const category = build.choices.perkCategories[index];
            const perk = perkData[category][perkRoll as keyof typeof perkData.T1];
            if (perk && 'statMod' in perk && perk.statMod) {
                stats = applyStatMod(stats, perk.statMod);
            }
        }
    });

    // Apply second weapon stats (Gold coin)
    if (build.choices.secondWeapon) {
        const weaponKey = getRangeKey(build.choices.secondWeapon, Object.keys(weaponMap));
        if (weaponKey) {
            const weapon = weaponMap[weaponKey];
            weapon.mods.forEach((mod) => {
                stats = applyStatMod(stats, mod);
            });
        }
    }

    // Apply second power stats (Gold coin)
    if (build.choices.secondPower) {
        const powerKey = getRangeKey(build.choices.secondPower, Object.keys(powerMap));
        if (powerKey) {
            const power = powerMap[powerKey];

            // Handle Twinned Soul penalty
            if (power.penalty) {
                Object.keys(stats).forEach((key) => {
                    stats[key as keyof Stats] += power.penalty!;
                });
            }

            // Handle Killing Blow choice
            if (power.isChoice && power.choice && build.choices.secondPowerChoice !== undefined) {
                const chosenMod = power.choice[build.choices.secondPowerChoice];
                if (chosenMod) {
                    stats = applyStatMod(stats, chosenMod);
                }
            }
        }
    }

    // Apply bonus perk stats (Gold coin)
    if (build.choices.bonusPerks) {
        build.choices.bonusPerks.forEach((bonusPerk) => {
            const perk = perkData[bonusPerk.category][bonusPerk.roll as keyof typeof perkData.T1];
            if (perk && 'statMod' in perk && perk.statMod) {
                stats = applyStatMod(stats, perk.statMod);
            }
        });
    }

    // Apply Weapon origin bonus (+1 to weapon stat)
    if (origin?.name === 'Weapon' && build.rolls.weapon > 0) {
        // This would need additional logic to determine which weapon stat to boost
        // For now, we'll skip this as it requires user choice
    }

    // Apply stat spends
    if (build.choices.statSpends) {
        Object.entries(build.choices.statSpends).forEach(([stat, spends]) => {
            const bonus = spends.bronze * 1 + spends.silver * 2 + spends.gold * 4;
            if (stat in stats) {
                stats[stat as keyof Stats] += bonus;
            }
        });
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
