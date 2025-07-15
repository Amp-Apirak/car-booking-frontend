<template>
  <div class="p-6">
    <!-- Header พร้อมปุ่มเพิ่มรถยนต์ -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('vehicles.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-1">
          {{ $t('vehicles.subtitle') }}
        </p>
      </div>
      
      <!-- ปุ่มเพิ่มรถยนต์ -->
      <UButton
        v-if="canManageVehicles"
        icon="i-heroicons-plus"
        size="lg"
        @click="navigateTo('/vehicles/create')"
      >
        {{ $t('vehicles.addVehicle') }}
      </UButton>
    </div>

    <!-- ตัวกรองและค้นหา -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- ค้นหา -->
        <UInput
          v-model="searchQuery"
          :placeholder="$t('vehicles.searchPlaceholder')"
          icon="i-heroicons-magnifying-glass"
          size="lg"
          @input="searchVehicles"
        />
        
        <!-- กรองตามประเภท -->
        <USelectMenu
          v-model="selectedType"
          :options="vehicleTypes"
          :placeholder="$t('vehicles.filterByType')"
          size="lg"
          @change="filterVehicles"
        />
        
        <!-- กรองตามยี่ห้อ -->
        <USelectMenu
          v-model="selectedBrand"
          :options="vehicleBrands"
          :placeholder="$t('vehicles.filterByBrand')"
          size="lg"
          @change="filterVehicles"
        />
        
        <!-- กรองตามสถานะ -->
        <USelectMenu
          v-model="selectedStatus"
          :options="statusOptions"
          :placeholder="$t('vehicles.filterByStatus')"
          size="lg"
          @change="filterVehicles"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-300">{{ $t('common.loading') }}</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4" />
        <p class="text-lg font-semibold">{{ $t('common.error') }}</p>
        <p class="text-sm mt-1">{{ error }}</p>
        <UButton @click="refresh()" class="mt-4">
          {{ $t('common.tryAgain') }}
        </UButton>
      </div>
    </div>

    <!-- Debug info -->
    <div v-if="!pending && !error" class="mb-4 p-4 bg-blue-50 rounded-lg">
      <p class="text-sm text-blue-800">
        Debug: vehicles = {{ vehicles ? vehicles.length : 'null' }} items, 
        pending = {{ pending }}, 
        error = {{ error }}
      </p>
    </div>

    <!-- ตารางรายการรถยนต์ -->
    <div v-if="!pending && !error && vehicles && vehicles.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <!-- แสดงเป็นตารางแบบกำหนดเอง -->
      <div class="hidden lg:block">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Header -->
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">รูปภาพ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ชื่อรถ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ป้ายทะเบียน</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ยี่ห้อ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">รุ่น</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ประเภท</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ปี</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">สี</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">สถานะ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">การดำเนินการ</th>
              </tr>
            </thead>
            <!-- Body -->
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="vehicle in vehicles" 
                :key="vehicle.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <!-- รูปภาพ -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center">
                    <img 
                      :src="getVehicleImage(vehicle)" 
                      :alt="vehicle.name || 'รถยนต์'"
                      class="w-16 h-12 object-cover rounded-lg shadow-sm"
                      @error="handleImageError"
                    />
                  </div>
                </td>
                <!-- ชื่อรถ -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ vehicle.name || 'ไม่ระบุชื่อ' }}
                  </div>
                </td>
                <!-- ป้ายทะเบียน -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ vehicle.license_plate || 'ไม่ระบุป้าย' }}
                  </div>
                </td>
                <!-- ยี่ห้อ -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ getBrandName(vehicle) }}
                  </div>
                </td>
                <!-- รุ่น -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600 dark:text-gray-300">
                    {{ getModelName(vehicle) }}
                  </div>
                </td>
                <!-- ประเภท -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ getTypeName(vehicle) }}
                  </div>
                </td>
                <!-- ปี -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ vehicle.year || 'ไม่ระบุ' }}
                  </div>
                </td>
                <!-- สี -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ vehicle.color || 'ไม่ระบุ' }}
                  </div>
                </td>
                <!-- สถานะ -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium">
                    <UBadge 
                      :label="getStatusLabel(vehicle.status)" 
                      :color="getStatusColor(vehicle.status)" 
                      variant="subtle" 
                      size="sm" 
                    />
                  </div>
                </td>
                <!-- การดำเนินการ -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <UButton 
                      icon="i-heroicons-eye" 
                      size="sm" 
                      color="gray" 
                      variant="ghost"
                      @click="viewVehicle(vehicle)"
                      :ui="{ rounded: 'rounded-full' }"
                    />
                    <UButton 
                      v-if="canManageVehicles"
                      icon="i-heroicons-pencil" 
                      size="sm" 
                      color="blue" 
                      variant="ghost"
                      @click="editVehicle(vehicle)"
                      :ui="{ rounded: 'rounded-full' }"
                    />
                    <UButton 
                      v-if="canManageVehicles"
                      icon="i-heroicons-trash" 
                      size="sm" 
                      color="red" 
                      variant="ghost"
                      @click="deleteVehicle(vehicle)"
                      :ui="{ rounded: 'rounded-full' }"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- แสดงเป็น Cards บนหน้าจอเล็ก (Mobile & Tablet) -->
      <div class="lg:hidden">
        <div class="space-y-4 p-4">
          <div
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <!-- ส่วนหัว: รูปและข้อมูลหลัก -->
            <div class="flex items-start space-x-4 mb-4">
              <!-- รูปภาพ -->
              <div class="flex-shrink-0">
                <img 
                  :src="getVehicleImage(vehicle)" 
                  :alt="vehicle.name || 'รถยนต์'"
                  class="w-20 h-15 object-cover rounded-lg shadow-sm"
                  @error="handleImageError"
                />
              </div>
              
              <!-- ข้อมูลหลัก -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ vehicle.name || 'ไม่ระบุชื่อ' }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ vehicle.license_plate || 'ไม่ระบุป้าย' }}
                </p>
                <div class="flex items-center space-x-2 mt-2">
                  <UBadge 
                    :label="getStatusLabel(vehicle.status)" 
                    :color="getStatusColor(vehicle.status)" 
                    variant="subtle" 
                    size="sm" 
                  />
                  <UBadge 
                    :label="getTypeName(vehicle)" 
                    color="blue" 
                    variant="outline" 
                    size="sm" 
                  />
                </div>
              </div>
            </div>

            <!-- รายละเอียดเพิ่มเติม -->
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span class="text-gray-500 dark:text-gray-400">ยี่ห้อ:</span>
                <span class="ml-1 font-medium text-gray-900 dark:text-white">
                  {{ getBrandName(vehicle) }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">รุ่น:</span>
                <span class="ml-1 font-medium text-gray-900 dark:text-white">
                  {{ getModelName(vehicle) }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">ปี:</span>
                <span class="ml-1 font-medium text-gray-900 dark:text-white">
                  {{ vehicle.year || 'ไม่ระบุ' }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">สี:</span>
                <span class="ml-1 font-medium text-gray-900 dark:text-white">
                  {{ vehicle.color || 'ไม่ระบุ' }}
                </span>
              </div>
            </div>

            <!-- ปุ่มการดำเนินการ -->
            <div class="flex items-center justify-end space-x-2">
              <UButton 
                icon="i-heroicons-eye" 
                size="sm" 
                color="gray" 
                variant="ghost"
                @click="viewVehicle(vehicle)"
              >
                ดู
              </UButton>
              <UButton 
                v-if="canManageVehicles"
                icon="i-heroicons-pencil" 
                size="sm" 
                color="blue" 
                variant="ghost"
                @click="editVehicle(vehicle)"
              >
                แก้ไข
              </UButton>
              <UButton 
                v-if="canManageVehicles"
                icon="i-heroicons-trash" 
                size="sm" 
                color="red" 
                variant="ghost"
                @click="deleteVehicle(vehicle)"
              >
                ลบ
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!pending && !error" class="text-center py-12">
      <UIcon name="i-heroicons-truck" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ $t('vehicles.noVehicles') }}
      </h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        {{ $t('vehicles.noVehiclesDescription') }}
      </p>
      <UButton
        v-if="canManageVehicles"
        @click="navigateTo('/vehicles/create')"
        icon="i-heroicons-plus"
      >
        {{ $t('vehicles.addFirstVehicle') }}
      </UButton>
    </div>

    <!-- Pagination -->
    <div v-if="vehicles && vehicles.length > 0" class="mt-8 flex justify-center">
      <UPagination
        v-model="currentPage"
        :page-count="pageSize"
        :total="totalVehicles"
        :max="5"
        @update:model-value="loadVehicles"
      />
    </div>

    <!-- Modal สำหรับยืนยันการลบ -->
    <UModal v-model="isDeleteModalOpen" v-if="vehicleToDelete">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">{{ $t('vehicles.confirmDelete') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ $t('vehicles.confirmDeleteMessage', { name: vehicleToDelete?.name || '' }) }}
        </p>
        <div class="flex justify-end space-x-3">
          <UButton
            variant="ghost"
            @click="isDeleteModalOpen = false"
          >
            {{ $t('common.cancel') }}
          </UButton>
          <UButton
            color="red"
            @click="confirmDelete"
            :loading="isDeleting"
          >
            {{ $t('common.delete') }}
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// กำหนด middleware สำหรับ authentication
definePageMeta({
  middleware: 'auth'
})

// Import composables
const api = useApi()
const { user, hasPermission } = useAuth()
const { t } = useI18n()
const toast = useToast()

// ใช้ ref สำหรับ debounce timeout
const searchTimeout = ref(null)

// Reactive data
const vehicles = ref([])
const pending = ref(false)
const error = ref(null)
const searchQuery = ref('')
const selectedType = ref('')
const selectedBrand = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const totalVehicles = ref(0)
const vehicleTypes = ref([])
const vehicleBrands = ref([])
const isDeleteModalOpen = ref(false)
const vehicleToDelete = ref(null)
const isDeleting = ref(false)

// สถานะตัวเลือก
const statusOptions = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'พร้อมใช้งาน', value: 'active' },
  { label: 'ไม่พร้อมใช้งาน', value: 'inactive' },
  { label: 'อยู่ระหว่างซ่อม', value: 'maintenance' }
]

