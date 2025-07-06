// composables/useSystemSettings.js
// Composable สำหรับจัดการ System Settings API

export const useSystemSettings = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBase || 'http://localhost:3000/api'

  /**
   * ดึงการตั้งค่าระบบทั้งหมด
   * @param {boolean} includeAuth - รวม Authorization header หรือไม่
   * @returns {Promise<Object>} การตั้งค่าระบบ
   */
  const getSettings = async (includeAuth = false) => {
    try {
      const headers = {}
      
      if (includeAuth) {
        const token = useCookie('auth-token')
        if (token.value) {
          headers.Authorization = `Bearer ${token.value}`
        }
      }

      const { data } = await $fetch(`${API_BASE_URL}/system/settings`, {
        method: 'GET',
        headers
      })

      return data || {}
    } catch (error) {
      console.error('Error fetching system settings:', error)
      // ส่งค่าเริ่มต้นกรณีเกิดข้อผิดพลาด
      return {
        system_name: 'ระบบจองรถยนต์',
        system_tagline: 'จัดการการจองอย่างมืออาชีพ',
        system_logo: '',
        system_primary_color: '#3b82f6',
        system_timezone: 'Asia/Bangkok',
        system_language: 'th',
        system_currency: 'THB'
      }
    }
  }

  /**
   * ดึงการตั้งค่าเฉพาะ key
   * @param {string} key - key ของการตั้งค่า
   * @returns {Promise<any>} ค่าการตั้งค่า
   */
  const getSetting = async (key) => {
    try {
      const { data } = await $fetch(`${API_BASE_URL}/system/settings/${key}`, {
        method: 'GET'
      })

      return data[key]
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error)
      return null
    }
  }

  /**
   * อัพเดตการตั้งค่าระบบ
   * @param {Object} settings - การตั้งค่าที่ต้องการอัพเดต
   * @returns {Promise<Object>} ผลลัพธ์การอัพเดต
   */
  const updateSettings = async (settings) => {
    try {
      const token = useCookie('auth-token')
      if (!token.value) {
        throw new Error('กรุณาเข้าสู่ระบบ')
      }

      const response = await $fetch(`${API_BASE_URL}/system/settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        body: settings
      })

      return response
    } catch (error) {
      console.error('Error updating system settings:', error)
      throw error
    }
  }

  /**
   * อัพเดตการตั้งค่าเฉพาะ key
   * @param {string} key - key ของการตั้งค่า
   * @param {any} value - ค่าใหม่
   * @returns {Promise<Object>} ผลลัพธ์การอัพเดต
   */
  const updateSetting = async (key, value) => {
    try {
      const token = useCookie('auth-token')
      if (!token.value) {
        throw new Error('กรุณาเข้าสู่ระบบ')
      }

      const response = await $fetch(`${API_BASE_URL}/system/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        body: { value }
      })

      return response
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error)
      throw error
    }
  }

  /**
   * อัพโหลดโลโก้ระบบ
   * @param {File} file - ไฟล์โลโก้
   * @returns {Promise<Object>} ผลลัพธ์การอัพโหลด
   */
  const uploadLogo = async (file) => {
    try {
      const token = useCookie('auth-token')
      if (!token.value) {
        throw new Error('กรุณาเข้าสู่ระบบ')
      }

      const formData = new FormData()
      formData.append('logo', file)

      const response = await $fetch(`${API_BASE_URL}/system/upload-logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`
        },
        body: formData
      })

      return response
    } catch (error) {
      console.error('Error uploading logo:', error)
      throw error
    }
  }

  /**
   * ลบโลโก้ระบบ
   * @returns {Promise<Object>} ผลลัพธ์การลบ
   */
  const deleteLogo = async () => {
    try {
      const token = useCookie('auth-token')
      if (!token.value) {
        throw new Error('กรุณาเข้าสู่ระบบ')
      }

      const response = await $fetch(`${API_BASE_URL}/system/logo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      return response
    } catch (error) {
      console.error('Error deleting logo:', error)
      throw error
    }
  }

  /**
   * สร้าง reactive state สำหรับการตั้งค่าระบบ
   */
  const createSystemSettingsState = () => {
    const settings = ref({
      system_name: 'ระบบจองรถยนต์',
      system_tagline: 'จัดการการจองอย่างมืออาชีพ',
      system_logo: '',
      system_primary_color: '#3b82f6',
      system_timezone: 'Asia/Bangkok',
      system_language: 'th',
      system_currency: 'THB'
    })

    const loading = ref(false)
    const error = ref(null)

    // โหลดการตั้งค่าเริ่มต้น
    const loadSettings = async () => {
      loading.value = true
      error.value = null
      
      try {
        const data = await getSettings()
        settings.value = { ...settings.value, ...data }
      } catch (err) {
        error.value = err.message
        console.error('Failed to load system settings:', err)
      } finally {
        loading.value = false
      }
    }

    // อัพเดตการตั้งค่า
    const saveSettings = async (newSettings) => {
      loading.value = true
      error.value = null

      try {
        await updateSettings(newSettings)
        settings.value = { ...settings.value, ...newSettings }
        return true
      } catch (err) {
        error.value = err.message
        console.error('Failed to save system settings:', err)
        throw err
      } finally {
        loading.value = false
      }
    }

    return {
      settings: readonly(settings),
      loading: readonly(loading),
      error: readonly(error),
      loadSettings,
      saveSettings
    }
  }

  return {
    getSettings,
    getSetting,
    updateSettings,
    updateSetting,
    uploadLogo,
    deleteLogo,
    createSystemSettingsState
  }
}