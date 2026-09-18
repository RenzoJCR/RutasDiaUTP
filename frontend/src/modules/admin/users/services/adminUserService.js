import httpClient from '../../../../services/httpClient'

export async function getMentors() {

  const response =
    await httpClient.get(
      '/admin/users/mentors',
    )

  return response.data
}

export async function getAdmins() {

  const response =
    await httpClient.get(
      '/admin/users/admins',
    )

  return response.data
}

export async function updateMentorStatus(
  mentorId,
  active,
) {

  const response =
    await httpClient.patch(
      `/admin/users/mentors/${mentorId}/status`,
      {
        active,
      },
    )

  return response.data
}

export async function createAdmin(
  data,
) {

  const response =
    await httpClient.post(
      '/admin/users/admins',
      data,
    )

  return response.data
}