import { origins } from '../data/gameData';
import type { Origin } from '../data/gameData';
import './OriginSelector.css';

interface OriginSelectorProps {
    selectedOrigin: Origin | null;
    onSelect: (origin: Origin) => void;
}

export function OriginSelector({ selectedOrigin, onSelect }: OriginSelectorProps) {
    return (
        <div className="origin-selector">
            <div className="origin-header">
                <h2>Choose Your Origin</h2>
                <p className="text-muted">
                    Your origin determines how you became a magical girl and grants special bonuses.
                </p>
            </div>

            <div className="origin-grid">
                {origins.map((origin) => (
                    <div
                        key={origin.name}
                        className={`origin-card ${selectedOrigin?.name === origin.name ? 'selected' : ''}`}
                        onClick={() => onSelect(origin)}
                    >
                        <h3 className="origin-name">{origin.name}</h3>

                        <div className="origin-section">
                            <div className="origin-section-label">Bonus</div>
                            <p className="origin-text">{origin.bonus}</p>
                        </div>

                        {origin.negative !== 'None' && (
                            <div className="origin-section negative">
                                <div className="origin-section-label">Drawback</div>
                                <p className="origin-text">{origin.negative}</p>
                            </div>
                        )}

                        {selectedOrigin?.name === origin.name && (
                            <div className="selected-indicator">✓ Selected</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
