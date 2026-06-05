import { useState } from 'react';
import StatCard from './StatCard';
import { buildShortPostText, buildFullReportText } from '../utils/reportFormats';
import {
  getResultStatus,
  isFullSuccess,
  isPartialSuccess,
  RESULT_STATUS,
} from '../utils/resultStatus';

export default function ResultScreen({
  result,
  rank,
  rankUp,
  newAchievements = [],
  onNextPatient,
  onClinic,
}) {
  const [copyStatus, setCopyStatus] = useState(null);

  const {
    diagnosisCorrect,
    treatmentCorrect,
    resultStatus,
    resultText,
    xpGained,
    reputationChange,
    coinsGained,
    chaosGained,
    patient,
    selectedDiagnosis,
    selectedTreatment,
  } = result;

  const fullSuccess = isFullSuccess(resultStatus);
  const partialSuccess = isPartialSuccess(resultStatus);

  async function copyText(text, statusKey) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(statusKey);
    } catch {
      setCopyStatus('failed');
    }

    setTimeout(() => setCopyStatus(null), 2500);
  }

  function handleCopyShortPost() {
    const text = buildShortPostText({
      patient,
      selectedDiagnosis,
      selectedTreatment,
      diagnosisCorrect,
      treatmentCorrect,
    });
    copyText(text, 'short-copied');
  }

  function handleCopyFullReport() {
    const text = buildFullReportText({
      patient,
      selectedDiagnosis,
      selectedTreatment,
      diagnosisCorrect,
      treatmentCorrect,
      rankTitle: rank.title,
      xpGained,
      reputationChange,
      chaosGained,
    });
    copyText(text, 'full-copied');
  }

  const bannerClass = fullSuccess
    ? 'result-banner--success'
    : partialSuccess
      ? 'result-banner--partial'
      : 'result-banner--fail';

  const bannerIcon = fullSuccess ? '✓' : partialSuccess ? '~' : '⚠';

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

      {newAchievements.length > 0 && (
        <div className="achievement-unlock-banner" role="status">
          {newAchievements.map((achievement) => (
            <p key={achievement.id}>
              <span className="achievement-unlock-banner__icon" aria-hidden="true">🏆</span>
              Achievement Unlocked: <strong>{achievement.title}</strong>
            </p>
          ))}
        </div>
      )}

      <div className={`result-banner ${bannerClass}`}>
        <span className="result-banner__icon" aria-hidden="true">
          {bannerIcon}
        </span>
        <div>
          <h3 className="result-banner__title">{resultStatus}</h3>
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
            <dt>Department</dt>
            <dd>{patient.department}</dd>
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
            <dt>Result Status</dt>
            <dd
              className={
                fullSuccess
                  ? 'clinic-report__correct'
                  : partialSuccess
                    ? 'clinic-report__partial'
                    : 'clinic-report__incorrect'
              }
            >
              {resultStatus}
            </dd>
          </div>
          <div className="clinic-report__row">
            <dt>Doctor Rank</dt>
            <dd>{rank.title}</dd>
          </div>
        </dl>

        <div className="clinic-report__copy-actions">
          <button type="button" className="btn btn--secondary btn--large" onClick={handleCopyShortPost}>
            Copy Short Post
          </button>
          <button type="button" className="btn btn--secondary btn--large" onClick={handleCopyFullReport}>
            Copy Full Report
          </button>
        </div>
        {copyStatus === 'short-copied' && (
          <p className="copy-feedback copy-feedback--success" role="status">
            Short post copied to clipboard.
          </p>
        )}
        {copyStatus === 'full-copied' && (
          <p className="copy-feedback copy-feedback--success" role="status">
            Full report copied to clipboard.
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