// ตรวจสอบสิทธิ์
const canManageVehicles = computed(() => {
  return hasPermission('manage_vehicles')
})

// กำหนดคอลัมน์ของตาราง - แบบง่าย
const tableColumns = [
  'image',
  'name', 
  'license_plate',
  'brand_name',
  'model_name',
  'type_name',
  'year',
  'color',
  'status',
  'actions'
]

// ฟังก์ชันโหลดข้อมูลรถยนต์
const loadVehicles = async () => {
  try {
    pending.value = true
    error.value = null
    
    // เรียก API เพื่อดึงข้อมูลรถยนต์
    const response = await api.getVehicles({
      page: currentPage.value,
      limit: pageSize.value,
      search: searchQuery.value,
      type: selectedType.value,
      brand: selectedBrand.value,
      status: selectedStatus.value
    })
    
    // Backend ส่งกลับเป็น { success: true, data: [...], pagination: {...} }
    console.log('🚗 Vehicles API Response:', response)
    console.log('🚗 Response type:', typeof response)
    console.log('🚗 Response.data:', response.data)
    console.log('🚗 Response is array:', Array.isArray(response))
    
    // ตรวจสอบโครงสร้างข้อมูลและกำหนดค่า
    if (Array.isArray(response)) {
      // ถ้าข้อมูลเป็น array โดยตรง
      vehicles.value = response
      totalVehicles.value = response.length
    } else if (response.data && Array.isArray(response.data)) {
      // ถ้าข้อมูลอยู่ใน response.data
      vehicles.value = response.data
      totalVehicles.value = response.pagination?.total || response.total || response.data.length
    } else if (response.success && response.data) {
      // ถ้าข้อมูลมี success flag
      vehicles.value = Array.isArray(response.data) ? response.data : []
      totalVehicles.value = response.pagination?.total || response.total || vehicles.value.length
    } else {
      // กรณีอื่นๆ
      vehicles.value = []
      totalVehicles.value = 0
    }
    
    console.log('🚗 Final vehicles array:', vehicles.value)
    console.log('🚗 Vehicles loaded:', vehicles.value.length, 'vehicles')
    console.log('🚗 Total vehicles:', totalVehicles.value)
    console.log('🚗 First vehicle:', vehicles.value[0])
    
    // Debug ข้อมูลยี่ห้อและรุ่น
    if (vehicles.value.length > 0) {
      const firstVehicle = vehicles.value[0]
      console.log('🔍 Debug first vehicle data:')
      console.log('- ALL VEHICLE DATA:', firstVehicle)
      console.log('- brand_name:', firstVehicle.brand_name)
      console.log('- brand_id:', firstVehicle.brand_id) 
      console.log('- brand object:', firstVehicle.brand)
      console.log('- model_name:', firstVehicle.model_name)
      console.log('- model_id:', firstVehicle.model_id)
      console.log('- model object:', firstVehicle.model)
      console.log('- type_name:', firstVehicle.type_name)
      console.log('- type_id:', firstVehicle.type_id)
      console.log('- type object:', firstVehicle.type)
      console.log('- Vehicle_Brand:', firstVehicle.Vehicle_Brand)
      console.log('- Vehicle_Model:', firstVehicle.Vehicle_Model)
      console.log('- Vehicle_Type:', firstVehicle.Vehicle_Type)
      console.log('----')
      console.log('🔍 Testing getBrandName with this vehicle:')
      console.log('getBrandName result:', getBrandName(firstVehicle))
      console.log('getModelName result:', getModelName(firstVehicle))
      console.log('getTypeName result:', getTypeName(firstVehicle))
      console.log('----')
      console.log('🔍 vehicleBrands array:', vehicleBrands.value)
      console.log('🔍 vehicleModels array:', vehicleModels.value)
      console.log('🔍 vehicleTypes array:', vehicleTypes.value)
    }
    
    // Force reactivity update
    await nextTick()
    console.log('🔄 After nextTick - vehicles.value:', vehicles.value.length)
    
    // โหลดตัวเลือกประเภท ยี่ห้อ และรุ่น
    if (vehicleTypes.value.length === 0) {
      const typesResponse = await api.getVehicleTypes()
      const typesData = typesResponse.data || typesResponse
      vehicleTypes.value = [
        { label: 'ทั้งหมด', value: '' },
        ...typesData.map(type => ({ label: type.name, value: type.id, id: type.id, name: type.name }))
      ]
      console.log('🚗 Vehicle types loaded:', vehicleTypes.value)
    }
    
    if (vehicleBrands.value.length === 0) {
      const brandsResponse = await api.getVehicleBrands()
      const brandsData = brandsResponse.data || brandsResponse
      vehicleBrands.value = [
        { label: 'ทั้งหมด', value: '' },
        ...brandsData.map(brand => ({ label: brand.name, value: brand.id, id: brand.id, name: brand.name }))
      ]
      console.log('🚗 Vehicle brands loaded:', vehicleBrands.value)
    }

    // โหลดรุ่นรถ
    if (vehicleModels.value.length === 0) {
      await loadVehicleModels()
      console.log('🚗 Vehicle models loaded:', vehicleModels.value)
    }
    
  } catch (err) {
    error.value = err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
    console.error('Error loading vehicles:', err)
  } finally {
    pending.value = false
  }
}

