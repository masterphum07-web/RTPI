/* ─────────────────────────────────────────────
 * ส่วนแสดงผลร่วม: Header, Footer, สถานะข้อมูล,
 * โหมดมืด, ปุ่มกลับขึ้นด้านบน, Lightbox ดูรูปภาพ
 * (ใช้ vanilla JS เพื่อให้ HTML ที่ฉีดภายหลังทำงานได้ทันที)
 * ───────────────────────────────────────────── */

const RT_NAV = [
  { id: 'home', label: 'หน้าแรก', href: 'index.html' },
  { id: 'schedule', label: 'ตารางสอน', href: 'schedule.html' },
  { id: 'exams', label: 'ตารางสอบ', href: 'exams.html' },
  { id: 'activities', label: 'กิจกรรม/ข่าวสาร', href: 'activities.html' },
];

function rtSiteName(cfg) {
  return (cfg && cfg.siteName) || 'สาขาวิชารังสีเทคนิค';
}

function rtToggleNav() {
  document.getElementById('rt-mobile-nav').classList.toggle('hidden');
}

/* ── โหมดมืด/สว่าง ── */
function rtApplyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  const btn = document.getElementById('rt-theme-btn');
  if (btn) btn.innerHTML = theme === 'dark'
    ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path stroke-linecap="round" d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
}
function rtToggleTheme() {
  const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  try { localStorage.setItem('rt-theme', next); } catch (e) {}
  rtApplyTheme(next);
}

