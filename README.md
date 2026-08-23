# RTPI — เว็บไซต์รวมตารางสอบ/ตารางสอน สาขาวิชารังสีเทคนิค วทก.

เว็บสำหรับนักศึกษาสาขาวิชารังสีเทคนิค วิทยาลัยพระบรมราชชนก (วทก.)
ใช้ค้นหา **ตารางสอบ ตารางสอน และติดตามกิจกรรม/ข่าวสารของสาขา** โดยข้อมูลทั้งหมดอยู่บน Google Sheets — แก้ที่ Sheet แล้วเว็บอัปเดตเองโดยอัตโนมัติ (ทุก 60 วินาที)

## โครงสร้างโปรเจค

```
RTPI/
├── index.html          หน้าแรก (สอบใกล้ถึง, ประกาศล่าสุด, ลิงก์ด่วน)
├── exams.html          ตารางสอบ + ค้นหา/กรอง + นับถอยหลัง
├── schedule.html       ตารางสอนรายสัปดาห์ แยกตามกลุ่มเรียน
├── activities.html     ฟีดกิจกรรม/ประกาศ/ทุน/ฝึกงาน
├── css/style.css       สไตล์ธีมทางการ (น้ำเงิน–ทอง, ฟอนต์ Sarabun)
├── js/config.js        ⚙️ ไฟล์ตั้งค่า (ใส่ URL ของ Apps Script ที่นี่)
├── js/data.js          ชั้นดึงข้อมูล + cache + auto-refresh
├── js/sample-data.js   ข้อมูลตัวอย่าง (ใช้จนกว่าจะเชื่อม Sheet)
├── js/ui.js            Header/Footer/แถบประกาศร่วม
└── apps-script/Code.gs สคริปต์ติดตั้งชีต + ให้บริการ JSON
```

## การตั้งค่าครั้งแรก

### 1) เปิดเว็บ (GitHub Pages)
- สร้าง repository ชื่อ `RTPI` แล้ว push ไฟล์ทั้งหมดขึ้นไป
- ไปที่ **Settings > Pages** → Branch: `main` / Folder: `/ (root)` → Save
- รอ 1-2 นาที จะได้ลิงก์ `https://<username>.github.io/RTPI/`

### 2) ตั้งค่า Google Sheets
1. สร้าง Google Sheets ใหม่
2. **Extensions > Apps Script** → วางโค้ดจาก `apps-script/Code.gs` ทับทั้งหมด → บันทึก
3. เลือกฟังก์ชัน `setupSheets` แล้วกด **Run** (ครั้งแรกขออนุญาตสิทธิ์ → อนุญาต)
   - จะได้แท็บ **Schedule / Exams / Posts / Config** พร้อมหัวตาราง รายการแบบเลือก (dropdown) และข้อมูลตัวอย่าง
4. **Deploy > New deployment > Web app**
   - Execute as: `Me`
   - Who has access: `Anyone`
   - ก็อป URL ที่ลงท้ายด้วย `/exec`

### 3) เชื่อมเว็บกับ Sheet
เปิดไฟล์ `js/config.js` แล้ววาง URL ที่ได้:

```js
const RT_CONFIG = {
  SHEET_URL: 'https://script.google.com/macros/s/xxxxx/exec',
  POLL_SECONDS: 60,
};
```

commit + push → เสร็จ เว็บจะแสดงข้อมูลจริงจาก Sheet แล้ว

## การใช้งานประจำวัน (สำหรับผู้ดูแลข้อมูล)

| ต้องการ | ทำอย่างไร |
|---|---|
| ประกาศตารางสอบใหม่ | เพิ่มแถวในแท็บ **Exams** |
| แก้ตารางสอน | แก้/เพิ่มแถวในแท็บ **Schedule** |
| โพสต์กิจกรรม/ข่าว | เพิ่มแถวในแท็บ **Posts** (เลือกหมวดจาก dropdown) |
| เปลี่ยนแบนเนอร์ประกาศวิ่ง / ปีการศึกษา / ลิงก์ไลน์ | แก้ค่าในแทบ **Config** |
| อยากให้เว็บเห็นการแก้ไขทันที | เมนู **⚙️ RTPI > ล้าง cache** ในสเปรดชีต |

หมายเหตุ: คอลัมน์วันที่ให้กรอกเป็นวันที่จริง (เช่น 21/9/2026) — ระบบจะจัดรูปแบบเป็น `yyyy-mm-dd` ให้เอง

## เทคโนโลยี

- **Frontend**: HTML + Tailwind CSS (CDN) + Alpine.js (CDN) — ไม่ต้อง build ไม่ต้องมี Node
- **Backend ชั่วคราว**: Google Apps Script (รับ JSON จาก Sheet พร้อม cache 60 วินาที)
- **Hosting**: GitHub Pages (ฟรี)
- **เส้นทางต่อยอด**: เมื่อพร้อมย้ายระบบหลังบ้านเป็น .NET (ASP.NET Core Web API + Blazor/React + SQL Server) โครงสร้างหน้าและข้อมูลชุดนี้ยกไปใช้ต่อได้ทันที

## License

MIT
