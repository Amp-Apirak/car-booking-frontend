// ทดสอบเรียก API โดยตรง
const testDirectLogin = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    
    const data = await response.json()
    console.log('Response data:', data)
    
    if (response.ok) {
      console.log('✅ Login successful!')
      return data
    } else {
      console.log('❌ Login failed:', data)
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

// เรียกใช้ในคอนโซล
testDirectLogin()