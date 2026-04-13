import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth.js";
import { getLegal } from "../api/legal.js";
import LoadingScreen from "./LoadingScreen.jsx";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const [checkingLegal, setCheckingLegal] = useState(true);
  const [mustAcceptTerms, setMustAcceptTerms] = useState(false);
  const [legalError, setLegalError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkLegalStatus() {
      try {
        setCheckingLegal(true);
        setLegalError("");

        if (!isAuthenticated()) {
          return;
        }

        const data = await getLegal();
        const needsAcceptance = data?.acceptance?.needs_acceptance === true;

        if (mounted) {
          setMustAcceptTerms(needsAcceptance);
        }
      } catch (err) {
        if (mounted) {
          setLegalError(err.message || "No fue posible verificar términos y condiciones.");
        }
      } finally {
        if (mounted) {
          setCheckingLegal(false);
        }
      }
    }

    checkLegalStatus();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (checkingLegal) {
    return <LoadingScreen message="Verificando acceso..." />;
  }

  if (legalError) {
    return (
      <div className="ecobus-app">
        <main className="ecobus-page">
          <div className="ecobus-error-box">{legalError}</div>
        </main>
      </div>
    );
  }

  if (mustAcceptTerms && location.pathname !== "/terms-required") {
    return <Navigate to="/terms-required" replace />;
  }

  return children;
}
