<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          🧪 ทดสอบ API Connection
        </h1>
        <p class="text-gray-600">
          หน้าทดสอบการเชื่อมต่อ Backend API และการทำงานของ Authentication
        </p>
      </div>

      <!-- Backend Status -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">🔍 สถานะ Backend Server</h2>
        
        <div class="flex items-center space-x-4 mb-4">
          <UButton 
            @click="checkBackendStatus" 
            :loading="statusLoading"
            color="blue"
          >
            ตรวจสอบสถานะ Backend
          </UButton>
          
          <div v-if="backendStatus" class="flex items-center space-x-2">
            <div :class="backendStatus.isOnline ? 'bg-green-500' : 'bg-red-500'" 
                 class="w-3 h-3 rounded-full"></div>
            <span :class="backendStatus.isOnline ? 'text-green-700' : 'text-red-700'">
              {{ backendStatus.isOnline ? 'เชื่อมต่อสำเร็จ' : 'เชื่อมต่อไม่ได้' }}
            </span>
          </div>
        </div>

        <!-- Backend Info -->
        <div v-if="backendStatus && backendStatus.isOnline" class="bg-green-50 p-4 rounded">
          <p class="text-sm text-green-700">
            <strong>API Base URL:</strong> {{ config.public.apiBase }}
          </p>
        </div>

        <div v-if="backendStatus && !backendStatus.isOnline" class="bg-red-50 p-4 rounded">
          <p class="text-sm text-red-700">
            <strong>❌ ข้อผิดพลาด:</strong> {{ backendStatus.error }}
          </p>
          <p class="text-sm text-red-600 mt-2">
            กรุณาตรวจสอบว่า Backend Server ทำงานที่ {{ config.public.apiBase }}
          </p>
        </div>
      </div>

      <!-- Authentication Test -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">🔐 ทดสอบ Authentication</h2>
        
        <!-- Current User Status -->
        <div class="mb-4 p-4 bg-gray-50 rounded">
          <h3 class="font-medium mb-2">สถานะการเข้าสู่ระบบ:</h3>
          <div v-if="isAuthenticated()" class="text-green-700">
            ✅ เข้าสู่ระบบแล้ว - {{ getCurrentUser()?.name || getCurrentUser()?.username }}
          </div>
          <div v-else class="text-red-700">
            ❌ ยังไม่ได้เข้าสู่ระบบ
          </div>
        </div>

        <!-- Login Form -->
        <div v-if="!isAuthenticated()" class="space-y-4">
          <h3 class="font-medium">ทดสอบการ Login:</h3>
          
          <!-- ข้อมูล Test Users -->
          <div class="bg-blue-50 p-4 rounded">
            <h4 class="font-medium text-blue-800 mb-2">🔑 ข้อมูลผู้ใช้ทดสอบ:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Admin:</strong><br>
                Username: admin<br>
                Password: admin123
              </div>
              <div>
                <strong>Manager:</strong><br>
                Username: manager<br>
                Password: manager123
              </div>
              <div>
                <strong>Staff:</strong><br>
                Username: staff_one<br>
                Password: staff123
              </div>
              <div>
                <strong>Test User:</strong><br>
                Username: testuser<br>
                Password: testpassword
              </div>
            </div>
          </div>

          <UForm :schema="loginSchema" :state="loginForm" @submit="testLogin">
            <UFormGroup label="Username" name="username">
              <UInput v-model="loginForm.username" placeholder="admin" />
            </UFormGroup>

            <UFormGroup label="Password" name="password" class="mt-4">
              <UInput 
                v-model="loginForm.password" 
                type="password" 
                placeholder="admin123" 
              />
            </UFormGroup>

            <UButton 
              type="submit" 
              :loading="loginLoading" 
              color="primary"
              class="mt-4"
            >
              ทดสอบ Login
            </UButton>
          </UForm>

          <!-- Login Error -->
          <div v-if="loginError" class="bg-red-50 p-4 rounded">
            <p class="text-red-700">❌ {{ loginError }}</p>
          </div>
        </div>

        <!-- Logout Button -->
        <div v-if="isAuthenticated()">
          <UButton @click="testLogout" color="red" variant="outline">
            ออกจากระบบ
          </UButton>
        </div>
      </div>

      <!-- API Endpoints Test -->
      <div v-if="isAuthenticated()" class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">🚀 ทดสอบ API Endpoints</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- User Profile Test -->
          <div>
            <UButton 
              @click="testGetUserProfile" 
              :loading="profileLoading"
              color="green"
              block
            >
              ทดสอบ User Profile
            </UButton>
          </div>

          <!-- Vehicles Test -->
          <div>
            <UButton 
              @click="testGetVehicles" 
              :loading="vehiclesLoading"
              color="blue"
              block
            >
              ทดสอบ Get Vehicles
            </UButton>
          </div>

          <!-- Vehicle Types Test -->
          <div>
            <UButton 
              @click="testGetVehicleTypes" 
              :loading="typesLoading"
              color="purple"
              block
            >
              ทดสอบ Vehicle Types
            </UButton>
          </div>

          <!-- Vehicle Brands Test -->
          <div>
            <UButton 
              @click="testGetVehicleBrands" 
              :loading="brandsLoading"
              color="orange"
              block
            >
              ทดสอบ Vehicle Brands
            </UButton>
          </div>

          <!-- Bookings Test -->
          <div>
            <UButton 
              @click="testGetBookings" 
              :loading="bookingsLoading"
              color="indigo"
              block
            >
              ทดสอบ Get Bookings
            </UButton>
          </div>

          <!-- Equipments Test -->
          <div>
            <UButton 
              @click="testGetEquipments" 
              :loading="equipmentsLoading"
              color="pink"
              block
            >
              ทดสอบ Get Equipments
            </UButton>
          </div>

          <!-- Drivers Test -->
          <div>
            <UButton 
              @click="testGetDrivers" 
              :loading="driversLoading"
              color="cyan"
              block
            >
              ทดสอบ Get Drivers
            </UButton>
          </div>

          <!-- System Settings Test -->
          <div>
            <UButton 
              @click="testGetSystemSettings" 
              :loading="settingsLoading"
              color="teal"
              block
            >
              ทดสอบ System Settings
            </UButton>
          </div>
        </div>
      </div>

      <!-- Test Results -->
      <div v-if="testResults.length > 0" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">📊 ผลการทดสอบ</h2>
        
        <div class="space-y-4">
          <div 
            v-for="(result, index) in testResults" 
            :key="index"
            :class="result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
            class="p-4 rounded"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium" :class="result.success ? 'text-green-800' : 'text-red-800'">
                {{ result.success ? '✅' : '❌' }} {{ result.endpoint }}
              </h3>
              <span class="text-sm text-gray-500">{{ result.timestamp }}</span>
            </div>
            
            <div v-if="result.success" class="text-sm text-green-700">
              <strong>สำเร็จ:</strong> ได้รับข้อมูล {{ result.dataCount }} รายการ
            </div>
            
            <div v-if="!result.success" class="text-sm text-red-700">
              <strong>ข้อผิดพลาด:</strong> {{ result.error }}
            </div>

            <!-- Show sample data -->
            <div v-if="result.success && result.sampleData" class="mt-2">
              <details class="text-sm">
                <summary class="cursor-pointer text-gray-600 hover:text-gray-800">
                  ดูข้อมูลตัวอย่าง
                </summary>
                <pre class="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">{{ JSON.stringify(result.sampleData, null, 2) }}</pre>
              </details>
            </div>
          </div>
        </div>

        <!-- Clear Results -->
        <div class="mt-4">
          <UButton @click="clearResults" color="gray" variant="outline" size="sm">
            ล้างผลการทดสอบ
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { z } from 'zod'

