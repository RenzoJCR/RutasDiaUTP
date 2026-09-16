import { useEffect, useState } from 'react'

import StatusBadge from '../../../components/common/StatusBadge'
import { useRealtimeConnection } from '../../../realtime/hooks/useRealtimeConnection'
import { getBackendHealth } from '../services/systemService'

function HomePage() {

  const [backendStatus, setBackendStatus] =
    useState('loading')

  const {
    status: realtimeStatus,
    lastMessage,
    sendTestMessage,
  } = useRealtimeConnection()

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

  const backendBadge = () => {

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

  const realtimeBadge = () => {

    if (realtimeStatus === 'connected') {
      return (
        <StatusBadge status="success">
          Conectado
        </StatusBadge>
      )
    }

    if (realtimeStatus === 'connecting') {
      return (
        <StatusBadge status="warning">
          Conectando...
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

        <div className="content-card mb-3">

          <h2 className="h5 mb-4">
            Estado del sistema
          </h2>

          <div className="system-row">

            <div>
              <div className="fw-semibold">
                Backend
              </div>

              <div className="text-secondary small">
                Spring Boot
              </div>
            </div>

            {backendBadge()}

          </div>

          <hr />

          <div className="system-row">

            <div>
              <div className="fw-semibold">
                Tiempo real
              </div>

              <div className="text-secondary small">
                WebSocket + STOMP
              </div>
            </div>

            {realtimeBadge()}

          </div>

        </div>

        <div className="content-card">

          <h2 className="h5 mb-3">
            Prueba de comunicación
          </h2>

          <p className="text-secondary">
            Envía un mensaje al backend mediante WebSocket
            y recibe la respuesta sin actualizar la página.
          </p>

          <button
            type="button"
            className="btn btn-utp"
            disabled={realtimeStatus !== 'connected'}
            onClick={sendTestMessage}
          >
            Probar tiempo real
          </button>

          {lastMessage && (

            <div className="realtime-response mt-4">

              <div className="fw-semibold mb-1">
                Mensaje recibido
              </div>

              <div>
                {lastMessage.message}
              </div>

              <div className="text-secondary small mt-1">
                {new Date(
                  lastMessage.timestamp,
                ).toLocaleString()}
              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default HomePage