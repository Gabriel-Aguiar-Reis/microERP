import api from '@/lib/axios'

export async function postToken(username: string, password: string) {
  const data = {
    username,
    password
  }

  try {
    const response = await api.post('token/', data)

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.access)
      api.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.access}`
    }
    return response
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function postUser(
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string
) {
  const data = {
    username,
    password,
    firstName,
    lastName,
    email
  }
  try {
    await api.post('api/users/', data)
  } catch (e) {
    return Promise.reject(e)
  }
}
