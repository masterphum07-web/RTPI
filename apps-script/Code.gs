/*************************************************************
 * RTPI — Google Apps Script สำหรับ Google Sheets
 * เว็บไซต์รวมตารางสอบ/ตารางสอน สาขาวิชารังสีเทคนิค วทก.
 *
 * วิธีใช้งาน (ทำครั้งแรกครั้งเดียว):
 *  1) สร้าง Google Sheets ใหม่
 *  2) เมนู Extensions > Apps Script แล้ววางโค้ดนี้ทับของเดิมทั้งหมด กดบันทึก
 *  3) เลือกฟังก์ชัน "setupSheets" แล้วกด Run (ครั้งแรกจะขอสิทธิ์ กด Review permissions > Allow)
 *     → ชีตจะถูกสร้างเป็นแท็บ Schedule / Exams / Posts / Config พร้อมหัวตารางและข้อมูลตัวอย่าง
 *  4) (ทำเมื่อจะเชื่อมกับเว็บ) Deploy > New deployment > ประเภท Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *     แล้วก็อป URL ที่ลงท้ายด้วย /exec ไปใส่ใน js/config.js > SHEET_URL
 *
 * หลังจากนั้นทุกครั้งที่แก้ข้อมูลในชีต เว็บจะดึงข้อมูลใหม่เองโดยอัตโนมัติ
 *************************************************************/

