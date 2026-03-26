import { useEffect, useMemo, useState } from "react";
import { getQr } from "../api/qr.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

export default function QrPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    async function loadQr() {
      try {
        setLoading(true);
        setError("");
        const data = await getQr();
        setQrData(data);
      } catch (err) {
        setError(err.message || "No fue posible cargar tu QR.");
      } finally {
        setLoading(false);
      }
    }

    loadQr();
  }, []);

  const qrImage = useMemo(() => {
    return (
      qrData?.monthly_qr?.image_url ||
      qrData?.daily_pass_qr?.image_url ||
      qrData?.qr_image_url ||
      qrData?.qr_url ||
      ""
    );
  }, [qrData]);

  const qrType = useMemo(() => {
    if (qrData?.daily_pass_qr || qrData?.daily_pass_active) return "Pase diario";
    return "QR mensual";
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

        {error ? <div className="ecobus-error-box" style={{ marginBottom: 16 }}>{error}</div> : null}

        <div className="ecobus-qr-card">
          <div style={{ marginBottom: 12 }}>
            <StatusBadge status="success">{qrType}</StatusBadge>
          </div>

          {qrImage ? (
            <img src={qrImage} alt="Código QR Ecobus" className="ecobus-qr-image" />
          ) : (
            <div className="ecobus-error-box">
              No se encontró una imagen QR disponible para tu cuenta.
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
