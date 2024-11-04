import {
  origins,
  outfits,
  weapons,
  specializations,
  artifacts,
} from "@Character/BuildInformation";

import roll11D20 from "@Dice/RollD20";
import applyStatBonuses from "@Character/StatBonuses";
import getBodyType from "@Helpers/GetBodyType";
import getUniquePerk from "@Helpers/GetUniquePerk";

export const generateBuild = () => {
  const stats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };
  const diceRolls = roll11D20();

  const origin = origins[Math.floor((diceRolls[0] - 1) / 5)];
  const age = (diceRolls[1] > 10 ? diceRolls[1] - 10 : diceRolls[1]) + 6;
  const bodyType = getBodyType(diceRolls[2]);
  applyStatBonuses(stats, bodyType.bonus);

  const outfit = outfits[Math.floor((diceRolls[3] - 1) / 5)];
  applyStatBonuses(stats, outfit.bonus);

  const weapon = weapons[Math.floor((diceRolls[4] - 1) / 5)];
  applyStatBonuses(stats, weapon.bonus);

  const specialization = specializations[diceRolls[5] - 1];
  const perks = new Set();
  const selectedPerks = [
    getUniquePerk(diceRolls[6], perks, true),
    getUniquePerk(diceRolls[7], perks, true),
    getUniquePerk(diceRolls[8], perks, false),
    getUniquePerk(diceRolls[9], perks, false),
    getUniquePerk(diceRolls[10], perks, diceRolls[0] <= 10),
  ];

  selectedPerks.forEach((perk) => applyStatBonuses(stats, perk.bonus));
  const artifact = artifacts.includes(selectedPerks.name)
    ? selectedPerks.name
    : "None";

  return {
    origin,
    age,
    body: bodyType.name,
    outfit: outfit.name,
    weapon: weapon.name,
    specialization,
    stats,
    perks: selectedPerks.map((perk) => perk.name),
    artifact,
    diceRolls,
  };
};
