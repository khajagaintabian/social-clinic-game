import { getRankForXp } from './ranks';

export const ACHIEVEMENTS = [
  {
    id: 'first-diagnosis',
    title: 'First Diagnosis',
    description: 'Complete your first patient case.',
  },
  {
    id: 'society-intern',
    title: 'Society Intern',
    description: 'Fully cure 5 patients.',
  },
  {
    id: 'chaos-collector',
    title: 'Chaos Collector',
    description: 'Gain 10 chaos points.',
  },
  {
    id: 'reputation-doctor',
    title: 'Reputation Doctor',
    description: 'Reach 25 reputation.',
  },
  {
    id: 'common-sense-saver',
    title: 'Common Sense Saver',
    description: 'Earn 50 common sense coins.',
  },
  {
    id: 'department-explorer',
    title: 'Department Explorer',
    description: 'Complete at least one case from 3 different departments.',
  },
  {
    id: 'social-surgeon-candidate',
    title: 'Social Surgeon Candidate',
    description: 'Reach Social Surgeon rank.',
  },
  {
    id: 'humanity-needs-help',
    title: 'Humanity Needs Help',
    description: 'Fail 5 cases with both diagnosis and treatment wrong.',
  },
];

function countFullFailures(reports) {
  return reports.filter((report) => !report.diagnosisCorrect && !report.treatmentCorrect).length;
}

function countUniqueDepartments(reports) {
  const departments = new Set(
    reports.map((report) => report.department).filter(Boolean),
  );
  return departments.size;
}

function getAchievementChecks(state) {
  const rank = getRankForXp(state.xp);

  return {
    'first-diagnosis': state.patientReports.length >= 1,
    'society-intern': state.patientsCured >= 5,
    'chaos-collector': state.chaosPoints >= 10,
    'reputation-doctor': state.reputation >= 25,
    'common-sense-saver': state.coins >= 50,
    'department-explorer': countUniqueDepartments(state.patientReports) >= 3,
    'social-surgeon-candidate': rank.level >= 5,
    'humanity-needs-help': countFullFailures(state.patientReports) >= 5,
  };
}

export function evaluateNewAchievements(state) {
  const checks = getAchievementChecks(state);
  const unlocked = new Set(state.unlockedAchievements ?? []);

  return ACHIEVEMENTS.filter(
    (achievement) => !unlocked.has(achievement.id) && checks[achievement.id],
  );
}

export function getAchievementById(id) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
