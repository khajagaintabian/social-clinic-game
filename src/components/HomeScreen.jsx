import { useState } from 'react';

export default function HomeScreen({
  onStartGame,
  onRankProgress,
  onPatientArchive,
  onResetGame,
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handleConfirmReset() {
    onResetGame();
    setShowResetConfirm(false);
  }

  return (
    <div className="screen home-screen">
      <header className="home-screen__header">
        <div className="clinic-badge" aria-hidden="true">🏥</div>
        <h1 className="home-screen__title">Social Clinic</h1>
        <p className="home-screen__subtitle">
          Diagnose the drama. Cure the ego. Save society, one impossible patient at a time.
        </p>
      </header>

      <div className="home-screen__card card">
        <p className="home-screen__tagline">
          Welcome to the only clinic where the patients are contagious and the cures are questionable.
        </p>
      </div>

      <nav className="home-screen__actions">
        <button type="button" className="btn btn--primary btn--large" onClick={onStartGame}>
          Start Game
        </button>
        <button type="button" className="btn btn--secondary" onClick={onRankProgress}>
          Rank Progress
        </button>
        <button type="button" className="btn btn--secondary" onClick={onPatientArchive}>
          Patient Archive
        </button>
      </nav>

      <div className="home-screen__settings">
        {!showResetConfirm ? (
          <button
            type="button"
            className="btn btn--ghost btn--danger-text"
            onClick={() => setShowResetConfirm(true)}
          >
            Reset Game
          </button>
        ) : (
          <div className="reset-confirm card">
            <p className="reset-confirm__text">
              Reset all progress? This clears saved XP, stats, archive, and daily summary. Cannot be undone.
            </p>
            <div className="reset-confirm__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button type="button" className="btn btn--danger" onClick={handleConfirmReset}>
                Yes, Reset
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="home-screen__footer">
        <span>Social Clinic: Diagnosis of Society</span>
        <span className="home-screen__version">Phase 3</span>
      </footer>
    </div>
  );
}
