import { apiFetch } from "./client.js";

export async function getQrBundle() {
  return apiFetch("/app/qr/"); // 👈 bundle completo
}

export function getMonthlyQrImageUrl() {
  return "/app/qr/monthly/image";
}

export function getDailyQrImageUrl() {
  return "/app/qr/daily-pass/image";
}
