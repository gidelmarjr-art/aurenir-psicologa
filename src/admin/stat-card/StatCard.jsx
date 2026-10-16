import './StatCard.css'

export default function StatCard({ label, value, hint, icon, tone = 'accent' }) {
  return (
    <div className="ad-stat">
      <div className="ad-stat__top">
        <span className="ad-stat__label">{label}</span>
        <span className={`ad-stat__icon ad-stat__icon--${tone}`}>{icon}</span>
      </div>
      <strong className="ad-stat__value">{value}</strong>
      <span className="ad-stat__hint">{hint}</span>
    </div>
  )
}
