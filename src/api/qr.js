import { apiFetch } from './client'

export function getQrBundle() {
  return apiFetch('/app/qr/')
}
