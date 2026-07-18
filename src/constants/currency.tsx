import { Origin } from "./origin";

export type Currency = { gold: number; silver: number; bronze: number };

export const OriginCurrency: Record<Origin, Currency> = {
  [Origin.Contract]: { gold: 1, silver: 3, bronze: 4 },
  [Origin.Smug]: { gold: 0, silver: 2, bronze: 3 },
  [Origin.Weapon]: { gold: 1, silver: 3, bronze: 4 },
  [Origin.Bloodline]: { gold: 1, silver: 3, bronze: 4 },
  [Origin.Emergency]: { gold: 1, silver: 3, bronze: 4 },
  [Origin.Artifact]: { gold: 1, silver: 3, bronze: 4 },
  [Origin.Death]: { gold: 1, silver: 4, bronze: 4 },
};
