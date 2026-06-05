export default function StatCard({ label, value, icon, variant = 'default' }) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      {icon && <span className="stat-card__icon" aria-hidden="true">{icon}</span>}
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
      </div>
    </div>
  );
}
