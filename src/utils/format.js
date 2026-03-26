export function formatDate(value) {
  if (!value) return "Sin fecha";
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

export function formatShortDate(value) {
  if (!value) return "Sin fecha";
  try {
    return new Date(value).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

export function normalizePaymentStatus(status) {
  const value = String(status || "").toLowerCase();
  if (["paid", "pagado", "active", "activo"].includes(value)) {
    return { label: "Pagado", tone: "success" };
  }
  if (["pending", "pendiente"].includes(value)) {
    return { label: "Pendiente", tone: "warning" };
  }
  return { label: "Vencido", tone: "danger" };
}
