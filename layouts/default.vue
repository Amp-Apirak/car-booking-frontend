<template>
  <!-- Layout หลักที่ใช้ GlobalSidebar สำหรับทุกหน้า -->
  <UDashboardGroup>
    <!-- Global Sidebar -->
    <GlobalSidebar />

    <!-- เนื้อหาหลักของแต่ละหน้า -->
    <UDashboardPanel>
      <!-- Header Bar ด้านบน -->
      <template #header>
        <UDashboardNavbar :title="pageTitle">
          <!-- ปุ่ม collapse sidebar สำหรับ mobile -->
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>

          <!-- เมนูด้านขวา -->
          <template #trailing>
            <div class="absolute right-4 flex items-center gap-2">
              <!-- เปลี่ยนภาษา -->
              <UButtonGroup size="sm" orientation="horizontal">
                <UButton
                  :variant="locale === 'th' ? 'solid' : 'outline'"
                  :color="locale === 'th' ? 'primary' : 'neutral'"
                  @click="switchLanguage('th')"
                >
                  TH
                </UButton>
                <UButton
                  :variant="locale === 'en' ? 'solid' : 'outline'"
                  :color="locale === 'en' ? 'primary' : 'neutral'"
                  @click="switchLanguage('en')"
                >
                  EN
                </UButton>
              </UButtonGroup>

              <!-- การแจ้งเตือน -->
              <UButton
                icon="i-lucide-bell"
                color="neutral"
                variant="ghost"
                size="sm"
                :badge="notificationCount > 0 ? notificationCount : undefined"
                @click="openNotifications"
              />

              <!-- เมนูโปรไฟล์-->
              <UDropdown 
                :items="profileMenuItems"
                :popper="{ placement: 'bottom-end' }"
              >
                <UButton
                  :avatar="{
                    src: 'https://github.com/nuxt.png',
                    alt: 'Admin',
                  }"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                />
              </UDropdown>
            </div>
          </template>
        </UDashboardNavbar>
      </template>

      <!-- เนื้อหาของหน้า -->
      <template #body>
        <!-- Breadcrumb (ถ้ามี) -->
        <div v-if="breadcrumbs.length > 0" class="mb-6">
          <UBreadcrumb :items="breadcrumbs" />
        </div>

        <!-- เนื้อหาหลักจาก slot -->
        <slot />
      </template>

      <!-- Footer (ถ้าต้องการ) -->
      <template #footer>
        <div
          class="text-center text-sm text-muted py-4 border-t border-default"
        >
          © 2024 {{ t("system.name") }} - {{ t("system.tagline") }}
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const route = useRoute();

// จำนวนการแจ้งเตือน
const notificationCount = ref(3);

// ฟังก์ชันสลับภาษา
function switchLanguage(lang: string) {
  locale.value = lang;
  console.log("เปลี่ยนภาษาเป็น:", lang);
}

// เมนูโปรไฟล์ - ใช้ computed และ navigateTo
const profileMenuItems = computed(() => [
  [
    {
      label: t('menu.profile'),
      icon: 'i-lucide-user',
      to: '/profile'
    },
    {
      label: t('menu.settings'),
      icon: 'i-lucide-settings',
      to: '/settings'
    }
  ],
  [
    {
      label: 'โหมดมืด',
      icon: 'i-lucide-moon',
      shortcuts: ['⌘', 'D'],
      click: () => {
        console.log('สลับโหมดมืด');
        toggleDarkMode();
      }
    }
  ],
  [
    {
      label: t('logout'),
      icon: 'i-lucide-log-out',
      click: () => {
        console.log('ออกจากระบบ');
        handleLogout();
      }
    }
  ]
]);

// หาชื่อหน้าจาก route meta หรือใช้ชื่อ default
const pageTitle = computed(() => {
  if (route.meta.title) {
    return typeof route.meta.title === "function"
      ? route.meta.title()
      : route.meta.title;
  }

  const routeName = route.name as string;
  if (routeName) {
    return getPageTitleFromRoute(routeName);
  }

  return t("system.name");
});

// สร้าง breadcrumb จาก route
const breadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  const items = [];

  if (route.path !== "/") {
    items.push({
      label: t("menu.index"),
      to: "/",
    });
  }

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    items.push({
      label: getBreadcrumbLabel(segment),
      to: currentPath,
    });
  }

  return items.length > 1 ? items : [];
});

// ฟังก์ชันต่างๆ
function toggleDarkMode() {
  console.log("สลับโหมดมืด");
  // TODO: เพิ่มโค้ดสลับโหมดมืด
}

function openNotifications() {
  console.log("เปิดการแจ้งเตือน");
  notificationCount.value = 0;
}

function handleLogout() {
  console.log("ออกจากระบบ");
  // TODO: เพิ่มโค้ด logout
  navigateTo("/");
}

function getPageTitleFromRoute(routeName: string): string {
  const titleMap: Record<string, string> = {
    index: t("menu.dashboard"),
    dashboard: t("menu.dashboard"),
    bookings: t("menu.bookings"),
    cars: t("menu.cars"),
    customers: t("menu.customers"),
    drivers: t("menu.drivers"),
    reports: t("menu.reports"),
    settings: t("menu.settings"),
    help: t("menu.help"),
  };

  return titleMap[routeName] || routeName;
}

function getBreadcrumbLabel(segment: string): string {
  const labelMap: Record<string, string> = {
    bookings: t("menu.bookings"),
    cars: t("menu.cars"),
    customers: t("menu.customers"),
    drivers: t("menu.drivers"),
    reports: t("menu.reports"),
    settings: t("menu.settings"),
    help: t("menu.help"),
    new: "เพิ่มใหม่",
    edit: "แก้ไข",
    view: "ดู",
  };

  return labelMap[segment] || segment;
}

// กำหนด meta สำหรับ SEO
useHead({
  title: pageTitle,
  meta: [
    {
      name: "description",
      content: computed(() => `${pageTitle.value} - ${t("system.name")}`),
    },
  ],
});
</script>