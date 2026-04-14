import { useEffect, useMemo, useState } from "react";
import { getDashboard } from "../api/dashboard.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import BottomNav from "../components/BottomNav.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import QuickActionCard from "../components/ui/QuickActionCard.jsx";

function normalizePaymentStatus(status) {
  const value = String(status || "").toUpperCase();

  if (["PAGADO", "PAID", "ACTIVE", "ACTIVO"].includes(value)) {
    return { label: "Pagado", tone: "success" };
  }

  if (["PENDIENTE", "PENDING"].includes(value)) {
    return { label: "Pendiente", tone: "warning" };
  }

  return { label: "Vencido", tone: "danger" };
}

function getFirstName(fullName) {
  if (!fullName) return "Pasajero";
  return String(fullName).trim().split(/\s+/)[0];
}

function getDaysLeftLabel(daysLeft) {
  if (daysLeft == null || Number.isNaN(Number(daysLeft))) return null;

  const value = Number(daysLeft);

  if (value < 0) return "Plan vencido";
  if (value === 0) return "Vence hoy";
  if (value === 1) return "1 día restante";
  return `${value} días restantes`;
}

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
        console.log("DASHBOARD RESPONSE:", data);
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
    const fullName =
      dashboard?.passenger?.full_name ||
      dashboard?.user?.full_name ||
      dashboard?.profile?.full_name ||
      dashboard?.full_name ||
      dashboard?.name ||
      dashboard?.passenger_name ||
      "Pasajero";

    const passengerCode =
      dashboard?.passenger?.code ||
      dashboard?.user?.code ||
      dashboard?.profile?.code ||
      dashboard?.code ||
      dashboard?.passenger_code ||
      "";

    const pickupDefault =
      dashboard?.passenger?.pickup_default ||
      dashboard?.user?.pickup_default ||
      dashboard?.profile?.pickup_default ||
      dashboard?.pickup_default ||
      "";

    return {
      firstName: getFirstName(fullName),
      fullName,
      code: passengerCode,
      pickupDefault,
    };
  }, [dashboard]);

  const monthlyPlan = useMemo(() => {
    const plan =
      dashboard?.monthly_plan ||
      dashboard?.plan ||
      dashboard?.subscription ||
      dashboard?.monthly_subscription ||
      {};

    const ridesIncluded = Number(
      plan?.rides_included ??
        dashboard?.rides_included ??
        0
    );

    const ridesUsed = Number(
      plan?.rides_used_total ??
        plan?.rides_used ??
        dashboard?.rides_used_total ??
        dashboard?.rides_used ??
        0
    );

    const ridesRemaining = Number(
      plan?.rides_remaining ??
        dashboard?.rides_remaining ??
        Math.max(ridesIncluded - ridesUsed, 0)
    );

    const paymentStatus =
      plan?.payment_status ||
      dashboard?.payment_status ||
      "PENDIENTE";

    const planName =
      plan?.plan_type ||
      plan?.name ||
      dashboard?.plan_type ||
      "Plan mensual";

      const periodLabel =
      plan?.period_label ||
      dashboard?.period_label ||
      "Periodo actual";

    const daysLeft =
      plan?.days_left ??
      dashboard?.days_left ??
      null;

    return {
      ridesIncluded,
      ridesUsed,
      ridesRemaining,
      paymentStatus,
      planName,
      periodLabel,
      daysLeft,
    };
  }, [dashboard]);

  const paymentStatus = normalizePaymentStatus(monthlyPlan.paymentStatus);
  const daysLeftLabel = getDaysLeftLabel(monthlyPlan.daysLeft);

  const hasDailyPass = useMemo(() => {
    return (
      dashboard?.daily_pass_active === true ||
      dashboard?.daily_pass?.active === true ||
      false
    );
  }, [dashboard]);

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

        {error ? (
          <div className="ecobus-error-box" style={{ marginBottom: 16 }}>
            {error}
          </div>
        ) : null}

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

            {daysLeftLabel ? (
              <div className="ecobus-hero-card__meta" style={{ marginTop: 8 }}>
                {daysLeftLabel}
              </div>
            ) : null}
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

            {passenger.code ? (
              <div className="ecobus-helper-text" style={{ marginBottom: 4 }}>
                Código: {passenger.code}
              </div>
            ) : null}

            {passenger.pickupDefault ? (
              <div className="ecobus-helper-text">
                Punto habitual: {passenger.pickupDefault}
              </div>
            ) : (
              <div className="ecobus-helper-text">
                Desde aquí podrás revisar tus movimientos y el estado de tu servicio.
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