// ตั้งค่าหน้า
definePageMeta({
  title: 'ทดสอบ API',
  layout: 'default'
})

// ดึง composables
const config = useRuntimeConfig()
const { isAuthenticated, getCurrentUser, login, logout } = useAuth()
const api = useApi()

// Reactive states
const statusLoading = ref(false)
const backendStatus = ref(null)
const loginLoading = ref(false)
const loginError = ref('')
const testResults = ref([])

// Loading states สำหรับแต่ละ API
const profileLoading = ref(false)
const vehiclesLoading = ref(false)
const typesLoading = ref(false)
const brandsLoading = ref(false)
const bookingsLoading = ref(false)
const equipmentsLoading = ref(false)
const driversLoading = ref(false)
const settingsLoading = ref(false)

// Login form
const loginSchema = z.object({
  username: z.string().min(1, 'กรุณากรอก Username'),
  password: z.string().min(1, 'กรุณากรอก Password')
})

const loginForm = ref({
  username: 'admin',
  password: 'admin123'
})

/**
 * ตรวจสอบสถานะ Backend Server
 */
const checkBackendStatus = async () => {
  statusLoading.value = true
  
  try {
    // ลองเรียก API endpoint ที่ไม่ต้อง auth
    await $fetch('/', { 
      baseURL: config.public.apiBase,
      timeout: 5000
    })
    
    backendStatus.value = {
      isOnline: true,
      timestamp: new Date().toLocaleString('th-TH')
    }
  } catch (error) {
    backendStatus.value = {
      isOnline: false,
      error: error.message || 'ไม่สามารถเชื่อมต่อได้',
      timestamp: new Date().toLocaleString('th-TH')
    }
  } finally {
    statusLoading.value = false
  }
}

