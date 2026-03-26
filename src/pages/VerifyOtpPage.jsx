import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/auth.js";
import { clearPendingEmail, getPendingEmail, setToken } from "../utils/auth.js";
import TextInput from "../components/ui/TextInput.jsx";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const pendingEmail = getPendingEmail();
    if (!pendingEmail) {
      navigate("/", { replace: true });
      return;
    }
    setEmail(pendingEmail);
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await verifyOtp(email, code.trim());
      const token = data?.access_token || data?.token;

      if (!token) {
        throw new Error("La API no devolvió token de acceso.");
      }

      setToken(token);
      clearPendingEmail();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "No fue posible validar el código.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page--auth">
        <section className="ecobus-auth-card">
          <div className="ecobus-brand-block">
           <div className="ecobus-logo-wrap">
             <img src="/logo-ecobus.png" alt="Ecobus" className="ecobus-logo-image" />
          </div> 

            <div>
              <h1 className="ecobus-title">Verifica tu acceso</h1>
            </div>

            <p className="ecobus-subtitle">
              Ingresa el código enviado a <strong>{email || "tu correo"}</strong>.
            </p>
          </div>

          <form className="ecobus-form" onSubmit={handleSubmit}>
            <TextInput
              label="Código OTP"
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="Ej: 123456"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
            />

            {error ? <div className="ecobus-error-box">{error}</div> : null}

            <PrimaryButton type="submit" disabled={loading || code.trim().length < 4}>
              {loading ? "Validando..." : "Ingresar"}
            </PrimaryButton>

            <p className="ecobus-helper-text">
              Si no recibiste el correo, vuelve atrás y solicita uno nuevo.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
