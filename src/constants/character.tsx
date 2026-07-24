import type { CharacterGeneration } from "../types/character";
import { characterBody } from "./characterBody";
import { characterCombatPerks } from "./characterCombatPerks";
import { characterOutfit } from "./characterOutfit";
import { characterPower } from "./characterPower";
import { characterSpecialisation } from "./characterSpecialisation";
import { characterSupportPerks } from "./characterSupportPerks";
import { characterWeapon } from "./characterWeapon";

export const CharGenData: CharacterGeneration = {
	body: characterBody,
	specialisation: characterSpecialisation,
	weapon: characterWeapon,
	outfit: characterOutfit,
	power: characterPower,
	perks: {
		combat: characterCombatPerks,
		support: characterSupportPerks,
	},
};
