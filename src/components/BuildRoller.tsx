import { RollSection } from './RollSection';
import type { BuildState } from '../utils/buildState';
import type { Origin } from '../data/gameData';
import type { CoinStash, CoinType } from '../utils/mechanics';
import { calculateAge, checkFreePick } from '../utils/mechanics';
import {
    getBodyType,
    getSpecializationName,
    getWeaponName,
    getOutfitName,
    getPowerName,
    getPerkName,
} from '../utils/buildCalculator';
import { bodyMap, specializationMap, powerMap } from '../data/gameData';
import { getRangeKey } from '../utils/mechanics';
import './BuildRoller.css';

interface BuildRollerProps {
    build: BuildState;
    origin: Origin | null;
    coins: CoinStash;
    onUpdateBuild: (build: BuildState) => void;
    onSpendCoin: (type: CoinType) => void;
}

export function BuildRoller({
    build,
    origin,
    coins,
    onUpdateBuild,
    onSpendCoin,
}: BuildRollerProps) {
    const age = calculateAge(build.rolls.age);

    // Body choices
    const bodyKey = getRangeKey(build.rolls.body, Object.keys(bodyMap));
    const bodyData = bodyKey ? bodyMap[bodyKey] : null;

    // Specialization choices
    const specData = specializationMap[build.rolls.specialization];
    const hasSpecChoices = specData?.mods.some((mod) => mod.stat === 'Choice');

    // Power choices
    const powerKey = getRangeKey(build.rolls.power, Object.keys(powerMap));
    const powerData = powerKey ? powerMap[powerKey] : null;

    const handleBodyChoice = (optionIndex: number) => {
        onUpdateBuild({
            ...build,
            choices: {
                ...build.choices,
                bodyOption: optionIndex,
            },
        });
    };

    const handleSpecChoice = (modIndex: number, stat: 'STR' | 'AGI' | 'VIT' | 'MAG' | 'LCK') => {
        onUpdateBuild({
            ...build,
            choices: {
                ...build.choices,
                specializationMods: {
                    ...build.choices.specializationMods,
                    [modIndex]: stat,
                },
            },
        });
    };

    const handlePowerChoice = (choiceIndex: number) => {
        onUpdateBuild({
            ...build,
            choices: {
                ...build.choices,
                powerChoice: choiceIndex,
            },
        });
    };

    return (
        <div className="build-roller">
            <div className="build-roller-header">
                <h3>Character Build</h3>
                <p className="text-muted">
                    Your character has been rolled! Expand each section to see details and make choices.
                </p>
            </div>

            <div className="roll-sections">
                {/* Age */}
                <RollSection
                    title="Age"
                    roll={build.rolls.age}
                    result={`${age} years old`}
                    description="Your character's starting age as a magical girl."
                    freePick={checkFreePick(origin, 'age')}
                />

                {/* Body */}
                <RollSection
                    title="Body Type"
                    roll={build.rolls.body}
                    result={getBodyType(build.rolls.body)}
                    description="Your character's physical build."
                    freePick={checkFreePick(origin, 'body')}
                    choices={
                        bodyData
                            ? bodyData.options.map((option, index) => ({
                                label: option.text,
                                value: index,
                                selected: build.choices.bodyOption === index,
                                onSelect: () => handleBodyChoice(index),
                            }))
                            : undefined
                    }
                />

                {/* Specialization */}
                <RollSection
                    title="Specialization"
                    roll={build.rolls.specialization}
                    result={getSpecializationName(build.rolls.specialization)}
                    description={
                        specData
                            ? `Grants: ${specData.mods.map((m) => m.text).join(', ')}`
                            : undefined
                    }
                    freePick={checkFreePick(origin, 'specialization')}
                    choices={
                        hasSpecChoices && specData
                            ? specData.mods
                                .map((mod, index) => {
                                    if (mod.stat === 'Choice') {
                                        return {
                                            label: `${mod.text} - Choose stat`,
                                            value: index,
                                            selected: !!build.choices.specializationMods?.[index],
                                            onSelect: () => {
                                                // This would open a modal or dropdown to choose stat
                                                // For now, default to STR
                                                handleSpecChoice(index, 'STR');
                                            },
                                        };
                                    }
                                    return null;
                                })
                                .filter((c) => c !== null) as Array<{
                                    label: string;
                                    value: number;
                                    selected: boolean;
                                    onSelect: () => void;
                                }>
                            : undefined
                    }
                />

                {/* Weapon */}
                <RollSection
                    title="Weapon"
                    roll={build.rolls.weapon}
                    result={getWeaponName(build.rolls.weapon)}
                    description="Your magical girl weapon type."
                    freePick={checkFreePick(origin, 'weapon')}
                />

                {/* Outfit */}
                <RollSection
                    title="Outfit"
                    roll={build.rolls.outfit}
                    result={getOutfitName(build.rolls.outfit)}
                    description="Your magical girl transformation outfit style."
                    freePick={checkFreePick(origin, 'outfit')}
                />

                {/* Power */}
                <RollSection
                    title="Power"
                    roll={build.rolls.power}
                    result={getPowerName(build.rolls.power)}
                    description={powerData?.effect}
                    freePick={checkFreePick(origin, 'power')}
                    choices={
                        powerData?.isChoice && powerData.choice
                            ? powerData.choice.map((choice, index) => ({
                                label: choice.text,
                                value: index,
                                selected: build.choices.powerChoice === index,
                                onSelect: () => handlePowerChoice(index),
                            }))
                            : undefined
                    }
                />

                {/* Perks */}
                {build.rolls.perks.map((roll, index) => (
                    <RollSection
                        key={`perk-${index}`}
                        title={`Perk ${index + 1} (${build.choices.perkCategories[index] === 'T1' ? 'Combat' : 'Support'})`}
                        roll={roll}
                        result={getPerkName(roll, build.choices.perkCategories[index])}
                        description={`Category: ${build.choices.perkCategories[index] === 'T1' ? 'Combat' : 'Support'}`}
                        freePick={checkFreePick(origin, `perk${index + 1}`)}
                    />
                ))}
            </div>
        </div>
    );
}
