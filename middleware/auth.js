// middleware/auth.js
// Mock authentication middleware สำหรับทดสอบ

export default function (to, from) {
  // ตรวจสอบว่ามี auth token หรือไม่
  const token = useCookie('auth-token', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7 // 7 วัน
  })

  // ถ้าไม่มี token ให้สร้าง mock token สำหรับทดสอบ
  if (!token.value) {
    // สร้าง mock JWT token สำหรับทดสอบ (ใน production ต้องได้จาก login API)
    const mockToken = 'mock-jwt-token-' + Date.now()
    token.value = mockToken
    console.log('สร้าง mock auth token สำหรับทดสอบ:', mockToken)
  }

  // ใน production จะต้องตรวจสอบ token กับ server
  // ตอนนี้ mock ว่าเป็น admin
  const user = {
    user_id: 1,
    name: 'Admin User',
    role: 'admin',
    permissions: ['system:write', 'users:manage']
  }

  // เก็บข้อมูลผู้ใช้ใน cookie สำหรับใช้ในหน้าอื่นๆ
  const userCookie = useCookie('user-data', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7
  })
  
  if (!userCookie.value) {
    userCookie.value = JSON.stringify(user)
  }
}