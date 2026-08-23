/* ─────────────────────────────────────────────
 * RTData — ชั้นดึงข้อมูลกลางของเว็บ
 * รองรับ 2 แหล่งข้อมูล:
 *  1) Google Sheets ตรง ๆ ผ่าน gviz (ใช้ SHEET_ID)
 *  2) Google Apps Script Web app (ใช้ SHEET_URL)
 * ไม่มีข้อมูลสำรอง — ชีตว่างเว็บก็ว่างตามจริง
 * ───────────────────────────────────────────── */
const RTData = (() => {
  let cache = null;
  let state = 'unconfigured'; // live | offline | unconfigured
  let fetchedAt = 0;
  let pending = null;

  const EMPTY = () => ({
    updated: new Date().toISOString(),
    config: {},
    schedule: [],
    exams: [],
    posts: [],
    examImages: [],
  });

  /* ── แผนที่หัวตารางภาษาไทย → คีย์ JSON ── */
  const MAPS = {
    Schedule: {
      'ปีการศึกษา': 'year', 'ภาคเรียน': 'term', 'กลุ่มเรียน': 'group', 'วัน': 'day',
      'เวลาเริ่ม': 'timeStart', 'เวลาสิ้นสุด': 'timeEnd', 'รหัสวิชา': 'code',
      'รายวิชา': 'subject', 'ห้อง': 'room', 'อาจารย์': 'teacher',
    },
    Exams: {
      'ปีการศึกษา': 'year', 'ภาคเรียน': 'term', 'ประเภทการสอบ': 'type', 'รหัสวิชา': 'code',
      'รายวิชา': 'subject', 'กลุ่มสอบ': 'group', 'วันที่สอบ': 'date', 'เวลา': 'time',
      'ห้องสอบ': 'room', 'หมายเหตุ': 'note',
    },
    Posts: {
      'รหัสโพสต์': 'id', 'หัวข้อ': 'title', 'หมวดหมู่': 'category', 'เนื้อหา': 'body',
      'ลิงก์รูปภาพ': 'image', 'ลิงก์เพิ่มเติม': 'link', 'ผู้โพสต์': 'author',
      'วันที่โพสต์': 'date', 'ปักหมุด': 'pinned',
    },
    ExamImages: {
      'ปีการศึกษา': 'year', 'ภาคเรียน': 'term', 'ประเภทการสอบ': 'type',
      'ชื่อรูป/คำอธิบาย': 'title', 'ลิงก์รูปภาพ': 'image', 'วันที่เผยแพร่': 'date',
    },
    Config: { 'คีย์': 'key', 'ค่า': 'value' },
  };

  function pad2(n) { return String(n).padStart(2, '0'); }

  /* แปลงค่าจาก gviz (Date(2026,8,21), number, null ฯลฯ) ให้เป็นข้อความพร้อมใช้ */
  function gvizCell(cell) {
    if (!cell || cell.v === null || cell.v === undefined) return '';
    let v = cell.v;
    if (typeof v === 'string') {
      const m = v.match(/^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)$/);
      if (m) {
        const y = +m[1], mo = +m[2] + 1, d = +m[3];
        const h = m[4] !== undefined ? +m[4] : 0, mi = m[5] !== undefined ? +m[5] : 0;
        if (y === 1899) return `${pad2(h)}:${pad2(mi)}`;              // ค่าเวลาเปล่า ๆ
        if (h === 0 && mi === 0) return `${y}-${pad2(mo)}-${pad2(d)}`; // วันที่เปล่า ๆ
        return `${y}-${pad2(mo)}-${pad2(d)} ${pad2(h)}:${pad2(mi)}`;   // วันที่+เวลา
      }
      return v;
    }
    return String(v);
  }

  function gvizRows(json, map) {
    const cols = (json.table && json.table.cols) || [];
    const rows = (json.table && json.table.rows) || [];
    const out = [];
    rows.forEach(r => {
      const obj = {};
      let filled = false;
      cols.forEach((c, i) => {
        const key = map[(c.label || '').trim()];
        if (key) { obj[key] = gvizCell((r.c || [])[i]); if (obj[key] !== '') filled = true; }
      });
      if (filled) out.push(obj);
    });
    return out;
  }

  async function gvizTab(sheetId, tabName) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    return gvizRows(json, MAPS[tabName] || {});
  }

  async function fetchFromGviz(sheetId) {
    const tabs = ['Schedule', 'Exams', 'Posts', 'ExamImages', 'Config'];
    const settled = await Promise.all(tabs.map(t => gvizTab(sheetId, t).catch(() => [])));
    const d = EMPTY();
    d.updated = new Date().toISOString();
    d.schedule = settled[0];
    d.exams = settled[1];
    d.posts = settled[2];
    d.examImages = settled[3];
    settled[4].forEach(r => { if (r.key) d.config[String(r.key)] = String(r.value ?? ''); });
    return d;
  }

  async function fetchFromScript(url) {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = Object.assign(EMPTY(), await res.json());
    if (!Array.isArray(d.examImages)) d.examImages = [];
    return d;
  }

  async function fetchLive() {
    if (RT_CONFIG.SHEET_URL && /script\.google\.com/.test(RT_CONFIG.SHEET_URL)) {
      return fetchFromScript(RT_CONFIG.SHEET_URL);
    }
    if (RT_CONFIG.SHEET_ID) return fetchFromGviz(RT_CONFIG.SHEET_ID);
    throw new Error('ยังไม่ได้ตั้งค่าแหล่งข้อมูล');
  }

  async function load(force) {
    const freshMs = (RT_CONFIG.POLL_SECONDS || 60) * 1000;
    if (!force && cache && Date.now() - fetchedAt < freshMs) return cache;
    if (pending) return pending;

    pending = (async () => {
      try {
        cache = await fetchLive();
        state = 'live';
      } catch (err) {
        console.warn('[RTPI] ดึงข้อมูลไม่สำเร็จ:', err.message);
        if (!cache) cache = EMPTY();
        state = 'offline';
      } finally {
        fetchedAt = Date.now();
        pending = null;
      }
      return cache;
    })();
    return pending;
  }

  return {
    load,
    state: () => state,
    lastUpdated: () => fetchedAt,
  };
})();

/* ── ตัวช่วยวันที่/เวลา ── */
const RT_THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

function rtThaiDate(iso) {
  if (!iso) return '-';
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${+m[3]} ${RT_THAI_MONTHS[+m[2] - 1]} ${+m[1] + 543}`;
}

function rtDaysUntil(iso) {
  if (!iso) return null;
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const today = new Date();
  const target = new Date(+m[1], +m[2] - 1, +m[3]);
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((target - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / oneDay);
}

/* 8:30 → 08:30 เพื่อการเรียงเวลาที่ถูกต้องและการแสดงผลทางการ */
function rtPadTime(t) {
  if (!t) return '';
  const m = String(t).trim().match(/^(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : String(t);
}

/* แปลงลิงก์แชร์ Google Drive ให้เป็นลิงก์รูปที่ <img> ใช้ได้โดยตรง */
function rtDirectImage(u) {
  if (!u) return '';
  const m = String(u).match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]{15,})/);
  if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
  return String(u);
}
