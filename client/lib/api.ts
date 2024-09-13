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
    first_name: firstName,
    last_name: lastName,
    email
  }
  try {
    const response = await api.post('api/users/', data)
    return response
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function getUsers() {
  try {
    const response = await api.get('api/users/')

    const usersWithDetails = response.data.map((user: any) => {
      const fullName = `${user.first_name} ${user.last_name}`
      const firstInitial = user.first_name?.[0] || ''
      const lastInitial = user.last_name?.[0] || ''
      const initials = `${firstInitial}${lastInitial}`
      const isStaff = user.is_staff

      return {
        ...user,
        initials,
        fullName,
        isStaff
      }
    })

    return usersWithDetails
  } catch (e) {
    return Promise.reject(e)
  }
}
