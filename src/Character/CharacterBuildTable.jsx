// CharacterBuildTable.jsx
import React from "react";
import StatDisplay from "./StatDisplay";
import PerksList from "./PerksList";
import DiceRolls from "../Dice/DiceRolls";

const CharacterBuildTable = ({ build }) => (
  <table>
    <tbody>
      <tr>
        <td>Origin</td>
        <td>{build.origin}</td>
      </tr>
      <tr>
        <td>Age</td>
        <td>{build.age}</td>
      </tr>
      <tr>
        <td>Body</td>
        <td>{build.body}</td>
      </tr>
      <tr>
        <td>Outfit</td>
        <td>{build.outfit}</td>
      </tr>
      <tr>
        <td>Weapon</td>
        <td>{build.weapon}</td>
      </tr>
      <tr>
        <td>Specialization</td>
        <td>{build.specialization}</td>
      </tr>
      <tr>
        <td>Perks</td>
        <td>
          <PerksList perks={build.perks} />
        </td>
      </tr>
      <tr>
        <td>Artifacts</td>
        <td>{build.artifact}</td>
      </tr>
      <tr>
        <td>Stats</td>
        <td>
          <StatDisplay stats={build.stats} />
        </td>
      </tr>
      <tr>
        <td>Dice Rolls</td>
        <td>
          <DiceRolls rolls={build.diceRolls} />
        </td>
      </tr>
    </tbody>
  </table>
);

export default CharacterBuildTable;
