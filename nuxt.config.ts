export default defineNuxtConfig({
  // ปิด SSR ให้ Nuxt ทำงานแบบ SPA (Client-side Rendering)
  ssr: false,

  modules: ["@nuxt/ui-pro", "@nuxtjs/i18n"],
  
  // Runtime config สำหรับ API URL
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000/api'
    }
  },
  uiPro: {
    // อ่านค่า license จากตัวแปรแปลกๆ เช่น MY_ENV_VARIABLE
    license: process.env.NUXT_UI_PRO_LICENSE,
  },

  css: ["~/assets/css/main.css"],

  i18n: {
    locales: [
      {
        code: "th", // รหัสภาษาไทย
        name: "ไทย", // ชื่อภาษา
        file: "th.json", // ชี้ไปยังไฟล์ locales/th.json
      },
      {
        code: "en", // รหัสภาษาอังกฤษ
        name: "English", // ชื่อภาษา
        file: "en.json", // ชี้ไปยังไฟล์ locales/en.json
      },
    ],
    defaultLocale: "th",
    lazy: true, // เปิด lazy-load messages
    langDir: "../locales/", // โฟลเดอร์เก็บไฟล์ JSON
    strategy: 'no_prefix', // ไม่ใช้ prefix ใน URL
    detectBrowserLanguage: false, // ปิดการตรวจสอบภาษาจาก browser
  },

  app: {
    head: {
      title: "Car Booking Frontend", // ชื่อของเว็บที่แสดงในเบราว์เซอร์
      meta: [
        {
          name: "description",
          content: "ระบบจองรถ - Car Booking Frontend", // คำอธิบายสั้น ๆ ของเว็บไซต์
        },
      ],
    },
  },
});
