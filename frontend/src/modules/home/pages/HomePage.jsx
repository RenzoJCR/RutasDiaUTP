import { useEffect, useState } from 'react'

import StatusBadge from '../../../components/common/StatusBadge'
import { getBackendHealth } from '../services/systemService'

function HomePage() {
  const [backendStatus, setBackendStatus] = useState('loading')

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await getBackendHealth()

        if (data.status === 'UP') {
          setBackendStatus('online')
        } else {
          setBackendStatus('error')
        }
      } catch {
        setBackendStatus('offline')
      }
    }

    checkBackend()
  }, [])

  const renderBackendStatus = () => {
    if (backendStatus === 'loading') {
      return (
        <StatusBadge status="neutral">
          Comprobando...
        </StatusBadge>
      )
    }

    if (backendStatus === 'online') {
      return (
        <StatusBadge status="success">
          Conectado
        </StatusBadge>
      )
    }

    return (
      <StatusBadge status="danger">
        Sin conexión
      </StatusBadge>
    )
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-xl-10">

        <div className="mb-4">
          <h1 className="h3 mb-2">
            Rutas Día UTP
          </h1>

          <p className="text-secondary mb-0">
            Sistema de gestión de eventos Día UTP.
          </p>
        </div>

        <div className="content-card">
          <h2 className="h5 mb-4">
            Estado del sistema
          </h2>

          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="fw-semibold">
                Backend
              </div>

              <div className="text-secondary small">
                Spring Boot
              </div>
            </div>

            {renderBackendStatus()}
          </div>

        </div>

      </div>
    </div>
  )
}

export default HomePage