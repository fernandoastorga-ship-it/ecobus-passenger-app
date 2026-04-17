import { apiFetch } from "./client.js";

export async function getBusTracking() {
  return apiFetch("/app/bus-tracking/");
}
