import { Client } from '@stomp/stompjs'

import { WS_URL } from '../config/env'

function getBrokerUrl() {

  if (WS_URL) {
    return WS_URL
  }

  const protocol =
    window.location.protocol === 'https:'
      ? 'wss'
      : 'ws'

  return `${protocol}://${window.location.host}/ws`
}

export function createStompClient({
  onConnect,
  onDisconnect,
  onError,
}) {

  return new Client({

    brokerURL: getBrokerUrl(),

    reconnectDelay: 3000,

    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: () => {},

    onConnect,

    onDisconnect,

    onStompError: (frame) => {
      onError?.(frame)
    },

    onWebSocketError: (error) => {
      onError?.(error)
    },

    onWebSocketClose: () => {
      onDisconnect?.()
    },
  })
}