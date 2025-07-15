<template>
  <!-- Global Sidebar ที่รองรับ i18n และใช้ได้ทุกหน้า -->
  <UDashboardSidebar 
    collapsible 
    resizable
    :ui="{ footer: 'border-t border-default' }"
  >
    <!-- ส่วน Header: Logo และชื่อระบบ -->
    <template #header="{ collapsed }">
      <div class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors" @click="navigateToHome">
        <!-- Logo รถ หรือ Logo ที่อัพโหลด -->
        <div class="flex items-center justify-center size-10 bg-primary rounded-lg shrink-0">
          <img 
            v-if="globalSettings.system_logo" 
            :src="globalSettings.system_logo" 
            alt="Logo" 
            class="size-8 object-contain rounded"
          />
          <UIcon v-else name="i-lucide-car" class="size-6 text-white" />
        </div>
        
        <!-- ชื่อระบบ (ซ่อนเมื่อ collapsed) -->
        <div v-if="!collapsed" class="min-w-0 flex-1">
          <h1 class="font-bold text-lg text-highlighted truncate">
            {{ globalSettings.system_name }}
          </h1>
          <p class="text-xs text-muted truncate">
            {{ globalSettings.system_tagline }}
          </p>
        </div>
      </div>
    </template>

    <!-- ส่วนเนื้อหาหลัก: เมนูและการค้นหา -->
    <template #default="{ collapsed }">
      <!-- ปุ่มค้นหา -->
      <UButton
        :label="collapsed ? undefined : t('system.search')"
        icon="i-lucide-search"
        color="neutral"
        variant="outline"
        block
        :square="collapsed"
        class="mb-6"
        @click="openSearchModal"
      >
        <!-- Keyboard shortcut เมื่อไม่ collapse -->
        <template v-if="!collapsed" #trailing>
          <div class="flex items-center gap-0.5 ms-auto">
            <UKbd value="meta" variant="subtle" />
            <UKbd value="K" variant="subtle" />
          </div>
        </template>
      </UButton>

      <!-- สลับภาษา -->
      <div v-if="!collapsed" class="mb-6">
        <div class="flex items-center gap-2 mb-2">
          <UIcon name="i-lucide-languages" class="size-4 text-muted" />
          <span class="text-sm text-muted">ภาษา / Language</span>
        </div>
        <div class="flex gap-1">
          <UButton 
            label="ไทย" 
            :variant="locale === 'th' ? 'solid' : 'ghost'"
            :color="locale === 'th' ? 'primary' : 'neutral'"
            size="xs"
            @click="switchLanguage('th')"
          />
          <UButton 
            label="EN" 
            :variant="locale === 'en' ? 'solid' : 'ghost'"
            :color="locale === 'en' ? 'primary' : 'neutral'"
            size="xs"
            @click="switchLanguage('en')"
          />
        </div>
      </div>

      <!-- เมนูหลัก -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="mainMenuItems"
        orientation="vertical"
        class="flex-1"
      />

      <!-- เมนูด้านล่าง -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="bottomMenuItems"
        orientation="vertical"
        class="mt-auto"
      />
    </template>

    <!-- ส่วน Footer: ข้อมูลผู้ใช้จริง -->
    <template #footer="{ collapsed }">
      <!-- แสดงข้อมูลผู้ใช้แบบเต็ม เมื่อไม่ collapse -->
      <div v-if="!collapsed && currentUser" class="px-3 py-2 border-t border-gray-200">
        <div class="flex items-center space-x-3">
          <!-- รูป Avatar พร้อม fallback และ error handling -->
          <UAvatar
            :src="avatarUrl"
            :alt="displayName"
            :ui="{ rounded: 'rounded-full' }"
            size="md"
          />
          
          <!-- ข้อมูลผู้ใช้ -->
          <div class="flex-1 min-w-0">
            <!-- ชื่อผู้ใช้ -->
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ displayName }}
            </p>
            <!-- บทบาท -->
            <p class="text-xs text-gray-500 truncate">
              {{ userRole }}
            </p>
          </div>
          
          <!-- สถานะออนไลน์ -->
          <UBadge 
            :label="userStatus.label" 
            :color="userStatus.color" 
            variant="subtle" 
            size="xs" 
          />
        </div>
        
        <!-- ปุ่มโปรไฟล์ -->
        <UButton
          label="ดูโปรไฟล์"
          icon="i-lucide-user"
          color="neutral"
          variant="ghost"
          size="xs"
          class="w-full mt-2"
          @click="openProfileMenu"
        />
      </div>

      <!-- แสดงแบบง่ายเมื่อ collapse หรือไม่มีข้อมูลผู้ใช้ -->
      <UButton
        v-else
        :avatar="{ 
          src: avatarUrl,
          alt: displayName
        }"
        :label="collapsed ? undefined : displayName"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed"
        @click="openProfileMenu"
      >
        <!-- Status indicator เมื่อไม่ collapse -->
        <template v-if="!collapsed" #trailing>
          <UBadge 
            :label="userStatus.label" 
            :color="userStatus.color" 
            variant="subtle" 
            size="sm" 
          />
        </template>
      </UButton>
    </template>
  </UDashboardSidebar>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// ใช้ i18n และ router
