import { useState } from "react";
import CharacterResults from "../chargen";
import "./style.css";
import MagicalCurrency from "../currency";
import { OriginName } from "../types/origin";
import Origin from '../origin';

const generateCharacterRolls = (): number[] => {
  const rolls: number[] = [];
  for (let i = 0; i < 11; i++) {
    rolls.push(Math.floor(Math.random() * 20) + 1);
  }
  return rolls;
};

const Form = () => {
  const [diceRolls, setDiceRolls] = useState<number[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<OriginName>();

  const handleClick = () => {
    const newRolls = generateCharacterRolls();
    setDiceRolls(newRolls);
  };
  let displayResults = diceRolls.length > 0;

  return (
    <div className="form-container">
      {displayResults && !!selectedOrigin && <MagicalCurrency origin={selectedOrigin} />}
      <Origin onSelect={setSelectedOrigin} />
      <div className="button-wrapper">
        <button onClick={handleClick} disabled={!selectedOrigin}>Generate Character</button>
      </div>
      {displayResults && <CharacterResults diceRolls={diceRolls} />}
    </div>
  );
};

export default Form;
