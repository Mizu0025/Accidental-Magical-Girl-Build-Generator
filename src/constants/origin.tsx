import { OriginName, OriginRuleDefinition, OriginFieldName } from '../types/origin';

export const originRules: Record<OriginName, OriginRuleDefinition> = {
  'Contract':  { gold: 1, silver: 3, bronze: 4, simple: { outfit: true }, supportShiftFree: true },
  'Smug':      { gold: 0, silver: 2, bronze: 3, allFree: true },
  'Weapon':    { gold: 1, silver: 3, bronze: 4, simple: { weapon: true }, bonusStat: 'weapon' },
  'Bloodline': { gold: 1, silver: 3, bronze: 4, simple: { specialization: true }, bonusStat: 'specialisation' },
  'Emergency': { gold: 1, silver: 3, bronze: 4, simple: { combatPerk1: true, combatPerk2: true }, combatShiftFree: true },
  'Artifact':  { gold: 1, silver: 3, bronze: 4, extraArtifact: true },
  'Death':     { gold: 1, silver: 4, bronze: 4 }
};

export const originFields: Record<OriginName, OriginFieldName[]> = {
  'Contract':  ['outfit-select'],
  'Smug':      [],
  'Weapon':    ['weapon-select'],
  'Bloodline': ['spec-select'],
  'Emergency': ['e-perk1-select', 'e-perk2-select'],
  'Artifact':  ['artifact-select'],
  'Death':     []
};
