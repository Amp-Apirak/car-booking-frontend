// composables/useAuth.js
// Authentication composable สำหรับจัดการ login/logout กับ real API

export const useAuth = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBase || 'http://localhost:4000/api'

  // Login with real API
  const login = async (credentials) => {
    try {
      const response = await $fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          username: credentials.username,
          password: credentials.password
        }
      })

      if (response.accessToken) {
        // เก็บ tokens ใน cookies
        const authToken = useCookie('auth-token', { 
          maxAge: 60 * 60 * 24 * 7, // 7 วัน
          secure: false,
          httpOnly: false,
          sameSite: 'lax'
        })
        
        const refreshToken = useCookie('refresh-token', { 
          maxAge: 60 * 60 * 24 * 7, // 7 วัน
          secure: false,
          httpOnly: false,
          sameSite: 'lax'
        })

        authToken.value = response.accessToken
        refreshToken.value = response.refreshToken

        // ดึงข้อมูลผู้ใช้
        const userProfile = await getUserProfile(response.accessToken)
        
        // เก็บข้อมูลผู้ใช้
        const userData = useCookie('user-data', { 
          maxAge: 60 * 60 * 24 * 7,
          secure: false,
          httpOnly: false,
          sameSite: 'lax'
        })
        
        userData.value = JSON.stringify(userProfile)

        return {
          success: true,
          user: userProfile,
          tokens: {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          }
        }
      }

      throw new Error('ไม่ได้รับ access token')
    } catch (error) {
      console.error('Login error:', error)
      
      // จัดการ error แบบละเอียด
      if (error.response?.status === 401) {
        throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      } else if (error.response?.status === 429) {
        throw new Error('พยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่')
      } else if (error.response?.status >= 500) {
        throw new Error('เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่อีกครั้ง')
      } else {
        throw new Error(error.data?.message || error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }
    }
  }

  // Get user profile
  const getUserProfile = async (token) => {
    try {
      const response = await $fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      return {
        user_id: response.user_id,
        username: response.username,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        name: `${response.first_name || ''} ${response.last_name || ''}`.trim() || response.username,
        role: response.role || 'user',
        organization_id: response.organization_id,
        permissions: response.permissions || [],
        avatar: response.avatar,
        phone: response.phone,
        status: response.status
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // ถ้าไม่สามารถดึงข้อมูลผู้ใช้ได้ ให้ใช้ข้อมูลพื้นฐาน
      return {
        user_id: 'unknown',
        username: 'unknown',
        name: 'ผู้ใช้',
        role: 'user',
        permissions: []
      }
    }
  }

  // Logout with real API
  const logout = async () => {
    try {
      const authToken = useCookie('auth-token')
      const refreshToken = useCookie('refresh-token')

      if (authToken.value && refreshToken.value) {
        await $fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken.value}`,
            'Content-Type': 'application/json'
          },
          body: {
            refreshToken: refreshToken.value
          }
        })
      }
    } catch (error) {
      console.error('Logout API error:', error)
      // ไม่ต้อง throw error เพราะเราต้องการให้ logout สำเร็จในทุกกรณี
    } finally {
      // ลบ cookies ในทุกกรณี
      const authToken = useCookie('auth-token')
      const refreshToken = useCookie('refresh-token')
      const userData = useCookie('user-data')
      
      authToken.value = null
      refreshToken.value = null
      userData.value = null
    }
  }

  // Refresh token
  const refreshAuthToken = async () => {
    try {
      const refreshToken = useCookie('refresh-token')
      
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      const response = await $fetch(`${API_BASE_URL}/auth/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          refreshToken: refreshToken.value
        }
      })

      if (response.accessToken) {
        const authToken = useCookie('auth-token', { 
          maxAge: 60 * 60 * 24 * 7,
          secure: false,
          httpOnly: false,
          sameSite: 'lax'
        })
        
        authToken.value = response.accessToken
        
        if (response.refreshToken) {
          const newRefreshToken = useCookie('refresh-token', { 
            maxAge: 60 * 60 * 24 * 7,
            secure: false,
            httpOnly: false,
            sameSite: 'lax'
          })
          newRefreshToken.value = response.refreshToken
        }

        return response.accessToken
      }

      throw new Error('Failed to refresh token')
    } catch (error) {
      console.error('Token refresh error:', error)
      
      // ถ้า refresh ไม่ได้ ให้ logout
      await logout()
      await navigateTo('/login')
      
      throw error
    }
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    const authToken = useCookie('auth-token')
    const userData = useCookie('user-data')
    
    return !!(authToken.value && userData.value)
  }

  // Get current user
  const getCurrentUser = () => {
    const userData = useCookie('user-data')
    
    if (userData.value) {
      try {
        return JSON.parse(userData.value)
      } catch (error) {
        console.error('Error parsing user data:', error)
        return null
      }
    }
    
    return null
  }

  return {
    login,
    logout,
    refreshAuthToken,
    getUserProfile,
    isAuthenticated,
    getCurrentUser
  }
}