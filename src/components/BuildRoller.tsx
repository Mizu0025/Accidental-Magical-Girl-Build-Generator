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
import {
    bodyMap,
    specializationMap,
    powerMap,
    perkData,
    weaponMap,
    outfitMap,
} from '../data/gameData';
import { getRangeKey } from '../utils/mechanics';
import './BuildRoller.css';

interface BuildRollerProps {
    build: BuildState;
    origin: Origin | null;
    coins: CoinStash;
    onUpdateBuild: (build: BuildState) => void;
    onSpendCoin: (type: CoinType) => void;
    onRefundCoin: (type: CoinType) => void;
    onUndoCoinSpend: (category: string) => void;
    onResetAllCoins: () => void;
}

export function BuildRoller({
    build,
    origin,
    coins,
    onUpdateBuild,
    onSpendCoin,
    onRefundCoin,
    onUndoCoinSpend,
    onResetAllCoins,
}: BuildRollerProps) {
    const [pendingChoice, setPendingChoice] = useState<{
        effect: CoinEffect;
        category: string;
    } | null>(null);

    // Track two-step perk selection for Gold coins
    const [pendingSecondPerk, setPendingSecondPerk] = useState<{
        perkIndex: number;
        firstPerkValue: string;
    } | null>(null);
    const [statChoiceModal, setStatChoiceModal] = useState<{ isOpen: boolean; modIndex: number } | null>(null);

    // Effective values (Choice >> Roll)
    const effectiveBody = build.choices.freePickBody ?? build.rolls.body;
    const effectiveSpec = build.choices.freePickSpecialization ?? build.rolls.specialization;
    const effectiveWeapon = build.choices.freePickWeapon ?? build.rolls.weapon;
    const effectiveOutfit = build.choices.freePickOutfit ?? build.rolls.outfit;
    const effectivePower = build.choices.freePickPower ?? build.rolls.power;

    // Body choices
    const bodyKey = getRangeKey(effectiveBody, Object.keys(bodyMap));
    const bodyData = bodyKey ? bodyMap[bodyKey] : null;

    // Specialization choices
    const specData = specializationMap[effectiveSpec];
    const hasSpecChoices = specData?.mods.some((mod) => mod.stat === 'Choice');

    // Power choices
    const getPowerData = (roll: number) => {
        const key = getRangeKey(roll, Object.keys(powerMap));
        return key ? powerMap[key] : null;
    };
    const powerData = getPowerData(effectivePower);

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

    const handleSecondPowerChoice = (choiceIndex: number) => {
        onUpdateBuild({
            ...build,
            choices: {
                ...build.choices,
                secondPowerChoice: choiceIndex,
            },
        });
    };

    const handleStatChange = (stat: string, type: 'bronze' | 'silver' | 'gold', isSpend: boolean) => {
        const coinKey = type === 'bronze' ? 'Bronze' : type === 'silver' ? 'Silver' : 'Gold';
        const currentSpends = build.choices.statSpends?.[stat] || { bronze: 0, silver: 0, gold: 0 };

        if (isSpend) {
            // Spending logic
            if (coins[coinKey] <= 0) return;
            onSpendCoin(coinKey);
            onUpdateBuild({
                ...build,
                choices: {
                    ...build.choices,
                    statSpends: {
                        ...build.choices.statSpends,
                        [stat]: {
                            ...currentSpends,
                            [type]: currentSpends[type] + 1
                        }
                    }
                }
            });
        } else {
            // Refund logic
            if (currentSpends[type] <= 0) return;
            onRefundCoin(coinKey);
            onUpdateBuild({
                ...build,
                choices: {
                    ...build.choices,
                    statSpends: {
                        ...build.choices.statSpends,
                        [stat]: {
                            ...currentSpends,
                            [type]: currentSpends[type] - 1
                        }
                    }
                }
            });
        }
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

        // Check if this is a Gold perk coin (two-step selection)
        const isGoldPerk = pendingChoice.category.startsWith('perk') &&
            pendingChoice.effect.type === 'Gold' &&
            !pendingSecondPerk;

        if (isGoldPerk) {
            // First step: store the first perk and show second modal
            const perkIndex = parseInt(pendingChoice.category.replace('perk', ''));
            setPendingSecondPerk({
                perkIndex,
                firstPerkValue: choiceValue as string,
            });

            // Update the modal to show second perk selection
            const excludeValue = choiceValue as string;

            // Create new choice prompt for second perk (excluding first choice)
            const secondPerkPrompt = {
                title: 'Choose Second Bonus Perk',
                description: 'Select the second bonus perk from either Combat or Support category.',
                options: [
                    ...Object.entries(perkData.T1).map(([roll, perk]: [string, any]) => ({
                        value: `T1-${roll}`,
                        label: `[Combat] ${perk.name}`,
                        description: perk.statMod?.text,
                    })),
                    ...Object.entries(perkData.T2).map(([roll, perk]: [string, any]) => ({
                        value: `T2-${roll}`,
                        label: `[Support] ${perk.name}`,
                        description: perk.statMod?.text,
                    })),
                ].filter(opt => opt.value !== excludeValue),
            };

            // Update pending choice with new prompt
            setPendingChoice({
                ...pendingChoice,
                effect: {
                    ...pendingChoice.effect,
                    choicePrompt: secondPerkPrompt,
                },
            });
        } else if (pendingSecondPerk) {
            // Second step: apply both perks
            const [firstCategory, firstRoll] = pendingSecondPerk.firstPerkValue.split('-');
            const [secondCategory, secondRoll] = (choiceValue as string).split('-');

            const newBonusPerks = [...(build.choices.bonusPerks || [])];
            newBonusPerks.push(
                {
                    category: firstCategory as 'T1' | 'T2',
                    roll: parseInt(firstRoll),
                },
                {
                    category: secondCategory as 'T1' | 'T2',
                    roll: parseInt(secondRoll),
                }
            );

            const newCoinsSpent = { ...build.coinsSpent };
            if (!newCoinsSpent.perks) newCoinsSpent.perks = [null, null, null, null, null];
            newCoinsSpent.perks[pendingSecondPerk.perkIndex] = 'Gold' as any;

            const newBuild = {
                ...build,
                choices: {
                    ...build.choices,
                    bonusPerks: newBonusPerks,
                },
                coinsSpent: newCoinsSpent,
            };

            onUpdateBuild(newBuild);
            onSpendCoin('Gold');
            setPendingChoice(null);
            setPendingSecondPerk(null);
        } else {
            // Normal single-step choice
            const newBuild = pendingChoice.effect.apply(build, choiceValue);
            if (newBuild) {
                onUpdateBuild(newBuild);
                onSpendCoin(pendingChoice.effect.type);
            }
            setPendingChoice(null);
        }
    };

    const handleChoiceCancel = () => {
        setPendingChoice(null);
        setPendingSecondPerk(null);
    };

    return (
        <div className="build-roller">
            <div className="build-roller-header">
                <div>
                    <h3>Character Build</h3>
                    <p className="text-muted">
                        Your character's been rolled! Expand each section to see details and make choices.
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
                    result={`${build.choices.freePickAge ?? calculateAge(build.rolls.age)} years old`}
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
                >
                    {checkFreePick(origin, 'age') && (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Enter Age (1-100):</div>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                className="age-input"
                                value={build.choices.freePickAge ?? calculateAge(build.rolls.age)}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val >= 1 && val <= 100) {
                                        onUpdateBuild({
                                            ...build,
                                            choices: {
                                                ...build.choices,
                                                freePickAge: val,
                                            },
                                        });
                                    }
                                }}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    width: '100px'
                                }}
                            />
                        </div>
                    )}
                </RollSection>

                {/* Body */}
                <RollSection
                    title="Body Type"
                    roll={build.rolls.body}
                    result={getBodyType(effectiveBody)}
                    description={
                        bodyData
                            ? `Your character's physical build. ${bodyData.options[build.choices.bodyOption ?? 0]?.text || ''}`
                            : "Your character's physical build."
                    }
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
                >
                    {checkFreePick(origin, 'body') && (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Select Body Type:</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[
                                    { value: 3, label: 'Underdeveloped' },
                                    { value: 10, label: 'Average' },
                                    { value: 17, label: 'Overdeveloped' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        className={`choice-button ${effectiveBody === opt.value ? 'selected' : ''}`}
                                        onClick={() => onUpdateBuild({ ...build, choices: { ...build.choices, freePickBody: opt.value } })}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </RollSection>

                {/* Specialization */}
                <RollSection
                    title="Specialization"
                    roll={build.rolls.specialization}
                    result={getSpecializationName(effectiveSpec)}
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
                                            label: `${mod.text} - ${build.choices.specializationMods?.[index] || 'Choose stat'}`,
                                            value: index,
                                            selected: !!build.choices.specializationMods?.[index],
                                            onSelect: () => {
                                                setStatChoiceModal({ isOpen: true, modIndex: index });
                                            },
                                        };
                                    }
                                    return null;
                                })
                                .filter((c): c is NonNullable<typeof c> => c !== null)
                            : undefined
                    }
                    coinOptions={getSpecializationCoinEffects(build).map((effect) => ({
                        type: effect.type,
                        available: canSpendCoin('specialization', effect.type, build, coins),
                        effect: effect.description,
                        onSpend: () => handleCoinSpend('specialization', effect),
                    }))}
                >
                    {checkFreePick(origin, 'specialization') && (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Select Specialization:</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                                {Object.entries(specializationMap).map(([roll, spec]) => (
                                    <button
                                        key={roll}
                                        className={`choice-button ${effectiveSpec === parseInt(roll) ? 'selected' : ''}`}
                                        onClick={() => onUpdateBuild({ ...build, choices: { ...build.choices, freePickSpecialization: parseInt(roll) } })}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', textAlign: 'left' }}
                                    >
                                        {spec.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </RollSection>

                {/* Weapon */}
                <RollSection
                    title="Weapon"
                    roll={build.rolls.weapon}
                    result={getWeaponName(effectiveWeapon)}
                    description={`Your magical girl weapon type. ${(() => {
                        const key = getRangeKey(effectiveWeapon, Object.keys(weaponMap));
                        return (key && weaponMap[key]?.mods.map((m: any) => m.text).join(', ')) || '';
                    })()}`}
                    freePick={checkFreePick(origin, 'weapon')}
                    spentCoin={build.coinsSpent.weapon}
                    onUndo={() => onUndoCoinSpend('weapon')}
                    coinOptions={getWeaponCoinEffects(build).map((effect) => ({
                        type: effect.type,
                        available: canSpendCoin('weapon', effect.type, build, coins),
                        effect: effect.description,
                        onSpend: () => handleCoinSpend('weapon', effect),
                    }))}
                >
                    {checkFreePick(origin, 'weapon') && (
                        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Select Weapon:</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[
                                    { value: 3, label: 'Melee' },
                                    { value: 8, label: 'Ranged' },
                                    { value: 13, label: 'Mystic' },
                                    { value: 18, label: 'Fist' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        className={`choice-button ${effectiveWeapon === opt.value ? 'selected' : ''}`}
                                        onClick={() => onUpdateBuild({ ...build, choices: { ...build.choices, freePickWeapon: opt.value } })}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {build.choices.secondWeapon && (
                        <div className="secondary-item" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <strong>Second Weapon:</strong> {getWeaponName(build.choices.secondWeapon)}
                        </div>
                    )}
                </RollSection>

                {/* Outfit */}
                <RollSection
                    title="Outfit"
                    roll={build.rolls.outfit}
                    result={getOutfitName(effectiveOutfit)}
                    description={`Your magical girl outfit style. ${(() => {
                        const key = getRangeKey(effectiveOutfit, Object.keys(outfitMap));
                        return (key && outfitMap[key]?.mods.map((m: any) => m.text).join(', ')) || '';
                    })()}`}
                    freePick={checkFreePick(origin, 'outfit')}
                    spentCoin={build.coinsSpent.outfit}
                    onUndo={() => onUndoCoinSpend('outfit')}
                    coinOptions={getOutfitCoinEffects(build).map((effect) => ({
                        type: effect.type,
                        available: canSpendCoin('outfit', effect.type, build, coins),
                        effect: effect.description,
                        onSpend: () => handleCoinSpend('outfit', effect),
                    }))}
                >
                    {checkFreePick(origin, 'outfit') && (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Select Outfit:</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[
                                    { value: 3, label: 'Skimpy' },
                                    { value: 8, label: 'Flowing' },
                                    { value: 13, label: 'Elaborate' },
                                    { value: 18, label: 'Uniform' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        className={`choice-button ${effectiveOutfit === opt.value ? 'selected' : ''}`}
                                        onClick={() => onUpdateBuild({ ...build, choices: { ...build.choices, freePickOutfit: opt.value } })}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </RollSection>

                {/* Power */}
                <RollSection
                    title="Power"
                    roll={build.rolls.power}
                    result={getPowerName(effectivePower)}
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
                >
                    {checkFreePick(origin, 'power') && (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Select Power:</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                                {Object.entries(powerMap).map(([range, power]) => {
                                    const midRoll = parseInt(range.split('-')[0]);
                                    return (
                                        <button
                                            key={midRoll}
                                            className={`choice-button ${effectivePower === midRoll ? 'selected' : ''}`}
                                            onClick={() => onUpdateBuild({ ...build, choices: { ...build.choices, freePickPower: midRoll } })}
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', textAlign: 'left' }}
                                        >
                                            {power.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </RollSection>

                {/* Second Power (Gold coin) */}
                {build.choices.secondPower && (() => {
                    const secondPowerData = getPowerData(build.choices.secondPower);
                    return (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                            <RollSection
                                title="Second Power (Gold)"
                                roll={0} // No roll for second power
                                result={getPowerName(build.choices.secondPower)}
                                description={secondPowerData?.effect}
                                spentCoin={undefined}
                                onUndo={() => { }} // Handled by undoing the gold coin spend
                                choices={
                                    secondPowerData?.isChoice && secondPowerData.choice
                                        ? secondPowerData.choice.map((choice, index) => ({
                                            label: choice.text,
                                            value: index,
                                            selected: build.choices.secondPowerChoice === index,
                                            onSelect: () => handleSecondPowerChoice(index),
                                        }))
                                        : undefined
                                }
                            />
                        </div>
                    );
                })()}

                {/* Perks */}
                {build.rolls.perks.map((roll, index) => {
                    const effectivePerk = build.choices.freePickPerks?.[index] ?? roll;
                    const category = build.choices.perkCategories[index];
                    const isPerk5 = index === 4;

                    return (
                        <RollSection
                            key={`perk-${index}`}
                            title={`Perk ${index + 1} (${category === 'T1' ? 'Combat' : 'Support'})`}
                            roll={roll}
                            result={getPerkName(effectivePerk, category)}
                            description={`Category: ${category === 'T1' ? 'Combat' : 'Support'}`}
                            freePick={checkFreePick(origin, `perk${index + 1}`)}
                            spentCoin={build.coinsSpent.perks?.[index] || undefined}
                            onUndo={() => onUndoCoinSpend(`perk${index}`)}
                            coinOptions={getPerkCoinEffects(build, index).map((effect) => ({
                                type: effect.type,
                                available: canSpendCoin(`perk${index}`, effect.type, build, coins),
                                effect: effect.description,
                                onSpend: () => handleCoinSpend(`perk${index}`, effect),
                            }))}
                        >
                            {isPerk5 && !checkFreePick(origin, `perk${index + 1}`) && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <button
                                        className="choice-button"
                                        onClick={() => {
                                            const newCategories = [...build.choices.perkCategories];
                                            newCategories[index] = category === 'T1' ? 'T2' : 'T1';
                                            onUpdateBuild({
                                                ...build,
                                                choices: {
                                                    ...build.choices,
                                                    perkCategories: newCategories as any,
                                                },
                                            });
                                        }}
                                        style={{ width: '100%', textAlign: 'center' }}
                                    >
                                        Switch to {category === 'T1' ? 'Support' : 'Combat'} Category
                                    </button>
                                </div>
                            )}

                            {checkFreePick(origin, `perk${index + 1}`) && (
                                <div style={{ marginTop: '1rem' }}>
                                    <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Select Perk:</div>

                                    {/* If Perk 5, show both categories. Otherwise show current category. */}
                                    {isPerk5 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>Combat Perks</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                                                    {Object.entries(perkData.T1).map(([rollVal, perk]) => (
                                                        <button
                                                            key={`T1-${rollVal}`}
                                                            className={`choice-button ${(effectivePerk === parseInt(rollVal) && category === 'T1') ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                const newFreePickPerks = [...(build.choices.freePickPerks || [null, null, null, null, null])];
                                                                newFreePickPerks[index] = parseInt(rollVal);
                                                                const newCategories = [...build.choices.perkCategories];
                                                                newCategories[index] = 'T1';
                                                                onUpdateBuild({
                                                                    ...build,
                                                                    choices: {
                                                                        ...build.choices,
                                                                        freePickPerks: newFreePickPerks,
                                                                        perkCategories: newCategories as any,
                                                                    },
                                                                });
                                                            }}
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', textAlign: 'left' }}
                                                        >
                                                            {perk.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>Support Perks</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                                                    {Object.entries(perkData.T2).map(([rollVal, perk]) => (
                                                        <button
                                                            key={`T2-${rollVal}`}
                                                            className={`choice-button ${(effectivePerk === parseInt(rollVal) && category === 'T2') ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                const newFreePickPerks = [...(build.choices.freePickPerks || [null, null, null, null, null])];
                                                                newFreePickPerks[index] = parseInt(rollVal);
                                                                const newCategories = [...build.choices.perkCategories];
                                                                newCategories[index] = 'T2';
                                                                onUpdateBuild({
                                                                    ...build,
                                                                    choices: {
                                                                        ...build.choices,
                                                                        freePickPerks: newFreePickPerks,
                                                                        perkCategories: newCategories as any,
                                                                    },
                                                                });
                                                            }}
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', textAlign: 'left' }}
                                                        >
                                                            {perk.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                                            {Object.entries(perkData[category]).map(([rollVal, perk]) => (
                                                <button
                                                    key={rollVal}
                                                    className={`choice-button ${effectivePerk === parseInt(rollVal) ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        const newFreePickPerks = [...(build.choices.freePickPerks || [null, null, null, null, null])];
                                                        newFreePickPerks[index] = parseInt(rollVal);
                                                        onUpdateBuild({
                                                            ...build,
                                                            choices: {
                                                                ...build.choices,
                                                                freePickPerks: newFreePickPerks,
                                                            },
                                                        });
                                                    }}
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', textAlign: 'left' }}
                                                >
                                                    {perk.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </RollSection>
                    );
                })}
                {/* Bonus Perks */}
                {build.choices.bonusPerks && build.choices.bonusPerks.length > 0 && (
                    <div className="bonus-perks-section" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: '#ffd700' }}>🥇 Bonus Perks</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {build.choices.bonusPerks.map((perk, index) => (
                                <div key={index} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                                    <strong>{perk.category === 'T1' ? '[Combat]' : '[Support]'}</strong> {getPerkName(perk.roll, perk.category)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Stat Choice Modal */}
            {statChoiceModal && (
                <ChoiceModal
                    title="Choose Stat"
                    description="Select a stat to apply the bonus to."
                    options={['STR', 'AGI', 'VIT', 'MAG', 'LCK'].map((stat) => ({
                        label: stat,
                        value: stat,
                    }))}
                    onSelect={(value) => {
                        handleSpecChoice(statChoiceModal.modIndex, value as any);
                        setStatChoiceModal(null);
                    }}
                    onCancel={() => setStatChoiceModal(null)}
                />
            )}

            {/* Stat Boosts Section */}
            <RollSection
                title="Stat Boosts"
                // No roll prop passed, so it won't display "Roll: X"
                result="Spend coins to boost stats"
                description="Directly increase your stats by spending coins."
                spentCoin={undefined}
                onUndo={() => { }} // Undo handled by individual buttons
            >
                <div className="stat-boosts-grid" style={{ display: 'grid', gap: '0.5rem' }}>
                    {['STR', 'AGI', 'VIT', 'MAG', 'LCK'].map((stat) => {
                        const spends = build.choices.statSpends?.[stat] || { bronze: 0, silver: 0, gold: 0 };
                        return (
                            <div key={stat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                                <div style={{ fontWeight: 'bold', width: '40px' }}>{stat}</div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <button
                                            className="choice-button"
                                            onClick={() => handleStatChange(stat, 'bronze', true)}
                                            disabled={coins.Bronze <= 0}
                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', opacity: coins.Bronze <= 0 ? 0.5 : 1 }}
                                            title="Spend 1 Bronze Coin (+1)"
                                        >
                                            +1 (1B)
                                        </button>
                                        {spends.bronze > 0 && (
                                            <button
                                                className="choice-button"
                                                onClick={() => handleStatChange(stat, 'bronze', false)}
                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#ef4444' }}
                                                title="Undo Bronze Spend"
                                            >
                                                X
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <button
                                            className="choice-button"
                                            onClick={() => handleStatChange(stat, 'silver', true)}
                                            disabled={coins.Silver <= 0}
                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', opacity: coins.Silver <= 0 ? 0.5 : 1 }}
                                            title="Spend 1 Silver Coin (+2)"
                                        >
                                            +2 (1S)
                                        </button>
                                        {spends.silver > 0 && (
                                            <button
                                                className="choice-button"
                                                onClick={() => handleStatChange(stat, 'silver', false)}
                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#ef4444' }}
                                                title="Undo Silver Spend"
                                            >
                                                X
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <button
                                            className="choice-button"
                                            onClick={() => handleStatChange(stat, 'gold', true)}
                                            disabled={coins.Gold <= 0}
                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', opacity: coins.Gold <= 0 ? 0.5 : 1 }}
                                            title="Spend 1 Gold Coin (+4)"
                                        >
                                            +4 (1G)
                                        </button>
                                        {spends.gold > 0 && (
                                            <button
                                                className="choice-button"
                                                onClick={() => handleStatChange(stat, 'gold', false)}
                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#ef4444' }}
                                                title="Undo Gold Spend"
                                            >
                                                X
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.7, marginLeft: '0.5rem' }}>
                                    Boost: +{spends.bronze * 1 + spends.silver * 2 + spends.gold * 4}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </RollSection>

            {/* Coin Choice Modal */}
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
