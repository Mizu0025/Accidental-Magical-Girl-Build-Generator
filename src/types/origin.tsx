interface OriginBudget {
  gold: number;
  silver: number;
  bronze: number;
}

interface SimpleOverrides {
  [key: string]: boolean
}

export interface OriginRuleDefinition extends OriginBudget {
  simple?: SimpleOverrides;
  allFree?: boolean;
  bonusStat?: 'weapon' | 'specialisation';
  combatShiftFree?: boolean;
  supportShiftFree?: boolean;
  extraArtifact?: boolean;
}

export type OriginName = 'Contract' | 'Smug' | 'Weapon' | 'Bloodline' | 'Emergency' | 'Artifact' | 'Death';

export type OriginFieldName = 'outfit-select' | 'weapon-select' | 'spec-select' | 'e-perk1-select' | 'e-perk2-select' | 'artifact-select';
