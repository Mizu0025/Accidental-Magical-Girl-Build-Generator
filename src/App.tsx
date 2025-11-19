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
    const rolls = {
      age: rollD20(),
      body: rollD20(),
      specialization: rollD20(),
      weapon: rollD20(),
      outfit: rollD20(),
      power: rollD20(),
      perks: [rollD20(), rollD20(), rollD20(), rollD20(), rollD20()] as [number, number, number, number, number],
    };

    newBuild.rolls = rolls;
    newBuild.originalRolls = { ...rolls }; // Store original rolls

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

  const handleRefundCoin = (type: CoinType) => {
    setCoins({ ...coins, [type]: coins[type] + 1 });
  };

  const handleUndoCoinSpend = (category: string) => {
    // Find what coin was spent on this category
    let spentCoin: CoinType | undefined;

    if (category.startsWith('perk')) {
      const perkIndex = parseInt(category.replace('perk', ''));
      spentCoin = build.coinsSpent.perks?.[perkIndex] || undefined;
    } else {
      spentCoin = (build.coinsSpent as any)[category] as CoinType | undefined;
    }

    if (!spentCoin) return;

    // Refund the coin
    setCoins({
      ...coins,
      [spentCoin]: coins[spentCoin] + 1,
    });

    // Clear the coin spend from build and restore original roll
    const newCoinsSpent = { ...build.coinsSpent };

    // Restore original roll value and choices
    const newRolls = { ...build.rolls };
    const newChoices = { ...build.choices };

    if (category === 'age') {
      newRolls.age = build.originalRolls.age;
      delete (newCoinsSpent as any)[category];
    } else if (category === 'body') {
      newRolls.body = build.originalRolls.body;
      delete (newCoinsSpent as any)[category];
    } else if (category === 'specialization') {
      newRolls.specialization = build.originalRolls.specialization;
      delete (newCoinsSpent as any)[category];
    } else if (category === 'weapon') {
      newRolls.weapon = build.originalRolls.weapon;
      // Clear second weapon if Gold coin was spent
      if (spentCoin === 'Gold') {
        newChoices.secondWeapon = undefined;
      }
      delete (newCoinsSpent as any)[category];
    } else if (category === 'outfit') {
      newRolls.outfit = build.originalRolls.outfit;
      delete (newCoinsSpent as any)[category];
    } else if (category === 'power') {
      newRolls.power = build.originalRolls.power;
      // Clear second power if Gold coin was spent
      if (spentCoin === 'Gold') {
        newChoices.secondPower = undefined;
        newChoices.secondPowerChoice = undefined;
      }
      delete (newCoinsSpent as any)[category];
    } else if (category.startsWith('perk')) {
      const perkIndex = parseInt(category.replace('perk', ''));

      // Restore original roll
      newRolls.perks = [...build.rolls.perks] as [number, number, number, number, number];
      newRolls.perks[perkIndex] = build.originalRolls.perks[perkIndex];

      // Restore original perk category if it was a Bronze coin (category swap)
      if (spentCoin === 'Bronze') {
        const newCategories = [...build.choices.perkCategories];
        // Flip back to original category
        newCategories[perkIndex] = newCategories[perkIndex] === 'T1' ? 'T2' : 'T1';
        newChoices.perkCategories = newCategories as any;
      }

      // Remove bonus perks if Gold coin was spent
      if (spentCoin === 'Gold' && newChoices.bonusPerks) {
        // Remove the last 2 bonus perks (the ones added by this Gold coin)
        newChoices.bonusPerks = newChoices.bonusPerks.slice(0, -2);
      }

      // Clear the coin spend
      if (newCoinsSpent.perks) {
        newCoinsSpent.perks = [...newCoinsSpent.perks];
        newCoinsSpent.perks[perkIndex] = null;
      }
    }

    setBuild({
      ...build,
      rolls: newRolls,
      choices: newChoices,
      coinsSpent: newCoinsSpent,
    });
  };

  const handleResetAllCoins = () => {
    // Refund all spent coins
    const refundedCoins = { ...getInitialCoins(selectedOrigin) };
    setCoins(refundedCoins);

    // Restore all original rolls and clear coin-affected choices
    setBuild({
      ...build,
      rolls: { ...build.originalRolls },
      choices: {
        ...build.choices,
        // Reset perk categories to default
        perkCategories: ['T2', 'T2', 'T1', 'T1', 'T1'],
        // Clear Gold coin features
        secondWeapon: undefined,
        secondPower: undefined,
        secondPowerChoice: undefined,
        bonusPerks: undefined,
      },
      coinsSpent: {},
    });
  };

  const handleReroll = () => {
    setBuild(createEmptyBuild());
    setCoins(getInitialCoins(selectedOrigin)); // Reset coins on reroll
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
                      onRefundCoin={handleRefundCoin}
                      onUndoCoinSpend={handleUndoCoinSpend}
                      onResetAllCoins={handleResetAllCoins}
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
