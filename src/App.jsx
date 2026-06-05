import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import ClinicScreen from './components/ClinicScreen';
import PatientCaseScreen from './components/PatientCaseScreen';
import ResultScreen from './components/ResultScreen';
import RankProgressScreen from './components/RankProgressScreen';
import PatientArchiveScreen from './components/PatientArchiveScreen';
import { getRankForXp, getXpProgress } from './data/ranks';
import { getRandomPatient } from './data/patientCases';
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
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [xp, setXp] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [coins, setCoins] = useState(0);
  const [chaosPoints, setChaosPoints] = useState(0);
  const [patientsCured, setPatientsCured] = useState(0);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [rankUp, setRankUp] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [returnScreen, setReturnScreen] = useState(SCREENS.HOME);

  const rank = getRankForXp(xp);
  const xpProgress = getXpProgress(xp);

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

  function callNextPatient(excludeId = null) {
    const patient = getRandomPatient(rank.level, excludeId);
    setCurrentPatient(patient);
    setSelectedDiagnosis(null);
    setSelectedTreatment(null);
    setScreen(SCREENS.PATIENT);
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
    callNextPatient(currentPatient?.id);
  }

  return (
    <div className="app">
      {screen === SCREENS.HOME && (
        <HomeScreen
          onStartGame={startGame}
          onRankProgress={() => openRankProgress(SCREENS.HOME)}
          onPatientArchive={() => openPatientArchive(SCREENS.HOME)}
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
