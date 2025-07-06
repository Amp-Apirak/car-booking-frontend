<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Settings Tabs -->
      <div class="mb-8">
        <UTabs v-model="activeTab" :items="settingsTabItems" class="w-full" />
      </div>

      <!-- Settings Content -->
      <UCard class="min-h-[600px]">
        <!-- General Settings -->
        <GeneralSettings
          v-if="activeTab === 'general'"
          :global-settings="globalSettings"
          :settings="settings"
          :is-admin="isAdmin"
          :saving-global-settings="savingGlobalSettings"
          @save-global-settings="saveGlobalSettings"
          @reset-sidebar-settings="resetSidebarSettings"
          @reset-theme-settings="resetThemeSettings"
        />

        <!-- Notification Settings -->
        <NotificationSettings
          v-if="activeTab === 'notification'"
          :settings="settings"
        />

        <!-- Security Settings -->
        <SecuritySettings
          v-if="activeTab === 'security'"
          :settings="settings"
        />

        <!-- Appearance Settings -->
        <AppearanceSettings
          v-if="activeTab === 'appearance'"
          :settings="settings"
        />

        <!-- Backup Settings -->
        <BackupSettings
          v-if="activeTab === 'backup'"
          :settings="settings"
          @backup-now="backupNow"
          @export-settings="exportSettings"
        />

        <!-- Maintenance Settings -->
        <MaintenanceSettings
          v-if="activeTab === 'maintenance'"
          :settings="settings"
          @optimize-database="optimizeDatabase"
          @test-system="testSystem"
        />

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mt-8 pt-6 border-t">
          <UButton 
            :label="t('settings.actions.reset')" 
            color="neutral"
            variant="outline"
            @click="resetSettings"
          />
          <UButton 
            :label="t('settings.actions.save')" 
            color="primary"
            @click="saveAllSettings"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import components
import GeneralSettings from '~/components/settings/GeneralSettings.vue'
import NotificationSettings from '~/components/settings/NotificationSettings.vue'
import SecuritySettings from '~/components/settings/SecuritySettings.vue'
import AppearanceSettings from '~/components/settings/AppearanceSettings.vue'
import BackupSettings from '~/components/settings/BackupSettings.vue'
import MaintenanceSettings from '~/components/settings/MaintenanceSettings.vue'

const { t } = useI18n()

const activeTab = ref('general')

// User Permission System
const currentUser = reactive({
  id: 1,
  name: 'Admin User',
  role: 'admin', // 'admin', 'manager', 'user'
  permissions: ['system:write', 'users:manage']
})

const isAdmin = computed(() => {
  return currentUser.role === 'admin' || currentUser.permissions.includes('system:write')
})

// Global Settings (ส่วนที่มีผลกับทุกคนในระบบ)
const globalSettings = reactive({
  systemName: 'ระบบจองรถยนต์',
  systemTagline: 'จัดการการจองอย่างมืออาชีพ',
  logoUrl: '',
  sidebar: {
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    fontSize: '14px',
    fontWeight: '400'
  },
  theme: {
    backgroundColor: '#f9fafb',
    cardBackgroundColor: '#ffffff',
    primaryTextColor: '#111827',
    secondaryTextColor: '#6b7280',
    primaryFontSize: '14px',
    secondaryFontSize: '12px',
    headingFontSize: '18px',
    fontWeight: '400'
  }
})

const savingGlobalSettings = ref(false)

const settingsTabItems = computed(() => [
  {
    label: t('settings.general.title'),
    icon: 'i-lucide-settings',
    value: 'general'
  },
  {
    label: t('settings.notification.title'),
    icon: 'i-lucide-bell',
    value: 'notification'
  },
  {
    label: t('settings.security.title'),
    icon: 'i-lucide-shield',
    value: 'security'
  },
  {
    label: t('settings.appearance.title'),
    icon: 'i-lucide-palette',
    value: 'appearance'
  },
  {
    label: t('settings.backup.title'),
    icon: 'i-lucide-hard-drive',
    value: 'backup'
  },
  {
    label: t('settings.maintenance.title'),
    icon: 'i-lucide-wrench',
    value: 'maintenance'
  }
])

