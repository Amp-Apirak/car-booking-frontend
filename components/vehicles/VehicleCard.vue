<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
    <!-- รูปรถยนต์ -->
    <div class="relative h-48 bg-gray-100 dark:bg-gray-700">
      <img
        v-if="vehicle.image_url"
        :src="vehicle.image_url"
        :alt="vehicle.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <UIcon name="i-heroicons-truck" class="w-16 h-16" />
      </div>
      
      <!-- Badge สถานะ -->
      <div class="absolute top-2 right-2">
        <UBadge
          :color="getStatusColor(vehicle.status)"
          :variant="vehicle.status === 'active' ? 'solid' : 'outline'"
          size="sm"
        >
          {{ getStatusText(vehicle.status) }}
        </UBadge>
      </div>
      
      <!-- Badge ประเภท -->
      <div class="absolute top-2 left-2">
        <UBadge
          color="blue"
          variant="solid"
          size="sm"
        >
          {{ vehicle.type_name || 'ไม่ระบุ' }}
        </UBadge>
      </div>
    </div>

    <!-- ข้อมูลรถยนต์ -->
    <div class="p-4">
      <!-- ชื่อรถยนต์ -->
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
        {{ vehicle.name }}
      </h3>
      
      <!-- ป้ายทะเบียน -->
      <div class="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
        <UIcon name="i-heroicons-identification" class="w-4 h-4 mr-1" />
        <span class="font-medium">{{ vehicle.license_plate }}</span>
      </div>
      
      <!-- ยี่ห้อและรุ่น -->
      <div class="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
        <UIcon name="i-heroicons-tag" class="w-4 h-4 mr-1" />
        <span>{{ vehicle.brand_name }} {{ vehicle.model || '' }}</span>
      </div>
      
      <!-- ปีรถ -->
      <div v-if="vehicle.year" class="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
        <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
        <span>{{ vehicle.year }}</span>
      </div>
      
      <!-- ที่นั่ง -->
      <div v-if="vehicle.seats" class="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
        <UIcon name="i-heroicons-users" class="w-4 h-4 mr-1" />
        <span>{{ vehicle.seats }} ที่นั่ง</span>
      </div>
      
      <!-- สีรถ -->
      <div v-if="vehicle.color" class="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
        <UIcon name="i-heroicons-swatch" class="w-4 h-4 mr-1" />
        <span>{{ vehicle.color }}</span>
      </div>
      
      <!-- ข้อมูลเพิ่มเติม -->
      <div class="border-t dark:border-gray-700 pt-3 mb-3">
        <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
          <!-- เลขไมล์ -->
          <div v-if="vehicle.mileage" class="flex items-center">
            <UIcon name="i-heroicons-gauge" class="w-3 h-3 mr-1" />
            <span>{{ formatMileage(vehicle.mileage) }} กม.</span>
          </div>
          
          <!-- วันที่สร้าง -->
          <div class="flex items-center">
            <UIcon name="i-heroicons-calendar-days" class="w-3 h-3 mr-1" />
            <span>{{ formatDate(vehicle.created_at) }}</span>
          </div>
        </div>
      </div>
      
      <!-- ปุ่มดำเนินการ -->
      <div class="flex space-x-2">
        <!-- ปุ่มดูรายละเอียด -->
        <UButton
          size="sm"
          variant="outline"
          @click="$emit('view', vehicle)"
          class="flex-1"
        >
          <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-1" />
          {{ $t('common.view') }}
        </UButton>
        
        <!-- ปุ่มแก้ไข (แสดงเมื่อมีสิทธิ์) -->
        <UButton
          v-if="canManageVehicles"
          size="sm"
          color="blue"
          @click="$emit('edit', vehicle)"
          class="flex-1"
        >
          <UIcon name="i-heroicons-pencil" class="w-4 h-4 mr-1" />
          {{ $t('common.edit') }}
        </UButton>
        
        <!-- ปุ่มลบ (แสดงเมื่อมีสิทธิ์) -->
        <UButton
          v-if="canManageVehicles"
          size="sm"
          color="red"
          variant="outline"
          @click="$emit('delete', vehicle)"
        >
          <UIcon name="i-heroicons-trash" class="w-4 h-4" />
        </UButton>
      </div>
    </div>
    
    <!-- Loading overlay สำหรับการจอง -->
    <div v-if="isBooking" class="absolute inset-0 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p class="text-sm text-gray-600 dark:text-gray-300">กำลังดำเนินการ...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// กำหนด props
const props = defineProps({
  vehicle: {
    type: Object,
    required: true,
    default: () => ({})
  },
  isBooking: {
    type: Boolean,
    default: false
  }
})

// กำหนด emits
const emit = defineEmits(['view', 'edit', 'delete', 'book'])

// Import composables
const { hasPermission } = useAuth()
const { t } = useI18n()

// ตรวจสอบสิทธิ์
const canManageVehicles = computed(() => {
  return hasPermission('manage_vehicles')
})

// ฟังก์ชันจัดการรูปภาพ error
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// ฟังก์ชันรับสีสถานะ
const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'green'
    case 'inactive':
      return 'gray'
    case 'maintenance':
      return 'yellow'
    default:
      return 'gray'
  }
}

// ฟังก์ชันรับข้อความสถานะ
const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'พร้อมใช้งาน'
    case 'inactive':
      return 'ไม่พร้อมใช้งาน'
    case 'maintenance':
      return 'ซ่อมบำรุง'
    default:
      return 'ไม่ทราบสถานะ'
  }
}

// ฟังก์ชันจัดรูปแบบเลขไมล์
const formatMileage = (mileage) => {
  if (!mileage) return '0'
  return new Intl.NumberFormat('th-TH').format(mileage)
}

// ฟังก์ชันจัดรูปแบบวันที่
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* สไตล์สำหรับ line-clamp */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

/* Hover effect */
.hover\:shadow-lg:hover {
  --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

/* Transition */
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}
</style>