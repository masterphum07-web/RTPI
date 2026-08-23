/*************************************************************
 * RTPI — Google Apps Script สำหรับ Google Sheets
 * เว็บไซต์รวมตารางสอบ/ตารางสอน สาขาวิชารังสีเทคนิค
 * วิทยาลัยเทคโนโลยีทางการแพทย์และสาธารณสุข กาญจนาภิเษก (วทก.)
 *
 * ★ วิธีอัปเกรดจากรุ่นก่อน (สำคัญ — ทำครั้งเดียว):
 *  1) เปิด Google Sheets ของสาขา → Extensions > Apps Script
 *  2) วางโค้ดนี้ทับของเดิมทั้งหมด → บันทึก
 *  3) รันฟังก์ชัน setupSheets อีกครั้ง
 *     (จะสร้างแท็บ Images ใหม่ + ย้ายข้อมูลเดิม + แก้ชื่อวิทยาลัยให้อัตโนมัติ)
 *  4) Deploy > Manage deployments > ดินสอ (Edit) > Version: New version
 *     > Deploy  ← ใช้วิธีนี้ URL จะเท่าเดิม ไม่ต้องแก้ที่เว็บ
 *
 * ตั้งครั้งแรก (ยังไม่เคยวางโค้ด): ทำข้อ 2-4 และข้ามการย้ายข้อมูล
 *************************************************************/

/* ── รหัสผ่านแอดมิน (ใช้อัปโหลดรูป/เพิ่มข้อมูลผ่านหน้าเว็บ /admin.html) ── */
const ADMIN_PASS = '12345';

/* โฟลเดอร์ Drive ที่เก็บรูปที่อัปโหลด */
const UPLOAD_FOLDER = 'RTPI-Uploads';

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
      { th: 'ชั้นปี', key: 'level', list: ['ปี 1', 'ปี 2', 'ปี 3', 'ปี 4'] },
    ],
    samples: [
      ['2569', 'ภาคเรียนที่ 1', 'R1/1', 'จันทร์', '08:30', '10:30', '401101', 'กายวิภาคศาสตร์และสรีรวิทยา', 'ห้องบรรยาย 201', 'อาจารย์สมชาย ใจดี', 'ปี 1'],
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
      { th: 'ชั้นปี', key: 'level', list: ['ปี 1', 'ปี 2', 'ปี 3', 'ปี 4'] },
    ],
    samples: [
      ['2569', 'ภาคเรียนที่ 1', 'กลางภาค', '401101', 'กายวิภาคศาสตร์และสรีรวิทยา', 'R1/1', new Date(2026, 8, 21), '09:00-12:00', 'ห้องสอบ A', '', 'ปี 1'],
    ],
  },
  {
    name: 'Images',
    color: '#8a6d14',
    headers: [
      { th: 'หมวดหมู่', key: 'category', list: ['ตารางสอน', 'ตารางสอบ', 'อื่น ๆ'] },
      { th: 'ปีการศึกษา', key: 'year' },
      { th: 'ภาคเรียน', key: 'term', list: ['ภาคเรียนที่ 1', 'ภาคเรียนที่ 2', 'ภาคฤดูร้อน'] },
      { th: 'ชื่อรูป/คำอธิบาย', key: 'title' },
      { th: 'ลิงก์รูปภาพ', key: 'image' },
      { th: 'วันที่เผยแพร่', key: 'date', isDate: true },
      { th: 'ผู้อัพโหลด', key: 'author' },
      { th: 'ชั้นปี', key: 'level', list: ['ปี 1', 'ปี 2', 'ปี 3', 'ปี 4'] },
    ],
    samples: [],
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
      ['P001', 'ยินดีต้อนรับนักศึกษาใหม่', 'ประกาศทั่วไป', 'ติดตามประกาศผ่านเว็บไซต์นี้ได้เลย', '', '', 'ฝ่ายวิชาการ', new Date(2026, 7, 10), 'FALSE'],
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
      ['siteFullName', 'สาขาวิชาเทคนิคการแพทย์รังสี วิทยาลัยเทคโนโลยีทางการแพทย์และสาธารณสุข กาญจนาภิเษก (วทก.)'],
      ['currentYear', '2569'],
      ['currentTerm', 'ภาคเรียนที่ 1'],
      ['announcement', ''],
      ['lineUrl', ''],
      ['facebookUrl', ''],
      ['contactName', 'ฝ่ายวิชาการ สภานักศึกษา'],
    ],
  },
];

