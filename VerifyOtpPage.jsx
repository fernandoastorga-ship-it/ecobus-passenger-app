import { useNavigate } from "react-router-dom";

export default function PageHeader({ title, subtitle, showBack = false }) {
  const navigate = useNavigate();

  return (
    <header className="ecobus-page-header">
      {showBack ? (
        <button
          type="button"
          className="ecobus-page-header__back"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
      ) : null}

      <div className="ecobus-page-header__content">
        <h1 className="ecobus-title" style={{ fontSize: 24, marginBottom: 6 }}>
          {title}
        </h1>
        {subtitle ? <p className="ecobus-subtitle">{subtitle}</p> : null}
      </div>
    </header>
  );
}
