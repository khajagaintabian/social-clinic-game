export default function HomeScreen({ onStartGame, onRankProgress, onPatientArchive }) {
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
        <button
          type="button"
          className="btn btn--secondary btn--disabled"
          onClick={onPatientArchive}
          disabled
          title="Coming soon"
        >
          Patient Archive
        </button>
      </nav>

      <footer className="home-screen__footer">
        <span>Social Clinic: Diagnosis of Society</span>
        <span className="home-screen__version">MVP v1.0</span>
      </footer>
    </div>
  );
}
