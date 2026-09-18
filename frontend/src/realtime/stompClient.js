import { Client } from '@stomp/stompjs'

import { WS_URL } from '../config/env'

import {
  getToken,
} from '../modules/auth/storage/authStorage'

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

    connectHeaders: {
      Authorization:
        `Bearer ${getToken() ?? ''}`,
    },

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