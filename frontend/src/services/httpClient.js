import axios from 'axios'

import { BACKEND_URL } from '../config/env'

const httpClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
  },
})

export default httpClient