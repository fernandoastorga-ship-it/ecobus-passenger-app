import { getAccessToken, clearSession } from '../utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ecobus-api.onrender.com'

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const detail = isJson ? data?.detail || data?.message || 'Error en la solicitud' : 'Error en la solicitud'
    const error = new Error(detail)
    error.status = response.status
    error.data = data
    if (response.status === 401) {
      clearSession()
    }
    throw error
  }

  return data
}

export async function apiFetch(path, options = {}) {
  const token = getAccessToken()
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  return parseResponse(response)
}

export { API_BASE_URL }
