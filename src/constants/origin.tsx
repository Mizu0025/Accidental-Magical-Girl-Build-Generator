import { OriginBenefits } from '../types/origin';

export const Origin = {
  Contract: 'Contract',
  Smug: 'Smug',
  Weapon: 'Weapon',
  Bloodline: 'Bloodline',
  Emergency: 'Emergency',
  Artifact: 'Artifact',
  Death: 'Death',
};

export type Origin = typeof Origin[keyof typeof Origin];

const RawBenefits: Record<Origin, Partial<OriginBenefits>> = {
  [Origin.Contract]: { outfitPickFree: true, supportShiftFree: true },
  [Origin.Smug]: { freeChoiceSelect: true },
  [Origin.Weapon]: { weaponPickFree: true },
  [Origin.Bloodline]: { specialisationPickFree: true },
  [Origin.Emergency]: { combatShiftFree: true },
  [Origin.Artifact]: { extraArtifact: true },
  [Origin.Death]: {},
};

const DefaultBenefits: OriginBenefits = {
  freeChoiceSelect: false,
  weaponPickFree: false,
  outfitPickFree: false,
  specialisationPickFree: false,
  combatShiftFree: false,
  supportShiftFree: false,
  extraArtifact: false,
};

export const OriginBenefitsMap = Object.keys(RawBenefits).reduce((acc, key) => {
  const origin = key as Origin;
  acc[origin] = { ...DefaultBenefits, ...RawBenefits[origin] };
  return acc;
}, {} as Record<Origin, OriginBenefits>);


export const OriginDescription: Record<Origin, string> = {
  [Origin.Contract]: `A Contract! You're a good candidate, so they're more than happy to make an
 exception for your... well, you. You'll haggle a bit, but you're no preteen girl - you're
 not getting screwed by this, right?`,
  [Origin.Smug]: `Oh, you’re extra Smug. You might not be ideal but they’re more than willing to
  give you a little rope and watch what happens. But you're a smart and capable person.
  You're gonna own this little puffball. You can't possibly get the short end of the stick.`,
  [Origin.Weapon]: `Turns out that weapon you picked up recently isn’t as much as a display
  piece as you thought. It’s actually a magical weapon with a serious pedigree. Well, if
  you have this thing, you might as well put it to use fighting evil, right?`,
  [Origin.Bloodline]: `You might not be aware, but you’re actually related to a powerful
  magical girl. Well, it might not be by actual blood, but reincarnation or something,
  but your powers are probably similar, and the little critter wants your type of powers.`,
  [Origin.Emergency]: `The local girl is dead, missing, or captured, there’s a monster or
  five on the prowl right now, and you’re the best they could find. What? There’s no
  time to haggle! The danger is here RIGHT NOW!`,
  [Origin.Artifact]: `You bought, were gifted, or found a trinket recently. It didn't seem like anything more than it looked like, but it turns out it's actually a magical artifact of some
  sort! It'll be pretty useful, but since you can't use it until you transform...`,
  [Origin.Death]: `You schmuck. The local magical girl is dead, and it’s all your goddamn
  fault. It’s your responsibility to take over, and even if you’re not an ideal candidate by
  it’s standards, the Puchuu needs someone now, and isn’t taking ‘no’ for an answer.`,
};

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
