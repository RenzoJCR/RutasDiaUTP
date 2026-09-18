import {
  useEffect,
  useState,
} from 'react'

import StatusBadge from '../../../../components/common/StatusBadge'
import { getApiErrorMessage } from '../../../../services/apiError'

import {
  getMentors,
  updateMentorStatus,
} from '../services/adminUserService'

function MentorManagementPage() {

  const [mentors, setMentors] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const loadMentors =
    async () => {

      try {

        setError('')

        const data =
          await getMentors()

        setMentors(data)

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudieron cargar los mentores.',
          ),
        )

      } finally {

        setLoading(false)
      }
    }

  useEffect(() => {
    loadMentors()
  }, [])

  const changeStatus =
    async (mentor) => {

      const newStatus =
        !mentor.active

      const action =
        newStatus
          ? 'reactivar'
          : 'inhabilitar'

      const confirmed =
        window.confirm(
          `¿Deseas ${action} a ${mentor.fullName}?`,
        )

      if (!confirmed) {
        return
      }

      try {

        const updatedMentor =
          await updateMentorStatus(
            mentor.id,
            newStatus,
          )

        setMentors(
          (current) =>
            current.map(
              (item) =>
                item.id
                  === updatedMentor.id
                  ? updatedMentor
                  : item,
            ),
        )

      } catch (requestError) {

        setError(
          getApiErrorMessage(
            requestError,
            'No se pudo actualizar el mentor.',
          ),
        )
      }
    }

  return (
    <div>

      <div className="mb-4">

        <h1 className="h3 mb-2">
          Mentores
        </h1>

        <p className="text-secondary mb-0">
          Mentores registrados en el sistema.
        </p>

      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="content-card">

        {loading ? (

          <div className="text-secondary">
            Cargando mentores...
          </div>

        ) : mentors.length === 0 ? (

          <div className="text-secondary">
            Aún no hay mentores registrados.
          </div>

        ) : (

          <div className="table-responsive">

            <table className="table align-middle">

              <thead>

                <tr>
                  <th>Mentor</th>
                  <th>Correo</th>
                  <th>Estado</th>
                  <th className="text-end">
                    Acción
                  </th>
                </tr>

              </thead>

              <tbody>

                {mentors.map(
                  (mentor) => (

                    <tr key={mentor.id}>

                      <td>
                        <div className="fw-semibold">
                          {mentor.fullName}
                        </div>
                      </td>

                      <td>
                        {mentor.email}
                      </td>

                      <td>

                        <StatusBadge
                          status={
                            mentor.active
                              ? 'success'
                              : 'neutral'
                          }
                        >

                          {
                            mentor.active
                              ? 'Activo'
                              : 'Inactivo'
                          }

                        </StatusBadge>

                      </td>

                      <td className="text-end">

                        <button
                          type="button"
                          className={
                            mentor.active
                              ? 'btn btn-sm btn-outline-danger'
                              : 'btn btn-sm btn-outline-dark'
                          }
                          onClick={() =>
                            changeStatus(
                              mentor,
                            )
                          }
                        >

                          {
                            mentor.active
                              ? 'Inhabilitar'
                              : 'Reactivar'
                          }

                        </button>

                      </td>

                    </tr>

                  ),
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}

export default MentorManagementPage