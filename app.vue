<script setup lang="ts">
import * as locales from "@nuxt/ui-pro/locale";
import { useI18n, useHead } from "#imports";

const { locale } = useI18n({ useScope: 'global' });
const lang = computed(() => locales[locale.value]?.code || 'th');
const dir = computed(() => locales[locale.value]?.dir || 'ltr');

useHead({
  htmlAttrs: {
    lang, 
    dir,
  },
});
</script>

<template>
  <UApp :locale="locales[locale.value] || locales.th">
    <!-- ใช้ NuxtLayout เพื่อให้แต่ละหน้าสามารถเลือก layout ได้ -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>