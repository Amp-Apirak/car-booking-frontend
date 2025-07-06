<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 mb-6">
      <UIcon name="i-lucide-palette" class="size-5" />
      <h2 class="text-xl font-semibold">{{ t('settings.appearance.title') }}</h2>
    </div>

    <UFormGroup :label="t('settings.appearance.theme')">
      <USelect 
        v-model="settings.appearance.theme"
        :options="themeOptions"
      />
    </UFormGroup>

    <UFormGroup :label="t('settings.appearance.primary_color')">
      <div class="flex gap-2">
        <UButton 
          v-for="color in primaryColors"
          :key="color.value"
          :color="color.value"
          :variant="settings.appearance.primaryColor === color.value ? 'solid' : 'outline'"
          size="sm"
          class="w-8 h-8"
          @click="settings.appearance.primaryColor = color.value"
        />
      </div>
    </UFormGroup>

    <UFormGroup :label="t('settings.appearance.sidebar_position')">
      <USelect 
        v-model="settings.appearance.sidebarPosition"
        :options="sidebarPositionOptions"
      />
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Props
defineProps<{
  settings: any
}>()

const themeOptions = [
  { label: 'สว่าง', value: 'light' },
  { label: 'มืด', value: 'dark' },
  { label: 'อัตโนมัติ', value: 'auto' }
]

const primaryColors = [
  { label: 'น้ำเงิน', value: 'blue' },
  { label: 'เขียว', value: 'green' },
  { label: 'แดง', value: 'red' },
  { label: 'ม่วง', value: 'purple' },
  { label: 'ส้ม', value: 'orange' }
]

const sidebarPositionOptions = [
  { label: 'ซ้าย', value: 'left' },
  { label: 'ขวา', value: 'right' }
]
</script>