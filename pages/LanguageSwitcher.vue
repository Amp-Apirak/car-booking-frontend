<script setup lang="ts">
import { useI18n } from "#imports"; 
const { locale, t } = useI18n({ useScope: "global" }); 

// ฟังก์ชันเปลี่ยนภาษาปัจจุบัน
function switchTo(lang: string) {
  locale.value = lang;
}
</script>

<template>
  <div class="p-4">
    <!-- ปุ่มสลับภาษา -->
    <div class="flex space-x-2 mb-4">
      <button @click="switchTo('th')" class="px-3 py-1 border rounded" :class="{ 'bg-blue-500 text-white': locale === 'th' }">
        ไทย 🇹🇭
      </button>
      <button @click="switchTo('en')" class="px-3 py-1 border rounded" :class="{ 'bg-blue-500 text-white': locale === 'en' }">
        English 🇬🇧
      </button>
    </div>

    <!-- ตัวอย่างการแสดงข้อความตามภาษา -->
    <h1 class="text-xl">{{ t("welcome") }}</h1>
    <p class="text-sm text-gray-600">{{ t("login") }}</p>
  </div>
</template>