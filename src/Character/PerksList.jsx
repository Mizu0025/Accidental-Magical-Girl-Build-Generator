// PerksList.jsx
import React from "react";

const PerksList = ({ perks }) => (
  <ul>
    {perks.map((perk, index) => (
      <li key={index}>{perk}</li>
    ))}
  </ul>
);

export default PerksList;
