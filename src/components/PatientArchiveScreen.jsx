import StatCard from './StatCard';

function formatReportDate(dateTime) {
  return dateTime;
}

export default function PatientArchiveScreen({ reports, onBackToClinic }) {
  const totalHandled = reports.length;
  const successCount = reports.filter((r) => r.diagnosisCorrect && r.treatmentCorrect).length;
  const failedCount = reports.filter((r) => !r.diagnosisCorrect || !r.treatmentCorrect).length;

  return (
    <div className="screen archive-screen">
      <header className="screen-header">
        <h2 className="screen-header__title">Patient Archive</h2>
        <span className="screen-header__spacer" aria-hidden="true" />
      </header>

      <p className="archive-screen__intro">
        Every case you have handled, filed under &ldquo;probably fine.&rdquo;
      </p>

      <div className="stats-grid">
        <StatCard label="Total Handled" value={totalHandled} icon="📋" />
        <StatCard
          label="Cured / Success"
          value={successCount}
          icon="✅"
          variant="success"
        />
        <StatCard
          label="Failed / Chaos"
          value={failedCount}
          icon="💥"
          variant="chaos"
        />
      </div>

      {reports.length === 0 ? (
        <div className="archive-screen__empty card">
          <p>No patients archived yet. Go cure someone&mdash;or make society worse trying.</p>
        </div>
      ) : (
        <ul className="archive-list">
          {[...reports].reverse().map((report, index) => {
            const success = report.diagnosisCorrect && report.treatmentCorrect;
            return (
              <li key={`${report.dateTime}-${index}`} className="archive-card card">
                <div className="archive-card__header">
                  <div>
                    <h3 className="archive-card__patient">{report.patientType}</h3>
                    <p className="archive-card__category">{report.category}</p>
                  </div>
                  <span
                    className={`archive-card__status ${success ? 'archive-card__status--success' : 'archive-card__status--fail'}`}
                  >
                    {success ? 'Cured' : 'Chaos'}
                  </span>
                </div>

                <dl className="archive-card__details">
                  <div className="archive-card__row">
                    <dt>Diagnosis</dt>
                    <dd className={report.diagnosisCorrect ? 'archive-card__correct' : 'archive-card__incorrect'}>
                      {report.selectedDiagnosis}
                    </dd>
                  </div>
                  <div className="archive-card__row">
                    <dt>Treatment</dt>
                    <dd className={report.treatmentCorrect ? 'archive-card__correct' : 'archive-card__incorrect'}>
                      {report.selectedTreatment}
                    </dd>
                  </div>
                  <div className="archive-card__row">
                    <dt>Result</dt>
                    <dd>{report.resultText}</dd>
                  </div>
                </dl>

                <div className="archive-card__rewards">
                  {report.xpGained > 0 && <span>+{report.xpGained} XP</span>}
                  {report.reputationChange !== 0 && (
                    <span>
                      {report.reputationChange >= 0 ? '+' : ''}
                      {report.reputationChange} Rep
                    </span>
                  )}
                  {report.coinsGained > 0 && <span>+{report.coinsGained} Coins</span>}
                  {report.chaosGained > 0 && <span>+{report.chaosGained} Chaos</span>}
                </div>

                <time className="archive-card__date" dateTime={report.dateTime}>
                  {formatReportDate(report.dateTime)}
                </time>
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="btn btn--primary btn--large" onClick={onBackToClinic}>
        Back to Clinic
      </button>
    </div>
  );
}
