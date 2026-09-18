import { useState } from 'react'

import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  resetPassword,
} from '../services/authService'

import {
  getApiErrorMessage,
} from '../../../services/apiError'

function ResetPasswordPage() {

  const navigate =
    useNavigate()

  const [searchParams] =
    useSearchParams()

  const token =
    searchParams.get('token')

  const [password, setPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const handleSubmit =
    async (event) => {

      event.preventDefault()

      setError('')

      if (!token) {

        setError(
          'El enlace de recuperación no es válido.',
        )

        return
      }

      if (
        password
        !== confirmPassword
      ) {

        setError(
          'Las contraseñas no coinciden.',
        )

        return
      }

      setSubmitting(true)

      try {

        await resetPassword(
          token,
          password,
        )

        navigate(
          '/login',
          {
            replace: true,
            state: {
              passwordReset: true,
            },
          },
        )

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudo restablecer la contraseña.',
          ),
        )

      } finally {

        setSubmitting(false)
      }
    }

  return (
    <>

      <div className="mb-4">

        <h1 className="h4 mb-2">
          Nueva contraseña
        </h1>

        <p className="text-secondary mb-0">
          Define una nueva contraseña
          para tu cuenta.
        </p>

      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="mb-3">

          <label className="form-label">
            Nueva contraseña
          </label>

          <input
            type="password"
            className="form-control"
            minLength={8}
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value,
              )
            }
            required
          />

          <div className="form-text">
            Mínimo 8 caracteres,
            incluyendo letras y números.
          </div>

        </div>

        <div className="mb-4">

          <label className="form-label">
            Repetir contraseña
          </label>

          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value,
              )
            }
            required
          />

        </div>

        <div className="d-grid mb-3">

          <button
            type="submit"
            className="btn btn-utp"
            disabled={submitting}
          >
            {
              submitting
                ? 'Actualizando...'
                : 'Guardar contraseña'
            }
          </button>

        </div>

      </form>

      <div className="text-center small">

        <Link to="/login">
          Volver al inicio de sesión
        </Link>

      </div>

    </>
  )
}

export default ResetPasswordPage