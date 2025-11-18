import { useState } from 'react';
import { OriginSelector } from './components/OriginSelector';
import { StatsPanel } from './components/StatsPanel';
import { BuildRoller } from './components/BuildRoller';
import { initialStats } from './data/gameData';
import { getInitialCoins, rollD20, spendCoin } from './utils/mechanics';
import { createEmptyBuild } from './utils/buildState';
import { calculateFinalStats } from './utils/buildCalculator';
import type { Origin, Stats } from './data/gameData';
import type { CoinStash, CoinType } from './utils/mechanics';
import type { BuildState } from './utils/buildState';
import './App.css';

function App() {
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
  const [coins, setCoins] = useState<CoinStash>({ Bronze: 4, Silver: 3, Gold: 1 });
  const [build, setBuild] = useState<BuildState>(createEmptyBuild());
  const [hasRolled, setHasRolled] = useState(false);

  const stats: Stats = hasRolled ? calculateFinalStats(build, selectedOrigin) : initialStats;
  const age = hasRolled && build.rolls.age > 0
    ? (build.rolls.age > 10 ? build.rolls.age - 10 : build.rolls.age) + 6
    : 7;

  const handleOriginSelect = (origin: Origin) => {
    setSelectedOrigin(origin);
    setCoins(getInitialCoins(origin));
  };

  const handleRollAll = () => {
    const newBuild = createEmptyBuild();

    // Roll all 11d20
    newBuild.rolls.age = rollD20();
    newBuild.rolls.body = rollD20();
    newBuild.rolls.specialization = rollD20();
    newBuild.rolls.weapon = rollD20();
    newBuild.rolls.outfit = rollD20();
    newBuild.rolls.power = rollD20();
    newBuild.rolls.perks = [rollD20(), rollD20(), rollD20(), rollD20(), rollD20()];

    // Set default choices
    newBuild.choices.bodyOption = 0; // Default to first option
    newBuild.choices.perkCategories = ['T2', 'T2', 'T1', 'T1', 'T1']; // Default perk categories

    setBuild(newBuild);
    setHasRolled(true);
  };

  const handleUpdateBuild = (updatedBuild: BuildState) => {
    setBuild(updatedBuild);
  };

  const handleSpendCoin = (type: CoinType) => {
    const newCoins = spendCoin(coins, type);
    if (newCoins) {
      setCoins(newCoins);
    }
  };

  const handleReroll = () => {
    setBuild(createEmptyBuild());
    setHasRolled(false);
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
                    onClick={() => {
                      setSelectedOrigin(null);
                      setHasRolled(false);
                      setBuild(createEmptyBuild());
                    }}
                  >
                    Change Origin
                  </button>
                </div>
                <p className="text-muted">{selectedOrigin.bonus}</p>
                {selectedOrigin.negative !== 'None' && (
                  <p className="text-muted" style={{ color: '#ef4444' }}>
                    ⚠️ {selectedOrigin.negative}
                  </p>
                )}
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

              {!hasRolled ? (
                <button
                  className="btn-primary mt-lg"
                  style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                  onClick={handleRollAll}
                >
                  🎲 Roll Character (11d20)
                </button>
              ) : (
                <>
                  <div className="card mt-lg">
                    <BuildRoller
                      build={build}
                      origin={selectedOrigin}
                      coins={coins}
                      onUpdateBuild={handleUpdateBuild}
                      onSpendCoin={handleSpendCoin}
                    />
                  </div>

                  <button
                    className="btn-secondary mt-lg"
                    style={{ width: '100%', padding: '1rem' }}
                    onClick={handleReroll}
                  >
                    🔄 Reroll Character
                  </button>
                </>
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
