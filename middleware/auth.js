// middleware/auth.js
// Real authentication middleware

export default function (to, from) {
  // Skip auth check during server-side rendering
  if (process.server) {
    return
  }

  // ใช้ useAuth composable
  const { isAuthenticated, getCurrentUser } = useAuth()

  console.log('🔍 กำลังตรวจสอบการ authentication...')
  console.log('📍 ปัจจุบันที่หน้า:', to.path)

  // ตรวจสอบ cookies โดยตรง
  const authToken = useCookie('auth-token')
  const userData = useCookie('user-data')
  
  console.log('🍪 Auth token exists:', !!authToken.value)
  console.log('🍪 User data exists:', !!userData.value)
  
  if (authToken.value) {
    console.log('🔑 Token length:', authToken.value.length)
  }
  
  if (userData.value) {
    try {
      let parsedUser
      // ตรวจสอบว่า userData.value เป็น string หรือ object
      if (typeof userData.value === 'string') {
        parsedUser = JSON.parse(userData.value)
      } else {
        parsedUser = userData.value
      }
      console.log('👤 User ID:', parsedUser.user_id)
      console.log('👤 Username:', parsedUser.username)
    } catch (e) {
      console.error('❌ Error parsing user data:', e)
      console.log('🔍 userData.value type:', typeof userData.value)
      console.log('🔍 userData.value value:', userData.value)
    }
  }

  // ตรวจสอบการ authenticate
  const isAuth = isAuthenticated()
  console.log('🔐 isAuthenticated result:', isAuth)
  
  if (!isAuth) {
    console.log('❌ ไม่ได้รับการ authenticate, เปลี่ยนเส้นทางไปหน้า login')
    return navigateTo('/login')
  }

  // ตรวจสอบข้อมูลผู้ใช้
  const currentUser = getCurrentUser()
  console.log('👤 Current user:', currentUser)
  
  if (!currentUser || (!currentUser.user_id && !currentUser.username)) {
    console.log('❌ ข้อมูลผู้ใช้ไม่ถูกต้อง, เปลี่ยนเส้นทางไปหน้า login')
    
    // ลบข้อมูลที่เสียหาย
    const { logout } = useAuth()
    logout()
    
    return navigateTo('/login')
  }

  console.log('✅ Authentication สำเร็จ - ผู้ใช้:', currentUser.username || currentUser.name)
}