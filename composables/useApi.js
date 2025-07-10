/**
 * API Client สำหรับระบบจองรถ
 * รวมรวม API endpoints ทั้งหมดที่ต้องใช้
 */
export const useApi = () => {
  // ดึง runtime config จาก Nuxt
  const config = useRuntimeConfig()
  
  // ดึง token จาก useAuth
  const { token } = useAuth()
  
  // ตั้งค่า base options สำหรับ API calls
  const baseOptions = {
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json',
      // เพิ่ม Authorization header ถ้ามี token
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
    }
  }

  // ==================== AUTHENTICATION APIs ====================
  
  /**
   * เข้าสู่ระบบ
   * @param {Object} credentials - ข้อมูลการเข้าสู่ระบบ
   * @param {string} credentials.username - ชื่อผู้ใช้
   * @param {string} credentials.password - รหัสผ่าน
   * @returns {Promise} ผลลัพธ์การเข้าสู่ระบบ
   */
  const login = (credentials) => {
    return $fetch('/auth/login', {
      method: 'POST',
      body: credentials,
      baseURL: config.public.apiBase
    })
  }

  /**
   * ออกจากระบบ
   * @returns {Promise} ผลลัพธ์การออกจากระบบ
   */
  const logout = () => {
    return $fetch('/auth/logout', {
      method: 'POST',
      ...baseOptions
    })
  }

  /**
   * รีเฟรช token
   * @returns {Promise} token ใหม่
   */
  const refreshToken = () => {
    return $fetch('/auth/token/refresh', {
      method: 'POST',
      ...baseOptions
    })
  }

  // ==================== USER APIs ====================
  
  /**
   * ดึงข้อมูลโปรไฟล์ผู้ใช้
   * @returns {Promise} ข้อมูลผู้ใช้
   */
  const getUserProfile = () => {
    return $fetch('/users/profile', {
      ...baseOptions
    })
  }

  /**
   * อัปเดตโปรไฟล์ผู้ใช้
   * @param {Object} profileData - ข้อมูลโปรไฟล์ที่จะอัปเดต
   * @returns {Promise} ผลลัพธ์การอัปเดต
   */
  const updateUserProfile = (profileData) => {
    return $fetch('/users/profile', {
      method: 'PUT',
      body: profileData,
      ...baseOptions
    })
  }

  /**
   * ค้นหาผู้ใช้ (สำหรับ admin)
   * @param {string} query - คำค้นหา
   * @returns {Promise} รายการผู้ใช้
   */
  const searchUsers = (query) => {
    return $fetch('/users/search', {
      query: { q: query },
      ...baseOptions
    })
  }

  // ==================== VEHICLE APIs ====================
  
  /**
   * ดึงรายการรถทั้งหมด
   * @param {Object} filters - ตัวกรอง (optional)
   * @returns {Promise} รายการรถยนต์
   */
  const getVehicles = (filters = {}) => {
    return $fetch('/vehicles', {
      query: filters,
      ...baseOptions
    })
  }

  /**
   * ดึงรายละเอียดรถตาม ID
   * @param {string} vehicleId - ID ของรถ
   * @returns {Promise} รายละเอียดรถ
   */
  const getVehicleById = (vehicleId) => {
    return $fetch(`/vehicles/${vehicleId}`, {
      ...baseOptions
    })
  }

  /**
   * สร้างรถใหม่
   * @param {Object} vehicleData - ข้อมูลรถ
   * @returns {Promise} รถที่สร้างขึ้น
   */
  const createVehicle = (vehicleData) => {
    return $fetch('/vehicles', {
      method: 'POST',
      body: vehicleData,
      ...baseOptions
    })
  }

  /**
   * อัปเดตข้อมูลรถ
   * @param {string} vehicleId - ID ของรถ
   * @param {Object} vehicleData - ข้อมูลรถที่จะอัปเดต
   * @returns {Promise} รถที่อัปเดตแล้ว
   */
  const updateVehicle = (vehicleId, vehicleData) => {
    return $fetch(`/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: vehicleData,
      ...baseOptions
    })
  }

  /**
   * ลบรถ
   * @param {string} vehicleId - ID ของรถ
   * @returns {Promise} ผลลัพธ์การลบ
   */
  const deleteVehicle = (vehicleId) => {
    return $fetch(`/vehicles/${vehicleId}`, {
      method: 'DELETE',
      ...baseOptions
    })
  }

  /**
   * ดึงรายการรถที่ว่างในช่วงวันที่
   * @param {string} startDate - วันที่เริ่มต้น
   * @param {string} endDate - วันที่สิ้นสุด
   * @returns {Promise} รายการรถที่ว่าง
   */
  const getAvailableVehicles = (startDate, endDate) => {
    return $fetch('/vehicles/available', {
      query: { 
        start_date: startDate, 
        end_date: endDate 
      },
      ...baseOptions
    })
  }

  // ==================== VEHICLE TYPES APIs ====================
  
  /**
   * ดึงรายการประเภทรถทั้งหมด
   * @returns {Promise} รายการประเภทรถ
   */
  const getVehicleTypes = () => {
    return $fetch('/vehicles/types', {
      ...baseOptions
    })
  }

  /**
   * สร้างประเภทรถใหม่
   * @param {Object} typeData - ข้อมูลประเภทรถ
   * @returns {Promise} ประเภทรถที่สร้างขึ้น
   */
  const createVehicleType = (typeData) => {
    return $fetch('/vehicles/types', {
      method: 'POST',
      body: typeData,
      ...baseOptions
    })
  }

  // ==================== VEHICLE BRANDS APIs ====================
  
  /**
   * ดึงรายการยี่ห้อรถทั้งหมด
   * @returns {Promise} รายการยี่ห้อรถ
   */
  const getVehicleBrands = () => {
    return $fetch('/vehicles/brands', {
      ...baseOptions
    })
  }

  /**
   * สร้างยี่ห้อรถใหม่
   * @param {Object} brandData - ข้อมูลยี่ห้อรถ
   * @returns {Promise} ยี่ห้อรถที่สร้างขึ้น
   */
  const createVehicleBrand = (brandData) => {
    return $fetch('/vehicles/brands', {
      method: 'POST',
      body: brandData,
      ...baseOptions
    })
  }

  // ==================== BOOKING APIs ====================
  
  /**
   * ดึงรายการการจองทั้งหมด
   * @param {Object} filters - ตัวกรอง (optional)
   * @returns {Promise} รายการการจอง
   */
  const getBookings = (filters = {}) => {
    return $fetch('/bookings', {
      query: filters,
      ...baseOptions
    })
  }

  /**
   * ดึงรายละเอียดการจองตาม ID
   * @param {string} bookingId - ID ของการจอง
   * @returns {Promise} รายละเอียดการจอง
   */
  const getBookingById = (bookingId) => {
    return $fetch(`/bookings/${bookingId}`, {
      ...baseOptions
    })
  }

  /**
   * สร้างการจองใหม่
   * @param {Object} bookingData - ข้อมูลการจอง
   * @returns {Promise} การจองที่สร้างขึ้น
   */
  const createBooking = (bookingData) => {
    return $fetch('/bookings', {
      method: 'POST',
      body: bookingData,
      ...baseOptions
    })
  }

  /**
   * อัปเดตการจอง
   * @param {string} bookingId - ID ของการจอง
   * @param {Object} bookingData - ข้อมูลการจองที่จะอัปเดต
   * @returns {Promise} การจองที่อัปเดตแล้ว
   */
  const updateBooking = (bookingId, bookingData) => {
    return $fetch(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: bookingData,
      ...baseOptions
    })
  }

  /**
   * อนุมัติการจอง
   * @param {string} bookingId - ID ของการจอง
   * @param {Object} approvalData - ข้อมูลการอนุมัติ
   * @returns {Promise} ผลลัพธ์การอนุมัติ
   */
  const approveBooking = (bookingId, approvalData) => {
    return $fetch(`/bookings/${bookingId}/approve`, {
      method: 'POST',
      body: approvalData,
      ...baseOptions
    })
  }

  /**
   * ปฏิเสธการจอง
   * @param {string} bookingId - ID ของการจอง
   * @param {Object} rejectionData - ข้อมูลการปฏิเสธ
   * @returns {Promise} ผลลัพธ์การปฏิเสธ
   */
  const rejectBooking = (bookingId, rejectionData) => {
    return $fetch(`/bookings/${bookingId}/reject`, {
      method: 'POST',
      body: rejectionData,
      ...baseOptions
    })
  }

  // ==================== EQUIPMENT APIs ====================
  
  /**
   * ดึงรายการอุปกรณ์ทั้งหมด
   * @returns {Promise} รายการอุปกรณ์
   */
  const getEquipments = () => {
    return $fetch('/equipments/all', {
      ...baseOptions
    })
  }

  /**
   * ดึงอุปกรณ์ของการจอง
   * @param {string} bookingId - ID ของการจอง
   * @returns {Promise} รายการอุปกรณ์ของการจอง
   */
  const getBookingEquipments = (bookingId) => {
    return $fetch(`/bookings/${bookingId}/equipments`, {
      ...baseOptions
    })
  }

  /**
   * เพิ่มอุปกรณ์ให้กับการจอง
   * @param {string} bookingId - ID ของการจอง
   * @param {Object} equipmentData - ข้อมูลอุปกรณ์
   * @returns {Promise} ผลลัพธ์การเพิ่มอุปกรณ์
   */
  const addBookingEquipment = (bookingId, equipmentData) => {
    return $fetch(`/bookings/${bookingId}/equipments`, {
      method: 'POST',
      body: equipmentData,
      ...baseOptions
    })
  }

  // ==================== DRIVER APIs ====================
  
  /**
   * ดึงรายการคนขับทั้งหมด
   * @returns {Promise} รายการคนขับ
   */
  const getDrivers = () => {
    return $fetch('/drivers', {
      ...baseOptions
    })
  }

  // ==================== ORGANIZATION APIs ====================
  
  /**
   * ดึงรายการองค์กรทั้งหมด
   * @returns {Promise} รายการองค์กร
   */
  const getOrganizations = () => {
    return $fetch('/organizations', {
      ...baseOptions
    })
  }

  /**
   * ดึงองค์กรที่ผู้ใช้เข้าถึงได้
   * @returns {Promise} รายการองค์กรที่เข้าถึงได้
   */
  const getAccessibleOrganizations = () => {
    return $fetch('/organizations/accessible', {
      ...baseOptions
    })
  }

  // ==================== SYSTEM SETTINGS APIs ====================
  
  /**
   * ดึงการตั้งค่าระบบ
   * @returns {Promise} การตั้งค่าระบบ
   */
  const getSystemSettings = () => {
    return $fetch('/system', {
      ...baseOptions
    })
  }

  /**
   * อัปเดตการตั้งค่าระบบ
   * @param {Object} settingsData - ข้อมูลการตั้งค่า
   * @returns {Promise} ผลลัพธ์การอัปเดต
   */
  const updateSystemSettings = (settingsData) => {
    return $fetch('/system', {
      method: 'PUT',
      body: settingsData,
      ...baseOptions
    })
  }

  // ส่งคืน functions ทั้งหมด
  return {
    // Authentication
    login,
    logout,
    refreshToken,
    
    // User Management
    getUserProfile,
    updateUserProfile,
    searchUsers,
    
    // Vehicle Management
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getAvailableVehicles,
    
    // Vehicle Types & Brands
    getVehicleTypes,
    createVehicleType,
    getVehicleBrands,
    createVehicleBrand,
    
    // Booking Management
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    approveBooking,
    rejectBooking,
    
    // Equipment Management
    getEquipments,
    getBookingEquipments,
    addBookingEquipment,
    
    // Driver Management
    getDrivers,
    
    // Organization Management
    getOrganizations,
    getAccessibleOrganizations,
    
    // System Settings
    getSystemSettings,
    updateSystemSettings
  }
}