import { useEffect, useMemo, useState } from "react";
import { getQrBundle } from "../api/qr.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ecobus-api.onrender.com";

export default function QrPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    async function loadQr() {
      try {
        setLoading(true);
        setError("");
        const data = await getQrBundle();
        console.log("QR BUNDLE RESPONSE:", data);
        setQrData(data);
      } catch (err) {
        setError(err.message || "No fue posible cargar tu QR.");
      } finally {
        setLoading(false);
      }
    }

    loadQr();
  }, []);

  const paymentStatus = String(
    qrData?.payment_status ||
      qrData?.monthly_plan?.payment_status ||
      qrData?.subscription?.payment_status ||
      ""
  ).toUpperCase();

  const planType = String(
    qrData?.plan_type ||
      qrData?.monthly_plan?.plan_type ||
      qrData?.subscription?.plan_type ||
      ""
  ).toUpperCase();

  const ridesRemaining = Number(
    qrData?.rides_remaining ??
      qrData?.monthly_plan?.rides_remaining ??
      qrData?.subscription?.rides_remaining ??
      0
  );

  const hasMonthlyPlan = useMemo(() => {
    return (
      paymentStatus === "PAGADO" ||
      planType.startsWith("VIAJES_") ||
      ridesRemaining > 0 ||
      qrData?.monthly_qr_available === true ||
      qrData?.has_monthly_qr === true
    );
  }, [paymentStatus, planType, ridesRemaining, qrData]);

  const hasDailyPass = useMemo(() => {
    return (
      qrData?.daily_pass_active === true ||
      qrData?.daily_qr_available === true ||
      qrData?.has_daily_pass_qr === true
    );
  }, [qrData]);

  const qrType = useMemo(() => {
    if (hasMonthlyPlan) return "QR mensual";
    if (hasDailyPass) return "Pase diario";
    return "Código QR";
  }, [hasMonthlyPlan, hasDailyPass]);

  const qrImage = useMemo(() => {
    if (hasMonthlyPlan) {
      return `${API_BASE_URL}/app/qr/monthly/image`;
    }
    if (hasDailyPass) {
      return `${API_BASE_URL}/app/qr/daily-pass/image`;
    }
    return "";
  }, [hasMonthlyPlan, hasDailyPass]);

  if (loading) {
    return <LoadingScreen message="Cargando tu QR..." />;
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page">
        <PageHeader
          title="Mi QR"
          subtitle="Muestra este código al momento de validar tu viaje."
        />

        {error ? (
          <div className="ecobus-error-box" style={{ marginBottom: 16 }}>
            {error}
          </div>
        ) : null}

        <div className="ecobus-qr-card">
          <div style={{ marginBottom: 12 }}>
            <StatusBadge status="success">{qrType}</StatusBadge>
          </div>

          {qrImage ? (
            <img
              src={qrImage}
              alt="Código QR Ecobus"
              className="ecobus-qr-image"
            />
          ) : (
            <div className="ecobus-error-box">
              No tienes un QR activo disponible en este momento.
            </div>
          )}

          <p className="ecobus-subtitle">
            Mantén este código visible al subir al servicio.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
