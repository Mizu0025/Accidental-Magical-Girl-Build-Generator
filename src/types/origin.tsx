export interface OriginBenefits {
	freeChoiceSelect: boolean;
	weaponPickFree: boolean;
	outfitPickFree: boolean;
	specialisationPickFree: boolean;
	combatShiftFree: boolean;
	supportShiftFree: boolean;
	extraArtifact: boolean;
}

export type OriginName =
	| "Contract"
	| "Smug"
	| "Weapon"
	| "Bloodline"
	| "Emergency"
	| "Artifact"
	| "Death";
