/* ─────────────────────────────────────────────
 * RTPI — ไฟล์ตั้งค่าหลักของเว็บ
 * ─────────────────────────────────────────────
 * โหมด A (ใช้อยู่): ใส่ SHEET_ID ของ Google Sheets
 *   เว็บจะดึงข้อมูลจากชีตตรง ๆ (ชีตต้องแชร์เป็น "ทุกคนที่มีลิงก์ – ผู้ดู")
 *
 * โหมด B (ทางเลือก): ใส่ SHEET_URL จาก Apps Script (Deploy > Web app)
 *   เหมาะเมื่อต้องการ cache ฝั่งเซิร์ฟเวอร์ — ถ้าใส่ทั้งคู่จะใช้โหมด B
 *
 * แท็บที่เว็บอ่าน: Schedule, Exams, Posts, ExamImages, Config
 */
const RT_CONFIG = {
  SHEET_ID: '15Rwiuwwi7GF-SA2Rr2SY3xtNwxQTCBbzJhHbMi2RVsI',
  SHEET_URL: '',

  // ระยะเวลาดึงข้อมูลใหม่ (วินาที)
  POLL_SECONDS: 60,
};
