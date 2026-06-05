export const RANKS = [
  {
    level: 1,
    title: 'Clinic Intern',
    xpRequired: 0,
    unlockText: 'You can now admit patients who think lunch needs an audience.',
  },
  {
    level: 2,
    title: 'Social Nurse',
    xpRequired: 100,
    unlockText: 'Unlocked: advanced gossip triage and ego bandaging.',
  },
  {
    level: 3,
    title: 'Behavior Doctor',
    xpRequired: 250,
    unlockText: 'Licensed to prescribe reality checks in small, painful doses.',
  },
  {
    level: 4,
    title: 'Common Sense Consultant',
    xpRequired: 500,
    unlockText: 'Patients now trust you to explain what "mind your business" means.',
  },
  {
    level: 5,
    title: 'Social Surgeon',
    xpRequired: 900,
    unlockText: 'You may perform emergency drama removals without anesthesia.',
  },
  {
    level: 6,
    title: 'Chief Social Surgeon',
    xpRequired: 1400,
    unlockText: 'Maximum rank. Society still unstable, but your clipboard looks important.',
  },
];

export function getRankForXp(xp) {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.xpRequired) current = rank;
  }
  return current;
}

export function getNextRank(xp) {
  const current = getRankForXp(xp);
  return RANKS.find((r) => r.level === current.level + 1) ?? null;
}

export function getXpProgress(xp) {
  const current = getRankForXp(xp);
  const next = getNextRank(xp);
  if (!next) {
    return { current, next: null, progress: 100, xpIntoRank: xp - current.xpRequired, xpNeeded: 0 };
  }
  const xpIntoRank = xp - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  const progress = Math.min(100, Math.round((xpIntoRank / xpNeeded) * 100));
  return { current, next, progress, xpIntoRank, xpNeeded };
}
