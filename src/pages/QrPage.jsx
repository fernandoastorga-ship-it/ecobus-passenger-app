import { useCallback, useEffect, useMemo, useState } from "react";
import { getQrBundle } from "../api/qr.js";
import { getToken } from "../utils/auth.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import BusTrackingCard from "../components/BusTrackingCard.jsx";

export default function QrPage() {
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState(null);
  const [qrImageSrc, setQrImageSrc] = useState("");

  const loadQr = useCallback(async () => {
    let objectUrl = null;

    try {
      setLoading(true);
      setError("");
      setQrImageSrc("");

      const data = await getQrBundle();
      console.log("QR BUNDLE RESPONSE:", data);
      setQrData(data);

      const effectiveQr = data?.effective_qr;
      const imageUrl = effectiveQr?.available ? effectiveQr?.image_url || "" : "";

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
      setQrImageSrc((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return objectUrl;
      });
    } catch (err) {
      setError(err.message || "No fue posible cargar tu QR.");
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQr();
  }, [loadQr]);

  useEffect(() => {
    const handleFocus = () => {
      loadQr();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadQr]);

  const effectiveQr = useMemo(() => {
    return qrData?.effective_qr || null;
  }, [qrData]);

  const qrAvailable = useMemo(() => {
    return effectiveQr?.available === true;
  }, [effectiveQr]);

  const qrType = useMemo(() => {
    return effectiveQr?.title || "Sin QR vigente";
  }, [effectiveQr]);

  const qrStatus = useMemo(() => {
    return effectiveQr?.status || "INACTIVE";
  }, [effectiveQr]);

  const qrKind = useMemo(() => {
    return effectiveQr?.kind || null;
  }, [effectiveQr]);

  const helperText = useMemo(() => {
    if (!qrAvailable) {
      return "No tienes un QR disponible en este momento.";
    }

    if (qrKind === "DAILY") {
      return "Este QR es de un solo uso. Úsalo para validar tu pase diario.";
    }

    if (qrKind === "MONTHLY") {
      return "Mantén este código visible al subir al servicio.";
    }

    return "Mantén este código visible al subir al servicio.";
  }, [qrAvailable, qrKind]);

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
            <StatusBadge status={qrAvailable ? "success" : "neutral"}>
              {qrType}
            </StatusBadge>
          </div>

          {qrAvailable && qrStatus === "ACTIVE" ? (
            <div className="ecobus-helper-text" style={{ marginBottom: 12 }}>
              Estado: activo
            </div>
          ) : null}

          {imageLoading ? (
            <div className="ecobus-helper-text">
              Cargando imagen del QR...
            </div>
          ) : qrImageSrc && qrAvailable ? (
            <img
              src={qrImageSrc}
              alt={qrType}
              className="ecobus-qr-image"
            />
          ) : (
            <div className="ecobus-error-box">
              No tienes un QR activo disponible en este momento.
            </div>
          )}

          <p className="ecobus-subtitle">{helperText}</p>
        </div>

        <BusTrackingCard />
      </main>

      <BottomNav />
    </div>
  );
}