function rtRenderHeader(active) {
  window.__rtActive = active;
  const navLink = (n, mobile) => {
    const base = mobile
      ? `py-2.5 rounded-lg px-3 font-medium ${n.id === active ? 'bg-white/10 text-gold-400' : 'text-white/85'}`
      : `rt-navlink px-3.5 py-2.5 text-[15px] font-medium border-b-2 -mb-px transition ${n.id === active ? 'border-gold-500 rt-navy-text rt-navlink-active' : 'border-transparent rt-muted-text'}`;
    return `<a href="${n.href}" class="${base}">${n.label}</a>`;
  };

  document.getElementById('rt-header').innerHTML = `
    <header class="sticky top-0 z-40">
      <div id="rt-announce-wrap" class="bg-gold-500 text-[#171303] text-sm overflow-hidden hidden">
        <div class="rt-marquee whitespace-nowrap py-1.5 px-4 font-medium" id="rt-announce-text"></div>
      </div>
      <div class="bg-[var(--rt-navy-deep)] text-white">
        <div class="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <a href="index.html" class="flex items-center gap-3 min-w-0 group">
            <span class="w-11 h-11 rounded-lg bg-gold-500 text-[#171303] flex items-center justify-center rt-serif font-bold text-lg shrink-0 group-hover:scale-105 transition">RT</span>
            <span class="min-w-0">
              <span class="block rt-serif font-semibold text-base sm:text-xl leading-tight truncate">${rtSiteName(window.__rtCfg)}</span>
              <span class="block text-[11px] sm:text-[13px] text-white/60 truncate">วิทยาลัยพระบรมราชชนก (วทก.)</span>
            </span>
          </a>
          <div class="flex items-center gap-2 shrink-0">
            <a href="search.html" class="hidden sm:inline-flex items-center gap-2 text-sm border border-white/25 hover:border-gold-400 hover:text-gold-400 rounded-lg px-3 py-1.5 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="m20 20-3.2-3.2"/></svg>
              ค้นหา
            </a>
            <button id="rt-theme-btn" onclick="rtToggleTheme()" title="สลับโหมดมืด/สว่าง"
                    class="p-2 rounded-lg border border-white/25 hover:border-gold-400 hover:text-gold-400 transition"></button>
            <button onclick="rtToggleNav()" class="lg:hidden p-2 rounded-lg border border-white/25 hover:border-gold-400 transition" aria-label="เปิดเมนู">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="rt-card-plain border-x-0 shadow-sm !rounded-none">
        <nav class="max-w-6xl mx-auto px-4 flex items-center justify-between gap-2 overflow-x-auto">
          <div class="flex">${RT_NAV.map(n => navLink(n, false)).join('')}</div>
          <span class="hidden md:flex items-center gap-2 text-xs rt-muted-text whitespace-nowrap py-2.5">
            <span id="rt-status-dot" class="rt-dot rt-dot-off"></span>
            <span id="rt-status-text">กำลังเชื่อมต่อข้อมูล…</span>
          </span>
        </nav>
      </div>
      <div id="rt-mobile-nav" class="lg:hidden hidden bg-[var(--rt-navy-deep)] border-t border-white/10">
        <nav class="flex flex-col px-4 py-2">${RT_NAV.map(n => navLink(n, true)).join('')}
          <a href="search.html" class="py-2.5 rounded-lg px-3 font-medium text-white/85">🔍 ค้นหาทั้งหมด</a>
        </nav>
      </div>
    </header>`;
  rtApplyTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

function rtRenderFooter() {
  const y = new Date().getFullYear() + 543;
  document.getElementById('rt-footer').innerHTML = `
    <footer class="bg-[var(--rt-navy-deep)] text-white/80 mt-16">
      <div class="h-1 bg-gradient-to-r from-gold-500 via-[#e7cf7a] to-gold-500"></div>
      <div class="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div class="flex items-center gap-2.5 mb-3">
            <span class="w-9 h-9 rounded-lg bg-gold-500 text-[#171303] flex items-center justify-center rt-serif font-bold">RT</span>
            <span class="rt-serif font-semibold text-white text-base">${rtSiteName(window.__rtCfg)}</span>
          </div>
          <p class="leading-relaxed text-white/60">ศูนย์รวมตารางสอน ตารางสอบ และข่าวสารกิจกรรมของนักศึกษาสาขาวิชารังสีเทคนิค — ข้อมูลอัปเดตจาก Google Sheets ของสาขาโดยตรง</p>
        </div>
        <div>
          <p class="rt-serif font-semibold text-white mb-3">เมนูลัด</p>
          <ul class="space-y-1.5">
            ${RT_NAV.map(n => `<li><a href="${n.href}" class="hover:text-gold-400 transition">${n.label}</a></li>`).join('')}
            <li><a href="search.html" class="hover:text-gold-400 transition">ค้นหาทั้งหมด</a></li>
          </ul>
        </div>
        <div>
          <p class="rt-serif font-semibold text-white mb-3">ติดต่อ</p>
          <p id="rt-contact" class="text-white/60">-</p>
          <p class="mt-3 flex gap-4">
            <a id="rt-link-line" href="#" class="underline decoration-gold-500/60 hover:text-gold-400 transition hidden">กลุ่มไลน์สาขา</a>
            <a id="rt-link-fb" href="#" class="underline decoration-gold-500/60 hover:text-gold-400 transition hidden">Facebook</a>
          </p>
        </div>
      </div>
      <div class="border-t border-white/10 py-3.5 text-center text-xs text-white/50">
        © ${y} ${rtSiteName(window.__rtCfg)} · อัปเดตล่าสุด: <span id="rt-updated">-</span>
      </div>
    </footer>
    <button id="rt-top-btn" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="กลับขึ้นด้านบน">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" d="m6 14 6-6 6 6"/></svg>
    </button>`;
}

/* อัปเดตส่วนที่เปลี่ยนได้หลังดึงข้อมูล */
function rtUpdateChrome(d, state) {
  window.__rtCfg = d.config;
  const wrap = document.getElementById('rt-announce-wrap');
  const text = document.getElementById('rt-announce-text');
  if (wrap && text) {
    if (d.config.announcement) {
      text.textContent = '🔔 ' + d.config.announcement;
      wrap.classList.remove('hidden');
    } else {
      wrap.classList.add('hidden');
    }
  }
  const contact = document.getElementById('rt-contact');
  if (contact) contact.textContent = d.config.contactName || '-';
  const set = (id, url) => {
    const el = document.getElementById(id);
    if (el) { if (url) { el.href = url; el.classList.remove('hidden'); } else el.classList.add('hidden'); }
  };
  set('rt-link-line', d.config.lineUrl);
  set('rt-link-fb', d.config.facebookUrl);

  const dot = document.getElementById('rt-status-dot');
  const st = document.getElementById('rt-status-text');
  if (dot && st) {
    if (state === 'live') {
      dot.className = 'rt-dot rt-dot-live';
      st.textContent = 'เชื่อมต่อชีตสาขาแล้ว';
    } else if (state === 'offline') {
      dot.className = 'rt-dot rt-dot-off';
      st.textContent = 'ออฟไลน์ — แสดงข้อมูลล่าสุดที่โหลดได้';
    } else {
      dot.className = 'rt-dot rt-dot-off';
      st.textContent = 'ยังไม่ได้เชื่อมต่อแหล่งข้อมูล';
    }
  }
  const up = document.getElementById('rt-updated');
  if (up) {
    up.textContent = rtThaiDate(d.updated.slice(0, 10)) + ' ' + new Date(d.updated).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
  }
}

/* ── Lightbox ดูรูปตารางสอบเต็มจอ + ซูม ── */
let rtLbScale = 1;

function rtEnsureLightbox() {
  if (document.getElementById('rt-lightbox')) return;
  const el = document.createElement('div');
  el.id = 'rt-lightbox';
  el.innerHTML = `
    <div class="flex items-center justify-between px-4 py-3 text-white">
      <p id="rt-lb-title" class="rt-serif font-semibold truncate"></p>
      <div class="flex items-center gap-2 shrink-0">
        <button onclick="rtLbZoom(-0.25)" class="w-9 h-9 rounded-lg border border-white/30 hover:border-gold-400 text-xl leading-none" title="ซูมออก">−</button>
        <button onclick="rtLbZoom(0.25)" class="w-9 h-9 rounded-lg border border-white/30 hover:border-gold-400 text-xl leading-none" title="ซูมเข้า">+</button>
        <button onclick="rtLbReset()" class="w-9 h-9 rounded-lg border border-white/30 hover:border-gold-400 text-sm" title="ขนาดปกติ">1:1</button>
        <button onclick="rtCloseLightbox()" class="w-9 h-9 rounded-lg border border-white/30 hover:border-red-400" title="ปิด">✕</button>
      </div>
    </div>
    <img id="rt-lb-img" alt="รูปตารางสอบ">`;
  el.addEventListener('click', e => { if (e.target === el) rtCloseLightbox(); });
  document.body.appendChild(el);
  document.addEventListener('keydown', e => {
    if (!document.getElementById('rt-lightbox').classList.contains('rt-open')) return;
    if (e.key === 'Escape') rtCloseLightbox();
    if (e.key === '+') rtLbZoom(0.25);
    if (e.key === '-') rtLbZoom(-0.25);
  });
}

function rtOpenLightbox(src, title) {
  rtEnsureLightbox();
  const lb = document.getElementById('rt-lightbox');
  document.getElementById('rt-lb-img').src = src;
  document.getElementById('rt-lb-title').textContent = title || '';
  rtLbScale = 1;
  rtLbReset();
  lb.classList.add('rt-open');
  document.body.style.overflow = 'hidden';
}
function rtCloseLightbox() {
  document.getElementById('rt-lightbox').classList.remove('rt-open');
  document.body.style.overflow = '';
}
function rtLbZoom(delta) {
  rtLbScale = Math.min(4, Math.max(1, rtLbScale + delta));
  document.getElementById('rt-lb-img').style.transform = `scale(${rtLbScale})`;
}
function rtLbReset() {
  rtLbScale = 1;
  document.getElementById('rt-lb-img').style.transform = 'scale(1)';
}

/* ── วงจรดึงข้อมูลร่วม (ทุกหน้าใช้) ── */
(async function rtBoot() {
  if (document.readyState === 'loading') {
    await new Promise(r => document.addEventListener('DOMContentLoaded', r));
  }
  const pull = async () => {
    const d = await RTData.load();
    rtUpdateChrome(d, RTData.state());
    document.dispatchEvent(new CustomEvent('rt:updated', { detail: d }));
  };
  await pull();
  setInterval(pull, (RT_CONFIG.POLL_SECONDS || 60) * 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) pull(); });

  window.addEventListener('scroll', () => {
    document.getElementById('rt-top-btn')?.classList.toggle('rt-show', window.scrollY > 400);
  }, { passive: true });
})();
