import axios from 'axios'
import { redirect } from 'next/navigation'

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await api.post('/token/refresh/', {
      refresh: refreshToken
    })
    const newAccessToken = response.data.access
    localStorage.setItem('token', newAccessToken)

    return newAccessToken
  } catch (error) {
    console.error('Failed to refresh token', error)
    return null
  }
}

function redirectToLogin() {
  if (typeof window !== 'undefined') {
    redirect('/login')
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Evitar o refreshToken durante login
    if (originalRequest.url === '/token/') {
      return Promise.reject(error) // Login falhou, sem refresh
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const newAccessToken = await refreshAccessToken()

      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return api(originalRequest) // Tenta novamente com novo token
      } else {
        redirectToLogin() // Caso o refresh falhe
      }
    }

    return Promise.reject(error) // Outros erros são rejeitados
  }
)

export default api
