<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 mb-6">
      <UIcon name="i-lucide-shield" class="size-5" />
      <h2 class="text-xl font-semibold">{{ t('settings.security.title') }}</h2>
    </div>

    <UFormGroup :label="t('settings.security.two_factor')">
      <UToggle 
        v-model="settings.security.twoFactor"
      />
    </UFormGroup>

    <UFormGroup :label="t('settings.security.session_timeout')">
      <USelect 
        v-model="settings.security.sessionTimeout"
        :options="sessionTimeoutOptions"
      />
    </UFormGroup>

    <UFormGroup :label="t('settings.security.login_attempts')">
      <USelect 
        v-model="settings.security.loginAttempts"
        :options="loginAttemptsOptions"
      />
    </UFormGroup>

    <UFormGroup :label="t('settings.security.audit_log')">
      <UToggle 
        v-model="settings.security.auditLog"
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

const sessionTimeoutOptions = [
  { label: '15 นาที', value: 15 },
  { label: '30 นาที', value: 30 },
  { label: '1 ชั่วโมง', value: 60 },
  { label: '2 ชั่วโมง', value: 120 }
]

const loginAttemptsOptions = [
  { label: '3 ครั้ง', value: 3 },
  { label: '5 ครั้ง', value: 5 },
  { label: '10 ครั้ง', value: 10 }
]
</script>