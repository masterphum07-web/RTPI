/* ─────────────────────────────────────────────
 * RTPI — ไฟล์ตั้งค่าหลักของเว็บ
 * ─────────────────────────────────────────────
 * SHEET_ID  : ใช้อ่านข้อมูลจากชีตตรง ๆ (ชีตแชร์ "ทุกคนที่มีลิงก์ – ผู้ดู")
 * SCRIPT_URL: ใช้สำหรับหน้าแอดมิน (อัปโหลดรูป/เพิ่มข้อมูล)
 *             คือ URL Web app จาก Deploy ของ Apps Script (ลงท้าย /exec)
 */
const RT_CONFIG = {
  SHEET_ID: '15Rwiuwwi7GF-SA2Rr2SY3xtNwxQTCBbzJhHbMi2RVsI',
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxeJ2QVm2Lynu2SB_JvIaBJHixz9sLahRlplD9PpTYJiU2YEgSzjFoy0TsX522o_n3D/exec',
  // URL ของ PaddleOCR backend; เว้นว่างเพื่อใช้ OCR สำรองในเบราว์เซอร์
  OCR_URL: '',

  // ระยะเวลาดึงข้อมูลใหม่ (วินาที)
  POLL_SECONDS: 60,
};
