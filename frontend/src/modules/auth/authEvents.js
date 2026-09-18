export const AUTH_EXPIRED_EVENT =
  'rutas-dia-utp:auth-expired'

export function notifyAuthExpired() {
  window.dispatchEvent(
    new Event(AUTH_EXPIRED_EVENT),
  )
}