<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 mb-6">
      <UIcon name="i-lucide-wrench" class="size-5" />
      <h2 class="text-xl font-semibold">{{ t('settings.maintenance.title') }}</h2>
    </div>

    <UFormGroup :label="t('settings.maintenance.maintenance_mode')">
      <UToggle 
        v-model="settings.maintenance.maintenanceMode"
      />
    </UFormGroup>

    <UFormGroup :label="t('settings.maintenance.system_status')">
      <UBadge 
        :label="systemStatus.label"
        :color="systemStatus.color"
        size="lg"
      />
    </UFormGroup>

    <div class="flex gap-3">
      <UButton 
        :label="t('settings.actions.optimize_now')" 
        color="primary"
        icon="i-lucide-zap"
        @click="$emit('optimizeDatabase')"
      />
      <UButton 
        :label="t('settings.actions.test')" 
        color="neutral"
        icon="i-lucide-activity"
        @click="$emit('testSystem')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Props
const props = defineProps<{
  settings: any
}>()

// Emits
defineEmits<{
  optimizeDatabase: []
  testSystem: []
}>()

const systemStatus = computed(() => {
  if (props.settings.maintenance.maintenanceMode) {
    return { label: 'อยู่ในโหมดบำรุงรักษา', color: 'orange' }
  }
  return { label: 'ปกติ', color: 'green' }
})
</script>