// StatDisplay.jsx
import React from "react";

const StatDisplay = ({ stats }) => (
  <div>
    <p>
      STR: {stats.STR}, AGI: {stats.AGI}, VIT: {stats.VIT}, MAG: {stats.MAG},
      LCK: {stats.LCK}
    </p>
  </div>
);

export default StatDisplay;
