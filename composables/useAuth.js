/**
 * Authentication composable สำหรับจัดการ login/logout กับ Backend API
 * รองรับ JWT token, refresh token, และ user profile management
 */
export const useAuth = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBase || 'http://localhost:4000/api'
  
  // สร้าง reactive state สำหรับ token
  const token = ref(null)
  const user = ref(null)
  
  // ดึง token และ user จาก cookies เมื่อ initialize
  const initAuth = () => {
    const authToken = useCookie('auth-token')
    const userData = useCookie('user-data')
    
    if (authToken.value) {
      token.value = authToken.value
    }
    
    if (userData.value) {
      try {
        user.value = JSON.parse(userData.value)
      } catch (error) {
        console.error('Error parsing user data:', error)
        user.value = null
      }
    }
  }
  
  // เรียก initAuth เมื่อ composable ถูกสร้าง
  initAuth()

  /**
   * เข้าสู่ระบบด้วย username และ password
   * @param {Object} credentials - ข้อมูลสำหรับเข้าสู่ระบบ
   * @param {string} credentials.username - ชื่อผู้ใช้
   * @param {string} credentials.password - รหัสผ่าน
   * @returns {Promise<Object>} ผลลัพธ์การเข้าสู่ระบบ
   */
  const login = async (credentials) => {
    try {
      // เรียก API login
      const response = await $fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
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

        // บันทึก tokens
        authToken.value = response.accessToken
        refreshToken.value = response.refreshToken
        
        // อัปเดต reactive state
        token.value = response.accessToken

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
        
        // อัปเดต reactive state
        user.value = userProfile

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

  /**
   * ดึงข้อมูลโปรไฟล์ผู้ใช้จาก API
   * @param {string} authToken - JWT token สำหรับการ authentication
   * @returns {Promise<Object>} ข้อมูลโปรไฟล์ผู้ใช้
   */
  const getUserProfile = async (authToken) => {
    try {
      const response = await $fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      // จัดรูปแบบข้อมูลให้เป็นมาตรฐาน
      return {
        user_id: response.user_id,
        username: response.username,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        name: `${response.first_name || ''} ${response.last_name || ''}`.trim() || response.username,
        role: response.role || 'user',
        organization_id: response.organization_id,
        organization_name: response.organization_name,
        permissions: response.permissions || [],
        roles: response.roles || [],
        avatar: response.avatar || response.avatar_path,
        phone: response.phone,
        status: response.status,
        gender: response.gender,
        citizen_id: response.citizen_id,
        address: response.address,
        country: response.country,
        province: response.province,
        postal_code: response.postal_code
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // ถ้าไม่สามารถดึงข้อมูลผู้ใช้ได้ ให้ใช้ข้อมูลพื้นฐาน
      return {
        user_id: 'unknown',
        username: 'unknown',
        name: 'ผู้ใช้',
        role: 'user',
        permissions: [],
        roles: []
      }
    }
  }

  /**
   * ออกจากระบบและลบข้อมูล authentication ทั้งหมด
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      const authToken = useCookie('auth-token')
      const refreshToken = useCookie('refresh-token')

      // เรียก API logout ถ้ามี token
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
      // ลบ cookies และ reactive state ในทุกกรณี
      const authToken = useCookie('auth-token')
      const refreshToken = useCookie('refresh-token')
      const userData = useCookie('user-data')
      
      authToken.value = null
      refreshToken.value = null
      userData.value = null
      
      // ล้าง reactive state
      token.value = null
      user.value = null
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

  /**
   * ตรวจสอบว่าผู้ใช้ได้รับการ authenticate แล้วหรือไม่
   * @returns {boolean} true ถ้า authenticated, false ถ้าไม่
   */
  const isAuthenticated = () => {
    const authToken = useCookie('auth-token')
    const userData = useCookie('user-data')
    
    return !!(authToken.value && userData.value)
  }

  /**
   * ดึงข้อมูลผู้ใช้ปัจจุบันจาก cookies
   * @returns {Object|null} ข้อมูลผู้ใช้หรือ null ถ้าไม่มี
   */
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

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการทำงานหนึ่งหรือไม่
   * @param {string} permission - ชื่อสิทธิ์ที่ต้องการตรวจสอบ
   * @returns {boolean} true ถ้ามีสิทธิ์, false ถ้าไม่มี
   */
  const hasPermission = (permission) => {
    const currentUser = getCurrentUser()
    
    if (!currentUser || !currentUser.permissions) {
      return false
    }
    
    return currentUser.permissions.includes(permission)
  }

  /**
   * ตรวจสอบว่าผู้ใช้มีบทบาทหนึ่งหรือไม่
   * @param {string} role - ชื่อบทบาทที่ต้องการตรวจสอบ
   * @returns {boolean} true ถ้ามีบทบาท, false ถ้าไม่มี
   */
  const hasRole = (role) => {
    const currentUser = getCurrentUser()
    
    if (!currentUser) {
      return false
    }
    
    // ตรวจสอบจาก role field หรือ roles array
    if (currentUser.role === role) {
      return true
    }
    
    if (currentUser.roles && Array.isArray(currentUser.roles)) {
      return currentUser.roles.some(userRole => userRole.name === role)
    }
    
    return false
  }

  /**
   * ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
   * @returns {boolean} true ถ้าเป็น admin, false ถ้าไม่ใช่
   */
  const isAdmin = () => {
    return hasRole('admin')
  }

  // ส่งคืน functions และ reactive states ทั้งหมด
  return {
    // Reactive states
    token: readonly(token),
    user: readonly(user),
    
    // Authentication methods
    login,
    logout,
    refreshAuthToken,
    getUserProfile,
    
    // Status checks
    isAuthenticated,
    getCurrentUser,
    
    // Permission & Role checks
    hasPermission,
    hasRole,
    isAdmin
  }
}