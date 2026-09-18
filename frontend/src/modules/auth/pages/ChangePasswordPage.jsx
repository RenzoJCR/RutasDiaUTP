import { useState } from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  changePassword,
} from '../services/authService'

import {
  getApiErrorMessage,
} from '../../../services/apiError'

import {
  useAuth,
} from '../hooks/useAuth'

function ChangePasswordPage() {

  const navigate =
    useNavigate()

  const {
    logout,
  } = useAuth()

  const [currentPassword, setCurrentPassword] =
    useState('')

  const [newPassword, setNewPassword] =
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

      if (
        newPassword
        !== confirmPassword
      ) {

        setError(
          'Las nuevas contraseñas no coinciden.',
        )

        return
      }

      setSubmitting(true)

      try {

        await changePassword(
          currentPassword,
          newPassword,
        )

        logout()

        navigate(
          '/login',
          {
            replace: true,
            state: {
              passwordChanged: true,
            },
          },
        )

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudo cambiar la contraseña.',
          ),
        )

      } finally {

        setSubmitting(false)
      }
    }

  return (
    <div className="row">

      <div className="col-12 col-lg-7 col-xl-6">

        <div className="mb-4">

          <h1 className="h3 mb-2">
            Cambiar contraseña
          </h1>

          <p className="text-secondary mb-0">
            Actualiza la contraseña de tu cuenta.
          </p>

        </div>

        <div className="content-card">

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label">
                Contraseña actual
              </label>

              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value,
                  )
                }
                required
              />

            </div>

            <div className="mb-3">

              <label className="form-label">
                Nueva contraseña
              </label>

              <input
                type="password"
                className="form-control"
                minLength={8}
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value,
                  )
                }
                required
              />

              <div className="form-text">
                Debe contener letras y números.
              </div>

            </div>

            <div className="mb-4">

              <label className="form-label">
                Repetir nueva contraseña
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

            <button
              type="submit"
              className="btn btn-utp"
              disabled={submitting}
            >
              {
                submitting
                  ? 'Actualizando...'
                  : 'Cambiar contraseña'
              }
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default ChangePasswordPage