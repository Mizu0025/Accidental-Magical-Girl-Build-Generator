import { origins, specializations } from "@Character/BuildInformation";

import Roll11D20 from "@Dice/RollD20";
import ApplyStatBonuses from "@Stats/StatBonuses";
import GetBodyType from "@Helpers/GetBodyType";
import GetOwnedArtifacts from "@Helpers/GetOwnedArtifacts";
import GetPerks from "@Helpers/GetPerks";
import GetEquipment from "@Helpers/GetEquipment";
import GetPower from "@Helpers/GetPower";

export const generateBuild = () => {
  const stats = { STR: 4, AGI: 4, VIT: 4, MAG: 4, LCK: 4 };
  const diceRolls = Roll11D20();

  const origin = origins[Math.floor(Math.random() * origins.length)];

  const ageRoll = diceRolls[0] + 1;
  const age = (ageRoll > 10 ? ageRoll - 10 : ageRoll) + 6;

  const bodyType = GetBodyType(diceRolls[1]);
  ApplyStatBonuses(stats, bodyType.bonus);

  const specialization = specializations[diceRolls[2]];

  const weapon = GetEquipment(diceRolls[3], false);
  ApplyStatBonuses(stats, weapon.bonus);

  const outfit = GetEquipment(diceRolls[4], true);
  ApplyStatBonuses(stats, outfit.bonus);

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
    diceRolls: diceRolls.map((roll) => roll + 1),
  };
};
