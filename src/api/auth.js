import { apiFetch } from './client'

export function requestOtp(identifier) {
  return apiFetch('/app/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
  })
}

export function verifyOtp(identifier, code) {
  return apiFetch('/app/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier, code }),
  })
}

export function getMe() {
  return apiFetch('/app/auth/me')
}

export function logout() {
  return apiFetch('/app/auth/logout', { method: 'POST' })
}
