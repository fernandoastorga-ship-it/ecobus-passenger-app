import { useEffect, useMemo, useState } from "react";
import { getPayments } from "../api/payments.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";

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

function formatPlanLabel(planType) {
  const value = String(planType || "").toUpperCase();

  if (value === "VIAJES_10") return "Plan 10 viajes";
  if (value === "VIAJES_20") return "Plan 20 viajes";
  if (value === "VIAJES_30") return "Plan 30 viajes";
  if (value === "VIAJES_40") return "Plan 40 viajes";

  return planType || "Plan mensual";
}

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
        console.log("PAYMENTS RESPONSE:", data);
        setPayments(data);
      } catch (err) {
        setError(err.message || "No fue posible cargar tus pagos.");
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  const monthlyPlan = useMemo(() => {
    const plan =
      payments?.monthly_plan ||
      payments?.plan ||
      payments?.subscription ||
      payments?.monthly_subscription ||
      {};

    return {
      planType:
        plan?.plan_type ||
        payments?.plan_type ||
        "",
      paymentStatus:
        plan?.payment_status ||
        payments?.payment_status ||
        "PENDIENTE",
      ridesIncluded: Number(
        plan?.rides_included ??
          payments?.rides_included ??
          0
      ),
      ridesUsed: Number(
        plan?.rides_used_total ??
          plan?.rides_used ??
          payments?.rides_used_total ??
          payments?.rides_used ??
          0
      ),
      ridesRemaining: Number(
        plan?.rides_remaining ??
          payments?.rides_remaining ??
          0
      ),
    };
  }, [payments]);

  const dailyPass = useMemo(() => {
    const pass = payments?.daily_pass || {};

    return {
      active:
        pass?.active ??
        payments?.daily_pass_active ??
        false,
      paymentStatus:
        pass?.payment_status ||
        payments?.daily_pass_payment_status ||
        "PENDIENTE",
      serviceDate:
        pass?.service_date ||
        payments?.service_date ||
        "",
      tripType:
        pass?.trip_type ||
        payments?.trip_type ||
        "",
    };
  }, [payments]);

  const monthlyStatus = normalizePaymentStatus(monthlyPlan.paymentStatus);
  const dailyStatus = dailyPass.active
    ? { label: "Activo", tone: "success" }
    : normalizePaymentStatus(dailyPass.paymentStatus);

  function handleBuyMonthlyPlan() {
    alert("La compra de plan mensual aún no está conectada al backend de pagos.");
  }

  function handleBuyDailyPass() {
    alert("La compra de pase diario aún no está conectada al backend de pagos.");
  }

  if (loading) {
    return <LoadingScreen message="Cargando estado de pagos..." />;
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page">
        <PageHeader
          title="Pagos"
          subtitle="Consulta tu plan mensual y el estado de tus compras."
        />

        {error ? (
          <div className="ecobus-error-box" style={{ marginBottom: 16 }}>
            {error}
          </div>
        ) : null}

        <section className="ecobus-grid">
          <div className="ecobus-card ecobus-info-card">
            <div className="ecobus-info-row" style={{ marginBottom: 12 }}>
              <div>
                <h2 className="ecobus-section-title" style={{ marginBottom: 6 }}>
                  Plan mensual
                </h2>
                <p className="ecobus-subtitle">
                  {formatPlanLabel(monthlyPlan.planType)}
                </p>
              </div>

              <StatusBadge status={monthlyStatus.tone}>
                {monthlyStatus.label}
              </StatusBadge>
            </div>

            <div className="ecobus-payments-summary">
              <div className="ecobus-payments-summary__item">
                <span className="ecobus-payments-summary__label">Incluidos</span>
                <strong className="ecobus-payments-summary__value">
                  {monthlyPlan.ridesIncluded}
                </strong>
              </div>

              <div className="ecobus-payments-summary__item">
                <span className="ecobus-payments-summary__label">Usados</span>
                <strong className="ecobus-payments-summary__value">
                  {monthlyPlan.ridesUsed}
                </strong>
              </div>

              <div className="ecobus-payments-summary__item">
                <span className="ecobus-payments-summary__label">Restantes</span>
                <strong className="ecobus-payments-summary__value">
                  {monthlyPlan.ridesRemaining}
                </strong>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <PrimaryButton type="button" onClick={handleBuyMonthlyPlan}>
                Comprar o renovar plan mensual
              </PrimaryButton>
            </div>
          </div>

          <div className="ecobus-card ecobus-info-card">
            <div className="ecobus-info-row" style={{ marginBottom: 12 }}>
              <div>
                <h2 className="ecobus-section-title" style={{ marginBottom: 6 }}>
                  Pase diario
                </h2>
                <p className="ecobus-subtitle">
                  Compra un pase puntual cuando lo necesites.
                </p>
              </div>

              <StatusBadge status={dailyStatus.tone}>
                {dailyStatus.label}
              </StatusBadge>
            </div>

            <div className="ecobus-subtitle" style={{ marginBottom: 8 }}>
              {dailyPass.active
                ? "Tienes un pase diario activo disponible para usar."
                : "No tienes un pase diario activo en este momento."}
            </div>

            {dailyPass.serviceDate ? (
              <div className="ecobus-helper-text" style={{ marginBottom: 4 }}>
                Fecha de servicio: {dailyPass.serviceDate}
              </div>
            ) : null}

            {dailyPass.tripType ? (
              <div className="ecobus-helper-text" style={{ marginBottom: 12 }}>
                Tipo de viaje: {dailyPass.tripType}
              </div>
            ) : null}

            <div style={{ marginTop: 16 }}>
              <PrimaryButton type="button" onClick={handleBuyDailyPass}>
                Comprar pase diario
              </PrimaryButton>
            </div>
          </div>

          <div className="ecobus-card ecobus-info-card">
            <h2 className="ecobus-section-title">Información importante</h2>

            <div className="ecobus-subtitle" style={{ marginBottom: 10 }}>
              Cuando el pago quede validado, tu acceso se reflejará en la app y
              el QR correspondiente quedará disponible para su uso.
            </div>

            <div className="ecobus-helper-text">
              Si compras un plan mensual, se habilitará tu QR mensual. Si compras
              un pase diario, se habilitará el QR asociado a ese servicio.
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
