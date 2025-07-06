<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium flex items-center gap-2">
        <UIcon name="i-lucide-paintbrush" class="size-5" />
        ตั้งค่าธีมโดยรวมของระบบ
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
      description="การตั้งค่าธีมโดยรวมเป็นการตั้งค่าระดับระบบ เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถแก้ไขได้"
      class="mb-4"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Background Colors Section -->
      <div class="space-y-6">
        <UFormGroup label="สีพื้นหลังหลักของระบบ">
          <div class="space-y-3">
            <!-- Predefined Background Colors -->
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="color in systemBackgroundColors"
                :key="color.value"
                @click="globalSettings.theme.backgroundColor = color.value"
                :class="[
                  'aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-xs font-medium',
                  globalSettings.theme.backgroundColor === color.value 
                    ? 'border-primary-500 ring-2 ring-primary-200' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
                :style="{ backgroundColor: color.value, color: color.textColor }"
                :disabled="!isAdmin"
                :title="color.name"
              >
                {{ color.name.slice(0, 2) }}
              </button>
            </div>
            
            <!-- Custom Background Color Picker -->
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="globalSettings.theme.backgroundColor"
                :disabled="!isAdmin"
                class="w-12 h-10 rounded border border-gray-300 disabled:opacity-50"
              />
              <UInput
                v-model="globalSettings.theme.backgroundColor"
                placeholder="#ffffff"
                size="sm"
                :disabled="!isAdmin"
              />
            </div>
          </div>
        </UFormGroup>

        <UFormGroup label="สีพื้นหลังการ์ด/กล่อง">
          <div class="space-y-3">
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="color in cardBackgroundColors"
                :key="color.value"
                @click="globalSettings.theme.cardBackgroundColor = color.value"
                :class="[
                  'aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-xs font-medium',
                  globalSettings.theme.cardBackgroundColor === color.value 
                    ? 'border-primary-500 ring-2 ring-primary-200' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
                :style="{ backgroundColor: color.value, color: color.textColor }"
                :disabled="!isAdmin"
                :title="color.name"
              >
                {{ color.name.slice(0, 2) }}
              </button>
            </div>
            
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="globalSettings.theme.cardBackgroundColor"
                :disabled="!isAdmin"
                class="w-12 h-10 rounded border border-gray-300 disabled:opacity-50"
              />
              <UInput
                v-model="globalSettings.theme.cardBackgroundColor"
                placeholder="#ffffff"
                size="sm"
                :disabled="!isAdmin"
              />
            </div>
          </div>
        </UFormGroup>
      </div>

      <!-- Text Colors Section -->
      <div class="space-y-6">
        <UFormGroup label="สีตัวอักษรหลัก">
          <div class="space-y-3">
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="color in systemTextColors"
                :key="color.value"
                @click="globalSettings.theme.primaryTextColor = color.value"
                :class="[
                  'aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-sm font-medium',
                  globalSettings.theme.primaryTextColor === color.value 
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
            
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="globalSettings.theme.primaryTextColor"
                :disabled="!isAdmin"
                class="w-12 h-10 rounded border border-gray-300 disabled:opacity-50"
              />
              <UInput
                v-model="globalSettings.theme.primaryTextColor"
                placeholder="#000000"
                size="sm"
                :disabled="!isAdmin"
              />
            </div>
          </div>
        </UFormGroup>

        <UFormGroup label="สีตัวอักษรรอง">
          <div class="space-y-3">
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="color in systemTextColors"
                :key="color.value"
                @click="globalSettings.theme.secondaryTextColor = color.value"
                :class="[
                  'aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-xs font-medium',
                  globalSettings.theme.secondaryTextColor === color.value 
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
            
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="globalSettings.theme.secondaryTextColor"
                :disabled="!isAdmin"
                class="w-12 h-10 rounded border border-gray-300 disabled:opacity-50"
              />
              <UInput
                v-model="globalSettings.theme.secondaryTextColor"
                placeholder="#6b7280"
                size="sm"
                :disabled="!isAdmin"
              />
            </div>
          </div>
        </UFormGroup>
      </div>

      <!-- Typography Section -->
      <div class="space-y-5">
        <div class="mb-5">
          <UFormGroup label="ขนาดตัวอักษรหลัก">
            <select 
              v-model="globalSettings.theme.primaryFontSize"
              :disabled="!isAdmin"
              class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:bg-gray-50"
            >
              <option v-for="option in systemFontSizeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </UFormGroup>
        </div>

        <div class="mb-5">
          <UFormGroup label="ขนาดตัวอักษรรอง">
            <select 
              v-model="globalSettings.theme.secondaryFontSize"
              :disabled="!isAdmin"
              class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:bg-gray-50"
            >
              <option v-for="option in systemFontSizeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </UFormGroup>
        </div>

        <div class="mb-5">
          <UFormGroup label="ขนาดตัวอักษรหัวข้อ">
            <select 
              v-model="globalSettings.theme.headingFontSize"
              :disabled="!isAdmin"
              class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:bg-gray-50"
            >
              <option v-for="option in headingFontSizeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </UFormGroup>
        </div>

        <div class="mb-5">
          <UFormGroup label="น้ำหนักตัวอักษร">
            <select 
              v-model="globalSettings.theme.fontWeight"
              :disabled="!isAdmin"
              class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:bg-gray-50"
            >
              <option v-for="option in fontWeightOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </UFormGroup>
        </div>

        <!-- Reset Theme Button -->
        <div class="pt-4">
          <UButton
            label="รีเซ็ตธีมเป็นค่าเริ่มต้น"
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

    <!-- Theme Preview Section -->
    <div class="mt-8 pt-6 border-t border-gray-200">
      <h4 class="text-md font-medium mb-4">ตัวอย่างธีมระบบ:</h4>
      <div 
        class="p-6 rounded-lg border-2"
        :style="{
          backgroundColor: globalSettings.theme.backgroundColor,
          color: globalSettings.theme.primaryTextColor,
          fontSize: globalSettings.theme.primaryFontSize,
          fontWeight: globalSettings.theme.fontWeight
        }"
      >
        <div class="space-y-4">
          <!-- Header Example -->
          <div>
            <h1 
              :style="{
                color: globalSettings.theme.primaryTextColor,
                fontSize: globalSettings.theme.headingFontSize,
                fontWeight: '600'
              }"
            >
              ตัวอย่างหัวข้อหลัก
            </h1>
            <p 
              :style="{
                color: globalSettings.theme.secondaryTextColor,
                fontSize: globalSettings.theme.secondaryFontSize
              }"
            >
              ตัวอย่างข้อความรอง คำอธิบายเพิ่มเติม
            </p>
          </div>

          <!-- Card Example -->
          <div 
            class="p-4 rounded-lg"
            :style="{
              backgroundColor: globalSettings.theme.cardBackgroundColor,
              color: globalSettings.theme.primaryTextColor
            }"
          >
            <h3 class="font-medium mb-2">ตัวอย่างการ์ด</h3>
            <p 
              :style="{
                color: globalSettings.theme.secondaryTextColor,
                fontSize: globalSettings.theme.secondaryFontSize
              }"
            >
              เนื้อหาภายในการ์ด ข้อมูลสำคัญต่างๆ
            </p>
          </div>

          <!-- Button Example -->
          <div class="flex gap-3">
            <div class="px-4 py-2 bg-blue-500 text-white rounded">ปุ่มหลัก</div>
            <div class="px-4 py-2 border border-gray-300 rounded" 
                 :style="{ color: globalSettings.theme.primaryTextColor }">
              ปุ่มรอง
            </div>
          </div>
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

