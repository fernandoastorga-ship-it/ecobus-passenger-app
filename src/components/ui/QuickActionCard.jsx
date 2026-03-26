import { Link } from "react-router-dom";

export default function QuickActionCard({ to, icon, title, text }) {
  return (
    <Link to={to} className="ecobus-quick-card">
      <div className="ecobus-quick-card__icon">{icon}</div>
      <div>
        <div className="ecobus-quick-card__title">{title}</div>
        <div className="ecobus-quick-card__text">{text}</div>
      </div>
    </Link>
  );
}
