import { getToken } from "../utils/auth.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ecobus-api.onrender.com";

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.detail) ||
      (typeof data === "string" && data) ||
      "Ocurrió un error al consultar la API.";
    throw new Error(message);
  }

  return data;
}
