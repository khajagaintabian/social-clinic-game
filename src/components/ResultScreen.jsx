import StatCard from './StatCard';

export default function ResultScreen({ result, onNextPatient, onClinic }) {
  const {
    diagnosisCorrect,
    treatmentCorrect,
    fullSuccess,
    resultText,
    xpGained,
    reputationChange,
    coinsGained,
    chaosGained,
    patient,
  } = result;

  return (
    <div className="screen result-screen">
      <header className="screen-header">
        <h2 className="screen-header__title">Treatment Report</h2>
      </header>

      <div className={`result-banner ${fullSuccess ? 'result-banner--success' : 'result-banner--fail'}`}>
        <span className="result-banner__icon" aria-hidden="true">
          {fullSuccess ? '✓' : '⚠'}
        </span>
        <div>
          <h3 className="result-banner__title">
            {fullSuccess ? 'Treatment Successful' : 'Treatment Complicated'}
          </h3>
          <p className="result-banner__patient">{patient.patientType}</p>
        </div>
      </div>

      <div className="result-checks card">
        <div className={`result-check ${diagnosisCorrect ? 'result-check--pass' : 'result-check--fail'}`}>
          <span>Diagnosis</span>
          <span>{diagnosisCorrect ? 'Correct' : 'Incorrect'}</span>
        </div>
        <div className={`result-check ${treatmentCorrect ? 'result-check--pass' : 'result-check--fail'}`}>
          <span>Treatment</span>
          <span>{treatmentCorrect ? 'Correct' : 'Incorrect'}</span>
        </div>
      </div>

      <div className="result-text card">
        <h4 className="result-text__heading">Clinical Notes</h4>
        <p>{resultText}</p>
      </div>

      <div className="result-rewards">
        <h4 className="result-rewards__heading">Rewards</h4>
        <div className="stats-grid stats-grid--compact">
          <StatCard
            label="XP Gained"
            value={xpGained > 0 ? `+${xpGained}` : '0'}
            icon="📈"
            variant={xpGained > 0 ? 'success' : 'default'}
          />
          <StatCard
            label="Reputation"
            value={reputationChange >= 0 ? `+${reputationChange}` : reputationChange}
            icon="⭐"
            variant={reputationChange >= 0 ? 'success' : 'chaos'}
          />
          <StatCard
            label="Coins"
            value={coinsGained > 0 ? `+${coinsGained}` : '0'}
            icon="🪙"
            variant={coinsGained > 0 ? 'success' : 'default'}
          />
          {chaosGained > 0 && (
            <StatCard label="Chaos" value={`+${chaosGained}`} icon="💥" variant="chaos" />
          )}
        </div>
      </div>

      <div className="result-screen__actions">
        <button type="button" className="btn btn--primary btn--large" onClick={onNextPatient}>
          Next Patient
        </button>
        <button type="button" className="btn btn--secondary" onClick={onClinic}>
          Back to Clinic
        </button>
      </div>
    </div>
  );
}
