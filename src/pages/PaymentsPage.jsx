import { useEffect, useMemo, useState } from "react";
import { getPayments } from "../api/payments.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";
import { redirectToWebpay } from "../utils/webpayRedirect";

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

function getCurrentMonthFirstDay() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getApiBaseUrl() {
  const envBase =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "";

  if (envBase) {
    return envBase.replace(/\/+$/, "");
  }

  return "https://ecobus-api.onrender.com";
}

function getAccessToken() {
  const candidates = [
    localStorage.getItem("access_token"),
    localStorage.getItem("token"),
    localStorage.getItem("authToken"),
    localStorage.getItem("ecobus_token"),
    sessionStorage.getItem("access_token"),
    sessionStorage.getItem("token"),
    sessionStorage.getItem("authToken"),
    sessionStorage.getItem("ecobus_token"),
  ];

  const token = candidates.find((value) => value && String(value).trim());
  return token ? String(token).trim() : "";
}

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [submittingMonthly, setSubmittingMonthly] = useState(false);
  const [submittingDaily, setSubmittingDaily] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [payments, setPayments] = useState(null);

  const [selectedPlanType, setSelectedPlanType] = useState("VIAJES_20");
  const [selectedTripType, setSelectedTripType] = useState("IDA");
  const [selectedServiceDate, setSelectedServiceDate] = useState(getTodayDate());

  const API_BASE = getApiBaseUrl();

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

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const kind = params.get("kind");

    if (payment === "success") {
      if (kind === "monthly_plan") {
        setMessage("Pago aprobado. Tu plan mensual fue activado correctamente.");
      } else if (kind === "daily_pass") {
        setMessage("Pago aprobado. Tu pase diario fue activado correctamente.");
      } else {
        setMessage("Pago aprobado correctamente.");
      }

      setError("");
      loadPayments();

      const cleanUrl = `${window.location.pathname}`;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (payment === "failed") {
      setError("El pago no pudo ser completado.");
      setMessage("");

      const cleanUrl = `${window.location.pathname}`;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (payment === "aborted") {
      setError("El pago fue cancelado o abortado.");
      setMessage("");

      const cleanUrl = `${window.location.pathname}`;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const monthlyPlan = useMemo(() => {
    const plan = payments?.monthly_plan || {};

    return {
      hasMonthlyPlan: plan?.has_monthly_plan ?? false,
      planType: plan?.plan_type || "",
      paymentStatus: plan?.payment_status || "PENDIENTE",
      ridesIncluded: Number(plan?.rides_included ?? 0),
      ridesUsed: Number(plan?.rides_used ?? 0),
      ridesRemaining: Number(plan?.rides_remaining ?? 0),
    };
  }, [payments]);

  const dailyPass = useMemo(() => {
    const pass = payments?.daily_pass_today || {};

    return {
      hasDailyPassToday: pass?.has_daily_pass_today ?? false,
      id: pass?.id ?? null,
      active: pass?.is_paid === true || pass?.is_confirmed === true,
      paymentStatus: pass?.payment_status || "PENDIENTE",
      reservationStatus: pass?.reservation_status || null,
      serviceDate: pass?.service_date || "",
      tripType: pass?.trip_type || "",
    };
  }, [payments]);

  const monthlyStatus = normalizePaymentStatus(monthlyPlan.paymentStatus);
  const dailyStatus = dailyPass.active
    ? { label: "Activo", tone: "success" }
    : normalizePaymentStatus(dailyPass.paymentStatus);

  async function handleBuyMonthlyPlan() {
    try {
      setSubmittingMonthly(true);
      setError("");
      setMessage("");

      const token = getAccessToken();
      if (!token) {
        throw new Error("No se encontró token de sesión. Vuelve a iniciar sesión.");
      }

      const res = await fetch(`${API_BASE}/app/payments/webpay/monthly-plan/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          month: getCurrentMonthFirstDay(),
          plan_type: selectedPlanType,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.detail || "No fue posible iniciar el pago del plan mensual.");
      }

      redirectToWebpay(data.payment_url, data.token);
    } catch (err) {
      setError(err.message || "No fue posible comprar el plan mensual.");
    } finally {
      setSubmittingMonthly(false);
    }
  }

  async function handleBuyDailyPass() {
    try {
      setSubmittingDaily(true);
      setError("");
      setMessage("");

      const token = getAccessToken();
      if (!token) {
        throw new Error("No se encontró token de sesión. Vuelve a iniciar sesión.");
      }

      const res = await fetch(`${API_BASE}/app/payments/webpay/daily-pass/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_date: selectedServiceDate,
          trip_type: selectedTripType,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.detail || "No fue posible iniciar el pago del pase diario.");
      }

      redirectToWebpay(data.payment_url, data.token);
    } catch (err) {
      setError(err.message || "No fue posible comprar el pase diario.");
    } finally {
      setSubmittingDaily(false);
    }
  }

  if (loading) {
    return <LoadingScreen message="Cargando estado de pagos..." />;
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page">
        <PageHeader
          title="Pagos"
          subtitle="Consulta tu plan mensual y realiza compras desde la app."
        />

        {error ? (
          <div className="ecobus-error-box" style={{ marginBottom: 16 }}>
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="ecobus-success-box" style={{ marginBottom: 16 }}>
            {message}
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
                  {monthlyPlan.hasMonthlyPlan
                    ? formatPlanLabel(monthlyPlan.planType)
                    : "Sin plan mensual activo"}
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

            <div style={{ marginTop: 16, marginBottom: 12 }}>
              <label className="ecobus-label">Selecciona tu plan</label>
              <select
                className="ecobus-input"
                value={selectedPlanType}
                onChange={(e) => setSelectedPlanType(e.target.value)}
              >
                <option value="VIAJES_10">Plan 10 viajes</option>
                <option value="VIAJES_20">Plan 20 viajes</option>
                <option value="VIAJES_30">Plan 30 viajes</option>
                <option value="VIAJES_40">Plan 40 viajes</option>
              </select>
            </div>

            <PrimaryButton
              type="button"
              disabled={submittingMonthly}
              onClick={handleBuyMonthlyPlan}
            >
              {submittingMonthly ? "Procesando..." : "Comprar o renovar plan mensual"}
            </PrimaryButton>
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
              <div className="ecobus-helper-text" style={{ marginBottom: 4 }}>
                Tipo de viaje: {dailyPass.tripType}
              </div>
            ) : null}

            {dailyPass.reservationStatus ? (
              <div className="ecobus-helper-text" style={{ marginBottom: 12 }}>
                Estado de reserva: {dailyPass.reservationStatus}
              </div>
            ) : null}

            <div style={{ marginBottom: 12 }}>
              <label className="ecobus-label">Fecha de servicio</label>
              <input
                className="ecobus-input"
                type="date"
                value={selectedServiceDate}
                onChange={(e) => setSelectedServiceDate(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="ecobus-label">Tipo de viaje</label>
              <select
                className="ecobus-input"
                value={selectedTripType}
                onChange={(e) => setSelectedTripType(e.target.value)}
              >
                <option value="IDA">Ida</option>
                <option value="VUELTA">Vuelta</option>
              </select>
            </div>

            <PrimaryButton
              type="button"
              disabled={submittingDaily}
              onClick={handleBuyDailyPass}
            >
              {submittingDaily ? "Procesando..." : "Comprar pase diario"}
            </PrimaryButton>
          </div>

          <div className="ecobus-card ecobus-info-card">
            <h2 className="ecobus-section-title">Información importante</h2>

            <div className="ecobus-subtitle" style={{ marginBottom: 10 }}>
              Una vez confirmada la compra, tu estado de pagos se actualizará y el
              QR correspondiente quedará habilitado para su uso.
            </div>

            <div className="ecobus-helper-text">
              Si compras un plan mensual, se habilitará tu QR mensual. Si compras
              un pase diario, se habilitará el QR correspondiente al servicio.
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