const { t, locale } = useI18n({ useScope: 'global' })
const router = useRouter()
const route = useRoute()

// ดึงข้อมูลผู้ใช้จาก useAuth composable
const { getCurrentUser, isAuthenticated } = useAuth()

// สร้าง reactive data สำหรับเก็บข้อมูลผู้ใช้ปัจจุบัน
const currentUser = ref(null)

// Load system settings from API
const { getSettings } = useSystemSettings()
const globalSettings = ref({
  system_name: 'ระบบจองรถยนต์',
  system_tagline: 'จัดการการจองอย่างมืออาชีพ',
  system_logo: ''
})

// ฟังก์ชันโหลดข้อมูลผู้ใช้ปัจจุบัน
const loadCurrentUser = () => {
  try {
    // ตรวจสอบว่าผู้ใช้ได้รับการ authenticate หรือไม่
    if (isAuthenticated()) {
      // ดึงข้อมูลผู้ใช้จาก cookies/storage
      const userData = getCurrentUser()
      currentUser.value = userData
      console.log('🔍 โหลดข้อมูลผู้ใช้ใน GlobalSidebar สำเร็จ:', userData)
    } else {
      // ถ้าไม่ได้ authenticate ให้ clear ข้อมูล
      currentUser.value = null
      console.log('⚠️ ผู้ใช้ยังไม่ได้ authenticate')
    }
  } catch (error) {
    console.error('❌ Error loading current user in GlobalSidebar:', error)
    currentUser.value = null
  }
}

// Load settings from API on mount
onMounted(async () => {
  try {
    // โหลดการตั้งค่าระบบ
    const settings = await getSettings(false) // public settings เท่านั้น
    if (settings) {
      globalSettings.value.system_name = settings.system_name || 'ระบบจองรถยนต์'
      globalSettings.value.system_tagline = settings.system_tagline || 'จัดการการจองอย่างมืออาชีพ'
      globalSettings.value.system_logo = settings.system_logo || ''
      
      console.log('📊 โหลดการตั้งค่าใน GlobalSidebar สำเร็จ:', settings)
    }

    // โหลดข้อมูลผู้ใช้ปัจจุบัน
    loadCurrentUser()
  } catch (error) {
    console.error('❌ Error loading settings in GlobalSidebar:', error)
    // ถึงแม้ settings จะโหลดไม่ได้ ก็ยังโหลดข้อมูลผู้ใช้
    loadCurrentUser()
  }
})

