import { User } from '@/components/blocks/sellers'
import api from '@/lib/axios'
import { toast } from 'sonner'

export async function postToken(username: string, password: string) {
  const data = {
    username,
    password
  }

  try {
    const response = await api.post('token/', data)

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
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
  email: string,
  fetchUsers?: () => Promise<void>
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
    toast.success('Usuário criado com sucesso!', {
      description: `${username} foi criado.`
    })
    if (fetchUsers) {
      await fetchUsers()
    }
    return response
  } catch (e) {
    toast.warning('Usuário não foi criado!', {
      description: `Houve erro ao tentar criar o usuário ${username}.`
    })
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
      const username = user.username

      return {
        ...user,
        initials,
        fullName,
        isStaff,
        username
      }
    })

    return usersWithDetails
  } catch (e) {
    return Promise.reject(e)
  }
}

type PatchUserParams = {
  id: string
  username?: string
  password?: string
  firstName?: string
  lastName?: string
  email?: string
  isStaff?: boolean
  fetchUsers?: () => Promise<void>
  workOn?: string
}

export async function patchUser({
  id,
  username,
  password,
  firstName,
  lastName,
  email,
  isStaff,
  fetchUsers,
  workOn
}: PatchUserParams) {
  const data: Record<string, any> = {}

  if (username !== undefined) data.username = username
  if (password !== undefined) data.passsword = password
  if (firstName !== undefined) data.first_name = firstName
  if (lastName !== undefined) data.last_name = lastName
  if (email !== undefined) data.email = email
  if (workOn !== undefined) data.work_on = workOn
  if (isStaff !== undefined) data.is_staff = isStaff
  try {
    const response = await api.patch(`api/users/${id}/`, data)
    toast.success('Usuário modificado com sucesso!', {
      description: `${username} teve seus dados modificados.`
    })
    if (fetchUsers) {
      await fetchUsers()
    }
    return response
  } catch (e) {
    toast.warning('Usuário não foi modificado!', {
      description: `Houve erro ao tentar modificar o usuário ${username}.`
    })
    return Promise.reject(e)
  }
}

export async function deleteUser(
  id: string,
  username: string,
  fetchUsers: () => Promise<void>
) {
  try {
    const response = await api.delete(`api/users/${id}/`)
    toast.success('Usuário deletado com sucesso!', {
      description: `${username} foi removido da lista de usuários.`
    })
    await fetchUsers()
    return response
  } catch (e) {
    toast.warning('Usuário não foi deletado!', {
      description: `Houve erro ao tentar deletar o usuário ${username}.`
    })
    return Promise.reject(e)
  }
}

export async function getUser(selectedUser: User) {
  try {
    const response = await api.get(`api/users/${selectedUser.id}/`)
    return response
  } catch (e) {
    toast.warning('Erro detectado!', {
      description: `Houve erro ao tentar encontrar o usuário ${selectedUser.username}.`
    })
    return Promise.reject(e)
  }
}

export async function getInventory(work_on?: string) {
  try {
    const response = await api.get(`api/inventories/${work_on}/`)
    return response
  } catch (e) {
    toast.warning('Erro detectado!', {
      description: `Houve erro ao tentar encontrar o estoque atual.`
    })
    return Promise.reject(e)
  }
}
