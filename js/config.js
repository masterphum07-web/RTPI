/* ─────────────────────────────────────────────
 * RTPI — ไฟล์ตั้งค่าหลักของเว็บ
 * ─────────────────────────────────────────────
 * 1) สร้าง Google Sheet → คัดลอกโค้ดจาก apps-script/Code.gs
 *    ไปวางใน Extensions > Apps Script แล้วรัน setupSheets
 * 2) Deploy > New deployment > Web app
 *    (Execute as: Me / Who has access: Anyone)
 * 3) ก็อป URL ที่ได้ (ลงท้ายด้วย /exec) มาวางที่ SHEET_URL ด้านล่าง
 *
 * ถ้ายังไม่ใส่ URL เว็บจะแสดงข้อมูลตัวอย่าง (sample data) ให้ก่อน
 */
const RT_CONFIG = {
  SHEET_URL: '',

  // ระยะเวลาดึงข้อมูลใหม่จาก Sheet (วินาที)
  POLL_SECONDS: 60,
};
