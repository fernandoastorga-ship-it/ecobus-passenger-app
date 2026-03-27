import { apiFetch } from "./client.js";

export async function getPayments() {
  return apiFetch("/app/payments/");
}

export async function purchaseMonthlyPlan({ month, plan_type }) {
  return apiFetch("/app/payments/monthly-plan/purchase", {
    method: "POST",
    body: JSON.stringify({ month, plan_type }),
  });
}

export async function purchaseDailyPass({ service_date, trip_type }) {
  return apiFetch("/app/payments/daily-pass/purchase", {
    method: "POST",
    body: JSON.stringify({ service_date, trip_type }),
  });
}