/* ── นิยามโครงสร้างแท็บ: หัวตารางภาษาไทย ↔ คีย์ JSON ที่เว็บใช้ ── */
const RT_SHEET_DEFS = [
  {
    name: 'Schedule',
    color: '#1d4076',
    headers: [
      { th: 'ปีการศึกษา', key: 'year' },
      { th: 'ภาคเรียน', key: 'term', list: ['ภาคเรียนที่ 1', 'ภาคเรียนที่ 2', 'ภาคฤดูร้อน'] },
      { th: 'กลุ่มเรียน', key: 'group' },
      { th: 'วัน', key: 'day', list: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'] },
      { th: 'เวลาเริ่ม', key: 'timeStart' },
      { th: 'เวลาสิ้นสุด', key: 'timeEnd' },
      { th: 'รหัสวิชา', key: 'code' },
      { th: 'รายวิชา', key: 'subject' },
      { th: 'ห้อง', key: 'room' },
      { th: 'อาจารย์', key: 'teacher' },
    ],
    samples: [
      ['2569', 'ภาคเรียนที่ 1', 'R1/1', 'จันทร์', '08:30', '10:30', '401101', 'กายวิภาคศาสตร์และสรีรวิทยา', 'ห้องบรรยาย 201', 'อาจารย์สมชาย ใจดี'],
      ['2569', 'ภาคเรียนที่ 1', 'R1/1', 'จันทร์', '13:00', '16:00', '401103', 'ฟิสิกส์การแพทย์', 'ห้องปฏิบัติการฟิสิกส์', 'อาจารย์สมหญิง รักงาน'],
      ['2569', 'ภาคเรียนที่ 1', 'R1/1', 'อังคาร', '08:30', '11:30', '401105', 'เทคนิครังสีวิทยาพื้นฐาน', 'ห้องเรียนรังสี 1', 'อาจารย์ปิยะพร สอนดี'],
      ['2569', 'ภาคเรียนที่ 1', 'R2/1', 'จันทร์', '08:30', '11:30', '402201', 'เทคนิครังสีวิทยาทรวงกลาง', 'ห้องเรียนรังสี 2', 'อาจารย์ปิยะพร สอนดี'],
    ],
  },
  {
    name: 'Exams',
    color: '#a9861d',
    headers: [
      { th: 'ปีการศึกษา', key: 'year' },
      { th: 'ภาคเรียน', key: 'term', list: ['ภาคเรียนที่ 1', 'ภาคเรียนที่ 2', 'ภาคฤดูร้อน'] },
      { th: 'ประเภทการสอบ', key: 'type', list: ['กลางภาค', 'ปลายภาค', 'สอบเก็บ', 'อื่น ๆ'] },
      { th: 'รหัสวิชา', key: 'code' },
      { th: 'รายวิชา', key: 'subject' },
      { th: 'กลุ่มสอบ', key: 'group' },
      { th: 'วันที่สอบ', key: 'date', isDate: true },
      { th: 'เวลา', key: 'time' },
      { th: 'ห้องสอบ', key: 'room' },
      { th: 'หมายเหตุ', key: 'note' },
    ],
    samples: [
      ['2569', 'ภาคเรียนที่ 1', 'กลางภาค', '401101', 'กายวิภาคศาสตร์และสรีรวิทยา', 'R1/1', new Date(2026, 8, 21), '09:00-12:00', 'ห้องสอบ A', ''],
      ['2569', 'ภาคเรียนที่ 1', 'กลางภาค', '401103', 'ฟิสิกส์การแพทย์', 'R1/1', new Date(2026, 8, 23), '09:00-12:00', 'ห้องสอบ A', ''],
      ['2569', 'ภาคเรียนที่ 1', 'ปลายภาค', '401101', 'กายวิภาคศาสตร์และสรีรวิทยา', 'R1/1', new Date(2026, 10, 30), '09:00-12:00', 'ห้องสอบ A', ''],
    ],
  },
  {
    name: 'ExamImages',
    color: '#8a6d14',
    headers: [
      { th: 'ปีการศึกษา', key: 'year' },
      { th: 'ภาคเรียน', key: 'term', list: ['ภาคเรียนที่ 1', 'ภาคเรียนที่ 2', 'ภาคฤดูร้อน'] },
      { th: 'ประเภทการสอบ', key: 'type', list: ['กลางภาค', 'ปลายภาค', 'สอบเก็บ', 'อื่น ๆ'] },
      { th: 'ชื่อรูป/คำอธิบาย', key: 'title' },
      { th: 'ลิงก์รูปภาพ', key: 'image' },
      { th: 'วันที่เผยแพร่', key: 'date', isDate: true },
    ],
    samples: [
      ['2569', 'ภาคเรียนที่ 1', 'กลางภาค', 'ตัวอย่าง: ตารางสอบกลางภาค 1/2569', 'https://drive.google.com/file/d/ใส่ไอดีไฟล์ที่นี่/view', new Date(2026, 8, 1)],
    ],
  },
  {
    name: 'Posts',
    color: '#254b85',
    headers: [
      { th: 'รหัสโพสต์', key: 'id' },
      { th: 'หัวข้อ', key: 'title' },
      { th: 'หมวดหมู่', key: 'category', list: ['ประกาศทั่วไป', 'กิจกรรม', 'ทุนการศึกษา', 'ฝึกงาน/สมัครงาน', 'อื่น ๆ'] },
      { th: 'เนื้อหา', key: 'body' },
      { th: 'ลิงก์รูปภาพ', key: 'image' },
      { th: 'ลิงก์เพิ่มเติม', key: 'link' },
      { th: 'ผู้โพสต์', key: 'author' },
      { th: 'วันที่โพสต์', key: 'date', isDate: true },
      { th: 'ปักหมุด', key: 'pinned', list: ['TRUE', 'FALSE'] },
    ],
    samples: [
      ['P001', 'ยินดีต้อนรับนักศึกษาใหม่ รุ่นที่ 20', 'ประกาศทั่วไป', 'ยินดีต้อนรับน้องปี 1 ทุกคนเข้าสู่สาขาวิชารังสีเทคนิค ติดตามประกาศผ่านเว็บไซต์นี้ได้เลย', '', '', 'ฝ่ายวิชาการ', new Date(2026, 7, 10), 'TRUE'],
      ['P002', 'กิจกรรม R-Camp เชิงปฏิบัติการ', 'กิจกรรม', 'สมาคมนักศึกษาจัดกิจกรรม R-Camp วันที่ 26-27 กันยายน 2569 รับสมัคร 60 คนแรก', '', '', 'สโมสรนักศึกษา', new Date(2026, 7, 18), 'FALSE'],
    ],
  },
  {
    name: 'Config',
    color: '#0f2447',
    headers: [
      { th: 'คีย์', key: 'key' },
      { th: 'ค่า', key: 'value' },
    ],
    samples: [
      ['siteName', 'สาขาวิชารังสีเทคนิค'],
      ['siteFullName', 'สาขาวิชาเทคนิคการแพทย์รังสี วิทยาลัยพระบรมราชชนก (วทก.)'],
      ['currentYear', '2569'],
      ['currentTerm', 'ภาคเรียนที่ 1'],
      ['announcement', 'ประกาศ! ตารางสอบกลางภาค 1/2569 ประกาศแล้ว ตรวจสอบได้ที่เมนูตารางสอบ'],
      ['lineUrl', ''],
      ['facebookUrl', ''],
      ['contactName', 'ฝ่ายวิชาการ สภานักศึกษา'],
    ],
  },
];

const RT_CACHE_SEC = 60; // เก็บ cache ผลลัพธ์ JSON ไว้ 60 วินาที กันเรียกเกินโควตา

/*************************************************************
 * setupSheets — สร้างแท็บทั้ง 4 พร้อมหัวตาราง/รูปแบบ/ตัวอย่าง
 * รันครั้งเดียวตอนตั้งค่า (หรือกดเมนู "RTPI > ตั้งค่าชีต" ในสเปรดชีต)
 *************************************************************/
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const defs = RT_SHEET_DEFS;

  defs.forEach(function (def) {
    let sheet = ss.getSheetByName(def.name);
    if (!sheet) sheet = ss.insertSheet(def.name);
    sheet.setTabColor(def.color);

    // หัวตาราง
    const nCols = def.headers.length;
    sheet.getRange(1, 1, 1, nCols).setValues([def.headers.map(function (h) { return h.th; })])
      .setFontWeight('bold')
      .setBackground('#16325c')
      .setFontColor('#ffffff')
      .setVerticalAlignment('middle');
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 32);

    // คอลัมน์วันที่ → บังคับรูปแบบ yyyy-mm-dd
    def.headers.forEach(function (h, i) {
      if (h.isDate) {
        sheet.getRange(2, i + 1, sheet.getMaxRows() - 1, 1).setNumberFormat('yyyy-mm-dd');
      }
    });

    // รายการแบบเลือกจากรายการ (dropdown) ป้องกันพิมพ์ผิด
    def.headers.forEach(function (h, i) {
      if (h.list) {
        const rule = SpreadsheetApp.newDataValidation().requireValueInList(h.list, true).setAllowInvalid(false).build();
        sheet.getRange(2, i + 1, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
      }
    });

    // ใส่ข้อมูลตัวอย่างเมื่อชีตยังว่าง
    if (sheet.getLastRow() < 2 && def.samples) {
      sheet.getRange(2, 1, def.samples.length, nCols).setValues(def.samples);
    }

    // ปรับความกว้างคอลัมน์ให้อ่านง่าย
    for (let c = 1; c <= nCols; c++) sheet.autoResizeColumn(c);
  });

  // ลบแท็บเริ่มต้นที่ว่างออก
  const first = ss.getSheets()[0];
  if (first && first.getLastRow() === 0 && defs.indexOf(defs.filter(function (d) { return d.name === first.getName(); })[0]) === -1) {
    ss.deleteSheet(first);
  }

  // สร้างเมนูให้รันจากในสเปรดชีตได้
  try {
    SpreadsheetApp.getUi()
      .createMenu('⚙️ RTPI')
      .addItem('ตั้งค่าชีต (สร้างแท็บ/หัวตาราง)', 'setupSheets')
      .addItem('ล้าง cache ข้อมูลเว็บ', 'clearCache')
      .addToUi();
  } catch (e) { /* รันจาก editor ไม่มี UI — ข้ามได้ */ }

  Logger.log('ตั้งค่าชีตเรียบร้อย');
}