/**
 * ทดสอบการ Login
 */
const testLogin = async (data) => {
  loginLoading.value = true
  loginError.value = ''
  
  try {
    const result = await login(data)
    
    // บันทึกผลการทดสอบ
    testResults.value.unshift({
      endpoint: 'POST /auth/login',
      success: true,
      dataCount: 1,
      sampleData: {
        user: result.user,
        hasToken: !!result.tokens.accessToken
      },
      timestamp: new Date().toLocaleString('th-TH')
    })

    // แสดงข้อความสำเร็จ
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    loginError.value = error.message
    
    // บันทึกข้อผิดพลาด
    testResults.value.unshift({
      endpoint: 'POST /auth/login',
      success: false,
      error: error.message,
      timestamp: new Date().toLocaleString('th-TH')
    })
  } finally {
    loginLoading.value = false
  }
}

/**
 * ทดสอบการ Logout
 */
const testLogout = async () => {
  try {
    await logout()
    
    testResults.value.unshift({
      endpoint: 'POST /auth/logout',
      success: true,
      dataCount: 0,
      timestamp: new Date().toLocaleString('th-TH')
    })
  } catch (error) {
    testResults.value.unshift({
      endpoint: 'POST /auth/logout',
      success: false,
      error: error.message,
      timestamp: new Date().toLocaleString('th-TH')
    })
  }
}

/**
 * ฟังก์ชันช่วยสำหรับทดสอบ API
 */
const testApiCall = async (apiFunction, endpoint, loadingRef) => {
  loadingRef.value = true
  
  try {
    const data = await apiFunction()
    
    // กำหนดจำนวนข้อมูล
    let dataCount = 0
    let sampleData = data
    
    if (Array.isArray(data)) {
      dataCount = data.length
      sampleData = data.slice(0, 2) // แสดงแค่ 2 รายการแรก
    } else if (typeof data === 'object' && data !== null) {
      dataCount = Object.keys(data).length
    }
    
    testResults.value.unshift({
      endpoint,
      success: true,
      dataCount,
      sampleData,
      timestamp: new Date().toLocaleString('th-TH')
    })
    
  } catch (error) {
    testResults.value.unshift({
      endpoint,
      success: false,
      error: error.message || error.toString(),
      timestamp: new Date().toLocaleString('th-TH')
    })
  } finally {
    loadingRef.value = false
  }
}

// API Test Functions
const testGetUserProfile = () => testApiCall(api.getUserProfile, 'GET /users/profile', profileLoading)
const testGetVehicles = () => testApiCall(api.getVehicles, 'GET /vehicles', vehiclesLoading)
const testGetVehicleTypes = () => testApiCall(api.getVehicleTypes, 'GET /vehicles/types', typesLoading)
const testGetVehicleBrands = () => testApiCall(api.getVehicleBrands, 'GET /vehicles/brands', brandsLoading)
const testGetBookings = () => testApiCall(api.getBookings, 'GET /bookings', bookingsLoading)
const testGetEquipments = () => testApiCall(api.getEquipments, 'GET /equipments/all', equipmentsLoading)
const testGetDrivers = () => testApiCall(api.getDrivers, 'GET /drivers', driversLoading)
const testGetSystemSettings = () => testApiCall(api.getSystemSettings, 'GET /system', settingsLoading)

/**
 * ล้างผลการทดสอบ
 */
const clearResults = () => {
  testResults.value = []
}

// ตรวจสอบสถานะ Backend เมื่อโหลดหน้า
onMounted(() => {
  checkBackendStatus()
})
</script>

<style scoped>
/* Custom styles สำหรับหน้าทดสอบ */
.test-result {
  transition: all 0.3s ease;
}

.test-result:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

pre {
  max-height: 200px;
  overflow-y: auto;
}
</style>