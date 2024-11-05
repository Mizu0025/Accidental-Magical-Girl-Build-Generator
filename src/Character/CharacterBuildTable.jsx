// CharacterBuildTable.jsx
import React from "react";
import StatDisplay from "@Stats/StatDisplay";
import PerksList from "./PerksList";
import DiceRolls from "@Dice/DiceRolls";
import "./CharacterBuildTable.css";

const CharacterBuildTable = ({ build }) => {
  const rows = [
    { label: "Origin", value: build.origin },
    { label: "Age", value: build.age, roll: build.diceRolls[0] },
    { label: "Body", value: build.body, roll: build.diceRolls[1] },
    { label: "Outfit", value: build.outfit, roll: build.diceRolls[2] },
    { label: "Weapon", value: build.weapon, roll: build.diceRolls[3] },
    {
      label: "Specialization",
      value: build.specialization,
      roll: build.diceRolls[4],
    },
    { label: "Power", value: build.power, roll: build.diceRolls[5] },
    {
      label: "Perks",
      value: <PerksList perks={build.perks} />,
      roll: [
        build.diceRolls[6],
        build.diceRolls[7],
        build.diceRolls[8],
        build.diceRolls[9],
        build.diceRolls[10],
      ].join(", "),
    },
    {
      label: "Artifacts",
      value: build.ownedArtifacts,
    },
    { label: "Stats", value: <StatDisplay stats={build.stats} /> },
    // { label: "Dice Rolls", value: <DiceRolls rolls={build.diceRolls} /> },
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>Character</th>
          <th>Result</th>
          <th>DiceRoll</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ label, value, roll }, index) => (
          <tr key={index}>
            <td>{label}</td>
            <td>{value}</td>
            <td>{roll}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CharacterBuildTable;
