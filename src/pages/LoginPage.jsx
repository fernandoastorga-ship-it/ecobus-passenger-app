import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtp } from "../api/auth.js";
import { setPendingEmail } from "../utils/auth.js";
import TextInput from "../components/ui/TextInput.jsx";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await requestOtp(email.trim());
      setPendingEmail(email.trim());
      navigate("/verify-otp");
    } catch (err) {
      setError(err.message || "No fue posible enviar el código de acceso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ecobus-app">
      <main className="ecobus-page--auth">
        <section className="ecobus-auth-card">
          <div className="ecobus-brand-block">
            <div className="ecobus-logo-badge">E</div>

            <div>
              <h1 className="ecobus-title">Bienvenido a Ecobus</h1>
            </div>

            <p className="ecobus-subtitle">
              Accede a tu cuenta para revisar tu plan, tu código QR y el estado
              de tus viajes.
            </p>
          </div>

          <form className="ecobus-form" onSubmit={handleSubmit}>
            <TextInput
              label="Correo electrónico"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@empresa.cl"
              autoComplete="email"
              inputMode="email"
            />

            {error ? <div className="ecobus-error-box">{error}</div> : null}

            <PrimaryButton type="submit" disabled={loading || !email.trim()}>
              {loading ? "Enviando código..." : "Enviar código de acceso"}
            </PrimaryButton>

            <p className="ecobus-helper-text">
              Te enviaremos un código temporal a tu correo electrónico para
              ingresar de forma segura.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
