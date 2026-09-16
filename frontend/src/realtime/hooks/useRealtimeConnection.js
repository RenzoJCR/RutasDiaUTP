import { useEffect, useRef, useState } from 'react'

import { createStompClient } from '../stompClient'

export function useRealtimeConnection() {

  const clientRef = useRef(null)

  const [status, setStatus] = useState('connecting')
  const [lastMessage, setLastMessage] = useState(null)

  useEffect(() => {

    const client = createStompClient({

      onConnect: () => {

        setStatus('connected')

        client.subscribe('/topic/system', (message) => {

          const body = JSON.parse(message.body)

          setLastMessage(body)
        })
      },

      onDisconnect: () => {
        setStatus('disconnected')
      },

      onError: () => {
        setStatus('error')
      },
    })

    clientRef.current = client

    client.activate()

    return () => {

      clientRef.current = null

      void client.deactivate()
    }

  }, [])

  const sendTestMessage = () => {

    const client = clientRef.current

    if (!client?.connected) {
      return false
    }

    client.publish({
      destination: '/app/system/ping',

      body: JSON.stringify({
        message: 'Prueba de comunicación en tiempo real',
      }),
    })

    return true
  }

  return {
    status,
    lastMessage,
    sendTestMessage,
  }
}