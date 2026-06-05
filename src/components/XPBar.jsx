export default function XPBar({ currentXp, xpIntoRank, xpNeeded, progress, nextRankTitle }) {
  return (
    <div className="xp-bar">
      <div className="xp-bar__header">
        <span className="xp-bar__label">Experience</span>
        <span className="xp-bar__value">
          {nextRankTitle
            ? `${xpIntoRank} / ${xpNeeded} XP`
            : `${currentXp} XP — MAX RANK`}
        </span>
      </div>
      <div className="xp-bar__track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="xp-bar__fill" style={{ width: `${progress}%` }} />
      </div>
      {nextRankTitle && (
        <p className="xp-bar__next">Next: {nextRankTitle}</p>
      )}
    </div>
  );
}
