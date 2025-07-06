// plugins/api.client.js
// HTTP interceptor สำหรับจัดการ authentication และ token refresh

export default defineNuxtPlugin(() => {
  const { refreshAuthToken, logout } = useAuth()

  // กำหนด global fetch options
  $fetch.create({
    onRequest({ request, options }) {
      // เพิ่ม auth header หากมี token
      const authToken = useCookie('auth-token')
      
      if (authToken.value && options.headers) {
        options.headers.Authorization = `Bearer ${authToken.value}`
      }
    },

    onResponseError({ response }) {
      // ถ้าได้ 401 Unauthorized ให้ลอง refresh token
      if (response.status === 401) {
        console.log('Token อาจจะหมดอายุ, กำลังลอง refresh...')
        
        // Refresh token และลองใหม่
        return refreshAuthToken()
          .then(() => {
            console.log('Token refresh สำเร็จ')
          })
          .catch(async (error) => {
            console.log('Token refresh ไม่สำเร็จ, ต้อง login ใหม่')
            await logout()
            await navigateTo('/login')
            throw error
          })
      }
    }
  })
})