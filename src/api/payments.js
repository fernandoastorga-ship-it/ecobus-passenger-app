import { apiFetch } from "./client.js";

export async function getPayments() {
  return apiFetch("/app/payments");
}
