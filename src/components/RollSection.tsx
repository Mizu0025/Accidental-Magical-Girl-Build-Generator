import { useState } from 'react';
import type { CoinType } from '../utils/mechanics';
import './RollSection.css';

interface RollSectionProps {
    title: string;
    roll: number;
    result: string;
    description?: string;
    coinOptions?: Array<{
        type: CoinType;
        available: boolean;
        effect: string;
        onSpend: () => void;
    }>;
    choices?: Array<{
        label: string;
        value: string | number;
        onSelect: () => void;
        selected: boolean;
    }>;
    freePick?: boolean;
    isExpanded?: boolean;
}

export function RollSection({
    title,
    roll,
    result,
    description,
    coinOptions,
    choices,
    freePick,
    isExpanded = false,
}: RollSectionProps) {
    const [expanded, setExpanded] = useState(isExpanded);

    return (
        <div className={`roll-section ${expanded ? 'expanded' : ''}`}>
            <div className="roll-section-header" onClick={() => setExpanded(!expanded)}>
                <div className="roll-section-title">
                    <h4>{title}</h4>
                    {freePick && <span className="free-pick-badge">Free Pick</span>}
                </div>
                <div className="roll-section-summary">
                    <span className="roll-value">Roll: {roll}</span>
                    <span className="roll-arrow">{expanded ? '▼' : '▶'}</span>
                </div>
            </div>

            {expanded && (
                <div className="roll-section-content">
                    <div className="result-display">
                        <div className="result-label">Result</div>
                        <div className="result-value">{result}</div>
                        {description && <p className="result-description">{description}</p>}
                    </div>

                    {choices && choices.length > 0 && (
                        <div className="choices-section">
                            <div className="choices-label">Choose One:</div>
                            <div className="choices-grid">
                                {choices.map((choice, index) => (
                                    <button
                                        key={index}
                                        className={`choice-button ${choice.selected ? 'selected' : ''}`}
                                        onClick={choice.onSelect}
                                    >
                                        {choice.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {coinOptions && coinOptions.length > 0 && (
                        <div className="coin-options">
                            <div className="coin-options-label">Spend Coins to Modify:</div>
                            <div className="coin-buttons">
                                {coinOptions.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`coin-button coin-${option.type.toLowerCase()}`}
                                        disabled={!option.available}
                                        onClick={option.onSpend}
                                        title={option.effect}
                                    >
                                        <span className="coin-icon">
                                            {option.type === 'Bronze' && '🥉'}
                                            {option.type === 'Silver' && '🥈'}
                                            {option.type === 'Gold' && '🥇'}
                                        </span>
                                        <span className="coin-effect">{option.effect}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
