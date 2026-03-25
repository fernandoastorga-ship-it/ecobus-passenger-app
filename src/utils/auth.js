const TOKEN_KEY = 'ecobus_access_token'
const IDENTIFIER_KEY = 'ecobus_identifier'

export function saveSession({ accessToken, identifier }) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  if (identifier) {
    localStorage.setItem(IDENTIFIER_KEY, identifier)
  }
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getSavedIdentifier() {
  return localStorage.getItem(IDENTIFIER_KEY) || ''
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(getAccessToken())
}
