// middleware/auth.js
// Real authentication middleware

export default function (to, from) {
  // Skip auth check during server-side rendering
  if (process.server) {
    return
  }

  // ใช้ useAuth composable
  const { isAuthenticated, getCurrentUser } = useAuth()

  console.log('กำลังตรวจสอบการ authentication...')

  // ตรวจสอบการ authenticate
  if (!isAuthenticated()) {
    console.log('ไม่ได้รับการ authenticate, เปลี่ยนเส้นทางไปหน้า login')
    return navigateTo('/login')
  }

  // ตรวจสอบข้อมูลผู้ใช้
  const currentUser = getCurrentUser()
  if (!currentUser || !currentUser.user_id) {
    console.log('ข้อมูลผู้ใช้ไม่ถูกต้อง, เปลี่ยนเส้นทางไปหน้า login')
    
    // ลบข้อมูลที่เสียหาย
    const { logout } = useAuth()
    logout()
    
    return navigateTo('/login')
  }

  console.log('Authentication สำเร็จ - ผู้ใช้:', currentUser.username || currentUser.name)
}