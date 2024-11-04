import {
  origins,
  outfits,
  weapons,
  specializations,
} from "@Character/BuildInformation";

import roll11D20 from "@Dice/RollD20";
import applyStatBonuses from "@Character/StatBonuses";
import GetBodyType from "@Helpers/GetBodyType";
import GetOwnedArtifacts from "@Helpers/GetOwnedArtifacts";
import GetPerks from "@Helpers/GetPerks";
import GetEquipment from "@Helpers/GetEquipment";

export const generateBuild = () => {
  const stats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };
  const diceRolls = roll11D20();

  const origin = origins[Math.floor(diceRolls[0] / 5)];

  const age = (diceRolls[1] > 10 ? diceRolls[1] - 10 : diceRolls[1]) + 6;

  const bodyType = GetBodyType(diceRolls[2]);
  applyStatBonuses(stats, bodyType.bonus);

  const outfit = GetEquipment(diceRolls[3], true);
  applyStatBonuses(stats, outfit.bonus);

  const weapon = GetEquipment(diceRolls[4], false);
  applyStatBonuses(stats, weapon.bonus);

  const specialization = specializations[diceRolls[5]];

  const perkDiceRolls = [
    diceRolls[6],
    diceRolls[7],
    diceRolls[8],
    diceRolls[9],
    diceRolls[10],
  ];
  const selectedPerks = GetPerks(perkDiceRolls);
  selectedPerks.forEach((perk) => applyStatBonuses(stats, perk.bonus));

  const ownedArtifacts = GetOwnedArtifacts(selectedPerks);

  return {
    origin,
    age,
    body: bodyType.name,
    outfit: outfit.name,
    weapon: weapon.name,
    specialization,
    stats,
    perks: selectedPerks.map((perk) => perk.name),
    ownedArtifacts,
    diceRolls,
  };
};
