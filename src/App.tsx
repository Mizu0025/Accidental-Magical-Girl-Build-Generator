import { useState } from 'react';
import { OriginSelector } from './components/OriginSelector';
import { StatsPanel } from './components/StatsPanel';
import { initialStats } from './data/gameData';
import { getInitialCoins, rollD20, calculateAge } from './utils/mechanics';
import type { Origin, Stats } from './data/gameData';
import type { CoinStash } from './utils/mechanics';
import './App.css';

function App() {
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
  const [coins, setCoins] = useState<CoinStash>({ Bronze: 4, Silver: 3, Gold: 1 });
  const [stats, setStats] = useState<Stats>(initialStats);
  const [age, setAge] = useState<number>(7);
  const [hasRolled, setHasRolled] = useState(false);

  const handleOriginSelect = (origin: Origin) => {
    setSelectedOrigin(origin);
    setCoins(getInitialCoins(origin));
  };

  const handleRollAll = () => {
    // Roll for age
    const ageRoll = rollD20();
    const calculatedAge = calculateAge(ageRoll);
    setAge(calculatedAge);

    // For now, just set initial stats
    // TODO: Implement full rolling logic
    setStats(initialStats);
    setHasRolled(true);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>Accidental Magical Girl</h1>
          <p className="subtitle">Build Generator</p>
        </header>

        {!selectedOrigin ? (
          <OriginSelector
            selectedOrigin={selectedOrigin}
            onSelect={handleOriginSelect}
          />
        ) : (
          <div className="app-content">
            <div className="main-section">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Origin: {selectedOrigin.name}</h3>
                  <button
                    className="btn-secondary btn-small"
                    onClick={() => setSelectedOrigin(null)}
                  >
                    Change Origin
                  </button>
                </div>
                <p className="text-muted">{selectedOrigin.bonus}</p>
              </div>

              <div className="card mt-lg">
                <div className="card-header">
                  <h3 className="card-title">Coin Stash</h3>
                </div>
                <div className="coin-display">
                  <div className="coin-item">
                    <span className="coin-label">🥉 Bronze</span>
                    <span className="coin-value">{coins.Bronze}</span>
                  </div>
                  <div className="coin-item">
                    <span className="coin-label">🥈 Silver</span>
                    <span className="coin-value">{coins.Silver}</span>
                  </div>
                  <div className="coin-item">
                    <span className="coin-label">🥇 Gold</span>
                    <span className="coin-value">{coins.Gold}</span>
                  </div>
                </div>
              </div>

              {!hasRolled && (
                <button
                  className="btn-primary mt-lg"
                  style={{ width: '100%', padding: '1rem' }}
                  onClick={handleRollAll}
                >
                  🎲 Roll Character
                </button>
              )}

              {hasRolled && (
                <div className="card mt-lg">
                  <h3>Character Build</h3>
                  <p className="text-muted">
                    Full build generator coming soon! Age: {age}
                  </p>
                </div>
              )}
            </div>

            <aside className="sidebar">
              <StatsPanel stats={stats} age={age} />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
