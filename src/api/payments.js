import { apiFetch } from "./client.js";

export async function getPayments() {
  return apiFetch("/app/payments/");
}

export async function initMonthlyPlanWebpay({
  month,
  plan_type,
  use_webpay_fee = false,
}) {
  return apiFetch("/app/payments/webpay/monthly-plan/init", {
    method: "POST",
    body: JSON.stringify({ month, plan_type, use_webpay_fee }),
  });
}

export async function initDailyPassWebpay({
  service_date,
  trip_type,
  use_webpay_fee = false,
}) {
  return apiFetch("/app/payments/webpay/daily-pass/init", {
    method: "POST",
    body: JSON.stringify({ service_date, trip_type, use_webpay_fee }),
  });
}

export async function notifyTransfer({
  request_type,
  payload,
  notes = null,
}) {
  return apiFetch("/app/payments/transfer/notify", {
    method: "POST",
    body: JSON.stringify({
      request_type,
      payload,
      notes,
    }),
  });
}
