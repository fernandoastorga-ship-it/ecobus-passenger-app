import { useEffect, useMemo, useState } from "react";
import { getDashboard } from "../api/dashboard.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import BottomNav from "../components/BottomNav.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import QuickActionCard from "../components/ui/QuickActionCard.jsx";
import { normalizePaymentStatus } from "../utils/format.js";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const data = await getDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err.message || "No fue posible cargar el dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const passenger = useMemo(() => {
    return {
      firstName:
        dashboard?.passenger?.first_name ||
        dashboard?.user?.first_name ||
        dashboard?.first_name ||
        "Pasajero",
      fullName:
        dashboard?.passenger?.full_name ||
        dashboard?.user?.full_name ||
        dashboard?.full_name ||
        "Usuario Ecobus",
    };
  }, [dashboard]);

  const monthlyPlan = useMemo(() => {
    return {
      ridesIncluded:
        dashboard?.monthly_plan?.rides_included ??
        dashboard?.plan?.rides_included ??
        0,
      ridesUsed:
        dashboard?.monthly_plan?.rides_used ??
        dashboard?.plan?.rides_used ??
        0,
      ridesRemaining:
        dashboard?.monthly_plan?.rides_remaining ??
        dashboard?.plan?.rides_remaining ??
        0,
      paymentStatus:
        dashboard?.monthly_plan?.payment_status ??
        dashboard?.plan?.payment_status ??
        "pending",
      planName:
        dashboard?.monthly_plan?.name ??
        dashboard?.plan?.name ??
        "Plan mensual",
      periodLabel:
        dashboard?.monthly_plan?.period_label ??
        dashboard?.plan?.period_label ??
        "Periodo actual",
    };
  }, [dashboard]);

  const hasDailyPass =
    dashboard?.daily_pass?.active ??
    dashboard?.daily_pass_active ??
    false;

  const paymentStatus = normalizePaymentStatus(monthlyPlan.paymentStatus);

  if (loading) {
    return <LoadingScreen message="Cargando tu resumen..." />;
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page">
        <header className="ecobus-topbar">
          <span className="ecobus-topbar__eyebrow">Mi cuenta</span>
          <h1 className="ecobus-title">Hola, {passenger.firstName}</h1>
          <p className="ecobus-subtitle">
            Revisa tu plan, tus viajes y tu acceso QR de forma rápida.
          </p>
        </header>

        {error ? <div className="ecobus-error-box" style={{ marginBottom: 16 }}>{error}</div> : null}

        <section className="ecobus-grid">
          <div className="ecobus-hero-card">
            <div className="ecobus-hero-card__label">Viajes restantes</div>
            <div className="ecobus-hero-card__value">
              {monthlyPlan.ridesRemaining}
            </div>
            <div className="ecobus-hero-card__meta">
              Has utilizado {monthlyPlan.ridesUsed} de {monthlyPlan.ridesIncluded} viajes ·{" "}
              {monthlyPlan.periodLabel}
            </div>
          </div>

          <div className="ecobus-card ecobus-info-card">
            <div className="ecobus-info-row" style={{ marginBottom: 12 }}>
              <div>
                <h2 className="ecobus-section-title" style={{ marginBottom: 6 }}>
                  Estado de tu plan
                </h2>
                <div className="ecobus-subtitle">{monthlyPlan.planName}</div>
              </div>
              <StatusBadge status={paymentStatus.tone}>
                {paymentStatus.label}
              </StatusBadge>
            </div>

            <div className="ecobus-subtitle" style={{ marginTop: 8 }}>
              {hasDailyPass
                ? "Tienes un pase diario activo además de tu plan."
                : "Tu estado de pago y tus viajes disponibles están actualizados."}
            </div>
          </div>

          <div>
            <h2 className="ecobus-section-title">Accesos rápidos</h2>
            <div className="ecobus-quick-actions">
              <QuickActionCard
                to="/qr"
                icon="QR"
                title="Mi QR"
                text="Muestra tu código para validar tu viaje."
              />
              <QuickActionCard
                to="/history"
                icon="H"
                title="Historial"
                text="Revisa tus validaciones recientes."
              />
              <QuickActionCard
                to="/payments"
                icon="$"
                title="Pagos"
                text="Consulta el estado de tu plan o pase."
              />
            </div>
          </div>

          <div className="ecobus-card ecobus-info-card">
            <h2 className="ecobus-section-title">Información del pasajero</h2>
            <div className="ecobus-subtitle" style={{ marginBottom: 8 }}>
              {passenger.fullName}
            </div>
            <div className="ecobus-helper-text">
              Desde aquí podrás gestionar tu acceso, revisar tus movimientos y
              mantener control de tu servicio.
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
