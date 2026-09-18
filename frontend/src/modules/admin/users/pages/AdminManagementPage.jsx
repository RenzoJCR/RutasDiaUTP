import {
  useEffect,
  useState,
} from 'react'

import StatusBadge from '../../../../components/common/StatusBadge'
import { useAuth } from '../../../auth/hooks/useAuth'
import { getApiErrorMessage } from '../../../../services/apiError'

import {
  createAdmin,
  getAdmins,
  updateAdmin,
  updateAdminStatus,
} from '../services/adminUserService'

const emptyCreateForm = {
  firstNames: '',
  lastNames: '',
  email: '',
  password: '',
}

function AdminManagementPage() {

  const {
    user,
    logout,
    refreshUser,
  } = useAuth()

  const [admins, setAdmins] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const [showCreate, setShowCreate] =
    useState(false)

  const [editingAdmin, setEditingAdmin] =
    useState(null)

  const [createForm, setCreateForm] =
    useState(emptyCreateForm)

  const [editForm, setEditForm] =
    useState({
      firstNames: '',
      lastNames: '',
      email: '',
    })

  useEffect(() => {

    let active = true

    getAdmins()
      .then((data) => {

        if (active) {
          setAdmins(data)
        }

      })
      .catch((requestError) => {

        if (active) {

          setError(
            getApiErrorMessage(
              requestError,
              'No se pudieron cargar los administradores.',
            ),
          )
        }

      })
      .finally(() => {

        if (active) {
          setLoading(false)
        }

      })

    return () => {
      active = false
    }

  }, [])

  const replaceAdmin =
    (updatedAdmin) => {

      setAdmins(
        (current) =>
          current.map(
            (admin) =>
              admin.id === updatedAdmin.id
                ? updatedAdmin
                : admin,
          ),
      )
    }

  const handleCreate =
    async (event) => {

      event.preventDefault()

      setError('')
      setSuccess('')

      try {

        const admin =
          await createAdmin(createForm)

        setAdmins(
          (current) =>
            [...current, admin]
              .sort(
                (a, b) =>
                  a.fullName.localeCompare(
                    b.fullName,
                  ),
              ),
        )

        setCreateForm(emptyCreateForm)
        setShowCreate(false)

        setSuccess(
          `Administrador ${admin.fullName} creado correctamente.`,
        )

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudo crear el administrador.',
          ),
        )
      }
    }

  const startEditing =
    (admin) => {

      setShowCreate(false)

      setEditingAdmin(admin)

      setEditForm({
        firstNames: admin.firstNames,
        lastNames: admin.lastNames,
        email: admin.email,
      })

      setError('')
      setSuccess('')
    }

  const handleEdit =
    async (event) => {

      event.preventDefault()

      if (!editingAdmin) {
        return
      }

      try {

        setError('')
        setSuccess('')

        const oldEmail =
          editingAdmin.email

        const updated =
          await updateAdmin(
            editingAdmin.id,
            editForm,
          )

        replaceAdmin(updated)

        setEditingAdmin(null)

        setSuccess(
          `Administrador ${updated.fullName} actualizado correctamente.`,
        )

        if (updated.id === user.id) {

          if (oldEmail !== updated.email) {

            window.alert(
              'Tu correo cambió. Debes iniciar sesión nuevamente.',
            )

            logout()
            return
          }

          await refreshUser()
        }

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudo actualizar el administrador.',
          ),
        )
      }
    }

  const changeStatus =
    async (admin) => {

      const newStatus =
        !admin.active

      const action =
        newStatus
          ? 'reactivar'
          : 'inhabilitar'

      const confirmed =
        window.confirm(
          `¿Deseas ${action} a ${admin.fullName}?`,
        )

      if (!confirmed) {
        return
      }

      try {

        setError('')
        setSuccess('')

        const updated =
          await updateAdminStatus(
            admin.id,
            newStatus,
          )

        replaceAdmin(updated)

        setSuccess(
          `Estado de ${updated.fullName} actualizado.`,
        )

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudo cambiar el estado del administrador.',
          ),
        )
      }
    }

  return (
    <div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

        <div>

          <h1 className="h3 mb-2">
            Administradores
          </h1>

          <p className="text-secondary mb-0">
            Gestiona las cuentas administrativas del sistema.
          </p>

        </div>

        <button
          type="button"
          className="btn btn-utp"
          onClick={() => {

            setEditingAdmin(null)

            setShowCreate(
              (current) => !current,
            )
          }}
        >
          Nuevo administrador
        </button>

      </div>

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

      {showCreate && (

        <div className="content-card mb-4">

          <h2 className="h5 mb-3">
            Crear administrador
          </h2>

          <form onSubmit={handleCreate}>

            <div className="row">

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Nombres
                </label>

                <input
                  className="form-control"
                  value={createForm.firstNames}
                  onChange={(event) =>
                    setCreateForm(
                      (current) => ({
                        ...current,
                        firstNames:
                          event.target.value,
                      }),
                    )
                  }
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Apellidos
                </label>

                <input
                  className="form-control"
                  value={createForm.lastNames}
                  onChange={(event) =>
                    setCreateForm(
                      (current) => ({
                        ...current,
                        lastNames:
                          event.target.value,
                      }),
                    )
                  }
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Correo institucional
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={createForm.email}
                  onChange={(event) =>
                    setCreateForm(
                      (current) => ({
                        ...current,
                        email:
                          event.target.value,
                      }),
                    )
                  }
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Contraseña temporal
                </label>

                <input
                  type="password"
                  className="form-control"
                  minLength={8}
                  value={createForm.password}
                  onChange={(event) =>
                    setCreateForm(
                      (current) => ({
                        ...current,
                        password:
                          event.target.value,
                      }),
                    )
                  }
                  required
                />

              </div>

            </div>

            <div className="d-flex gap-2">

              <button
                type="submit"
                className="btn btn-utp"
              >
                Crear
              </button>

              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() =>
                  setShowCreate(false)
                }
              >
                Cancelar
              </button>

            </div>

          </form>

        </div>

      )}

      {editingAdmin && (

        <div className="content-card mb-4">

          <h2 className="h5 mb-3">
            Editar administrador
          </h2>

          <form onSubmit={handleEdit}>

            <div className="row">

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Nombres
                </label>

                <input
                  className="form-control"
                  value={editForm.firstNames}
                  onChange={(event) =>
                    setEditForm(
                      (current) => ({
                        ...current,
                        firstNames:
                          event.target.value,
                      }),
                    )
                  }
                  required
                />

              </div>

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Apellidos
                </label>

                <input
                  className="form-control"
                  value={editForm.lastNames}
                  onChange={(event) =>
                    setEditForm(
                      (current) => ({
                        ...current,
                        lastNames:
                          event.target.value,
                      }),
                    )
                  }
                  required
                />

              </div>

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Correo
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={editForm.email}
                  onChange={(event) =>
                    setEditForm(
                      (current) => ({
                        ...current,
                        email:
                          event.target.value,
                      }),
                    )
                  }
                  required
                />

              </div>

            </div>

            <div className="d-flex gap-2">

              <button
                type="submit"
                className="btn btn-utp"
              >
                Guardar cambios
              </button>

              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() =>
                  setEditingAdmin(null)
                }
              >
                Cancelar
              </button>

            </div>

          </form>

        </div>

      )}

      <div className="content-card">

        {loading ? (

          <div className="text-secondary">
            Cargando administradores...
          </div>

        ) : (

          <div className="table-responsive">

            <table className="table align-middle">

              <thead>

                <tr>
                  <th>Administrador</th>
                  <th>Correo</th>
                  <th>Estado</th>
                  <th className="text-end">
                    Acciones
                  </th>
                </tr>

              </thead>

              <tbody>

                {admins.map(
                  (admin) => {

                    const isCurrentUser =
                      admin.id === user.id

                    return (

                      <tr key={admin.id}>

                        <td>

                          <div className="fw-semibold">
                            {admin.fullName}
                          </div>

                          {isCurrentUser && (
                            <div className="small text-secondary">
                              Tu cuenta
                            </div>
                          )}

                        </td>

                        <td>
                          {admin.email}
                        </td>

                        <td>

                          <StatusBadge
                            status={
                              admin.active
                                ? 'success'
                                : 'neutral'
                            }
                          >
                            {
                              admin.active
                                ? 'Activo'
                                : 'Inactivo'
                            }
                          </StatusBadge>

                        </td>

                        <td className="text-end">

                          <div className="d-flex justify-content-end gap-2">

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() =>
                                startEditing(admin)
                              }
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className={
                                admin.active
                                  ? 'btn btn-sm btn-outline-danger'
                                  : 'btn btn-sm btn-outline-dark'
                              }
                              disabled={
                                isCurrentUser
                                && admin.active
                              }
                              onClick={() =>
                                changeStatus(admin)
                              }
                            >
                              {
                                admin.active
                                  ? 'Inhabilitar'
                                  : 'Reactivar'
                              }
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  },
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}

export default AdminManagementPage