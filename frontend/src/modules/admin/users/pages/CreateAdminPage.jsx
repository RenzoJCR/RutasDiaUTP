import { useState } from 'react'

import { createAdmin } from '../services/adminUserService'
import { getApiErrorMessage } from '../../../../services/apiError'

function CreateAdminPage() {

  const [form, setForm] =
    useState({
      firstNames: '',
      lastNames: '',
      email: '',
      password: '',
    })

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

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
      setSuccess('')
      setSubmitting(true)

      try {

        const admin =
          await createAdmin(form)

        setSuccess(
          `Administrador ${admin.fullName} creado correctamente.`,
        )

        setForm({
          firstNames: '',
          lastNames: '',
          email: '',
          password: '',
        })

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudo crear el administrador.',
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
            Nuevo administrador
          </h1>

          <p className="text-secondary mb-0">
            Crea otra cuenta con permisos
            administrativos.
          </p>

        </div>

        <div className="content-card">

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

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
                placeholder="usuario@utp.edu.pe"
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

            <div className="mb-4">

              <label className="form-label">
                Contraseña temporal
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

            </div>

            <button
              type="submit"
              className="btn btn-utp"
              disabled={submitting}
            >
              {
                submitting
                  ? 'Creando...'
                  : 'Crear administrador'
              }
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default CreateAdminPage