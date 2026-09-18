import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  forgotPassword,
} from '../services/authService'

import {
  getApiErrorMessage,
} from '../../../services/apiError'

function ForgotPasswordPage() {

  const [email, setEmail] =
    useState('')

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const handleSubmit =
    async (event) => {

      event.preventDefault()

      setError('')
      setMessage('')
      setSubmitting(true)

      try {

        const response =
          await forgotPassword(email)

        setMessage(
          response.message,
        )

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudo procesar la solicitud.',
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
          Recuperar contraseña
        </h1>

        <p className="text-secondary mb-0">
          Ingresa tu correo institucional UTP.
        </p>

      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="mb-4">

          <label className="form-label">
            Correo institucional
          </label>

          <input
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
                ? 'Procesando...'
                : 'Recuperar contraseña'
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

export default ForgotPasswordPage