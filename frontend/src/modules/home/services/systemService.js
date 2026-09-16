import axios from 'axios'

export async function getBackendHealth() {
  const response = await axios.get('/actuator/health', {
    timeout: 5000,
  })

  return response.data
}