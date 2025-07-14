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

    <!-- ส่วน Footer: ข้อมูลผู้ใช้ -->
    <template #footer="{ collapsed }">
      <UButton
        :avatar="{ 
          src: 'https://github.com/nuxt.png',
          alt: t('system.admin')
        }"
        :label="collapsed ? undefined : t('system.admin')"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed"
        @click="openProfileMenu"
      >
        <!-- Status indicator เมื่อไม่ collapse -->
        <template v-if="!collapsed" #trailing>
          <UBadge 
            :label="t('system.online')" 
            color="success" 
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

// Load system settings from API
const { getSettings } = useSystemSettings()
const globalSettings = ref({
  system_name: 'ระบบจองรถยนต์',
  system_tagline: 'จัดการการจองอย่างมืออาชีพ',
  system_logo: ''
})

// Load settings from API on mount
onMounted(async () => {
  try {
    const settings = await getSettings(false) // public settings เท่านั้น
    if (settings) {
      globalSettings.value.system_name = settings.system_name || 'ระบบจองรถยนต์'
      globalSettings.value.system_tagline = settings.system_tagline || 'จัดการการจองอย่างมืออาชีพ'
      globalSettings.value.system_logo = settings.system_logo || ''
      
      console.log('โหลดการตั้งค่าใน GlobalSidebar สำเร็จ:', settings)
    }
  } catch (error) {
    console.error('Error loading settings in GlobalSidebar:', error)
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

function handleLogout() {
  // TODO: ฟังก์ชันออกจากระบบ
  console.log('ออกจากระบบ')
  router.push('/')
}

// ฟัง keyboard shortcut
defineShortcuts({
  meta_k: openSearchModal
})
</script>