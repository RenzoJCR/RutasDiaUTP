import axios from 'axios'

import { BACKEND_URL } from '../config/env'
import {
  getToken,
  removeToken,
} from '../modules/auth/storage/authStorage'
import {
  notifyAuthExpired,
} from '../modules/auth/authEvents'

const httpClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use(
  (config) => {

    const token = getToken()

    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
    ]

    const isPublicEndpoint =
      publicEndpoints.some(
        (endpoint) =>
          config.url?.includes(endpoint),
      )

    if (token && !isPublicEndpoint) {

      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  },
)

httpClient.interceptors.response.use(
  (response) => response,

  (error) => {

    const status =
      error.response?.status

    const token = getToken()

    if (status === 401 && token) {

      removeToken()
      notifyAuthExpired()
    }

    return Promise.reject(error)
  },
)

export default httpClient