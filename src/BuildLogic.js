import { origins, specializations } from "@Character/BuildInformation";

import Roll11D20 from "@Dice/RollD20";
import ApplyStatBonuses from "@Character/StatBonuses";
import GetBodyType from "@Helpers/GetBodyType";
import GetOwnedArtifacts from "@Helpers/GetOwnedArtifacts";
import GetPerks from "@Helpers/GetPerks";
import GetEquipment from "@Helpers/GetEquipment";
import GetPower from "@Helpers/GetPower";

export const generateBuild = () => {
  const stats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };
  const diceRolls = Roll11D20();

  const origin = origins[Math.floor(Math.random() * origins.length)];

  const age =
    (diceRolls[0] > 10 ? diceRolls[0] + 1 - 10 : diceRolls[0] + 1) + 6;

  const bodyType = GetBodyType(diceRolls[1]);
  ApplyStatBonuses(stats, bodyType.bonus);

  const specialization = specializations[diceRolls[2]];

  const outfit = GetEquipment(diceRolls[3], true);
  ApplyStatBonuses(stats, outfit.bonus);

  const weapon = GetEquipment(diceRolls[4], false);
  ApplyStatBonuses(stats, weapon.bonus);

  const power = GetPower(diceRolls[5]);
  ApplyStatBonuses(stats, power.bonus);

  const perkDiceRolls = [
    diceRolls[6],
    diceRolls[7],
    diceRolls[8],
    diceRolls[9],
    diceRolls[10],
  ];
  const selectedPerks = GetPerks(perkDiceRolls);
  selectedPerks.forEach((perk) => ApplyStatBonuses(stats, perk.bonus));

  const ownedArtifacts = GetOwnedArtifacts(selectedPerks);

  return {
    origin,
    age,
    body: bodyType.name,
    outfit: outfit.name,
    weapon: weapon.name,
    specialization,
    power: power.name,
    stats,
    perks: selectedPerks.map((perk) => perk.name),
    ownedArtifacts,
    diceRolls,
  };
};
