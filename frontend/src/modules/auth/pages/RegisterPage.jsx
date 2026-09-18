import { useState } from 'react'
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../../../services/apiError'

function RegisterPage() {

  const navigate = useNavigate()

  const {
    user,
    register,
  } = useAuth()

  const [form, setForm] =
    useState({
      firstNames: '',
      lastNames: '',
      email: '',
      password: '',
      confirmPassword: '',
    })

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

  const updateField =
    (field, value) => {

      setForm(
        (current) => ({
          ...current,
          [field]: value,
        }),
      )
    }

  const handleSubmit =
    async (event) => {

      event.preventDefault()

      setError('')

      if (
        !form.email
          .toLowerCase()
          .endsWith('@utp.edu.pe')
      ) {

        setError(
          'Debes utilizar tu correo institucional UTP.',
        )

        return
      }

      if (
        form.password
        !== form.confirmPassword
      ) {

        setError(
          'Las contraseñas no coinciden.',
        )

        return
      }

      setSubmitting(true)

      try {

        await register({
          firstNames:
            form.firstNames,
          lastNames:
            form.lastNames,
          email:
            form.email,
          password:
            form.password,
        })

        navigate(
          '/login',
          {
            replace: true,
            state: {
              registered: true,
            },
          },
        )

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudo crear la cuenta.',
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
          Registro de mentor
        </h1>

        <p className="text-secondary mb-0">
          Crea tu cuenta con tu correo
          institucional UTP.
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

          <label className="form-label">
            Nombres
          </label>

          <input
            className="form-control"
            value={form.firstNames}
            onChange={(event) =>
              updateField(
                'firstNames',
                event.target.value,
              )
            }
            required
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Apellidos
          </label>

          <input
            className="form-control"
            value={form.lastNames}
            onChange={(event) =>
              updateField(
                'lastNames',
                event.target.value,
              )
            }
            required
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Correo institucional
          </label>

          <input
            type="email"
            className="form-control"
            placeholder="codigo@utp.edu.pe"
            value={form.email}
            onChange={(event) =>
              updateField(
                'email',
                event.target.value,
              )
            }
            required
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Contraseña
          </label>

          <input
            type="password"
            className="form-control"
            value={form.password}
            onChange={(event) =>
              updateField(
                'password',
                event.target.value,
              )
            }
            minLength={8}
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
            value={form.confirmPassword}
            onChange={(event) =>
              updateField(
                'confirmPassword',
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
                ? 'Creando cuenta...'
                : 'Crear cuenta'
            }
          </button>

        </div>

      </form>

      <div className="text-center small">

        ¿Ya tienes una cuenta?{' '}

        <Link to="/login">
          Iniciar sesión
        </Link>

      </div>

    </>
  )
}

export default RegisterPage