import { useState } from "react";
import CharacterResults from "../chargen";
import "./style.css";

const generateCharacterRolls = (): number[] => {
  const rolls: number[] = [];
  for (let i = 0; i < 11; i++) {
    rolls.push(Math.floor(Math.random() * 20) + 1);
  }
  return rolls;
};

const Form = () => {
  const [diceRolls, setDiceRolls] = useState<number[]>([]);

  const handleClick = () => {
    const newRolls = generateCharacterRolls();
    setDiceRolls(newRolls);
  };

  return (
    <div className="form-container">
      <h1>Select Origin</h1>
      <div className="button-wrapper">
        <button onClick={handleClick}>Generate Character</button>
      </div>
      {diceRolls.length > 0 && <CharacterResults diceRolls={diceRolls} />}
    </div>
  );
};

export default Form;
