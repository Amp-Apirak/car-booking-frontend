<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 mb-6">
      <UIcon name="i-lucide-bell" class="size-5" />
      <h2 class="text-xl font-semibold">{{ t('settings.notification.title') }}</h2>
    </div>

    <UFormGroup :label="t('settings.notification.booking_alerts')">
      <div class="flex gap-4">
        <UToggle 
          v-model="settings.notification.bookingEmail"
          :label="t('settings.notification.email')"
        />
        <UToggle 
          v-model="settings.notification.bookingSMS"
          :label="t('settings.notification.sms')"
        />
        <UToggle 
          v-model="settings.notification.bookingPush"
          :label="t('settings.notification.push')"
        />
      </div>
    </UFormGroup>

    <UFormGroup :label="t('settings.notification.payment_alerts')">
      <div class="flex gap-4">
        <UToggle 
          v-model="settings.notification.paymentEmail"
          :label="t('settings.notification.email')"
        />
        <UToggle 
          v-model="settings.notification.paymentSMS"
          :label="t('settings.notification.sms')"
        />
        <UToggle 
          v-model="settings.notification.paymentPush"
          :label="t('settings.notification.push')"
        />
      </div>
    </UFormGroup>

    <UFormGroup :label="t('settings.notification.maintenance_alerts')">
      <div class="flex gap-4">
        <UToggle 
          v-model="settings.notification.maintenanceEmail"
          :label="t('settings.notification.email')"
        />
        <UToggle 
          v-model="settings.notification.maintenanceSMS"
          :label="t('settings.notification.sms')"
        />
        <UToggle 
          v-model="settings.notification.maintenancePush"
          :label="t('settings.notification.push')"
        />
      </div>
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Props
defineProps<{
  settings: any
}>()
</script>