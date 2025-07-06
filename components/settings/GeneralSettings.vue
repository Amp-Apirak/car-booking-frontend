<template>
  <div class="space-y-8">
    <div class="flex items-center gap-3 mb-6">
      <UIcon name="i-lucide-settings" class="size-5" />
      <h2 class="text-xl font-semibold">{{ t('settings.general.title') }}</h2>
    </div>

    <!-- System Branding Section -->
    <div class="bg-gray-50 rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium flex items-center gap-2">
          <UIcon name="i-lucide-image" class="size-5" />
          ตั้งค่าชื่อระบบและโลโก้ (Global)
        </h3>
        <UBadge 
          label="Admin เท่านั้น" 
          color="orange" 
          variant="subtle"
          v-if="!isAdmin"
        />
      </div>
      
      <!-- Admin Permission Warning -->
      <UAlert
        v-if="!isAdmin"
        icon="i-lucide-shield-alert"
        color="orange"
        variant="soft"
        title="สิทธิ์ไม่เพียงพอ"
        description="การตั้งค่าชื่อระบบและโลโก้เป็นการตั้งค่าระดับระบบ เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถแก้ไขได้"
        class="mb-4"
      />
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Logo Upload Section -->
        <div class="space-y-4">
          <UFormGroup label="โลโก้ระบบ">
            <div class="space-y-4">
              <!-- Current Logo Preview -->
              <div class="flex items-center justify-center w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                <div v-if="globalSettings.system_logo" class="relative">
                  <img 
                    :src="globalSettings.system_logo" 
                    alt="Logo" 
                    class="w-full h-full object-contain rounded-lg"
                  />
                  <UButton
                    v-if="isAdmin"
                    icon="i-lucide-x"
                    color="red"
                    variant="solid"
                    size="2xs"
                    class="absolute -top-2 -right-2"
                    @click="removeLogo"
                  />
                </div>
                <div v-else class="text-center">
                  <UIcon name="i-lucide-image-plus" class="size-8 text-gray-400 mb-2" />
                  <p class="text-sm text-gray-500">ไม่มีโลโก้</p>
                </div>
              </div>
              
              <!-- Logo Upload Button -->
              <div class="flex gap-2">
                <UButton
                  :label="globalSettings.system_logo ? 'เปลี่ยนโลโก้' : 'อัพโหลดโลโก้'"
                  icon="i-lucide-upload"
                  color="primary"
                  variant="outline"
                  :disabled="!isAdmin || uploadingLogo"
                  :loading="uploadingLogo"
                  @click="triggerLogoUpload"
                />
                <UButton
                  v-if="globalSettings.system_logo"
                  label="ลบโลโก้"
                  icon="i-lucide-trash-2"
                  color="red"
                  variant="outline"
                  :disabled="!isAdmin"
                  @click="removeLogo"
                />
              </div>
              
              <!-- Hidden file input -->
              <input
                ref="logoFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleLogoUpload"
              />
              
              <p class="text-sm text-gray-500">
                รองรับไฟล์: JPG, PNG, GIF (ขนาดไม่เกิน 2MB)
              </p>
            </div>
          </UFormGroup>
        </div>

        <!-- System Name Section -->
        <div class="space-y-6">
          <UFormGroup :label="t('settings.general.system_name')">
            <UInput 
              v-model="globalSettings.system_name"
              placeholder="ระบบจองรถยนต์"
              size="lg"
              :disabled="!isAdmin"
            />
          </UFormGroup>

          <UFormGroup :label="t('settings.general.system_tagline')" class="mt-6">
            <UTextarea 
              v-model="globalSettings.system_tagline"
              placeholder="จัดการการจองอย่างมืออาชีพ"
              :rows="3"
              :disabled="!isAdmin"
            />
          </UFormGroup>
          
          <!-- Preview Section -->
          <div class="mt-4 p-4 bg-white rounded-lg border">
            <p class="text-sm text-gray-600 mb-2">ตัวอย่างการแสดงผลสำหรับทุกคน:</p>
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <div v-if="globalSettings.system_logo" class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <img :src="globalSettings.system_logo" alt="Logo" class="w-8 h-8 object-contain" />
                </div>
                <div v-else class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <UIcon name="i-lucide-car" class="size-6 text-white" />
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <h1 class="font-bold text-lg text-gray-900 truncate">
                  {{ globalSettings.system_name || 'ระบบจองรถยนต์' }}
                </h1>
                <p class="text-xs text-gray-600 truncate">
                  {{ globalSettings.system_tagline || 'จัดการการจองอย่างมืออาชีพ' }}
                </p>
              </div>
            </div>
            
            <div v-if="isAdmin" class="mt-4 pt-3 border-t border-gray-200">
              <div class="flex justify-end gap-2">
                <UButton
                  label="บันทึกการตั้งค่าระบบ"
                  color="primary"
                  size="sm"
                  icon="i-lucide-save"
                  @click="saveGlobalSettings"
                  :loading="savingGlobalSettings"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Customization Section -->
    <SidebarCustomization 
      :global-settings="globalSettings" 
      :is-admin="isAdmin"
      @reset="resetSidebarSettings"
    />

    <!-- Global Theme Customization Section -->
    <ThemeCustomization 
      :global-settings="globalSettings" 
      :is-admin="isAdmin"
      @reset="resetThemeSettings"
    />

    <!-- Other General Settings -->
    <div class="space-y-6">
      <UFormGroup :label="t('settings.general.language')">
        <USelect 
          v-model="settings.general.language"
          :options="languageOptions"
        />
      </UFormGroup>

      <UFormGroup :label="t('settings.general.timezone')">
        <USelect 
          v-model="settings.general.timezone"
          :options="timezoneOptions"
        />
      </UFormGroup>

      <UFormGroup :label="t('settings.general.currency')">
        <USelect 
          v-model="settings.general.currency"
          :options="currencyOptions"
        />
      </UFormGroup>

      <UFormGroup :label="t('settings.general.date_format')">
        <USelect 
          v-model="settings.general.dateFormat"
          :options="dateFormatOptions"
        />
      </UFormGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import components
