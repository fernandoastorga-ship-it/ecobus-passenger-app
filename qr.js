import { apiFetch } from "./client.js";

export async function getLegal() {
  return apiFetch("/app/legal");
}

export async function acceptLegal(version) {
  return apiFetch("/app/legal/accept", {
    method: "POST",
    body: JSON.stringify({ version }),
  });
}
