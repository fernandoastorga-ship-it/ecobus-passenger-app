import { apiFetch } from "./client.js";

export async function getHistory(limit = 20, offset = 0) {
  return apiFetch(`/app/history?limit=${limit}&offset=${offset}`);
}
