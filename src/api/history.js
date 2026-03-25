import { apiFetch } from './client'

export function getHistory(limit = 20, offset = 0) {
  return apiFetch(`/app/history/?limit=${limit}&offset=${offset}`)
}