const RT_CACHE_SEC = 60;

/*************************************************************
 * setupSheets — สร้าง/อัปเดตแท็บทั้งหมด + ย้ายข้อมูลรุ่นเก่า
 *************************************************************/
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  migrateExamImages_(ss);
  migrateConfig_(ss);

  RT_SHEET_DEFS.forEach(function (def) {
    let sheet = ss.getSheetByName(def.name);
    if (!sheet) sheet = ss.insertSheet(def.name);
    sheet.setTabColor(def.color);

    const nCols = def.headers.length;
    sheet.getRange(1, 1, 1, nCols).setValues([def.headers.map(function (h) { return h.th; })])
      .setFontWeight('bold').setBackground('#16325c').setFontColor('#ffffff')
      .setVerticalAlignment('middle');
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 32);

    def.headers.forEach(function (h, i) {
      if (h.isDate) {
        sheet.getRange(2, i + 1, sheet.getMaxRows() - 1, 1).setNumberFormat('yyyy-mm-dd');
      }
      if (h.list) {
        const rule = SpreadsheetApp.newDataValidation().requireValueInList(h.list, true).setAllowInvalid(false).build();
        sheet.getRange(2, i + 1, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
      }
    });

    if (sheet.getLastRow() < 2 && def.samples && def.samples.length) {
      sheet.getRange(2, 1, def.samples.length, nCols).setValues(def.samples);
    }

    for (let c = 1; c <= nCols; c++) sheet.autoResizeColumn(c);
  });

  try {
    SpreadsheetApp.getUi()
      .createMenu('⚙️ RTPI')
      .addItem('ตั้งค่าชีต (สร้างแท็บ/หัวตาราง)', 'setupSheets')
      .addItem('ล้าง cache ข้อมูลเว็บ', 'clearCache')
      .addToUi();
  } catch (e) { /* รันจาก editor ไม่มี UI */ }

  Logger.log('ตั้งค่าชีตเรียบร้อย');
}

/* ย้ายแท็บ ExamImages รุ่นเก่า (ถ้ามี) มาเป็น Images — เก็บรูปจริงไว้ทั้งหมด */
function migrateExamImages_(ss) {
  const old = ss.getSheetByName('ExamImages');
  const existing = ss.getSheetByName('Images');
  if (!old || existing) return;

  let carried = [];
  if (old.getLastRow() > 1) {
    const vals = old.getRange(2, 1, old.getLastRow() - 1, old.getLastColumn()).getValues();
    carried = vals
      .filter(function (r) { return String(r[4] || '').indexOf('http') === 0 && String(r[4]).indexOf('ใส่ไอดี') === -1; })
      .map(function (r) {
        return ['ตารางสอบ', String(r[0] || ''), String(r[1] || ''), String(r[3] || ''), String(r[4]),
                r[5] instanceof Date ? r[5] : new Date(), 'ระบบเดิม'];
      });
  }
  ss.deleteSheet(old);
  if (carried.length) {
    let sheet = ss.getSheetByName('Images');
    if (!sheet) sheet = ss.insertSheet('Images');
    sheet.getRange(2, 1, carried.length, 7).setValues(carried);
  }
}