// System Theme Options
const systemBackgroundColors = [
  { name: 'ขาวใส', value: '#ffffff', textColor: '#000000' },
  { name: 'เทาอ่อน', value: '#f9fafb', textColor: '#111827' },
  { name: 'เทากลาง', value: '#f3f4f6', textColor: '#111827' },
  { name: 'เทาเข้ม', value: '#e5e7eb', textColor: '#111827' },
  { name: 'ฟ้าอ่อน', value: '#eff6ff', textColor: '#1e40af' },
  { name: 'เขียวอ่อน', value: '#f0fdf4', textColor: '#166534' },
  { name: 'เหลืองอ่อน', value: '#fefce8', textColor: '#ca8a04' },
  { name: 'ครีม', value: '#fef7ed', textColor: '#9a3412' }
]

const cardBackgroundColors = [
  { name: 'ขาวใส', value: '#ffffff', textColor: '#000000' },
  { name: 'เทาอ่อน', value: '#f8fafc', textColor: '#0f172a' },
  { name: 'ฟ้าอ่อน', value: '#f1f5f9', textColor: '#0f172a' },
  { name: 'เขียวอ่อน', value: '#f7fee7', textColor: '#365314' },
  { name: 'เหลืองอ่อน', value: '#fffbeb', textColor: '#92400e' },
  { name: 'ชมพูอ่อน', value: '#fdf2f8', textColor: '#9d174d' },
  { name: 'ม่วงอ่อน', value: '#faf5ff', textColor: '#6b21a8' },
  { name: 'ครีม', value: '#fefce8', textColor: '#713f12' }
]

const systemTextColors = [
  { name: 'ดำ', value: '#000000' },
  { name: 'เทาเข้ม', value: '#111827' },
  { name: 'เทาปกติ', value: '#374151' },
  { name: 'เทาอ่อน', value: '#6b7280' },
  { name: 'น้ำเงิน', value: '#1d4ed8' },
  { name: 'เขียว', value: '#059669' },
  { name: 'แดง', value: '#dc2626' },
  { name: 'ม่วง', value: '#7c3aed' }
]

const systemFontSizeOptions = [
  { label: 'เล็กมาก (10px)', value: '10px' },
  { label: 'เล็ก (12px)', value: '12px' },
  { label: 'ปกติ (14px)', value: '14px' },
  { label: 'ใหญ่ (16px)', value: '16px' },
  { label: 'ใหญ่มาก (18px)', value: '18px' }
]

const headingFontSizeOptions = [
  { label: 'เล็ก (16px)', value: '16px' },
  { label: 'ปกติ (18px)', value: '18px' },
  { label: 'ใหญ่ (20px)', value: '20px' },
  { label: 'ใหญ่มาก (24px)', value: '24px' },
  { label: 'ใหญ่สุด (28px)', value: '28px' }
]

const fontWeightOptions = [
  { label: 'บาง', value: '300' },
  { label: 'ปกติ', value: '400' },
  { label: 'กลาง', value: '500' },
  { label: 'หนา', value: '600' },
  { label: 'หนามาก', value: '700' }
]
</script>