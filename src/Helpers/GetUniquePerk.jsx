import { combatPerks, supportPerks } from "@Character/BuildInformation";

const getUniquePerk = (perkRoll, selectedPerks, isCombat) => {
  const perkGroup = isCombat ? combatPerks : supportPerks;
  let perk = perkGroup[perkRoll % perkGroup.length];

  // If the perk is a duplicate, switch to the other perk group
  if (selectedPerks.has(perk.name)) {
    perk = (isCombat ? supportPerks : combatPerks)[
      perkRoll % (isCombat ? supportPerks.length : combatPerks.length)
    ];
  }

  selectedPerks.add(perk.name); // Track selected perk to avoid duplicates
  return perk;
};

export default getUniquePerk;
