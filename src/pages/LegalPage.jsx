import { useEffect, useState } from "react";
import { acceptLegal, getLegal } from "../api/legal.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";

export default function LegalPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [legal, setLegal] = useState(null);

  useEffect(() => {
    async function loadLegal() {
      try {
        setLoading(true);
        setError("");
        const data = await getLegal();
        setLegal(data);
      } catch (err) {
        setError(err.message || "No fue posible cargar la información legal.");
      } finally {
        setLoading(false);
      }
    }

    loadLegal();
  }, []);

  async function handleAccept() {
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const version = legal?.version || legal?.current_version;
      if (!version) {
        throw new Error("No se encontró una versión legal para aceptar.");
      }
      await acceptLegal(version);
      setMessage("Los términos fueron aceptados correctamente.");
    } catch (err) {
      setError(err.message || "No fue posible aceptar los términos.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingScreen message="Cargando términos y condiciones..." />;
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page">
        <PageHeader
          title="Información legal"
          subtitle="Revisa los términos y condiciones vigentes del servicio."
        />

        {error ? <div className="ecobus-error-box" style={{ marginBottom: 16 }}>{error}</div> : null}
        {message ? <div className="ecobus-success-box" style={{ marginBottom: 16 }}>{message}</div> : null}

        <section className="ecobus-card ecobus-info-card" style={{ marginBottom: 16 }}>
          <h2 className="ecobus-section-title">
            Versión {legal?.version || legal?.current_version || "vigente"}
          </h2>

          <div className="ecobus-legal-box">
            {legal?.text || legal?.content || "No hay texto legal disponible."}
          </div>
        </section>

        <PrimaryButton type="button" disabled={saving} onClick={handleAccept}>
          {saving ? "Guardando..." : "Aceptar términos"}
        </PrimaryButton>
      </main>

      <BottomNav />
    </div>
  );
}
