<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 mb-6">
      <UIcon name="i-lucide-hard-drive" class="size-5" />
      <h2 class="text-xl font-semibold">{{ t('settings.backup.title') }}</h2>
    </div>

    <UFormGroup :label="t('settings.backup.auto_backup')">
      <UToggle 
        v-model="settings.backup.autoBackup"
      />
    </UFormGroup>

    <UFormGroup :label="t('settings.backup.backup_frequency')">
      <USelect 
        v-model="settings.backup.frequency"
        :options="backupFrequencyOptions"
        :disabled="!settings.backup.autoBackup"
      />
    </UFormGroup>

    <UFormGroup :label="t('settings.backup.last_backup')">
      <UInput 
        :value="settings.backup.lastBackup"
        disabled
      />
    </UFormGroup>

    <div class="flex gap-3">
      <UButton 
        :label="t('settings.actions.backup_now')" 
        color="primary"
        icon="i-lucide-download"
        @click="$emit('backupNow')"
      />
      <UButton 
        :label="t('settings.actions.export')" 
        color="neutral"
        icon="i-lucide-file-export"
        @click="$emit('exportSettings')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Props
defineProps<{
  settings: any
}>()

// Emits
defineEmits<{
  backupNow: []
  exportSettings: []
}>()

const backupFrequencyOptions = [
  { label: 'รายวัน', value: 'daily' },
  { label: 'รายสัปดาห์', value: 'weekly' },
  { label: 'รายเดือน', value: 'monthly' }
]
</script>