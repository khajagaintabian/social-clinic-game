export const RESULT_STATUS = {
  FULLY_CURED: 'Fully Cured',
  PARTIALLY_CURED: 'Partially Cured',
  SOCIETY_UNSAFE: 'Society Still Unsafe',
};

export function getResultStatus(diagnosisCorrect, treatmentCorrect) {
  if (diagnosisCorrect && treatmentCorrect) {
    return RESULT_STATUS.FULLY_CURED;
  }
  if (diagnosisCorrect || treatmentCorrect) {
    return RESULT_STATUS.PARTIALLY_CURED;
  }
  return RESULT_STATUS.SOCIETY_UNSAFE;
}

export function getShortPostStatusLine(resultStatus) {
  if (resultStatus === RESULT_STATUS.FULLY_CURED) {
    return 'Patient fully cured.';
  }
  if (resultStatus === RESULT_STATUS.PARTIALLY_CURED) {
    return 'Partial recovery. Society remains unstable.';
  }
  return 'Society remains unstable.';
}

export function isFullSuccess(resultStatus) {
  return resultStatus === RESULT_STATUS.FULLY_CURED;
}

export function isPartialSuccess(resultStatus) {
  return resultStatus === RESULT_STATUS.PARTIALLY_CURED;
}