import SidebarCustomization from './SidebarCustomization.vue'
import ThemeCustomization from './ThemeCustomization.vue'

const { t } = useI18n()

// Props
const props = defineProps<{
  globalSettings: any
  settings: any
  isAdmin: boolean
  savingGlobalSettings: boolean
}>()

// Emits
const emit = defineEmits<{
  saveGlobalSettings: []
  resetSidebarSettings: []
  resetThemeSettings: []
}>()

// Logo Upload Functions
const logoFileInput = ref(null)
const uploadingLogo = ref(false)
const { uploadLogo, deleteLogo } = useSystemSettings()

function triggerLogoUpload() {
  logoFileInput.value?.click()
}

async function handleLogoUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // ตรวจสอบสิทธิ์
  if (!props.isAdmin) {
    const toast = useToast()
    toast.add({
      title: 'ไม่มีสิทธิ์',
      description: 'คุณไม่มีสิทธิ์ในการแก้ไขการตั้งค่าระบบ',
      color: 'red'
    })
    return
  }

  // ตรวจสอบขนาดไฟล์ (2MB)
  if (file.size > 2 * 1024 * 1024) {
    const toast = useToast()
    toast.add({
      title: 'ไฟล์ใหญ่เกินไป',
      description: 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 2MB',
      color: 'red'
    })
    return
  }

  // ตรวจสอบประเภทไฟล์
  if (!file.type.startsWith('image/')) {
    const toast = useToast()
    toast.add({
      title: 'ไฟล์ไม่ถูกต้อง',
      description: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น',
      color: 'red'
    })
    return
  }

  uploadingLogo.value = true

  try {
    // อัพโหลดไฟล์ไปยัง server
    const response = await uploadLogo(file)
    
    // อัพเดต logoUrl ด้วย URL จาก server
    const config = useRuntimeConfig()
    const API_BASE_URL = config.public.apiBase || 'http://localhost:4000/api'
    const serverUrl = API_BASE_URL.replace('/api', '')
    props.globalSettings.system_logo = serverUrl + response.data.logoUrl

    const toast = useToast()
    toast.add({
      title: 'อัพโหลดสำเร็จ',
      description: 'อัพโหลดโลโก้สำเร็จแล้ว',
      color: 'green'
    })

    console.log('อัพโหลดไฟล์ระบบสำเร็จ:', response)
  } catch (error) {
    console.error('Error uploading logo:', error)
    const toast = useToast()
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: 'ไม่สามารถอัพโหลดโลโก้ได้',
      color: 'red'
    })
  } finally {
    uploadingLogo.value = false
    // ล้างค่า input
    if (logoFileInput.value) {
      logoFileInput.value.value = ''
    }
  }
}

async function removeLogo() {
  if (!props.isAdmin) {
    const toast = useToast()
    toast.add({
      title: 'ไม่มีสิทธิ์',
      description: 'คุณไม่มีสิทธิ์ในการแก้ไขการตั้งค่าระบบ',
      color: 'red'
    })
    return
  }

  try {
    await deleteLogo()
    props.globalSettings.system_logo = ''
    
    const toast = useToast()
    toast.add({
      title: 'ลบสำเร็จ',
      description: 'ลบโลโก้สำเร็จแล้ว',
      color: 'green'
    })
  } catch (error) {
    console.error('Error deleting logo:', error)
    const toast = useToast()
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: 'ไม่สามารถลบโลโก้ได้',
      color: 'red'
    })
  }
}

function saveGlobalSettings() {
  emit('saveGlobalSettings')
}

function resetSidebarSettings() {
  emit('resetSidebarSettings')
}

function resetThemeSettings() {
  emit('resetThemeSettings')
}

// Options
const languageOptions = [
  { label: 'ไทย', value: 'th' },
  { label: 'English', value: 'en' }
]

const timezoneOptions = [
  { label: 'Asia/Bangkok', value: 'Asia/Bangkok' },
  { label: 'UTC', value: 'UTC' }
]

const currencyOptions = [
  { label: 'THB (บาท)', value: 'THB' },
  { label: 'USD (ดอลลาร์)', value: 'USD' }
]

const dateFormatOptions = [
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
]
</script>