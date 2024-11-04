import { artifacts } from "@Character/BuildInformation";

const GetOwnedArtifacts = (selectedPerks) => {
  let perkArtifacts = [];

  selectedPerks.forEach((perk) => {
    if (artifacts.includes(perk.name)) {
      perkArtifacts.push(perk.name);
    }
  });

  return perkArtifacts.length > 0 ? perkArtifacts.join(", ") : "None";
};

export default GetOwnedArtifacts;
