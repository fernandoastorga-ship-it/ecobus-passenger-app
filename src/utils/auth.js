const TOKEN_KEY = "ecobus_access_token";
const EMAIL_KEY = "ecobus_login_email";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function setPendingEmail(email) {
  localStorage.setItem(EMAIL_KEY, email);
}

export function getPendingEmail() {
  return localStorage.getItem(EMAIL_KEY);
}

export function clearPendingEmail() {
  localStorage.removeItem(EMAIL_KEY);
}

export function logout() {
  clearToken();
  clearPendingEmail();
}
