import { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import ClinicScreen from './components/ClinicScreen';
import PatientCaseScreen from './components/PatientCaseScreen';
import ResultScreen from './components/ResultScreen';
import RankProgressScreen from './components/RankProgressScreen';
import PatientArchiveScreen from './components/PatientArchiveScreen';
import { getRankForXp, getXpProgress } from './data/ranks';
import { getRandomPatient, hasUnlockedPatients } from './data/patientCases';
import {
  loadGameState,
  saveGameState,
  clearGameStorage,
  INITIAL_GAME_STATE,
  createFreshDailySummary,
  normalizeDailySummary,
} from './utils/gameStorage';
import './App.css';

const SCREENS = {
  HOME: 'home',
  CLINIC: 'clinic',
  PATIENT: 'patient',
  RESULT: 'result',
  RANK: 'rank',
  ARCHIVE: 'archive',
};

function App() {
  const saved = loadGameState();

  const [screen, setScreen] = useState(SCREENS.HOME);
  const [xp, setXp] = useState(saved.xp);
  const [reputation, setReputation] = useState(saved.reputation);
  const [coins, setCoins] = useState(saved.coins);
  const [chaosPoints, setChaosPoints] = useState(saved.chaosPoints);
  const [patientsCured, setPatientsCured] = useState(saved.patientsCured);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [rankUp, setRankUp] = useState(null);
  const [patientReports, setPatientReports] = useState(saved.patientReports);
  const [returnScreen, setReturnScreen] = useState(SCREENS.HOME);
  const [lastPlayedCaseId, setLastPlayedCaseId] = useState(saved.lastPlayedCaseId);
  const [selectedDepartment, setSelectedDepartment] = useState(saved.selectedDepartment);
  const [dailySummary, setDailySummary] = useState(saved.dailySummary);

  const rank = getRankForXp(xp);
  const xpProgress = getXpProgress(xp);

  useEffect(() => {
    saveGameState({
      xp,
      reputation,
      coins,
      chaosPoints,
      patientsCured,
      patientReports,
      lastPlayedCaseId,
      selectedDepartment,
      dailySummary: normalizeDailySummary(dailySummary),
    });
  }, [
    xp,
    reputation,
    coins,
    chaosPoints,
    patientsCured,
    patientReports,
    lastPlayedCaseId,
    selectedDepartment,
    dailySummary,
  ]);

  function startGame() {
    setScreen(SCREENS.CLINIC);
  }

  function openRankProgress(from) {
    setReturnScreen(from);
    setScreen(SCREENS.RANK);
  }

  function openPatientArchive(from) {
    setReturnScreen(from);
    setScreen(SCREENS.ARCHIVE);
  }

  function handleDepartmentChange(department) {
    setSelectedDepartment(department);
  }

  function callNextPatient(excludeId = null) {
    const patient = getRandomPatient(rank.level, excludeId, selectedDepartment);
    if (!patient) return false;

    setCurrentPatient(patient);
    setLastPlayedCaseId(patient.id);
    setSelectedDiagnosis(null);
    setSelectedTreatment(null);
    setScreen(SCREENS.PATIENT);
    return true;
  }

  function confirmTreatment() {
    if (!currentPatient) return;

    const diagnosisCorrect = selectedDiagnosis === currentPatient.correctDiagnosis;
    const treatmentCorrect = selectedTreatment === currentPatient.correctTreatment;
    const fullSuccess = diagnosisCorrect && treatmentCorrect;

    let xpGained = 0;
    let reputationChange = 0;
    let coinsGained = 0;
    let chaosGained = 0;

    if (fullSuccess) {
      xpGained = currentPatient.xpReward;
      reputationChange = currentPatient.reputationReward;
      coinsGained = currentPatient.coinReward;
      setPatientsCured((n) => n + 1);
    } else {
      const partialXp = Math.floor(currentPatient.xpReward * 0.3);
      xpGained = diagnosisCorrect || treatmentCorrect ? partialXp : 0;
      reputationChange = fullSuccess ? currentPatient.reputationReward : -5;
      chaosGained = currentPatient.chaosReward;
      if (diagnosisCorrect) coinsGained = Math.floor(currentPatient.coinReward * 0.5);
    }

    const previousRank = getRankForXp(xp);
    const newXp = xp + xpGained;
    const newRank = getRankForXp(newXp);
    const didRankUp = newRank.level > previousRank.level;

    setXp(newXp);
    setReputation((v) => Math.max(0, v + reputationChange));
    setCoins((v) => v + coinsGained);
    setChaosPoints((v) => v + chaosGained);

    setDailySummary((prev) => {
      const base = normalizeDailySummary(prev);
      return {
        ...base,
        casesHandled: base.casesHandled + 1,
        cured: base.cured + (fullSuccess ? 1 : 0),
        failed: base.failed + (fullSuccess ? 0 : 1),
        xpEarned: base.xpEarned + xpGained,
        reputationChange: base.reputationChange + reputationChange,
        chaosGained: base.chaosGained + chaosGained,
      };
    });

    const resultText = fullSuccess ? currentPatient.successResult : currentPatient.failResult;
    const dateTime = new Date().toLocaleString();

    setPatientReports((reports) => [
      ...reports,
      {
        patientType: currentPatient.patientType,
        category: currentPatient.category,
        selectedDiagnosis,
        selectedTreatment,
        correctDiagnosis: currentPatient.correctDiagnosis,
        correctTreatment: currentPatient.correctTreatment,
        diagnosisCorrect,
        treatmentCorrect,
        resultText,
        xpGained,
        reputationChange,
        coinsGained,
        chaosGained,
        dateTime,
      },
    ]);

    setLastResult({
      diagnosisCorrect,
      treatmentCorrect,
      fullSuccess,
      resultText,
      xpGained,
      reputationChange,
      coinsGained,
      chaosGained,
      patient: currentPatient,
      selectedDiagnosis,
      selectedTreatment,
    });

    setRankUp(didRankUp ? newRank : null);
    setScreen(SCREENS.RESULT);
  }

  function handleNextPatient() {
    const success = callNextPatient(currentPatient?.id);
    if (!success) {
      setScreen(SCREENS.CLINIC);
    }
  }

  function resetGame() {
    clearGameStorage();
    setXp(INITIAL_GAME_STATE.xp);
    setReputation(INITIAL_GAME_STATE.reputation);
    setCoins(INITIAL_GAME_STATE.coins);
    setChaosPoints(INITIAL_GAME_STATE.chaosPoints);
    setPatientsCured(INITIAL_GAME_STATE.patientsCured);
    setPatientReports(INITIAL_GAME_STATE.patientReports);
    setLastPlayedCaseId(INITIAL_GAME_STATE.lastPlayedCaseId);
    setSelectedDepartment(INITIAL_GAME_STATE.selectedDepartment);
    setDailySummary(createFreshDailySummary());
    setCurrentPatient(null);
    setSelectedDiagnosis(null);
    setSelectedTreatment(null);
    setLastResult(null);
    setRankUp(null);
    setScreen(SCREENS.HOME);
  }

  const departmentHasPatients = hasUnlockedPatients(rank.level, selectedDepartment);

  return (
    <div className="app">
      {screen === SCREENS.HOME && (
        <HomeScreen
          onStartGame={startGame}
          onRankProgress={() => openRankProgress(SCREENS.HOME)}
          onPatientArchive={() => openPatientArchive(SCREENS.HOME)}
          onResetGame={resetGame}
        />
      )}

      {screen === SCREENS.CLINIC && (
        <ClinicScreen
          rank={rank}
          xpProgress={xpProgress}
          reputation={reputation}
          coins={coins}
          chaosPoints={chaosPoints}
          patientsCured={patientsCured}
          dailySummary={dailySummary}
          selectedDepartment={selectedDepartment}
          departmentHasPatients={departmentHasPatients}
          onDepartmentChange={handleDepartmentChange}
          onCallPatient={() => callNextPatient()}
          onRankProgress={() => openRankProgress(SCREENS.CLINIC)}
          onHome={() => setScreen(SCREENS.HOME)}
        />
      )}

      {screen === SCREENS.PATIENT && currentPatient && (
        <PatientCaseScreen
          patient={currentPatient}
          selectedDiagnosis={selectedDiagnosis}
          selectedTreatment={selectedTreatment}
          onSelectDiagnosis={setSelectedDiagnosis}
          onSelectTreatment={setSelectedTreatment}
          onConfirm={confirmTreatment}
          onBack={() => setScreen(SCREENS.CLINIC)}
        />
      )}

      {screen === SCREENS.RESULT && lastResult && (
        <ResultScreen
          result={lastResult}
          rank={rank}
          rankUp={rankUp}
          onNextPatient={handleNextPatient}
          onClinic={() => setScreen(SCREENS.CLINIC)}
        />
      )}

      {screen === SCREENS.ARCHIVE && (
        <PatientArchiveScreen
          reports={patientReports}
          onBackToClinic={() => setScreen(SCREENS.CLINIC)}
        />
      )}

      {screen === SCREENS.RANK && (
        <RankProgressScreen
          currentRank={rank}
          xp={xp}
          onBack={() => setScreen(returnScreen)}
        />
      )}
    </div>
  );
}

export default App;
