import { getResultStatus, getShortPostStatusLine } from './resultStatus';

export function buildShortPostText({
  patient,
  selectedDiagnosis,
  selectedTreatment,
  diagnosisCorrect,
  treatmentCorrect,
}) {
  const resultStatus = getResultStatus(diagnosisCorrect, treatmentCorrect);
  const statusLine = getShortPostStatusLine(resultStatus);

  return [
    '🏥 Social Clinic Report',
    `Patient: ${patient.patientType}`,
    `Diagnosis: ${selectedDiagnosis}`,
    `Treatment: ${selectedTreatment}`,
    `Status: ${statusLine}`,
  ].join('\n');
}

function formatSigned(value) {
  if (value > 0) return `+${value}`;
  return String(value);
}

export function buildFullReportText({
  patient,
  selectedDiagnosis,
  selectedTreatment,
  diagnosisCorrect,
  treatmentCorrect,
  rankTitle,
  xpGained,
  reputationChange,
  chaosGained,
}) {
  const resultStatus = getResultStatus(diagnosisCorrect, treatmentCorrect);

  return [
    'SOCIAL CLINIC REPORT',
    `Patient: ${patient.patientType}`,
    `Department: ${patient.department}`,
    `Diagnosis Selected: ${selectedDiagnosis}`,
    `Correct Diagnosis: ${patient.correctDiagnosis}`,
    `Treatment Selected: ${selectedTreatment}`,
    `Correct Treatment: ${patient.correctTreatment}`,
    `Result Status: ${resultStatus}`,
    `Doctor Rank: ${rankTitle}`,
    `XP Gained: ${xpGained}`,
    `Reputation Change: ${formatSigned(reputationChange)}`,
    `Chaos Gained: ${chaosGained}`,
  ].join('\n');
}
