import { useState } from 'react';
import StatCard from './StatCard';

function buildReportText({ patient, selectedDiagnosis, selectedTreatment, fullSuccess, rankTitle }) {
  return [
    'SOCIAL CLINIC REPORT',
    `Patient: ${patient.patientType}`,
    `Category: ${patient.category}`,
    `Diagnosis: ${selectedDiagnosis}`,
    `Treatment: ${selectedTreatment}`,
    `Status: ${fullSuccess ? 'Cured' : 'Chaos'}`,
    `Doctor Rank: ${rankTitle}`,
  ].join('\n');
}

export default function ResultScreen({
  result,
  rank,
  rankUp,
  onNextPatient,
  onClinic,
}) {
  const [copyStatus, setCopyStatus] = useState(null);

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
    selectedDiagnosis,
    selectedTreatment,
  } = result;

  async function handleCopyReport() {
    const text = buildReportText({
      patient,
      selectedDiagnosis,
      selectedTreatment,
      fullSuccess,
      rankTitle: rank.title,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }

    setTimeout(() => setCopyStatus(null), 2500);
  }

  return (
    <div className="screen result-screen">
      <header className="screen-header">
        <h2 className="screen-header__title">Treatment Report</h2>
      </header>

      {rankUp && (
        <div className="rank-up-banner" role="status">
          <span className="rank-up-banner__icon" aria-hidden="true">⬆</span>
          <p>
            Rank Up: You are now <strong>{rankUp.title}</strong>. Society remains unstable.
          </p>
        </div>
      )}

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

      <div className="clinic-report card">
        <h4 className="clinic-report__heading">Social Clinic Report</h4>
        <dl className="clinic-report__list">
          <div className="clinic-report__row">
            <dt>Patient</dt>
            <dd>{patient.patientType}</dd>
          </div>
          <div className="clinic-report__row">
            <dt>Category</dt>
            <dd>{patient.category}</dd>
          </div>
          <div className="clinic-report__row">
            <dt>Diagnosis</dt>
            <dd className={diagnosisCorrect ? 'clinic-report__correct' : 'clinic-report__incorrect'}>
              {selectedDiagnosis}
            </dd>
          </div>
          <div className="clinic-report__row">
            <dt>Treatment</dt>
            <dd className={treatmentCorrect ? 'clinic-report__correct' : 'clinic-report__incorrect'}>
              {selectedTreatment}
            </dd>
          </div>
          <div className="clinic-report__row">
            <dt>Status</dt>
            <dd className={fullSuccess ? 'clinic-report__correct' : 'clinic-report__incorrect'}>
              {fullSuccess ? 'Cured' : 'Chaos'}
            </dd>
          </div>
          <div className="clinic-report__row">
            <dt>Doctor Rank</dt>
            <dd>{rank.title}</dd>
          </div>
        </dl>

        <button type="button" className="btn btn--secondary btn--large" onClick={handleCopyReport}>
          Copy Report Text
        </button>
        {copyStatus === 'copied' && (
          <p className="copy-feedback copy-feedback--success" role="status">
            Report copied to clipboard.
          </p>
        )}
        {copyStatus === 'failed' && (
          <p className="copy-feedback copy-feedback--fail" role="status">
            Could not copy report. Please try again.
          </p>
        )}
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
