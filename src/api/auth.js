import { apiFetch } from "./client.js";

export async function requestOtp(email) {
  return apiFetch("/app/auth/request-otp", {
    method: "POST",
    body: JSON.stringify({ identifier: email }),
  });
}

export async function verifyOtp(email, code) {
  return apiFetch("/app/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ identifier: email, code }),
  });
}
