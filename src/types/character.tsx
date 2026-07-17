export interface BaseElement {
  name: string;
  description: string;
  bonus: string;
}

export interface ElementByMaxRange extends BaseElement {
  max: number;
}

export interface ElementByIndividualRoll extends BaseElement {
  roll: number;
}

export interface CharacterGeneration {
  body: ElementByMaxRange[];
  specialisation: ElementByIndividualRoll[];
  weapon: ElementByMaxRange[];
  outfit: ElementByMaxRange[];
  power: ElementByMaxRange[];
  perks: { combat: ElementByIndividualRoll[]; support: ElementByIndividualRoll[] };
}