/* แก้ชื่อวิทยาลัยที่ตั้งผิดตอนแรก (พระบรมราชชนก → วทก. กาญจนาภิเษก) */
function migrateConfig_(ss) {
  const sheet = ss.getSheetByName('Config');
  if (!sheet || sheet.getLastRow() < 2) return;
  const vals = sheet.getDataRange().getValues();
  const correct = 'สาขาวิชาเทคนิคการแพทย์รังสี วิทยาลัยเทคโนโลยีทางการแพทย์และสาธารณสุข กาญจนาภิเษก (วทก.)';
  for (let i = 1; i < vals.length; i++) {
    if (vals[i][0] === 'siteFullName' && String(vals[i][1] || '').indexOf('พระบรมราชชนก') !== -1) {
      sheet.getRange(i + 1, 2).setValue(correct);
    }
  }
}

/*************************************************************
 * doGet — ให้เว็บอ่านข้อมูลเป็น JSON
 *   ทั้งหมด: <URL>/exec   |  เฉพาะแท็บ: ?sheet=images
 *************************************************************/
function doGet(e) {
  const want = (e && e.parameter && e.parameter.sheet) ? String(e.parameter.sheet).toLowerCase() : 'all';
  const cache = CacheService.getScriptCache();
  const cacheKey = 'rtpi_' + want;
  const hit = cache.get(cacheKey);
  if (hit) return jsonOut(JSON.parse(hit));

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const payload = { ok: true, updated: new Date().toISOString() };

  if (want === 'config') {
    payload.config = rowsToConfig(sheetRows(ss, 'Config'));
  } else if (['schedule', 'exams', 'images', 'posts'].indexOf(want) !== -1) {
    payload[want] = sheetRows(ss, defName(want));
  } else {
    payload.config = rowsToConfig(sheetRows(ss, 'Config'));
    payload.schedule = sheetRows(ss, 'Schedule');
    payload.exams = sheetRows(ss, 'Exams');
    payload.images = sheetRows(ss, 'Images');
    payload.posts = sheetRows(ss, 'Posts');
  }

  const json = JSON.stringify(payload);
  try { cache.put(cacheKey, json, RT_CACHE_SEC); } catch (err) {}
  return jsonOut(payload);
}

/*************************************************************
 * doPost — API สำหรับหน้าแอดมินของเว็บ (admin.html)
 * ส่งเป็น JSON: { action, password, ... }
 *   ping        — ตรวจรหัสผ่าน
 *   uploadImage — อัปโหลดรูป (base64) ขึ้น Drive + บันทึกแถวใน Images
 *   deleteImage — ลบรูป (ลบแถว + ทิ้งไฟล์ใน Drive)
 *   addRows     — เพิ่มแถวข้อมูลลง Schedule / Exams / Posts
 *************************************************************/