const settings = reactive({
  general: {
    systemName: 'ระบบจองรถยนต์',
    systemTagline: 'จัดการการจองอย่างมืออาชีพ',
    logoUrl: '',
    language: 'th',
    timezone: 'Asia/Bangkok',
    currency: 'THB',
    dateFormat: 'DD/MM/YYYY'
  },
  notification: {
    bookingEmail: true,
    bookingSMS: false,
    bookingPush: true,
    paymentEmail: true,
    paymentSMS: true,
    paymentPush: true,
    maintenanceEmail: true,
    maintenanceSMS: false,
    maintenancePush: false
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
    loginAttempts: 3,
    auditLog: true
  },
  appearance: {
    theme: 'light',
    primaryColor: 'blue',
    sidebarPosition: 'left'
  },
  backup: {
    autoBackup: true,
    frequency: 'daily',
    lastBackup: '2024-01-15 10:30:00'
  },
  maintenance: {
    maintenanceMode: false
  }
})

async function saveAllSettings() {
  console.log('บันทึกการตั้งค่า:', settings)
  // TODO: บันทึกการตั้งค่าไปยัง API
}

async function resetSettings() {
  console.log('รีเซ็ตการตั้งค่า')
  // TODO: รีเซ็ตการตั้งค่าเป็นค่าเริ่มต้น
}

async function backupNow() {
  console.log('สำรองข้อมูลทันที')
  // TODO: สำรองข้อมูลทันที
}

async function exportSettings() {
  console.log('ส่งออกการตั้งค่า')
  // TODO: ส่งออกการตั้งค่าเป็นไฟล์
}

async function optimizeDatabase() {
  console.log('ปรับปรุงฐานข้อมูล')
  // TODO: ปรับปรุงฐานข้อมูล
}

async function testSystem() {
  console.log('ทดสอบระบบ')
  // TODO: ทดสอบระบบ
}

// Global Settings Functions
async function saveGlobalSettings() {
  if (!isAdmin.value) {
    alert('คุณไม่มีสิทธิ์ในการบันทึกการตั้งค่าระบบ')
    return
  }

  savingGlobalSettings.value = true
  
  try {
    // TODO: บันทึกการตั้งค่าระบบไปยัง API
    console.log('บันทึกการตั้งค่าระบบ:', {
      systemName: globalSettings.systemName,
      systemTagline: globalSettings.systemTagline,
      logoUrl: globalSettings.logoUrl
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // อัพเดต GlobalSidebar และ layout ทั้งหมด
    await updateGlobalBranding()
    
    alert('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว')
  } catch (error) {
    console.error('Error saving global settings:', error)
    alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
  } finally {
    savingGlobalSettings.value = false
  }
}

async function updateGlobalBranding() {
  // TODO: อัพเดต GlobalSidebar component
  // TODO: อัพเดต app.config หรือ global state
  // TODO: แจ้งเตือนผู้ใช้ทั้งหมดให้ refresh
  console.log('อัพเดตการแสดงผลระบบทั้งหมด')
}

// Sidebar Settings Functions
function resetSidebarSettings() {
  if (!isAdmin.value) {
    alert('คุณไม่มีสิทธิ์ในการรีเซ็ตการตั้งค่า')
    return
  }
  
  globalSettings.sidebar.backgroundColor = '#1f2937'
  globalSettings.sidebar.textColor = '#ffffff'
  globalSettings.sidebar.fontSize = '14px'
  globalSettings.sidebar.fontWeight = '400'
  
  console.log('รีเซ็ตการตั้งค่า Sidebar เป็นค่าเริ่มต้น')
}

// Theme Settings Functions
function resetThemeSettings() {
  if (!isAdmin.value) {
    alert('คุณไม่มีสิทธิ์ในการรีเซ็ตการตั้งค่า')
    return
  }
  
  globalSettings.theme.backgroundColor = '#f9fafb'
  globalSettings.theme.cardBackgroundColor = '#ffffff'
  globalSettings.theme.primaryTextColor = '#111827'
  globalSettings.theme.secondaryTextColor = '#6b7280'
  globalSettings.theme.primaryFontSize = '14px'
  globalSettings.theme.secondaryFontSize = '12px'
  globalSettings.theme.headingFontSize = '18px'
  globalSettings.theme.fontWeight = '400'
  
  console.log('รีเซ็ตการตั้งค่าธีมเป็นค่าเริ่มต้น')
}

// Load Global Settings on Mount
onMounted(async () => {
  try {
    // TODO: โหลดการตั้งค่าระบบจาก API
    console.log('โหลดการตั้งค่าระบบ')
  } catch (error) {
    console.error('Error loading global settings:', error)
  }
})
</script>