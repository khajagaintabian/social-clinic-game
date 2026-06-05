import StatCard from './StatCard';
import XPBar from './XPBar';

export default function ClinicScreen({
  rank,
  xpProgress,
  reputation,
  coins,
  chaosPoints,
  patientsCured,
  onCallPatient,
  onRankProgress,
  onHome,
}) {
  return (
    <div className="screen clinic-screen">
      <header className="screen-header">
        <button type="button" className="btn btn--ghost" onClick={onHome}>
          ← Home
        </button>
        <h2 className="screen-header__title">Clinic Floor</h2>
        <button type="button" className="btn btn--ghost" onClick={onRankProgress}>
          Ranks
        </button>
      </header>

      <div className="clinic-screen__rank card card--accent">
        <span className="clinic-screen__rank-label">Current Rank</span>
        <span className="clinic-screen__rank-title">{rank.title}</span>
      </div>

      <XPBar
        currentXp={xpProgress.current.xpRequired + xpProgress.xpIntoRank}
        xpIntoRank={xpProgress.xpIntoRank}
        xpNeeded={xpProgress.xpNeeded}
        progress={xpProgress.progress}
        nextRankTitle={xpProgress.next?.title}
      />

      <div className="stats-grid">
        <StatCard label="Reputation" value={reputation} icon="⭐" variant="reputation" />
        <StatCard label="Common Sense Coins" value={coins} icon="🪙" variant="coins" />
        <StatCard label="Chaos Points" value={chaosPoints} icon="💥" variant="chaos" />
        <StatCard label="Patients Cured" value={patientsCured} icon="✅" variant="cured" />
      </div>

      <div className="clinic-screen__waiting card">
        <p className="clinic-screen__waiting-text">
          The waiting room is full of people who think their problems are unique documentaries.
        </p>
        <button type="button" className="btn btn--primary btn--large" onClick={onCallPatient}>
          Call Next Patient
        </button>
      </div>
    </div>
  );
}
