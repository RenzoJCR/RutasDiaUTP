export function getApiErrorMessage(
  error,
  fallback =
    'Ocurrió un error inesperado',
) {

  return (
    error.response?.data?.detail
    || error.response?.data?.message
    || fallback
  )
}