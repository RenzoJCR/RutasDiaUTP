import axios from 'axios'

import { BACKEND_URL } from '../../../config/env'

export async function getBackendHealth() {

  const response = await axios.get(
    `${BACKEND_URL}/actuator/health`,
    {
      timeout: 5000,
    },
  )

  return response.data
}