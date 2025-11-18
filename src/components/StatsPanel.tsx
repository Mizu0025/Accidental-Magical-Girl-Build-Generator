import type { Stats } from '../data/gameData';
import './StatsPanel.css';

interface StatsPanelProps {
    stats: Stats;
    age: number;
}

export function StatsPanel({ stats, age }: StatsPanelProps) {
    const statEntries: Array<{ key: keyof Stats; label: string; color: string }> = [
        { key: 'STR', label: 'Strength', color: 'str' },
        { key: 'AGI', label: 'Agility', color: 'agi' },
        { key: 'VIT', label: 'Vitality', color: 'vit' },
        { key: 'MAG', label: 'Magic', color: 'mag' },
        { key: 'LCK', label: 'Luck', color: 'lck' },
    ];

    return (
        <div className="stats-panel">
            <div className="stats-header">
                <h3>Character Stats</h3>
                <div className="age-display">
                    <span className="age-label">Age</span>
                    <span className="age-value">{age}</span>
                </div>
            </div>

            <div className="stats-grid">
                {statEntries.map(({ key, label, color }) => (
                    <div key={key} className="stat-item">
                        <div className="stat-label">
                            <span className={`badge badge-${color}`}>{key}</span>
                            <span className="stat-name">{label}</span>
                        </div>
                        <div className="stat-value">{stats[key]}</div>
                    </div>
                ))}
            </div>

            <div className="stats-total">
                <span>Total</span>
                <span className="total-value">
                    {Object.values(stats).reduce((sum, val) => sum + val, 0)}
                </span>
            </div>
        </div>
    );
}
