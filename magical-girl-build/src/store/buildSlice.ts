import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  startingInfo,
  calcBaseAge,
  applyAgeModifier,
  getBodyCategory,
  getWeaponEntry,
  getOutfitEntry,
  getPowerEntry,
  rollPerkId,
} from '../data';
import type { BuildState, CoinTier } from '../types/buildTypes';

const initialState: BuildState = {
  startingInfo,
  age: { coinTier: 'none', diceRoll: 0, calculatedAge: 0 },
  bodyType: { coinTier: 'none', diceRoll: 0, category: null, bonusChoice: null },
  specialization: { coinTier: 'none', diceRoll: 0, specializationId: null },
  weapon: { coinTier: 'none', diceRoll: 0, primaryWeapon: null, secondaryWeapon: null },
  outfit: { coinTier: 'none', diceRoll: 0, outfit: null },
  power: { coinTier: 'none', diceRoll: 0, power: null, secondaryPower: null },
  perks: { combatPerks: [], supportPerks: [] },
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const buildSlice = createSlice({
  name: 'build',
  initialState,
  reducers: {
    setCoinTier(state, action: PayloadAction<{ category: string; tier: CoinTier }>) {
      const { category, tier } = action.payload;
      if (state.age) (state.age as any).coinTier = tier;
      if (state.bodyType) (state.bodyType as any).coinTier = tier;
      if (state.specialization) (state.specialization as any).coinTier = tier;
      if (state.weapon) (state.weapon as any).coinTier = tier;
      if (state.outfit) (state.outfit as any).coinTier = tier;
      if (state.power) (state.power as any).coinTier = tier;
    },

    rollAge(state) {
      const roll = randomInt(1, 20);
      state.age.diceRoll = roll;
      const baseAge = calcBaseAge(roll);
      const { calculatedAge } = applyAgeModifier(baseAge, state.age.coinTier);
      state.age.calculatedAge = calculatedAge;
    },

    rollBodyType(state) {
      const roll = randomInt(1, 20);
      state.bodyType.diceRoll = roll;
      state.bodyType.category = getBodyCategory(roll);
      state.bodyType.bonusChoice = null; // manual selection in UI
    },

    rollSpecialization(state) {
      const roll = randomInt(1, 20);
      state.specialization.diceRoll = roll;
      state.specialization.specializationId = roll;
    },

    rollWeapon(state) {
      const roll = randomInt(1, 20);
      state.weapon.diceRoll = roll;
      const entry = getWeaponEntry(roll);
      state.weapon.primaryWeapon = {
        name: entry.name,
        description: entry.description,
        statBonus: entry.statBonus,
      };

      // Gold gets a second weapon
      if (state.weapon.coinTier === 'gold') {
        const roll2 = randomInt(1, 20);
        const entry2 = getWeaponEntry(roll2);
        state.weapon.secondaryWeapon = {
          name: entry2.name,
          description: entry2.description,
          statBonus: entry2.statBonus,
        };
      }
    },

    rollOutfit(state) {
      const roll = randomInt(1, 20);
      state.outfit.diceRoll = roll;
      const entry = getOutfitEntry(roll);
      state.outfit.outfit = {
        name: entry.name,
        description: entry.description,
        statBonus: entry.statBonus,
      };
    },

    rollPower(state) {
      const roll = randomInt(1, 20);
      state.power.diceRoll = roll;
      const entry = getPowerEntry(roll);
      state.power.power = {
        name: entry.name,
        description: entry.description,
        statBonus: entry.notes,
      };

      // Gold gets a second power
      if (state.power.coinTier === 'gold') {
        const roll2 = randomInt(1, 20);
        const entry2 = getPowerEntry(roll2);
        state.power.secondaryPower = {
          name: entry2.name,
          description: entry2.description,
          statBonus: entry2.notes,
        };
      }
    },

    rollAll(state) {
      // Roll age (uses bronze tier for coin modifiers)
      const roll1 = randomInt(1, 20);
      state.age.diceRoll = roll1;
      const baseAge = calcBaseAge(roll1);
      state.age.calculatedAge = applyAgeModifier(baseAge, state.age.coinTier).calculatedAge;

      // Roll body type (uses bronze tier)
      const roll2 = randomInt(1, 20);
      state.bodyType.diceRoll = roll2;
      state.bodyType.category = getBodyCategory(roll2);

      // Roll specialization (uses bronze tier)
      const roll3 = randomInt(1, 20);
      state.specialization.diceRoll = roll3;
      state.specialization.specializationId = roll3;

      // Roll weapon
      const roll4 = randomInt(1, 20);
      state.weapon.diceRoll = roll4;
      state.weapon.primaryWeapon = getWeaponEntry(roll4);

      if (state.weapon.coinTier === 'gold') {
        const roll5 = randomInt(1, 20);
        state.weapon.secondaryWeapon = getWeaponEntry(roll5);
      }

      // Roll outfit
      const roll6 = randomInt(1, 20);
      state.outfit.diceRoll = roll6;
      state.outfit.outfit = getOutfitEntry(roll6);

      // Roll power
      const roll7 = randomInt(1, 20);
      state.power.diceRoll = roll7;
      state.power.power = getPowerEntry(roll7);

      if (state.power.coinTier === 'gold') {
        const roll8 = randomInt(1, 20);
        state.power.secondaryPower = getPowerEntry(roll8);
      }
    },

    resetBuild() {
      // Keep startingInfo but clear everything else
      return {
        ...initialState,
        startingInfo,
      };
    },
  },
});

export const { actions, reducer } = buildSlice;
