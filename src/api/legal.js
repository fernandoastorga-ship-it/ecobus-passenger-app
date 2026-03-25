import { apiFetch } from './client'

export function getLegal() {
  return apiFetch('/app/legal/')
}

export function acceptLegal() {
  return apiFetch('/app/legal/accept', { method: 'POST' })
}
