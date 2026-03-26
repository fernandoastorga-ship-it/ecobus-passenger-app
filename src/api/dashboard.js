import { apiFetch } from "./client.js";

export async function getDashboard() {
  return apiFetch("/app/dashboard");
}
