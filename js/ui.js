/* ─────────────────────────────────────────────
 * ส่วนแสดงผลร่วม: Header, Footer, แถบประกาศ
 * เรียกใช้: rtRenderHeader('home'); rtRenderFooter();
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

function rtRenderHeader(active) {
  window.__rtActive = active;
  const deskLinks = RT_NAV.map(n =>
    `<a href="${n.href}" class="px-4 py-2 rounded text-sm font-medium transition ${n.id === active ? 'bg-navy-700 text-gold-400' : 'text-navy-100 hover:bg-navy-800'}">${n.label}</a>`
  ).join('');

  document.getElementById('rt-header').innerHTML = `
    <header class="sticky top-0 z-40 shadow-md">
      <div id="rt-announce-wrap" class="bg-gold-500 text-navy-900 text-sm overflow-hidden hidden">
        <div class="rt-marquee whitespace-nowrap py-1.5 px-4 font-medium" id="rt-announce-text"></div>
      </div>
      <div class="bg-navy-900 text-white">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <a href="index.html" class="flex items-center gap-3 min-w-0">
            <span class="w-11 h-11 rounded-full bg-gold-500 text-navy-900 flex items-center justify-center font-bold text-lg shrink-0">RT</span>
            <span class="min-w-0">
              <span class="block font-semibold text-base sm:text-xl leading-tight truncate">${rtSiteName(window.__rtCfg)}</span>
              <span class="block text-[11px] sm:text-sm text-navy-100/80 truncate">วิทยาลัยพระบรมราชชนก (วทก.)</span>
            </span>
          </a>
          <button onclick="rtToggleNav()" class="lg:hidden p-2 rounded hover:bg-navy-700" aria-label="เปิดเมนู">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <nav class="hidden lg:flex items-center gap-1">${deskLinks}</nav>
        </div>
      </div>
      <div id="rt-mobile-nav" class="lg:hidden hidden bg-navy-800 border-t border-navy-700">
        <nav class="flex flex-col px-4 py-2">
          ${RT_NAV.map(n => `<a href="${n.href}" class="py-2.5 rounded px-3 font-medium ${n.id === active ? 'bg-navy-700 text-gold-400' : 'text-navy-100'}">${n.label}</a>`).join('')}
        </nav>
      </div>
    </header>`;
}

function rtRenderFooter() {
  const y = new Date().getFullYear() + 543;
  document.getElementById('rt-footer').innerHTML = `
    <footer class="bg-navy-900 text-navy-100 mt-16">
      <div class="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="w-8 h-8 rounded-full bg-gold-500 text-navy-900 flex items-center justify-center font-bold text-sm">RT</span>
            <span class="font-semibold text-white">${rtSiteName(window.__rtCfg)}</span>
          </div>
          <p class="text-navy-200/80 leading-relaxed">ศูนย์รวมตารางสอน ตารางสอบ และข่าวสารกิจกรรมของนักศึกษาสาขาวิชารังสีเทคนิค</p>
        </div>
        <div>
          <p class="font-semibold text-white mb-2">เมนูลัด</p>
          <ul class="space-y-1">
            ${RT_NAV.map(n => `<li><a href="${n.href}" class="hover:text-gold-400">${n.label}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <p class="font-semibold text-white mb-2">ติดต่อ</p>
          <p id="rt-contact" class="text-navy-200/80">-</p>
          <p class="mt-2 flex gap-3">
            <a id="rt-link-line" href="#" class="underline hover:text-gold-400 hidden">กลุ่มไลน์สาขา</a>
            <a id="rt-link-fb" href="#" class="underline hover:text-gold-400 hidden">Facebook</a>
          </p>
        </div>
      </div>
      <div class="border-t border-navy-800 py-3 text-center text-xs text-navy-200/70">
        © ${y} ${rtSiteName(window.__rtCfg)} — อัปเดตข้อมูลล่าสุด: <span id="rt-updated">-</span><span id="rt-live-badge" class="ml-2 text-gold-400 hidden">(โหมดข้อมูลตัวอย่าง)</span>
      </div>
    </footer>`;
}

/* อัปเดตส่วนที่เปลี่ยนได้ (ประกาศ/ติดต่อ/เวลาอัปเดต) หลังดึงข้อมูล */
function rtUpdateChrome(d, live) {
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
  const up = document.getElementById('rt-updated');
  if (up) up.textContent = rtThaiDate(d.updated.slice(0, 10)) + ' ' + new Date(d.updated).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
  const badge = document.getElementById('rt-live-badge');
  if (badge) badge.classList.toggle('hidden', !!live);
}

/* ── วงจรดึงข้อมูลร่วม (ทุกหน้าใช้) ── */
(async function rtBoot() {
  if (document.readyState === 'loading') {
    await new Promise(r => document.addEventListener('DOMContentLoaded', r));
  }
  const pull = async () => {
    const d = await RTData.load();
    rtUpdateChrome(d, RTData.isLive());
    document.dispatchEvent(new CustomEvent('rt:updated', { detail: d }));
  };
  await pull();
  setInterval(pull, (RT_CONFIG.POLL_SECONDS || 60) * 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) pull(); });
})();
