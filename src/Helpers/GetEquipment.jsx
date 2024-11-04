import { outfits, weapons } from "@Character/BuildInformation";

const GetEquipment = (diceRoll, isOutfit) => {
  const equipment = isOutfit ? outfits : weapons;
  let selectedOption;

  if (diceRoll <= 4) {
    selectedOption = equipment[0]; // Option 1
  } else if (diceRoll <= 9) {
    selectedOption = equipment[1]; // Option 2
  } else if (diceRoll <= 14) {
    selectedOption = equipment[2]; // Option 3
  } else {
    selectedOption = equipment[3]; // Option 4
  }

  return selectedOption;
};

export default GetEquipment;
