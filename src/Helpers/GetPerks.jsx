import { combatPerks, supportPerks } from "@Character/BuildInformation";

export const GetPerks = (perkRolls) => {
  let perks = [];

  for (let i = 0; i < 5; i++) {
    const currentRoll = perkRolls[i];

    if (i <= 1) {
      perks.push(combatPerks[currentRoll]);
    } else if (i <= 3) {
      perks.push(supportPerks[currentRoll]);
    } else {
      Math.random() < 0.5
        ? perks.push(combatPerks[currentRoll])
        : perks.push(supportPerks[currentRoll]);
    }
  }

  return perks;
};

export default GetPerks;
