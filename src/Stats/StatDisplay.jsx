// StatDisplay.jsx
import React from "react";

const StatDisplay = ({ stats }) => (
  <div>
    STR: {stats.STR}, AGI: {stats.AGI}, VIT: {stats.VIT}, MAG: {stats.MAG}, LCK:{" "}
    {stats.LCK}
  </div>
);

export default StatDisplay;
