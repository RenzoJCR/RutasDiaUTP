export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || ''
).replace(/\/$/, '')

export const WS_URL = import.meta.env.VITE_WS_URL || ''