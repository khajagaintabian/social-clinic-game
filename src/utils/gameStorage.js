const STORAGE_KEY = 'socialClinicSave';

export const DEPARTMENTS = [
  'All',
  'Ego Department',
  'Gossip Department',
  'Drama Department',
  'Social Media Department',
  'Friendship Department',
];

export function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function createFreshDailySummary() {
  return {
    date: getTodayDateString(),
    casesHandled: 0,
    cured: 0,
    failed: 0,
    xpEarned: 0,
    reputationChange: 0,
    chaosGained: 0,
  };
}

export function normalizeDailySummary(summary) {
  if (!summary || summary.date !== getTodayDateString()) {
    return createFreshDailySummary();
  }
  return summary;
}

export const INITIAL_GAME_STATE = {
  xp: 0,
  reputation: 0,
  coins: 0,
  chaosPoints: 0,
  patientsCured: 0,
  patientReports: [],
  unlockedAchievements: [],
  lastPlayedCaseId: null,
  selectedDepartment: 'All',
  dailySummary: createFreshDailySummary(),
};

export function loadGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_GAME_STATE, dailySummary: createFreshDailySummary() };

    const parsed = JSON.parse(raw);
    return {
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      reputation: typeof parsed.reputation === 'number' ? parsed.reputation : 0,
      coins: typeof parsed.coins === 'number' ? parsed.coins : 0,
      chaosPoints: typeof parsed.chaosPoints === 'number' ? parsed.chaosPoints : 0,
      patientsCured: typeof parsed.patientsCured === 'number' ? parsed.patientsCured : 0,
      patientReports: Array.isArray(parsed.patientReports) ? parsed.patientReports : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements)
        ? parsed.unlockedAchievements
        : [],
      lastPlayedCaseId: typeof parsed.lastPlayedCaseId === 'number' ? parsed.lastPlayedCaseId : null,
      selectedDepartment: DEPARTMENTS.includes(parsed.selectedDepartment)
        ? parsed.selectedDepartment
        : 'All',
      dailySummary: normalizeDailySummary(parsed.dailySummary),
    };
  } catch {
    return { ...INITIAL_GAME_STATE, dailySummary: createFreshDailySummary() };
  }
}

export function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota or privacy errors
  }
}

export function clearGameStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}
