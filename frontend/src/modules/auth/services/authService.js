import httpClient from '../../../services/httpClient'

export async function loginUser(
  email,
  password,
) {

  const response =
    await httpClient.post(
      '/auth/login',
      {
        email,
        password,
      },
    )

  return response.data
}

export async function registerMentor(data) {

  const response =
    await httpClient.post(
      '/auth/register',
      data,
    )

  return response.data
}

export async function getCurrentUser() {

  const response =
    await httpClient.get(
      '/auth/me',
    )

  return response.data
}