import { apiFetch } from './client'

export function getPayments() {
  return apiFetch('/app/payments/')
}