// ฟังก์ชันสร้าง Avatar URL จากตัวอักษรแรกของชื่อ
const generateInitialsAvatar = (name: string): string => {
  if (!name) return ''
  
  // ดึงตัวอักษรแรกของชื่อและนามสกุล
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2) // เอาแค่ 2 ตัวแรก
    .join('')
  
  // สร้าง URL สำหรับ UI Avatars (บริการฟรีสร้าง avatar จากตัวอักษร)
  const backgroundColor = getAvatarColor(name) // สีพื้นหลังจากชื่อ
  const textColor = 'FFFFFF' // ข้อความสีขาว
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=128&background=${backgroundColor}&color=${textColor}&bold=true`
}

// ฟังก์ชันสร้างสีพื้นหลัง Avatar จากชื่อ (เพื่อให้ผู้ใช้แต่ละคนมีสีที่แตกต่างกัน)
const getAvatarColor = (name: string): string => {
  const colors = [
    '3B82F6', // Blue
    '10B981', // Green  
    'F59E0B', // Yellow
    'EF4444', // Red
    '8B5CF6', // Purple
    'F97316', // Orange
    '06B6D4', // Cyan
    'EC4899'  // Pink
  ]
  
  // ใช้ hash ของชื่อเพื่อเลือกสี
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Computed property สำหรับ Avatar URL ที่มี fallback และ error handling
const avatarUrl = computed(() => {
  try {
    // ลำดับการ fallback:
    // 1. รูปจาก API ถ้ามี
    // 2. สร้าง avatar จากตัวอักษรแรกของชื่อ  
    // 3. รูป default สุดท้าย
    if (currentUser.value?.avatar && currentUser.value.avatar.trim() !== '') {
      return currentUser.value.avatar
    } else if (currentUser.value?.name && currentUser.value.name.trim() !== '') {
      return generateInitialsAvatar(currentUser.value.name)
    } else {
      return 'https://github.com/nuxt.png' // Default fallback
    }
  } catch (error) {
    console.error('❌ Error generating avatar URL:', error)
    return 'https://github.com/nuxt.png' // Safe fallback
  }
})

// Computed property สำหรับชื่อแสดงผล
const displayName = computed(() => {
  try {
    if (currentUser.value?.name && currentUser.value.name.trim() !== '') {
      return currentUser.value.name
    } else if (currentUser.value?.username && currentUser.value.username.trim() !== '') {
      return currentUser.value.username
    } else {
      return 'ผู้ใช้'
    }
  } catch (error) {
    console.error('❌ Error getting display name:', error)
    return 'ผู้ใช้'
  }
})

// Computed property สำหรับบทบาท
const userRole = computed(() => {
  try {
    if (currentUser.value?.role && currentUser.value.role.trim() !== '') {
      // แปลงบทบาทเป็นภาษาไทย
      const roleTranslations = {
        'admin': 'ผู้ดูแลระบบ',
        'manager': 'ผู้จัดการ', 
        'user': 'ผู้ใช้งาน',
        'driver': 'คนขับ',
        'staff': 'เจ้าหน้าที่'
      }
      return roleTranslations[currentUser.value.role] || currentUser.value.role
    } else {
      return 'ผู้ใช้งาน'
    }
  } catch (error) {
    console.error('❌ Error getting user role:', error)
    return 'ผู้ใช้งาน'
  }
})

// Computed property สำหรับสถานะ
const userStatus = computed(() => {
  try {
    if (currentUser.value?.status === 'active') {
      return { label: 'ออนไลน์', color: 'success' }
    } else {
      return { label: 'ออฟไลน์', color: 'gray' }
    }
  } catch (error) {
    console.error('❌ Error getting user status:', error)
    return { label: 'ออฟไลน์', color: 'gray' }
  }
})

// ฟังก์ชันสลับภาษา
function switchLanguage(lang: string) {
  locale.value = lang
}

// ฟังก์ชันเช็คว่าเมนูไหน active
function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}

// เมนูหลัก (คำนวณใหม่เมื่อภาษาหรือ route เปลี่ยน)
const mainMenuItems = computed((): NavigationMenuItem[][] => [[
  {
    label: t('menu.dashboard'),
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard',
    active: isActive('/dashboard')
  },
  {
    label: t('menu.bookings'),
    icon: 'i-lucide-calendar-check',
    active: isActive('/bookings'),
    badge: '4', // แสดงจำนวนการจองที่รอดำเนินการ
    children: [
      {
        label: t('submenu.bookings.new'),
        to: '/bookings/new'
      },
      {
        label: t('submenu.bookings.pending'),
        to: '/bookings/pending'
      },
      {
        label: t('submenu.bookings.confirmed'),
        to: '/bookings/confirmed'
      },
      {
        label: t('submenu.bookings.completed'),
        to: '/bookings/completed'
      }
    ]
  },
  {
    label: t('menu.cars'),
    icon: 'i-lucide-car',
    active: isActive('/vehicles'),
    children: [
      {
        label: t('submenu.cars.list'),
        to: '/vehicles'
      },
      {
        label: t('submenu.cars.brand'),
        to: '/vehicles/brand'
      },
      {
        label: t('submenu.cars.model'),
        to: '/vehicles/model'
      },
      {
        label: t('submenu.cars.accessories'),
        to: '/vehicles/accessories'
      }
    ]
  },
  {
    label: t('menu.reports'),
    icon: 'i-lucide-bar-chart-3',
    active: isActive('/reports'),
    children: [
      {
        label: t('submenu.reports.daily'),
        to: '/reports/daily'
      },
      {
        label: t('submenu.reports.monthly'),
        to: '/reports/monthly'
      },
      {
        label: t('submenu.reports.statistics'),
        to: '/reports/statistics'
      }
    ]
  },
  {
    label: t('menu.admin'),
    icon: 'i-lucide-settings-2',
    active: isActive('/admin'),
    children: [
      {
        label: t('submenu.admin.departments'),
        to: '/admin/departments'
      },
      {
        label: t('submenu.admin.users'),
        to: '/admin/users'
      },
      {
        label: t('submenu.admin.drivers'),
        to: '/admin/drivers'
      },
      {
        label: t('submenu.admin.roles'),
        to: '/admin/roles'
      },
      {
        label: t('submenu.admin.permissions'),
        to: '/admin/permissions'
      },
      {
        label: t('submenu.admin.approvals'),
        to: '/admin/approvals'
      }
    ]
  }
]])

// เมนูด้านล่าง
const bottomMenuItems = computed((): NavigationMenuItem[][] => [[
  {
    label: t('menu.settings'),
    icon: 'i-lucide-settings',
    to: '/settings',
    active: isActive('/settings')
  },
  {
    label: t('menu.help'),
    icon: 'i-lucide-help-circle',
    to: '/help',
    active: isActive('/help')
  },
  {
    label: t('logout'),
    icon: 'i-lucide-log-out',
    onClick: handleLogout
  }
]])

// ฟังก์ชันต่างๆ
function openSearchModal() {
  // TODO: เปิด modal ค้นหา
  console.log('เปิดหน้าต่างค้นหา')
}

function openProfileMenu() {
  // TODO: เปิดเมนูโปรไฟล์
  console.log('เปิดเมนูโปรไฟล์')
}

function navigateToHome() {
  router.push('/')
}

async function handleLogout() {
  try {
    const { logout } = useAuth()
    await logout()
    
    // เปลี่ยนเส้นทางไปหน้า login
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // ถ้าเกิดข้อผิดพลาด ให้ไปหน้า login อยู่ดี
    await navigateTo('/login')
  }
}

// ฟัง keyboard shortcut
defineShortcuts({
  meta_k: openSearchModal
})
</script>