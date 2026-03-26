import { useEffect, useMemo, useState } from "react";
import { acceptLegal, getLegal } from "../api/legal.js";
import BottomNav from "../components/BottomNav.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";

function formatDateTime(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(value);
  }
}

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
        console.log("LEGAL RESPONSE:", data);
        setLegal(data);
      } catch (err) {
        setError(err.message || "No fue posible cargar la información legal.");
      } finally {
        setLoading(false);
      }
    }

    loadLegal();
  }, []);

  const documentData = legal?.document || {};
  const acceptance = legal?.acceptance || {};

  const legalTitle = useMemo(() => {
    return documentData?.title || "Términos y condiciones";
  }, [documentData]);

  const legalVersion = useMemo(() => {
    return (
      documentData?.version ||
      acceptance?.current_terms_version ||
      acceptance?.accepted_terms_version ||
      ""
    );
  }, [documentData, acceptance]);

  const legalAccepted = useMemo(() => {
    return acceptance?.accepted === true;
  }, [acceptance]);

  const needsAcceptance = useMemo(() => {
    return acceptance?.needs_acceptance === true;
  }, [acceptance]);

  const legalText = useMemo(() => {
    return documentData?.content || "";
  }, [documentData]);

  const acceptedAt = useMemo(() => {
    return acceptance?.accepted_terms_at || "";
  }, [acceptance]);

  async function handleAccept() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!legalVersion) {
        throw new Error("No se encontró una versión legal para aceptar.");
      }

      await acceptLegal(legalVersion);
      setMessage("Los términos fueron aceptados correctamente.");

      setLegal((prev) => ({
        ...(prev || {}),
        acceptance: {
          ...(prev?.acceptance || {}),
          accepted: true,
          accepted_terms_version: legalVersion,
          current_terms_version: legalVersion,
          needs_acceptance: false,
          accepted_terms_at: new Date().toISOString(),
        },
      }));
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

        <section
          className="ecobus-card ecobus-info-card"
          style={{ marginBottom: 16 }}
        >
          <h2 className="ecobus-section-title" style={{ marginBottom: 8 }}>
            {legalTitle}
          </h2>

          {legalVersion ? (
            <div className="ecobus-helper-text" style={{ marginBottom: 12 }}>
              Versión vigente: {legalVersion}
            </div>
          ) : null}

          {legalAccepted && !needsAcceptance ? (
            <div className="ecobus-success-box" style={{ marginBottom: 16 }}>
              Ya aceptaste los términos vigentes
              {acceptedAt ? ` el ${formatDateTime(acceptedAt)}.` : "."}
            </div>
          ) : null}

          {legalText ? (
            <div className="ecobus-legal-box">{legalText}</div>
          ) : (
            <div className="ecobus-error-box">
              No hay texto legal disponible para mostrar.
            </div>
          )}
        </section>

        {needsAcceptance && legalVersion ? (
          <PrimaryButton
            type="button"
            disabled={saving}
            onClick={handleAccept}
          >
            {saving ? "Guardando..." : "Aceptar términos"}
          </PrimaryButton>
        ) : null}
      </main>

      <BottomNav />
    </div>
  );
}
