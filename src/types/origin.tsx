import type { Origin } from "../constants/origin";

export interface OriginBenefits {
	freeChoiceSelect: boolean;
	weaponPickFree: boolean;
	outfitPickFree: boolean;
	specialisationPickFree: boolean;
	combatShiftFree: boolean;
	supportShiftFree: boolean;
	extraArtifact: boolean;
}

export type OriginChoice = Record<
	Origin,
	{ label: string; description: string }
>;

export type OriginName =
	| "Contract"
	| "Smug"
	| "Weapon"
	| "Bloodline"
	| "Emergency"
	| "Artifact"
	| "Death";
