import { RANKS } from '../data/ranks';

export default function RankProgressScreen({ currentRank, xp, onBack }) {
  return (
    <div className="screen rank-screen">
      <header className="screen-header">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Back
        </button>
        <h2 className="screen-header__title">Rank Progress</h2>
        <span className="screen-header__spacer" />
      </header>

      <div className="rank-screen__summary card">
        <p>Total XP: <strong>{xp}</strong></p>
        <p>Current Rank: <strong>{currentRank.title}</strong></p>
      </div>

      <ol className="rank-list">
        {RANKS.map((rank) => {
          const isCurrent = rank.level === currentRank.level;
          const isUnlocked = xp >= rank.xpRequired;
          const nextRank = RANKS.find((r) => r.level === rank.level + 1);
          const xpNeeded = nextRank ? nextRank.xpRequired - xp : 0;

          return (
            <li
              key={rank.level}
              className={`rank-item card ${isCurrent ? 'rank-item--current' : ''} ${!isUnlocked ? 'rank-item--locked' : ''}`}
            >
              <div className="rank-item__header">
                <span className="rank-item__level">Lv. {rank.level}</span>
                <h3 className="rank-item__title">{rank.title}</h3>
                {isCurrent && <span className="rank-item__badge">Current</span>}
              </div>
              <p className="rank-item__xp">{rank.xpRequired} XP required</p>
              <p className="rank-item__unlock">{rank.unlockText}</p>
              {isCurrent && nextRank && (
                <p className="rank-item__next">
                  {xpNeeded > 0
                    ? `${xpNeeded} XP until ${nextRank.title}`
                    : 'Ready to promote!'}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
