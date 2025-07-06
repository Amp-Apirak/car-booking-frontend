# 🚀 คำแนะนำการตั้งค่าระบบ Global Settings

## 📋 สรุปการอัพเดต

ระบบได้รับการอัพเดตให้ใช้ **API แทน localStorage** สำหรับการจัดการ System Settings แล้ว!

### ✨ ฟีเจอร์ใหม่:
- ✅ **Global Logo Upload** - อัพโหลดโลโก้แบบถาวร
- ✅ **Server-side Storage** - ข้อมูลเก็บใน Database
- ✅ **Real-time Sync** - ผู้ใช้ทุกคนเห็นการเปลี่ยนแปลงพร้อมกัน
- ✅ **File Management** - จัดการไฟล์โลโก้บน Server
- ✅ **Permission System** - ควบคุมสิทธิ์การแก้ไข

---

## 🛠️ วิธีการใช้งาน

### 1. **เริ่มต้น Backend Server**

```bash
cd /mnt/d/car-booking-backend

# รัน Database Migration
mysql -u root -p < migrations/add_system_settings.sql

# เริ่มต้น Server
npm run dev
# หรือ
npm start
```

### 2. **เริ่มต้น Frontend**

```bash
cd /mnt/d/car-booking-frontend

# ติดตั้ง dependencies (ถ้ายังไม่ได้ทำ)
npm install

# เริ่มต้น Frontend
npm run dev
```

### 3. **การตั้งค่าระบบ**

1. **เข้าไปที่** `http://localhost:3000/settings`
2. **เลือกแท็บ** "ตั้งค่าทั่วไป"
3. **อัพโหลดโลโก้**:
   - คลิกปุ่ม "อัพโหลดโลโก้"
   - เลือกไฟล์ (JPG, PNG, GIF, WebP ไม่เกิน 2MB)
   - โลโก้จะถูกอัพโหลดไปยัง Server ทันที
4. **เปลี่ยนชื่อระบบ**:
   - แก้ไขในช่อง "ชื่อระบบ"
   - แก้ไขในช่อง "คำอธิบายระบบ"
5. **บันทึกการตั้งค่า**:
   - คลิกปุ่ม "บันทึกการตั้งค่าระบบ"
   - รอการแจ้งเตือนสำเร็จ
   - หน้าจะรีเฟรชอัตโนมัติ

---

## 🔧 Technical Details

### **API Endpoints ที่สร้างใหม่:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/settings` | ดึงการตั้งค่าทั้งหมด |
| POST | `/api/system/settings` | อัพเดตการตั้งค่าหลายค่า |
| PUT | `/api/system/settings/:key` | อัพเดตการตั้งค่าเฉพาะ key |
| POST | `/api/system/upload-logo` | อัพโหลดโลโก้ |
| DELETE | `/api/system/logo` | ลบโลโก้ |

### **Database Tables:**

#### `system_settings`
```sql
- setting_key (VARCHAR) - Key ของการตั้งค่า
- setting_value (LONGTEXT) - ค่าการตั้งค่า
- setting_type (ENUM) - ประเภทข้อมูล
- is_public (BOOLEAN) - เข้าถึงได้สาธารณะ
```

#### `system_files`
```sql
- file_name (VARCHAR) - ชื่อไฟล์บน Server
- original_name (VARCHAR) - ชื่อไฟล์เดิม
- file_path (VARCHAR) - Path ของไฟล์
- file_type (ENUM) - ประเภทไฟล์
```

### **Frontend Changes:**

1. **Composable**: `composables/useSystemSettings.js`
2. **API Integration**: ใช้ `$fetch` แทน localStorage
3. **File Upload**: ใช้ FormData สำหรับอัพโหลด
4. **Real-time Updates**: โหลดข้อมูลจาก API เมื่อเริ่มต้น

---

## 🧪 การทดสอบ

### **ทดสอบ API ด้วย cURL:**

```bash
# ดึงการตั้งค่าปัจจุบัน
curl http://localhost:3000/api/system/settings

# อัพโหลดโลโก้
curl -X POST \
  -H "Authorization: Bearer mock-jwt-token" \
  -F "logo=@/path/to/logo.png" \
  http://localhost:3000/api/system/upload-logo

# อัพเดตชื่อระบบ
curl -X POST \
  -H "Authorization: Bearer mock-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"system_name":"ชื่อใหม่","system_tagline":"คำอธิบายใหม่"}' \
  http://localhost:3000/api/system/settings
```

### **ทดสอบหน้า Frontend:**

1. ✅ อัพโหลดโลโก้ → ไฟล์ถูกเก็บใน `/public/uploads/system/`
2. ✅ เปลี่ยนชื่อระบบ → ข้อมูลเก็บใน Database
3. ✅ รีเฟรชหน้า → ข้อมูลยังคงอยู่
4. ✅ เปิดเบราว์เซอร์ใหม่ → เห็นการเปลี่ยนแปลงเดียวกัน

---

## 🚨 หมายเหตุสำคัญ

### **สำหรับ Production:**

1. **แทนที่ Mock Authentication** ด้วยระบบ Login จริง
2. **ตั้งค่า CORS** ให้เข้มงวดขึ้น
3. **ใช้ HTTPS** สำหรับการอัพโหลดไฟล์
4. **ตั้งค่า File Permissions** ให้ถูกต้อง
5. **Backup Database** ก่อนทำการอัพเดต

### **การ Backup ข้อมูล:**

```sql
-- Backup การตั้งค่าเดิม
SELECT * FROM system_settings INTO OUTFILE '/tmp/settings_backup.csv';

-- Restore ถ้าจำเป็น
LOAD DATA INFILE '/tmp/settings_backup.csv' INTO TABLE system_settings;
```

---

## 🎉 ผลลัพธ์

ตอนนี้ระบบ Global Settings:
- 🌐 **ใช้งานได้จริง** - ข้อมูลเก็บใน Server
- 👥 **แชร์ข้ามผู้ใช้** - ทุกคนเห็นการเปลี่ยนแปลงเดียวกัน
- 💾 **ถาวร** - ข้อมูลไม่หายแม้ปิดเบราว์เซอร์
- 🔒 **ปลอดภัย** - ควบคุมสิทธิ์การเข้าถึง
- 📁 **จัดการไฟล์** - อัพโหลด/ลบโลโก้ได้จริง

พร้อมใช้งานแล้ว! 🚀