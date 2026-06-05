import StatCard from './StatCard';
import XPBar from './XPBar';
import { DEPARTMENT_OPTIONS } from '../data/patientCases';

function formatSigned(value) {
  if (value > 0) return `+${value}`;
  return String(value);
}

export default function ClinicScreen({
  rank,
  xpProgress,
  reputation,
  coins,
  chaosPoints,
  patientsCured,
  dailySummary,
  selectedDepartment,
  departmentHasPatients,
  onDepartmentChange,
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

      <div className="daily-summary card">
        <h3 className="daily-summary__title">Today&apos;s Clinic Summary</h3>
        <div className="daily-summary__grid">
          <div className="daily-summary__item">
            <span className="daily-summary__value">{dailySummary.casesHandled}</span>
            <span className="daily-summary__label">Cases</span>
          </div>
          <div className="daily-summary__item">
            <span className="daily-summary__value daily-summary__value--success">
              {dailySummary.cured}
            </span>
            <span className="daily-summary__label">Cured</span>
          </div>
          <div className="daily-summary__item">
            <span className="daily-summary__value daily-summary__value--fail">
              {dailySummary.failed}
            </span>
            <span className="daily-summary__label">Failed</span>
          </div>
          <div className="daily-summary__item">
            <span className="daily-summary__value">+{dailySummary.xpEarned}</span>
            <span className="daily-summary__label">XP</span>
          </div>
          <div className="daily-summary__item">
            <span className="daily-summary__value">
              {formatSigned(dailySummary.reputationChange)}
            </span>
            <span className="daily-summary__label">Rep</span>
          </div>
          <div className="daily-summary__item">
            <span className="daily-summary__value daily-summary__value--chaos">
              +{dailySummary.chaosGained}
            </span>
            <span className="daily-summary__label">Chaos</span>
          </div>
        </div>
      </div>

      <div className="department-filter">
        <span className="department-filter__label">Department</span>
        <div className="department-filter__chips" role="group" aria-label="Department filter">
          {DEPARTMENT_OPTIONS.map((dept) => (
            <button
              key={dept}
              type="button"
              className={`department-chip${selectedDepartment === dept ? ' department-chip--active' : ''}`}
              onClick={() => onDepartmentChange(dept)}
            >
              {dept === 'All' ? 'All' : dept.replace(' Department', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="clinic-screen__waiting card">
        <p className="clinic-screen__waiting-text">
          The waiting room is full of people who think their problems are unique documentaries.
        </p>

        {!departmentHasPatients && (
          <p className="clinic-screen__empty-dept">
            No unlocked patients in this department yet. Society is still hiding the good problems.
          </p>
        )}

        <button
          type="button"
          className="btn btn--primary btn--large"
          onClick={onCallPatient}
          disabled={!departmentHasPatients}
        >
          Call Next Patient
        </button>
      </div>
    </div>
  );
}
