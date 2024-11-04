import { body } from "@Character/BuildInformation";

const GetBodyType = (inputNumber) => {
  let selectedOption;

  if (inputNumber <= 5) {
    selectedOption = body[0];
  } else if (inputNumber <= 13) {
    selectedOption = body[1];
  } else {
    selectedOption = body[2];
  }

  return selectedOption;
};

export default GetBodyType;
