import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Function to refresh the access token
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
    const newRefreshToken = response.data.refresh

    localStorage.setItem('accessToken', newAccessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    return newAccessToken
  } catch (e) {
    throw e
  }
}

// Response interceptor to handle 401 errors and retry requests
let isRefreshing = false
let failedRequestsQueue: any[] = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Se o erro é 401 e não está tentando já o refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Se já está atualizando o token, enfileirar a requisição
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        // Tentando renovar o access token
        const newAccessToken = await refreshAccessToken()

        // Atualizando headers e reenviando requisições
        failedRequestsQueue.forEach((req) => req.resolve(newAccessToken))
        failedRequestsQueue = []

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return api(originalRequest) // Retentar a requisição original
      } catch (err) {
        // Se a renovação falhar, limpar tokens e redirecionar para login
        failedRequestsQueue.forEach((req) => req.reject(err))
        failedRequestsQueue = []

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        // Redirecionar para o login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error) // Rejeitar todos os outros erros
  }
)

export default api
