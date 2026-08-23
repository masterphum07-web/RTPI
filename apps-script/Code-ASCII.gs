

const ADMIN_PASS = '12345';

const UPLOAD_FOLDER = 'RTPI-Uploads';

const RT_SHEET_DEFS = [
  {
    name: 'Schedule',
    color: '#1d4076',
    headers: [
      { th: '\u0e1b\u0e35\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32', key: 'year' },
      { th: '\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19', key: 'term', list: ['\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48 1', '\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48 2', '\u0e20\u0e32\u0e04\u0e24\u0e14\u0e39\u0e23\u0e49\u0e2d\u0e19'] },
      { th: '\u0e01\u0e25\u0e38\u0e48\u0e21\u0e40\u0e23\u0e35\u0e22\u0e19', key: 'group' },
      { th: '\u0e27\u0e31\u0e19', key: 'day', list: ['\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c', '\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23', '\u0e1e\u0e38\u0e18', '\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35', '\u0e28\u0e38\u0e01\u0e23\u0e4c', '\u0e40\u0e2a\u0e32\u0e23\u0e4c', '\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c'] },
      { th: '\u0e40\u0e27\u0e25\u0e32\u0e40\u0e23\u0e34\u0e48\u0e21', key: 'timeStart' },
      { th: '\u0e40\u0e27\u0e25\u0e32\u0e2a\u0e34\u0e49\u0e19\u0e2a\u0e38\u0e14', key: 'timeEnd' },
      { th: '\u0e23\u0e2b\u0e31\u0e2a\u0e27\u0e34\u0e0a\u0e32', key: 'code' },
      { th: '\u0e23\u0e32\u0e22\u0e27\u0e34\u0e0a\u0e32', key: 'subject' },
      { th: '\u0e2b\u0e49\u0e2d\u0e07', key: 'room' },
      { th: '\u0e2d\u0e32\u0e08\u0e32\u0e23\u0e22\u0e4c', key: 'teacher' },
      { th: '\u0e0a\u0e31\u0e49\u0e19\u0e1b\u0e35', key: 'level', list: ['\u0e1b\u0e35 1', '\u0e1b\u0e35 2', '\u0e1b\u0e35 3', '\u0e1b\u0e35 4'] },
    ],
    samples: [
      ['2569', '\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48 1', 'R1/1', '\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c', '08:30', '10:30', '401101', '\u0e01\u0e32\u0e22\u0e27\u0e34\u0e20\u0e32\u0e04\u0e28\u0e32\u0e2a\u0e15\u0e23\u0e4c\u0e41\u0e25\u0e30\u0e2a\u0e23\u0e35\u0e23\u0e27\u0e34\u0e17\u0e22\u0e32', '\u0e2b\u0e49\u0e2d\u0e07\u0e1a\u0e23\u0e23\u0e22\u0e32\u0e22 201', '\u0e2d\u0e32\u0e08\u0e32\u0e23\u0e22\u0e4c\u0e2a\u0e21\u0e0a\u0e32\u0e22 \u0e43\u0e08\u0e14\u0e35', '\u0e1b\u0e35 1'],
    ],
  },
  {
    name: 'Exams',
    color: '#a9861d',
    headers: [
      { th: '\u0e1b\u0e35\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32', key: 'year' },
      { th: '\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19', key: 'term', list: ['\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48 1', '\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48 2', '\u0e20\u0e32\u0e04\u0e24\u0e14\u0e39\u0e23\u0e49\u0e2d\u0e19'] },
      { th: '\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e01\u0e32\u0e23\u0e2a\u0e2d\u0e1a', key: 'type', list: ['\u0e01\u0e25\u0e32\u0e07\u0e20\u0e32\u0e04', '\u0e1b\u0e25\u0e32\u0e22\u0e20\u0e32\u0e04', '\u0e2a\u0e2d\u0e1a\u0e40\u0e01\u0e47\u0e1a', '\u0e2d\u0e37\u0e48\u0e19 \u0e46'] },
      { th: '\u0e23\u0e2b\u0e31\u0e2a\u0e27\u0e34\u0e0a\u0e32', key: 'code' },
      { th: '\u0e23\u0e32\u0e22\u0e27\u0e34\u0e0a\u0e32', key: 'subject' },
      { th: '\u0e01\u0e25\u0e38\u0e48\u0e21\u0e2a\u0e2d\u0e1a', key: 'group' },
      { th: '\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e2a\u0e2d\u0e1a', key: 'date', isDate: true },
      { th: '\u0e40\u0e27\u0e25\u0e32', key: 'time' },
      { th: '\u0e2b\u0e49\u0e2d\u0e07\u0e2a\u0e2d\u0e1a', key: 'room' },
      { th: '\u0e2b\u0e21\u0e32\u0e22\u0e40\u0e2b\u0e15\u0e38', key: 'note' },
      { th: '\u0e0a\u0e31\u0e49\u0e19\u0e1b\u0e35', key: 'level', list: ['\u0e1b\u0e35 1', '\u0e1b\u0e35 2', '\u0e1b\u0e35 3', '\u0e1b\u0e35 4'] },
    ],
    samples: [
      ['2569', '\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48 1', '\u0e01\u0e25\u0e32\u0e07\u0e20\u0e32\u0e04', '401101', '\u0e01\u0e32\u0e22\u0e27\u0e34\u0e20\u0e32\u0e04\u0e28\u0e32\u0e2a\u0e15\u0e23\u0e4c\u0e41\u0e25\u0e30\u0e2a\u0e23\u0e35\u0e23\u0e27\u0e34\u0e17\u0e22\u0e32', 'R1/1', new Date(2026, 8, 21), '09:00-12:00', '\u0e2b\u0e49\u0e2d\u0e07\u0e2a\u0e2d\u0e1a A', '', '\u0e1b\u0e35 1'],
    ],
  },
  {
    name: 'Images',
    color: '#8a6d14',
    headers: [
      { th: '\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48', key: 'category', list: ['\u0e15\u0e32\u0e23\u0e32\u0e07\u0e2a\u0e2d\u0e19', '\u0e15\u0e32\u0e23\u0e32\u0e07\u0e2a\u0e2d\u0e1a', '\u0e2d\u0e37\u0e48\u0e19 \u0e46'] },
      { th: '\u0e1b\u0e35\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32', key: 'year' },
      { th: '\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19', key: 'term', list: ['\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48 1', '\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48 2', '\u0e20\u0e32\u0e04\u0e24\u0e14\u0e39\u0e23\u0e49\u0e2d\u0e19'] },
      { th: '\u0e0a\u0e37\u0e48\u0e2d\u0e23\u0e39\u0e1b/\u0e04\u0e33\u0e2d\u0e18\u0e34\u0e1a\u0e32\u0e22', key: 'title' },
      { th: '\u0e25\u0e34\u0e07\u0e01\u0e4c\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e', key: 'image' },
      { th: '\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48', key: 'date', isDate: true },
      { th: '\u0e1c\u0e39\u0e49\u0e2d\u0e31\u0e1e\u0e42\u0e2b\u0e25\u0e14', key: 'author' },
    ],
    samples: [],
  },
  {
    name: 'Posts',
    color: '#254b85',
    headers: [
      { th: '\u0e23\u0e2b\u0e31\u0e2a\u0e42\u0e1e\u0e2a\u0e15\u0e4c', key: 'id' },
      { th: '\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d', key: 'title' },
      { th: '\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48', key: 'category', list: ['\u0e1b\u0e23\u0e30\u0e01\u0e32\u0e28\u0e17\u0e31\u0e48\u0e27\u0e44\u0e1b', '\u0e01\u0e34\u0e08\u0e01\u0e23\u0e23\u0e21', '\u0e17\u0e38\u0e19\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32', '\u0e1d\u0e36\u0e01\u0e07\u0e32\u0e19/\u0e2a\u0e21\u0e31\u0e04\u0e23\u0e07\u0e32\u0e19', '\u0e2d\u0e37\u0e48\u0e19 \u0e46'] },
      { th: '\u0e40\u0e19\u0e37\u0e49\u0e2d\u0e2b\u0e32', key: 'body' },
      { th: '\u0e25\u0e34\u0e07\u0e01\u0e4c\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e', key: 'image' },
      { th: '\u0e25\u0e34\u0e07\u0e01\u0e4c\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e40\u0e15\u0e34\u0e21', key: 'link' },
      { th: '\u0e1c\u0e39\u0e49\u0e42\u0e1e\u0e2a\u0e15\u0e4c', key: 'author' },
      { th: '\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e42\u0e1e\u0e2a\u0e15\u0e4c', key: 'date', isDate: true },
      { th: '\u0e1b\u0e31\u0e01\u0e2b\u0e21\u0e38\u0e14', key: 'pinned', list: ['TRUE', 'FALSE'] },
    ],
    samples: [
      ['P001', '\u0e22\u0e34\u0e19\u0e14\u0e35\u0e15\u0e49\u0e2d\u0e19\u0e23\u0e31\u0e1a\u0e19\u0e31\u0e01\u0e28\u0e36\u0e01\u0e29\u0e32\u0e43\u0e2b\u0e21\u0e48', '\u0e1b\u0e23\u0e30\u0e01\u0e32\u0e28\u0e17\u0e31\u0e48\u0e27\u0e44\u0e1b', '\u0e15\u0e34\u0e14\u0e15\u0e32\u0e21\u0e1b\u0e23\u0e30\u0e01\u0e32\u0e28\u0e1c\u0e48\u0e32\u0e19\u0e40\u0e27\u0e47\u0e1a\u0e44\u0e0b\u0e15\u0e4c\u0e19\u0e35\u0e49\u0e44\u0e14\u0e49\u0e40\u0e25\u0e22', '', '', '\u0e1d\u0e48\u0e32\u0e22\u0e27\u0e34\u0e0a\u0e32\u0e01\u0e32\u0e23', new Date(2026, 7, 10), 'FALSE'],
    ],
  },
  {
    name: 'Config',
    color: '#0f2447',
    headers: [
      { th: '\u0e04\u0e35\u0e22\u0e4c', key: 'key' },
      { th: '\u0e04\u0e48\u0e32', key: 'value' },
    ],
    samples: [
      ['siteName', '\u0e2a\u0e32\u0e02\u0e32\u0e27\u0e34\u0e0a\u0e32\u0e23\u0e31\u0e07\u0e2a\u0e35\u0e40\u0e17\u0e04\u0e19\u0e34\u0e04'],
      ['siteFullName', '\u0e2a\u0e32\u0e02\u0e32\u0e27\u0e34\u0e0a\u0e32\u0e40\u0e17\u0e04\u0e19\u0e34\u0e04\u0e01\u0e32\u0e23\u0e41\u0e1e\u0e17\u0e22\u0e4c\u0e23\u0e31\u0e07\u0e2a\u0e35 \u0e27\u0e34\u0e17\u0e22\u0e32\u0e25\u0e31\u0e22\u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35\u0e17\u0e32\u0e07\u0e01\u0e32\u0e23\u0e41\u0e1e\u0e17\u0e22\u0e4c\u0e41\u0e25\u0e30\u0e2a\u0e32\u0e18\u0e32\u0e23\u0e13\u0e2a\u0e38\u0e02 \u0e01\u0e32\u0e0d\u0e08\u0e19\u0e32\u0e20\u0e34\u0e40\u0e29\u0e01 (\u0e27\u0e17\u0e01.)'],
      ['currentYear', '2569'],
      ['currentTerm', '\u0e20\u0e32\u0e04\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48 1'],
      ['announcement', ''],
      ['lineUrl', ''],
      ['facebookUrl', ''],
      ['contactName', '\u0e1d\u0e48\u0e32\u0e22\u0e27\u0e34\u0e0a\u0e32\u0e01\u0e32\u0e23 \u0e2a\u0e20\u0e32\u0e19\u0e31\u0e01\u0e28\u0e36\u0e01\u0e29\u0e32'],
    ],
  },
];

