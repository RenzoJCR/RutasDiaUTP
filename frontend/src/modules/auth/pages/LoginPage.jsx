import { useState } from 'react'
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '../../../services/apiError'

function LoginPage() {

  const navigate = useNavigate()

  const {
    user,
    login,
  } = useAuth()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  if (user) {

    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  const handleSubmit =
    async (event) => {

      event.preventDefault()

      setError('')
      setSubmitting(true)

      try {

        const loggedUser =
          await login(
            email,
            password,
          )

        if (
          loggedUser.role
          === 'ADMINISTRADOR'
        ) {

          navigate(
            '/admin/mentores',
            {
              replace: true,
            },
          )

        } else {

          navigate(
            '/',
            {
              replace: true,
            },
          )
        }

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'Correo o contraseña incorrectos',
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
          Iniciar sesión
        </h1>

        <p className="text-secondary mb-0">
          Ingresa con tu cuenta de Día UTP.
        </p>

      </div>

      {error && (

        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>

      )}

      <form
        onSubmit={handleSubmit}
      >

        <div className="mb-3">

          <label
            className="form-label"
            htmlFor="email"
          >
            Correo institucional
          </label>

          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="codigo@utp.edu.pe"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            required
            autoComplete="email"
          />

        </div>

        <div className="mb-3">

          <label
            className="form-label"
            htmlFor="password"
          >
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value,
              )
            }
            required
            autoComplete="current-password"
          />

        </div>

        <div className="d-grid mb-3">

          <button
            className="btn btn-utp"
            type="submit"
            disabled={submitting}
          >
            {
              submitting
                ? 'Ingresando...'
                : 'Ingresar'
            }
          </button>

        </div>

      </form>

      <div className="text-center small">

        ¿Aún no tienes una cuenta?{' '}

        <Link to="/registro">
          Registrarme como mentor
        </Link>

      </div>

    </>
  )
}

export default LoginPage