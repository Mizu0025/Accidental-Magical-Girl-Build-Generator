import { data } from '../constants/data';
import './style.css';

interface BaseElement {
  name: string;
  description: string;
  bonus: string;
}

interface ElementByMaxRange extends BaseElement {
  max: number;
}

interface ElementByIndividualRoll extends BaseElement {
  roll: number;
}

interface CharGenState {
  diceResults: number[];
  charAge: number;
  charBody: ElementByMaxRange;
  charSpecialisation: ElementByIndividualRoll;
  charWeapon: ElementByMaxRange;
  charOutfit: ElementByMaxRange;
  charPower: ElementByMaxRange;
  charPerks: ElementByIndividualRoll[];
  charFinalPerks: ElementByIndividualRoll[];
}

const findCharAge = (roll: number) => 6 + roll + (roll > 10 ? -10 : 0);
const findByMax = (arr: any[], roll: number) => arr.find((item) => roll <= item.max);
const findSpecialisationRoll = (roll: number) => data.specialisation.find((specialisation) => specialisation.roll == roll);
const findPerks = (category: 'combat' | 'support', roll: number) => data.perks[category].find(p => p.roll == roll);
const assertFound: <T, >(result: T | undefined, message: string) => T = <T,>(result: T | undefined, message: string) => { if (result === undefined) throw new Error(message); return result; };

const calculatePerks = (dice: number[]) => {
  return {
    charPerks: [
      assertFound(findPerks('combat', dice[6]), 'Missing combat perk for roll ' + dice[6]),
      assertFound(findPerks('combat', dice[7]), 'Missing combat perk for roll ' + dice[7]),
      assertFound(findPerks('support', dice[8]), 'Missing support perk for roll ' + dice[8]),
      assertFound(findPerks('support', dice[9]), 'Missing support perk for roll ' + dice[9]),
      ],
    charFinalPerks: [
      assertFound(findPerks('combat', dice[10]), 'Missing combat perk for roll ' + dice[10]),
      assertFound(findPerks('support', dice[10]), 'Missing support perk for roll ' + dice[10]),
    ],
  }
};

const Chargen: React.FC<CharGenState> = () => {
  const diceResults: number[] = [];
  for (let i = 0; i < 11; i++) {
      diceResults.push(Math.floor(Math.random() * 20) + 1);
  }

  const charAge: number = findCharAge(diceResults[0]);
  const charBody: ElementByMaxRange = assertFound(findByMax(data.body, diceResults[1]), 'Missing body data for roll ' + diceResults[1]);
  const charSpecialisation: ElementByIndividualRoll = assertFound(findSpecialisationRoll(diceResults[2]), 'Missing specialisation data for roll ' + diceResults[2]);
  const charWeapon: ElementByMaxRange = assertFound(findByMax(data.weapon, diceResults[3]), 'Missing weapon data for roll ' + diceResults[3]);
  const charOutfit: ElementByMaxRange = assertFound(findByMax(data.outfit, diceResults[4]), 'Missing outfit data for roll ' + diceResults[4]);
  const charPower: ElementByMaxRange = assertFound(findByMax(data.power, diceResults[5]), 'Missing power data for roll ' + diceResults[5]);
  const { charPerks, charFinalPerks } = calculatePerks(diceResults);

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
      result: charFinalPerks
        .map((p) => p?.name)
        .filter(Boolean)
        .sort((a, b) => (a?.startsWith('Combat') ? -1 : 1))
        .join(' OR '),
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