const RT_CACHE_SEC = 60;

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
      .createMenu('\u2699\ufe0f RTPI')
      .addItem('\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e0a\u0e35\u0e15 (\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e41\u0e17\u0e47\u0e1a/\u0e2b\u0e31\u0e27\u0e15\u0e32\u0e23\u0e32\u0e07)', 'setupSheets')
      .addItem('\u0e25\u0e49\u0e32\u0e07 cache \u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e27\u0e47\u0e1a', 'clearCache')
      .addToUi();
  } catch (e) {  }

  Logger.log('\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e0a\u0e35\u0e15\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22');
}

function migrateExamImages_(ss) {
  const old = ss.getSheetByName('ExamImages');
  const existing = ss.getSheetByName('Images');
  if (!old || existing) return;

  let carried = [];
  if (old.getLastRow() > 1) {
    const vals = old.getRange(2, 1, old.getLastRow() - 1, old.getLastColumn()).getValues();
    carried = vals
      .filter(function (r) { return String(r[4] || '').indexOf('http') === 0 && String(r[4]).indexOf('\u0e43\u0e2a\u0e48\u0e44\u0e2d\u0e14\u0e35') === -1; })
      .map(function (r) {
        return ['\u0e15\u0e32\u0e23\u0e32\u0e07\u0e2a\u0e2d\u0e1a', String(r[0] || ''), String(r[1] || ''), String(r[3] || ''), String(r[4]),
                r[5] instanceof Date ? r[5] : new Date(), '\u0e23\u0e30\u0e1a\u0e1a\u0e40\u0e14\u0e34\u0e21'];
      });
  }
  ss.deleteSheet(old);
  if (carried.length) {
    let sheet = ss.getSheetByName('Images');
    if (!sheet) sheet = ss.insertSheet('Images');
    sheet.getRange(2, 1, carried.length, 7).setValues(carried);
  }
}