// ฟังก์ชันค้นหารถยนต์
const searchVehicles = () => {
  // ล้าง timeout เก่า
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // ตั้ง timeout ใหม่
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1
    loadVehicles()
  }, 300)
}

// ฟังก์ชันกรองรถยนต์
const filterVehicles = () => {
  currentPage.value = 1
  loadVehicles()
}

// ฟังก์ชันรีเฟรชข้อมูล
const refresh = () => {
  loadVehicles()
}

// ฟังก์ชันแก้ไขรถยนต์
const editVehicle = (vehicle) => {
  navigateTo(`/vehicles/${vehicle.id}`)
}

// ฟังก์ชันดูรายละเอียดรถยนต์
const viewVehicle = (vehicle) => {
  navigateTo(`/vehicles/${vehicle.id}/view`)
}

// ฟังก์ชันลบรถยนต์
const deleteVehicle = (vehicle) => {
  vehicleToDelete.value = vehicle
  isDeleteModalOpen.value = true
}

// ฟังก์ชันยืนยันการลบ
const confirmDelete = async () => {
  if (!vehicleToDelete.value) return
  
  try {
    isDeleting.value = true
    await api.deleteVehicle(vehicleToDelete.value.id)
    
    // แสดงข้อความสำเร็จ
    toast.add({
      title: t('vehicles.deleteSuccess'),
      description: t('vehicles.deleteSuccessMessage', { name: vehicleToDelete.value.name }),
      color: 'green'
    })
    
    // ปิด modal และรีเฟรชข้อมูล
    isDeleteModalOpen.value = false
    vehicleToDelete.value = null
    loadVehicles()
    
  } catch (err) {
    toast.add({
      title: t('common.error'),
      description: err.message || t('vehicles.deleteError'),
      color: 'red'
    })
  } finally {
    isDeleting.value = false
  }
}

