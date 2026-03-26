import { useEffect, useMemo, useState } from "react";
import { getQrBundle } from "../api/qr.js";
import { getToken } from "../utils/auth.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

export default function QrPage() {
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState(null);
  const [qrImageSrc, setQrImageSrc] = useState("");

  useEffect(() => {
    let objectUrl = null;

    async function loadQr() {
      try {
        setLoading(true);
        setError("");
        setQrImageSrc("");

        const data = await getQrBundle();
        console.log("QR BUNDLE RESPONSE:", data);
        setQrData(data);

        const hasMonthlyQr = data?.monthly_qr?.available === true;
        const hasDailyPassQr = data?.daily_pass_qr?.available === true;

        let imageUrl = "";
        if (hasMonthlyQr) {
          imageUrl = data?.monthly_qr?.image_url || "";
        } else if (hasDailyPassQr) {
          imageUrl =
            data?.daily_pass_qr?.image_url ||
            "https://ecobus-api.onrender.com/app/qr/daily-pass/image";
        }

        if (!imageUrl) {
          return;
        }

        setImageLoading(true);

        const token = getToken();
        const response = await fetch(imageUrl, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        if (!response.ok) {
          throw new Error("No fue posible descargar la imagen del QR.");
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setQrImageSrc(objectUrl);
      } catch (err) {
        setError(err.message || "No fue posible cargar tu QR.");
      } finally {
        setLoading(false);
        setImageLoading(false);
      }
    }

    loadQr();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  const hasMonthlyPlan = useMemo(() => {
    return qrData?.monthly_qr?.available === true;
  }, [qrData]);

  const hasDailyPass = useMemo(() => {
    return qrData?.daily_pass_qr?.available === true;
  }, [qrData]);

  const qrType = useMemo(() => {
    if (hasMonthlyPlan) return "QR mensual";
    if (hasDailyPass) return "Pase diario";
    return "Código QR";
  }, [hasMonthlyPlan, hasDailyPass]);

  const qrStatus = useMemo(() => {
    return (
      qrData?.monthly_qr?.status ||
      qrData?.daily_pass_qr?.status ||
      "INACTIVE"
    );
  }, [qrData]);

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

          {qrStatus === "ACTIVE" ? (
            <div className="ecobus-helper-text" style={{ marginBottom: 12 }}>
              Estado: activo
            </div>
          ) : null}

          {imageLoading ? (
            <div className="ecobus-helper-text">
              Cargando imagen del QR...
            </div>
          ) : qrImageSrc ? (
            <img
              src={qrImageSrc}
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
