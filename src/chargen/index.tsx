import { data } from '../constants/data';
import './style.css';

const Chargen = () => {
    const diceResults: number[] = [];
    for (let i = 0; i < 11; i++) {
        diceResults.push(Math.floor(Math.random() * 20) + 1);
    }

    const charAge = 6 + diceResults[0] + (diceResults[0] > 10 ? -10 : 0);
    const charBody = data.body.find((body) => diceResults[1] <= body.max);
    const charSpecialisation = data.specialisation.find((specialisation) => specialisation.roll == (diceResults[2]));
    const charWeapon = data.weapon.find((weapon) => diceResults[3] <= weapon.max);
    const charOutfit = data.outfit.find((outfit) => diceResults[4] <= outfit.max);
    const charPower = data.power.find((power) => diceResults[5] <= power.max);

    const charPerks = [];
    const charFinalPerks = [];
    const supportRoll1 = diceResults[6];
    const supportRoll2 = diceResults[7];
    const combatRoll1 = diceResults[8];
    const combatRoll2 = diceResults[9];
    const finalRoll = diceResults[10];

    const sMatch1 = data.perks.support.find((perks) => perks.roll == (supportRoll1));
    if (sMatch1) charPerks.push(sMatch1);
    const sMatch2 = data.perks.support.find((perks) => perks.roll == (supportRoll2));
    if (sMatch2) charPerks.push(sMatch2);
    const cMatch1 = data.perks.combat.find((perks) => perks.roll == (combatRoll1));
    if (cMatch1) charPerks.push(cMatch1);
    const cMatch2 = data.perks.combat.find((perks) => perks.roll == (combatRoll2));
    if (cMatch2) charPerks.push(cMatch2);
    const fMatch1 = data.perks.support.find((perks) => perks.roll == (finalRoll));
    if (fMatch1) charFinalPerks.push(fMatch1);
    const fMatch2 = data.perks.combat.find((perks) => perks.roll == (finalRoll));
    if (fMatch2) charFinalPerks.push(fMatch2);

    type TableRowConfig = {
      category: string;
      result: string | number;
      roll: string | number;
    };

    const tableRows: TableRowConfig[] = [
      { category: 'Age', result: charAge, roll: diceResults[0] },
      { category: 'Body', result: charBody?.name ?? '', roll: diceResults[1] },
      { category: 'Specialisation', result: charSpecialisation?.name ?? '', roll: diceResults[2] },
      { category: 'Weapon', result: charWeapon?.name ?? '', roll: diceResults[3] },
      { category: 'Outfit', result: charOutfit?.name ?? '', roll: diceResults[4] },
      { category: 'Power', result: charPower?.name ?? '', roll: diceResults[5] },
      {
        category: 'Perks',
        result: charPerks.map((p) => p?.name).filter(Boolean).join(', '),
        roll: diceResults.slice(6, 10).join(', ')
      },
      {
        category: 'Final Perks',
        result: charFinalPerks.map((p) => p?.name).filter(Boolean).join(', '),
        roll: diceResults[10]
      },
    ];

    return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Result</th>
                <th>Roll</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map(({ category, result, roll }) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{result}</td>
                  <td>{roll}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
};

export default Chargen;