// ฟังก์ชันสำหรับดึงรูปภาพรถ พร้อม fallback
const getVehicleImage = (vehicle) => {
  // ลำดับการ fallback:
  // 1. รูปจาก API ถ้ามี
  // 2. รูปรถแบบจำลองตามประเภท
  // 3. รูปรถทั่วไป
  if (vehicle.image && vehicle.image.trim() !== '') {
    return vehicle.image
  } else if (vehicle.type_name) {
    return getVehicleTypeImage(vehicle.type_name)
  } else {
    return getDefaultCarImage()
  }
}

// ฟังก์ชันสำหรับดึงรูปรถตามประเภท
const getVehicleTypeImage = (typeName) => {
  const typeImages = {
    'รถเก๋ง': getDefaultCarImage('3b82f6', 'รถเก๋ง'),
    'รถปิคอัพ': getDefaultCarImage('10b981', 'รถปิคอัพ'),
    'รถตู้': getDefaultCarImage('f59e0b', 'รถตู้'),
    'รถบรรทุก': getDefaultCarImage('ef4444', 'รถบรรทุก'),
    'รถจักรยานยนต์': getDefaultCarImage('8b5cf6', 'มอเตอร์ไซค์'),
    'รถบัส': getDefaultCarImage('06b6d4', 'รถบัส')
  }
  
  return typeImages[typeName] || getDefaultCarImage()
}

