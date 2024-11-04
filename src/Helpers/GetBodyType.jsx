import { body } from "@Character/BuildInformation";

const getBodyType = (inputNumber) => {
  let selectedOption;

  if (inputNumber >= 1 && inputNumber <= 6) {
    selectedOption = body[0]; // Option 1
  } else if (inputNumber >= 7 && inputNumber <= 14) {
    selectedOption = body[1]; // Option 2
  } else {
    selectedOption = body[2]; // Option 3
  }

  return selectedOption;
};

export default getBodyType;