/*************************************************************
 * doGet — ให้เว็บเรียกดึงข้อมูลเป็น JSON
 *   ทั้งหมด:        <URL>/exec
 *   เฉพาะแท็บ:      <URL>/exec?sheet=exams   (schedule|exams|posts|config)
 *************************************************************/
function doGet(e) {
  const want = (e && e.parameter && e.parameter.sheet) ? String(e.parameter.sheet).toLowerCase() : 'all';
  const cache = CacheService.getScriptCache();
  const cacheKey = 'rtpi_' + want;
  const hit = cache.get(cacheKey);
  if (hit) return jsonOut(JSON.parse(hit));

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const payload = { ok: true, updated: new Date().toISOString() };

  function sheetRows(sheetName) {
    const def = RT_SHEET_DEFS.filter(function (d) { return d.name.toLowerCase() === sheetName.toLowerCase(); })[0];
    const sheet = ss.getSheetByName(def.name);
    if (!sheet || sheet.getLastRow() < 2) return [];
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const out = [];
    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      if (row.join('') === '') continue; // ข้ามแถวว่าง
      const obj = {};
      def.headers.forEach(function (h, c) {
        let v = row[c];
        if (v instanceof Date) v = Utilities.formatDate(v, Session.getScriptTimeZone(), h.isDate ? 'yyyy-MM-dd' : 'HH:mm');
        obj[h.key] = v === null ? '' : v;
      });
      out.push(obj);
    }
    return out;
  }

  if (want === 'config') {
    payload.config = rowsToConfig(sheetRows('Config'));
  } else if (want === 'schedule' || want === 'exams' || want === 'posts' || want === 'examimages') {
    payload[want] = sheetRows(defName(want));
  } else {
    payload.config = rowsToConfig(sheetRows('Config'));
    payload.schedule = sheetRows('Schedule');
    payload.exams = sheetRows('Exams');
    payload.examImages = sheetRows('ExamImages');
    payload.posts = sheetRows('Posts');
  }

  const json = JSON.stringify(payload);
  try { cache.put(cacheKey, json, RT_CACHE_SEC); } catch (err) { /* ข้อมูลใหญ่เกิน cache ก็ปล่อยผ่าน */ }
  return jsonOut(payload);
}

function defName(lower) {
  const map = { schedule: 'Schedule', exams: 'Exams', posts: 'Posts', examimages: 'ExamImages' };
  return map[lower] || lower;
}

function rowsToConfig(rows) {
  const cfg = {};
  rows.forEach(function (r) { if (r.key) cfg[String(r.key)] = String(r.value || ''); });
  return cfg;
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** ล้าง cache เมื่อแก้ข้อมูลแล้วอยากให้เว็บเห็นทันที */
function clearCache() {
  CacheService.getScriptCache().removeAll(['rtpi_all', 'rtpi_schedule', 'rtpi_exams', 'rtpi_posts', 'rtpi_examimages', 'rtpi_config']);
  Logger.log('ล้าง cache แล้ว');
}

/** เพิ่มเมนูให้อัตโนมัติเมื่อเปิดสเปรดชีต */
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('⚙️ RTPI')
      .addItem('ตั้งค่าชีต (สร้างแท็บ/หัวตาราง)', 'setupSheets')
      .addItem('ล้าง cache ข้อมูลเว็บ', 'clearCache')
      .addToUi();
  } catch (e) { /* ไม่มี UI ข้ามได้ */ }
}
