import { apiFetch } from "./client.js";

export async function getQr() {
  return apiFetch("/app/qr");
}
