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

export async function changePassword(
  currentPassword,
  newPassword,
) {

  const response =
    await httpClient.post(
      '/auth/password/change',
      {
        currentPassword,
        newPassword,
      },
    )

  return response.data
}

export async function forgotPassword(
  email,
) {

  const response =
    await httpClient.post(
      '/auth/password/forgot',
      {
        email,
      },
    )

  return response.data
}

export async function resetPassword(
  token,
  newPassword,
) {

  const response =
    await httpClient.post(
      '/auth/password/reset',
      {
        token,
        newPassword,
      },
    )

  return response.data
}