function migrateConfig_(ss) {
  const sheet = ss.getSheetByName('Config');
  if (!sheet || sheet.getLastRow() < 2) return;
  const vals = sheet.getDataRange().getValues();
  const correct = '\u0e2a\u0e32\u0e02\u0e32\u0e27\u0e34\u0e0a\u0e32\u0e40\u0e17\u0e04\u0e19\u0e34\u0e04\u0e01\u0e32\u0e23\u0e41\u0e1e\u0e17\u0e22\u0e4c\u0e23\u0e31\u0e07\u0e2a\u0e35 \u0e27\u0e34\u0e17\u0e22\u0e32\u0e25\u0e31\u0e22\u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35\u0e17\u0e32\u0e07\u0e01\u0e32\u0e23\u0e41\u0e1e\u0e17\u0e22\u0e4c\u0e41\u0e25\u0e30\u0e2a\u0e32\u0e18\u0e32\u0e23\u0e13\u0e2a\u0e38\u0e02 \u0e01\u0e32\u0e0d\u0e08\u0e19\u0e32\u0e20\u0e34\u0e40\u0e29\u0e01 (\u0e27\u0e17\u0e01.)';
  for (let i = 1; i < vals.length; i++) {
    if (vals[i][0] === 'siteFullName' && String(vals[i][1] || '').indexOf('\u0e1e\u0e23\u0e30\u0e1a\u0e23\u0e21\u0e23\u0e32\u0e0a\u0e0a\u0e19\u0e01') !== -1) {
      sheet.getRange(i + 1, 2).setValue(correct);
    }
  }
}

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

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse(e.postData.contents || '{}');
  } catch (err) {
    return jsonOut({ ok: false, error: '\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a\u0e04\u0e33\u0e02\u0e2d\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07' });
  }

  if (String(body.password || '') !== ADMIN_PASS) {
    return jsonOut({ ok: false, error: '\u0e23\u0e2b\u0e31\u0e2a\u0e1c\u0e48\u0e32\u0e19\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07' });
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
        }
        const url = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1600';

        const sheet = ss.getSheetByName('Images');
        if (!sheet) return jsonOut({ ok: false, error: '\u0e44\u0e21\u0e48\u0e1e\u0e1a\u0e41\u0e17\u0e47\u0e1a Images \u2014 \u0e23\u0e31\u0e19 setupSheets \u0e01\u0e48\u0e2d\u0e19' });
        sheet.appendRow([
          String(body.category || '\u0e2d\u0e37\u0e48\u0e19 \u0e46'),
          String(body.year || ''),
          String(body.term || ''),
          String(body.title || ''),
          url,
          new Date(),
          String(body.author || '\u0e41\u0e2d\u0e14\u0e21\u0e34\u0e19'),
          String(body.level || ''),
        ]);
        return jsonOut({ ok: true, url: url, fileId: file.getId(), shareWarning: '\u0e44\u0e1f\u0e25\u0e4c\u0e2d\u0e31\u0e1b\u0e42\u0e2bลดแล้ว แต่ตั้งค่าลิงก์สาธารณะไม่สำเร็จ' });
      }

      case 'deleteImage': {
        const url = String(body.url || '');
        if (!url) return jsonOut({ ok: false, error: '\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49\u0e23\u0e30\u0e1a\u0e38\u0e23\u0e39\u0e1b' });
        const sheet = ss.getSheetByName('Images');
        if (!sheet || sheet.getLastRow() < 2) return jsonOut({ ok: false, error: '\u0e44\u0e21\u0e48\u0e1e\u0e1a\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e23\u0e39\u0e1b' });
        const vals = sheet.getDataRange().getValues();
        let removed = false;
        for (let i = vals.length - 1; i >= 1; i--) {
          if (String(vals[i][4] || '') === url) {
            sheet.deleteRow(i + 1);
            removed = true;
          }
        }
        const m = url.match(/[?&]id=([\w-]{15,})/);
        if (m) { try { DriveApp.getFileById(m[1]).setTrashed(true); } catch (dErr) {} }
        return jsonOut({ ok: removed, error: removed ? '' : '\u0e44\u0e21\u0e48\u0e1e\u0e1a\u0e23\u0e39\u0e1b\u0e19\u0e35\u0e49\u0e43\u0e19\u0e0a\u0e35\u0e15' });
      }

      case 'addRows': {
        const target = defName(String(body.sheet || '').toLowerCase());
        const def = RT_SHEET_DEFS.filter(function (d) { return d.name === target; })[0];
        if (!def || target === 'Config' || target === 'Images') {
          return jsonOut({ ok: false, error: '\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07 (\u0e43\u0e0a\u0e49 Schedule / Exams / Posts)' });
        }
        const rows = body.rows;
        if (!Array.isArray(rows) || !rows.length) return jsonOut({ ok: false, error: '\u0e44\u0e21\u0e48\u0e21\u0e35\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e41\u0e16\u0e27' });
        const sheet = ss.getSheetByName(def.name);
        if (!sheet) return jsonOut({ ok: false, error: '\u0e44\u0e21\u0e48\u0e1e\u0e1a\u0e41\u0e17\u0e47\u0e1a ' + def.name });
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
        return jsonOut({ ok: false, error: '\u0e44\u0e21\u0e48\u0e23\u0e39\u0e49\u0e08\u0e31\u0e01 action: ' + body.action });
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

function clearCache() {
  CacheService.getScriptCache().removeAll(['rtpi_all', 'rtpi_schedule', 'rtpi_exams', 'rtpi_posts', 'rtpi_images', 'rtpi_config']);
  Logger.log('\u0e25\u0e49\u0e32\u0e07 cache \u0e41\u0e25\u0e49\u0e27');
}

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('\u2699\ufe0f RTPI')
      .addItem('\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e0a\u0e35\u0e15 (\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e41\u0e17\u0e47\u0e1a/\u0e2b\u0e31\u0e27\u0e15\u0e32\u0e23\u0e32\u0e07)', 'setupSheets')
      .addItem('\u0e25\u0e49\u0e32\u0e07 cache \u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e27\u0e47\u0e1a', 'clearCache')
      .addToUi();
  } catch (e) {}
}
