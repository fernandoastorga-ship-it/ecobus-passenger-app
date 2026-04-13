import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { acceptLegal, getLegal } from "../api/legal.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageHeader from "../components/PageHeader.jsx";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";

export default function TermsGatePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [legal, setLegal] = useState(null);

  const termsUrl =
    import.meta.env.VITE_TERMS_URL ||
    "https://ecobus-passenger-app.onrender.com/terminos-y-condiciones.html";

  useEffect(() => {
    async function loadLegal() {
      try {
        setLoading(true);
        setError("");

        const data = await getLegal();
        setLegal(data);

        const alreadyAccepted = data?.acceptance?.accepted === true;
        const needsAcceptance = data?.acceptance?.needs_acceptance === true;

        if (alreadyAccepted && !needsAcceptance) {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        setError(err.message || "No fue posible cargar los términos y condiciones.");
      } finally {
        setLoading(false);
      }
    }

    loadLegal();
  }, [navigate]);

  const legalTitle = useMemo(() => {
    return legal?.document?.title || "Términos y Condiciones";
  }, [legal]);

  const legalVersion = useMemo(() => {
    return (
      legal?.document?.version ||
      legal?.acceptance?.current_terms_version ||
      ""
    );
  }, [legal]);

  const needsAcceptance = useMemo(() => {
    return legal?.acceptance?.needs_acceptance === true;
  }, [legal]);

  async function handleContinue() {
    try {
      setError("");

      if (!checked) {
        throw new Error("Debes aceptar los términos y condiciones para continuar.");
      }

      if (!legalVersion) {
        throw new Error("No se encontró la versión vigente de los términos.");
      }

      setSaving(true);
      await acceptLegal(legalVersion);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "No fue posible registrar la aceptación.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingScreen message="Verificando términos y condiciones..." />;
  }

  if (!needsAcceptance) {
    return <LoadingScreen message="Redirigiendo..." />;
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page">
        <PageHeader
          title="Antes de continuar"
          subtitle="Para usar Ecobus, debes aceptar los términos y condiciones vigentes."
        />

        {error ? (
          <div className="ecobus-error-box" style={{ marginBottom: 16 }}>
            {error}
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
            <div className="ecobus-helper-text" style={{ marginBottom: 16 }}>
              Versión vigente: {legalVersion}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <input
              id="accept-terms"
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              style={{ marginTop: 4 }}
            />
            <label htmlFor="accept-terms" style={{ lineHeight: 1.5 }}>
              He leído y acepto los{" "}
              <a
                href={termsUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 700, textDecoration: "underline" }}
              >
                Términos y Condiciones
              </a>
              .
            </label>
          </div>

          <PrimaryButton
            type="button"
            disabled={saving || !checked}
            onClick={handleContinue}
          >
            {saving ? "Guardando..." : "Continuar"}
          </PrimaryButton>
        </section>
      </main>
    </div>
  );
}