// ฟังก์ชันสร้างรูป placeholder แบบ data URI
const getDefaultCarImage = (bgColor = '6b7280', text = 'รถยนต์') => {
  // สร้าง SVG เป็น data URI
  const svg = `
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="150" fill="#${bgColor}"/>
      <text x="100" y="75" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">
        🚗 ${text}
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

// ฟังก์ชันจัดการ error ของรูปภาพ
const handleImageError = (event) => {
  // เมื่อรูปไม่สามารถโหลดได้ ให้ใช้รูป SVG fallback
  console.log('Image load error, using SVG fallback')
  event.target.src = getDefaultCarImage('e5e7eb', 'ไม่มีรูป')
}

// ฟังก์ชันแปลงสถานะเป็นข้อความภาษาไทย
const getStatusLabel = (status) => {
  const statusLabels = {
    'active': 'พร้อมใช้งาน',
    'inactive': 'ไม่พร้อมใช้งาน', 
    'maintenance': 'อยู่ระหว่างซ่อม',
    'reserved': 'จองแล้ว'
  }
  return statusLabels[status] || 'ไม่ระบุ'
}

// ฟังก์ชันกำหนดสีของสถานะ
const getStatusColor = (status) => {
  const statusColors = {
    'active': 'green',
    'inactive': 'gray',
    'maintenance': 'yellow',
    'reserved': 'blue'
  }
  return statusColors[status] || 'gray'
}

// ฟังก์ชันดึงชื่อยี่ห้อ
const getBrandName = (vehicle) => {
  // Debug ข้อมูลที่เข้ามา
  // console.log('🔍 getBrandName called with:', vehicle)
  
  // ลองดึงจากหลายรูปแบบที่ API อาจส่งมา
  if (vehicle.brand_name) {
    return vehicle.brand_name
  } else if (vehicle.brand?.name) {
    return vehicle.brand.name
  } else if (vehicle.Vehicle_Brand?.name) {
    return vehicle.Vehicle_Brand.name
  } else if (vehicle.brand_id && vehicleBrands.value.length > 0) {
    // หาชื่อยี่ห้อจาก vehicleBrands array ที่โหลดมาแล้ว
    const brand = vehicleBrands.value.find(b => 
      b.value === vehicle.brand_id || 
      b.value == vehicle.brand_id ||
      b.id === vehicle.brand_id ||
      b.id == vehicle.brand_id
    )
    console.log('🔍 Looking for brand with ID:', vehicle.brand_id)
    console.log('🔍 Found brand:', brand)
    return brand?.label || brand?.name || 'ไม่ระบุยี่ห้อ'
  } else {
    console.log('🔍 No brand data found for vehicle:', vehicle)
    return 'ไม่ระบุยี่ห้อ'
  }
}

// ฟังก์ชันดึงชื่อรุ่น - สร้าง array รุ่นรถจาก API
const vehicleModels = ref([])

// ฟังก์ชันโหลดรุ่นรถทั้งหมด
const loadVehicleModels = async () => {
  try {
    const response = await api.getVehicleModels?.() || await api.getModels?.()
    if (response) {
      const modelsData = response.data || response
      vehicleModels.value = Array.isArray(modelsData) ? modelsData : []
    }
  } catch (error) {
    console.log('ไม่สามารถโหลดรุ่นรถได้:', error)
    vehicleModels.value = []
  }
}

const getModelName = (vehicle) => {
  // ลองดึงจากหลายรูปแบบที่ API อาจส่งมา
  if (vehicle.model_name) {
    return vehicle.model_name
  } else if (vehicle.model?.name) {
    return vehicle.model.name
  } else if (vehicle.Vehicle_Model?.name) {
    return vehicle.Vehicle_Model.name
  } else if (vehicle.model_id && vehicleModels.value.length > 0) {
    // หาชื่อรุ่นจาก vehicleModels array
    const model = vehicleModels.value.find(m => 
      m.value === vehicle.model_id || 
      m.value == vehicle.model_id ||
      m.id === vehicle.model_id ||
      m.id == vehicle.model_id
    )
    console.log('🔍 Looking for model with ID:', vehicle.model_id)
    console.log('🔍 Found model:', model)
    return model?.label || model?.name || 'ไม่ระบุรุ่น'
  } else {
    console.log('🔍 No model data found for vehicle:', vehicle)
    return 'ไม่ระบุรุ่น'
  }
}

// ฟังก์ชันดึงชื่อประเภท
const getTypeName = (vehicle) => {
  // ลองดึงจากหลายรูปแบบที่ API อาจส่งมา
  if (vehicle.type_name) {
    return vehicle.type_name
  } else if (vehicle.type?.name) {
    return vehicle.type.name
  } else if (vehicle.Vehicle_Type?.name) {
    return vehicle.Vehicle_Type.name
  } else if (vehicle.type_id && vehicleTypes.value.length > 0) {
    // หาชื่อประเภทจาก vehicleTypes array ที่โหลดมาแล้ว
    const type = vehicleTypes.value.find(t => 
      t.value === vehicle.type_id || 
      t.value == vehicle.type_id ||
      t.id === vehicle.type_id ||
      t.id == vehicle.type_id
    )
    console.log('🔍 Looking for type with ID:', vehicle.type_id)
    console.log('🔍 Found type:', type)
    return type?.label || type?.name || 'ไม่ระบุประเภท'
  } else {
    console.log('🔍 No type data found for vehicle:', vehicle)
    return 'ไม่ระบุประเภท'
  }
}

// โหลดข้อมูลเมื่อเริ่มต้น
onMounted(() => {
  loadVehicles()
})

// ตั้งค่า head
useHead({
  title: t('vehicles.title')
})
</script>

<style scoped>
/* สไตล์เพิ่มเติมสำหรับหน้า vehicles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ปรับปรุงการแสดงผลของรูปภาพในตาราง */
.vehicle-image {
  transition: transform 0.2s ease-in-out;
}

.vehicle-image:hover {
  transform: scale(1.05);
}

/* สไตล์สำหรับ responsive table */
@media (max-width: 1024px) {
  .table-wrapper {
    overflow-x: auto;
  }
}

/* ปรับปรุงการแสดงผลของ badge */
.status-badge {
  white-space: nowrap;
}

/* เพิ่มเอฟเฟกต์ hover สำหรับแถว */
.table-row:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* สำหรับ mobile cards */
.mobile-card {
  transition: all 0.2s ease-in-out;
}

.mobile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>