import { apiFetch } from './client'

export function getDashboard() {
  return apiFetch('/app/dashboard/')
}
