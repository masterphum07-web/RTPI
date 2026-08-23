/* ─────────────────────────────────────────────
 * RTData — ชั้นดึงข้อมูลกลางของเว็บ
 * - ดึง JSON จาก Google Apps Script (ถ้าตั้ง SHEET_URL แล้ว)
 * - ถ้าดึงไม่ได้/ยังไม่ตั้ง จะใช้ข้อมูลตัวอย่างแทน
 * - Cache ตามเวลา POLL_SECONDS และ refresh เมื่อกลับมาที่แท็บ
 * ───────────────────────────────────────────── */
const RTData = (() => {
  let cache = null;
  let live = false;
  let fetchedAt = 0;
  let pending = null;

  function normalize(raw) {
    const d = raw || {};
    return {
      updated: d.updated || new Date().toISOString(),
      config: d.config || {},
      schedule: Array.isArray(d.schedule) ? d.schedule : [],
      exams: Array.isArray(d.exams) ? d.exams : [],
      posts: Array.isArray(d.posts) ? d.posts : [],
    };
  }

  async function fetchLive() {
    const res = await fetch(RT_CONFIG.SHEET_URL, { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return normalize(await res.json());
  }

  async function load(force) {
    const freshMs = (RT_CONFIG.POLL_SECONDS || 60) * 1000;
    if (!force && cache && Date.now() - fetchedAt < freshMs) return cache;
    if (pending) return pending;

    pending = (async () => {
      try {
        if (RT_CONFIG.SHEET_URL) {
          cache = await fetchLive();
          live = true;
        } else {
          throw new Error('ยังไม่ได้ตั้ง SHEET_URL');
        }
      } catch (err) {
        console.warn('[RTPI] ใช้ข้อมูลตัวอย่าง:', err.message);
        if (!cache) cache = normalize(RT_SAMPLE);
        live = false;
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
    isLive: () => live,
    lastUpdated: () => fetchedAt,
  };
})();

/* ── ตัวช่วยแปลงวันที่ ── */
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
