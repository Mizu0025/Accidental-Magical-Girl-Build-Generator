import { powers } from "@Character/BuildInformation";

const GetPower = (diceRoll) => {
  const index = Math.min(Math.floor(diceRoll / 2), powers.length - 1);
  return powers[index];
};

export default GetPower;
