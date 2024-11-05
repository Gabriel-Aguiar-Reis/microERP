import axios from 'axios'

const api = axios.create({
  baseURL: 'https://microerp-backend.onrender.com/',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Helper para redirecionar ao login e limpar os tokens
function redirectToLogin() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('username')

  if (typeof window !== 'undefined' && window.location.href.includes('/form')) {
    window.location.href = '/sellerlogin'
  } else if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

// Função para atualizar o token usando o refresh token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    redirectToLogin()
    return null
  }

  try {
    const response = await api.post('/token/refresh/', {
      refreshToken: refreshToken
    })

    const { accessToken, refreshToken: newRefreshToken } = response.data

    // Armazena os novos tokens
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    return accessToken
  } catch (error) {
    console.error('Erro ao tentar fazer refresh do token', error)
    return null
  }
}

// Intercepta todas as requests para adicionar o token de autenticação
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

// Intercepta as respostas para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response, // Sucesso
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 404) {
      redirectToLogin()
    }

    // Se a resposta for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const newAccessToken = await refreshAccessToken()

      if (newAccessToken) {
        // Atualiza o header Authorization com o novo token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        // Repete a request original com o novo token
        return api(originalRequest)
      } else {
        // Se o refresh falhar, redireciona ao login
        redirectToLogin()
        return Promise.reject(error)
      }
    }

    // Rejeita qualquer outro erro
    return Promise.reject(error)
  }
)

export default api
