export default function PatientCaseScreen({
  patient,
  selectedDiagnosis,
  selectedTreatment,
  onSelectDiagnosis,
  onSelectTreatment,
  onConfirm,
  onBack,
}) {
  const canConfirm = selectedDiagnosis && selectedTreatment;

  return (
    <div className="screen patient-screen">
      <header className="screen-header">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Clinic
        </button>
        <h2 className="screen-header__title">Patient Case</h2>
        <span className="screen-header__spacer" />
      </header>

      <article className="patient-card card">
        <div className="patient-card__header">
          <span className="patient-card__avatar" aria-hidden="true">{patient.avatar}</span>
          <div>
            <h3 className="patient-card__name">{patient.patientType}</h3>
            <span className="patient-card__category">{patient.category}</span>
          </div>
        </div>

        <section className="medical-report">
          <h4 className="medical-report__heading">Chief Complaint</h4>
          <blockquote className="medical-report__quote">"{patient.complaint}"</blockquote>

          <h4 className="medical-report__heading">Observed Symptoms</h4>
          <ul className="medical-report__symptoms">
            {patient.symptoms.map((symptom) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        </section>
      </article>

      <section className="choice-section">
        <h4 className="choice-section__title">Select Diagnosis</h4>
        <div className="choice-grid">
          {patient.diagnosisOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`choice-btn ${selectedDiagnosis === option ? 'choice-btn--selected' : ''}`}
              onClick={() => onSelectDiagnosis(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="choice-section">
        <h4 className="choice-section__title">Select Treatment</h4>
        <div className="choice-grid">
          {patient.treatmentOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`choice-btn ${selectedTreatment === option ? 'choice-btn--selected' : ''}`}
              onClick={() => onSelectTreatment(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="btn btn--primary btn--large"
        onClick={onConfirm}
        disabled={!canConfirm}
      >
        Confirm Treatment
      </button>
    </div>
  );
}
