/* =====================================================================
   今天的複習：共用的排程（間隔練習＋交錯練習）
   - 首頁和 review/ 都會載入這個檔，進度存在這台裝置的瀏覽器（localStorage）。
   - 卡片分在 1～6 號盒子：答對就往後一盒、隔更久再出現；答錯回到 1 號盒、明天再來。
   - 每天先複習到期的卡，再補新卡；各科交錯排，不會同一科連在一起。
   說明文件：docs/learning-design.md
   ===================================================================== */
(function (root) {
  'use strict';
  var KEY = 'studyReviewV1';
  // 盒子 → 隔幾天再出現（0 號是還沒學過）
  var INTERVAL = [0, 1, 2, 4, 7, 14, 30];
  var MASTER_BOX = 4; // 4 號盒以上（隔 7 天以上）算「記牢了」
  var DEFAULTS = { newPerDay: 8, cap: 20, off: {} };
  // 單元開關：一般單元預設打開（關掉的記在 off）；還沒教的單元（bank 裡標 later）預設關掉（打開的記在 on）

  function dayNum(d) { d = d || new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  function blank() { return { v: 1, cards: {}, days: {}, set: { newPerDay: DEFAULTS.newPerDay, cap: DEFAULTS.cap, off: {}, on: {} } }; }
  function load() {
    var st = null;
    try { st = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
    if (!st || typeof st !== 'object' || st.v !== 1) st = blank();
    if (!st.cards || typeof st.cards !== 'object') st.cards = {};
    if (!st.days || typeof st.days !== 'object') st.days = {};
    if (!st.set || typeof st.set !== 'object') st.set = {};
    if ([3, 5, 8, 12].indexOf(st.set.newPerDay) < 0) st.set.newPerDay = DEFAULTS.newPerDay;
    if ([10, 15, 20, 30].indexOf(st.set.cap) < 0) st.set.cap = DEFAULTS.cap;
    if (!st.set.off || typeof st.set.off !== 'object') st.set.off = {};
    if (!st.set.on || typeof st.set.on !== 'object') st.set.on = {};
    // 題庫換過 id 的卡（bank.js 的 renamed：舊 id → 新 id）：把舊紀錄接到新 id；新 id 已經有紀錄就留新的。
    var ren = root.REVIEW_BANK && root.REVIEW_BANK.renamed, k;
    if (ren) for (k in ren) if (st.cards[k] && ren[k] !== k) { if (!st.cards[ren[k]]) st.cards[ren[k]] = st.cards[k]; delete st.cards[k]; }
    return st;
  }
  function save(st) { try { localStorage.setItem(KEY, JSON.stringify(st)); return true; } catch (e) { return false; } }
  function dayRec(st, d) { var r = st.days[d]; if (!r) r = st.days[d] = { n: 0, ok: 0, nw: 0, fin: false }; return r; }

  function unitOn(st, k, later) { return later ? !!st.set.on[k] : !st.set.off[k]; }
  function setUnit(st, k, later, on) {
    if (later) { if (on) st.set.on[k] = true; else delete st.set.on[k]; }
    else { if (on) delete st.set.off[k]; else st.set.off[k] = true; }
  }
  function inScope(st, card) { return unitOn(st, card.u, card.later); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* 交錯：各科輪流出，同一科盡量不要連在一起 */
  function interleave(list) {
    var groups = {}, order = [];
    list.forEach(function (c) { if (!groups[c.s]) { groups[c.s] = []; order.push(c.s); } groups[c.s].push(c); });
    order = shuffle(order);
    var out = [], last = null, left = list.length;
    while (left) {
      // 選剩最多、且不是上一張那一科的
      var best = null;
      order.forEach(function (s) { if (groups[s].length && s !== last && (!best || groups[s].length > groups[best].length)) best = s; });
      if (!best) best = last;
      out.push(groups[best].shift()); last = best; left--;
    }
    return out;
  }

  /* 今天的清單：先到期的舊卡（最久沒複習的先），再補新卡 */
  function plan(bank, st, d) {
    d = d === undefined ? dayNum() : d;
    var cards = bank.cards.filter(function (c) { return inScope(st, c); });
    var due = cards.filter(function (c) { var r = st.cards[c.id]; return r && r.b > 0 && r.due <= d; })
      .sort(function (a, b) { var ra = st.cards[a.id], rb = st.cards[b.id]; return (ra.due - rb.due) || (ra.b - rb.b); });
    var fresh = cards.filter(function (c) { return !st.cards[c.id]; });
    // 新卡也各科輪流（每科照課次順序）
    var bySub = {}, subs = [];
    fresh.forEach(function (c) { if (!bySub[c.s]) { bySub[c.s] = []; subs.push(c.s); } bySub[c.s].push(c); });
    var freshMix = [], more = true;
    while (more) { more = false; subs.forEach(function (s) { if (bySub[s].length) { freshMix.push(bySub[s].shift()); more = true; } }); }
    var rec = st.days[d] || { nw: 0 };
    var cap = st.set.cap, dueTake = due.slice(0, cap);
    var newAllow = Math.max(0, Math.min(st.set.newPerDay - (rec.nw || 0), cap - dueTake.length));
    var newTake = freshMix.slice(0, newAllow);
    return {
      day: d, due: due.length, dueTake: dueTake, newTake: newTake, freshLeft: freshMix.length,
      queue: interleave(dueTake.concat(newTake)), done: !!(st.days[d] && st.days[d].fin) && !dueTake.length && !newTake.length
    };
  }
  /* 額外加練：今天已完成，再多拿幾張新卡 */
  function extra(bank, st, n) {
    var fresh = bank.cards.filter(function (c) { return inScope(st, c) && !st.cards[c.id]; });
    var bySub = {}, subs = [], out = [];
    fresh.forEach(function (c) { if (!bySub[c.s]) { bySub[c.s] = []; subs.push(c.s); } bySub[c.s].push(c); });
    while (out.length < n && subs.some(function (s) { return bySub[s].length; })) subs.forEach(function (s) { if (out.length < n && bySub[s].length) out.push(bySub[s].shift()); });
    return interleave(out);
  }

  /* 記錄一次作答：res = 'ok'（答對／寫對）、'hard'（有一點錯）、'fail'（答錯／想不起來） */
  function grade(st, card, res, d) {
    d = d === undefined ? dayNum() : d;
    var r = st.cards[card.id], isNew = !r;
    if (!r) r = st.cards[card.id] = { b: 0, due: d, n: 0, ok: 0, ng: 0 };
    var day = dayRec(st, d), wasMonster = r.res === 'fail';
    if (isNew) day.nw++;
    day.n++; r.n++; r.last = d; r.res = res;
    // 各科每天的題數和答對數（給爸媽看的學習紀錄用）
    if (!day.s) day.s = {};
    var ds = day.s[card.s] || (day.s[card.s] = { n: 0, ok: 0 });
    ds.n++; if (res === 'ok') ds.ok++;
    // 小怪物：答錯（想不起來）的卡會變成小怪物，下次複習答對就打倒牠
    if (res === 'fail' && !wasMonster) day.mon = (day.mon || 0) + 1;
    if (res === 'ok' && wasMonster) { st.beat = (st.beat || 0) + 1; day.beat = (day.beat || 0) + 1; }
    // 新卡第一次就答對（上課已經學會）直接放 3 號盒，4 天後再考；之後每答對一次往後一盒
    if (res === 'ok') { r.ok++; day.ok++; r.b = isNew ? 3 : Math.min(6, r.b + 1); r.due = d + INTERVAL[r.b]; }
    else if (res === 'hard') { r.ng++; r.b = Math.max(1, isNew ? 1 : r.b); r.due = d + 1; }
    else { r.ng++; r.b = 1; r.due = d + 1; }
    save(st);
    return r;
  }
  /* 星星：只給努力，不看答對率。每天做完複習 ＋2，打倒一隻小怪物 ＋1；爸媽設定的獎勵用星星換 */
  var STAR_DAY = 2, STAR_BEAT = 1;
  function stars(st) {
    var earned = 0;
    Object.keys(st.days).forEach(function (k) { if (st.days[k].fin) earned += STAR_DAY; });
    earned += (st.beat || 0) * STAR_BEAT;
    var spent = (st.rw && st.rw.spent) || 0;
    return { earned: earned, spent: spent, left: Math.max(0, earned - spent) };
  }
  function rw(st) { if (!st.rw || typeof st.rw !== 'object') st.rw = {}; if (!Array.isArray(st.rw.items)) st.rw.items = []; if (!Array.isArray(st.rw.log)) st.rw.log = []; if (typeof st.rw.spent !== 'number') st.rw.spent = 0; return st.rw; }
  // 家長密碼只存雜湊（防小孩順手看到，不是真正的加密）
  function pinHash(pin) { var h = 5381, t = 'studyReview:' + pin; for (var i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0; return 'h' + h.toString(36); }

  /* 小怪物清單：最後一次答錯、還沒打倒的卡（due＝哪一天會出現） */
  function monsters(bank, st) {
    return bank.cards.filter(function (c) { var r = st.cards[c.id]; return r && r.res === 'fail' && inScope(st, c); });
  }
  function isMonster(st, card) { var r = st.cards[card.id]; return !!(r && r.res === 'fail'); }
  function finish(st, d) { d = d === undefined ? dayNum() : d; dayRec(st, d).fin = true; save(st); }

  /* 連續天數：中間休息一天不會斷 */
  function streak(st, d) {
    d = d === undefined ? dayNum() : d;
    var n = 0, miss = 0, x = d, first = Infinity;
    Object.keys(st.days).forEach(function (k) { if (st.days[k].fin && +k < first) first = +k; });
    if (first === Infinity) return 0;
    if (!(st.days[x] && st.days[x].fin)) x--; // 今天還沒做不算斷
    for (; x >= first; x--) {
      if (st.days[x] && st.days[x].fin) { n++; miss = 0; }
      else if (++miss >= 2) break;
    }
    return n;
  }
  function stats(bank, st) {
    var out = {};
    bank.cards.forEach(function (c) {
      var o = out[c.s] || (out[c.s] = { total: 0, seen: 0, master: 0, on: 0 });
      o.total++; if (inScope(st, c)) o.on++;
      var r = st.cards[c.id]; if (r) { o.seen++; if (r.b >= MASTER_BOX) o.master++; }
    });
    return out;
  }
  function minutes(n) { return Math.max(1, Math.round(n * 25 / 60)); }

  root.SRS = { stars: stars, rw: rw, pinHash: pinHash, STAR_DAY: STAR_DAY, STAR_BEAT: STAR_BEAT, monsters: monsters, isMonster: isMonster, KEY: KEY, INTERVAL: INTERVAL, MASTER_BOX: MASTER_BOX, dayNum: dayNum, load: load, save: save, plan: plan, extra: extra, grade: grade, finish: finish, streak: streak, stats: stats, minutes: minutes, shuffle: shuffle, interleave: interleave, blank: blank, unitOn: unitOn, setUnit: setUnit };
})(typeof window !== 'undefined' ? window : this);
