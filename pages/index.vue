<template>
  <div class="space-y-6">
    <!-- การ์ดต้อนรับ -->
    <UPageCard>
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-home" class="size-8 text-primary" />
          <div>
            <h1 class="text-2xl font-bold">{{ $t('welcome') }}</h1>
            <p class="text-muted">{{ $t('system.tagline') }}</p>
          </div>
        </div>
      </template>
      
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Quick Actions -->
          <UButton
            :label="$t('menu.bookings')"
            icon="i-lucide-calendar-plus"
            to="/bookings/new"
            size="lg"
            block
          />
          
          <UButton
            :label="$t('menu.cars')"
            icon="i-lucide-car"
            to="/cars"
            color="secondary"
            size="lg"
            block
          />
          
          <UButton
            :label="$t('menu.customers')"
            icon="i-lucide-users"
            to="/customers"
            color="success"
            size="lg"
            block
          />
        </div>
      </template>
    </UPageCard>

    <!-- สถิติ -->
    <UPageCard>
      <template #header>
        <h2 class="text-xl font-semibold">สถิติวันนี้</h2>
      </template>
      
      <template #body>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-elevated rounded-lg">
            <UIcon name="i-lucide-calendar" class="size-8 text-primary mx-auto mb-2" />
            <p class="text-2xl font-bold">12</p>
            <p class="text-sm text-muted">การจองวันนี้</p>
          </div>
          
          <div class="text-center p-4 bg-elevated rounded-lg">
            <UIcon name="i-lucide-car" class="size-8 text-success mx-auto mb-2" />
            <p class="text-2xl font-bold">8</p>
            <p class="text-sm text-muted">รถว่าง</p>
          </div>
          
          <div class="text-center p-4 bg-elevated rounded-lg">
            <UIcon name="i-lucide-users" class="size-8 text-info mx-auto mb-2" />
            <p class="text-2xl font-bold">156</p>
            <p class="text-sm text-muted">ลูกค้า</p>
          </div>
          
          <div class="text-center p-4 bg-elevated rounded-lg">
            <UIcon name="i-lucide-banknote" class="size-8 text-warning mx-auto mb-2" />
            <p class="text-2xl font-bold">฿25,800</p>
            <p class="text-sm text-muted">รายได้วันนี้</p>
          </div>
        </div>
      </template>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
// กำหนด meta สำหรับหน้านี้
definePageMeta({
  title: 'หน้าหลัก'
})
</script>