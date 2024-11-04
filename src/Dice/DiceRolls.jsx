import React from "react";

const DiceRolls = ({ rolls }) => {
  // Map the rolls to incremented values for display (1 to 20)
  const displayedRolls = rolls.map((roll) => roll + 1);

  return <div>{displayedRolls.join(", ")}</div>;
};

export default DiceRolls;
