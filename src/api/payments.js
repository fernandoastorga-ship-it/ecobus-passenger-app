import { apiFetch } from "./client.js";

export async function getPayments() {
  return apiFetch("/app/payments/");
}

export async function initMonthlyPlanWebpay({ month, plan_type }) {
  return apiFetch("/app/payments/webpay/monthly-plan/init", {
    method: "POST",
    body: JSON.stringify({ month, plan_type }),
  });
}

export async function initDailyPassWebpay({ service_date, trip_type }) {
  return apiFetch("/app/payments/webpay/daily-pass/init", {
    method: "POST",
    body: JSON.stringify({ service_date, trip_type }),
  });
}
