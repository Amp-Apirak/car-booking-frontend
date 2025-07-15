<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0">
      <!-- Floating shapes -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-blue-400 bg-opacity-20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-purple-400 bg-opacity-20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-20 left-40 w-72 h-72 bg-pink-400 bg-opacity-20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      
      <!-- Grid pattern -->
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <!-- Logo Container -->
          <div class="mx-auto relative">
            <div class="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300">
              <UIcon name="i-lucide-car" class="size-12 text-white" />
            </div>
            <!-- Glow effect -->
            <div class="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-30 blur-lg animate-pulse"></div>
          </div>
          
          <h2 class="mt-8 text-4xl font-bold text-gray-800 mb-2">
            ยินดีต้อนรับ
          </h2>
          <p class="text-gray-600 text-lg mb-8">
            ระบบจัดการการจองรถยนต์
          </p>
        </div>

        <!-- Login Form -->
        <div class="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-200">
          <form @submit.prevent="login" class="space-y-6">
            <!-- Username Field -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-lucide-user" class="size-5 text-gray-400" />
                </div>
                <input
                  v-model="form.username"
                  type="text"
                  required
                  class="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-lucide-lock" class="size-5 text-gray-400" />
                </div>
                <input
                  v-model="form.password"
                  type="password"
                  required
                  class="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>
            </div>

            <!-- Login Button -->
            <div class="pt-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UIcon 
                    :name="isLoading ? 'i-lucide-loader-2' : 'i-lucide-log-in'" 
                    :class="['size-5', isLoading ? 'animate-spin' : 'group-hover:translate-x-0.5 transition-transform']" 
                  />
                </span>
                {{ isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ' }}
              </button>
            </div>
          </form>
        </div>


        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-gray-500 text-sm">
            © 2024 ระบบจองรถยนต์ | ทุกสิทธิ์ได้รับการคุ้มครอง
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ไม่ต้องใช้ layout สำหรับหน้า login
definePageMeta({
  layout: false
})

const form = reactive({
  username: '',
  password: ''
})

const isLoading = ref(false)

// ใช้ real auth API
const { login: apiLogin } = useAuth()

async function login() {
  isLoading.value = true
  
  try {
    // เรียกใช้ real API
    const result = await apiLogin({
      username: form.username,
      password: form.password
    })

    console.log('Login สำเร็จ:', result)
    
    const toast = useToast()
    toast.add({
      title: 'เข้าสู่ระบบสำเร็จ',
      description: `ยินดีต้อนรับ ${result.user.name}`,
      color: 'green'
    })
    
    // เปลี่ยนเส้นทางไปหน้าหลัก
    console.log('🔄 กำลัง redirect ไปหน้าหลัก...')
    await navigateTo('/', { replace: true })
    console.log('✅ Redirect สำเร็จ')
    
  } catch (error) {
    console.error('Login error:', error)
    const toast = useToast()
    toast.add({
      title: 'เข้าสู่ระบบไม่สำเร็จ',
      description: error.message || 'ไม่สามารถเข้าสู่ระบบได้',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
}
</style>