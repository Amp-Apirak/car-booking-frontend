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

    <!-- รายการรถยนต์ -->
    <div v-else-if="vehicles && vehicles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- แสดงข้อมูลรถยนต์แบบ inline แทน VehicleCard ชั่วคราว -->
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
      >
        <h3 class="text-lg font-semibold mb-2">{{ vehicle.name || 'รถยนต์' }}</h3>
        <p class="text-sm text-gray-600 mb-2">{{ vehicle.license_plate || 'ไม่ระบุป้าย' }}</p>
        <p class="text-sm text-gray-600 mb-4">{{ vehicle.brand_name || 'ไม่ระบุยี่ห้อ' }}</p>
        
        <div class="flex space-x-2">
          <UButton size="sm" @click="viewVehicle(vehicle)">ดูรายละเอียด</UButton>
          <UButton size="sm" color="blue" @click="editVehicle(vehicle)" v-if="canManageVehicles">แก้ไข</UButton>
          <UButton size="sm" color="red" variant="outline" @click="deleteVehicle(vehicle)" v-if="canManageVehicles">ลบ</UButton>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
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
    vehicles.value = response.data || response
    totalVehicles.value = response.pagination?.total || response.total || 0
    console.log('🚗 Vehicles loaded:', vehicles.value.length, 'vehicles')
    console.log('🚗 Total vehicles:', totalVehicles.value)
    
    // โหลดตัวเลือกประเภทและยี่ห้อ
    if (vehicleTypes.value.length === 0) {
      const typesResponse = await api.getVehicleTypes()
      const typesData = typesResponse.data || typesResponse
      vehicleTypes.value = [
        { label: 'ทั้งหมด', value: '' },
        ...typesData.map(type => ({ label: type.name, value: type.id }))
      ]
    }
    
    if (vehicleBrands.value.length === 0) {
      const brandsResponse = await api.getVehicleBrands()
      const brandsData = brandsResponse.data || brandsResponse
      vehicleBrands.value = [
        { label: 'ทั้งหมด', value: '' },
        ...brandsData.map(brand => ({ label: brand.name, value: brand.id }))
      ]
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
</style>