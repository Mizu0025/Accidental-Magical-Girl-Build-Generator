import { useState } from 'react';
import { RollSection } from './RollSection';
import { ChoiceModal } from './ChoiceModal';
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
import {
    getAgeCoinEffects,
    getBodyCoinEffects,
    getSpecializationCoinEffects,
    getWeaponCoinEffects,
    getOutfitCoinEffects,
    getPowerCoinEffects,
    getPerkCoinEffects,
    canSpendCoin,
    type CoinEffect,
} from '../utils/coinEffects';
import { bodyMap, specializationMap, powerMap } from '../data/gameData';
import { getRangeKey } from '../utils/mechanics';
import './BuildRoller.css';

interface BuildRollerProps {
    build: BuildState;
    origin: Origin | null;
    coins: CoinStash;
    onUpdateBuild: (build: BuildState) => void;
    onSpendCoin: (type: CoinType) => void;
    onUndoCoinSpend: (category: string) => void;
    onResetAllCoins: () => void;
}

export function BuildRoller({
    build,
    origin,
    coins,
    onUpdateBuild,
    onSpendCoin,
    onUndoCoinSpend,
    onResetAllCoins,
}: BuildRollerProps) {
    const [pendingChoice, setPendingChoice] = useState<{
        effect: CoinEffect;
        category: string;
    } | null>(null);

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

    const handleCoinSpend = (category: string, effect: CoinEffect) => {
        if (!canSpendCoin(category, effect.type, build, coins)) return;

        // If this effect needs a choice, show the modal
        if (effect.needsChoice && effect.choicePrompt) {
            setPendingChoice({ effect, category });
        } else {
            // Apply immediately without choice
            const newBuild = effect.apply(build);
            if (newBuild) {
                onUpdateBuild(newBuild);
                onSpendCoin(effect.type);
            }
        }
    };

    const handleChoiceConfirm = (choiceValue: string | number) => {
        if (!pendingChoice) return;

        const newBuild = pendingChoice.effect.apply(build, choiceValue);
        if (newBuild) {
            onUpdateBuild(newBuild);
            onSpendCoin(pendingChoice.effect.type);
        }
        setPendingChoice(null);
    };

    const handleChoiceCancel = () => {
        setPendingChoice(null);
    };

    return (
        <div className="build-roller">
            <div className="build-roller-header">
                <div>
                    <h3>Character Build</h3>
                    <p className="text-muted">
                        Your character has been rolled! Expand each section to see details and make choices.
                    </p>
                </div>
                <button
                    className="btn-secondary btn-small"
                    onClick={onResetAllCoins}
                    style={{ alignSelf: 'flex-start' }}
                >
                    Reset All Coins
                </button>
            </div>

            <div className="roll-sections">
                {/* Age */}
                <RollSection
                    title="Age"
                    roll={build.rolls.age}
                    result={`${age} years old`}
                    description="Your character's starting age as a magical girl."
                    freePick={checkFreePick(origin, 'age')}
                    spentCoin={build.coinsSpent.age}
                    onUndo={() => onUndoCoinSpend('age')}
                    coinOptions={getAgeCoinEffects(build).map((effect) => ({
                        type: effect.type,
                        available: canSpendCoin('age', effect.type, build, coins),
                        effect: effect.description,
                        onSpend: () => handleCoinSpend('age', effect),
                    }))}
                />

                {/* Body */}
                <RollSection
                    title="Body Type"
                    roll={build.rolls.body}
                    result={getBodyType(build.rolls.body)}
                    description="Your character's physical build."
                    freePick={checkFreePick(origin, 'body')}
                    spentCoin={build.coinsSpent.body}
                    onUndo={() => onUndoCoinSpend('body')}
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
                    coinOptions={getBodyCoinEffects(build).map((effect) => ({
                        type: effect.type,
                        available: canSpendCoin('body', effect.type, build, coins),
                        effect: effect.description,
                        onSpend: () => handleCoinSpend('body', effect),
                    }))}
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
                    spentCoin={build.coinsSpent.specialization}
                    onUndo={() => onUndoCoinSpend('specialization')}
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
                    coinOptions={getSpecializationCoinEffects(build).map((effect) => ({
                        type: effect.type,
                        available: canSpendCoin('specialization', effect.type, build, coins),
                        effect: effect.description,
                        onSpend: () => handleCoinSpend('specialization', effect),
                    }))}
                />

                {/* Weapon */}
                <RollSection
                    title="Weapon"
                    roll={build.rolls.weapon}
                    result={getWeaponName(build.rolls.weapon)}
                    description="Your magical girl weapon type."
                    freePick={checkFreePick(origin, 'weapon')}
                    spentCoin={build.coinsSpent.weapon}
                    onUndo={() => onUndoCoinSpend('weapon')}
                    coinOptions={getWeaponCoinEffects(build).map((effect) => ({
                        type: effect.type,
                        available: canSpendCoin('weapon', effect.type, build, coins),
                        effect: effect.description,
                        onSpend: () => handleCoinSpend('weapon', effect),
                    }))}
                />

                {/* Outfit */}
                <RollSection
                    title="Outfit"
                    roll={build.rolls.outfit}
                    result={getOutfitName(build.rolls.outfit)}
                    description="Your magical girl transformation outfit style."
                    freePick={checkFreePick(origin, 'outfit')}
                    spentCoin={build.coinsSpent.outfit}
                    onUndo={() => onUndoCoinSpend('outfit')}
                    coinOptions={getOutfitCoinEffects(build).map((effect) => ({
                        type: effect.type,
                        available: canSpendCoin('outfit', effect.type, build, coins),
                        effect: effect.description,
                        onSpend: () => handleCoinSpend('outfit', effect),
                    }))}
                />

                {/* Power */}
                <RollSection
                    title="Power"
                    roll={build.rolls.power}
                    result={getPowerName(build.rolls.power)}
                    description={powerData?.effect}
                    freePick={checkFreePick(origin, 'power')}
                    spentCoin={build.coinsSpent.power}
                    onUndo={() => onUndoCoinSpend('power')}
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
                    coinOptions={getPowerCoinEffects(build).map((effect) => ({
                        type: effect.type,
                        available: canSpendCoin('power', effect.type, build, coins),
                        effect: effect.description,
                        onSpend: () => handleCoinSpend('power', effect),
                    }))}
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
                        spentCoin={build.coinsSpent.perks?.[index] || undefined}
                        onUndo={() => onUndoCoinSpend(`perk${index}`)}
                        coinOptions={getPerkCoinEffects(build, index).map((effect) => ({
                            type: effect.type,
                            available: canSpendCoin(`perk${index}`, effect.type, build, coins),
                            effect: effect.description,
                            onSpend: () => handleCoinSpend(`perk${index}`, effect),
                        }))}
                    />
                ))}
            </div>

            {pendingChoice && pendingChoice.effect.choicePrompt && (
                <ChoiceModal
                    title={pendingChoice.effect.choicePrompt.title}
                    description={pendingChoice.effect.choicePrompt.description}
                    options={pendingChoice.effect.choicePrompt.options}
                    onSelect={handleChoiceConfirm}
                    onCancel={handleChoiceCancel}
                />
            )}
        </div>
    );
}
