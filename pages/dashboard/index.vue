<template>
  <!-- DashboardPanel เป็นพื้นที่แสดงเนื้อหาหลัก -->
  <UDashboardPanel>

    <!-- เนื้อหาหลักของหน้า -->
    <template #body>
      <div class="space-y-6">
        <!-- การ์ดต้อนรับ -->
        <UPageCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-car" class="size-8 text-primary" />
              <div>
                <h2 class="text-xl font-semibold">
                  🚗 ยินดีต้อนรับสู่ระบบจองรถ
                </h2>
                <p class="text-muted text-sm">
                  จัดการการจองและรถยนต์ของคุณได้ที่นี่
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- สถิติการจองวันนี้ -->
              <UCard class="hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-muted">การจองวันนี้</p>
                    <p class="text-2xl font-bold text-primary">12</p>
                    <p class="text-xs text-success">+20% จากเมื่อวาน</p>
                  </div>
                  <UIcon
                    name="i-lucide-calendar-check"
                    class="size-8 text-success"
                  />
                </div>
              </UCard>

              <!-- รถที่พร้อมใช้งาน -->
              <UCard class="hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-muted">รถพร้อมใช้</p>
                    <p class="text-2xl font-bold text-success">8</p>
                    <p class="text-xs text-info">จาก 12 คันทั้งหมด</p>
                  </div>
                  <UIcon name="i-lucide-car" class="size-8 text-info" />
                </div>
              </UCard>

              <!-- รถที่ใช้งานอยู่ -->
              <UCard class="hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-muted">รถใช้งานอยู่</p>
                    <p class="text-2xl font-bold text-warning">4</p>
                    <p class="text-xs text-warning">กำลังให้บริการ</p>
                  </div>
                  <UIcon name="i-lucide-clock" class="size-8 text-warning" />
                </div>
              </UCard>

              <!-- รายได้วันนี้ -->
              <UCard class="hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-muted">รายได้วันนี้</p>
                    <p class="text-2xl font-bold text-success">฿25,800</p>
                    <p class="text-xs text-success">เป้าหมาย ฿30,000</p>
                  </div>
                  <UIcon name="i-lucide-banknote" class="size-8 text-success" />
                </div>
              </UCard>
            </div>
          </template>
        </UPageCard>

        <!-- ตารางการจองล่าสุด -->
        <UPageCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">การจองล่าสุด</h3>
              <UButton 
                label="ดูทั้งหมด" 
                variant="outline" 
                size="sm"
                to="/dashboard/bookings"
              />
            </div>
          </template>

          <template #body>
            <div class="space-y-3">
              <!-- ตัวอย่างรายการการจอง -->
              <UCard 
                v-for="booking in recentBookings"
                :key="booking.id"
                class="hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <UAvatar
                      :src="booking.customerAvatar"
                      :alt="booking.customerName"
                      size="sm"
                    />
                    <div>
                      <p class="font-medium">{{ booking.customerName }}</p>
                      <p class="text-sm text-muted">{{ booking.carModel }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="text-right">
                      <p class="text-sm font-medium">{{ booking.date }}</p>
                      <p class="text-xs text-muted">{{ booking.time }}</p>
                    </div>
                    <UBadge
                      :label="getStatusLabel(booking.status)"
                      :color="getStatusColor(booking.status)"
                      variant="subtle"
                    />
                  </div>
                </div>
              </UCard>

              <!-- แสดงข้อความเมื่อไม่มีข้อมูล -->
              <div 
                v-if="recentBookings.length === 0"
                class="text-center py-8 text-muted"
              >
                <UIcon name="i-lucide-calendar-x" class="size-12 mx-auto mb-2" />
                <p>ยังไม่มีการจองในระบบ</p>
              </div>
            </div>
          </template>
        </UPageCard>

        <!-- Quick Actions -->
        <UPageCard>
          <template #header>
            <h3 class="text-lg font-semibold">เมนูด่วน</h3>
          </template>

          <template #body>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <UButton
                label="จองรถใหม่"
                icon="i-lucide-plus"
                color="primary"
                variant="outline"
                class="h-20 flex-col"
                to="/dashboard/bookings/new"
              />
              <UButton
                label="เพิ่มรถใหม่"
                icon="i-lucide-car"
                color="success"
                variant="outline"
                class="h-20 flex-col"
                to="/dashboard/cars/new"
              />
              <UButton
                label="ดูรายงาน"
                icon="i-lucide-chart-bar"
                color="info"
                variant="outline"
                class="h-20 flex-col"
                to="/dashboard/reports"
              />
              <UButton
                label="จัดการลูกค้า"
                icon="i-lucide-users"
                color="warning"
                variant="outline"
                class="h-20 flex-col"
                to="/dashboard/customers"
              />
            </div>
          </template>
        </UPageCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
// ใช้ default layout (ไม่ต้องกำหนด layout แยก)
// definePageMeta จะใช้ default layout โดยอัตโนมัติ
definePageMeta({
  middleware: 'auth'
})

// ข้อมูลตัวอย่างการจองล่าสุด
const recentBookings = ref([
  {
    id: 1,
    customerName: "สมชาย ใจดี",
    customerAvatar: "https://github.com/nuxt.png",
    carModel: "Toyota Camry",
    date: "25 ธ.ค. 2024",
    time: "09:00",
    status: "confirmed",
  },
  {
    id: 2,
    customerName: "สมหญิง รักษ์ดี",
    customerAvatar: "https://github.com/vuejs.png",
    carModel: "Honda Civic",
    date: "24 ธ.ค. 2024",
    time: "14:30",
    status: "pending",
  },
  {
    id: 3,
    customerName: "วิทยา เก่งดี",
    customerAvatar: "https://github.com/antfu.png",
    carModel: "Mazda 3",
    date: "23 ธ.ค. 2024",
    time: "10:15",
    status: "completed",
  },
]);

// ฟังก์ชันกำหนดสีของ status badge
function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "success";
    case "pending":
      return "warning";
    case "completed":
      return "info";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
}

// ฟังก์ชันแปลง status เป็นภาษาไทย
function getStatusLabel(status: string) {
  switch (status) {
    case "confirmed":
      return "ยืนยันแล้ว";
    case "pending":
      return "รอยืนยัน";
    case "completed":
      return "เสร็จสิ้น";
    case "cancelled":
      return "ยกเลิก";
    default:
      return "ไม่ทราบสถานะ";
  }
}
</script>