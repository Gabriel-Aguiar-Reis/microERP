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
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }
  const response = await api.post('/token/refresh/', { refresh: refreshToken })
  const newAccessToken = response.data.access
  const newRefreshToken = response.data.refresh

  localStorage.setItem('accessToken', newAccessToken)
  localStorage.setItem('refreshToken', newRefreshToken)

  return newAccessToken
}

// Response interceptor to handle 401 errors and retry requests
let isRefreshing = false
let failedRequestsQueue: any[] = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Check if the error status is 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Set retry flag to prevent infinite loops
      originalRequest._retry = true

      // If a token refresh is already in progress, queue the failed request
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

      // Try refreshing the token
      return new Promise(async (resolve, reject) => {
        try {
          const newAccessToken = await refreshAccessToken()
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

          // Retry all queued requests with the new token
          failedRequestsQueue.forEach((req) => req.resolve(newAccessToken))
          failedRequestsQueue = []

          resolve(api(originalRequest)) // Retry the failed request
        } catch (err) {
          failedRequestsQueue.forEach((req) => req.reject(err))
          failedRequestsQueue = []

          // Redirect to login if refreshing the token fails
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          if (!(window.location.href === 'http://localhost:3000/login')) {
            window.location.href = '/login'
          }
          reject(err)
        } finally {
          isRefreshing = false
        }
      })
    }

    return Promise.reject(error) // Reject all other errors
  }
)

export default api
