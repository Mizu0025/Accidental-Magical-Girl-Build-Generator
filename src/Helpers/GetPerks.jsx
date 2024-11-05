import { combatPerks, supportPerks } from "@Character/BuildInformation";

// Helper function to add a perk to selectedPerks if it's not already there
function addPerkToSelected(selectedPerks, perk) {
  if (!selectedPerks.includes(perk)) {
    selectedPerks.push(perk);
    return true;
  }
  return false;
}

// Helper function to get a perk from a table based on roll index
function getPerkFromTable(table, roll) {
  return table[roll % table.length];
}

// Handles duplicate perks by trying to add to the opposite table or any remaining perk
function handleDuplicatePerk(
  selectedPerks,
  primaryTable,
  secondaryTable,
  roll,
) {
  // Attempt to add from the opposite table
  const fallbackPerk = getPerkFromTable(secondaryTable, roll);
  if (addPerkToSelected(selectedPerks, fallbackPerk)) {
    return true;
  }
  // If both tables have the perk, assign any remaining available perk
  const availablePerks = [...leftPerkTable, ...rightPerkTable].filter(
    (p) => !selectedPerks.includes(p),
  );
  if (availablePerks.length > 0) {
    return addPerkToSelected(selectedPerks, availablePerks[0]);
  }
  return false;
}

// Function to assign a perk for a single roll
function assignSingleRoll(roll, selectedPerks, isLeftTable) {
  const primaryTable = isLeftTable ? combatPerks : supportPerks;
  const secondaryTable = isLeftTable ? supportPerks : combatPerks;

  // Get perk based on roll and try to add to selectedPerks
  const perk = getPerkFromTable(primaryTable, roll);
  if (!addPerkToSelected(selectedPerks, perk)) {
    // Handle duplicates by adding to the opposite table or selecting any remaining perk
    handleDuplicatePerk(selectedPerks, primaryTable, secondaryTable, roll);
  }
}

// Main function to assign perks based on rolls
function GetPerks(rolls) {
  const selectedPerks = [];

  for (let i = 0; i < rolls.length; i++) {
    const isLeftTable =
      i < 2 || (i === 4 && selectedPerks.length <= rolls.length / 2);
    assignSingleRoll(rolls[i], selectedPerks, isLeftTable);
  }

  return selectedPerks;
}

export default GetPerks;
