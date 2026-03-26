import { useEffect, useState } from "react";
import { getHistory } from "../api/history.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { formatDate } from "../utils/format.js";

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        setError("");
        const data = await getHistory(limit, offset);
        const rows = data?.items || data?.results || data || [];
        setItems(Array.isArray(rows) ? rows : []);
      } catch (err) {
        setError(err.message || "No fue posible cargar tu historial.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [offset]);

  if (loading) {
    return <LoadingScreen message="Cargando historial..." />;
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page">
        <PageHeader
          title="Historial"
          subtitle="Revisa tus validaciones y movimientos recientes."
        />

        {error ? <div className="ecobus-error-box" style={{ marginBottom: 16 }}>{error}</div> : null}

        <div className="ecobus-list" style={{ marginBottom: 16 }}>
          {items.length > 0 ? (
            items.map((item, index) => (
              <article className="ecobus-list-card" key={item.id || index}>
                <div className="ecobus-list-card__top">
                  <div className="ecobus-list-card__title">
                    {item.title || item.type || "Validación registrada"}
                  </div>
                  <div className="ecobus-helper-text">
                    {formatDate(item.created_at || item.timestamp || item.date)}
                  </div>
                </div>
                <div className="ecobus-list-card__text">
                  {item.description ||
                    item.message ||
                    "Movimiento registrado correctamente."}
                </div>
              </article>
            ))
          ) : (
            <div className="ecobus-card ecobus-info-card">
              <h2 className="ecobus-section-title">Sin movimientos</h2>
              <p className="ecobus-subtitle">
                Aún no hay registros disponibles en tu historial.
              </p>
            </div>
          )}
        </div>

        <div className="ecobus-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <button
            type="button"
            className="ecobus-button"
            disabled={offset === 0}
            onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
          >
            Anterior
          </button>
          <button
            type="button"
            className="ecobus-button"
            onClick={() => setOffset((prev) => prev + limit)}
          >
            Siguiente
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
