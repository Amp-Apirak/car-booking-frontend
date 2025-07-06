<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium flex items-center gap-2">
        <UIcon name="i-lucide-palette" class="size-5" />
        ตั้งค่ารูปลักษณ์ Sidebar
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
      description="การตั้งค่ารูปลักษณ์ Sidebar เป็นการตั้งค่าระดับระบบ เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถแก้ไขได้"
      class="mb-4"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Sidebar Colors Section -->
      <div class="space-y-6">
        <UFormGroup label="สีพื้นหลัง Sidebar">
          <div class="space-y-3">
            <!-- Predefined Colors -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="color in sidebarBackgroundColors"
                :key="color.value"
                @click="globalSettings.sidebar.backgroundColor = color.value"
                :class="[
                  'w-10 h-10 rounded-lg border-2 transition-all',
                  globalSettings.sidebar.backgroundColor === color.value 
                    ? 'border-primary-500 ring-2 ring-primary-200' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
                :style="{ backgroundColor: color.value }"
                :disabled="!isAdmin"
                :title="color.name"
              />
            </div>
            
            <!-- Custom Color Picker -->
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="globalSettings.sidebar.backgroundColor"
                :disabled="!isAdmin"
                class="w-12 h-10 rounded border border-gray-300 disabled:opacity-50"
              />
              <UInput
                v-model="globalSettings.sidebar.backgroundColor"
                placeholder="#ffffff"
                size="sm"
                :disabled="!isAdmin"
              />
            </div>
          </div>
        </UFormGroup>

        <UFormGroup label="สีตัวอักษร Sidebar">
          <div class="space-y-3">
            <!-- Predefined Text Colors -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="color in sidebarTextColors"
                :key="color.value"
                @click="globalSettings.sidebar.textColor = color.value"
                :class="[
                  'w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center',
                  globalSettings.sidebar.textColor === color.value 
                    ? 'border-primary-500 ring-2 ring-primary-200' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
                :style="{ backgroundColor: '#f9fafb', color: color.value }"
                :disabled="!isAdmin"
                :title="color.name"
              >
                Aa
              </button>
            </div>
            
            <!-- Custom Text Color Picker -->
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="globalSettings.sidebar.textColor"
                :disabled="!isAdmin"
                class="w-12 h-10 rounded border border-gray-300 disabled:opacity-50"
              />
              <UInput
                v-model="globalSettings.sidebar.textColor"
                placeholder="#000000"
                size="sm"
                :disabled="!isAdmin"
              />
            </div>
          </div>
        </UFormGroup>
      </div>

      <!-- Font Size and Typography -->
      <div class="space-y-6">
        <UFormGroup label="ขนาดตัวอักษร">
          <USelect 
            v-model="globalSettings.sidebar.fontSize"
            :options="fontSizeOptions"
            :disabled="!isAdmin"
          />
        </UFormGroup>

        <UFormGroup label="น้ำหนักตัวอักษร">
          <USelect 
            v-model="globalSettings.sidebar.fontWeight"
            :options="fontWeightOptions"
            :disabled="!isAdmin"
          />
        </UFormGroup>

        <!-- Sidebar Preview -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">ตัวอย่าง Sidebar:</label>
          <div 
            class="p-4 rounded-lg border"
            :style="{
              backgroundColor: globalSettings.sidebar.backgroundColor,
              color: globalSettings.sidebar.textColor,
              fontSize: globalSettings.sidebar.fontSize,
              fontWeight: globalSettings.sidebar.fontWeight
            }"
          >
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-current opacity-20 rounded"></div>
                <span>แดชบอร์ด</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-current opacity-20 rounded"></div>
                <span>จัดการการจอง</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-current opacity-20 rounded"></div>
                <span>จัดการรถยนต์</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reset Button -->
        <div class="pt-4">
          <UButton
            label="รีเซ็ตเป็นค่าเริ่มต้น"
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-rotate-ccw"
            :disabled="!isAdmin"
            @click="$emit('reset')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps<{
  globalSettings: any
  isAdmin: boolean
}>()

// Emits
defineEmits<{
  reset: []
}>()

// Sidebar Customization Options
const sidebarBackgroundColors = [
  { name: 'เทาเข้ม', value: '#1f2937' },
  { name: 'น้ำเงินเข้ม', value: '#1e3a8a' },
  { name: 'เขียวเข้ม', value: '#14532d' },
  { name: 'ม่วงเข้ม', value: '#581c87' },
  { name: 'แดงเข้ม', value: '#991b1b' },
  { name: 'ดำ', value: '#000000' },
  { name: 'ขาว', value: '#ffffff' },
  { name: 'ฟ้าอ่อน', value: '#dbeafe' }
]

const sidebarTextColors = [
  { name: 'ขาว', value: '#ffffff' },
  { name: 'ดำ', value: '#000000' },
  { name: 'เทาอ่อน', value: '#9ca3af' },
  { name: 'เทาเข้ม', value: '#374151' },
  { name: 'น้ำเงิน', value: '#3b82f6' },
  { name: 'เขียว', value: '#10b981' },
  { name: 'ม่วง', value: '#8b5cf6' },
  { name: 'แดง', value: '#ef4444' }
]

const fontSizeOptions = [
  { label: 'เล็ก (12px)', value: '12px' },
  { label: 'ปกติ (14px)', value: '14px' },
  { label: 'ใหญ่ (16px)', value: '16px' },
  { label: 'ใหญ่มาก (18px)', value: '18px' }
]

const fontWeightOptions = [
  { label: 'บาง', value: '300' },
  { label: 'ปกติ', value: '400' },
  { label: 'กลาง', value: '500' },
  { label: 'หนา', value: '600' },
  { label: 'หนามาก', value: '700' }
]
</script>