function doPost(e) {
  let body = {};
  try {
    body = JSON.parse(e.postData.contents || '{}');
  } catch (err) {
    return jsonOut({ ok: false, error: 'รูปแบบคำขอไม่ถูกต้อง' });
  }

  if (String(body.password || '') !== ADMIN_PASS) {
    return jsonOut({ ok: false, error: 'รหัสผ่านไม่ถูกต้อง' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    switch (String(body.action || '')) {
      case 'ping':
        return jsonOut({ ok: true });

      case 'uploadImage': {
        const folder = getUploadFolder_();
        const blob = Utilities.newBlob(
          Utilities.base64Decode(String(body.base64 || '')),
          String(body.mimeType || 'image/jpeg'),
          String(body.fileName || ('upload-' + Date.now() + '.jpg'))
        );
        const file = folder.createFile(blob);
        try {
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (shErr) {
          return jsonOut({ ok: false, error: 'ตั้งค่าการแชร์ไฟล์ไม่สำเร็จ: ' + shErr.message });
        }
        const url = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1600';

        const sheet = ss.getSheetByName('Images');
        if (!sheet) return jsonOut({ ok: false, error: 'ไม่พบแท็บ Images — รัน setupSheets ก่อน' });
        sheet.appendRow([
          String(body.category || 'อื่น ๆ'),
          String(body.year || ''),
          String(body.term || ''),
          String(body.title || ''),
          url,
          new Date(),
          String(body.author || 'แอดมิน'),
          String(body.level || ''),
        ]);
        return jsonOut({ ok: true, url: url, fileId: file.getId() });
      }

      case 'deleteImage': {
        const url = String(body.url || '');
        if (!url) return jsonOut({ ok: false, error: 'ไม่ได้ระบุรูป' });
        const sheet = ss.getSheetByName('Images');
        if (!sheet || sheet.getLastRow() < 2) return jsonOut({ ok: false, error: 'ไม่พบข้อมูลรูป' });
        const vals = sheet.getDataRange().getValues();
        let removed = false;
        for (let i = vals.length - 1; i >= 1; i--) {
          if (String(vals[i][4] || '') === url) {
            sheet.deleteRow(i + 1);
            removed = true;
          }
        }
        const m = url.match(/[\?&]id=([\w-]{15,})/) || url.match(/\/d\/([\w-]{15,})/);
        if (m) { try { DriveApp.getFileById(m[1]).setTrashed(true); } catch (dErr) {} }
        return jsonOut({ ok: removed, error: removed ? '' : 'ไม่พบรูปนี้ในชีต' });
      }

      case 'addRows': {
        const target = defName(String(body.sheet || '').toLowerCase());
        const def = RT_SHEET_DEFS.filter(function (d) { return d.name === target; })[0];
        if (!def || target === 'Config' || target === 'Images') {
          return jsonOut({ ok: false, error: 'เป้าหมายไม่ถูกต้อง (ใช้ Schedule / Exams / Posts)' });
        }
        const rows = body.rows;
        if (!Array.isArray(rows) || !rows.length) return jsonOut({ ok: false, error: 'ไม่มีข้อมูลแถว' });
        const sheet = ss.getSheetByName(def.name);
        if (!sheet) return jsonOut({ ok: false, error: 'ไม่พบแท็บ ' + def.name });
        const norm = rows.map(function (r) {
          return def.headers.map(function (h, c) {
            let v = r[c] === undefined || r[c] === null ? '' : r[c];
            if (h.isDate && !(v instanceof Date)) {
              const s = String(v).trim();
              if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                const p = s.split('-');
                return new Date(+p[0], +p[1] - 1, +p[2]);
              }
            }
            return v;
          });
        });
        sheet.getRange(sheet.getLastRow() + 1, 1, norm.length, def.headers.length).setValues(norm);
        return jsonOut({ ok: true, added: norm.length });
      }

      default:
        return jsonOut({ ok: false, error: 'ไม่รู้จัก action: ' + body.action });
    }
  } catch (err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

function getUploadFolder_() {
  const it = DriveApp.getFoldersByName(UPLOAD_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(UPLOAD_FOLDER);
}

function defName(lower) {
  const map = { schedule: 'Schedule', exams: 'Exams', posts: 'Posts', images: 'Images' };
  return map[lower] || lower;
}

function sheetRows(ss, sheetName) {
  const def = RT_SHEET_DEFS.filter(function (d) { return d.name === sheetName; })[0];
  const sheet = ss.getSheetByName(def.name);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const out = [];
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    if (row.join('') === '') continue;
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

function rowsToConfig(rows) {
  const cfg = {};
  rows.forEach(function (r) { if (r.key) cfg[String(r.key)] = String(r.value || ''); });
  return cfg;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** ล้าง cache เมื่อแก้ข้อมูลแล้วอยากให้เว็บเห็นทันที */
function clearCache() {
  CacheService.getScriptCache().removeAll(['rtpi_all', 'rtpi_schedule', 'rtpi_exams', 'rtpi_posts', 'rtpi_images', 'rtpi_config']);
  Logger.log('ล้าง cache แล้ว');
}

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('⚙️ RTPI')
      .addItem('ตั้งค่าชีต (สร้างแท็บ/หัวตาราง)', 'setupSheets')
      .addItem('ล้าง cache ข้อมูลเว็บ', 'clearCache')
      .addToUi();
  } catch (e) {}
}
