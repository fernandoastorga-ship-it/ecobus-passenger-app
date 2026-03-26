import { useEffect, useMemo, useState } from "react";
import { getPayments } from "../api/payments.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { normalizePaymentStatus } from "../utils/format.js";

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        setError("");
        const data = await getPayments();
        setPayments(data);
      } catch (err) {
        setError(err.message || "No fue posible cargar tus pagos.");
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  const monthlyStatus = useMemo(() => {
    return normalizePaymentStatus(
      payments?.monthly_plan?.payment_status || payments?.payment_status || "pending"
    );
  }, [payments]);

  const dailyPassActive =
    payments?.daily_pass?.active ?? payments?.daily_pass_active ?? false;

  if (loading) {
    return <LoadingScreen message="Cargando estado de pagos..." />;
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page">
        <PageHeader
          title="Pagos"
          subtitle="Consulta el estado de tu plan mensual y tu pase diario."
        />

        {error ? <div className="ecobus-error-box" style={{ marginBottom: 16 }}>{error}</div> : null}

        <section className="ecobus-grid">
          <div className="ecobus-card ecobus-info-card">
            <div className="ecobus-info-row" style={{ marginBottom: 12 }}>
              <div>
                <h2 className="ecobus-section-title" style={{ marginBottom: 6 }}>
                  Plan mensual
                </h2>
                <p className="ecobus-subtitle">
                  {payments?.monthly_plan?.name || "Plan mensual activo"}
                </p>
              </div>
              <StatusBadge status={monthlyStatus.tone}>
                {monthlyStatus.label}
              </StatusBadge>
            </div>

            <p className="ecobus-subtitle">
              Revisa aquí el estado actualizado de tu plan y los cobros asociados.
            </p>
          </div>

          <div className="ecobus-card ecobus-info-card">
            <div className="ecobus-info-row" style={{ marginBottom: 12 }}>
              <div>
                <h2 className="ecobus-section-title" style={{ marginBottom: 6 }}>
                  Pase diario
                </h2>
                <p className="ecobus-subtitle">
                  Estado del pase complementario del día.
                </p>
              </div>
              <StatusBadge status={dailyPassActive ? "success" : "warning"}>
                {dailyPassActive ? "Activo" : "Sin pase activo"}
              </StatusBadge>
            </div>

            <p className="ecobus-subtitle">
              {dailyPassActive
                ? "Tu pase diario se encuentra habilitado."
                : "No se detecta un pase diario activo por el momento."}
            </p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
