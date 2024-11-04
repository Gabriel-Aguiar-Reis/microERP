import { Product } from '@/components/blocks/products'
import { User } from '@/components/blocks/sellers'
import { InventoryInterface } from '@/components/blocks/home'
import { SupplyProduct } from '@/components/blocks/supplies'
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
      localStorage.setItem('username', username)
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
}: {
  id: string
  username?: string
  password?: string
  firstName?: string
  lastName?: string
  email?: string
  isStaff?: boolean
  fetchUsers?: () => Promise<void>
  workOn?: string
}) {
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

export async function getUserByUsername(username: string) {
  try {
    const response = await api.get(`api/users/username/${username}/`)
    return response
  } catch (e) {
    toast.warning('Erro detectado!', {
      description: `Houve erro ao tentar encontrar o usuário ${username}.`
    })
    return Promise.reject(e)
  }
}

export async function getInventories() {
  try {
    const response = await api.get(`api/inventories/`)
    return response.data
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function getInventory(id: string) {
  try {
    const response = await api.get(`api/inventories/${id}/`)
    return response
  } catch (e) {
    toast.warning('Erro detectado!', {
      description: `Houve erro ao tentar encontrar o estoque atual.`
    })
    return Promise.reject(e)
  }
}

export async function patchInventory({
  id,
  name,
  description,
  owner,
  supplyIds
}: InventoryInterface) {
  const data: Record<string, any> = {}
  if (name !== undefined) data.name = name
  if (description !== undefined) data.description = description
  if (owner !== undefined) data.owner = owner
  if (supplyIds !== undefined) data.supply_ids = supplyIds
  try {
    const response = await api.patch(`api/inventories/${id}/`, data)
    toast.success('Inventário modificado com sucesso!', {
      description: `O inventário teve seus dados modificados.`
    })
    return response
  } catch (e) {
    toast.warning('Inventário não foi modificado!', {
      description: `Houve erro ao tentar modificar o inventário atual.`
    })
    return Promise.reject(e)
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.get('api/products/')
    return response.data
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function patchProduct({
  id,
  commercialId,
  name,
  description,
  costPrice,
  sellPrice,
  fetchProducts
}: {
  id: string
  commercialId?: string
  name?: string
  description?: string
  costPrice?: number
  sellPrice?: number
  fetchProducts?: () => Promise<void>
}) {
  const data: Record<string, any> = {}
  if (commercialId !== undefined) data.commercial_id = commercialId
  if (name !== undefined) data.name = name
  if (description !== undefined) data.description = description
  if (costPrice !== undefined) data.cost_price = costPrice
  if (sellPrice !== undefined) data.sell_price = sellPrice

  try {
    const response = await api.patch(`api/products/${id}/`, data)
    toast.success('Produto modificado com sucesso!', {
      description: `O produto teve seus dados modificados.`
    })
    if (fetchProducts) {
      await fetchProducts()
    }
    return response
  } catch (e) {
    toast.warning('Produto não foi modificado!', {
      description: `Houve erro ao tentar modificar o produto.`
    })
    return Promise.reject(e)
  }
}

export async function deleteProduct(
  id: string,
  fetchProducts: () => Promise<void>
) {
  try {
    const response = await api.delete(`api/products/${id}/`)
    toast.success('Produto deletado com sucesso!', {
      description: `O produto foi removido do seu estoque.`
    })
    await fetchProducts()
    return response
  } catch (e) {
    toast.warning('Produto não foi deletado!', {
      description: `Houve erro ao tentar deletar o produto.`
    })
    return Promise.reject(e)
  }
}

export async function postProduct({
  commercialId,
  name,
  description,
  costPrice,
  sellPrice,
  fetchProducts
}: {
  commercialId: string
  name: string
  description: string
  costPrice: number
  sellPrice: number
  fetchProducts: () => Promise<void>
}) {
  const data = {
    commercial_id: commercialId,
    name,
    description,
    cost_price: costPrice,
    sell_price: sellPrice,
    fetchProducts
  }
  try {
    const response = await api.post('api/products/', data)
    toast.success('Produto criado com sucesso!', {
      description: `O produto ${commercialId} foi adicionado ao seu estoque.`
    })
    await fetchProducts()
    return response
  } catch (e) {
    toast.warning('Produto não foi criado!', {
      description: `Houve erro ao tentar criar o produto.`
    })
    return Promise.reject(e)
  }
}

export async function getSupplies() {
  try {
    const response = await api.get(`api/supplies/`)
    return response.data
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function postSupply({
  commercialId,
  selectedProducts,
  inventoryId,
  fetchSupplies
}: {
  commercialId: string
  selectedProducts: SupplyProduct[]
  inventoryId: string
  fetchSupplies: () => Promise<void>
}) {
  const data = {
    commercial_id: commercialId,
    products: selectedProducts
  }
  try {
    const response = await api.post('api/supplies/', data)

    const supplyId = response.data.id
    const inventoryData: Record<string, any> = {}
    inventoryData.supply_ids = [supplyId]
    await api.patch(`api/inventories/${inventoryId}/`, inventoryData)
    await fetchSupplies()
    toast.success('Fornecimento criado com sucesso!', {
      description: `O Fornecimento ${commercialId} foi adicionado ao seu estoque.`
    })
    return response
  } catch (e) {
    toast.warning('Fornecimento não foi criado!', {
      description: `Houve erro ao tentar criar o fornecimento.`
    })
    return Promise.reject(e)
  }
}

export async function deleteSupply({
  supplyId,
  fetchSupplies
}: {
  supplyId: string
  fetchSupplies: () => Promise<void>
}) {
  try {
    const response = await api.delete(`api/supplies/${supplyId}/`)
    toast.success('Fornecimento deletado com sucesso!', {
      description: `O fornecimento foi removido do estoque.`
    })
    await fetchSupplies()
    return response
  } catch (e) {
    toast.warning('Fornecimento não foi deletado!', {
      description: `Houve erro ao tentar deletar fornecimento.`
    })
    return Promise.reject(e)
  }
}

export async function getSales() {
  try {
    const response = await api.get(`api/sales/`)
    return response.data
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function postSale({
  paymentMethod,
  products,
  inventory,
  fetchSales,
  fetchInventoryProducts
}: {
  paymentMethod: string
  products: SupplyProduct[]
  inventory: string
  fetchSales?: () => Promise<void>
  fetchInventoryProducts?: () => Promise<void>
}) {
  const username = localStorage.getItem('username') || ''
  const user = await getUserByUsername(username)
  let data = {}
  if (user) {
    data = {
      payment_method: paymentMethod,
      products,
      inventory,
      seller: user.data.id
    }
  }

  try {
    const response = await api.post(`api/sales/`, data)
    if (fetchSales) {
      await fetchSales()
    }
    if (fetchInventoryProducts) {
      await fetchInventoryProducts()
    }
    toast.success('Venda criada com sucesso!', {
      description: `A venda foi adicionada ao seu estoque.`
    })
    return response
  } catch (e) {
    toast.warning('Venda não foi criada!', {
      description: `Houve erro ao tentar criar a venda.`
    })
    return Promise.reject(e)
  }
}

export async function deleteSale({
  saleId,
  fetchSales,
  fetchProducts
}: {
  saleId: string
  fetchSales: () => Promise<void>
  fetchProducts: () => Promise<void>
}) {
  try {
    const response = await api.delete(`api/sales/${saleId}/`)
    toast.success('Venda deletada com sucesso!', {
      description: `A venda foi deletada do seu estoque.`
    })
    await fetchSales()
    await fetchProducts()
    return response
  } catch (e) {
    toast.warning('Venda não foi deletada!', {
      description: `Houve erro ao tentar deletar a venda.`
    })
    return Promise.reject(e)
  }
}

export async function getInventoryProducts({
  inventoryId
}: {
  inventoryId: string
}) {
  try {
    const response = await api.get(`api/inventories/${inventoryId}/`)
    return response.data?.inventory_products_details
  } catch (e) {
    return Promise.reject(e)
  }
}
