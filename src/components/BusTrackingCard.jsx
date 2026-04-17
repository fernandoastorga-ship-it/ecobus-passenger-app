import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import { getBusTracking } from "../api/tracking.js";

const busIcon = L.divIcon({
  className: "",
  html: '<div style="font-size:30px; line-height:30px;">🚌</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const stopIcon = L.divIcon({
  className: "",
  html: '<div style="font-size:24px; line-height:24px;">📍</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function formatStatus(status) {
  if (status === "llegando") return "Llegando";
  if (status === "cerca") return "Cerca";
  if (status === "en_camino") return "En camino";
  return "No disponible";
}

export default function BusTrackingCard() {
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState("");

  const loadTracking = useCallback(async () => {
    try {
      const data = await getBusTracking();
      setTracking(data);
      setError("");
    } catch (err) {
      setError(err.message || "No fue posible cargar el seguimiento del bus.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTracking();
    const intervalId = window.setInterval(loadTracking, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadTracking]);

  const busPosition = useMemo(() => {
    if (!tracking?.available) return null;
    return [tracking.bus.lat, tracking.bus.lng];
  }, [tracking]);

  const pickupPosition = useMemo(() => {
    if (!tracking?.available) return null;
    return [tracking.pickup.lat, tracking.pickup.lng];
  }, [tracking]);

  if (loading && !tracking) {
    return (
      <div className="ecobus-card ecobus-info-card" style={{ marginTop: 16 }}>
        <h2 className="ecobus-section-title">Seguimiento del bus</h2>
        <div className="ecobus-subtitle">Cargando ubicación...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ecobus-card ecobus-info-card" style={{ marginTop: 16 }}>
        <h2 className="ecobus-section-title">Seguimiento del bus</h2>
        <div className="ecobus-error-box">{error}</div>
      </div>
    );
  }

  if (!tracking?.available) {
    return (
      <div className="ecobus-card ecobus-info-card" style={{ marginTop: 16 }}>
        <h2 className="ecobus-section-title">Seguimiento del bus</h2>
        <div className="ecobus-subtitle" style={{ marginBottom: 8 }}>
          {tracking?.message || "Seguimiento no disponible."}
        </div>

        {tracking?.windows?.length ? (
          <div className="ecobus-helper-text">
            Disponible en: {tracking.windows.join(" · ")}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="ecobus-card ecobus-info-card" style={{ marginTop: 16 }}>
      <div
        className="ecobus-info-row"
        style={{ marginBottom: 12, alignItems: "flex-start" }}
      >
        <div>
          <h2 className="ecobus-section-title" style={{ marginBottom: 6 }}>
            Seguimiento del bus
          </h2>
          <div className="ecobus-subtitle">
            Estado: {formatStatus(tracking.status)}
          </div>
        </div>
      </div>

      <div className="ecobus-helper-text" style={{ marginBottom: 10 }}>
        Tu bus llega en <strong>{tracking.eta_minutes} min</strong> · Distancia aprox.{" "}
        <strong>{tracking.distance_km} km</strong>
      </div>

      <div className="ecobus-helper-text" style={{ marginBottom: 12 }}>
        Última actualización: hace {tracking.last_update_seconds} seg
      </div>

      <div
        style={{
          width: "100%",
          height: 280,
          overflow: "hidden",
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <MapContainer
          center={busPosition}
          zoom={14}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={busPosition} icon={busIcon}>
            <Tooltip direction="top" offset={[0, -10]} permanent>
              Bus
            </Tooltip>
          </Marker>

          <Marker position={pickupPosition} icon={stopIcon}>
            <Tooltip direction="top" offset={[0, -10]} permanent>
              {tracking.pickup.name}
            </Tooltip>
          </Marker>

          <Polyline positions={[busPosition, pickupPosition]} />
        </MapContainer>
      </div>
    </div>
  );
}
