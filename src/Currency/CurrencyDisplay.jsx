import React from "react";

const CurrencyDisplay = ({ coins }) => (
  <div>
    <p>
      Gold: {coins.gold}, Silver: {coins.silver}, Bronze: {coins.bronze}
    </p>
  </div>
);

export default CurrencyDisplay;
