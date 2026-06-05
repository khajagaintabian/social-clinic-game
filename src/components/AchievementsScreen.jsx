import { ACHIEVEMENTS } from '../data/achievements';

export default function AchievementsScreen({ unlockedAchievements, onBack }) {
  const unlockedSet = new Set(unlockedAchievements);
  const unlockedCount = ACHIEVEMENTS.filter((achievement) => unlockedSet.has(achievement.id)).length;

  return (
    <div className="screen achievements-screen">
      <header className="screen-header">
        <h2 className="screen-header__title">Achievements</h2>
        <span className="screen-header__spacer" aria-hidden="true" />
      </header>

      <p className="achievements-screen__intro">
        Milestones for doctors who tried their best. Society is still unstable.
      </p>

      <div className="achievements-screen__summary card">
        <span className="achievements-screen__count">
          {unlockedCount} / {ACHIEVEMENTS.length} unlocked
        </span>
      </div>

      <ul className="achievements-list">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedSet.has(achievement.id);

          return (
            <li
              key={achievement.id}
              className={`achievement-card card${isUnlocked ? ' achievement-card--unlocked' : ' achievement-card--locked'}`}
            >
              <div className="achievement-card__header">
                <span className="achievement-card__icon" aria-hidden="true">
                  {isUnlocked ? '🏆' : '🔒'}
                </span>
                <div>
                  <h3 className="achievement-card__title">{achievement.title}</h3>
                  <p className="achievement-card__description">{achievement.description}</p>
                </div>
              </div>
              <span
                className={`achievement-card__status${isUnlocked ? ' achievement-card__status--unlocked' : ' achievement-card__status--locked'}`}
              >
                {isUnlocked ? 'Unlocked' : 'Locked'}
              </span>
            </li>
          );
        })}
      </ul>

      <button type="button" className="btn btn--primary btn--large" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
