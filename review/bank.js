/* =====================================================================
   今天的複習：題庫
   - 每張卡有固定的 id（不要改 id，改了孩子的進度就對不上）。
   - s：科目；u：單元（爸媽可以在設定裡關掉還沒教的單元）。
   - type：write（看注音寫國字，自己對答案）、num（填數字，自動改）、pick（先想再選，自動改）。
   - 數學卡每次出不同的數字，練的是「這一型題目」。
   - 內容都對照孩子的課本；課外補充不要放進來。說明文件：docs/learning-design.md
   ===================================================================== */
(function (root) {
  'use strict';
  var SUBJECTS = {
    cn: { name: '國語', icon: '📖', color: '#ff6b9a', bg: '#ffe6ef' },
    ma: { name: '數學', icon: '🔢', color: '#ff9f1c', bg: '#fff1d6' },
    na: { name: '自然', icon: '🔬', color: '#4d96ff', bg: '#e6f0ff' },
    so: { name: '社會', icon: '🗺️', color: '#2a9d8f', bg: '#d8f3dc' },
    en: { name: '英語', icon: '🔤', color: '#9b5de5', bg: '#f3e8ff' }
  };
  var UNITS = [
    { k: 'cn1', s: 'cn', name: '第 1 課 窗口邊的臺灣欒樹', href: 'chinese/lesson1-luan-tree/' },
    { k: 'cn2', s: 'cn', name: '第 2 課 奶奶的排骨粥', href: 'chinese/lesson2-pork-congee/' },
    { k: 'cn3', s: 'cn', name: '第 3 課 充滿希望的五味屋', href: 'chinese/lesson3-wuwei-house/' },
    { k: 'cn4', s: 'cn', name: '第 4 課 玉山之歌', href: 'chinese/lesson4-yushan-song/' },
    { k: 'cn5', s: 'cn', name: '第 5 課 高舉臺灣之光', href: 'chinese/lesson5-taiwan-light/' },
    { k: 'cn6', s: 'cn', name: '第 6 課 臺灣的驕傲', href: 'chinese/lesson6-taiwan-pride/' },
    { k: 'cn7', s: 'cn', name: '第 7 課 到此「藝」遊', href: 'chinese/lesson7-art-tour/' },
    { k: 'ma1', s: 'ma', name: '一億以內的數', href: 'math/big-numbers/' },
    { k: 'ma2', s: 'ma', name: '整數的乘法', href: 'math/multiplication/' },
    { k: 'ma3', s: 'ma', name: '角度', href: 'math/angles/' },
    { k: 'ma4', s: 'ma', name: '整數的除法', href: 'math/division/' },
    { k: 'ma5', s: 'ma', name: '公里', href: 'math/kilometers/' },
    { k: 'ma6', s: 'ma', name: '三角形', href: 'math/triangles/' },
    // later：學校還沒教的單元，預設關掉，爸媽在「給爸媽」打勾才出題
    { k: 'ma7', s: 'ma', name: '小數', href: 'math/decimals/', later: true },
    { k: 'ma8', s: 'ma', name: '整數四則計算', href: 'math/mixed-ops/', later: true },
    { k: 'ma9', s: 'ma', name: '分數', href: 'math/fractions/', later: true },
    { k: 'ma10', s: 'ma', name: '統計圖', href: 'math/charts/', later: true },
    { k: 'na1', s: 'na', name: '第一單元 閃亮的天空', href: 'nature/moon-detective/#lesson1' },
    { k: 'na2', s: 'na', name: '第二單元 水域環境', href: 'nature/moon-detective/#lesson2' },
    { k: 'so1', s: 'so', name: '閱讀生活中的地圖', href: 'social/reading-maps/' },
    { k: 'so2', s: 'so', name: '善用地圖好生活', href: 'social/map-life/' },
    { k: 'so3', s: 'so', name: '高低起伏的地形', href: 'social/landforms/' },
    { k: 'so4', s: 'so', name: '千變萬化的氣候', href: 'social/climate/' },
    { k: 'so5', s: 'so', name: '家鄉的人口組成', href: 'social/population/' },
    { k: 'so6', s: 'so', name: '人口變化與發展', href: 'social/population-change/' },
    { k: 'so7', s: 'so', name: '家鄉的多元飲食文化', href: 'social/multicultural/', later: true },
    { k: 'so8', s: 'so', name: '家鄉的多元服飾', href: 'social/multicultural/', later: true },
    { k: 'so9', s: 'so', name: '家鄉的多元語言與命名', href: 'social/multicultural/', later: true },
    { k: 'so10', s: 'so', name: '家鄉的傳統節慶', href: 'social/festivals/', later: true },
    { k: 'so11', s: 'so', name: '家鄉的現代節日', href: 'social/festivals/', later: true },
    { k: 'so12', s: 'so', name: '家鄉的生命禮俗', href: 'social/festivals/', later: true },
    { k: 'en1', s: 'en', name: 'Unit 1 The Big Wind', href: 'english/lesson1-big-wind/' },
    { k: 'en2', s: 'en', name: 'Unit 2 Going Back Home', href: 'english/lesson2-going-back-home/' },
    { k: 'en3', s: 'en', name: 'Unit 3 Be Honest', href: 'english/lesson3-be-honest/' },
    { k: 'en4', s: 'en', name: 'Unit 4 Earthquake Drill', href: 'english/lesson4-earthquake-drill/' }
  ];

  /* ---------------- 小工具 ---------------- */
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function grp(n) { var s = String(n); return s.length <= 4 ? s : s.slice(0, s.length - 4) + ' ' + s.slice(-4); } // 萬位分開，跟數學頁一樣
  var CN = '零一二三四五六七八九', U4 = ['', '十', '百', '千'];
  function read4(n, lead) {
    var s = '', zero = false, started = false;
    for (var i = 3; i >= 0; i--) {
      var d = Math.floor(n / Math.pow(10, i)) % 10;
      if (d === 0) { if (started) zero = true; continue; }
      if (zero) { s += '零'; zero = false; }
      s += (i === 1 && d === 1 && !started && lead) ? '十' : CN[d] + U4[i];
      started = true;
    }
    return s;
  }
  function readNum(n) { // 一億以內的數字讀法（跟數學頁一樣）
    if (n === 0) return '零';
    var hi = Math.floor(n / 1e4), lo = n % 1e4, s = '';
    if (hi > 0) s = read4(hi, true) + '萬';
    if (lo > 0) { if (hi > 0 && lo < 1000) s += '零'; s += read4(lo, hi === 0); }
    return s;
  }
  function bigNum(len, zp) { var s = String(ri(1, 9)); for (var i = 1; i < len; i++) s += Math.random() < zp ? '0' : String(ri(1, 9)); return +s; }
  var PLACE = ['個', '十', '百', '千', '萬', '十萬', '百萬', '千萬'];

  /* 月相小圖：e＝太陽和月亮的角度（0 看不到、90 右半亮、180 圓、270 左半亮） */
  function moonSVG(e, size) {
    var r = 40, k = ((e % 360) + 360) % 360, rx = Math.abs(Math.cos(k * Math.PI / 180)) * r, lit = '';
    if (k > 2 && k < 358) {
      if (Math.abs(k - 180) < 2) lit = '<circle r="' + r + '" fill="#FFD95A"/>';
      else if (k < 180) lit = '<path d="M0 ' + (-r) + ' A' + r + ' ' + r + ' 0 0 1 0 ' + r + ' A' + rx.toFixed(1) + ' ' + r + ' 0 0 ' + (k < 90 ? 0 : 1) + ' 0 ' + (-r) + 'Z" fill="#FFD95A"/>';
      else lit = '<path d="M0 ' + (-r) + ' A' + r + ' ' + r + ' 0 0 0 0 ' + r + ' A' + rx.toFixed(1) + ' ' + r + ' 0 0 ' + (k < 270 ? 0 : 1) + ' 0 ' + (-r) + 'Z" fill="#FFD95A"/>';
    }
    return '<svg viewBox="-50 -50 100 100" width="' + size + '" height="' + size + '" role="img" aria-label="月亮的樣子"><rect x="-50" y="-50" width="100" height="100" rx="14" fill="#1E2A4A"/><circle r="' + r + '" fill="#3A4466"/>' + lit + '<circle r="' + r + '" fill="none" stroke="#56618A" stroke-width="1.5"/></svg>';
  }

  /* ---------------- 數學：每次出不同的數字 ----------------
     填數字：{ q, fields:[{pre, unit}], ans:[數字...], ex, dg(答案陣列) → 可能錯在哪（猜不出來就回空字串）, viz → 送出後把答案演出來（角度、公里、除法） }
     選擇題：{ kind:'pick', q, opts, a, ex }
     找錯題：{ kind:'spot', q, parts:[...], bad:錯的那一格, block:是否一行一行排, fix, ex } */
  function p10(x) { return x >= 10 && /^10+$/.test(String(x)); } // 10、100、1000……
  var GEN = {
    place: function () {
      var n, s, k, d;
      for (var t = 0; t < 100; t++) { n = bigNum(ri(7, 8), .3); s = String(n); k = ri(0, s.length - 2); d = s[k]; if (d !== '0' && s.split(d).length === 2) break; }
      var pos = s.length - 1 - k, v = +d * Math.pow(10, pos);
      return { q: '在 <b class="num">' + grp(n) + '</b> 裡，數字 <b>' + d + '</b> 代表多少？', fields: [{ pre: '', unit: '' }], ans: [v], viz: { t: 'place', n: n, pos: pos, d: +d },
        ex: d + ' 在<b>' + PLACE[pos] + '位</b>，代表 ' + d + ' 個' + (PLACE[pos] === '個' ? '一' : PLACE[pos]) + '，也就是 <b>' + grp(v) + '</b>。',
        dg: function (x) { x = x[0]; if (x === +d) return '數字 ' + d + ' 不只代表 ' + d + '，要看它在哪一位。'; if (x === v * 10 || x * 10 === v) return '位數數錯了一位：從個位往左數，個、十、百、千、萬、十萬、百萬、千萬。'; return ''; } };
    },
    write: function () {
      var n = bigNum(ri(7, 8), .35), hi = Math.floor(n / 1e4), lo = n % 1e4;
      return { q: '把「<b>' + readNum(n) + '</b>」寫成數字。', fields: [{ pre: '', unit: '' }], ans: [n], viz: { t: 'write', n: n },
        ex: readNum(hi) + '萬 → ' + hi + ' 萬；' + (lo ? readNum(lo).replace(/^零/, '') + ' → ' + String(lo).padStart(4, '0') : '後面四位都是 0') + '。合起來是 <b>' + grp(n) + '</b>。',
        dg: function (x) { var a = String(x[0]).length, b = String(n).length; if (a < b) return '位數不夠：「萬」後面一定要有 4 位，讀到「零」或沒有讀出來的位要補 0。'; if (a > b) return '位數太多了：「萬」後面只有千、百、十、個 4 位。'; return ''; } };
    },
    addsub: function () {
      var a = bigNum(ri(6, 7), .2), b = bigNum(ri(5, 6), .2), plus = Math.random() < .5;
      if (!plus && b > a) { var t = a; a = b; b = t; }
      var ans = plus ? a + b : a - b;
      return { q: '<b class="num">' + grp(a) + ' ' + (plus ? '＋' : '－') + ' ' + grp(b) + '</b> ＝ ？', fields: [{ pre: '', unit: '' }], ans: [ans],
        ex: '用直式，個位對齊再' + (plus ? '加，滿十要進位' : '減，不夠減要借位') + '。答案是 <b>' + grp(ans) + '</b>。',
        dg: function (x) { x = x[0]; if (x === (plus ? a - b : a + b)) return '看清楚是「' + (plus ? '＋' : '－') + '」喔。'; var df = Math.abs(x - ans); if (p10(df)) return '答案差了 ' + df + '，可能是有一位的' + (plus ? '進位' : '借位') + '漏掉了。'; return ''; } };
    },
    seq: function () {
      // 課本 p.7：連續加 1000、加 10000……（一億以內的數）
      var st = pick([1000, 1000, 10000, 10000, 100000, 1000000]), dir = Math.random() < .7 ? 1 : -1, base;
      do { base = ri(12, 95) * st + (Math.random() < .5 ? 0 : ri(1, 9) * st / 10) + (st <= 10000 ? ri(0, 9) * 100 : 0); if (dir < 0) base += st * 5; } while (base < 10000 || base + st * 5 >= 1e8);
      var arr = []; for (var i = 0; i < 5; i++) arr.push(base + dir * st * i);
      var p = ri(1, 4);
      return { q: '依序' + (dir > 0 ? '加' : '減') + '下去，□ 是多少？<div class="seq">' + arr.map(function (x, i) { return i === p ? '<span class="blank">□</span>' : grp(x); }).join('、') + '</div>', fields: [{ pre: '□ ＝', unit: '' }], ans: [arr[p]], viz: { t: 'seq', arr: arr, p: p },
        ex: '每次' + (dir > 0 ? '多' : '少') + ' ' + grp(st) + '（' + readNum(st) + '），所以 □ 是 <b>' + grp(arr[p]) + '</b>。',
        dg: function (x) { x = x[0]; if (x === arr[p - 1] - dir * st) return '看清楚數字是越來越' + (dir > 0 ? '大' : '小') + '喔。'; var df = Math.abs(x - arr[p - 1]); if (df && df !== st && p10(df)) return '每次' + (dir > 0 ? '多' : '少') + '的是 ' + grp(st) + '，不是 ' + grp(df) + '：看清楚是哪一位在變。'; if (df !== st) return '先算出相鄰兩個數差多少，□ 就是前一個數' + (dir > 0 ? '加' : '減') + '這麼多。'; return ''; } };
    },
    /* 位值合成（課本 p.9、p.13：「4 個萬、0 個千、9 個百……合起來」，有時順序打亂） */
    compose: function () {
      var n = bigNum(ri(5, 8), .3), s0 = String(n), items = [];
      for (var i = 0; i < s0.length; i++) { var d = +s0[i], pos = s0.length - 1 - i; if (d) items.push(d + ' 個' + (pos === 0 ? '一' : PLACE[pos])); }
      if (items.length > 2 && Math.random() < .35) items = items.slice().sort(function () { return Math.random() - .5; });
      var txt = items.length > 1 ? items.slice(0, -1).join('、') + '和 ' + items[items.length - 1] : items[0];
      return { q: '<b>' + txt + '</b>合起來是多少？', fields: [{ pre: '', unit: '' }], ans: [n],
        ex: '把每一位放到定位板上，沒有提到的位寫 0：<b>' + grp(n) + '</b>。',
        dg: function (x) { x = x[0]; if (String(x).length < s0.length) return '位數不夠：沒有提到的位要寫 0，不能跳過。'; if (String(x).length > s0.length) return '位數太多了：看最大的是哪一位（' + PLACE[s0.length - 1] + '位），它就是最左邊的那一位。'; return '一位一位對：幾個千萬就寫在千萬位，幾個萬就寫在萬位。'; } };
    },
    /* 萬為單位（課本 p.15～16、素養吧） */
    wan: function () {
      var t = ri(0, 2), a, b, ans;
      if (t === 0) { a = ri(120, 980); b = ri(15, a - 20); ans = a - b; return { q: '<b class="num">' + a + '萬 － ' + b + '萬</b> ＝ ？萬', fields: [{ pre: '', unit: '萬' }], ans: [ans], ex: '用「萬」當單位算：' + a + ' － ' + b + ' ＝ ' + ans + '，答案是 <b>' + ans + '萬</b>（' + grp(ans * 1e4) + '）。', dg: function (x) { return x[0] === a + b ? '看清楚是減法。' : ''; } }; }
      if (t === 1) { a = ri(120, 700); b = ri(30, 290); ans = a + b; return { q: '<b class="num">' + a + '萬 ＋ ' + b + '萬</b> ＝ ？萬', fields: [{ pre: '', unit: '萬' }], ans: [ans], ex: '用「萬」當單位算：' + a + ' ＋ ' + b + ' ＝ ' + ans + '，答案是 <b>' + ans + '萬</b>（' + grp(ans * 1e4) + '）。', dg: function (x) { return x[0] === a - b ? '看清楚是加法。' : ''; } }; }
      a = ri(12, 980) * 1e4;
      return { q: '<b class="num">' + grp(a) + '</b> 是幾個萬？', fields: [{ pre: '', unit: '個萬' }], ans: [a / 1e4], ex: '把後面 4 位（千、百、十、個）遮起來，前面就是幾個萬：<b>' + (a / 1e4) + ' 個萬</b>，也可以寫成 ' + (a / 1e4) + '萬。', dg: function (x) { x = x[0]; if (x === a / 1e3 || x === a / 1e5) return '「萬」後面一定有 4 位，從個位往左數 4 位再看。'; return ''; } };
    },
    mul41: function () {
      var a = Math.random() < .45 ? ri(1, 9) * 1000 + ri(0, 9) * 10 + ri(1, 9) : ri(1001, 9999), b = ri(2, 9), ans = a * b;
      return { q: '<b class="num">' + a + ' × ' + b + '</b> ＝ ？', fields: [{ pre: '', unit: '' }], ans: [ans],
        ex: '從個位開始乘，' + b + ' 分別乘個位、十位、百位、千位，滿十要進位。答案是 <b>' + ans + '</b>。',
        dg: function (x) { x = x[0]; var df = Math.abs(x - ans); if (String(x).length < String(ans).length) return '位數少了，檢查有沒有漏乘一位（中間是 0 的那一位也要寫 0）。'; if (df && df % 10 === 0 && df < ans) return '答案差了 ' + df + '，可能是有一位忘了加上進位。'; return ''; } };
    },
    mul32: function () {
      var a = ri(101, 999), b = ri(12, 98); if (b % 10 === 0) b++;
      var u = b % 10, tn = Math.floor(b / 10), p1 = a * u, p2 = a * tn, ans = a * b;
      return { q: '<b class="num">' + a + ' × ' + b + '</b> ＝ ？', fields: [{ pre: '', unit: '' }], ans: [ans],
        ex: a + ' × ' + u + ' ＝ ' + p1 + '；' + a + ' × ' + tn + '0 ＝ ' + (p2 * 10) + '（第二行往左移一位）。' + p1 + ' ＋ ' + (p2 * 10) + ' ＝ <b>' + ans + '</b>。',
        dg: function (x) { x = x[0]; if (x === p1 + p2) return '第二行是乘「' + tn + '0」，要往左移一位（後面補 0）再加起來。'; if (x === p1 || x === p2 * 10 || x === p2) return '兩行都乘完以後，要加起來才是答案。'; if (p10(Math.abs(x - ans))) return '兩行加起來的時候，可能漏了進位。'; return ''; } };
    },
    mul22: function () {
      var a = Math.random() < .4 ? ri(3, 9) : ri(13, 97), b = ri(13, 97); if (b % 10 === 0) b++;
      return mulTwo(a, b);
    },
    mul42: function () {
      var a = Math.random() < .3 ? ri(1, 9) * 1000 + ri(0, 9) * 10 + ri(1, 9) : ri(1001, 9999), b = Math.random() < .2 ? ri(2, 9) * 10 : ri(12, 98); if (b % 10 === 0 && b % 100 !== 0 && Math.random() < .5) b++;
      return mulTwo(a, b);
    },
    quick: function () {
      var t = ri(0, 3), a, b;
      if (t === 0) { a = ri(1, 9) * Math.pow(10, ri(1, 3)); b = ri(2, 9); }
      else if (t === 1) { a = ri(2, 9); b = ri(2, 9) * 10; }
      else if (t === 2) { a = ri(2, 9) * 10; b = ri(2, 9) * 10; }
      else { a = ri(11, 49); if (a % 10 === 0) a++; b = ri(2, 9) * 10; }
      var za = String(a).match(/0*$/)[0].length, zb = String(b).match(/0*$/)[0].length, ca = a / Math.pow(10, za), cb = b / Math.pow(10, zb), ans = a * b;
      return { q: '補 0 快算：<b class="num">' + a + ' × ' + b + '</b> ＝ ？', fields: [{ pre: '', unit: '' }], ans: [ans], viz: { t: 'zero', a: a, b: b, ca: ca, cb: cb, za: za, zb: zb },
        ex: '先算 ' + ca + ' × ' + cb + ' ＝ ' + (ca * cb) + '，再在後面補 <b>' + (za + zb) + ' 個 0</b> → <b>' + ans + '</b>。',
        dg: function (x) { x = x[0]; if (x === ca * cb) return '別忘了在後面補 0：一共要補 ' + (za + zb) + ' 個。'; if (x * 10 === ans) return '少補了一個 0：兩個數後面一共有 ' + (za + zb) + ' 個 0。'; if (x === ans * 10) return '多補了一個 0：兩個數後面一共只有 ' + (za + zb) + ' 個 0。'; return ''; } };
    },
    angle: function () {
      var t = ri(0, 3), a;
      if (t === 0) { a = ri(4, 32) * 5; return { q: '一條直線（平角）被分成兩個角，一個角是 <b>' + a + '°</b>，另一個角是幾度？', fields: [{ pre: '', unit: '度' }], ans: [180 - a], viz: { t: 'line', base: 180, a: a }, ex: '平角是 180°，180° － ' + a + '° ＝ <b>' + (180 - a) + '°</b>。',
        dg: function (x) { x = x[0]; if (x === 90 - a) return '一條直線是平角 180°，不是直角 90°。'; if (x === 360 - a) return '一條直線是平角 180°，不是周角 360°。'; return ''; } }; }
      if (t === 1) { a = ri(2, 16) * 5; return { q: '一個直角被分成兩個角，一個角是 <b>' + a + '°</b>，另一個角是幾度？', fields: [{ pre: '', unit: '度' }], ans: [90 - a], viz: { t: 'line', base: 90, a: a }, ex: '直角是 90°，90° － ' + a + '° ＝ <b>' + (90 - a) + '°</b>。',
        dg: function (x) { x = x[0]; if (x === 180 - a) return '這題是直角 90°，不是平角 180°。'; return ''; } }; }
      if (t === 2) {
        var P = pick([[45, 30], [60, 30], [60, 45], [90, 30], [90, 45], [90, 60], [45, 60], [30, 45], [30, 60], [45, 90]]), sub = Math.random() < .4 && P[0] > P[1], A = P[0], Bv = P[1];
        return { q: '用兩塊三角板拼角：∠A 是 <b>' + A + '°</b>，∠B 是 <b>' + Bv + '°</b>。' + (sub ? '∠A 和 ∠B <b>相差</b>幾度？' : '∠A 和 ∠B <b>合起來</b>是幾度？'), fields: [{ pre: '', unit: '度' }], ans: [sub ? A - Bv : A + Bv],
          ex: sub ? '相差用減法：' + A + '° － ' + Bv + '° ＝ <b>' + (A - Bv) + '°</b>。' : '合起來用加法：' + A + '° ＋ ' + Bv + '° ＝ <b>' + (A + Bv) + '°</b>。',
          dg: function (x) { x = x[0]; if (sub && x === A + Bv) return '「相差」要用減法。'; if (!sub && x === Math.abs(A - Bv)) return '「合起來」要用加法。'; return ''; } };
      }
      var steps = pick([1, 2, 3, 4, 5, 6, 8, 9]), from = ri(1, 12), ccw = Math.random() < .4, to = ccw ? (((from - steps) % 12) + 12) % 12 || 12 : ((from % 12) + steps) % 12 || 12, dir = ccw ? '逆時針' : '順時針';
      return { q: '鐘面上，指針從 <b>' + from + '</b> ' + dir + '轉到 <b>' + to + '</b>，轉了幾度？', fields: [{ pre: '', unit: '度' }], ans: [steps * 30], viz: { t: 'clock', from: from, to: to, ccw: ccw },
        ex: '鐘面上相鄰兩個數字之間是 1 大格，1 大格是 30°。' + dir + '轉了 ' + steps + ' 大格，30° × ' + steps + ' ＝ <b>' + (steps * 30) + '°</b>。',
        dg: function (x) { x = x[0]; if (x === steps) return '轉了 ' + steps + ' 大格，每一大格是 30°，要算 30° × ' + steps + '。'; if (x === (12 - steps) * 30) return '是「' + dir + '」：' + (ccw ? '和時鐘指針轉的方向相反' : '照時鐘指針轉的方向') + '，從 ' + from + ' 轉到 ' + to + '。'; return ''; } };
    },
    /* 量角器讀數：內外圈 */
    protractor: function () {
      var outer = Math.random() < .5, d = ri(2, 17) * 10;
      if (outer && d >= 100) d = 180 - d;
      var realDeg = outer ? d : (180 - d);
      var wrong1 = outer ? (180 - d) : d, wrong2 = outer ? (d + 10) : (180 - d + 10);
      return { kind: 'pick', q: '量角器的 0 在<b>' + (outer ? '外圈' : '內圈') + '</b>，指針對準下面的刻度，這個角是幾度？<div style="margin:6px 0;color:#666;font-size:15px">' + (outer ? '（提示：0 在外圈時，看外圈的數字）' : '（提示：0 在內圈時，看內圈的數字）') + '</div>',
        opts: [realDeg + '°', wrong1 + '°', wrong2 + '°'], a: 0,
        ex: '0 在' + (outer ? '外圈' : '內圈') + '，要看' + (outer ? '外圈' : '內圈') + '的刻度。這個角是 <b>' + realDeg + '°</b>。',
        dg: function () { return ''; } };
    },
    /* 角度分類 */
    angleKind: function () {
      var types = [
        { name: '銳角', range: [5, 85], def: '小於 90°' },
        { name: '直角', deg: 90, def: '等於 90°' },
        { name: '鈍角', range: [95, 175], def: '大於 90°、小於 180°' },
        { name: '平角', deg: 180, def: '等於 180°（一條直線）' },
        { name: '周角', deg: 360, def: '等於 360°（轉一整圈）' }
      ];
      var t = pick(types), d = t.deg || ri(t.range[0] / 5, t.range[1] / 5) * 5;
      var opts = ['銳角', '直角', '鈍角', '平角', '周角'];
      return { kind: 'pick', q: '有一個角是 <b>' + d + '°</b>，它是什麼角？', opts: opts, a: opts.indexOf(t.name),
        ex: d + '° ' + t.def + '，是<b>' + t.name + '</b>。' };
    },
    /* 順時針與逆時針 */
    clockDir: function () {
      var ccw = Math.random() < .5, steps = pick([2, 3, 4, 6]), from = ri(1, 12);
      var to = ccw ? (((from - steps) % 12) + 12) % 12 || 12 : ((from % 12) + steps) % 12 || 12;
      var dir = ccw ? '逆時針' : '順時針', wrongDir = ccw ? '順時針' : '逆時針';
      var wrongTo = ccw ? ((from % 12) + steps) % 12 || 12 : (((from - steps) % 12) + 12) % 12 || 12;
      return { kind: 'pick', q: '鐘面上，指針從 <b>' + from + '</b> ' + dir + '轉 <b>' + (steps * 30) + '°</b>，會轉到哪裡？',
        opts: [String(to), String(wrongTo), String(from)], a: 0,
        ex: dir + (ccw ? '是和時鐘指針相反的方向' : '是照時鐘指針的方向') + '。從 ' + from + ' ' + dir + '轉 ' + steps + ' 格（' + (steps * 30) + '°），到 <b>' + to + '</b>。' };
    },
    /* 拖曳：角度分類籃子 */
    angleSort: function () {
      var mk = function (k) {
        if (k === '銳角') return ri(2, 17) * 5;
        if (k === '直角') return 90;
        if (k === '鈍角') return ri(19, 35) * 5;
        if (k === '平角') return 180;
        return 360;
      };
      var kinds = ['銳角', '直角', '鈍角', '平角'].sort(function () { return Math.random() - .5; }).slice(0, 3);
      kinds.push(pick(kinds));
      return { kind: 'drag', mode: 'baskets', q: '看角度，把它們放進正確的籃子。',
        slots: [{ id: '銳角', label: '銳角（小於 90°）' }, { id: '直角', label: '直角（90°）' }, { id: '鈍角', label: '鈍角（90°～180°）' }, { id: '平角', label: '平角（180°）' }],
        items: kinds.map(function (k, i) { return { id: i + 1, deg: mk(k), slot: k }; }), need: 4,
        ex: '銳角小於 90°、直角是 90°、鈍角大於 90° 又小於 180°、平角是 180°。' };
    },
    div41: function () {
      var d, Q, R, N;
      for (var t = 0; t < 200; t++) { d = ri(2, 9); Q = ri(Math.ceil(1000 / d), Math.floor(9999 / d)); R = Math.random() < .3 ? 0 : ri(1, d - 1); N = d * Q + R; if (N >= 1000 && N <= 9999) break; }
      return { q: '<b class="num">' + N + ' ÷ ' + d + '</b> ＝ ？', fields: [{ pre: '商', unit: '' }, { pre: '餘數', unit: '' }], ans: [Q, R], viz: { t: 'div', N: N, d: d },
        ex: '商是 <b>' + Q + '</b>，餘數是 <b>' + R + '</b>。驗算：' + d + ' × ' + Q + (R ? ' ＋ ' + R : '') + ' ＝ ' + N + '。餘數要比除數 ' + d + ' 小。', dg: divDiag(N, d, Q, R) };
    },
    div32: function () {
      var d, Q, R, N;
      for (var t = 0; t < 200; t++) { d = Math.random() < .25 ? ri(2, 9) * 10 : ri(12, 98); if (d % 10 === 0 && d > 90) continue; Q = ri(2, Math.floor(999 / d)); R = Math.random() < .3 ? 0 : ri(1, d - 1); N = d * Q + R; if (N >= 100 && N <= 999) break; }
      return { q: '<b class="num">' + N + ' ÷ ' + d + '</b> ＝ ？', fields: [{ pre: '商', unit: '' }, { pre: '餘數', unit: '' }], ans: [Q, R], viz: { t: 'div', N: N, d: d },
        ex: '商是 <b>' + Q + '</b>，餘數是 <b>' + R + '</b>。驗算：' + d + ' × ' + Q + (R ? ' ＋ ' + R : '') + ' ＝ ' + N + '。', dg: divDiag(N, d, Q, R) };
    },
    div22: function () {
      // 課本活動 2：二位數÷整十、二位數÷二位數，被除數比除數小時商是 0
      var d, Q, R, N;
      for (var t = 0; t < 200; t++) {
        d = Math.random() < .3 ? ri(2, 5) * 10 : ri(11, 58);
        if (Math.random() < .12) { N = ri(10, d - 1); Q = 0; R = N; break; }
        Q = ri(1, Math.floor(99 / d)); R = Math.random() < .25 ? 0 : ri(1, d - 1); N = d * Q + R; if (N >= 20 && N <= 99) break;
      }
      return { q: '<b class="num">' + N + ' ÷ ' + d + '</b> ＝ ？', fields: [{ pre: '商', unit: '' }, { pre: '餘數', unit: '' }], ans: [Q, R], viz: { t: 'div', N: N, d: d },
        ex: Q === 0 ? N + ' 比 ' + d + ' 小，一個都分不到，商記 <b>0</b>，餘數就是 <b>' + N + '</b>。' : '把除數 ' + d + ' 想成接近的整十來估商。商是 <b>' + Q + '</b>，餘數是 <b>' + R + '</b>。驗算：' + d + ' × ' + Q + (R ? ' ＋ ' + R : '') + ' ＝ ' + N + '。',
        dg: function (v) { if (Q === 0 && v[0] !== 0) return '被除數 ' + N + ' 比除數 ' + d + ' 小，一個都分不到，商是 0。'; return divDiag(N, d, Q, R)(v); } };
    },
    div42: function () {
      // 課本活動 4：四位數÷二位數，商三位數，商中間可能有 0
      var d, Q, R, N, z = Math.random() < .35;
      for (var t = 0; t < 400; t++) { d = Math.random() < .2 ? ri(2, 9) * 10 : ri(12, 98); if (d % 10 === 0 && d > 90) continue; Q = ri(Math.ceil(1000 / d), Math.floor(9999 / d)); if (Q < 100 || Q > 999) continue; if (z && String(Q)[1] !== '0') continue; R = Math.random() < .25 ? 0 : ri(1, d - 1); N = d * Q + R; if (N >= 1000 && N <= 9999) break; }
      return { q: '<b class="num">' + N + ' ÷ ' + d + '</b> ＝ ？', fields: [{ pre: '商', unit: '' }, { pre: '餘數', unit: '' }], ans: [Q, R], viz: { t: 'div', N: N, d: d },
        ex: '商是 <b>' + Q + '</b>，餘數是 <b>' + R + '</b>。' + (String(Q)[1] === '0' ? '十位不夠分，要在商的十位記 0。' : '') + '驗算：' + d + ' × ' + Q + (R ? ' ＋ ' + R : '') + ' ＝ ' + N + '。', dg: divDiag(N, d, Q, R) };
    },
    km1: function () {
      var km = ri(1, 15), m = pick([0, ri(1, 9), ri(1, 9) * 10, ri(11, 99), ri(101, 999), ri(1, 9) * 100]);
      var ans = km * 1000 + m;
      if (!m) return { q: '<b class="num">' + km + ' 公里</b> ＝ ？ 公尺', fields: [{ pre: '', unit: '公尺' }], ans: [ans], viz: { t: 'road', total: ans }, ex: '1 公里 ＝ 1000 公尺，' + km + ' 公里 ＝ <b>' + ans + ' 公尺</b>。', dg: function (x) { x = x[0]; if (x === km * 100 || x === km * 10000) return '1 公里是 1000 公尺，後面有 3 個 0。'; return ''; } };
      return { q: '<b class="num">' + km + ' 公里 ' + m + ' 公尺</b> ＝ ？ 公尺', fields: [{ pre: '', unit: '公尺' }], ans: [ans], viz: { t: 'road', total: ans },
        ex: '1 公里 ＝ 1000 公尺。' + km + ' 公里 ＝ ' + (km * 1000) + ' 公尺，再加 ' + m + ' 公尺 ＝ <b>' + ans + ' 公尺</b>。' + (m < 100 ? '小心：' + m + ' 公尺要放在個位' + (m < 10 ? '' : '和十位') + '，前面補 0。' : ''),
        dg: function (x) { x = x[0]; if (m < 100 && x === +(String(km) + String(m))) return m + ' 公尺不能直接接在 ' + km + ' 後面：公尺要寫成 3 位，' + m + ' 要寫成 ' + String(m).padStart(3, '0') + '。'; if (x === km * 1000) return '別忘了再加上 ' + m + ' 公尺。'; if (x === km * 100 + m || x === km * 10000 + m) return '1 公里是 1000 公尺。'; return ''; } };
    },
    km2: function () {
      var km = ri(1, 15), m = pick([0, ri(1, 9) * 10, ri(11, 99), ri(101, 999)]), tot = km * 1000 + m;
      if (!m) return { q: '<b class="num">' + tot + ' 公尺</b> ＝ ？ 公里', fields: [{ pre: '', unit: '公里' }], ans: [km], viz: { t: 'road', total: tot }, ex: '每 1000 公尺是 1 公里：' + tot + ' 公尺 ＝ <b>' + km + ' 公里</b>。', dg: function (v) { if (v[0] === tot / 100 || v[0] === tot / 10) return '每 1000 公尺才是 1 公里，要把後面 3 個 0 拿掉。'; return ''; } };
      return { q: '<b class="num">' + tot + ' 公尺</b> ＝ ？ 公里 ？ 公尺', fields: [{ pre: '', unit: '公里' }, { pre: '', unit: '公尺' }], ans: [km, m], viz: { t: 'road', total: tot },
        ex: '每 1000 公尺是 1 公里：' + tot + ' 公尺 ＝ <b>' + km + ' 公里 ' + m + ' 公尺</b>。',
        dg: function (v) { if (v[0] === Math.floor(tot / 100) || v[0] === Math.floor(tot / 10000)) return '每 1000 公尺才是 1 公里。'; if (v[0] === km && v[1] !== m) return '公里對了！公尺是 ' + tot + ' 扣掉 ' + (km * 1000) + '。'; if (v[1] >= 1000) return '公尺滿 1000 就要換成 1 公里，公尺那格不會超過 999。'; return ''; } };
    },
    km3: function () {
      var t = ri(0, 3), plus, ak, am, bk, bm, tot;
      if (t === 3) { // 課本 p.68：2 公里 150 公尺 － 1500 公尺 ＝ ？ 公尺
        do { ak = ri(2, 6); am = pick([ri(0, 9) * 10, ri(100, 900)]); bm = ri(11, 29) * 100 + pick([0, 0, ri(1, 9) * 10]); tot = ak * 1000 + am - bm; } while (tot < 100 || tot >= 1000 * ak);
        return { q: '<b class="num">' + ak + ' 公里 ' + am + ' 公尺 － ' + bm + ' 公尺</b> ＝ ？ 公尺', fields: [{ pre: '', unit: '公尺' }], ans: [tot], viz: { t: 'road', total: tot },
          ex: '先都換成公尺：' + ak + ' 公里 ' + am + ' 公尺 ＝ ' + (ak * 1000 + am) + ' 公尺，' + (ak * 1000 + am) + ' － ' + bm + ' ＝ <b>' + tot + ' 公尺</b>。',
          dg: function (v) { if (v[0] === am - bm + ak * 100 || v[0] === Math.abs(am - bm)) return '先把 ' + ak + ' 公里 ' + am + ' 公尺換成公尺（' + (ak * 1000 + am) + '），再減。'; return ''; } };
      }
      do {
        plus = Math.random() < .5; ak = ri(2, 12); am = t === 2 ? ri(0, 99) : ri(100, 950); bk = t === 1 ? 0 : ri(1, ak - 1); bm = ri(100, 950);
        tot = plus ? ak * 1000 + am + bk * 1000 + bm : ak * 1000 + am - (bk * 1000 + bm);
      } while (tot < 1000);
      var k = Math.floor(tot / 1000), m = tot % 1000, B = (bk ? bk + ' 公里 ' : '') + bm + ' 公尺';
      return { q: '<b class="num">' + ak + ' 公里 ' + am + ' 公尺 ' + (plus ? '＋' : '－') + ' ' + B + '</b> ＝ ？', fields: [{ pre: '', unit: '公里' }, { pre: '', unit: '公尺' }], ans: [k, m], viz: { t: 'road', total: tot },
        ex: (plus ? '公尺加公尺，滿 1000 公尺進 1 公里' : '公尺減公尺，不夠減就借 1 公里 ＝ 1000 公尺') + '。也可以先都換成公尺再算。答案是 <b>' + k + ' 公里 ' + m + ' 公尺</b>。',
        dg: function (v) {
          if (v[1] >= 1000) return '公尺滿 1000，要進位成 1 公里。';
          if (!plus && am < bm && v[1] === bm - am) return '公尺不可以倒過來用 ' + bm + ' － ' + am + '：上面不夠減，要先跟公里借 1（＝1000 公尺）。';
          if (v[1] === m && v[0] === k + 1 && !plus) return '公尺不夠減時，向公里借了 1，公里要少 1。';
          if (v[1] === m && v[0] === k - 1 && plus) return '公尺加起來滿 1000 進位了，公里要多 1。';
          return '';
        } };
    },
    triAngle: function () {
      var t = ri(0, 2), a, b, c;
      if (t === 0) { a = 90; b = ri(4, 14) * 5; c = 90 - b; }
      else if (t === 1) { a = ri(19, 28) * 5; b = ri(3, Math.floor((180 - a) / 5) - 3) * 5; c = 180 - a - b; }
      else { for (var g = 0; g < 50; g++) { a = ri(9, 17) * 5; b = ri(9, 17) * 5; c = 180 - a - b; if (c < 90 && c > 0) break; } }
      var arr = [a, b, c].sort(function () { return Math.random() - .5; });
      var names = ['直角三角形', '鈍角三角形', '銳角三角形'];
      return { kind: 'pick', q: '一個三角形的三個角是 <b>' + arr.join('°、') + '°</b>，依「角」來分，它是什麼三角形？', opts: names, a: t,
        ex: t === 0 ? '有一個角是 90°（直角），是<b>直角三角形</b>。' : t === 1 ? '有一個角比 90° 大（鈍角），是<b>鈍角三角形</b>。' : '三個角都比 90° 小（銳角），是<b>銳角三角形</b>。' };
    },
    triSide: function () {
      var opts = ['正三角形', '等腰三角形', '三條邊不一樣長的三角形'], r = Math.random(), x, y, z;
      if (r < .3) { x = ri(3, 12); return { kind: 'pick', q: '三角形的三條邊都是 <b>' + x + ' 公分</b>，依「邊」來分，它是什麼三角形？', opts: opts, a: 0, ex: '三條邊都一樣長，是<b>正三角形</b>（也叫做等邊三角形），3 個角也都是 60°。' }; }
      if (r < .7) { x = ri(4, 12); do { y = ri(2, 2 * x - 1); } while (y === x); return { kind: 'pick', q: '三角形的三條邊是 <b>' + x + '、' + x + '、' + y + ' 公分</b>，依「邊」來分，它是什麼三角形？', opts: opts, a: 1, ex: '有 2 條邊一樣長，是<b>等腰三角形</b>。一樣長的兩條邊叫做腰，另一條叫做底邊。' }; }
      do { x = ri(3, 12); y = ri(3, 12); z = ri(3, 12); } while (x === y || y === z || x === z || x + y <= z || y + z <= x || x + z <= y);
      return { kind: 'pick', q: '三角形的三條邊是 <b>' + x + '、' + y + '、' + z + ' 公分</b>，依「邊」來分，它是什麼三角形？', opts: opts, a: 2, ex: '三條邊都不一樣長，是<b>三條邊不一樣長的三角形</b>。' };
    },
    triIso: function () {
      // 等腰三角形：兩個腰一樣長、兩個底角一樣大（課本活動 2）
      if (Math.random() < .5) { var L = ri(4, 12), B; do { B = ri(3, Math.min(12, 2 * L - 2)); } while (B === L);
        return { q: '等腰三角形 ABC 的一個腰是 <b>' + L + ' 公分</b>，底邊是 <b>' + B + ' 公分</b>。另一個腰是幾公分？', fields: [{ pre: '', unit: '公分' }], ans: [L], ex: '等腰三角形兩個<b>腰</b>一樣長，另一個腰也是 <b>' + L + ' 公分</b>。', dg: function (x) { return x[0] === B ? '底邊和腰不一樣：一樣長的是兩個腰。' : ''; } }; }
      var x = ri(6, 16) * 5; if (x === 60) x = 65;
      return { q: '等腰三角形的一個<b>底角</b>是 <b>' + x + '°</b>，另一個底角是幾度？', fields: [{ pre: '', unit: '度' }], ans: [x], ex: '等腰三角形的兩個<b>底角</b>一樣大，另一個底角也是 <b>' + x + '°</b>。', dg: function (v) { return v[0] === 180 - 2 * x ? '你算的是頂角。題目問的是另一個底角，兩個底角一樣大。' : ''; } };
    },
    triEqui: function () {
      var t = ri(0, 2), x = ri(3, 15);
      if (t === 0) return { q: '正三角形的每一個角是幾度？', fields: [{ pre: '', unit: '度' }], ans: [60], ex: '正三角形的 3 條邊一樣長，3 個角也一樣大，<b>都是 60°</b>。', dg: function (v) { return v[0] === 90 ? '正三角形沒有直角，每個角都是 60°。' : ''; } };
      if (t === 1) return { q: '正三角形的一條邊是 <b>' + x + ' 公分</b>，三條邊合起來（周長）是幾公分？', fields: [{ pre: '', unit: '公分' }], ans: [3 * x], ex: '正三角形 3 條邊一樣長：' + x + ' × 3 ＝ <b>' + (3 * x) + ' 公分</b>。', dg: function (v) { return v[0] === 2 * x ? '正三角形有 3 條邊，要乘 3。' : ''; } };
      return { q: '用一條 <b>' + (3 * x) + ' 公分</b>的繩子，剛好圍成一個正三角形。一條邊是幾公分？', fields: [{ pre: '', unit: '公分' }], ans: [x], ex: '3 條邊一樣長：' + (3 * x) + ' ÷ 3 ＝ <b>' + x + ' 公分</b>。', dg: function (v) { return v[0] === 3 * x * 3 ? '繩子是 3 條邊合起來的長度，要除以 3。' : ''; } };
    },
    /* 找錯小偵探：小明的算法裡，第一個錯在哪一步？ */
    spotMul: function () {
      var a = ri(101, 999), b = ri(12, 98); if (b % 10 === 0) b++;
      var u = b % 10, tn = Math.floor(b / 10), p1 = a * u, p2 = a * tn * 10, q1 = p1, q2 = p2, s;
      var carries = []; String(a).split('').reverse().reduce(function (c, ch, i) { var x = +ch * u + c; if (x >= 10) carries.push(Math.floor(x / 10) * Math.pow(10, i + 1)); return Math.floor(x / 10); }, 0);
      var e = ri(carries.length ? 0 : 1, 2);
      if (e === 0) q1 = p1 - pick(carries.filter(function (v) { return v < p1; }).concat([carries[0]])); // 漏加一個進位
      if (e === 1) q2 = a * tn; // 第二行沒有往左移
      s = q1 + q2; if (e === 2) s = p1 + p2 + pick([-1, 1]) * pick([100, 1000]);
      if (q1 <= 0 || s <= 0) return GEN.spotMul();
      var parts = ['① ' + a + ' × ' + u + ' ＝ ' + q1, '② ' + a + ' × ' + tn + '0 ＝ ' + q2, '③ ' + q1 + ' ＋ ' + q2 + ' ＝ ' + s];
      var fix = ['① ' + a + ' × ' + u + ' ＝ ' + p1 + '（有一位的進位漏加了）', '② ' + a + ' × ' + tn + '0 ＝ ' + p2 + '（乘十位要往左移一位，後面補 0）', '③ ' + p1 + ' ＋ ' + p2 + ' ＝ ' + (p1 + p2)][e];
      return { kind: 'spot', block: true, q: '小明算 <b class="num">' + a + ' × ' + b + '</b>，他第一個算錯的是哪一步？', parts: parts, bad: e, fix: fix, ex: '正確答案是 <b>' + (a * b) + '</b>。' };
    },
    spotKm: function () {
      var km = ri(2, 15), m = pick([ri(1, 9) * 10, ri(11, 99), ri(101, 999)]), ans = km * 1000 + m, e = ri(0, 1), w1 = km * 1000, w3 = ans;
      if (e === 0) { w1 = km * 100; w3 = w1 + m; }
      else w3 = m < 100 ? +(String(km) + String(m)) : ans + 100;
      var parts = ['① ' + km + ' 公里 ＝ ' + w1 + ' 公尺', '② ' + w1 + ' 公尺 ＋ ' + m + ' 公尺', '③ ＝ ' + w3 + ' 公尺'];
      var fix = e === 0 ? '① ' + km + ' 公里 ＝ ' + (km * 1000) + ' 公尺（1 公里 ＝ 1000 公尺）' : '③ ＝ ' + ans + ' 公尺（' + (km * 1000) + ' ＋ ' + m + '）';
      return { kind: 'spot', block: true, q: '小明把 <b class="num">' + km + ' 公里 ' + m + ' 公尺</b> 換成公尺，他第一個算錯的是哪一步？', parts: parts, bad: e === 0 ? 0 : 2, fix: fix, ex: '正確答案是 <b>' + ans + ' 公尺</b>。' };
    },
    spotAngle: function () {
      var a = ri(4, 16) * 5, e = ri(0, 1), base = e === 0 ? 90 : 180, res = base - a;
      if (e === 1) res = 180 - a + pick([-10, 10]);
      var parts = ['① 一條直線是平角，平角是 ' + base + '°', '② 另一個角 ＝ ' + base + '° － ' + a + '°', '③ ＝ ' + res + '°'];
      var fix = e === 0 ? '① 平角是 180°（90° 是直角）' : '③ 180° － ' + a + '° ＝ ' + (180 - a) + '°';
      return { kind: 'spot', block: true, q: '一條直線被分成兩個角，一個是 <b>' + a + '°</b>。小明算另一個角，他第一個錯的是哪一步？', parts: parts, bad: e === 0 ? 0 : 2, fix: fix, ex: '另一個角是 <b>' + (180 - a) + '°</b>。' };
    },
    spotBig: function () {
      var n, hi, lo;
      do { n = bigNum(ri(7, 8), .35); hi = Math.floor(n / 1e4); lo = n % 1e4; } while (!lo || (lo >= 1000 && readNum(lo).indexOf('零') < 0));
      var e = ri(0, 1), wl = String(lo).padStart(4, '0'), wn = String(n);
      if (e === 0) { wl = lo < 1000 ? String(lo) : String(lo).replace(/(\d)0/, '$1'); wn = String(hi) + wl; } // 常見錯誤：萬後面沒補滿 4 位，或把「零」漏掉
      else wn = String(hi) + String(lo);
      if (e === 1 && wn === String(n)) return GEN.spotBig();
      var loTxt = (lo < 1000 ? '零' : '') + readNum(lo).replace(/^零/, '');
      var parts = ['① 「' + readNum(hi) + '萬」→ ' + hi + ' 萬', '② 「' + loTxt + '」→ ' + wl, '③ 合起來 → ' + grp(+wn)];
      var fix = e === 0 ? '② 「' + loTxt + '」要寫成 ' + String(lo).padStart(4, '0') + '（萬後面一定有 4 位，沒有的位補 0）' : '③ 合起來是 ' + grp(n) + '（萬後面要有 4 位：' + String(lo).padStart(4, '0') + '）';
      return { kind: 'spot', block: true, q: '小明把「<b>' + readNum(n) + '</b>」寫成數字，他第一個錯的是哪一步？', parts: parts, bad: e === 0 ? 1 : 2, fix: fix, ex: '正確答案是 <b>' + grp(n) + '</b>。' };
    },
    /* 拖曳：國語部件拼字 */
    parts: function (card) {
      var pool = PARTS.filter(function (p) { return p[1] !== card.c; }), wa = pool.filter(function (p) { return p[3] !== card.a; }).sort(function () { return Math.random() - .5; })[0], wb = pool.filter(function (p) { return p[4] !== card.b; }).sort(function () { return Math.random() - .5; })[0];
      var k = card.tx ? card.tx.indexOf(card.c) : -1;
      return { kind: 'drag', mode: 'char', lay: card.lay, q: '看注音，用部件拼出國字：' + (k >= 0 ? '<span class="dsent">' + card.tx.slice(0, k) + '<b>（' + card.zy + '）</b>' + card.tx.slice(k + 1) + '</span>' : '<b>' + card.zy + '</b>'),
        slots: card.lay === 'lr' ? [{ id: 'a', label: '左' }, { id: 'b', label: '右' }] : [{ id: 'a', label: '上' }, { id: 'b', label: '下' }],
        items: [{ id: 1, html: card.a, slot: 'a' }, { id: 2, html: card.b, slot: 'b' }, { id: 3, html: wa[3], slot: '' }, { id: 4, html: wb[4], slot: '' }].sort(function () { return Math.random() - .5; }),
        need: 2, done: '<span class="dbig">' + card.c + '</span>　' + card.zy, ex: '「' + card.c + '」是' + (card.lay === 'lr' ? '左邊「' + card.a + '」、右邊「' + card.b + '」' : '上面「' + card.a + '」、下面「' + card.b + '」') + '。' };
    },
    /* 拖曳：魚的身體構造（課本 2-3 的圖示名稱），每次放 4 個 */
    fishParts: function () {
      var P = [['口', 9, 52], ['鰓蓋', 30, 50], ['背鰭', 47, 12], ['尾鰭', 91, 50], ['臀鰭', 66, 84], ['胸鰭', 38, 66], ['腹鰭', 50, 86]];
      var pick4 = P.slice().sort(function () { return Math.random() - .5; }).slice(0, 4);
      return { kind: 'drag', mode: 'board', board: 'fish', q: '把名稱拖到魚身上正確的位置（也可以先點名稱，再點位置）。',
        slots: pick4.map(function (p) { return { id: p[0], x: p[1], y: p[2] }; }), items: pick4.map(function (p, i) { return { id: i + 1, html: p[0], slot: p[0] }; }).sort(function () { return Math.random() - .5; }),
        need: 4, ex: '魚用鰓呼吸：口張開、鰓蓋閉合，水由口進入魚鰓。魚透過鰭擺動游泳，身上有背鰭、尾鰭、臀鰭、胸鰭、腹鰭。' };
    },
    /* 拖曳：水生植物放到池塘裡正確的地方 */
    pondPlants: function () {
      var fl = pick(['布袋蓮', '大萍']);
      return { kind: 'drag', mode: 'board', board: 'pond', q: '把植物拖到池塘裡它生長的地方。',
        slots: [{ id: 't', x: 14, y: 30, w: 24, label: '挺水性：葉挺出水面' }, { id: 'f', x: 40, y: 49, w: 24, label: '浮葉性：葉片平貼水面，根在土裡' }, { id: 'p', x: 66, y: 49, w: 24, label: '漂浮性：浮在水面，根漂著' }, { id: 's', x: 78, y: 78, w: 22, label: '沉水性：整株在水面下' }],
        items: [{ id: 1, html: '蓮', slot: 't' }, { id: 2, html: '睡蓮', slot: 'f' }, { id: 3, html: fl, slot: 'p' }, { id: 4, html: '水蘊草', slot: 's' }].sort(function () { return Math.random() - .5; }),
        need: 4, ex: '蓮是挺水性、睡蓮是浮葉性、' + fl + '是漂浮性、水蘊草是沉水性。' };
    },
    /* 拖曳：三角形分類籃子 */
    triSort: function () {
      var mk = function (t) { var a, b, c; if (t === 0) { a = 90; b = ri(5, 12) * 5; c = 90 - b; } else if (t === 1) { a = ri(20, 26) * 5; b = ri(4, Math.floor((180 - a) / 5) - 4) * 5; c = 180 - a - b; } else { do { a = ri(10, 17) * 5; b = ri(10, 17) * 5; c = 180 - a - b; } while (c >= 90 || c < 30); } return [a, b, c]; };
      var types = [0, 1, 2].sort(function () { return Math.random() - .5; }); types.push(ri(0, 2));
      return { kind: 'drag', mode: 'baskets', q: '看三個角的度數，把三角形放進正確的籃子。',
        slots: [{ id: '2', label: '銳角三角形' }, { id: '0', label: '直角三角形' }, { id: '1', label: '鈍角三角形' }],
        items: types.map(function (t, i) { return { id: i + 1, tri: mk(t), slot: String(t) }; }), need: 4,
        ex: '有一個直角（90°）是直角三角形；有一個鈍角（比 90° 大）是鈍角三角形；三個角都是銳角（比 90° 小）是銳角三角形。' };
    },
    /* 自然：看月相猜農曆 */
    moon: function () {
      var P = [[40, '初三、初四'], [90, '初七、初八'], [180, '十五、十六'], [270, '廿二、廿三']], i = ri(0, 3);
      var ang = {}; P.forEach(function (p) { ang[p[1]] = p[0]; });
      return { kind: 'pick', img: moonSVG(P[i][0], 120), q: '看到這樣的月亮，大約是農曆哪幾天？', opts: P.map(function (p) { return p[1]; }), a: i, wi: { t: 'moon', ang: ang },
        ex: ['初三、初四是彎彎的鐮刀月，右邊亮。', '初七、初八是上弦月，右半邊亮。', '十五、十六月亮最圓，課本叫做「望」。', '廿二、廿三是下弦月，左半邊亮。'][i] };
    },
    /* 自然：這種生物住在哪一種水域？ */
    water: function () {
      var W = [['水田', ['泥鰍', '石田螺', '浮萍', '水稻'], ['海龜', '小丑魚', '海藻']], ['生態池', ['香蒲', '布袋蓮', '褐樹蛙', '蓋斑鬥魚'], ['海龜', '小丑魚', '海藻']],
        ['河川', ['苦花魚', '拉氏清溪蟹', '臺灣水龍'], ['海龜', '小丑魚', '水稻']], ['海洋', ['海龜', '小丑魚', '海藻'], ['泥鰍', '石田螺', '水稻', '苦花魚', '香蒲']]];
      var w = pick(W), right = pick(w[1]), opts = [right].concat(w[2].slice().sort(function () { return Math.random() - .5; }).slice(0, 2));
      return { kind: 'pick', q: '課本到<b>' + w[0] + '</b>調查時，看到了下面哪一種生物？', opts: opts, a: 0, ex: '課本在' + w[0] + '看到：' + w[1].join('、') + '。' };
    },
    /* ===== 第 7 單元 小數（課本 p.85～98） ===== */
    decGrid: function () {
      var k = pick([ri(1, 9), ri(1, 9) * 10, ri(11, 99), ri(11, 99), ri(11, 99)]), whole = Math.random() < .15, h = k + (whole ? 100 : 0);
      var pic = (whole ? gridSVG(100, 110) + ' ' : '') + gridSVG(k, 110);
      return decQ('一張正方形色紙平分成 100 格，塗色的部分是幾張？<div class="qimg">' + pic + '</div>', h, '張',
        '1 格是 1/100 張，也就是 <b>0.01 張</b>。' + (whole ? '1 整張再加 ' : '') + k + ' 格是 ' + k + ' 個 0.01，' + (whole ? '合起來是 ' : '是 ') + '<b>' + fmtD(h) + ' 張</b>。',
        function (r, x) { if (x === k || x === h) return '1 格是 0.01 張：' + k + ' 格是 ' + k + ' 個 0.01，要寫成小數。'; if (k < 10 && r === k * 10) return k + ' 格是 ' + k + ' 個 0.01，是 0.0' + k + '；0.' + k + ' 要塗 ' + (k * 10) + ' 格（' + k + ' 整條）。'; if (r === Math.floor(k / 10) * 10 + (whole ? 100 : 0) && k % 10) return '別忘了零散的 ' + (k % 10) + ' 格，每格是 0.01。'; return ''; });
    },
    decBuild: function () {
      var a = Math.random() < .15 ? ri(10, 20) : ri(0, 9), b = Math.random() < .25 ? 0 : ri(1, 9), c = Math.random() < .3 ? ri(10, 19) : ri(1, 9), h = a * 100 + b * 10 + c;
      var parts = []; if (a) parts.push(a + ' 個 1'); if (b) parts.push(b + ' 個 0.1'); parts.push(c + ' 個 0.01');
      return decQ('<b>' + (parts.length > 1 ? parts.slice(0, -1).join('、') + ' 和 ' + parts[parts.length - 1] : parts[0]) + '</b> 合起來是多少？', h, '',
        (c >= 10 ? c + ' 個 0.01 是 ' + fmtD(c) + '：10 個 0.01 換成 1 個 0.1。' : '') + '1 記在個位、0.1 記在十分位、0.01 記在百分位，合起來是 <b>' + fmtD(h) + '</b>。',
        function (r, x) { if (c >= 10 && r === a * 100 + b * 10 + c % 10) return '十分位忘了加上換來的 1 個 0.1（10 個 0.01 ＝ 0.1）。'; if (!b && c < 10 && r === a * 100 + c * 10) return '沒有 0.1 的時候，十分位要寫 0：' + fmtD(h) + '。'; if (c >= 10 && String(x).indexOf(String(c)) > 0) return c + ' 個 0.01 是 ' + fmtD(c) + '，不能直接把 ' + c + ' 接在後面。'; return ''; });
    },
    decSplit: function () {
      var a = ri(1, 20), b = Math.random() < .3 ? 0 : ri(1, 9), c = Math.random() < .3 ? 0 : ri(1, 9); if (!b && !c) c = ri(1, 9);
      var h = a * 100 + b * 10 + c, rev = Math.random() < .3;
      var f = rev ? [{ pre: '', unit: '個 0.01' }, { pre: '', unit: '個 0.1' }, { pre: '', unit: '個 1' }] : [{ pre: '', unit: '個 1' }, { pre: '', unit: '個 0.1' }, { pre: '', unit: '個 0.01' }];
      var ans = rev ? [c, b, a] : [a, b, c];
      return { q: '<b class="num">' + fmtD(h) + '</b> 是幾個' + (rev ? ' 0.01、幾個 0.1 和幾個 1' : ' 1、幾個 0.1 和幾個 0.01') + ' 合起來的？', fields: f, ans: ans,
        ex: fmtD(h) + '：個位是 ' + a + '、十分位是 ' + b + '、百分位是 ' + c + '，所以是 ' + a + ' 個 1、' + b + ' 個 0.1 和 ' + c + ' 個 0.01。',
        dg: function (v) { if (rev && v[0] === a && v[2] === c) return '看清楚每一格問的是 0.01、0.1 還是 1：這一題的順序是倒過來的。'; if (!c && (rev ? v[0] : v[2]) === b) return fmtD(h) + ' 的百分位是 0，所以有 0 個 0.01；' + b + ' 是 0.1 的個數。'; if (!b && (rev ? v[1] : v[1]) === c) return '十分位是 0，' + c + ' 在百分位，是 ' + c + ' 個 0.01。'; return ''; } };
    },
    decCount: function () {
      if (Math.random() < .5) { var n = pick([ri(1, 99), ri(1, 9) * 10, 100]);
        return decQ('<b>' + n + ' 個 0.01</b> 合起來是多少？', n, '', n + ' 個 0.01 是 <b>' + fmtD(n) + '</b>' + (n % 10 === 0 ? '（' + (n / 10) + ' 個 0.1' + (n === 100 ? '，就是 1' : '') + '）' : '') + '。',
          function (r, x) { if (x === n) return '是 ' + n + ' 個 0.01，要寫成小數。'; if (n % 10 === 0 && r === n / 10) return '10 個 0.01 是 0.1，' + n + ' 個 0.01 是 ' + (n / 10) + ' 個 0.1，就是 ' + fmtD(n) + '。'; return ''; }); }
      var m = pick([ri(1, 99), ri(1, 9) * 10]);
      return { q: '<b class="num">' + fmtD(m) + '</b> 是幾個 0.01？', fields: [{ pre: '', unit: '個' }], ans: [m], ex: fmtD(m) + ' 是 <b>' + m + ' 個 0.01</b>' + (m % 10 === 0 ? '（' + (m / 10) + ' 整條，每條 10 格）' : '') + '。',
        dg: function (v) { if (m % 10 === 0 && v[0] === m / 10) return fmtD(m) + ' 是 ' + (m / 10) + ' 個 0.1，也就是 ' + m + ' 個 0.01。'; return ''; } };
    },
    decPlace: function () {
      var d; do { d = [ri(1, 9), ri(0, 9), ri(1, 9), ri(1, 9)]; } while (new Set(d).size < 4);
      var h = d[0] * 1000 + d[1] * 100 + d[2] * 10 + d[3], k = ri(0, 3), nm = ['十位', '個位', '十分位', '百分位'][k];
      return { q: '<b class="num">' + fmtD(h) + '</b> 的<b>' + nm + '</b>數字是多少？', fields: [{ pre: '', unit: '' }], ans: [d[k]],
        ex: '小數點左邊是個位、十位；右邊第 1 位是十分位、第 2 位是百分位。' + fmtD(h) + ' 的' + nm + '是 <b>' + d[k] + '</b>。',
        dg: function (v) { var i = d.indexOf(v[0]); if (i < 0) return ''; if (k === 2 && i === 0) return '十位在小數點左邊第 2 位，十分位在小數點右邊第 1 位。'; if (k === 3 && i === 2) return '百分位是小數點右邊第 2 位，記的是有幾個 0.01。'; if (k === 1 && i === 0) return '個位緊貼在小數點的左邊。'; return '一位一位數：十位、個位、小數點、十分位、百分位。'; } };
    },
    decRead: function () {
      var w = pick([ri(1, 9), ri(10, 99), 0]), f = pick([ri(1, 9), ri(1, 9) * 10, ri(11, 99), ri(1, 9)]), h = w * 100 + f; if (f % 10 === 0 && Math.random() < .5) h = w * 100 + ri(1, 9);
      var s = fmtD(h), dec = s.split('.')[1] || '';
      if (Math.random() < .5) {
        var right = readD(h), opts = [right], wr = [];
        if (dec.length === 2 && dec[0] !== '0') wr.push(readNum(w) + '點' + readNum(+dec)); // 小數部分當整數讀
        if (w >= 10) wr.push(String(w).split('').map(function (c) { return DIG[+c]; }).join('') + '點' + dec.split('').map(function (c) { return DIG[+c]; }).join(''));
        if (dec.indexOf('0') === 0) wr.push(readNum(w) + '點' + DIG[+dec[1]]);
        wr.push(readNum(w) + '點' + dec.split('').reverse().map(function (c) { return DIG[+c]; }).join(''));
        wr.forEach(function (x) { if (opts.indexOf(x) < 0 && opts.length < 3) opts.push(x); });
        if (opts.length < 2) return GEN.decRead();
        return { kind: 'pick', q: '<b class="num">' + s + '</b> 怎麼讀？', opts: opts, a: 0, ex: '整數部分照平常讀，小數點讀「點」，小數點後面<b>一個數字一個數字</b>讀，0 讀「零」：' + s + ' 讀作<b>' + right + '</b>。' };
      }
      var opts2 = [s], alt = [];
      if (dec.length === 2 && dec[0] === '0') { alt.push(w + '.' + dec[1]); alt.push(String(w * 10) + '.' + dec[1]); }
      alt.push(fmtD(h * 10 > 9999 ? h + 1 : h * 10)); alt.push(String(w) + String(dec));
      alt.forEach(function (x) { if (opts2.indexOf(x) < 0 && opts2.length < 3 && x !== s) opts2.push(x); });
      return { kind: 'pick', q: '「<b>' + readD(h) + '</b>」要怎麼寫？', opts: opts2, a: 0, ex: '「點」前面是整數部分，「點」後面一個字是一位：' + readD(h) + ' 寫成 <b>' + s + '</b>。' };
    },
    decCm: function () {
      var t = ri(0, 2), cm, ex, q;
      if (t === 0) { cm = pick([ri(1, 9), ri(1, 9) * 10, ri(11, 99)]); q = '<b>' + cm + ' 公分</b> ＝ ？ 公尺'; }
      else if (t === 1) { cm = ri(101, 300); q = '<b>' + cm + ' 公分</b> ＝ ？ 公尺'; }
      else { var a = ri(1, 3), b = Math.random() < .35 ? ri(1, 9) : ri(11, 99); cm = a * 100 + b; q = '<b>' + a + ' 公尺 ' + b + ' 公分</b> ＝ ？ 公尺'; }
      return decQ(q, cm, '公尺', '1 公分 ＝ 0.01 公尺。' + cm + ' 公分是 ' + cm + ' 個 0.01 公尺，就是 <b>' + fmtD(cm) + ' 公尺</b>。',
        function (r, x) { if (x === cm) return '題目問的是公尺：1 公分是 0.01 公尺。'; var b = cm % 100; if (b < 10 && r === Math.floor(cm / 100) * 100 + b * 10) return b + ' 公分是 0.0' + b + ' 公尺，要寫在百分位。'; if (r * 10 === cm) return '100 公分才是 1 公尺：' + cm + ' 公分是 ' + fmtD(cm) + ' 公尺。'; return ''; });
    },
    decM: function () {
      var h = pick([ri(101, 399), ri(11, 39) * 10]), a = Math.floor(h / 100), b = h % 100;
      if (Math.random() < .3) { var s = pick([ri(1, 9) * 10, ri(11, 99), ri(1, 9)]); return { q: '<b>' + fmtD(s) + ' 公尺</b> ＝ ？ 公分', fields: [{ pre: '', unit: '公分' }], ans: [s], ex: fmtD(s) + ' 公尺是 ' + s + ' 個 0.01 公尺，就是 <b>' + s + ' 公分</b>。', dg: function (v) { return s % 10 === 0 && v[0] === s / 10 ? fmtD(s) + ' 公尺是 ' + s + ' 個 0.01 公尺，所以是 ' + s + ' 公分。' : ''; } }; }
      return { q: '<b>' + fmtD(h) + ' 公尺</b> ＝ ？ 公尺 ？ 公分', fields: [{ pre: '', unit: '公尺' }, { pre: '', unit: '公分' }], ans: [a, b],
        ex: '個位的 ' + a + ' 是 ' + a + ' 公尺；小數部分是 ' + b + ' 個 0.01 公尺，就是 ' + b + ' 公分。答案是 <b>' + a + ' 公尺 ' + b + ' 公分</b>。',
        dg: function (v) { if (b % 10 === 0 && v[1] === b / 10) return '十分位的 ' + (b / 10) + ' 是 ' + (b / 10) + ' 個 0.1 公尺，就是 ' + b + ' 公分。'; if (b < 10 && v[1] === b * 10) return '百分位的 ' + b + ' 是 ' + b + ' 個 0.01 公尺，就是 ' + b + ' 公分。'; return ''; } };
    },
    decCmp: function () {
      var t = ri(0, 4), A, B, sa, sb;
      if (t === 0) { var w = ri(0, 9), x = ri(1, 9); A = w * 100 + x * 10; B = w * 100 + (x - 1) * 10 + ri(1, 9); if (x === 1) B = w * 100 + ri(1, 9); }
      else if (t === 1) { var d = [ri(1, 9), ri(1, 9), ri(1, 9)]; A = d[0] * 1000 + d[1] * 100 + d[2] * 10; B = d[0] * 100 + d[1] * 10 + d[2]; }
      else if (t === 2) { A = ri(10, 12) * 100 + ri(1, 9) * 10; B = ri(8, 9) * 100 + ri(50, 99); }
      else if (t === 3) { A = ri(1, 20) * 100 + ri(1, 9) * 10; B = A; }
      else { A = ri(1, 9) * 100 + ri(1, 9); B = Math.floor(A / 100) * 100 + (A % 100) * 10; if (Math.random() < .4) B = A; }
      if (Math.random() < .5) { var tt = A; A = B; B = tt; }
      sa = t === 3 && Math.random() < .5 ? fmtD(A) + '0' : (t === 4 && Math.random() < .5 ? readD(A) : fmtD(A)); sb = fmtD(B);
      if (t === 3 && sa === fmtD(A) && A % 10 === 0) sa = fmtD(A) + '0';
      var a = A > B ? 0 : A < B ? 1 : 2;
      var p2s = function (x) { return Math.floor(x / 100) + '.' + ('0' + x % 100).slice(-2); };
      var why = t === 0 ? '位數不一樣時，在後面補 0 再比：' + p2s(A) + ' 和 ' + p2s(B) + '，比百分之幾就看得出來。'
        : t === 1 ? '數字一樣，但小數點的位置不一樣：' + fmtD(Math.max(A, B)) + ' 的整數部分比較大。'
          : t === 2 ? '先比整數部分：' + Math.floor(Math.max(A, B) / 100) + ' 比 ' + Math.floor(Math.min(A, B) / 100) + ' 大，後面的小數就不用比了。'
            : t === 3 ? '末位的 0 可以省略：' + sa + ' 和 ' + sb + ' 一樣大。' : '把國字讀法先寫成數字再比。';
      return { kind: 'pick', q: '在 □ 裡填 ＞、＜ 或 ＝：<div class="q2"><b class="num">' + sa + '</b> □ <b class="num">' + sb + '</b></div>', opts: ['＞', '＜', '＝'], a: a, ex: '先比整數部分，再比十分位，再比百分位。' + why };
    },
    decSeq: function () {
      var st = Math.random() < .8 ? 1 : 10, dir = Math.random() < .7 ? 1 : -1, cross = Math.random() < .5, base;
      if (st === 1) base = cross ? pick([ri(0, 9) * 10 + 7, ri(1, 3) * 100 - 3]) + (dir < 0 ? 6 : 0) : ri(1, 290);
      else base = ri(1, 25) * 10 + (Math.random() < .5 ? ri(1, 9) : 0);
      if (dir < 0) base += st * 5;
      var arr = []; for (var i = 0; i < 5; i++) arr.push(base + dir * st * i);
      if (arr.some(function (x) { return x <= 0; })) return GEN.decSeq();
      var p = ri(1, 4); if (cross) { for (var j = 1; j < 5; j++) if (arr[j] % 10 === 0) { p = j; break; } }
      return decQ('依序' + (dir > 0 ? '加' : '減') + '下去，□ 是多少？<div class="seq">' + arr.map(function (x, i) { return i === p ? '<span class="blank">□</span>' : fmtD(x); }).join('、') + '</div>', arr[p], '',
        '每次' + (dir > 0 ? '多' : '少') + ' ' + fmtD(st) + '，所以 □ 是 <b>' + fmtD(arr[p]) + '</b>。' + (arr[p] % 10 === 0 ? '（末位的 0 可以省略）' : ''),
        function (r, x) { if (dir > 0 && r < arr[p - 1]) return fmtD(arr[p - 1]) + ' 再多 ' + fmtD(st) + '，是 ' + fmtD(arr[p]) + '：' + (arr[p] % 100 === 0 ? '100 個 0.01 就是 1。' : '10 個 0.01 就是 0.1。'); if (dir < 0 && r > arr[p - 1]) return '數字越來越小喔，' + fmtD(arr[p - 1]) + ' 少 ' + fmtD(st) + ' 是 ' + fmtD(arr[p]) + '。'; return '先算相鄰兩個數差多少。'; });
    },
    decAdd: function () {
      var t = ri(0, 4), a, b;
      if (t === 0) { a = ri(101, 899); b = ri(101, 899); }
      else if (t === 1) { a = ri(1, 9) * 100 + ri(1, 9) * 10; b = ri(101, 999); }
      else if (t === 2) { a = ri(11, 99); b = ri(2, 20) * 100; }
      else if (t === 3) { a = ri(101, 899); b = (Math.ceil(a / 100) + ri(0, 3)) * 100 - a; if (b < 11) b += 100; }
      else { a = ri(1, 9) * 100 + ri(1, 9) * 10; b = ri(10, 20) * 100 + ri(11, 99); }
      if (a % 100 === 0 && b % 100 === 0) return GEN.decAdd();
      if (Math.random() < .5) { var t2 = a; a = b; b = t2; }
      var h = a + b, sa = fmtD(a), sb = fmtD(b);
      var rightAlign = function (x, y) { var dx = sx(x), dy = sx(y), m = Math.max(dx, dy); return Math.round((x / Math.pow(10, 2 - dx) + y / Math.pow(10, 2 - dy)) * Math.pow(10, 2 - m)); }; // 末位對齊的錯誤
      function sx(x) { var s = fmtD(x); return s.indexOf('.') < 0 ? 0 : s.split('.')[1].length; }
      var wrong = sx(a) !== sx(b) ? rightAlign(a, b) : -1;
      return decQ('<b class="num">' + sa + ' ＋ ' + sb + '</b> ＝ ？', h, '', '直式要<b>小數點對齊</b>（' + (sx(a) === 0 || sx(b) === 0 ? '整數的個位對齊個位' : '同一位對齊') + '），從百分位開始加，滿 10 要進 1。答案是 <b>' + fmtD(h) + '</b>' + (h % 10 === 0 && h % 100 ? '（末位的 0 可以省略）' : '') + '。',
        function (r) { if (r === wrong) return '直式要小數點對齊，不是最後一位對齊：' + (sx(a) < sx(b) ? sa : sb) + ' 的位要對齊另一個數的同一位。'; if (r === h - 10 || r === h - 100) return '有一位加起來滿 10，要進 1 到左邊那一位。'; return ''; });
    },
    decSub: function () {
      var t = ri(0, 4), a, b;
      if (t === 0) { b = ri(101, 499); a = b + ri(101, 399); }
      else if (t === 1) { a = ri(3, 9) * 100 + ri(0, 4) * 10 + ri(0, 4); b = ri(101, a - 50); }
      else if (t === 2) { a = ri(3, 9) * 100 + ri(1, 9) * 10; b = ri(101, a - 11); if (b % 10 === 0) b++; }
      else if (t === 3) { a = ri(3, 20) * 100; b = ri(101, a - 11); }
      else { a = ri(10, 19) * 100 + ri(11, 99); b = ri(101, 999); }
      if (b >= a || (a % 100 === 0 && b % 100 === 0) || b % 10 === 0 && t === 3) return GEN.decSub();
      var h = a - b, sa = fmtD(a), sb = fmtD(b);
      // 大減小：每一位都用大的減小的
      var da = ('000' + a).slice(-4).split('').map(Number), db = ('000' + b).slice(-4).split('').map(Number), big = +da.map(function (x, i) { return Math.abs(x - db[i]); }).join('');
      return decQ('<b class="num">' + sa + ' － ' + sb + '</b> ＝ ？', h, '', '直式小數點對齊' + (t >= 2 ? '，缺的位先補 0（' + sa + ' 想成 ' + (a % 100 === 0 ? sa + '.00' : sa + '0') + '）' : '') + '，從百分位開始減，不夠減就向左邊借 1，換成 10 個。答案是 <b>' + fmtD(h) + '</b>。',
        function (r) { if (r === big && big !== h) return '不夠減的時候不能倒過來減，要向左邊那一位借 1，換成 10 個再減。'; if (r === h + 10 || r === h + 100 || r === h + 110) return '借給右邊以後，這一位要少 1，可以劃斜線寫上新的數。'; return ''; });
    },
    decWord: function () {
      var t = ri(0, 3), a = ri(101, 599), b = ri(51, 399), it = pick(['緞帶', '彩帶', '繩子']), u = '公尺', h, q, ex, wrongOp;
      if (t === 0) { q = '一條' + it + '剪掉 <b>' + fmtD(b) + ' ' + u + '</b> 以後，還剩 <b>' + fmtD(a) + ' ' + u + '</b>。原來長幾公尺？'; h = a + b; wrongOp = Math.abs(a - b); ex = '剪掉的加上剩下的，才是原來的長度：' + fmtD(b) + ' ＋ ' + fmtD(a) + ' ＝ <b>' + fmtD(h) + ' 公尺</b>。'; }
      else if (t === 1) { var w = pick(['糯米', '麵粉', '綠豆']); u = '公斤'; q = '媽媽用了 <b>' + fmtD(a) + ' 公斤</b>的' + w + '，又用了 <b>' + fmtD(b) + ' 公斤</b>，一共用了幾公斤？'; h = a + b; wrongOp = Math.abs(a - b); ex = '合起來用加法：' + fmtD(a) + ' ＋ ' + fmtD(b) + ' ＝ <b>' + fmtD(h) + ' 公斤</b>。'; }
      else if (t === 2) { u = '公尺'; var x = ri(101, 299), y = x + ri(11, 99); q = '跳遠比賽，第一個人跳 <b>' + fmtD(y) + ' 公尺</b>，第二個人跳 <b>' + fmtD(x) + ' 公尺</b>，兩人相差幾公尺？'; h = y - x; wrongOp = x + y; ex = '相差用減法，大的減小的：' + fmtD(y) + ' － ' + fmtD(x) + ' ＝ <b>' + fmtD(h) + ' 公尺</b>。'; }
      else { u = '公升'; var tot = ri(150, 450), dr = ri(51, tot - 21); q = '一瓶果汁有 <b>' + fmtD(tot) + ' 公升</b>，喝掉 <b>' + fmtD(dr) + ' 公升</b>，還剩幾公升？'; h = tot - dr; wrongOp = tot + dr; ex = '還剩多少用減法：' + fmtD(tot) + ' － ' + fmtD(dr) + ' ＝ <b>' + fmtD(h) + ' 公升</b>。'; }
      return decQ(q, h, u, ex, function (r) { if (r === wrongOp) return t === 0 ? '剪掉的加上剩下的，才是原來的長度，要用加法。' : t === 1 ? '合起來要用加法。' : '這一題要用減法。'; return ''; });
    },
    spotDecAdd: function () {
      var a, b; do { a = ri(101, 899); b = ri(101, 899); } while (a % 10 + b % 10 < 10 || Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 + 1 < 10 || a % 10 === 0 || b % 10 === 0);
      var h = a + b, e = ri(0, 2), s = function (x) { return fmtD(x); };
      var p1 = a % 10 + b % 10, p2 = Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 + 1, p3 = Math.floor(a / 100) + Math.floor(b / 100) + 1;
      var steps = ['① 小數點對齊寫好直式', '② 百分位 ' + (a % 10) + ' ＋ ' + (b % 10) + ' ＝ ' + p1 + '，寫 ' + (p1 % 10) + '，進 1', '③ 十分位 ' + (Math.floor(a / 10) % 10) + ' ＋ ' + (Math.floor(b / 10) % 10) + ' ＋ 1 ＝ ' + p2 + '，寫 ' + (p2 % 10) + '，進 1', '④ 個位 ' + Math.floor(a / 100) + ' ＋ ' + Math.floor(b / 100) + ' ＋ 1 ＝ ' + p3, '⑤ 答案 ' + s(h)];
      var fix;
      if (e === 0) { steps[2] = '③ 十分位 ' + (Math.floor(a / 10) % 10) + ' ＋ ' + (Math.floor(b / 10) % 10) + ' ＝ ' + (p2 - 1) + '，寫 ' + ((p2 - 1) % 10); fix = '③ 十分位要加上百分位進來的 1：＝ ' + p2 + '，寫 ' + (p2 % 10) + '，進 1'; }
      else if (e === 1) { steps[4] = '⑤ 答案 ' + (p3 * 10 + Math.floor((h % 100) / 10)) + '.' + (h % 10); fix = '⑤ 答案的小數點要和上面對齊點下來：' + s(h); }
      else { steps[0] = '① 兩個數靠右邊寫好直式（' + s(a) + ' 和 ' + s(b) + '）'; e = -1; }
      if (e === -1) return GEN.spotDecAdd();
      return { kind: 'spot', block: true, q: '小明用直式算 <b class="num">' + s(a) + ' ＋ ' + s(b) + '</b>，他第一個錯的是哪一步？', parts: steps, bad: e === 0 ? 2 : 4, fix: fix, ex: '正確答案是 <b>' + s(h) + '</b>。' };
    },
    spotDecSub: function () {
      var a = ri(3, 9) * 100 + ri(1, 9) * 10, b = ri(101, a - 20); if (b % 10 === 0) b++;
      var h = a - b, e = ri(0, 1), s = fmtD;
      var steps = ['① ' + s(a) + ' 補 0，寫成 ' + s(a) + '0', '② 百分位 0 不夠減 ' + (b % 10) + '，向十分位借 1：10 － ' + (b % 10) + ' ＝ ' + (10 - b % 10), '③ 再算十分位和個位', '④ 答案 ' + s(h)];
      var fix;
      if (e === 0) { steps[1] = '② 百分位 ' + (b % 10) + ' － 0 ＝ ' + (b % 10) + '（大的減小的）'; fix = '② 0 不夠減 ' + (b % 10) + '，要向十分位借 1，10 － ' + (b % 10) + ' ＝ ' + (10 - b % 10) + '，不能倒過來減'; }
      else { steps[0] = '① ' + s(a) + ' 補 0，寫成 ' + Math.floor(a / 100) + '.0' + ((a % 100) / 10); fix = '① 0 要補在最後面：' + s(a) + '0（十分位的數字不能動）'; }
      return { kind: 'spot', block: true, q: '小明用直式算 <b class="num">' + s(a) + ' － ' + s(b) + '</b>，他第一個錯的是哪一步？', parts: steps, bad: e === 0 ? 1 : 0, fix: fix, ex: '正確答案是 <b>' + s(h) + '</b>。' };
    },
    /* ===== 第 8 單元 整數四則計算（課本 p.99～114）：有括號先算括號；只有加減或只有乘除，由左往右；混合時先乘除後加減 ===== */
    ordAS: function () {
      var t = ri(0, 5), a, b, c, e, ans, lr, msg;
      for (var g = 0; g < 100; g++) {
        a = ri(30, 99); b = ri(5, 60); c = ri(5, 60); if (Math.random() < .2) b = ri(2, 9);
        if (t === 0) { e = a + ' ＋ ' + b + ' ＋ ' + c; ans = a + b + c; lr = -1; }
        else if (t === 1) { e = a + ' － ' + b + ' ＋ ' + c; ans = a - b + c; lr = a - (b + c); }
        else if (t === 2) { e = a + ' － ' + b + ' － ' + c; ans = a - b - c; lr = a - (b - c); }
        else if (t === 3) { a = Math.random() < .3 ? 100 : a; e = a + ' － (' + b + ' ＋ ' + c + ')'; ans = a - (b + c); lr = a - b + c; }
        else if (t === 4) { if (b < c) { var x = b; b = c; c = x; } e = a + ' － (' + b + ' － ' + c + ')'; ans = a - (b - c); lr = a - b - c; }
        else { if (b < c) { var y = b; b = c; c = y; } e = a + ' ＋ ' + b + ' － ' + c; ans = a + b - c; lr = -1; }
        if (ans >= 0 && a - b >= 0 && (lr < 0 || lr !== ans) && b !== c) break;
      }
      msg = t === 1 || t === 2 ? '沒有括號、只有加和減，要<b>由左往右</b>一步一步算：先算 ' + a + ' － ' + b + '。' : t >= 3 && t <= 4 ? '有括號要<b>先算括號裡的</b>。' : '只有加和減，由左往右一步一步算。';
      return { q: '<b class="num">' + e + '</b> ＝ ？', fields: [{ pre: '', unit: '' }], ans: [ans], ex: msg + '答案是 <b>' + ans + '</b>。',
        dg: function (v) { if (lr >= 0 && v[0] === lr) return t >= 3 ? '括號裡的要先算，不能由左往右直接算。' : '沒有括號時要由左往右算，不能先算右邊。'; if (Math.abs(v[0] - ans) === 10 || Math.abs(v[0] - ans) === 100) return '直式加減時，進位或借位漏了。'; return ''; } };
    },
    ordMD: function () {
      var t = ri(0, 4), a, b, c, e, ans, lr;
      for (var g = 0; g < 200; g++) {
        b = pick([ri(2, 9), ri(11, 25)]); c = pick([ri(2, 9), ri(11, 15)]);
        if (t === 0) { a = ri(3, 40) * c; e = a + ' × ' + b + ' ÷ ' + c; ans = a * b / c; lr = (b % c === 0) ? a * (b / c) : -1; }
        else if (t === 1) { var q = ri(2, 30); a = q * b; e = a + ' ÷ ' + b + ' × ' + c; ans = q * c; lr = a % (b * c) === 0 ? a / (b * c) : -1; }
        else if (t === 2) { var q2 = ri(2, 20); a = q2 * b * c; e = a + ' ÷ ' + b + ' ÷ ' + c; ans = q2; lr = b % c === 0 && a % (b / c) === 0 ? a / (b / c) : -1; }
        else if (t === 3) { var q3 = ri(2, 20); a = q3 * b * c; e = a + ' ÷ (' + b + ' × ' + c + ')'; ans = q3; lr = a / b * c; }
        else { var k = ri(2, 9); b = c * k; var q4 = ri(2, 40); a = q4 * k; e = a + ' ÷ (' + b + ' ÷ ' + c + ')'; ans = q4; lr = a % b === 0 ? a / b / c : -1; if (lr !== -1 && lr % 1) lr = -1; }
        if (a <= 999 && ans <= 1000 && ans === Math.round(ans) && b !== c && a !== b && lr !== ans) break;
      }
      return { q: '<b class="num">' + e + '</b> ＝ ？', fields: [{ pre: '', unit: '' }], ans: [ans],
        ex: (t <= 2 ? '只有乘和除，沒有括號，要<b>由左往右</b>算。' : '有括號要<b>先算括號裡的</b>。') + '答案是 <b>' + ans + '</b>。',
        dg: function (v) { if (lr >= 0 && v[0] === lr) return t <= 2 ? '沒有括號，乘除也要由左往右：先算左邊的那一步。' : '括號裡要先算，再用 ' + a + ' 去除。'; return ''; } };
    },
    ordMix: function () {
      var t = ri(0, 7), a, b, c, e, ans, lr;
      for (var g = 0; g < 200; g++) {
        if (t <= 3) { b = pick([ri(12, 99), ri(101, 249)]); c = ri(2, 9); } else { c = ri(2, 9); b = c * ri(4, 60); }
        a = pick([ri(20, 99), ri(101, 300), 100, 500, 1000]);
        var p = t <= 3 ? b * c : b / c;
        if (t === 0) { e = a + ' ＋ ' + b + ' × ' + c; ans = a + p; lr = (a + b) * c; }
        else if (t === 1) { e = a + ' － ' + b + ' × ' + c; ans = a - p; lr = (a - b) * c; }
        else if (t === 2) { e = b + ' × ' + c + ' ＋ ' + a; ans = p + a; lr = b * (c + a); }
        else if (t === 3) { e = b + ' × ' + c + ' － ' + a; ans = p - a; lr = b * (c - a); }
        else if (t === 4) { e = a + ' ＋ ' + b + ' ÷ ' + c; ans = a + p; lr = (a + b) % c ? -1 : (a + b) / c; }
        else if (t === 5) { e = a + ' － ' + b + ' ÷ ' + c; ans = a - p; lr = (a - b) % c || a < b ? -1 : (a - b) / c; }
        else if (t === 6) { e = b + ' ÷ ' + c + ' ＋ ' + a; ans = p + a; lr = -1; }
        else { e = b + ' ÷ ' + c + ' － ' + a; ans = p - a; lr = -1; }
        if (ans > 0 && ans <= 2000 && lr !== ans) break;
      }
      return { q: '<b class="num">' + e + '</b> ＝ ？', fields: [{ pre: '', unit: '' }], ans: [ans],
        ex: '加、減和' + (t <= 3 ? '乘' : '除') + '混在一起，要<b>先算' + (t <= 3 ? '乘' : '除') + '的部分</b>（' + (t <= 3 ? b + ' × ' + c + ' ＝ ' + p : b + ' ÷ ' + c + ' ＝ ' + p) + '），再算加、減。答案是 <b>' + ans + '</b>。',
        dg: function (v) { if (lr >= 0 && v[0] === lr) return '不能由左往右直接算：加減乘除混在一起時，× 和 ÷ 先算！'; return ''; } };
    },
    ordMixP: function () {
      var t = ri(0, 5), a, b, c, e, ans, np, inner;
      for (var g = 0; g < 300; g++) {
        a = ri(12, 99); b = ri(3, 60); c = ri(2, 9);
        if (t === 0) { inner = a + b; e = '(' + a + ' ＋ ' + b + ') × ' + c; ans = inner * c; np = a + b * c; }
        else if (t === 1) { if (a <= b) continue; inner = a - b; e = '(' + a + ' － ' + b + ') × ' + c; ans = inner * c; np = a - b * c; }
        else if (t === 2) { inner = a + b; if (inner % c) continue; e = '(' + a + ' ＋ ' + b + ') ÷ ' + c; ans = inner / c; np = b % c ? -1 : a + b / c; }
        else if (t === 3) { if (a <= b) continue; inner = a - b; if (inner % c) continue; e = '(' + a + ' － ' + b + ') ÷ ' + c; ans = inner / c; np = b % c ? -1 : a - b / c; }
        else if (t === 4) { var s = ri(5, 40), x = ri(2, s - 2); inner = s; b = x; c = s - x; a = s * ri(2, 20); e = a + ' ÷ (' + b + ' ＋ ' + c + ')'; ans = a / s; np = a % b ? -1 : a / b + c; }
        else { var d = ri(2, 30), y = ri(3, 40); inner = d; b = y + d; c = y; a = d * ri(2, 25); e = a + ' ÷ (' + b + ' － ' + c + ')'; ans = a / d; np = a % b ? -1 : a / b - c; }
        if (ans > 0 && ans <= 2000 && np !== ans && (np < 0 || np === Math.round(np))) break;
      }
      return { q: '<b class="num">' + e + '</b> ＝ ？', fields: [{ pre: '', unit: '' }], ans: [ans], ex: '有括號就<b>先算括號裡的</b>：括號裡是 ' + inner + '，再算下一步。答案是 <b>' + ans + '</b>。',
        dg: function (v) { if (np >= 0 && v[0] === np) return '有括號就先算括號裡的，這時候加法（減法）也要先算。'; if (v[0] === inner) return '括號算完還要再' + (t <= 1 ? '乘' : '除') + '喔。'; return ''; } };
    },
    ordSteps: function () {
      var Q = Math.random() < .5 ? GEN.ordMix() : GEN.ordMixP(), e = Q.q.replace(/<[^>]+>/g, '').replace(' ＝ ？', '');
      var m = e.match(/\(([^)]+)\)/), first, firstV;
      if (m) { first = m[1]; } else { var mm = e.match(/(\d+) ([×÷]) (\d+)/); first = mm[0]; }
      firstV = Function('return ' + first.replace(/×/g, '*').replace(/÷/g, '/').replace(/＋/g, '+').replace(/－/g, '-'))();
      var rest = e.replace(m ? '(' + first + ')' : first, String(firstV));
      var wrongFirst = -1, mw = e.replace(/[()]/g, '').match(/^(\d+) ([＋－×÷]) (\d+)/);
      if (mw) { var w = Function('return ' + mw[0].replace(/×/g, '*').replace(/÷/g, '/').replace(/＋/g, '+').replace(/－/g, '-'))(); if (w !== firstV) wrongFirst = w; }
      return { q: '用遞等式一步一步算：<div class="q2"><b class="num">' + e + '</b></div>先算的那一步是多少？最後答案是多少？', fields: [{ pre: '先算的 ＝', unit: '' }, { pre: '答案 ＝', unit: '' }], ans: [firstV, Q.ans[0]],
        ex: '<div class="steps">' + e + '<br>＝ ' + rest + '<br>＝ <b>' + Q.ans[0] + '</b></div>' + (m ? '有括號，先算括號裡的 ' + first + '。' : '先算 ' + first + '（先乘除後加減）。'),
        dg: function (v) { if (v[0] === wrongFirst) return '先算的應該是 ' + first + '，不是最左邊那一段。'; if (v[0] === firstV && v[1] !== Q.ans[0]) return '第一步對了！第二步再算一次：' + rest + '。'; return ''; } };
    },
    ordFirst: function () {
      var Q = pick([GEN.ordMix, GEN.ordMixP, GEN.ordAS, GEN.ordMD])(), e = Q.q.replace(/<[^>]+>/g, '').replace(' ＝ ？', '');
      var toks = e.replace(/[()]/g, '').split(' '), segs = [];
      for (var i = 0; i + 2 < toks.length; i += 2) segs.push(toks[i] + ' ' + toks[i + 1] + ' ' + toks[i + 2]);
      var m = e.match(/\(([^)]+)\)/), right;
      if (m) right = m[1]; else if (/[×÷]/.test(e) && /[＋－]/.test(e)) right = segs.filter(function (s) { return /[×÷]/.test(s); })[0]; else right = segs[0];
      var a = segs.indexOf(right); if (a < 0 || segs.length < 2) return GEN.ordFirst();
      var why = m ? '有括號，先算括號裡的。' : /[×÷]/.test(e) && /[＋－]/.test(e) ? '加減乘除混在一起，先乘除後加減。' : '只有加減（或只有乘除），由左往右算。';
      return { kind: 'pick', q: '這個算式要<b>先算哪一段</b>？<div class="q2"><b class="num">' + e + '</b></div>', opts: segs, a: a, ex: why + '所以先算 <b>' + right + '</b>。' };
    },
    ordSame: function () {
      var a = ri(20, 90), b = ri(4, 12), c = ri(2, 6), t = ri(0, 11), X, Y, same;
      var S = [[a + ' ＋ (' + b + ' × ' + c + ')', a + ' ＋ ' + b + ' × ' + c, 1], [(a + b * c) + ' － (' + (b * c) + ' ÷ ' + c + ')', (a + b * c) + ' － ' + (b * c) + ' ÷ ' + c, 1], ['(' + a + ' × ' + b + ') × ' + c, a + ' × ' + b + ' × ' + c, 1], ['(' + (a + b + c) + ' － ' + b + ') － ' + c, (a + b + c) + ' － ' + b + ' － ' + c, 1],
        ['(' + (a * c) + ' × ' + b + ') ÷ ' + c, (a * c) + ' × ' + b + ' ÷ ' + c, 1], [(a + b + c) + ' － (' + b + ' ＋ ' + c + ')', (a + b + c) + ' － ' + b + ' ＋ ' + c, 0], [(a + b) + ' － (' + b + ' － ' + c + ')', (a + b) + ' － ' + b + ' － ' + c, 0], [(a * b * c) + ' ÷ (' + b + ' × ' + c + ')', (a * b * c) + ' ÷ ' + b + ' × ' + c, 0],
        ['(' + a + ' ＋ ' + b + ') × ' + c, a + ' ＋ ' + b + ' × ' + c, 0], [a + ' × (' + b + ' ＋ ' + c + ')', a + ' × ' + b + ' ＋ ' + c, 0], [(a * (b + c)) + ' ÷ (' + b + ' ＋ ' + c + ')', (a * (b + c)) + ' ÷ ' + b + ' ＋ ' + c, 0], ['(' + (a + b * c) + ' － ' + b + ') ÷ ' + c, (a + b * c) + ' － ' + b + ' ÷ ' + c, 0]][t];
      X = S[0]; Y = S[1]; same = S[2];
      return { kind: 'pick', q: '不用計算，下面兩個算式的答案<b>相同嗎</b>？<div class="q2"><b class="num">' + X + '</b><br><b class="num">' + Y + '</b></div>', opts: ['相同', '不同'], a: same ? 0 : 1,
        ex: same ? '把括號拿掉以後，括號裡那一段<b>本來就會先算</b>，所以答案一樣。' : '把括號拿掉以後，先算的部分就變了，所以答案<b>不一樣</b>。' };
    },
    ordWrite: function () {
      var T = story8(), opts = [T.right].concat(T.wrong.slice(0, 2));
      return { kind: 'pick', q: T.q + '<br>把問題用<b>一個算式</b>記下來，下面哪一個是對的？', opts: opts, a: 0, ex: '可以寫成 <b>' + T.right + '</b>' + (T.alt ? '（也可以寫成 ' + T.alt + '）' : '') + '，答案是 ' + T.ans + ' ' + T.unit + '。' + (T.note || '') };
    },
    ordWord: function () {
      var T = story8();
      return { q: T.q, fields: [{ pre: '', unit: T.unit }], ans: [T.ans], ex: '列成一個算式：<b>' + T.right + '</b> ＝ ' + T.ans + '。' + (T.note || ''),
        dg: function (v) { if (v[0] === T.mid) return '這是第一步的答案，題目還要再算一步。'; if (T.wv && T.wv.indexOf(v[0]) >= 0) return T.wtip; return ''; } };
    },
    ordPuzzle: function () {
      var a = ri(2, 9), b = ri(1, 8), c = ri(1, 6), OPS = ['＋', '－', '×', '÷'], all = [];
      var f = function (x, o, y) { if (x === null || y === null) return null; var r = o === '＋' ? x + y : o === '－' ? x - y : o === '×' ? x * y : (y && x % y === 0 ? x / y : null); return r !== null && r >= 0 ? r : null; };
      OPS.forEach(function (o1) { OPS.forEach(function (o2) {
        var p1 = (o2 === '×' || o2 === '÷') && (o1 === '＋' || o1 === '－') ? f(a, o1, f(b, o2, c)) : f(f(a, o1, b), o2, c);
        all.push([a + ' ' + o1 + ' ' + b + ' ' + o2 + ' ' + c, p1]);
        all.push(['(' + a + ' ' + o1 + ' ' + b + ') ' + o2 + ' ' + c, f(f(a, o1, b), o2, c)]);
        all.push([a + ' ' + o1 + ' (' + b + ' ' + o2 + ' ' + c + ')', f(a, o1, f(b, o2, c))]);
      }); });
      all = all.filter(function (x) { return x[1] !== null && x[1] <= 30; });
      var vals = {}; all.forEach(function (x) { (vals[x[1]] = vals[x[1]] || []).push(x[0]); });
      var ks = Object.keys(vals); if (ks.length < 4) return GEN.ordPuzzle();
      var tg = +pick(ks), right = pick(vals[tg]), others = M8shuffle(all.filter(function (x) { return x[1] !== tg; })).slice(0, 2);
      return { kind: 'pick', q: '在 <b>' + a + '　' + b + '　' + c + '</b> 中間填入符號（可以加括號），讓答案是 <b>' + tg + '</b>。下面哪一個是對的？', opts: [right].concat(others.map(function (x) { return x[0]; })), a: 0,
        ex: right + ' ＝ ' + tg + '。答案不只一種：' + vals[tg].slice(0, 4).join('、') + (vals[tg].length > 4 ? '……' : '') + '。其他選項：' + others.map(function (x) { return x[0] + ' ＝ ' + x[1]; }).join('；') + '。' };
    },
    spotOrd: function () {
      var t = ri(0, 2), a, b, c, parts, bad, fix, ans;
      if (t === 0) { do { a = ri(60, 99); b = ri(12, 40); c = ri(12, 40); } while (a - b - c < 0); ans = a - b + c; parts = ['① ' + a + ' － ' + b + ' ＋ ' + c, '② ＝ ' + a + ' － ' + (b + c), '③ ＝ ' + (a - b - c)]; bad = 1; fix = '② ＝ ' + (a - b) + ' ＋ ' + c + '（沒有括號，由左往右先算 ' + a + ' － ' + b + '）'; }
      else if (t === 1) { a = ri(30, 99); b = ri(11, 25); c = ri(3, 9); ans = a + b * c; parts = ['① ' + a + ' ＋ ' + b + ' × ' + c, '② ＝ ' + (a + b) + ' × ' + c, '③ ＝ ' + ((a + b) * c)]; bad = 1; fix = '② ＝ ' + a + ' ＋ ' + (b * c) + '（先算 ' + b + ' × ' + c + '）'; }
      else { do { b = ri(2, 9); c = ri(2, 9); a = (b + c) * ri(2, 12); } while (a % b); ans = a / (b + c); parts = ['① ' + a + ' ÷ (' + b + ' ＋ ' + c + ')', '② ＝ ' + (a / b) + ' ＋ ' + c, '③ ＝ ' + (a / b + c)]; bad = 1; fix = '② ＝ ' + a + ' ÷ ' + (b + c) + '（先算括號）'; }
      if (Math.random() < .35) { // 第二步對了，最後一步算錯
        var mid2 = t === 0 ? (a - b) + ' ＋ ' + c : t === 1 ? a + ' ＋ ' + (b * c) : a + ' ÷ ' + (b + c), wv = ans + (ans > 10 ? pick([-10, 10]) : pick([1, 2]));
        parts = [parts[0], '② ＝ ' + mid2, '③ ＝ ' + wv]; bad = 2; fix = '③ ＝ ' + ans + '（' + mid2 + ' 再算一次）';
      }
      return { kind: 'spot', block: true, q: '小明用遞等式算下面的題目，他第一個錯的是哪一步？', parts: parts, bad: bad, fix: fix, ex: '正確答案是 <b>' + ans + '</b>。' };
    },
    /* ===== 第 9 單元 分數（課本 p.115～130） ===== */
    fracPic: function () {
      var d = ri(3, 10), k = ri(1, 3), r = ri(1, d - 1), tot = k * d + r, imp = Math.random() < .5, it = pick([['條紙條', '條'], ['張色紙', '張'], ['盒雞蛋糕', '盒']]);
      return fracQ('每' + it[1] + '平分成 ' + d + ' 份，塗色的部分是幾' + it[1] + '？用<b>' + (imp ? '假分數' : '帶分數') + '</b>表示。<div class="qimg">' + fracBars(k, r, d, it[1]) + '</div>', tot, d, it[1],
        '整' + it[1] + '的有 ' + k + ' ' + it[1] + '，最後一' + it[1] + '塗了 ' + r + ' 份：帶分數是 ' + mx(k, r, d) + '；一共 ' + tot + ' 個 ' + fq(1, d) + '，假分數是 ' + fq(tot, d) + '。',
        function (x, v) { if (v.length === 2 && v[1] === tot) return '整' + it[1] + '的已經變成整數了，分子只數最後那一' + it[1] + '塗了幾份。'; if (imp && x === r) return '整' + it[1] + '的也要算進去：一' + it[1] + '有 ' + d + ' 份，' + k + ' ' + it[1] + '是 ' + (k * d) + ' 份。'; return ''; }, imp);
    },
    fracKind: function () {
      var d = ri(2, 15), t = ri(0, 3), n, show, a;
      if (t === 0) { n = ri(1, d - 1); show = fq(n, d); a = 0; }
      else if (t === 1) { n = ri(d + 1, 3 * d); show = fq(n, d); a = 1; }
      else if (t === 2) { show = fq(d, d); a = 1; }
      else { show = mx(ri(1, 5), ri(1, d - 1), d); a = 2; }
      return { kind: 'pick', q: show + ' 是什麼分數？', opts: ['真分數', '假分數', '帶分數'], a: a,
        ex: ['分子比分母小，是<b>真分數</b>，比 1 小。', '分子比分母大，是<b>假分數</b>，比 1 大。', '分子和分母一樣大，也是<b>假分數</b>，它剛好等於 1。', '用整數和真分數合在一起，是<b>帶分數</b>，比 1 大。'][t] };
    },
    mixToImp: function () {
      var d = ri(2, 16), w = ri(1, 9), n = ri(1, d - 1), N = d * w + n, int = Math.random() < .25;
      if (int) return { q: '<b>' + w + '</b> ＝ ？', fields: [{ fr: 'n', den: d }], ans: [d * w], ansText: fq(d * w, d), ex: '1 ＝ ' + fq(d, d) + '，' + w + ' 個 1 就是 ' + d + ' × ' + w + ' ＝ ' + (d * w) + ' 個 ' + fq(1, d) + '：' + w + ' ＝ ' + fq(d * w, d) + '。', dg: function (v) { return v[0] === w + d || v[0] === w ? '1 ＝ ' + fq(d, d) + '，' + w + ' 個 1 就是 ' + d + ' × ' + w + ' 個 ' + fq(1, d) + '。' : ''; } };
      return { q: mx(w, n, d) + ' ＝ ？', fields: [{ fr: 'n', den: d }], ans: [N], ansText: fq(N, d), ex: '分母 × 整數 ＋ 分子：' + d + ' × ' + w + ' ＋ ' + n + ' ＝ ' + N + '，分母不變，' + mx(w, n, d) + ' ＝ ' + fq(N, d) + '。',
        dg: function (v) { v = v[0]; if (v === w + n) return '1 個整數裡有 ' + d + ' 個 ' + fq(1, d) + '，要先算 ' + d + ' × ' + w + '。'; if (v === d * w) return '整數換好了，別忘了再加上分子 ' + n + '。'; if (v === w * n + d) return '是「分母 × 整數 ＋ 分子」：' + d + ' × ' + w + ' ＋ ' + n + '。'; return ''; } };
    },
    impToMix: function () {
      var d = ri(2, 16), w = ri(1, 8), n = Math.random() < .2 ? 0 : ri(1, d - 1), N = w * d + n;
      if (N <= d) { w = 2; N = 2 * d + n; }
      return fracQ(fq(N, d) + ' ＝ ？（用帶分數或整數回答）', N, d, '', N + ' ÷ ' + d + ' ＝ ' + w + (n ? '…' + n : '') + '，商是整數部分，' + (n ? '餘數是分子，分母不變：' + fq(N, d) + ' ＝ ' + mx(w, n, d) : '剛好分完，答案是整數 ' + w) + '。',
        function (x, v) { if (v.length === 2 && v[0] === n && v[1] === w) return N + ' ÷ ' + d + ' 的商是整數部分，餘數才是分子。'; if (v.length === 2 && v[0] === 1 && v[1] === N - d) return '還可以再合成整個的喔！用除法一次找出有幾個整數。'; return ''; });
    },
    fracCmp: function () {
      var d = ri(3, 15), t = ri(0, 3), A, B, sa, sb;
      if (t === 0) { var w = ri(1, 6), n = ri(1, d - 1); A = w * d + n; B = A + pick([-2, -1, 0, 1, 2]); if (B <= d) B = A; sa = mx(w, n, d); sb = fq(B, d); }
      else if (t === 1) { var w1 = ri(1, 5), n1 = ri(Math.ceil(d / 2), d - 1), n2 = ri(1, Math.floor(d / 2)); A = w1 * d + n1; B = (w1 + 1) * d + n2; sa = mx(w1, n1, d); sb = mx(w1 + 1, n2, d); }
      else if (t === 2) { var k = ri(2, 8); A = k * d + pick([-1, 0, 1]) * ri(1, d - 1); B = k * d; sa = fq(A, d); sb = String(k); }
      else { A = ri(d + 1, 5 * d); B = A + pick([-3, -1, 1, 3]); if (B <= d) B = A + 2; sa = fq(A, d); sb = fq(B, d); }
      if (Math.random() < .5) { var tt = A; A = B; B = tt; var ts = sa; sa = sb; sb = ts; }
      return { kind: 'pick', q: '在 □ 裡填 ＞、＜ 或 ＝：<div class="q2">' + sa + ' □ ' + sb + '</div>', opts: ['＞', '＜', '＝'], a: A > B ? 0 : A < B ? 1 : 2,
        ex: '換成同一種形式再比：左邊是 ' + fq(A, d) + '（' + mx(Math.floor(A / d), A % d, d) + '），右邊是 ' + fq(B, d) + '（' + mx(Math.floor(B / d), B % d, d) + '）。帶分數可以先比整數。' };
    },
    fracAdd: function () {
      var d = ri(3, 16), a, b; do { a = ri(1, 2 * d); b = ri(1, 2 * d); } while (a + b <= d || a + b > 4 * d);
      return fracQ(fq(a, d) + ' ＋ ' + fq(b, d) + ' ＝ ？（用帶分數或整數回答）', a + b, d, '', a + ' 個 ' + fq(1, d) + ' 加 ' + b + ' 個 ' + fq(1, d) + '，是 ' + (a + b) + ' 個 ' + fq(1, d) + '：' + fq(a + b, d) + ' ＝ ' + mx(Math.floor((a + b) / d), (a + b) % d, d) + '。<b>分母不變，分子相加</b>。',
        function (x, v) { if (v.length === 1 && v[0] === a + b) return '題目要用帶分數回答，用除法把整數找出來。'; return ''; });
    },
    fracAddMix: function () {
      var d = ri(3, 16), t = ri(0, 2), w1 = ri(1, 6), n1 = ri(1, d - 1), A = w1 * d + n1, B, sb;
      if (t === 0) { var w2 = ri(1, 5), n2 = ri(Math.max(1, d - n1), d - 1); B = w2 * d + n2; sb = mx(w2, n2, d); }
      else if (t === 1) { B = ri(d + 1, 3 * d); sb = fq(B, d); }
      else { var k = ri(2, 9); B = k * d; sb = String(k); }
      var tot = A + B;
      return fracQ(mx(w1, n1, d) + ' ＋ ' + sb + ' ＝ ？（用帶分數或整數回答）', tot, d, '', '整數加整數，分數加分數，分數部分滿 ' + d + ' 份就換成 1 個整數（像 3 又 7/5 要記成 4 又 2/5）。也可以都換成假分數再加。答案是 ' + mx(Math.floor(tot / d), tot % d, d) + '。',
        function (x, v) { if (v.length === 2 && v[0] * d + v[1] === tot - d) return '分數部分滿 ' + d + ' 份時，合成 1 個，整數要多 1。'; return ''; });
    },
    fracSub: function () {
      var d = ri(3, 15), t = ri(0, 2), n = Math.random() < .5 ? ri(2, 9) : 1, A, B, sb;
      if (t === 0) { n = 1; B = ri(1, d - 1); sb = fq(B, d); }
      else if (t === 1) { n = ri(2, 9); B = ri(1, d - 1); sb = fq(B, d); }
      else { n = ri(3, 9); var w = ri(1, n - 1); B = w * d + ri(1, d - 1); sb = mx(w, B % d, d); }
      A = n * d; var tot = A - B;
      return fracQ(n + ' － ' + sb + ' ＝ ？', tot, d, '', '把 ' + (n === 1 ? '1 換成 ' + fq(d, d) : n + ' 換成 ' + mx(n - 1, d, d) + '（從 ' + n + ' 拿 1 換成 ' + fq(d, d) + '）') + '再減，或都換成假分數：' + fq(A, d) + ' － ' + fq(B, d) + ' ＝ ' + fq(tot, d) + ' ＝ ' + mx(Math.floor(tot / d), tot % d, d) + '。',
        function (x, v) { var bw = Math.floor(B / d), bn = B % d; if (v.length === 2 && v[0] === n - bw && v[1] === bn) return '分數部分不能照抄：要從整數借 1 換成 ' + fq(d, d) + '，再減分數。'; if (x === tot + d) return '借走 1 個整數，整數部分要少 1。'; return ''; });
    },
    fracSubB: function () {
      var d = ri(4, 16), a = ri(3, 9), c = ri(1, a - 1), b = ri(1, d - 2), e = ri(b + 1, d - 1), A = a * d + b, Bv = c * d + e, tot = A - Bv;
      return fracQ(mx(a, b, d) + ' － ' + mx(c, e, d) + ' ＝ ？', tot, d, '', b + '/' + d + ' 不夠減 ' + e + '/' + d + '：從整數 ' + a + ' 拿 1 換成 ' + fq(d, d) + '，' + mx(a, b, d) + ' 就變成 ' + (a - 1) + ' 又 ' + (b + d) + '/' + d + '，再減。答案是 ' + mx(Math.floor(tot / d), tot % d, d) + '。',
        function (x, v) { if (v.length === 2 && v[0] === a - c && v[1] === e - b) return '上面的分子比較小不夠減，不能倒過來減，要從整數借 1 換成 ' + fq(d, d) + '。'; if (x === tot + d) return '借走 1 個整數，整數部分要少 1。'; if (d !== 10 && v.length === 2 && v[1] === b + 10 - e) return '1 要換成 ' + fq(d, d) + '，分母是幾就換成幾分之幾，不是 10。'; return ''; });
    },
    fracMul: function () {
      var d = ri(3, 15), b = ri(1, 2 * d), n = ri(2, 9); if (b === d) b++;
      var tot = b * n;
      return fracQ(fq(b, d) + ' × ' + n + ' ＝ ？（用帶分數或整數回答）', tot, d, '', fq(b, d) + ' 是 ' + b + ' 個 ' + fq(1, d) + '，它的 ' + n + ' 倍是 ' + b + ' × ' + n + ' ＝ ' + tot + ' 個 ' + fq(1, d) + '。<b>分子 × 整數，分母不變</b>：' + fq(tot, d) + (tot >= d ? ' ＝ ' + mx(Math.floor(tot / d), tot % d, d) : '') + '。',
        function (x, v) { if (x === b + n) return '是 ' + n + ' 倍，要乘不是加。'; if (v.length === 1 && v[0] === tot && tot > d) return '題目要用帶分數回答，用除法把整數找出來。'; return ''; });
    },
    fracMulMix: function () {
      var d = ri(3, 12), w = ri(1, 4), n0 = ri(1, d - 1), k = ri(2, 6), tot = (w * d + n0) * k;
      return fracQ(mx(w, n0, d) + ' × ' + k + ' ＝ ？（用帶分數或整數回答）', tot, d, '', '先換成假分數：' + fq(w * d + n0, d) + ' × ' + k + ' ＝ ' + fq(tot, d) + '；或整數和分數分開乘：' + w + ' × ' + k + ' ＋ ' + fq(n0, d) + ' × ' + k + '。答案是 ' + mx(Math.floor(tot / d), tot % d, d) + '。',
        function (x, v) { if (x === w * k * d + n0) return '分數部分也要乘 ' + k + ' 喔。'; if (x === w * d + n0 * k) return '整數 ' + w + ' 也要乘 ' + k + '。'; return ''; });
    },
    fracWord: function () {
      var t = ri(0, 3), d = ri(4, 12), A, B, tot, q, unit;
      if (t === 0) { unit = '公升'; A = ri(d + 1, 3 * d); B = ri(d + 1, 3 * d); tot = A + B; q = '一瓶優酪乳喝掉 ' + mx(Math.floor(A / d), A % d, d) + ' 公升，還剩 ' + fq(B, d) + ' 公升，原來有幾公升？'; }
      else if (t === 1) { unit = '公斤'; var n = ri(3, 8); A = n * d; B = ri(d + 1, (n - 1) * d - 1); tot = A - B; q = '一把樂器連盒子重 ' + n + ' 公斤，盒子重 ' + mx(Math.floor(B / d), B % d, d) + ' 公斤，樂器重幾公斤？'; }
      else if (t === 2) { unit = '公升'; var each = ri(d + 1, 2 * d), k = ri(2, 6); tot = each * k; q = '一瓶果汁有 ' + mx(Math.floor(each / d), each % d, d) + ' 公升，' + k + ' 瓶一共有幾公升？'; }
      else { unit = '公斤'; A = ri(2 * d + 1, 5 * d); B = ri(d + 1, A - 1); tot = A - B; q = '上午採了 ' + mx(Math.floor(B / d), B % d, d) + ' 公斤草莓，一天一共採了 ' + mx(Math.floor(A / d), A % d, d) + ' 公斤，下午採了幾公斤？'; }
      if (tot <= 0) return GEN.fracWord();
      return fracQ(q, tot, d, unit, ['用掉的加上剩下的，才是原來的。', '全部的重量減掉盒子，才是裡面東西的重量。', '每瓶的量 × 瓶數，分子 × 整數，分母不變。', '一天的減掉上午的，就是下午的。'][t] + '答案是 ' + mx(Math.floor(tot / d), tot % d, d) + ' ' + unit + '。',
        function (x) { if (t === 0 && x === Math.abs(A - B)) return '用掉的加上剩下的，才是原來的。'; if ((t === 1 || t === 3) && x === A + B) return '要用減法喔。'; return ''; });
    },
    spotFrac: function () {
      var t = ri(0, 3), d = ri(4, 12), parts, bad, fix, ans;
      if (t === 0) { var w = ri(2, 6), n = ri(1, d - 1), N = d * w + n; ans = fq(N, d); bad = 1; parts = ['① 分母不變，還是 ' + d, '② 分子 ＝ ' + d + ' ＋ ' + w + ' ＋ ' + n + ' ＝ ' + (d + w + n), '③ ' + mxT(w, n, d) + ' ＝ ' + (d + w + n) + '/' + d]; fix = '② 分子 ＝ 分母 × 整數 ＋ 分子 ＝ ' + d + ' × ' + w + ' ＋ ' + n + ' ＝ ' + N;
        if (Math.random() < .4) { bad = 0; parts = ['① 分母變成 ' + d + ' × ' + w + ' ＝ ' + (d * w), '② 分子 ＝ ' + d + ' × ' + w + ' ＋ ' + n + ' ＝ ' + N, '③ ' + mxT(w, n, d) + ' ＝ ' + N + '/' + (d * w)]; fix = '① 分母不變，還是 ' + d; }
        return { kind: 'spot', block: true, q: '小明把 ' + mx(w, n, d) + ' 換成假分數，他第一個錯的是哪一步？', parts: parts, bad: bad, fix: fix, ex: '正確答案是 ' + ans + '。' }; }
      if (t === 1) { var w1 = ri(2, 6), n1 = ri(1, d - 1); if (w1 === n1) n1 = n1 > 1 ? n1 - 1 : n1 + 1; var N1 = w1 * d + n1; parts = ['① ' + N1 + ' ÷ ' + d + ' ＝ ' + w1 + '…' + n1, '② 商 ' + w1 + ' 當分子，餘數 ' + n1 + ' 當整數', '③ ' + N1 + '/' + d + ' ＝ ' + mxT(n1, w1, d)]; var bd1 = 1, fx1 = '② 商 ' + w1 + ' 是整數部分，餘數 ' + n1 + ' 是分子';
        if (w1 > 1 && Math.random() < .4) { parts = ['① ' + N1 + ' ÷ ' + d + ' ＝ ' + (w1 - 1) + '…' + (n1 + d), '② 商 ' + (w1 - 1) + ' 是整數，餘數 ' + (n1 + d) + ' 是分子', '③ ' + N1 + '/' + d + ' ＝ ' + mxT(w1 - 1, n1 + d, d)]; bd1 = 0; fx1 = '① 餘數 ' + (n1 + d) + ' 比除數 ' + d + ' 大，商還可以再大：' + N1 + ' ÷ ' + d + ' ＝ ' + w1 + '…' + n1; }
        return { kind: 'spot', block: true, q: '小明把 ' + fq(N1, d) + ' 換成帶分數，他第一個錯的是哪一步？', parts: parts, bad: bd1, fix: fx1, ex: '正確答案是 ' + mx(w1, n1, d) + '。' }; }
      if (t === 2) { var a = ri(1, 5), b = ri(1, 4), n2 = ri(2, d - 1), e = ri(d - n2 + 1, d - 1), s = n2 + e; parts = ['① 整數 ' + a + ' ＋ ' + b + ' ＝ ' + (a + b), '② 分數 ' + n2 + '/' + d + ' ＋ ' + e + '/' + d + ' ＝ ' + s + '/' + (d * 2), '③ 合起來是 ' + (a + b) + ' 又 ' + s + '/' + (d * 2)]; var bd2 = 1, fx2 = '② 分母不變，分子相加：' + n2 + '/' + d + ' ＋ ' + e + '/' + d + ' ＝ ' + s + '/' + d;
        if (Math.random() < .45) { parts = ['① 整數 ' + a + ' ＋ ' + b + ' ＝ ' + (a + b), '② 分數 ' + n2 + '/' + d + ' ＋ ' + e + '/' + d + ' ＝ ' + s + '/' + d, '③ 答案是 ' + (a + b) + ' 又 ' + s + '/' + d]; bd2 = 2; fx2 = '③ ' + (a + b) + ' 又 ' + s + '/' + d + ' 的分數部分比分母大，要記成 ' + (a + b + 1) + ' 又 ' + (s - d) + '/' + d; }
        return { kind: 'spot', block: true, q: '小明算 ' + mx(a, n2, d) + ' ＋ ' + mx(b, e, d) + '，他第一個錯的是哪一步？', parts: parts, bad: bd2, fix: fx2, ex: '正確答案是 ' + mx(a + b + 1, s - d, d) + '。' }; }
      var A = ri(4, 8), bb = ri(1, d - 3), C = ri(1, A - 2), ee = ri(bb + 1, d - 1), tot = (A * d + bb) - (C * d + ee);
      parts = ['① ' + bb + '/' + d + ' 不夠減 ' + ee + '/' + d + '，從 ' + A + ' 借 1', '② ' + mxT(A, bb, d) + ' ＝ ' + A + ' 又 ' + (bb + d) + '/' + d, '③ 再減 ' + mxT(C, ee, d)];
      var bd3 = 1; if (Math.random() < .4) { parts = [parts[0], '② ' + mxT(A, bb, d) + ' ＝ ' + (A - 1) + ' 又 ' + (bb + d) + '/' + d, '③ 再減 ' + mxT(C, ee, d) + '，答案是 ' + mxT(A - 1 - C, ee - bb, d)]; bd3 = 2; }
      if (bd3 === 2) return { kind: 'spot', block: true, q: '小明算 ' + mx(A, bb, d) + ' － ' + mx(C, ee, d) + '，他第一個錯的是哪一步？', parts: parts, bad: 2, fix: '③ ' + (bb + d) + '/' + d + ' － ' + ee + '/' + d + ' ＝ ' + (bb + d - ee) + '/' + d + '，答案是 ' + mxT(Math.floor(tot / d), tot % d, d), ex: '正確答案是 ' + mx(Math.floor(tot / d), tot % d, d) + '。' };
      return { kind: 'spot', block: true, q: '小明算 ' + mx(A, bb, d) + ' － ' + mx(C, ee, d) + '，他第一個錯的是哪一步？', parts: parts, bad: 1, fix: '② 借走 1 以後整數要少 1：' + mxT(A, bb, d) + ' ＝ ' + (A - 1) + ' 又 ' + (bb + d) + '/' + d, ex: '正確答案是 ' + mx(Math.floor(tot / d), tot % d, d) + '。' };
    },
    /* ===== 第 10 單元 統計圖（課本 p.131～145）：4上 只「讀」折線圖，會畫的只有長條圖 ===== */
    picRead: function () {
      var big = pick([10, 100, 1000]), half = Math.random() < .6, small = half ? big / 2 : big / 10, it = pick([['🚗', '🚙', '汽車', '輛'], ['🥛', '🧃', '牛奶', '瓶'], ['✏️', '🖊️', '原子筆', '枝'], ['🍎', '🍏', '蘋果', '顆']]);
      var names = M8shuffle(['紅色', '藍色', '黃色', '綠色', '白色']).slice(0, 4), rows = names.map(function (nm) { return [nm, ri(1, 5), half ? ri(0, 1) : ri(0, 6)]; });
      var k = ri(0, 3), r = rows[k], ans = r[1] * big + r[2] * small;
      return { q: '看圖示統計圖，<b>' + r[0] + '</b>的' + it[2] + '有多少' + it[3] + '？<div class="qimg">' + pictoHTML(rows, big + ' ' + it[3], small + ' ' + it[3], it[0], it[1], '上週' + it[2] + '銷售數量統計圖') + '</div>', fields: [{ pre: '', unit: it[3] }], ans: [ans],
        ex: '先看說明：大圖案 ' + it[0] + ' 表示 ' + big + '，小圖案 ' + it[1] + ' 表示 ' + small + '。' + r[1] + ' 個大的是 ' + (r[1] * big) + (r[2] ? '，' + r[2] + ' 個小的是 ' + (r[2] * small) : '') + '，合起來是 <b>' + ans + ' ' + it[3] + '</b>。',
        dg: function (v) { v = v[0]; if (v === r[1] + r[2]) return '每個大圖案代表 ' + big + '，不是 1 喔！'; if (v === (r[1] + r[2]) * big) return '小圖案只代表 ' + small + '，不是 ' + big + '。'; if (!half && v === r[1] * big + r[2] * big / 2) return '看說明框：這次小圖案代表 ' + small + '，不是一半。'; return ''; } };
    },
    picMake: function () {
      var big = pick([10, 100]), small = big / 2, nb = ri(1, 5), ns = 1, val = nb * big + small;
      var right = nb + ' 個大圖案、1 個小圖案', w = [nb + ' 個大圖案、5 個小圖案', (nb + 1) + ' 個大圖案', nb + ' 個大圖案'];
      return { kind: 'pick', q: '大圖案表示 <b>' + big + '</b>，小圖案表示 <b>' + small + '</b>。要表示 <b>' + val + '</b>，該怎麼畫？', opts: [right].concat(M8shuffle(w).slice(0, 2)), a: 0,
        ex: val + ' ＝ ' + (nb * big) + ' ＋ ' + small + '：' + nb + ' 個大圖案再加 1 個小圖案。1 個小圖案就代表 ' + small + '，不是 5 個。' };
    },
    barRead: function () {
      var half = Math.random() < .35, step = half ? pick([2, 10]) : pick([1, 2, 5, 10]), B = barChart({ step: step, half: half }), k = ri(0, B.vals.length - 1), v = B.vals[k], isHalf = v % step !== 0;
      return { q: '看長條圖，<b>' + B.C.cats[k] + '</b>有多少' + B.C.info[3] + '？<div class="qimg">' + B.svg + '</div>', fields: [{ pre: '', unit: B.C.info[3] }], ans: [v],
        ex: '縱軸每一小格表示 ' + step + ' ' + B.C.info[3] + '。' + B.C.cats[k] + '的長條' + (isHalf ? '停在 ' + (v - step / 2) + ' 和 ' + (v + step / 2) + ' 的正中間，所以是 ' : '到 ') + '<b>' + v + '</b>。',
        dg: function (x) { x = x[0]; if (step > 1 && x === Math.round(v / step)) return '先看每一格代表多少（' + step + '），再數。'; if (isHalf && (x === v - step / 2 || x === v + step / 2)) return '停在兩條線中間，是兩個數的正中間。'; if (Math.abs(x - v) === step) return '從長條頂端畫一條橫線到縱軸，看它碰到哪一條。'; return ''; } };
    },
    scaleUnit: function () {
      var lab = pick([5, 10, 20, 50, 100]), sm = pick([2, 5, 10].filter(function (s) { return lab % s === 0 && lab / s >= 1; })), each = lab / sm;
      if (each < 1 || each % 1) return GEN.scaleUnit();
      var B = barSVG({ cats: ['甲', '乙', '丙'], vals: [lab, lab * 2, lab * 1.5].map(function (x) { return Math.round(x / each) * each; }), step: each, per: sm, grids: sm * 3, yName: '人數(人)', xName: '組別', title: '各組人數長條圖' });
      return { q: '這張長條圖的縱軸，<b>每一小格</b>表示幾人？<div class="qimg">' + B + '</div>', fields: [{ pre: '', unit: '人' }], ans: [each],
        ex: '數字每 ' + lab + ' 標一次，兩個數字之間分成 ' + sm + ' 小格：' + lab + ' ÷ ' + sm + ' ＝ <b>' + each + '</b>，每一小格表示 ' + each + ' 人。',
        dg: function (v) { if (v[0] === lab) return '題目問的是「小格」：數數兩個數字之間被分成幾格。'; if (v[0] === sm) return '要用大格的數除以格數：' + lab + ' ÷ ' + sm + '。'; return ''; } };
    },
    barMaxMin: function () {
      var t = ri(0, 2), B = barChart({ step: pick([1, 2, 5]), pair: t === 2 }), mxv = Math.max.apply(null, B.vals), mnv = Math.min.apply(null, B.vals);
      if (t === 2) { var pr = null; for (var i = 0; i < B.vals.length && !pr; i++) for (var j = i + 1; j < B.vals.length; j++) if (B.vals[i] === B.vals[j]) { pr = [i, j]; break; } if (!pr) return GEN.barMaxMin();
        var right = B.C.cats[pr[0]] + '和' + B.C.cats[pr[1]], ws = []; for (var a = 0; a < B.vals.length && ws.length < 2; a++) for (var b = a + 1; b < B.vals.length && ws.length < 2; b++) if (B.vals[a] !== B.vals[b]) ws.push(B.C.cats[a] + '和' + B.C.cats[b]);
        return { kind: 'pick', q: '哪兩種一樣多？<div class="qimg">' + B.svg + '</div>', opts: [right].concat(ws), a: 0, ex: right + '的長條一樣高，都是 ' + B.vals[pr[0]] + ' ' + B.C.info[3] + '。' }; }
      var tg = t === 0 ? mxv : mnv, k = B.vals.indexOf(tg), opts = B.C.cats.slice(), a = k;
      return { kind: 'pick', q: '哪一種<b>' + (t === 0 ? '最多' : '最少') + '</b>？<div class="qimg">' + B.svg + '</div>', opts: opts, a: a, ex: '找' + (t === 0 ? '最高' : '最矮') + '的那一條：<b>' + B.C.cats[k] + '</b>，' + tg + ' ' + B.C.info[3] + '。' };
    },
    barCalc: function () {
      var B = barChart({ step: pick([1, 2, 5]), n: 4 }), t = ri(0, 1), u = B.C.info[3];
      if (t === 0) { var i = B.vals.indexOf(Math.max.apply(null, B.vals)), j = B.vals.indexOf(Math.min.apply(null, B.vals)); var d = B.vals[i] - B.vals[j];
        return { q: '<b>' + B.C.cats[i] + '</b>比<b>' + B.C.cats[j] + '</b>多幾' + u + '？<div class="qimg">' + B.svg + '</div>', fields: [{ pre: '', unit: u }], ans: [d], ex: B.C.cats[i] + ' ' + B.vals[i] + '，' + B.C.cats[j] + ' ' + B.vals[j] + '：「比……多幾」用大的減小的，' + B.vals[i] + ' － ' + B.vals[j] + ' ＝ <b>' + d + '</b>。', dg: function (v) { return v[0] === B.vals[i] + B.vals[j] ? '「比……多幾」要用大的減小的。' : ''; } }; }
      var s = B.vals.reduce(function (a, b) { return a + b; }, 0);
      return { q: '每人只投 1 票，這' + (u === '人' ? '班一共有幾人' : '些一共有幾' + u) + '？<div class="qimg">' + B.svg + '</div>', fields: [{ pre: '', unit: u }], ans: [s], ex: '把每一條都加起來：' + B.vals.join(' ＋ ') + ' ＝ <b>' + s + '</b>。', dg: function (v) { return B.vals.some(function (x) { return v[0] === s - x; }) ? '每一條都要加進去喔，一共有 ' + B.vals.length + ' 種。' : ''; } };
    },
    barHoriz: function () {
      var B = barChart({ step: 2, per: 5, horiz: true, half: true, n: 4 });
      if (Math.random() < .4) return { kind: 'pick', q: '這是橫式長條圖，<b>縱軸</b>表示什麼？<div class="qimg">' + B.svg + '</div>', opts: [B.C.info[1], B.C.info[2], '標題'], a: 0, ex: '長條橫著畫的時候，數量在<b>橫軸</b>，縱軸寫的是' + B.C.info[1] + '。' };
      var k = ri(0, 3), v = B.vals[k];
      return { q: '看橫式長條圖，<b>' + B.C.cats[k] + '</b>有多少' + B.C.info[3] + '？<div class="qimg">' + B.svg + '</div>', fields: [{ pre: '', unit: B.C.info[3] }], ans: [v], ex: '橫軸每一小格表示 2 ' + B.C.info[3] + '，' + B.C.cats[k] + '的長條到 <b>' + v + '</b>' + (v % 2 ? '（在 ' + (v - 1) + ' 和 ' + (v + 1) + ' 的正中間）' : '') + '。',
        dg: function (x) { x = x[0]; if (x === Math.round(v / 2)) return '橫軸每一小格代表 2，先看清楚再數。'; if (v % 2 && Math.abs(x - v) === 1) return '停在兩條線中間，是兩個數的正中間。'; return ''; } };
    },
    barDraw: function () {
      var step = pick([2, 5, 10]), cells = ri(3, 10) + (step !== 5 && Math.random() < .3 ? .5 : 0), v = Math.round(cells * step), it = pick([['兔子', '隻'], ['金魚', '隻'], ['西瓜', '顆'], ['跳繩的人', '人']]);
      return { q: '統計表寫<b>' + it[0] + ' ' + v + ' ' + it[1] + '</b>，長條圖的縱軸每一格表示 <b>' + step + ' ' + it[1] + '</b>，' + it[0] + '的長條要畫幾格？', fields: [{ pre: '', unit: '格' }], ans: [v / step], dec: v % step !== 0,
        ex: v + ' ÷ ' + step + ' ＝ ' + (v / step) + '，要畫 <b>' + (v / step) + ' 格</b>' + (v % step ? '（' + Math.floor(v / step) + ' 格半）' : '') + '。',
        dg: function (x) { if (x[0] === v) return '每格代表 ' + step + '，要算 ' + v + ' 裡有幾個 ' + step + '。'; if (x[0] === v * step) return '要用除的：' + v + ' ÷ ' + step + '。'; return ''; } };
    },
    scalePick: function () {
      var mxv = ri(8, 95), g = ri(8, 12), opts = [1, 2, 5, 10], ok = opts.filter(function (s) { return s * g >= mxv; });
      if (!ok.length || ok[0] === 1 && Math.random() < .7) return GEN.scalePick();
      var a = opts.indexOf(ok[0]);
      return { kind: 'pick', q: '統計表裡最大的數是 <b>' + mxv + '</b>，縱軸只有 <b>' + g + ' 格</b>。每格表示多少，才畫得下而且長條最高？', opts: opts.map(function (s) { return '每格 ' + s; }), a: a,
        ex: '每格 ' + ok[0] + ' 時，' + g + ' 格最多到 ' + (ok[0] * g) + '，畫得下 ' + mxv + '；' + (a > 0 ? '每格 ' + opts[a - 1] + ' 只到 ' + (opts[a - 1] * g) + '，畫不下。' : '') + '比 ' + ok[0] + ' 大也畫得下，但長條會太矮。' };
    },
    lineRead: function () {
      var t = ri(0, 1), n = ri(5, 7), cats, vals = [], base = 0, step, per, yN, xN, ti, u;
      if (t === 0) { var h0 = ri(6, 8); cats = []; for (var i = 0; i < n; i++) cats.push((h0 + i * 2) + ''); var v0 = ri(12, 20); for (var j = 0; j < n; j++) { v0 += j ? pick([-3, -2, -1, 0, 1, 2, 3, 4]) : 0; vals.push(Math.max(5, Math.min(34, v0))); } step = 1; per = 5; yN = '氣溫(°C)'; xN = '時刻(時)'; ti = '某日氣溫紀錄折線圖'; u = '°C'; }
      else { cats = []; for (var a = 0; a < n; a++) cats.push((5 + a) + ''); var hh = ri(108, 118); for (var b = 0; b < n; b++) { hh += b ? ri(3, 7) : 0; vals.push(hh); } base = Math.floor((vals[0] - 3) / 5) * 5; step = 1; per = 5; yN = '身高(公分)'; xN = '年齡(歲)'; ti = '某同學每年身高紀錄折線圖'; u = '公分'; }
      var mxv = Math.max.apply(null, vals), g = Math.ceil((mxv - base) / 5) * 5 + 5;
      var svg = lineSVG({ cats: cats, vals: vals, step: step, per: per, grids: g, base: base, yName: yN, xName: xN, title: ti }), k = ri(0, n - 1);
      return { q: '看折線圖，<b>' + cats[k] + (t ? ' 歲' : ' 時') + '</b>是多少' + u + '？<div class="qimg">' + svg + '</div>', fields: [{ pre: '', unit: u }], ans: [vals[k]],
        ex: '在橫軸找到 ' + cats[k] + (t ? ' 歲' : ' 時') + '，往上直直對到點，再往左看縱軸：<b>' + vals[k] + ' ' + u + '</b>。' + (base ? '縱軸的 ≈ 表示 0 到 ' + base + ' 省略了，要從標好的刻度開始讀。' : ''),
        dg: function (x) { x = x[0]; if (base && x === vals[k] - base) return '≈ 表示中間省略了，要從標好的刻度 ' + base + ' 開始讀，不能從 0 開始數格子。'; if (vals.indexOf(x) >= 0 && x !== vals[k]) return '先在橫軸找到 ' + cats[k] + '，往上直直對到點。'; return ''; } };
    },
    lineTrend: function () {
      var n = 6, cats = [], vals = [], v = ri(14, 20);
      for (var i = 0; i < n; i++) { cats.push((7 + i * 2) + ''); if (i) v += pick([-3, -2, 0, 2, 3, 4, 5]); vals.push(Math.max(8, v)); }
      var diffs = vals.slice(1).map(function (x, i) { return x - vals[i]; }), t = ri(0, 1);
      var svg = lineSVG({ cats: cats, vals: vals, step: 1, per: 5, grids: Math.ceil(Math.max.apply(null, vals) / 5) * 5 + 5, yName: '氣溫(°C)', xName: '時刻(時)', title: '某日氣溫紀錄折線圖' });
      if (t === 0) { var k = ri(0, n - 2), d = diffs[k], a = d > 0 ? 0 : d < 0 ? 1 : 2;
        return { kind: 'pick', q: '從 <b>' + cats[k] + ' 時</b>到 <b>' + cats[k + 1] + ' 時</b>，氣溫是上升、下降還是不變？<div class="qimg">' + svg + '</div>', opts: ['上升', '下降', '不變'], a: a, ex: vals[k] + '°C → ' + vals[k + 1] + '°C：連線' + ['往上，氣溫上升', '往下，氣溫下降', '是平的，氣溫不變'][a] + '。' }; }
      var big = Math.max.apply(null, diffs); if (big <= 0 || diffs.filter(function (x) { return x === big; }).length > 1) return GEN.lineTrend();
      var kk = diffs.indexOf(big), opts = diffs.map(function (_, i) { return cats[i] + ' 時到 ' + cats[i + 1] + ' 時'; }), a2 = kk, pickIdx = M8shuffle(opts.map(function (_, i) { return i; }).filter(function (i) { return i !== kk; })).slice(0, 2).concat([kk]).sort(function (x, y) { return x - y; });
      return { kind: 'pick', q: '哪兩個時刻之間，氣溫<b>上升最多</b>？<div class="qimg">' + svg + '</div>', opts: pickIdx.map(function (i) { return opts[i]; }), a: pickIdx.indexOf(kk), ex: '看哪一段線往上最陡：' + opts[kk] + '，上升 ' + big + '°C。上升最多是指兩個點之間差最多，不是最高的點。' };
    },
    unitRead: function () {
      var n = 5, cats = [], vals = [], v = ri(150, 210);
      for (var i = 0; i < n; i++) { cats.push((108 + i) + ''); if (i) v += pick([-9, -6, -4, 3, 5, 8]); vals.push(v); }
      var base = Math.floor((Math.min.apply(null, vals) - 6) / 10) * 10, g = Math.ceil((Math.max.apply(null, vals) - base) / 10) * 10 + 5, k = ri(0, n - 1);
      var svg = lineSVG({ cats: cats, vals: vals, step: 1, per: 10, grids: g, base: base, yName: '人數(千人)', xName: '年度(年)', title: '某市新生兒人數折線圖' });
      return { q: '看折線圖，民國 <b>' + cats[k] + ' 年</b>的新生兒有幾人？<div class="qimg">' + svg + '</div>', fields: [{ pre: '', unit: '人' }], ans: [vals[k] * 1000],
        ex: '縱軸的單位是「千人」：讀到 ' + vals[k] + ' 千人，' + vals[k] + ' × 1000 ＝ <b>' + (vals[k] * 1000) + ' 人</b>。',
        dg: function (x) { x = x[0]; if (x === vals[k]) return '單位是「千人」，' + vals[k] + ' 千人是 ' + (vals[k] * 1000) + ' 人。'; if (x === vals[k] * 100 || x === vals[k] * 10000) return '1 千 ＝ 1000，後面有 3 個 0。'; return ''; } };
    },
    twoSeries: function () {
      var C = pickCats(4), a = C.cats.map(function () { return ri(3, 12); }), b = C.cats.map(function () { return ri(3, 12); }), t = ri(0, 2);
      var svg = barSVG({ cats: C.cats, vals: a, vals2: b, step: 1, per: 2, grids: 14, yName: '人數(人)', xName: C.info[1], title: '甲、乙兩班' + C.info[0] + '人數長條圖', legend: ['甲班', '乙班'], labels: true });
      if (t === 0) { var k = ri(0, 3); return { q: '兩班合起來，喜歡<b>' + C.cats[k] + '</b>的有幾人？<div class="qimg">' + svg + '</div>', fields: [{ pre: '', unit: '人' }], ans: [a[k] + b[k]], ex: '先看色塊說明：藍色是甲班、黃色是乙班。' + a[k] + ' ＋ ' + b[k] + ' ＝ <b>' + (a[k] + b[k]) + ' 人</b>。', dg: function (v) { return v[0] === a[k] || v[0] === b[k] ? '兩班都要算：兩條加起來。' : ''; } }; }
      if (t === 1) { var d = a.map(function (x, i) { return Math.abs(x - b[i]); }), m = Math.max.apply(null, d); if (d.filter(function (x) { return x === m; }).length > 1 || !m) return GEN.twoSeries(); var kk = d.indexOf(m);
        return { kind: 'pick', q: '哪一種兩班<b>差最多</b>？<div class="qimg">' + svg + '</div>', opts: C.cats.slice(), a: kk, ex: C.cats[kk] + '：' + a[kk] + ' 和 ' + b[kk] + '，差 ' + m + ' 人，是差最多的。' }; }
      var sa = a.reduce(function (x, y) { return x + y; }), sb = b.reduce(function (x, y) { return x + y; }); if (sa === sb) return GEN.twoSeries();
      return { q: '把每一種加起來，甲班和乙班的人數<b>相差</b>幾人？<div class="qimg">' + svg + '</div>', fields: [{ pre: '相差', unit: '人' }], ans: [Math.abs(sa - sb)], ex: '甲班 ' + a.join(' ＋ ') + ' ＝ ' + sa + ' 人，乙班 ' + b.join(' ＋ ') + ' ＝ ' + sb + ' 人，' + (sa > sb ? '甲' : '乙') + '班多 <b>' + Math.abs(sa - sb) + ' 人</b>。' };
    },
    spotChart: function () {
      var t = ri(0, 2);
      if (t === 2) { var g2 = ri(9, 16); return { kind: 'spot', block: true, q: '縱軸數字每 10 標一次，中間分成 5 小格。小明讀「香蕉有幾人」，他第一個錯的是哪一步？', parts: ['① 縱軸每一小格表示 10 人', '② 香蕉的長條到第 ' + g2 + ' 小格', '③ 所以香蕉有 ' + (g2 * 10) + ' 人'], bad: 0, fix: '① 數字每 10 標一次，中間分成 5 小格，每小格是 10 ÷ 5 ＝ 2 人', ex: '香蕉有 <b>' + (g2 * 2) + ' 人</b>。' }; }
      if (t === 0) { var g = ri(9, 16), v = g * 2; return { kind: 'spot', block: true, q: '縱軸數字每 10 標一次，中間分成 5 小格。小明讀「香蕉有幾人」，他第一個錯的是哪一步？', parts: ['① 縱軸每一小格表示 2 人', '② 香蕉的長條到第 ' + g + ' 小格', '③ 所以香蕉有 ' + g + ' 人'], bad: 2, fix: '③ ' + g + ' 小格 × 2 人 ＝ ' + v + ' 人', ex: '香蕉有 <b>' + v + ' 人</b>。' }; }
      var a = ri(115, 125), b = a + ri(10, 20);
      return { kind: 'spot', block: true, q: '身高折線圖的縱軸在 0 和 110 之間有 ≈。小明算「6 歲到 9 歲長高多少」，他第一個錯的是哪一步？', parts: ['① 縱軸每小格表示 1 公分', '② 6 歲是 ' + a + ' 公分，9 歲是 ' + b + ' 公分', '③ 長高 ' + b + ' － ' + a + ' ＝ ' + (b - a + 10) + ' 公分'], bad: 2, fix: '③ ' + b + ' － ' + a + ' ＝ ' + (b - a) + ' 公分', ex: '長高了 <b>' + (b - a) + ' 公分</b>。' };
    }
  };
  /* ---------------- 第 10 單元 統計圖：照課本的畫法（標題在圖下方、縱軸名稱在上端、橫軸名稱在右端、只有大格標數字） ---------------- */
  var CATS10 = { fruit: ['蘋果', '葡萄', '西瓜', '香蕉', '芒果', '鳳梨'], sport: ['躲避球', '跳繩', '籃球', '游泳', '桌球', '羽球'], breakfast: ['蛋餅', '飯糰', '三明治', '蘿蔔糕', '饅頭'], pet: ['金魚', '烏龜', '兔子', '倉鼠', '小狗', '小貓'], go: ['走路', '騎腳踏車', '家人接送', '大眾運輸'], flavor: ['巧克力', '香草', '草莓', '芒果', '抹茶'] };
  var CATN10 = { fruit: ['最喜歡的水果', '種類', '人數', '人'], sport: ['最喜歡的運動', '種類', '人數', '人'], breakfast: ['最受歡迎的早餐', '種類', '人數', '人'], pet: ['養的寵物', '種類', '數量', '隻'], go: ['上學方式', '上學方式', '人數', '人'], flavor: ['喜歡的冰淇淋口味', '口味', '人數', '人'] };
  function pickCats(n) { var k = pick(Object.keys(CATS10)), c = M8shuffle(CATS10[k]).slice(0, Math.min(n, CATS10[k].length)); return { key: k, cats: c, info: CATN10[k] }; }
  // 長條圖：o = { cats, vals, step:每小格多少, per:每幾小格標一個數字, grids:小格數, yName, xName, title, horiz, vals2, legend, base }
  function barSVG(o) {
    var W = 340, H = 268, L = o.horiz ? 70 : 46, R = 326, T = 28, Bm = 206, n = o.cats.length, h = '', c1 = '#4d96ff', c2 = '#ffb703';
    var g = o.grids, step = o.step, per = o.per || 1, two = !!o.vals2;
    var pos = function (v) { return o.horiz ? L + (R - L) * v / (g * step) : Bm - (Bm - T) * v / (g * step); };
    for (var i = 0; i <= g; i++) { var major = i % per === 0, v = i * step;
      if (o.horiz) { var x = pos(v); h += '<line x1="' + x.toFixed(1) + '" y1="' + T + '" x2="' + x.toFixed(1) + '" y2="' + Bm + '" stroke="' + (major ? '#b9b4cc' : '#e6e3f0') + '" stroke-width="1"/>' + (major ? '<text x="' + x.toFixed(1) + '" y="' + (Bm + 16) + '" font-size="11" text-anchor="middle" fill="#555">' + v + '</text>' : ''); }
      else { var y = pos(v); h += '<line x1="' + L + '" y1="' + y.toFixed(1) + '" x2="' + R + '" y2="' + y.toFixed(1) + '" stroke="' + (major ? '#b9b4cc' : '#e6e3f0') + '" stroke-width="1"/>' + (major ? '<text x="' + (L - 5) + '" y="' + (y + 4).toFixed(1) + '" font-size="11" text-anchor="end" fill="#555">' + v + '</text>' : ''); } }
    var slot = ((o.horiz ? Bm - T : R - L)) / n;
    for (var j = 0; j < n; j++) {
      var cpos = (o.horiz ? T : L) + slot * (j + .5), bw = slot * (two ? .32 : .55);
      [[o.vals[j], c1, two ? -bw / 2 - 1 : 0], two ? [o.vals2[j], c2, bw / 2 + 1] : null].forEach(function (s) {
        if (!s) return; var p = pos(s[0]), mid = cpos + s[2];
        if (o.horiz) h += '<rect x="' + L + '" y="' + (mid - bw / 2).toFixed(1) + '" width="' + (p - L).toFixed(1) + '" height="' + bw.toFixed(1) + '" fill="' + s[1] + '" rx="2"/>';
        else h += '<rect x="' + (mid - bw / 2).toFixed(1) + '" y="' + p.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (Bm - p).toFixed(1) + '" fill="' + s[1] + '" rx="2"/>';
        if (o.labels) h += o.horiz ? '<text x="' + (p + 3).toFixed(1) + '" y="' + (mid + 4).toFixed(1) + '" font-size="10" fill="#333">' + s[0] + '</text>' : '<text x="' + mid.toFixed(1) + '" y="' + (p - 3).toFixed(1) + '" font-size="10" text-anchor="middle" fill="#333">' + s[0] + '</text>';
      });
      h += o.horiz ? '<text x="' + (L - 5) + '" y="' + (cpos + 4).toFixed(1) + '" font-size="12" text-anchor="end" fill="#2b2d42" font-weight="700">' + o.cats[j] + '</text>' : '<text x="' + cpos.toFixed(1) + '" y="' + (Bm + 16) + '" font-size="12" text-anchor="middle" fill="#2b2d42" font-weight="700">' + o.cats[j] + '</text>';
    }
    h += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + Bm + '" stroke="#2b2d42" stroke-width="2"/><line x1="' + L + '" y1="' + Bm + '" x2="' + R + '" y2="' + Bm + '" stroke="#2b2d42" stroke-width="2"/>';
    h += '<text x="4" y="16" font-size="12" fill="#2b2d42" font-weight="800">' + o.yName + '</text><text x="' + (W - 4) + '" y="' + (Bm + 32) + '" font-size="12" text-anchor="end" fill="#2b2d42" font-weight="800">' + o.xName + '</text>';
    if (two && o.legend) h += '<rect x="' + (W - 150) + '" y="6" width="10" height="10" fill="' + c1 + '"/><text x="' + (W - 136) + '" y="15" font-size="11">' + o.legend[0] + '</text><rect x="' + (W - 75) + '" y="6" width="10" height="10" fill="' + c2 + '"/><text x="' + (W - 61) + '" y="15" font-size="11">' + o.legend[1] + '</text>';
    h += '<text x="' + (W / 2) + '" y="' + (H - 6) + '" font-size="13" text-anchor="middle" fill="#2b2d42" font-weight="800">' + o.title + '</text>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" class="chart" role="img" aria-label="' + o.title + '">' + h + '</svg>';
  }
  // 折線圖：o = { cats, vals, step, per, grids, base:≈ 以上從幾開始, yName, xName, title, vals2, legend }
  function lineSVG(o) {
    var W = 340, H = 268, L = 46, R = 326, T = 28, Bm = 206, n = o.cats.length, h = '', base = o.base || 0, gap = base ? 16 : 0, g = o.grids, step = o.step, per = o.per || 1;
    var Y = function (v) { return Bm - gap - (Bm - gap - T) * (v - base) / (g * step); };
    for (var i = 0; i <= g; i++) { var v = base + i * step, y = Y(v), major = i % per === 0; h += '<line x1="' + L + '" y1="' + y.toFixed(1) + '" x2="' + R + '" y2="' + y.toFixed(1) + '" stroke="' + (major ? '#b9b4cc' : '#e6e3f0') + '"/>' + (major ? '<text x="' + (L - 5) + '" y="' + (y + 4).toFixed(1) + '" font-size="11" text-anchor="end" fill="#555">' + v + '</text>' : ''); }
    if (base) h += '<text x="' + (L - 5) + '" y="' + (Bm + 4) + '" font-size="11" text-anchor="end" fill="#555">0</text><path d="M' + (L - 7) + ' ' + (Bm - 5) + ' l4 -3 l6 6 l4 -3 M' + (L - 7) + ' ' + (Bm - 11) + ' l4 -3 l6 6 l4 -3" stroke="#2b2d42" stroke-width="1.6" fill="none"/>';
    var X = function (j) { return L + (R - L) * (j + .5) / n; };
    [[o.vals, '#e63946', 'c'], o.vals2 ? [o.vals2, '#2a9d8f', 't'] : null].forEach(function (s) {
      if (!s) return; var pts = s[0].map(function (v, j) { return X(j).toFixed(1) + ',' + Y(v).toFixed(1); });
      h += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + s[1] + '" stroke-width="2.5"/>';
      s[0].forEach(function (v, j) { var x = X(j), y = Y(v); h += s[2] === 'c' ? '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" fill="' + s[1] + '"/>' : '<polygon points="' + x.toFixed(1) + ',' + (y - 5).toFixed(1) + ' ' + (x - 5).toFixed(1) + ',' + (y + 4).toFixed(1) + ' ' + (x + 5).toFixed(1) + ',' + (y + 4).toFixed(1) + '" fill="' + s[1] + '"/>'; });
    });
    for (var j = 0; j < n; j++) h += '<text x="' + X(j).toFixed(1) + '" y="' + (Bm + 16) + '" font-size="11.5" text-anchor="middle" fill="#2b2d42" font-weight="700">' + o.cats[j] + '</text>';
    h += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + Bm + '" stroke="#2b2d42" stroke-width="2"/><line x1="' + L + '" y1="' + Bm + '" x2="' + R + '" y2="' + Bm + '" stroke="#2b2d42" stroke-width="2"/>';
    h += '<text x="4" y="16" font-size="12" fill="#2b2d42" font-weight="800">' + o.yName + '</text><text x="' + (W - 4) + '" y="' + (Bm + 32) + '" font-size="12" text-anchor="end" fill="#2b2d42" font-weight="800">' + o.xName + '</text>';
    if (o.vals2 && o.legend) h += '<circle cx="' + (W - 145) + '" cy="11" r="4" fill="#e63946"/><text x="' + (W - 136) + '" y="15" font-size="11">' + o.legend[0] + '</text><polygon points="' + (W - 70) + ',6 ' + (W - 75) + ',15 ' + (W - 65) + ',15" fill="#2a9d8f"/><text x="' + (W - 61) + '" y="15" font-size="11">' + o.legend[1] + '</text>';
    h += '<text x="' + (W / 2) + '" y="' + (H - 6) + '" font-size="13" text-anchor="middle" fill="#2b2d42" font-weight="800">' + o.title + '</text>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" class="chart" role="img" aria-label="' + o.title + '">' + h + '</svg>';
  }
  // 圖示統計圖：大圖案、小圖案各代表多少
  function pictoHTML(rows, big, small, ib, is, title) {
    return '<div class="picto"><div class="pkey">' + ib + ' 表示 ' + big + '　' + is + ' 表示 ' + small + '</div>' + rows.map(function (r) { var s = ''; for (var i = 0; i < r[1]; i++) s += ib; for (var k = 0; k < r[2]; k++) s += '<small>' + is + '</small>'; return '<div class="prow"><b>' + r[0] + '</b><span>' + s + '</span></div>'; }).join('') + '<div class="ptitle">' + title + '</div></div>';
  }
  // 隨機一張長條圖的資料：數值落在格線或半格上，最大值、最小值只有一個
  function barData(n, step, opt) {
    opt = opt || {};
    for (var t = 0; t < 200; t++) {
      var vals = []; for (var i = 0; i < n; i++) vals.push(step * (ri(2, 9) + (opt.half && Math.random() < .3 ? .5 : 0)));
      if (opt.half) vals = vals.map(function (v) { return Math.round(v); });
      var mx_ = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
      if (vals.filter(function (v) { return v === mx_; }).length === 1 && vals.filter(function (v) { return v === mn; }).length === 1 && (!opt.pair || hasPair(vals))) return vals;
    }
    return vals;
  }
  function hasPair(v) { for (var i = 0; i < v.length; i++) for (var j = i + 1; j < v.length; j++) if (v[i] === v[j]) return true; return false; }
  function barChart(opt) {
    opt = opt || {};
    var C = pickCats(opt.n || ri(4, 5)), step = opt.step || pick([1, 2, 5, 10]), per = step === 1 ? 2 : step === 2 ? 5 : step === 5 ? 2 : 2;
    if (opt.per) per = opt.per;
    var vals = opt.vals || barData(C.cats.length, step, opt), g = Math.ceil(Math.max.apply(null, vals) / step / per) * per + per;
    var cls = opt.cls || '某國小四年甲班';
    return { C: C, vals: vals, step: step, per: per, svg: barSVG({ cats: C.cats, vals: vals, step: step, per: per, grids: g, yName: (opt.horiz ? C.info[1] : C.info[2] + '(' + C.info[3] + ')'), xName: opt.horiz ? C.info[2] + '(' + C.info[3] + ')' : C.info[1], title: cls + C.info[0] + C.info[2] + '長條圖', horiz: opt.horiz, labels: opt.labels }) };
  }
  /* ---------------- 第 9 單元 分數：答案保留原分母（4上 還沒教約分）、只有同分母 ---------------- */
  function fq(n, d) { return '<span class="fq"><b>' + n + '</b><i></i><b>' + d + '</b></span>'; }
  function mx(w, n, d) { return !n ? String(w) : w ? '<span class="mx">' + w + fq(n, d) + '</span>' : fq(n, d); }
  function mxT(w, n, d) { return !n ? String(w) : (w ? w + ' 又 ' : '') + n + '/' + d; } // 文字版（說明裡用）
  // 依答案的樣子給填答格：整數→一格；真分數→分子；帶分數→整數＋分子（分母直接顯示）
  function fracQ(q, tot, d, unit, ex, dg, imp) {
    var w = Math.floor(tot / d), n = tot % d, f, a;
    if (imp) { f = [{ fr: 'n', den: d, unit: unit || '' }]; a = [tot]; }
    else if (!n) { f = [{ pre: '', unit: unit || '' }]; a = [w]; }
    else if (!w) { f = [{ fr: 'n', den: d, unit: unit || '' }]; a = [n]; }
    else { f = [{ fr: 'w' }, { fr: 'n', den: d, unit: unit || '' }]; a = [w, n]; }
    return { q: q, fields: f, ans: a, ansText: imp ? fq(tot, d) : mx(w, n, d), ex: ex, dg: function (v) { var x = v.length === 2 ? v[0] * d + v[1] : f[0].fr === 'n' && !imp ? v[0] : imp ? v[0] : v[0] * d; return (dg && dg(x, v)) || (v.length === 2 && v[1] >= d ? '分數部分比分母大（或一樣大），要再換出整數，帶分數的分數部分要是真分數。' : ''); } };
  }
  // 分數條：k 個整個（平分成 d 份），最後一個塗 r 份
  function fracBars(k, r, d, unit) {
    var W = 260, cw = W / d, h = '', y = 0, n = k + (r ? 1 : 0);
    for (var i = 0; i < n; i++) { var full = i < k; h += '<g transform="translate(0 ' + y + ')">'; for (var j = 0; j < d; j++) h += '<rect x="' + (j * cw + 1) + '" y="1" width="' + (cw - 2) + '" height="26" rx="3" fill="' + (full || j < r ? '#ff9f1c' : '#fff') + '" stroke="#c9bff2" stroke-width="1.5"/>'; h += '</g>'; y += 34; }
    return '<svg viewBox="0 0 ' + W + ' ' + y + '" width="' + W + '" height="' + y + '" role="img" aria-label="每' + (unit || '條') + '平分成 ' + d + ' 份">' + h + '</svg>';
  }
  /* ---------------- 第 8 單元：兩步驟應用題的題目（都換過數字，答案都是正整數、除法都整除） ---------------- */
  function M8shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function story8() {
    var t = ri(0, 9), P, x, y, n, k, N, r, o, d, m, T;
    if (t === 0) { P = pick([100, 200, 500]); x = ri(12, 60); y = ri(12, 60); if (x + y >= P) y = P - x - ri(5, 9); return { q: '有 <b>' + P + ' 元</b>，買了一個 <b>' + x + ' 元</b>和一個 <b>' + y + ' 元</b>的東西，還剩多少元？', right: P + ' － (' + x + ' ＋ ' + y + ')', alt: P + ' － ' + x + ' － ' + y, wrong: [P + ' － ' + x + ' ＋ ' + y, P + ' ＋ ' + x + ' － ' + y], ans: P - x - y, mid: x + y, unit: '元', wv: [P - x + y], wtip: '買了兩樣都要扣掉：先算兩樣共花多少，用括號包起來。', note: '' }; }
    if (t === 1) { o = ri(55, 95); d = ri(8, 25); P = 100; return { q: '一盒壽司原價 <b>' + o + ' 元</b>，特價每盒便宜 <b>' + d + ' 元</b>。買一盒，付 <b>100 元</b>，會找回多少元？', right: '100 － (' + o + ' － ' + d + ')', wrong: ['100 － ' + o + ' － ' + d, '100 － ' + o + ' ＋ ' + d + ' ＋ ' + d], ans: 100 - (o - d), mid: o - d, unit: '元', wv: [100 - o - d, 100 - o], wtip: '先算一盒特價是多少錢。', note: '先算特價：' + o + ' － ' + d + ' ＝ ' + (o - d) + '。' }; }
    if (t === 2) { m = ri(25, 48); k = ri(5, 15); return { q: '合唱團的女生有 <b>' + m + ' 人</b>，男生比女生少 <b>' + k + ' 人</b>。合唱團一共有幾人？', right: m + ' ＋ (' + m + ' － ' + k + ')', wrong: [m + ' ＋ ' + k, m + ' － ' + k + ' ＋ ' + k], ans: m + m - k, mid: m - k, unit: '人', wv: [m + k, m - k], wtip: '先算男生有幾人：' + m + ' － ' + k + '，再合起來。', note: '' }; }
    if (t === 3) { n = ri(2, 4); T = n * ri(8, 60) * 5; P = Math.ceil((T / n) / 100) * 100 + pick([100, 200]); return { q: '有 <b>' + P + ' 元</b>，和家人共 <b>' + n + ' 人</b>合買一個 <b>' + T + ' 元</b>的禮物，每人出一樣多。付完後還剩多少元？', right: P + ' － ' + T + ' ÷ ' + n, wrong: ['(' + P + ' － ' + T + ') ÷ ' + n, P + ' － ' + T], ans: P - T / n, mid: T / n, unit: '元', wv: [P - T], wtip: '每人只出一部分：先算一人要出多少元。', note: '先算除法：一人出 ' + T + ' ÷ ' + n + ' ＝ ' + (T / n) + ' 元。' }; }
    if (t === 4) { k = ri(3, 8); N = k * ri(12, 40); x = ri(15, 40); return { q: '有 <b>' + N + ' 顆</b>草莓，每 <b>' + k + ' 顆</b>串成一串，每串賣 <b>' + x + ' 元</b>。全部賣完可以賣多少元？', right: N + ' ÷ ' + k + ' × ' + x, wrong: [N + ' ÷ (' + k + ' × ' + x + ')', N + ' × ' + k + ' ÷ ' + x], ans: N / k * x, mid: N / k, unit: '元', wv: [], wtip: '', note: '先算可以串成幾串：' + N + ' ÷ ' + k + ' ＝ ' + (N / k) + '。' }; }
    if (t === 5) { k = ri(4, 9); r = ri(3, 12); N = k * ri(15, 40) + r; return { q: '有 <b>' + N + ' 顆</b>雞蛋，破了 <b>' + r + ' 顆</b>，剩下的每 <b>' + k + ' 顆</b>裝一盒，可以裝幾盒？', right: '(' + N + ' － ' + r + ') ÷ ' + k, wrong: [N + ' － ' + r + ' ÷ ' + k, N + ' ÷ ' + k + ' － ' + r], ans: (N - r) / k, mid: N - r, unit: '盒', wv: [], wtip: '', note: '先算剩下幾顆，要用括號包起來。' }; }
    if (t === 6) { x = ri(18, 30); y = ri(18, 30); T = (x + y) * ri(4, 12); return { q: '甲班有 <b>' + x + ' 人</b>，乙班有 <b>' + y + ' 人</b>，<b>' + T + ' 張</b>貼紙平分給兩班的每一個人，一人分到幾張？', right: T + ' ÷ (' + x + ' ＋ ' + y + ')', wrong: [T + ' ÷ ' + x + ' ＋ ' + y, T + ' ÷ ' + x + ' ÷ ' + y], ans: T / (x + y), mid: x + y, unit: '張', wv: [], wtip: '', note: '先算兩班一共幾人。' }; }
    if (t === 7) { n = ri(2, 5); var each = ri(3, 9); T = each * 12 * n; return { q: '一打鉛筆有 12 枝，買了 <b>' + n + ' 打</b>，一共付 <b>' + T + ' 元</b>。一枝鉛筆幾元？', right: T + ' ÷ (12 × ' + n + ')', alt: T + ' ÷ ' + n + ' ÷ 12', wrong: [T + ' ÷ 12 × ' + n, T + ' × ' + n + ' ÷ 12'], ans: each, mid: 12 * n, unit: '元', wv: [T / 12 * n], wtip: '先算一共幾枝（12 × ' + n + '），或先算一打幾元，再除以 12。', note: '' }; }
    if (t === 8) { x = ri(40, 80); y = ri(15, 35); n = ri(2, 4); return { q: '動物園的成人票 <b>' + x + ' 元</b>，兒童票 <b>' + y + ' 元</b>。買 1 張成人票和 <b>' + n + ' 張</b>兒童票，一共要多少元？', right: x + ' ＋ ' + y + ' × ' + n, wrong: ['(' + x + ' ＋ ' + y + ') × ' + n, x + ' × ' + y + ' ＋ ' + n], ans: x + y * n, mid: y * n, unit: '元', wv: [(x + y) * n], wtip: '成人票只買 1 張：先算兒童票 ' + y + ' × ' + n + '，再加成人票。', note: '先乘後加，可以不加括號。' }; }
    P = pick([500, 1000]); x = ri(45, 230); n = ri(2, 4); if (x * n >= P) x = Math.floor((P - 20) / n);
    return { q: '用 <b>' + P + ' 元</b>買 <b>' + n + ' 個</b> <b>' + x + ' 元</b>的便當，會找回多少元？', right: P + ' － ' + x + ' × ' + n, wrong: ['(' + P + ' － ' + x + ') × ' + n, x + ' × ' + n + ' － ' + P], ans: P - x * n, mid: x * n, unit: '元', wv: [(P - x) * n], wtip: '先算 ' + n + ' 個便當一共多少元，再用 ' + P + ' 去減。', note: '先乘後減，可以不加括號。' };
  }
  /* ---------------- 第 7 單元 小數：用「幾個 0.01」的整數來算，避免小數誤差 ---------------- */
  // h：百分之幾的整數（2.34 → 234）
  function fmtD(h) { var w = Math.floor(h / 100), f = h % 100; if (!f) return String(w); return w + '.' + (f % 10 ? (f < 10 ? '0' : '') + f : String(f / 10)); }
  var DIG = '零一二三四五六七八九';
  function readD(h) { var s = fmtD(h), p = s.split('.'); return readNum(+p[0]) + (p[1] ? '點' + p[1].split('').map(function (c) { return DIG[+c]; }).join('') : ''); }
  // 百格板：k 格塗色（先一整條一整條塗，再塗零散的）
  function gridSVG(k, size, col) {
    size = size || 150; var c = size / 10, h = '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" class="grid100" role="img" aria-label="百格板塗了 ' + k + ' 格">';
    for (var i = 0; i < 100; i++) { var col_ = Math.floor(i / 10), row = i % 10; h += '<rect x="' + (col_ * c + .5) + '" y="' + (row * c + .5) + '" width="' + (c - 1) + '" height="' + (c - 1) + '" fill="' + (i < k ? (col || '#ff9f1c') : '#fff') + '" stroke="#c9bff2" stroke-width="1"/>'; }
    return h + '<rect x=".5" y=".5" width="' + (size - 1) + '" height="' + (size - 1) + '" fill="none" stroke="#7b61ff" stroke-width="2"/></svg>';
  }
  // 小數答案的診斷：拿到孩子的數字 x，正確的是 h（幾個 0.01）
  function decHint(x, h) {
    var r = Math.round(x * 100);
    if (Math.abs(x * 100 - r) > 1e-6) return '小數點後面最多寫到百分位（第 2 位）喔。';
    if (r === h * 10 || r * 10 === h) return '小數點的位置差了一位：0.1 記在十分位（小數點後第 1 位），0.01 記在百分位（第 2 位）。';
    return '';
  }
  function decQ(q, h, unit, ex, dg) { return { q: q, fields: [{ pre: '', unit: unit || '' }], ans: [h / 100], dec: true, ex: ex, dg: function (v) { return (dg && dg(Math.round(v[0] * 100), v[0])) || decHint(v[0], h); } }; }
  /* 乘數是二位數的直式：第一行幾個一、第二行幾個十（課本 p.22～28） */
  function mulTwo(a, b) {
    var u = b % 10, tn = Math.floor(b / 10), p1 = a * u, p2 = a * tn, ans = a * b;
    var ex = u ? a + ' × ' + u + ' ＝ ' + p1 + '（個一），' + a + ' × ' + tn + ' ＝ ' + p2 + '（個十），' + p1 + ' ＋ ' + (p2 * 10) + ' ＝ <b>' + ans + '</b>。'
      : b + ' 是 ' + tn + ' 個十：' + a + ' × ' + tn + ' ＝ ' + p2 + '，再補一個 0 → <b>' + ans + '</b>。';
    return { q: '<b class="num">' + a + ' × ' + b + '</b> ＝ ？', fields: [{ pre: '', unit: '' }], ans: [ans], ex: '照算式的順序寫直式（' + a + ' 在上、' + b + ' 在下），個位對齊。' + ex,
      dg: function (x) { x = x[0]; if (u && x === p1 + p2) return '第二行是乘「' + tn + '0」，要從十位開始寫（後面補 0）再加起來。'; if (!u && x === p2) return '乘數 ' + b + ' 最右邊有 0，答案後面要補一個 0。'; if (u && (x === p1 || x === p2 * 10)) return '兩行都乘完以後，要加起來才是答案。'; if (p10(Math.abs(x - ans))) return '答案差了 ' + Math.abs(x - ans) + '，可能是有一位的進位漏掉了。'; return ''; } };
  }
  function divDiag(N, d, Q, R) {
    return function (v) {
      var q = v[0], r = v[1];
      if (r >= d) return '餘數 ' + r + ' 比除數 ' + d + ' 大（或一樣大），表示商還可以再大一點。';
      if (q * d > N) return '除數 × 商 ＝ ' + d + ' × ' + q + ' ＝ ' + (q * d) + '，比被除數 ' + N + ' 還大，商太大了，改小一點。';
      if (q === Q && r !== R) return '商對了！餘數再算一次：' + N + ' － ' + d + ' × ' + Q + '。';
      if (q * d + r !== N && Math.abs(q - Q) >= 10 && p10(Math.abs(q - Q))) return '商差了 ' + Math.abs(q - Q) + '，可能是有一位的商忘了寫（不夠除的那一位要寫 0）。';
      return '用「除數 × 商 ＋ 餘數」驗算，看看是不是 ' + N + '。';
    };
  }

  /* ---------------- 卡片 ---------------- */
  var cards = [];
  // 國語：看注音寫國字（課文句子，從各課頁面整理）
  var CHARS = [
    {"l":1,"c":"戶","zy":"ㄏㄨˋ","bs":"戶","tot":4,"w":["窗戶","門戶","家家戶戶"],"tx":"打開窗戶"},
    {"l":1,"c":"漫","zy":"ㄇㄢˋ","bs":"水","tot":14,"w":["浪漫","漫長","漫畫"],"tx":"浪漫的藝術家"},
    {"l":1,"c":"季","zy":"ㄐㄧˋ","bs":"子","tot":8,"w":["四季","季節","季風"],"tx":"展現四季不同的風采"},
    {"l":1,"c":"素","zy":"ㄙㄨˋ","bs":"糸","tot":10,"w":["素淨","樸素","素食"],"tx":"素淨的枝條"},
    {"l":1,"c":"嫩","zy":"ㄋㄣˋ","bs":"女","tot":14,"w":["嫩葉","嬌嫩","鮮嫩"],"tx":"一串串嫩葉"},
    {"l":1,"c":"繁","zy":"ㄈㄢˊ","bs":"糸","tot":17,"w":["繁華","繁多","繁忙"],"tx":"繁華墨綠"},
    {"l":1,"c":"墨","zy":"ㄇㄛˋ","bs":"黑","tot":15,"w":["墨綠","墨水","筆墨"],"tx":"繁華墨綠"},
    {"l":1,"c":"姿","zy":"ㄗ","bs":"女","tot":9,"w":["姿態","姿勢","多采多姿"],"tx":"最多采多姿的時節"},
    {"l":1,"c":"簇","zy":"ㄘㄨˋ","bs":"竹","tot":17,"w":["一簇","花團錦簇","簇新"],"tx":"一簇一簇的黃花"},
    {"l":1,"c":"週","zy":"ㄓㄡ","bs":"辵","tot":12,"w":["幾週","週末","週年"],"tx":"幾週後"},
    {"l":1,"c":"淡","zy":"ㄉㄢˋ","bs":"水","tot":11,"w":["淡紅色","平淡","冷淡"],"tx":"淡紅色的果實"},
    {"l":1,"c":"穫","zy":"ㄏㄨㄛˋ","bs":"禾","tot":19,"w":["收穫"],"tx":"收穫的季節"},
    {"l":1,"c":"迎","zy":"ㄧㄥˊ","bs":"辵","tot":8,"w":["迎接","歡迎","迎面"],"tx":"迎接又一個新的開始"},
    {"l":1,"c":"幅","zy":"ㄈㄨˊ","bs":"巾","tot":12,"w":["一幅","篇幅","幅度"],"tx":"像一幅風景畫"},
    {"l":1,"c":"伴","zy":"ㄅㄢˋ","bs":"人","tot":7,"w":["相伴","陪伴","同伴"],"tx":"靜靜相伴"},
    {"l":2,"c":"汽","zy":"ㄑㄧˋ","bs":"水","tot":7,"w":["汽車","汽水","汽油"],"tx":"被汽車撞倒"},
    {"l":2,"c":"煮","zy":"ㄓㄨˇ","bs":"火","tot":12,"w":["煮粥","煮飯","烹煮"],"tx":"為我煮了湯鮮味美的排骨粥"},
    {"l":2,"c":"骨","zy":"ㄍㄨˇ","bs":"骨","tot":10,"w":["排骨","骨頭","骨折"],"tx":"先將新鮮排骨燙過"},
    {"l":2,"c":"粥","zy":"ㄓㄡ","bs":"米","tot":12,"w":["排骨粥","八寶粥","臘八粥"],"tx":"奶奶的排骨粥"},
    {"l":2,"c":"燙","zy":"ㄊㄤˋ","bs":"火","tot":16,"w":["燙過","燙傷","滾燙"],"tx":"先將新鮮排骨燙過"},
    {"l":2,"c":"換","zy":"ㄏㄨㄢˋ","bs":"手","tot":12,"w":["換水","交換","更換"],"tx":"再換水，煮出精華"},
    {"l":2,"c":"即","zy":"ㄐㄧˊ","bs":"卩","tot":7,"w":["入口即化","即使","立即"],"tx":"煮到入口即化"},
    {"l":2,"c":"菜","zy":"ㄘㄞˋ","bs":"艸","tot":12,"w":["青菜","拿手好菜","菜園"],"tx":"最後，放入青菜"},
    {"l":2,"c":"齒","zy":"ㄔˇ","bs":"齒","tot":15,"w":["牙齒","齒輪","乳齒"],"tx":"兩排牙齒早就換成假牙"},
    {"l":2,"c":"餐","zy":"ㄘㄢ","bs":"食","tot":16,"w":["餐桌","早餐","野餐"],"tx":"奶奶餐桌上的好同伴"},
    {"l":2,"c":"矯","zy":"ㄐㄧㄠˇ","bs":"矢","tot":17,"w":["矯正","矯健","矯治"],"tx":"我做了牙齒矯正"},
    {"l":2,"c":"餓","zy":"ㄜˋ","bs":"食","tot":15,"w":["肚子餓","飢餓","挨餓"],"tx":"特別容易肚子餓"},
    {"l":2,"c":"彷","zy":"ㄈㄤˇ","bs":"彳","tot":7,"w":["彷彿"],"tx":"彷彿我又成了那個小孩"},
    {"l":2,"c":"彿","zy":"ㄈㄨˊ","bs":"彳","tot":8,"w":["彷彿"],"tx":"彷彿我又成了那個小孩"},
    {"l":2,"c":"濃","zy":"ㄋㄨㄥˊ","bs":"水","tot":16,"w":["濃濃的","濃厚","濃霧"],"tx":"濃濃的排骨粥"},
    {"l":3,"c":"蓮","zy":"ㄌㄧㄢˊ","bs":"艸","tot":15,"w":["花蓮","蓮花","蓮子"],"tx":"走出位在花蓮的豐田車站"},
    {"l":3,"c":"式","zy":"ㄕˋ","bs":"弋","tot":6,"w":["日式","方式","樣式"],"tx":"一間蘋果綠的日式建築"},
    {"l":3,"c":"士","zy":"ㄕˋ","bs":"士","tot":3,"w":["人士","士兵","士氣"],"tx":"在一群熱心人士的努力下"},
    {"l":3,"c":"拆","zy":"ㄔㄞ","bs":"手","tot":8,"w":["拆除","拆開","拆禮物"],"tx":"有間原本要被拆除的老房子"},
    {"l":3,"c":"民","zy":"ㄇㄧㄣˊ","bs":"氏","tot":5,"w":["民國","人民","居民"],"tx":"在民國九十七年開幕了"},
    {"l":3,"c":"志","zy":"ㄓˋ","bs":"心","tot":7,"w":["志工","志向","志氣"],"tx":"大學生、老師以及志工陪伴社區的孩子"},
    {"l":3,"c":"酸","zy":"ㄙㄨㄢ","bs":"酉","tot":14,"w":["酸味","酸甜","酸痛"],"tx":"體會酸、甜、苦、辣、鹹這人生五味"},
    {"l":3,"c":"辣","zy":"ㄌㄚˋ","bs":"辛","tot":14,"w":["辣椒","酸甜苦辣","麻辣"],"tx":"體會酸、甜、苦、辣、鹹這人生五味"},
    {"l":3,"c":"存","zy":"ㄘㄨㄣˊ","bs":"子","tot":6,"w":["存下來","點數存摺","存錢"],"tx":"而存下來的點數"},
    {"l":3,"c":"靠","zy":"ㄎㄠˋ","bs":"非","tot":15,"w":["靠自己","依靠","可靠"],"tx":"靠自己努力獲得機會"},
    {"l":3,"c":"獲","zy":"ㄏㄨㄛˋ","bs":"犬","tot":17,"w":["獲得","獲勝","不勞而獲"],"tx":"靠自己努力獲得機會"},
    {"l":3,"c":"態","zy":"ㄊㄞˋ","bs":"心","tot":14,"w":["態度","工作態度","姿態"],"tx":"讓孩子建立了……的工作態度"},
    {"l":3,"c":"與","zy":"ㄩˋ","bs":"臼","tot":14,"w":["參與","與會"],"tx":"人只要願意參與，事情就有『可能』"},
    {"l":3,"c":"支","zy":"ㄓ","bs":"支","tot":4,"w":["支持","支架","支付"],"tx":"從陪伴中得到支持"},
    {"l":3,"c":"未","zy":"ㄨㄟˋ","bs":"木","tot":5,"w":["未來","尚未","未必"],"tx":"讓未來充滿希望"},
    {"l":4,"c":"淺","zy":"ㄑㄧㄢˇ","bs":"水","tot":11,"w":["淺淺","深淺","淺顯"],"tx":"淺淺一彎"},
    {"l":4,"c":"搧","zy":"ㄕㄢ","bs":"手","tot":13,"w":["搧風","搧扇子"],"tx":"在山腳下喊熱搧風"},
    {"l":4,"c":"針","zy":"ㄓㄣ","bs":"金","tot":10,"w":["針葉","打針","指南針"],"tx":"細細的針葉密密"},
    {"l":4,"c":"縫","zy":"ㄈㄥˊ","bs":"糸","tot":17,"w":["縫製","縫衣服","縫補"],"tx":"在山頭上縫著暖衣"},
    {"l":4,"c":"嶼","zy":"ㄩˇ","bs":"山","tot":17,"w":["島嶼"],"tx":"訴說島嶼的故事"},
    {"l":4,"c":"峰","zy":"ㄈㄥ","bs":"山","tot":10,"w":["峰頂","山峰","高峰"],"tx":"峰頂的氣象站"},
    {"l":4,"c":"領","zy":"ㄌㄧㄥˇ","bs":"頁","tot":14,"w":["領受","帶領","領帶"],"tx":"領受太平洋第一道吹拂而來的風"},
    {"l":4,"c":"拂","zy":"ㄈㄨˊ","bs":"手","tot":8,"w":["吹拂","拂去"],"tx":"第一道吹拂而來的風"},
    {"l":4,"c":"頑","zy":"ㄨㄢˊ","bs":"頁","tot":13,"w":["頑皮","頑強"],"tx":"頑皮的風"},
    {"l":4,"c":"奏","zy":"ㄗㄡˋ","bs":"大","tot":9,"w":["吹奏","演奏","節奏"],"tx":"吹奏著多變的樂曲"},
    {"l":4,"c":"曲","zy":"ㄑㄩˇ","bs":"曰","tot":6,"w":["樂曲","歌曲","曲子"],"tx":"吹奏著多變的樂曲"},
    {"l":4,"c":"溪","zy":"ㄒㄧ","bs":"水","tot":13,"w":["小溪","溪水","溪流"],"tx":"每一條溪"},
    {"l":4,"c":"聆","zy":"ㄌㄧㄥˊ","bs":"耳","tot":11,"w":["聆聽"],"tx":"聆聽，翻唱"},
    {"l":4,"c":"翻","zy":"ㄈㄢ","bs":"羽","tot":18,"w":["翻唱","翻開","翻身"],"tx":"聆聽，翻唱玉山之歌"},
    {"l":5,"c":"困","zy":"ㄎㄨㄣˋ","bs":"口","tot":7,"w":["困難","困境","困住"],"tx":"克服種種困難"},
    {"l":5,"c":"舉","zy":"ㄐㄩˇ","bs":"臼","tot":17,"w":["舉重","舉起","舉手"],"tx":"成為舉重國手"},
    {"l":5,"c":"挑","zy":"ㄊㄧㄠˇ","bs":"手","tot":9,"w":["挑戰","挑選","挑食"],"tx":"勇於挑戰自我"},
    {"l":5,"c":"戰","zy":"ㄓㄢˋ","bs":"戈","tot":16,"w":["挑戰","作戰","戰爭"],"tx":"勇於挑戰自我"},
    {"l":5,"c":"爭","zy":"ㄓㄥ","bs":"爪","tot":8,"w":["爭光","爭取","競爭"],"tx":"努力為臺灣爭光"},
    {"l":5,"c":"佩","zy":"ㄆㄟˋ","bs":"人","tot":8,"w":["佩服","敬佩"],"tx":"讓我佩服不已"},
    {"l":5,"c":"斤","zy":"ㄐㄧㄣ","bs":"斤","tot":4,"w":["公斤","斤兩"],"tx":"體重不到六十公斤"},
    {"l":5,"c":"紀","zy":"ㄐㄧˋ","bs":"糸","tot":9,"w":["紀錄","年紀","紀念"],"tx":"打破世界紀錄"},
    {"l":5,"c":"震","zy":"ㄓㄣˋ","bs":"雨","tot":15,"w":["震驚","地震","震動"],"tx":"心中非常震驚"},
    {"l":5,"c":"竭","zy":"ㄐㄧㄝˊ","bs":"立","tot":14,"w":["竭盡全力","枯竭"],"tx":"竭盡全力"},
    {"l":5,"c":"棄","zy":"ㄑㄧˋ","bs":"木","tot":11,"w":["放棄","拋棄"],"tx":"不輕言放棄"},
    {"l":5,"c":"程","zy":"ㄔㄥˊ","bs":"禾","tot":12,"w":["過程","課程","路程"],"tx":"過程相當辛苦"},
    {"l":5,"c":"捐","zy":"ㄐㄩㄢ","bs":"手","tot":10,"w":["捐款","捐贈","捐血"],"tx":"把獎金捐給醫院"},
    {"l":5,"c":"驕","zy":"ㄐㄧㄠ","bs":"馬","tot":22,"w":["驕傲"],"tx":"令人驕傲的臺灣之光"},
    {"l":5,"c":"傲","zy":"ㄠˋ","bs":"人","tot":13,"w":["驕傲","傲慢"],"tx":"令人驕傲的臺灣之光"},
    {"l":6,"c":"尺","zy":"ㄔˇ","bs":"尸","tot":4,"w":["公尺","尺寸","直尺"],"tx":"一千九百三十九公尺"},
    {"l":6,"c":"亞","zy":"ㄧㄚˋ","bs":"二","tot":8,"w":["亞洲","亞軍"],"tx":"曾是亞洲第一長橋"},
    {"l":6,"c":"洲","zy":"ㄓㄡ","bs":"水","tot":9,"w":["亞洲","沙洲","五大洲"],"tx":"曾是亞洲第一長橋"},
    {"l":6,"c":"跨","zy":"ㄎㄨㄚˋ","bs":"足","tot":13,"w":["跨過","跨年","跨越"],"tx":"跨過濁水溪"},
    {"l":6,"c":"鋼","zy":"ㄍㄤ","bs":"金","tot":16,"w":["鋼鐵","鋼琴","鋼拱"],"tx":"不怕挑戰的鋼鐵紅龍"},
    {"l":6,"c":"護","zy":"ㄏㄨˋ","bs":"言","tot":21,"w":["保護","守護","愛護"],"tx":"接受它的保護"},
    {"l":6,"c":"層","zy":"ㄘㄥˊ","bs":"尸","tot":15,"w":["樓層","兩層樓","層次"],"tx":"約兩層樓高"},
    {"l":6,"c":"鈔","zy":"ㄔㄠ","bs":"金","tot":12,"w":["紙鈔","鈔票"],"tx":"以前發行的紙鈔"},
    {"l":6,"c":"仍","zy":"ㄖㄥˊ","bs":"人","tot":4,"w":["仍然","仍是","仍舊"],"tx":"但仍是西螺最「紅」的地標"},
    {"l":6,"c":"標","zy":"ㄅㄧㄠ","bs":"木","tot":15,"w":["地標","目標","標準"],"tx":"西螺最「紅」的地標"},
    {"l":6,"c":"融","zy":"ㄖㄨㄥˊ","bs":"虫","tot":16,"w":["金融","融化","融合"],"tx":"這座金融大樓"},
    {"l":6,"c":"仰","zy":"ㄧㄤˇ","bs":"人","tot":6,"w":["仰望","敬仰","仰頭"],"tx":"人們仰望的臺灣驕傲"},
    {"l":6,"c":"內","zy":"ㄋㄟˋ","bs":"入","tot":4,"w":["內部","室內","內容"],"tx":"大樓的內部"},
    {"l":6,"c":"俯","zy":"ㄈㄨˇ","bs":"人","tot":10,"w":["俯視","俯瞰"],"tx":"總是靜靜俯視著街道"},
    {"l":6,"c":"煙","zy":"ㄧㄢ","bs":"火","tot":13,"w":["煙火","炊煙","煙霧"],"tx":"每年跨年煙火"},
    {"l":7,"c":"育","zy":"ㄩˋ","bs":"肉","tot":8,"w":["戶外教育","教育","體育"],"tx":"戶外教育日"},
    {"l":7,"c":"情","zy":"ㄑㄧㄥˊ","bs":"心","tot":11,"w":["心情","情形","友情"],"tx":"我的心情很晴朗（課文）"},
    {"l":7,"c":"陶","zy":"ㄊㄠˊ","bs":"阜","tot":11,"w":["陶器","陶醉","陶瓷"],"tx":"傳習所介紹陶器"},
    {"l":7,"c":"目","zy":"ㄇㄨˋ","bs":"目","tot":5,"w":["目不轉睛","題目","目標"],"tx":"令人目不轉睛"},
    {"l":7,"c":"芒","zy":"ㄇㄤˊ","bs":"艸","tot":9,"w":["光芒","芒果","鋒芒"],"tx":"閃著七彩光芒"},
    {"l":7,"c":"返","zy":"ㄈㄢˇ","bs":"辵","tot":8,"w":["流連忘返","返回","往返"],"tx":"讓我流連忘返"},
    {"l":7,"c":"劇","zy":"ㄐㄩˋ","bs":"刀","tot":15,"w":["劇場","戲劇","劇本"],"tx":"到劇場觀賞"},
    {"l":7,"c":"斗","zy":"ㄉㄡˇ","bs":"斗","tot":4,"w":["翻跟斗","斗大","北斗星"],"tx":"又唱又跳、翻跟斗"},
    {"l":7,"c":"索","zy":"ㄙㄨㄛˇ","bs":"糸","tot":10,"w":["鋼索","索性","探索"],"tx":"走在細細的鋼索上"},
    {"l":7,"c":"禁","zy":"ㄐㄧㄣ","bs":"示","tot":13,"w":["不禁","禁止","禁不住"],"tx":"大家不禁捏一把冷汗"},
    {"l":7,"c":"渡","zy":"ㄉㄨˋ","bs":"水","tot":13,"w":["渡船頭","渡過","橫渡"],"tx":"到渡船頭坐木船"},
    {"l":7,"c":"念","zy":"ㄋㄧㄢˋ","bs":"心","tot":8,"w":["紀念品","念書","想念"],"tx":"挑著喜歡的紀念品"},
    {"l":7,"c":"麵","zy":"ㄇㄧㄢˋ","bs":"麥","tot":15,"w":["捏麵人","麵包","麵條"],"tx":"五顏六色的捏麵人"},
    {"l":7,"c":"統","zy":"ㄊㄨㄥˇ","bs":"糸","tot":12,"w":["傳統","統一","總統"],"tx":"許多傳統文化"},
    {"l":7,"c":"值","zy":"ㄓˊ","bs":"人","tot":10,"w":["值得","價值","值日生"],"tx":"值得細細品味"}
  ];
  CHARS.forEach(function (c) { cards.push({ id: 'cn:' + c.c, s: 'cn', u: 'cn' + c.l, type: 'write', c: c.c, zy: c.zy, bs: c.bs, tot: c.tot, w: c.w, tx: c.tx }); });

  // 國語：改錯字。把各課頁面列的形近字放進課文句子，點出寫錯的字（「紀錄／記錄」兩種寫法都常見，不出）
  var LOOK = [
    [1,"漫","慢","浪漫的藝術家"],
    [1,"繁","緊","繁華墨綠"],
    [1,"墨","黑","繁華墨綠"],
    [1,"姿","資","最多采多姿的時節"],
    [1,"幅","福","像一幅風景畫"],
    [1,"氣","棄","家裡充滿了藝術氣息"],
    [2,"汽","氣","被汽車撞倒"],
    [2,"燙","湯","先將新鮮排骨燙過"],
    [2,"換","喚","再換水，煮出精華"],
    [2,"菜","彩","最後，放入青菜"],
    [2,"矯","橋","我做了牙齒矯正"],
    [2,"濃","農","濃濃的排骨粥"],
    [3,"式","武","一間蘋果綠的日式建築"],
    [3,"士","土","在一群熱心人士的努力下"],
    [3,"獲","穫","靠自己努力獲得機會"],
    [3,"支","友","從陪伴中得到支持"],
    [4,"淺","錢","淺淺一彎"],
    [4,"針","汁","細細的針葉密密"],
    [4,"嶼","與","訴說島嶼的故事"],
    [4,"峰","蜂","峰頂的氣象站"],
    [4,"領","頑","領受太平洋第一道吹拂而來的風"],
    [4,"頑","領","頑皮的風"],
    [5,"困","因","克服種種困難"],
    [5,"爭","掙","努力為臺灣爭光"],
    [5,"震","雲","心中非常震驚"],
    [5,"棄","氣","不輕言放棄"],
    [6,"尺","戶","一千九百三十九公尺"],
    [6,"護","獲","接受它的保護"],
    [6,"層","曾","約兩層樓高"],
    [6,"標","飄","西螺最「紅」的地標"],
    [6,"仰","迎","人們仰望的臺灣驕傲"],
    [7,"情","晴","我的心情很晴朗"],
    [7,"陶","淘","傳習所介紹陶器"],
    [7,"返","反","讓我流連忘返"],
    [7,"渡","度","到渡船頭坐木船"],
    [7,"念","忘","挑著喜歡的紀念品"]
  ];
  LOOK.forEach(function (x) {
    var k = x[3].indexOf(x[1]), wrong = x[3].slice(0, k) + x[2] + x[3].slice(k + 1);
    cards.push({ id: 'cnx' + x[0] + ':' + x[1] + ':' + x[2], s: 'cn', u: 'cn' + x[0], type: 'spot', label: '改錯字：' + x[1], q: '這句話有一個<b>錯字</b>，把它點出來。', parts: wrong.split(''), bad: k,
      fix: '「' + x[2] + '」要改成「<b>' + x[1] + '</b>」：' + x[3], ex: '「' + x[1] + '」和「' + x[2] + '」長得很像，要看清楚。' });
  });

  // 數學：一型一張卡
  [['ma1', 'place', '數字表示多少'], ['ma1', 'write', '大數寫成數字'], ['ma1', 'addsub', '大數加減'], ['ma1', 'seq', '依序加 1000、10000'], ['ma1', 'compose', '幾個萬、幾個千合起來'], ['ma1', 'wan', '用「萬」當單位'],
   ['ma2', 'mul41', '四位數 × 一位數'], ['ma2', 'mul22', '一、二位數 × 二位數'], ['ma2', 'mul32', '三位數 × 二位數'], ['ma2', 'mul42', '四位數 × 二位數'], ['ma2', 'quick', '補 0 快算'],
   ['ma3', 'angle', '角度計算'], ['ma3', 'protractor', '量角器內外圈'], ['ma3', 'angleKind', '角度分類'], ['ma3', 'clockDir', '順時針與逆時針'],
   ['ma4', 'div41', '四位數 ÷ 一位數'], ['ma4', 'div22', '二位數 ÷ 二位數'], ['ma4', 'div32', '三位數 ÷ 二位數'], ['ma4', 'div42', '四位數 ÷ 二位數'],
   ['ma5', 'km1', '公里換公尺'], ['ma5', 'km2', '公尺換公里'], ['ma5', 'km3', '公里公尺加減'],
   ['ma6', 'triAngle', '以角分類三角形'], ['ma6', 'triSide', '以邊分類三角形'], ['ma6', 'triIso', '等腰三角形'], ['ma6', 'triEqui', '正三角形'],
   ['ma7', 'decGrid', '百格板讀小數'], ['ma7', 'decBuild', '幾個 1、0.1、0.01 合起來'], ['ma7', 'decSplit', '拆成幾個 1、0.1、0.01'], ['ma7', 'decCount', '幾個 0.01'], ['ma7', 'decPlace', '十分位、百分位的數字'],
   ['ma7', 'decRead', '小數的讀法和記法'], ['ma7', 'decCm', '公分換成公尺'], ['ma7', 'decM', '公尺換成公尺公分'], ['ma7', 'decCmp', '小數比大小'], ['ma7', 'decSeq', '小數依序加減'],
   ['ma7', 'decAdd', '小數加法'], ['ma7', 'decSub', '小數減法'], ['ma7', 'decWord', '小數應用題'],
   ['ma8', 'ordAS', '加減兩步驟的併式'], ['ma8', 'ordMD', '乘除兩步驟的併式'], ['ma8', 'ordMix', '先乘除後加減'], ['ma8', 'ordMixP', '有括號先算括號'], ['ma8', 'ordSteps', '遞等式一步一步算'],
   ['ma8', 'ordFirst', '先算哪一段'], ['ma8', 'ordSame', '拿掉括號答案相同嗎'], ['ma8', 'ordWrite', '把問題用一個算式記下來'], ['ma8', 'ordWord', '兩步驟應用題'], ['ma8', 'ordPuzzle', '三個數字填符號'],
   ['ma9', 'fracPic', '看圖寫帶分數、假分數'], ['ma9', 'fracKind', '真分數、假分數、帶分數'], ['ma9', 'mixToImp', '帶分數換成假分數'], ['ma9', 'impToMix', '假分數換成帶分數'], ['ma9', 'fracCmp', '分數比大小'],
   ['ma9', 'fracAdd', '同分母分數相加'], ['ma9', 'fracAddMix', '帶分數加法'], ['ma9', 'fracSub', '整數減分數'], ['ma9', 'fracSubB', '帶分數減法（借 1）'], ['ma9', 'fracMul', '分數的整數倍'],
   ['ma9', 'fracMulMix', '帶分數的整數倍'], ['ma9', 'fracWord', '分數應用題'],
   ['ma10', 'picRead', '讀圖示統計圖'], ['ma10', 'picMake', '圖示要怎麼畫'], ['ma10', 'barRead', '讀長條圖'], ['ma10', 'scaleUnit', '每一小格表示多少'], ['ma10', 'barMaxMin', '長條圖最多、最少、一樣多'],
   ['ma10', 'barCalc', '從長條圖算多幾、一共'], ['ma10', 'barHoriz', '橫式長條圖'], ['ma10', 'barDraw', '長條要畫幾格'], ['ma10', 'scalePick', '刻度要怎麼定'], ['ma10', 'lineRead', '讀折線圖'],
   ['ma10', 'lineTrend', '折線上升、下降、不變'], ['ma10', 'unitRead', '單位是千人的統計圖'], ['ma10', 'twoSeries', '兩組資料的長條圖'],
   // 找錯小偵探：看小明的算法，點出第一個錯的那一步
   ['ma1', 'spotBig', '找錯：大數寫成數字'], ['ma2', 'spotMul', '找錯：乘法直式'], ['ma3', 'spotAngle', '找錯：平角計算'], ['ma5', 'spotKm', '找錯：公里換公尺'], ['ma7', 'spotDecAdd', '找錯：小數加法'], ['ma7', 'spotDecSub', '找錯：小數減法補 0'], ['ma8', 'spotOrd', '找錯：遞等式'], ['ma9', 'spotFrac', '找錯：分數'], ['ma10', 'spotChart', '找錯：讀統計圖']
  ].forEach(function (x) { var g = GEN[x[1]]; cards.push({ id: 'ma:' + x[1], s: 'ma', u: x[0], type: g().kind || 'num', gen: x[1], label: x[2] }); });

  // 自然：課本重點（先想再選）。n＝卡片 id 的後半；a＝正確答案；w＝其他選項
  function N(u, n, q, a, w, ex) { cards.push({ id: 'na:' + n, s: 'na', u: u, type: 'pick', q: q, a: a, w: w, ex: ex || '' }); }
  N('na1', 'sunMoon', '太陽和月亮在天空中，是怎麼移動的？', '東升西落', ['西升東落', '一直停在南方'], '太陽和月亮都是從東方升起、往西方落下。');
  N('na1', 'faceSouth', '面向南方站好，東方在你的哪一邊？', '左手邊', ['右手邊', '背後'], '面向南方：左手邊是東，右手邊是西，背後是北。');
  N('na1', 'fist', '手臂伸直，一個拳頭的高度角大約是幾度？', '大約 10 度', ['大約 1 度', '大約 45 度'], '一個拳頭大約 10 度，疊兩個拳頭大約 20 度。');
  N('na1', 'position', '描述月亮在天空的位置，要用哪兩樣？', '方位和高度角', ['顏色和大小', '形狀和亮度'], '課本：利用方位和高度角描述月亮位置。');
  N('na1', 'tool', '用拳頭和用高度角觀測器量高度角，哪一個比較準確？', '高度角觀測器', ['拳頭', '兩個一樣準'], '課本：高度角觀測器測量的高度角較準確。');
  N('na1', 'phase', '月亮看起來的形狀，叫做什麼？', '月相', ['月食', '月光'], '月亮看起來的形狀稱為月相，日期不同，月相也不同。');
  N('na1', 'cycle', '月相由缺到圓、再由圓到缺，大約需要幾天？', '29 或 30 天', ['7 天', '365 天'], '約需 29 或 30 天，這就是月相變化的規律性。');
  N('na1', 'shuo', '農曆 1 日（初一）看到的月相，課本叫做什麼？', '朔（看不到月亮）', ['望（圓圓的）', '上弦月'], '初一看不見，課本叫做「朔」。');
  N('na1', 'first', '農曆 7 日或 8 日，月亮是什麼樣子？', '上弦月，右半邊亮', ['下弦月，左半邊亮', '整個圓圓的'], '初七初八月半邊：上弦月，右半邊亮。');
  N('na1', 'wang', '農曆 15 日或 16 日的月相，課本叫做什麼？', '望', ['朔', '下弦月'], '十五、十六月亮最圓，課本叫做「望」。');
  N('na1', 'last', '農曆 22 日或 23 日，月亮是什麼樣子？', '下弦月，左半邊亮', ['上弦月，右半邊亮', '看不到月亮'], '廿二半夜見半圓：下弦月，左半邊亮。');
  N('na1', 'right', '上半月（農曆初一到十五），月亮亮的是哪一邊？', '右邊', ['左邊', '上面'], '上半月右邊亮，一天比一天胖；下半月左邊亮，一天比一天瘦。');
  N('na1', 'song1', '課本歌謠：「初七初八月＿＿」，空格是什麼？', '半邊', ['團圓', '難見'], '初七初八月半邊，是上弦月。');
  N('na1', 'song2', '課本歌謠：「直到十五月＿＿」，空格是什麼？', '團圓', ['半邊', '慢出'], '一天更比一天胖，直到十五月團圓。');
  N('na1', 'song3', '課本歌謠：「廿二半夜見＿＿」，空格是什麼？', '半圓', ['團圓', '一根線'], '「廿」是二十的意思。廿二是下弦月，半夜才升起。');
  N('na1', 'same', '同一個晚上，每隔一小時看月亮，哪一個「不會」改變？', '月亮的形狀（月相）', ['月亮的方位', '月亮的高度角'], '一個晚上裡，月亮的方位和高度角會變，形狀不會變。');
  N('na1', 'lunar', '農曆日期是根據什麼制定的？', '月球的運行變化', ['太陽的位置', '四季的天氣'], '課本：農曆日期是根據月球的運行變化制定的；大月有 30 日，小月有 29 日。');
  cards.push({ id: 'na:moonPic', s: 'na', u: 'na1', type: 'pick', gen: 'moon' });

  cards.push({ id: 'na:waterLife', s: 'na', u: 'na2', type: 'pick', gen: 'water' });
  N('na2', 'flow', '河川的水流，和水田比起來怎麼樣？', '比水田湍急', ['比水田緩慢', '完全一樣'], '水田的水流比較緩慢，河川的水流比水田湍急。');
  N('na2', 'senses', '到水域調查時，課本用哪三種感官觀察？', '視覺、聽覺、嗅覺', ['視覺、味覺、觸覺', '聽覺、味覺、嗅覺'], '看水的顏色、聽水流的聲音、聞有沒有臭味。不要用嘴巴嘗水喔！');
  N('na2', 'putBack', '觀察完撈起來的水生生物，要怎麼做？', '放回原來的水域環境', ['帶回家養', '倒進附近的水溝'], '課本提醒：觀察完後要放回原來的水域環境。');
  N('na2', 'scope', '要觀察離岸邊比較遠的生物，要帶什麼工具？', '望遠鏡', ['放大鏡', '水盤'], '望遠鏡可以看離岸邊較遠的生物，例如水鳥。');
  N('na2', 'lotus', '蓮是哪一種水生植物？', '挺水性植物', ['浮葉性植物', '沉水性植物'], '蓮的葉會挺出水面，根長在土裡。');
  N('na2', 'lily', '睡蓮是哪一種水生植物？', '浮葉性植物', ['挺水性植物', '漂浮性植物'], '睡蓮的葉片平貼水面，根長在土裡。');
  N('na2', 'hyacinth', '布袋蓮是哪一種水生植物？', '漂浮性植物', ['沉水性植物', '挺水性植物'], '布袋蓮的根漂在水裡，會隨水流四處漂流。');
  N('na2', 'elodea', '水蘊草是哪一種水生植物？', '沉水性植物', ['浮葉性植物', '漂浮性植物'], '水蘊草莖、葉柔軟，全株長在水中，根長在土裡。');
  N('na2', 'lettuce', '大萍是哪一種水生植物？', '漂浮性植物', ['挺水性植物', '浮葉性植物'], '大萍的葉片裡有通氣組織，可以儲存空氣，幫助它漂浮。');
  N('na2', 'float', '布袋蓮為什麼能浮在水面上？', '膨大的葉柄裡有充滿空氣的通氣組織', ['根緊緊抓住水底的泥土', '葉子又大又重'], '通氣組織充滿空氣，就像游泳圈一樣。');
  N('na2', 'aer', '植物的「通氣組織」有什麼功能？', '儲存及輸送空氣', ['吸收陽光', '儲存很多水'], '課本：植物的通氣組織有儲存及輸送空氣的功能。');
  N('na2', 'petiole', '蓮的葉柄裡有中空的管道，有什麼用處？', '讓泡在水中的部位也能呼吸', ['讓葉子變重沉下去', '用來裝泥土'], '中空管道讓空氣流通，泡在水中的部位也能呼吸。');
  N('na2', 'root', '我們吃的蓮藕，是蓮的哪一個部位？', '長在水面下的莖', ['根', '葉子'], '課本：蓮藕是生長在水面下的莖，裡面有許多通氣組織。');
  N('na2', 'lilyStem', '水位變高變低，睡蓮的葉片為什麼還能平貼在水面？', '葉柄柔軟，會伸展或彎曲', ['葉子會自己游泳', '根會跟著浮上來'], '睡蓮的葉柄柔軟，會隨水位高低伸展或彎曲。');
  N('na2', 'gill', '魚呼吸時，「口張開、鰓蓋閉合」，水會怎樣？', '由口進入魚鰓', ['從鰓蓋流出來', '從尾巴流出去'], '口張開、鰓蓋閉合，水由口進入魚鰓；口閉合、鰓蓋張開，水經過魚鰓流出來。');
  N('na2', 'fin', '魚在水中靠什麼游泳？', '鰭擺動', ['腹足爬行', '腳上的蹼'], '魚透過鰭擺動，在水中游泳。');
  N('na2', 'scorpion', '紅娘華用什麼呼吸？', '腹部末端的呼吸管', ['鰓', '肺'], '紅娘華以腹部末端的呼吸管呼吸，中、後腳細長，可游泳、爬行。');
  N('na2', 'shrimp', '蝦怎麼移動？', '用胸足步行、腹足游泳', ['利用腹足爬行', '擺動尾巴做 S 型游泳'], '蝦以鰓呼吸，用胸足步行、腹足游泳。');
  N('na2', 'snail', '石田螺怎麼移動？', '利用腹足爬行', ['用胸足步行', '靠鰭擺動游泳'], '石田螺以鰓呼吸，利用腹足爬行。');
  N('na2', 'frog', '蝌蚪長成青蛙後，主要用什麼呼吸？', '肺', ['鰓', '呼吸管'], '成蛙的鰓消失，主要以肺呼吸，可以跳躍及划水。');
  N('na2', 'tadpole', '蝌蚪在水中怎麼呼吸、怎麼游泳？', '用鰓呼吸，擺動尾巴游泳', ['用肺呼吸，用腳划水', '用呼吸管呼吸，用腹足爬行'], '蝌蚪用尾巴做 S 型擺動，讓身體向前推進。');
  N('na2', 'algae', '廢水或農業肥料流入水域，會發生什麼事？', '藻類大量繁殖，水中生物難以呼吸', ['水變得更乾淨', '魚會長得更大'], '所以農田不要過量使用肥料，廢水要先處理。');
  N('na2', 'forest', '過度開發森林，可能讓水域發生什麼事？', '土石流掩埋水生生物的棲地', ['水變得更清澈', '長出更多水草'], '大量的土石流入溪流中，掩埋了水生生物的棲地。');
  N('na2', 'turtle', '海龜為什麼會誤食塑膠袋？', '塑膠袋長得像水母', ['塑膠袋很香', '海龜喜歡吃塑膠'], '海洋垃圾會造成海洋生物死亡，所以要參與淨灘、減少海洋垃圾。');
  N('na2', 'protect', '下面哪一個做法可以保護水域環境？', '參與淨灘活動，減少海洋垃圾', ['在水源保護區烤肉、戲水', '洗東西時倒很多清潔劑'], '還有：不任意捕捉和採集水生生物、不過量使用清潔劑。');
  N('na2', 'salt', '人們怎麼從海水中取得鹽？', '引入海水，利用太陽蒸發掉水分', ['把海水冰起來', '用網子撈起來'], '水分蒸發後，留下海水溶解的礦物質，例如鹽。');
  N('na2', 'trace', '課本說，我們應該發揮什麼精神，讓大自然能夠喘息及恢復？', '不留下人類痕跡', ['想拿多少就拿多少', '先用完再說'], '合理利用與管理水域資源，才能和大自然一起永續生存。');
  N('na2', 'tao', '達悟族人取用飛魚等魚類資源，有什麼好習慣？', '不濫捕、不浪費', ['一次捕越多越好', '只捕最小的魚'], '飛魚季時主要捕撈飛魚等洄游魚類，讓其他魚類可以繁衍後代。');
  N('na2', 'dam', '修築水庫有什麼用處？', '蓄水，維持穩定的水源', ['讓海水變淡', '讓水流得更急'], '乾淨且充足的水是人類生存必需。');

  // 自然：找錯小偵探。parts 是一句話切成幾段，bad 那一段跟課本不一樣
  function X(u, n, parts, bad, fix, ex) { cards.push({ id: 'nax:' + n, s: 'na', u: u, type: 'spot', label: '找錯：' + parts.join('').slice(0, 10) + '…', q: '這句話有一個地方<b>跟課本不一樣</b>，把它點出來。', parts: parts, bad: bad, fix: fix, ex: ex || '' }); }
  X('na1', 'sunMoon', ['太陽和月亮', '都是西升東落', '。'], 1, '應該是「<b>東升西落</b>」：從東方升起、往西方落下。');
  X('na1', 'south', ['面向南方站好，', '東方在你的右手邊', '。'], 1, '面向南方時，東方在<b>左手邊</b>，西方在右手邊。');
  X('na1', 'first', ['農曆初七、初八是上弦月，', '左半邊亮', '。'], 1, '上弦月是<b>右半邊亮</b>；左半邊亮的是廿二、廿三的下弦月。');
  X('na1', 'cycle', ['月相由缺到圓、再由圓到缺，', '大約需要 15 天', '。'], 1, '約需 <b>29 或 30 天</b>，這就是月相變化的規律性。');
  X('na1', 'tool', ['量高度角時，', '用拳頭比高度角觀測器準確', '。'], 1, '課本說<b>高度角觀測器</b>測量的高度角比較準確。');
  X('na2', 'lily', ['睡蓮的根長在土裡，', '葉片挺出水面，', '是浮葉性植物。'], 1, '睡蓮的葉片是<b>平貼在水面上</b>。葉挺出水面的是挺水性植物，例如蓮。');
  X('na2', 'elodea', ['水蘊草是沉水性植物，', '莖、葉很硬，', '全株長在水中。'], 1, '水蘊草的莖、葉<b>柔軟</b>，可以適應水位和水流的變化。');
  X('na2', 'root', ['蓮藕是蓮', '長在水面下的根', '，裡面有通氣組織。'], 1, '蓮藕是蓮長在水面下的<b>莖</b>。');
  X('na2', 'gill', ['魚呼吸的時候，', '口閉合、鰓蓋閉合，', '水由口進入魚鰓。'], 1, '應該是<b>口張開、鰓蓋閉合</b>，水由口進入魚鰓；口閉合、鰓蓋張開，水才流出來。');
  X('na2', 'scorpion', ['紅娘華是水生昆蟲，', '用鰓呼吸，', '中、後腳細長，可以游泳、爬行。'], 1, '紅娘華用<b>腹部末端的呼吸管</b>呼吸。');
  X('na2', 'frog', ['蝌蚪用鰓呼吸，', '長成青蛙後鰓消失，', '主要用皮膚呼吸。'], 2, '成蛙<b>主要以肺呼吸</b>。');
  X('na2', 'algae', ['廢水或農業肥料流入水域，', '藻類會大量減少，', '水中生物難以呼吸。'], 1, '藻類會<b>大量繁殖</b>，水中生物才會難以呼吸。');
  X('na2', 'putBack', ['到水域調查後，', '把撈到的生物帶回家養', '。'], 1, '觀察完後要<b>放回原來的水域環境</b>。');

  // 如果這樣會怎樣：選錯時畫出「你選的那個」會是什麼樣子，再跟正確的比
  var WI = {
    'na:shuo': { t: 'moon', ang: { '朔（看不到月亮）': 0, '望（圓圓的）': 180, '上弦月': 90 } },
    'na:first': { t: 'moon', ang: { '上弦月，右半邊亮': 90, '下弦月，左半邊亮': 270, '整個圓圓的': 180 } },
    'na:wang': { t: 'moon', ang: { '望': 180, '朔': 0, '下弦月': 270 } },
    'na:last': { t: 'moon', ang: { '下弦月，左半邊亮': 270, '上弦月，右半邊亮': 90, '看不到月亮': 0 } },
    'na:right': { t: 'moon', ang: { '右邊': 90, '左邊': 270 } },
    'na:lotus': { t: 'plant', plant: '蓮' }, 'na:lily': { t: 'plant', plant: '睡蓮' }, 'na:hyacinth': { t: 'plant', plant: '布袋蓮' },
    'na:elodea': { t: 'plant', plant: '水蘊草' }, 'na:lettuce': { t: 'plant', plant: '大萍' }
  };
  cards.forEach(function (c) { if (WI[c.id]) c.wi = WI[c.id]; });

  function hid(t) { var h = 5381; for (var i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0; return h.toString(36); } // 用題目文字做 id，頁面題目換順序也不會亂

  // 社會：從各課頁面的小測驗整理（地形、地圖只放標成課本的題目；氣候、人口放選擇題和是非題）
  var SO = [
    ["so1","地圖是根據什麼畫出來的？",["自己的想像","真實的景物和各種資料","隨便畫畫"],1,"地圖是依據實際景物與各種資料繪製而成的。"],
    ["so1","下列哪一個「不是」地圖四要素？",["圖名","比例尺","圖例","門牌號碼"],3,"地圖四要素是：圖名、方向標、比例尺、圖例。"],
    ["so1","「圖名」告訴我們什麼？",["地圖的名稱或主題","實際距離","哪邊是北方"],0,"圖名是地圖的名稱或主題。"],
    ["so1","「方向標」有什麼用？",["計算距離","辨識方位","表示景物"],1,"方向標用來辨識方位（課本的方向標標出北、東、南、西）。"],
    ["so1","「比例尺」有什麼用？",["代表地圖縮小的比例，可以計算實際距離","告訴我們地圖的名字","畫出景物的顏色"],0,"比例尺代表地圖縮小的比例，可以計算實際距離。"],
    ["so1","「圖例」是什麼？",["地圖的作者","用簡單的符號表示真實的景物","地圖的價錢"],1,"圖例是用簡單符號來表示地面的實際景物。"],
    ["so1","如果地圖上沒有「圖例」，可能會發生什麼事？",["看不懂符號代表什麼","找不到北方","不知道地圖的名字"],0,"沒有圖例，就無法了解符號代表的景物。"],
    ["so1","想知道臺灣分成哪些縣市，最適合看哪一種地圖？",["衛星影像圖","行政區域圖","交通觀光導覽圖"],1,"行政區域圖可以看出區域的劃分。"],
    ["so1","去旅行時想知道景點和交通路線，最適合看？",["交通觀光導覽圖","行政區域圖","衛星影像圖"],0,"交通觀光導覽圖主要標示觀光景點與交通路線。"],
    ["so1","想看到建築物真實的樣子、土地怎麼利用，最適合看？",["行政區域圖","衛星影像圖","交通觀光導覽圖"],1,"衛星影像圖從高空往地面拍照，能顯示建築物與土地利用情形。"],
    ["so1","我們要怎麼選擇合適的地圖？",["選最漂亮的","依照使用的需求","選最大張的"],1,"依據需求選擇：旅遊用觀光導覽圖、規畫路線用電子地圖……"],
    ["so1","為什麼地圖會有不同的呈現方式？",["因為使用需求不同","因為畫的人不同心情","因為紙張大小不同"],0,"使用需求不同，所以地圖有不同的呈現方式。"],
    ["so1","下列哪一件事，電子地圖「做不到」？",["放大、縮小地圖","搜尋地點","規畫路線、導航","幫你把東西送到家"],3,"電子地圖可以搜尋地點、局部放大縮小、定位和導航，規畫路線時還會預估路線和時間。"],
    ["so1","在電子地圖按下「規畫路線」並確認出發地點後，電子地圖會幫我們做什麼？",["預估路線和行進時間","幫我們買車票","告訴我們明天的天氣"],0,"課本：電子地圖會預估路線及時間，還會顯示不同交通工具的行進時間。"],
    ["so1","在電子地圖上把右下方的「黃色人形」拖到地圖上，可以做什麼？",["觀看那個地方的街景","把地圖縮小","查詢公車時刻"],0,"課本：拖動黃色人形到地圖上，會出現該區域的街景圖，還可以拉動箭頭移動觀看。"],
    ["so1","是非題：一般的地圖，大多是上北、下南、左西、右東。",["⭕ 對","❌ 錯"],0,"（延伸）對！但還是要先看方向標確認。"],
    ["so1","是非題：電子地圖放大後，可以看到更多細節。",["⭕ 對","❌ 錯"],0,"放大看細節，縮小看全貌。"],
    ["so1","同一個地方的電子地圖和衛星影像圖，下列何者正確？",["標示同樣的地點，但用途不同","兩張完全一樣","衛星影像圖上一定有路名"],0,"兩張圖標示同樣的地點，卻有不同的用途。"],
    ["so1","以前搭火車，人們會用紙本鐵道路線圖，再搭配什麼來規畫路線？",["火車時刻表","農民曆","衛星影像圖"],0,"課本單元開場：以前搭火車會用紙本鐵道路線圖，搭配火車時刻表規畫路線；現在可以用電子地圖查詢。"],
    ["so1","要向外縣市的同學說明我們學校的位置，課本探究提到哪一個好方法？",["說明附近知名的地標，或寫下學校完整的地址","只說「在我家旁邊」","畫一張沒有名字的圖"],0,"探究社會有絕招：可以說明附近知名的地標、寫下學校完整的地址，也可以善用不同類型的地圖。"],
    ["so1","下列哪一個是「圖例」的例子？",["用 卍 代表寺廟","地圖上方寫著「新竹市地圖」","畫著北、東、南、西的十字"],0,"圖例用簡單符號表示地面的實際景物；「新竹市地圖」是圖名；畫著東西南北的是方向標。"],
    ["so1","課本說，透過圖名、方向標、比例尺和圖例，可以從地圖上做什麼？",["找到家鄉的位置，了解景點、道路和河流的分布","知道明天會不會下雨","算出家鄉有多少人口"],0,"課本：透過這些工具，可以從地圖上尋找家鄉的位置，了解家鄉景點、道路與河流的分布。"],
    ["so1","用電子地圖介紹學校位置給外縣市的同學，課本提到可能會遇到什麼問題？",["需要有網路和設備","電子地圖上沒有道路","電子地圖不能放大"],0,"探究社會有絕招：電子地圖比較明確，但需要有網路與設備。"],
    ["so1","課本中，家人從臺中開車去彰化的扇形車庫，用什麼幫忙導航？",["電子地圖","行政區域圖","農民曆"],0,"課本：電子地圖會顯示道路、商家、學校等資訊，適合用來規畫路線，也有導航功能。"],
    ["so2","想知道臺中市分成哪些區、哪一區最大，最適合看哪一種地圖？",["行政區域圖","交通路線圖","觀光導覽圖"],0,"行政區域圖可以看出區域的劃分和大小。"],
    ["so2","從課本的臺中市行政區域圖可以看出，和平區和東勢區比起來怎麼樣？",["和平區的面積比東勢區大","東勢區的面積比和平區大","兩區一樣大"],0,"課本：從圖上可以看到，和平區的面積比東勢區大。"],
    ["so2","下列哪一組是臺中市靠臺灣海峽的區？",["大甲、清水、梧棲","和平、新社、東勢","北屯、南屯、西屯"],0,"由北到南：大甲、大安、清水、梧棲、龍井。"],
    ["so2","規畫交通路線時，下面哪一件事「最不需要」考慮？",["要花多少時間","要換幾次車","車子是什麼顏色"],2,"時間、費用、換車次數、方不方便才重要，顏色不影響行程。"],
    ["so2","課本中，嘉家想從臺北搭大眾運輸「直達」日月潭，可以搭什麼？",["客運","捷運","高鐵"],0,"課本的第二種方法：從臺北搭客運直達日月潭。第一種是先搭臺鐵或高鐵到臺中，再轉南投客運。"],
    ["so2","嘉家先搭臺鐵或高鐵到臺中，課本說接著可以轉搭什麼到日月潭？",["南投客運","捷運","渡輪"],0,"課本：到臺中後，可以考慮轉搭南投客運（臺中→草屯→埔里→日月潭）。"],
    ["so2","到日月潭玩，想知道碼頭、遊客中心、纜車站在哪裡，最適合看？",["觀光導覽圖","行政區域圖","衛星影像圖"],0,"觀光導覽圖會標出景點和旅遊設施。"],
    ["so2","日月潭交通觀光導覽圖上的「伊達邵」，是哪一族的部落名？",["邵族","達悟族","排灣族"],0,"課本：「伊達邵」為邵族的部落名，所以日月潭有些景點以此命名。"],
    ["so2","課本說，縣市行政區域圖會標示出哪些資訊？",["縣市的位置、涵蓋的鄉鎮市區和相鄰縣市的名稱","各地的雨量和氣溫","景點的開放時間"],0,"課本：縣市行政區域圖會標示縣市的位置、涵蓋的鄉鎮市區，以及相鄰縣市的名稱。"],
    ["so2","搭臺鐵、高鐵、捷運或客運時，看「交通路線圖」最能幫我們知道什麼？",["經過哪些車站、要在哪裡轉車","車站附近有哪些餐廳","車上的人多不多"],0,"課本：交通路線圖有經過地點與路線等重要訊息，可以知道經過哪些車站、要在哪裡轉車。"],
    ["so2","課本中，嘉家從臺北去日月潭，下列哪一種走法「不是」課本提到的？",["從臺北搭飛機到日月潭","搭臺鐵或高鐵到臺中，再轉搭南投客運","從臺北搭客運直達日月潭"],0,"課本的兩種方法：①搭臺鐵或高鐵到臺中，再轉南投客運；②從臺北搭客運直達日月潭。"],
    ["so2","嘉家在日月潭水社吃的茶葉蛋，課本說是用什麼煮的？",["當地盛產的紅茶","咖啡","高山蔬菜"],0,"課本：水社的茶葉蛋是用當地盛產的紅茶煮的，商店街也賣很多茶類商品。"],
    ["so2","從導覽圖上看到日月潭的「碼頭」，可以知道遊客能在那裡做什麼？",["搭船遊湖","滑雪","搭火車"],0,"學習攻略：碼頭旁的船舶可以帶遊客遊覽日月潭，從地圖可以看出環境特色和利用方式。"],
    ["so3","高度<b>超過 1,000 公尺</b>、地勢起伏大的高山，是哪一種地形？",["山地","丘陵","台地"],0,"山地：高度超過 1,000 公尺且地勢起伏大，占臺灣大多數的面積，例如中央山脈的合歡山。"],
    ["so3","在<b>山地的邊緣</b>、不超過 1,000 公尺、坡度比較和緩的是？",["平原","丘陵","盆地"],1,"丘陵在山地邊緣，高度不超過 1,000 公尺、坡度變化比較和緩，例如新北市石碇的丘陵。"],
    ["so3","<b>四周高、中間平</b>，好像一個盆子，是哪一種地形？",["盆地","台地","平原"],0,"盆地四周地勢較高、中間平坦，像盆子，例如南投縣的埔里盆地。"],
    ["so3","<b>地勢平坦的高地</b>是哪一種地形？",["丘陵","山地","台地"],2,"課本：地勢平坦的高地稱為台地，例如臺中市的大肚台地。"],
    ["so3","通常位在<b>河流出海口或沿海地區</b>、寬闊平坦的是？",["平原","盆地","丘陵"],0,"平原通常位在河流出海口或沿海地區，例如臺灣南部的嘉南平原，它是臺灣面積最大的平原。"],
    ["so3","課本中「南投縣的埔里盆地」屬於哪一種地形？",["盆地","台地","平原"],0,"四周地勢較高、中間平坦，像盆子的地形稱為盆地。"],
    ["so3","下面哪一個是課本舉的<b>台地</b>例子？",["臺中市的大肚台地","嘉南平原","新北市石碇的丘陵"],0,"大肚台地是台地；嘉南平原是平原；石碇是丘陵。"],
    ["so3","<b>一層一層的茶園</b>最常出現在哪一種地形？",["平原","丘陵","盆地"],1,"課本：丘陵排水良好、氣候溼潤，適合種茶，常被開墾成一層一層的田地，種植茶樹、果樹。"],
    ["so3","平原、台地、盆地地勢平坦、交通便利，所以容易形成什麼？",["森林遊樂區","城鎮和都市","高山蔬菜園"],1,"台地、平原和盆地地勢平坦、交通便利，適合居住、農耕和工商發展，吸引人口聚集，形成聚落或都市。"],
    ["so3","山地和丘陵<b>不一樣</b>的地方是？",["丘陵坡度比較和緩、交通比較方便","丘陵比山地高","山地比較適合蓋都市"],0,"丘陵坡度較和緩，對外交通比山地便利；山地比較高、起伏大。"],
    ["so3","家鄉的景觀和土地利用，常常受到什麼影響？",["地形","星座","生日"],0,"地形會影響居民怎麼使用土地，例如平地蓋城市、山坡種茶。"],
    ["so3","臺灣大多數的面積是哪一種地形？",["山地","平原","盆地"],0,"課本：高度超過 1,000 公尺且地勢起伏大的山地，占臺灣大多數的面積。"],
    ["so3","課本說，臺灣面積最大的平原是哪一個？",["嘉南平原","埔里盆地","大肚台地"],0,"臺灣之最：嘉南平原是臺灣面積最大的平原，土壤肥沃，適合種稻米、甘蔗，是臺灣重要的穀倉。"],
    ["so3","課本的例子配對，哪一組正確？",["新北市石碇—丘陵","臺中市大肚—盆地","南投縣埔里—平原"],0,"課本例子：合歡山（山地）、石碇（丘陵）、大肚台地（台地）、埔里盆地（盆地）、嘉南平原（平原）。"],
    ["so3","為什麼丘陵適合種茶？",["排水良好、氣候溼潤","地勢最低、常常淹水","全年都下雪"],0,"課本：丘陵排水良好、氣候溼潤，適合種茶。"],
    ["so3","和平坦的地方比起來，住在丘陵的人家通常怎麼分布？",["居住得比較分散","全部擠在一起","丘陵上完全沒有人住"],0,"課本：丘陵對外交通比山地便利，人們居住得比較分散，並開墾田地種茶樹、果樹。"],
    ["so3","山地保留了較完整的自然生態，課本說可以發展什麼？",["觀光旅遊","大型工業區","大片稻田"],0,"課本：山地可以發展觀光旅遊，有些居民會種植高山蔬菜。"],
    ["so4","是非題：冬季時，臺灣北部比南部多雨，氣溫也比較低。",["⭕ 對","❌ 錯"],0,"對！課本比較基隆和恆春：冬季時北部雨量比南部多、氣溫也較低；夏季時全臺普遍溼熱。"],
    ["so4","山上的氣溫通常比平地高。",["⭕ 對","❌ 錯"],1,"錯！地勢愈高，氣溫愈低。阿里山的年平均氣溫只有約 11℃，比平地的嘉義低了 12 度左右。"],
    ["so4","是非題：農民曆記載了先民觀察到的氣候特徵、農耕經驗和魚群出現時期等資訊。",["⭕ 對","❌ 錯"],0,"對！農民曆累積許多先民的經歷和體驗，是過去農業社會日常生活的參考。"],
    ["so4","梅雨季大約在每年的 5～6 月。",["⭕ 對","❌ 錯"],0,"對！每年五、六月，臺灣常有長達數週的陰雨綿綿，稱為「梅雨」。"],
    ["so4","「天氣」是說一個地方很多年的平均狀況，「氣候」是說今天下不下雨。",["⭕ 對","❌ 錯"],1,"課本：氣候是指長時間的天氣狀況。說反了！天氣是短時間（今天、這幾天）的變化；氣候是很多年平均起來的狀況。"],
    ["so4","冬天時，中南部的雨通常比北部少。",["⭕ 對","❌ 錯"],0,"對！冬季時臺灣北部比南部多雨且氣溫較低（課本用基隆和恆春的雨量氣溫圖比較）。"],
    ["so4","課本中，南部的墾丁成為度假勝地，和什麼氣候特色有關？",["四季陽光普照","每年都會下雪","全年乾冷"],0,"課本：位在南部的墾丁四季陽光普照，成了度假勝地。"],
    ["so4","課本說臺南盛產芒果，是因為臺南的氣候怎麼樣？",["溫暖","寒冷","乾冷多風"],0,"課本：臺南的氣候溫暖，盛產芒果；探究也提到芒果適合種在氣候炎熱的地區。"],
    ["so4","想了解家鄉的氣候，最適合觀察下列哪些資料？",["氣溫、雨量、風向和風速","人口數和學校數","道路的長度"],0,"氣象觀測站設有測量氣溫、雨量、風向和風速的儀器。"],
    ["so4","新竹盛產米粉，課本說是利用什麼氣候特色？",["十月到隔年二月，來自北方乾冷的風","五、六月的梅雨","夏季全臺溼熱"],0,"課本：新竹每年十月到隔年二月有來自北方乾冷的風，非常適合晒米粉。"],
    ["so4","課本「基隆、恆春全年月平均雨量氣溫圖」中，長條圖的縱軸代表什麼？",["雨量（毫米）","溫度（℃）","月分"],0,"讀圖：長條圖的縱軸代表雨量（mm），折線圖的縱軸代表溫度（℃），橫軸代表 12 個月。"],
    ["so4","夏季時，除了到海邊玩水消暑，課本說民眾也會選擇到哪裡避暑？",["山上","沙漠","地下室"],0,"課本：山地雨量較多、氣溫較低，夏季民眾會到山上避暑。"],
    ["so4","課本說，哪個單位經過長時間統計分析各地的天氣資料，讓我們更了解家鄉的氣候？",["交通部中央氣象署","內政部戶政司","國家公園管理處"],0,"課本：各地氣象觀測站提供天氣數據，交通部中央氣象署經過長時間統計分析，讓我們對家鄉氣候有更進一步的認識。"],
    ["so4","讀課本的雨量氣溫圖：基隆一月的平均雨量大約是多少？",["約 330 毫米","約 33 毫米","約 3,300 毫米"],0,"讀圖123：以基隆為例，一月雨量平均約 330 毫米，溫度平均約 16 度。"],
    ["so4","「秋老虎」「梅雨」這些說法，是在描述什麼？",["氣候的特色","地形的種類","人口的變化"],0,"課本：「秋老虎」「梅雨」的說法，都是在描述氣候的特色。"],
    ["so4","課本說，家鄉的氣候會因為什麼而有所不同？",["地理位置和地形","人口多少","交通路線"],0,"課本：家鄉的氣候會因為地理位置而不同（例如北部和南部），也會受地形影響（例如山地和平地）。"],
    ["so4","是非題：夏季時，全臺灣普遍溼熱。",["⭕ 對","❌ 錯"],0,"對！課本：夏季時全臺普遍溼熱；冬季時北部比南部多雨且氣溫較低。"],
    ["so4","課本「嘉義、阿里山全年月平均雨量氣溫圖」告訴我們什麼？",["夏季時，平地的氣溫高於山地","山地的雨量比平地少","阿里山比嘉義熱"],0,"課本：家鄉的氣候也會受地形影響，山地雨量較多、氣溫較低。"],
    ["so4","探究社會有絕招：通常在哪個季節最容易在市場買到芒果？",["夏季","冬季","一整年都買不到"],0,"課本探究：夏季時市場可以買到芒果，也常吃芒果冰。"],
    ["so4","臺南玉井的芒果很有名，課本探究推測和什麼有關？",["丘陵地形和土壤","下雪","人口很多"],0,"探究社會有絕招：詢問水果攤老闆後，推測和丘陵地形及土壤有關；芒果適合種在氣候炎熱的地區。"],
    ["so5","人口分布很平均，每個地方住的人都差不多多。",["⭕ 對","❌ 錯"],1,"錯！人口分布不平均：平地、交通方便的地方人多；高山、交通不便的地方人少。"],
    ["so5","地形平坦、水源充足、交通方便的地方，通常人口比較多。",["⭕ 對","❌ 錯"],0,"對！這些條件讓生活和工作都比較方便。"],
    ["so5","仁愛鄉的面積比南投市大很多，所以住的人也比南投市多。",["⭕ 對","❌ 錯"],1,"錯！仁愛鄉大多是山地，面積雖大，人口卻比南投市少很多。"],
    ["so5","15～64 歲的青壯年人口，是主要的工作人口。",["⭕ 對","❌ 錯"],0,"對！青壯年是主要從事生產的人口，代表當地的生產力和競爭力。"],
    ["so5","臺灣人口最多的縣市是哪一個？",["新北市","臺北市","臺東縣"],0,"課本：新北市是臺灣人口最多的縣市；新北市板橋區是全臺灣人口最多的鄉鎮市區。"],
    ["so6","臺灣在民國 107 年進入「高齡社會」。",["⭕ 對","❌ 錯"],0,"對！課本的老年人口比例圖：民國 107 年 65 歲以上人口占 14.6%，達到高齡社會（14% 以上）。"],
    ["so5","臺灣的幼年人口比例愈來愈高。",["⭕ 對","❌ 錯"],1,"錯！課本「民國90～110年全國人口年齡分布比例變遷圖」：65 歲以上逐年增加，14 歲以下逐年減少。"],
    ["so5","就醫方便、工作機會多、交通發達、行政與教育文化資源多，人口可能不斷增加。",["⭕ 對","❌ 錯"],0,"對！這些都是人口成長的好條件。"],
    ["so5","依年齡來分，「幼年人口」是指幾歲的人？",["0～14 歲","0～12 歲","0～18 歲"],0,"幼年 0～14 歲；青壯年 15～64 歲；老年 65 歲以上。"],
    ["so5","爸爸今年 42 歲，他屬於哪一種年齡人口？",["青壯年人口","幼年人口","老年人口"],0,"15～64 歲是青壯年人口。"],
    ["so5","阿公剛滿 65 歲，他屬於哪一種年齡人口？",["老年人口","青壯年人口","幼年人口"],0,"65 歲以上就是老年人口。"],
    ["so5","為什麼平地的人口通常比高山多？",["地勢平坦，方便蓋房子、種田和修路","高山比較熱","平地沒有河流"],0,"平地方便居住、耕種和交通，所以人比較多。"],
    ["so5","新竹縣內灣以前為什麼曾經很繁榮？",["盛產林木和礦產","有國際機場","是平原上的大城市"],0,"課本：有些山區交通不便，但自然資源豐富，盛產木材或礦產，曾經聚集不少人口，例如新竹縣內灣、新北市九份。"],
    ["so5","臺東縣池上鄉近年人口不斷減少，課本提到的原因是什麼？",["交通不便","工廠太多","人口太擁擠"],0,"課本：池上鄉交通不便，雖然近年努力發展觀光，人口仍不斷減少；頭份市交通發達，人口逐漸增加。"],
    ["so5","哪一群人通常比較需要照顧？",["幼年人口和老年人口","只有青壯年人口","只有老年人口"],0,"小孩和長輩比較需要照顧；青壯年是主要從事生產的人口。"],
    ["so5","課本說，家鄉的人口會受到哪些因素影響？",["自然環境、交通建設、經濟發展","只看天氣好不好","只看學校多不多"],0,"課本：家鄉的人口會受到自然環境、交通建設、經濟發展等因素影響。"],
    ["so5","課本民國 113 年底的人口年齡組成圖中，竹北市和水林鄉比較，哪一句正確？",["竹北市幼年人口比例較高，水林鄉老年人口比例較高","竹北市老年人口比例比較高","兩地的老年人口比例一樣"],0,"竹北市：幼年 21%、青壯年 70%、老年 9%；水林鄉：幼年 7%、青壯年 65%、老年 28%。"],
    ["so5","一般來說，青壯年人口代表一個地方的什麼？",["生產力和競爭力","雨量和氣溫","地形和高度"],0,"課本：青壯年（15～64 歲）是主要從事生產的人口，代表當地的生產力和競爭力。"],
    ["so5","南投縣人口分布圖上，為什麼南投市的人口比仁愛鄉多？",["南投市地勢平坦、開發早","南投市都是高山","仁愛鄉交通比較方便"],0,"課本：南投市地勢平坦、開發早，人口比較多；仁愛鄉多山地、不易開發，人口比較少。"],
    ["so5","彰化縣員林市近年人口增加，課本提到的原因是什麼？",["產業發展帶來工作機會，社區和公共建設規畫完善","發現了金礦","河運很方便"],0,"課本：員林市因產業發展帶來工作機會，加上新建社區及公共建設規畫完善，近年人口有增加的趨勢。"],
    ["so5","一個地方的人口會因為出生、死亡、移入、移出而改變。",["⭕ 對","❌ 錯"],0,"對！出生和移入讓人口變多；死亡和移出讓人口變少。"],
    ["so5","大稻埕早期繁榮，主要是因為鐵路、公路等陸上交通方便。",["⭕ 對","❌ 錯"],1,"錯！大稻埕靠的是淡水河的「河運」，船隻在這裡停靠、做買賣。"],
    ["so5","中壢有鐵路、公路經過，陸上交通方便，吸引人口聚集。",["⭕ 對","❌ 錯"],0,"對！中壢的發展和陸上交通有關。"],
    ["so5","九份在發現金礦以後，吸引很多人來挖金，人口變多。",["⭕ 對","❌ 錯"],0,"對！課本：新北市九份曾經因開採金礦，成為繁華的小鎮。"],
    ["so6","政府推行「家庭計畫」，是為了鼓勵大家多生小孩。",["⭕ 對","❌ 錯"],1,"錯！早期務農需要很多人力，有「多子多孫多福氣」的觀念；後來政府推動家庭計畫，鼓勵減少生育，提出「兩個孩子恰恰好」。現在才改成鼓勵生育。"],
    ["so6","少子化會讓學校的學生變少，有些學校可能要合併或停辦。",["⭕ 對","❌ 錯"],0,"對！學生太少時，可能會併校或廢校。"],
    ["so5","一個鄉鎮的青壯年大量移出，老年人口的比例就會變高。",["⭕ 對","❌ 錯"],0,"對！年輕人離開，留下的長輩占的比例就變大，例如雲林水林鄉。"],
    ["so5","一個地方的青壯年人口增加，通常幼年人口也可能跟著增加。",["⭕ 對","❌ 錯"],0,"對！青壯年在這裡成家、生小孩，例如竹北市的小朋友比例很高。"],
    ["so6","政府為了幫助老年人口，推動了下列哪一項？",["樂齡學堂","公共托育","育嬰假"],0,"課本：高齡社會的應對有長照中心、樂齡學堂、二度就業；公共托育和育嬰假是因應少子化的做法。"],
    ["so5","竹北市人口快速增加，最主要的原因是什麼？",["附近有科學園區、高鐵站，工作機會多、交通方便","有很多金礦","靠河運做生意"],0,"竹北靠近新竹科學園區，又有高鐵新竹站，吸引年輕家庭搬入。"],
    ["so5","下列哪一個不是吸引人口移入的條件？",["工作機會很少","就醫方便","教育文化資源多"],0,"工作機會「多」才會吸引人；工作機會少，年輕人反而會搬走。"],
    ["so6","下列哪一項是政府為了改善「少子化」的做法？",["增設公共托育、育嬰假","設立樂齡學堂","增加復健設施"],0,"課本：政府推動各項生育政策、發放津貼，例如增設公共托育、育嬰假。"],
    ["so6","下列哪一項是因應「高齡社會」、照顧長輩的做法？",["長照中心、樂齡學堂","發放生育補助","增加幼兒園"],0,"課本：政府推動長照中心、樂齡學堂、二度就業等政策，幫助老年人口。"],
    ["so6","「二度就業」是什麼意思？",["離開工作一段時間的人，再回到工作崗位","第一次找工作","同時做兩份工作"],0,"例如照顧孩子的爸媽、退休長輩，再次回到職場工作。"],
    ["so6","臺灣出生的人數愈來愈少，叫做什麼現象？",["少子化","高齡社會","都市化"],0,"出生人數變少就是少子化。課本：經濟發達、教育程度提高、養育費用提高、婦女就業比例增加等，降低了生育意願。"],
    ["so6","政府推動「家庭計畫」時，提出的口號是什麼？",["兩個孩子恰恰好","多子多孫多福氣","生得愈多愈好"],0,"這是鼓勵少生的口號。"],
    ["so6","早期臺灣以務農為主、需要大量人力，所以有什麼生育觀念？",["多子多孫多福氣","兩個孩子恰恰好","不生小孩最好"],0,"課本：早期務農需要投入大量人力，所以有「多子多孫多福氣」的觀念；後來政府推動家庭計畫，提出「兩個孩子恰恰好」。"],
    ["so6","下列哪一項「不是」課本提到形成少子化的原因？",["醫療技術進步","教育程度提高","婦女就業比例增加"],0,"少子化的原因：經濟發達、教育程度提高、養育費用提高、婦女就業比例增加。醫療技術進步是造成高齡社會的原因。"],
    ["so6","課本說，「高齡社會」是指 65 歲以上人口占總人口多少以上？",["14%","7%","50%"],0,"課本：65 歲以上人口占總人口 14% 以上，稱為高齡社會；臺灣在民國 107 年達到（約 14.6%）。"],
    ["so6","造成國人平均壽命延長、老年人口比例提高的原因是什麼？",["醫療技術進步、衛生環境改善","學生人數變少","交通路線變多"],0,"課本：醫療技術進步、衛生環境改善使平均壽命延長，加上少子化，提高了老年人口的比例。"],
    ["so6","出生人數降低，會讓家鄉的哪一種人口減少？",["勞動人口","老年人口","觀光客"],0,"課本：出生人數降低，家鄉的勞動人口會減少，部分學校也會面臨併校或廢校。"],
    ["so6","長者維持充足的體力和精神，再次就業或參與學習，課本用哪一句話來形容？",["活到老、學到老","多子多孫多福氣","兩個孩子恰恰好"],0,"課本：隨著健康促進生活的推展，長者能再次就業或參與學習，不僅貢獻專業，也能「活到老、學到老」。"],
    // 第四單元 家鄉的多元文化、第五單元 家鄉的節慶與禮俗（翰林 4上，學校還沒教，單元標 later）
    ['so7', '客家族群常用什麼來當沾醬？', ['桔醬', '番茄醬', '花生醬'], 0, '課本介紹：客家族群會使用桔醬來當沾醬。'],
    ['so7', '「炒粄條」是課本介紹的哪一個族群的米製品？', ['客家族群', '閩南族群', '越南新住民'], 0, '課本舉例：客家族群的炒粄條。'],
    ['so7', '「竹筒飯」是課本介紹的哪一個族群的米製品？', ['客家族群', '原住民族', '閩南族群'], 1, '課本舉例：原住民族的竹筒飯。'],
    ['so7', '「碗粿」是課本介紹的哪一個族群的米製品？', ['原住民族', '閩南族群', '客家族群'], 1, '課本舉例：閩南族群的碗粿。'],
    ['so7', '在臺灣也吃得到的「河粉」，課本說是哪裡的新住民的米製品？', ['泰國', '越南', '韓國'], 1, '課本舉例：越南新住民的河粉。'],
    ['so7', '炒粄條、竹筒飯、碗粿、河粉有什麼共同點？', ['都是用麵粉做的', '都是米製品，但風味不同', '都是同一個族群的料理'], 1, '同一種食材在不同族群有不同的料理方式，它們都是米製品。'],
    ['so7', '課本用泰國的「打拋豬肉」，說明東南亞國家料理的什麼特色？', ['常用米飯取代麵包', '常把食物醃漬很久', '常使用辛香料植物'], 2, '東南亞國家常使用辛香料植物做料理。'],
    ['so7', '課本說「泡菜」是哪一類食品？', ['米製品', '油炸食品', '醃漬食品'], 2, '課本：泡菜是醃漬食品，口味獨特。'],
    ['so7', '對於和自己不一樣的飲食文化，課本認為應該抱持什麼態度？', ['不喜歡就說它很難吃', '只能吃自己族群的食物', '不論喜不喜歡，都學習尊重'], 2, '無論喜歡或不喜歡，我們都應該學習尊重不同地區的飲食文化。'],
    ['so7', '「米漢堡」是用什麼取代了麵包？', ['米飯', '麵條', '餅乾'], 0, '米漢堡有漢堡的外型，但用米飯取代麵包。'],
    ['so7', '西方的漢堡傳到以米食為主的東方社會，變成「米漢堡」，這是什麼的例子？', ['飲食文化消失了', '飲食文化的融合與創新', '醃漬食品的做法'], 1, '不同文化接觸時會互相影響，創造出新的文化。'],
    ['so7', '課本說，新住民把東南亞常見的糕點，改用臺灣的什麼當餡料？', ['紅豆、芋頭', '牛肉、洋蔥', '起司、火腿'], 0, '課本：東南亞常見的糕點，改以臺灣的紅豆、芋頭作為餡料。'],
    ['so7', '課本說，泰式料理的香料在臺灣改用臺菜常用的哪一種？', ['芥末', '肉桂', '九層塔'], 2, '課本：泰式料理的香料，改用臺菜常用的九層塔。'],
    ['so7', '漫畫裡的「娘惹糕」包入了臺灣產的紅豆和芋頭，這說明了什麼？', ['娘惹糕是客家族群的傳統點心', '東南亞點心不可以加臺灣食材', '新住民的家鄉美食融合了臺灣的食材'], 2, '透過交流與融合，改良成適合臺灣人的好滋味。'],
    ['so7', '新北市永和區中興街販賣許多韓國的貨品，被稱為什麼？', ['小韓國', '小越南', '小日本'], 0, '單元扉頁：中興街是臺灣「韓味」最濃的地方，被稱為「小韓國」。'],
    ['so7', '課本說，有些地區的人們喜歡用什麼來做料理？', ['完全沒有味道的白開水', '冰塊', '味道強烈的辛香料'], 2, '課本：有些地區的人們喜歡用味道強烈的辛香料來做料理。'],
    ['so8', '課本說，各族群為什麼會發展出不同的服飾特色？', ['因為居住環境、生活與節慶等需求不同', '因為大家都想穿一樣的衣服', '因為衣服愈貴愈好看'], 0, '各族群因居住環境、生活與節慶等需求，發展出不同的服飾特色。'],
    ['so8', '早期原住民族怎麼做衣服？', ['到百貨公司購買', '利用天然材料，織出特殊圖案', '用塑膠布縫成'], 1, '早期原住民族利用天然材料，織出有特殊圖案的衣服。'],
    ['so8', '現今原住民族人參與什麼活動時，會穿戴傳統服飾與配件？', ['游泳比賽', '考試', '祭典'], 2, '參與祭典時穿戴傳統服飾與配件，可以傳承原住民族的文化。'],
    ['so8', '排灣族傳統服飾中常出現哪一種圖案？', ['櫻花', '百步蛇', '飛魚'], 1, '課本：排灣族傳統服飾中常出現百步蛇圖案。'],
    ['so8', '百步蛇對排灣族來說是什麼？', ['寵物', '守護神', '新年的食物'], 1, '課本：百步蛇是排灣族的守護神。'],
    ['so8', '在排灣族，誰的服飾才可以使用百步蛇圖案？', ['頭目與貴族', '每一位族人', '只有小孩'], 0, '只有頭目與貴族的服飾才可以使用百步蛇圖案。'],
    ['so8', '課本說排灣族的傳統服飾有什麼特色？', ['鮮豔的色彩與複雜的刺繡', '樸素的藍色、沒有花紋', '輕薄透氣、適合炎熱天氣'], 0, '排灣族傳統服飾使用鮮豔的色彩與複雜的刺繡方法。'],
    ['so8', '傳統的客家族群常穿哪一種樸素的服飾？', ['奧黛', '頭巾', '藍衫'], 2, '傳統的客家族群常穿樸素的藍衫，耐穿又方便勞動。'],
    ['so8', '早期客家人為什麼選擇耐洗、耐穿的布料做衣服？', ['方便參加舞會', '方便下雪時保暖', '方便耕種與勞動'], 2, '早期客家人辛苦開墾，選耐洗、耐穿的布料，便於耕種與勞動。'],
    ['so8', '加入排灣族圖騰元素的現代服裝、創意設計的藍衫禮服，都展現了什麼？', ['服飾的創新與傳承', '傳統服飾已經被丟掉了', '只有外國才有的服裝'], 0, '融合傳統與現代的服飾，展現族群文化的創新與傳承。'],
    ['so8', '在臺灣，許多信仰伊斯蘭教的新住民婦女，外出時必須穿戴什麼？', ['藍衫', '覆蓋頭髮和肩頭的頭巾', '有百步蛇圖案的帽子'], 1, '因為信仰，需要穿戴符合宗教規範的服飾。'],
    ['so8', '越南的國服叫什麼名字？', ['藍衫', '奧黛', '和服'], 1, '越南國服「奧黛」有許多種顏色與樣式。'],
    ['so8', '越南的「奧黛」為什麼用輕薄透氣的布料製成？', ['因為越南常常下雪', '因為要方便下田開墾', '因為越南氣候炎熱'], 2, '越南氣候炎熱，所以奧黛使用輕薄透氣的布料。'],
    ['so8', '越南新住民在什麼節日會穿著「奧黛」過年？', ['傳統春節', '耶誕節', '教師節'], 0, '課本：越南新住民在傳統春節時，會穿著「奧黛」過年。'],
    ['so8', '看到和自己不一樣的族群服飾時，應該怎麼做？', ['指著別人大笑', '要求對方換掉', '用尊重的態度欣賞'], 2, '用尊重的態度欣賞，讓各族群都能保存與展現文化特色。'],
    ['so8', '六堆運動會上，高雄美濃隊穿著什麼展現客家文化？', ['藍衫', '奧黛', '耶誕服裝'], 0, '課本照片：六堆運動會上高雄美濃隊穿著藍衫，展現客家文化。'],
    ['so9', '日常生活中，除了國語，課本說還可能聽到哪些語言？', ['只有英語', '閩南語、客家語、原住民族語和其他國家的語言', '沒有其他語言'], 1, '課本：除了國語，還可能聽到閩南語、客家語、原住民族語和其他國家的語言。'],
    ['so9', '學習不同的語言有什麼好處？', ['就可以不用說自己的母語', '就可以不用寫功課', '認識不同的文化，也能多認識一些朋友'], 2, '透過學習不同的語言，可以認識不同的文化，也能多認識朋友。'],
    ['so9', '在日本、韓國旅客較多的熱門景點車站，為什麼會增加日語及韓語廣播？', ['因為車站裡只有日本人和韓國人', '讓使用不同語言的旅客更容易理解', '為了讓廣播時間變長'], 1, '增加不同語言的廣播，對使用不同語言的旅客來說更容易理解。'],
    ['so9', '課本說，家鄉每個族群的語言應該怎麼樣？', ['都應該受到相同的保障', '人數多的族群語言才重要', '只要保留一種語言就好'], 0, '每個族群的語言都應該受到相同的保障，讓所有人都能有自信的使用母語。'],
    ['so9', '「母語」是指什麼？', ['出生後最早接觸與學習的家鄉語言', '只有媽媽才會說的語言', '學校規定的外國語'], 0, '小學堂：母語是我們出生後，最早接觸與學習的家鄉語言。'],
    ['so9', '政府透過學校教育，讓學生學習自己族群的語言，這種語言也屬於什麼？', ['外國語', '母語', '電腦程式語言'], 1, '課本：透過學校教育學習自己族群的語言，也屬於母語。'],
    ['so9', '在學校或公共場所，需要學習或溝通時，可以怎麼做？', ['使用大家都聽得懂的語言', '故意說別人聽不懂的話', '完全不說話'], 0, '在學校或公共場所，可以使用大家都聽得懂的語言。'],
    ['so9', '「世界母語日」是每年的哪一天？', ['2月21日', '9月28日', '10月10日'], 0, '課本：每年2月21日是「世界母語日」。'],
    ['so9', '各國推動「世界母語日」的目的是什麼？', ['讓大家都只學同一種語言', '促進母語的使用，保護語言避免消失', '慶祝國家的生日'], 1, '各國為促進母語的使用，並保護語言避免消失，推動這個節日。'],
    ['so9', '課本漫畫中，「恁早」（an` zo`）是用哪一種語言說「早安」？', ['閩南語', '越南語', '客家語'], 2, '課本標示：恁早是客家語的早安。'],
    ['so9', '課本說，漢人小孩的「姓」通常怎麼來？', ['長大後自己挑選', '由老師決定', '跟著父親或母親'], 2, '漢人小孩的姓，通常跟著父親或母親。'],
    ['so9', '漢人的名字，有些是來自什麼？', ['抽籤隨便決定', '天氣預報', '家人的期許或祝福'], 2, '漢人的名字有些來自家人的期許或祝福。'],
    ['so9', '下列關於原住民族命名的說法，哪一個符合課本？', ['不一定都會有姓，名字常參考自然界的事物', '一定都有姓，而且姓都跟媽媽', '名字都要用外國語言取'], 0, '原住民族的小孩不一定都會有姓，名字常參考自然界的事物。'],
    ['so9', '有些原住民族會在孩子的名字後面，加上什麼？', ['出生的年份', '父親或母親的名字', '家裡的門牌號碼'], 1, '有些原住民族會在孩子的名字後面，加上父親或母親的名字。'],
    ['so9', '發現同學的姓名和自己不一樣時，哪一種做法最合適？', ['幫同學取奇怪的綽號', '笑同學的名字很奇怪', '正確念出同學的姓名'], 2, '探究社會有絕招：正確念出同學的姓名，不隨便幫同學取奇怪的名字。'],
    ['so9', '課本漫畫中，「Chào buổi sáng」是用哪一種語言說「早安」？', ['太魯閣語', '越南語', '閩南語'], 1, '課本標示：Chào buổi sáng 是越南語的早安。'],
    ['so10', '「除夕」是什麼時候？', ['農曆一年中的最後一天', '農曆1月15日', '國曆1月1日'], 0, '除夕是農曆一年中的最後一天（農曆12月29或30日）。'],
    ['so10', '傳說中，什麼可以嚇走「年獸」？', ['明亮的光源及聲響', '安靜不出聲', '香甜的月餅'], 0, '課本：傳說明亮的光源及聲響，可以嚇走年獸。'],
    ['so10', '農曆1月1日春節時，人們常會做什麼？', ['在門口插艾草、配戴香包', '一起賞月、吃月餅', '到寺廟祈求平安順利、拜訪親友互道恭喜'], 2, '春節是農曆新年的開始，人們會到寺廟祈求平安，或拜訪親友、互道恭喜。'],
    ['so10', '哪一個節日被稱作「小過年」？', ['中秋節', '清明節', '元宵節'], 2, '元宵節（農曆1月15日）被稱作「小過年」。'],
    ['so10', '元宵節吃元宵，象徵什麼？', ['身體健康', '幸福團圓', '獲得好運'], 1, '課本：人們吃著元宵，象徵幸福團圓。'],
    ['so10', '清明節為什麼要回故鄉掃墓、祭拜祖先？', ['懷念與感恩祖先', '慶祝五穀豐收', '迎接新的一年'], 0, '清明節時，為了懷念與感恩祖先，許多人會掃墓與祭拜祖先。'],
    ['so10', '清明節時，人們會吃什麼？', ['粽子', '月餅', '潤餅'], 2, '課本：清明節時，人們會吃潤餅。'],
    ['so10', '端午節在門口插艾草、配戴香包，是為了祈求什麼？', ['幸福團圓', '身體健康', '五穀豐收'], 1, '端午節吃粽子、划龍舟、插艾草、配戴香包，祈求身體健康。'],
    ['so10', '課本說，吃月餅的習俗是怎麼演變來的？', ['為了嚇走年獸', '古人利用大餅傳遞軍情', '為了慶祝小米豐收'], 1, '古人利用大餅傳遞軍情，後來演變成吃月餅的習俗。'],
    ['so10', '「祖靈」是什麼意思？', ['一種用小米做的點心', '漢人過年貼的春聯', '原住民族對過世的先人，心存敬畏的尊稱'], 2, '課本：祖靈是原住民族對過世的先人，心存敬畏的尊稱。'],
    ['so10', '被稱為「邵族的新年」、在國曆9月舉辦的祭典是？', ['豐年祭', '祖靈祭', '潑水節'], 1, '祖靈祭是邵族最盛大的祭典，被稱為「邵族的新年」。'],
    ['so10', '阿美族的豐年祭，是為了什麼而舉辦？', ['懷念祖先、掃墓', '感恩五穀豐收', '慶祝耶穌誕生'], 1, '阿美族為了感恩五穀豐收，每年國曆7到9月間舉辦豐年祭。'],
    ['so10', '邵族祖靈祭由女祭司主持儀式；阿美族豐年祭由誰擔任活動主祭？', ['頭目', '女祭司', '新郎'], 0, '課本：阿美族的豐年祭由頭目擔任活動主祭。'],
    ['so10', '許多原住民族把哪一個祭典當作每年第一個歲時祭儀？', ['豐年祭', '祖靈祭', '小米播種祭'], 2, '課本：許多原住民族以小米播種祭，當作每年第一個歲時祭儀。'],
    ['so10', '為什麼許多原住民族的祭典都和小米有關？', ['小米是早期原住民族的日常主食', '小米是從國外傳來的零食', '小米只拿來當裝飾'], 0, '小米是早期原住民族日常主食，有許多祭典都與它相關。'],
    ['so10', '除夕夜，許多人會做什麼？', ['和家人團聚吃年夜飯', '划龍舟', '回故鄉掃墓'], 0, '許多人會在除夕夜與家人團聚吃年夜飯，也會貼春聯、發壓歲錢。'],
    ['so10', '現代人過清明節，有什麼新的改變？', ['改成吃年夜飯', '掃墓儀式簡化，還發展出線上祭祖', '改成互相潑水'], 1, '課本：現代人過清明節，不僅掃墓儀式簡化，還發展出線上祭祖。'],
    ['so10', '邵族祖靈祭中，用粽葉擦拭手臂有什麼意義？', ['祈求下雨', '慶祝耶誕節', '去除去年的不順利'], 2, '課本：用粽葉擦拭手臂，去除去年的不順利。'],
    ['so11', '耶誕節是國曆哪一天？', ['12月25日', '10月10日', '4月中旬'], 0, '課本：耶誕節訂在國曆12月25日。'],
    ['so11', '耶誕節是慶祝什麼的節日？', ['中華民國建國', '耶穌誕生', '五穀豐收'], 1, '耶誕節是慶祝耶穌誕生的節日，各地教會都會舉辦活動。'],
    ['so11', '課本說，耶誕節對歐美家庭來說，就像我們的哪一個節日？', ['農曆春節，是家人團聚的日子', '清明節，要回鄉掃墓', '教師節，要感謝老師'], 0, '耶誕節就如同農曆春節，是家人團聚的日子。'],
    ['so11', '泰國、緬甸的潑水節，是當地的什麼節日？', ['國慶日', '母親節', '傳統新年'], 2, '潑水節在國曆4月中旬舉辦，是當地國家的傳統新年。'],
    ['so11', '潑水節時，人們為什麼要互相潑水？', ['洗去壞運氣，消除災難、祈求平安', '比賽誰的水槍最厲害', '因為大家都忘了洗澡'], 0, '人們透過潑水為彼此洗去壞運氣，消除災難、祈求平安。'],
    ['so11', '參加臺灣的潑水節活動，要遵守什麼規定？', ['禁用高壓水槍，也不能潑汙水', '一定要帶高壓水槍', '可以潑泥巴水'], 0, '課本提醒：活動禁用高壓水槍，也不能潑汙水。'],
    ['so11', '每年的元旦（國曆1月1日）是什麼節日？', ['國慶日', '開國紀念日', '父親節'], 1, '西元1912年1月1日中華民國建國，每年元旦就是開國紀念日。'],
    ['so11', '國慶日是國曆哪一天？', ['1月1日', '10月10日', '8月8日'], 1, '國慶日在國曆10月10日，總統府前會舉行遊行、國軍儀隊表演等。'],
    ['so11', '母親節在什麼時候？', ['國曆8月8日', '國曆5月的第二個星期日', '國曆9月28日'], 1, '課本：母親節是國曆5月第二個星期日。'],
    ['so11', '教師節是國曆哪一天？', ['8月8日', '12月25日', '9月28日'], 2, '教師節是國曆9月28日，許多學校會舉辦表達感恩的敬師活動。'],
    ['so11', '母親節、父親節、教師節是為了什麼而制訂？', ['慶祝國家的生日', '慶祝外國的傳統新年', '感謝不同身分或職業的人的辛勞與付出'], 2, '這些節日是為不同身分或職業的人們制訂的，讓我們感謝他們。'],
    ['so11', '布袋戲用手掌指頭操作戲偶，所以又稱為什麼？', ['皮影戲', '掌中戲', '歌仔戲'], 1, '布袋戲因運用手掌指頭操作戲偶，又稱「掌中戲」。'],
    ['so11', '為什麼雲林適合舉辦國際偶戲節？', ['雲林的櫻花最多', '雲林是政府最早辦燈會的縣市', '雲林有全臺最多的布袋戲團，偶戲文化深厚'], 2, '雲林擁有全臺最多的布袋戲團，並有布袋戲片場，具有深厚的偶戲文化。'],
    ['so11', '阿里山櫻花季的阿里山，位在哪一個縣？', ['嘉義縣', '雲林縣', '臺北市'], 0, '阿里山位於嘉義縣，山區氣候涼爽，適合櫻花生長。'],
    ['so11', '臺灣由政府最早開始舉辦燈會的縣市是？', ['高雄市', '嘉義縣', '臺北市'], 2, '單元扉頁「臺灣之最」：臺北市是政府最早開始舉辦燈會的縣市。'],
    ['so11', '許多東南亞新住民參加臺灣的潑水節活動，可以怎麼樣？', ['慶祝國慶日', '祭拜祖靈', '紓解思鄉之情'], 2, '課本：新住民參與潑水節紓解思鄉之情，也有不少臺灣民眾參與體驗。'],
    ['so11', '開國紀念日、國慶日這些國家的特殊節日，可以讓我們怎麼樣？', ['更加了解國家的歷史與發展', '認識外國的新年', '感謝老師的辛勞'], 0, '國家的特殊節日可以讓我們更加了解國家的歷史與發展。'],
    ['so11', '父親節是國曆哪一天？', ['5月5日', '8月8日', '10月10日'], 1, '課本：父親節是國曆8月8日。'],
    ['so12', '課本說，人的一生會經歷哪些重要階段？', ['出生、成年、結婚到死亡', '只有上學和畢業', '只有過生日'], 0, '人的一生會經歷出生、成年、結婚到死亡等重要階段。'],
    ['so12', '家庭迎接新生兒時，課本提到哪些禮俗？', ['鑽七娘媽亭、敬茶', '盪秋千、抱新娘', '滿月、收涎、抓週'], 2, '迎接新生兒時，會透過滿月、收涎、抓週等禮俗，表達喜悅與對新生命的重視。'],
    ['so12', '小孩出生滿四個月時，會舉辦什麼活動？', ['抓週', '成年禮', '收涎'], 2, '課本：小孩出生滿四個月時的活動是「收涎」。'],
    ['so12', '「收涎」的意義是什麼？', ['猜猜小孩將來做什麼工作', '收起口水，希望快快長大', '表示已經長大成人'], 1, '收涎的意義是收起口水，希望快快長大。'],
    ['so12', '小孩出生滿周歲時的「抓週」，代表什麼？', ['長輩對小孩長大後的期望', '收起口水', '去除去年的不順利'], 0, '課本：抓週是長輩對小孩長大後的期望。'],
    ['so12', '成年禮除了給予祝福，還能培養青少年什麼？', ['挑食的習慣', '責任感與敬老尊賢的美德', '晚睡的習慣'], 1, '成年儀式也培養青少年的責任感與敬老尊賢的美德。'],
    ['so12', '課本說，漢人青少年滿幾歲時會舉行成年禮？', ['十二歲', '十歲', '十六歲'], 2, '漢人青少年滿十六歲時，會舉行成年禮。'],
    ['so12', '有些漢人會用什麼活動，作為滿十六歲的成年禮？', ['鑽七娘媽亭', '盪秋千', '抓週'], 0, '課本：有些漢人會以鑽七娘媽亭，作為滿十六歲的成年禮。'],
    ['so12', '阿美族的成年禮有什麼特色？', ['要鑽七娘媽亭', '有賽跑等訓練課程，也教唱傳統歌舞', '要抓週'], 1, '阿美族的成年禮有賽跑等訓練活動，包含傳統歌舞教唱。'],
    ['so12', '漢人婚禮有祭拜祖先、拜別父母等儀式，用意是什麼？', ['表達感謝長輩養育之恩', '祈求五穀豐收', '嚇走年獸'], 0, '這些儀式用以表達感謝長輩養育之恩。'],
    ['so12', '漢人婚禮上的「敬茶」是什麼意思？', ['比賽誰泡的茶最好喝', '介紹新娘給男方親友認識，表達感謝、接受祝福', '請客人付茶錢'], 1, '敬茶是介紹新娘給男方親友認識，並向親友表達感謝、接受大家祝福。'],
    ['so12', '迎娶車隊到達新郎家，新娘下車前會輕摸什麼，表示吉利平安？', ['粽子', '橘子或蘋果', '月餅'], 1, '新娘會輕摸橘子或蘋果，並贈紅包答禮，表示吉利平安。'],
    ['so12', '魯凱族婚禮中，新娘把秋千盪得愈高，象徵什麼？', ['新娘的力氣愈大', '明年小米會豐收', '夫妻愛情愈堅定，受到族人愈多祝福'], 2, '秋千盪得愈高，象徵夫妻愛情愈堅定，受到族人愈多的祝福。'],
    ['so12', '魯凱族新郎抱起新娘的行為，被稱為什麼？', ['勇士禮讚', '敬茶', '抓週'], 0, '課本：新郎抱起新娘被稱為勇士禮讚，表示新郎有能力負擔重任。'],
    ['so12', '參加不同族群的婚禮時，應該怎麼做？', ['照自己的習慣做就好', '大聲說別人的習俗很奇怪', '尊重不同的禮俗與禁忌，遵守習俗或主人規定'], 2, '探究社會有絕招：各族群不同的禮俗與禁忌要加以尊重。'],
    ['so12', '「成年」表示什麼？', ['從嬰兒變成小學生', '從青少年轉變為大人', '開始上幼兒園'], 1, '課本：成年表示從青少年轉變為大人。'],
    ['so12', '有些漢人會配戴護身符保平安，到了十六歲時會怎麼做？', ['送給弟弟妹妹', '丟進河裡', '到廟裡取下'], 2, '課本：有些漢人會配戴護身符保平安，十六歲時至廟裡取下。']
  ];
  SO.forEach(function (x) { cards.push({ id: 'so:' + x[0] + ':' + hid(x[1]), s: 'so', u: x[0], type: 'pick', q: x[1], opts: x[2], ai: x[3], ex: x[4] }); });

  // 英語：從各課頁面的單字和句子整理。拼字（看中文和圖拼出英文）、聽音選意思、句子排順序
  var EN_W = [
    [1,"sunny","☀️","晴朗的","It's sunny."],
    [1,"cloudy","☁️","陰天的；多雲的","It's cloudy."],
    [1,"rainy","🌧️","下雨的","It's rainy."],
    [1,"windy","🌬️","颳風的","It's windy."],
    [1,"hot","🥵","熱的","It's hot."],
    [1,"cold","🥶","冷的","It's cold."],
    [2,"fifteen","15","十五","It's twelve fifteen."],
    [2,"twenty","20","二十","It's twelve twenty."],
    [2,"twenty-five","25","二十五","It's twelve twenty-five."],
    [2,"thirty","30","三十","It's twelve thirty."],
    [2,"forty","40","四十","It's twelve forty."],
    [2,"fifty","50","五十","It's twelve fifty."],
    [3,"book","","書","Is this your book?"],
    [3,"eraser","","橡皮擦","Is this your eraser?"],
    [3,"marker","","簽字筆；彩色筆","Is this your marker?"],
    [3,"pen","","原子筆","Is this your pen?"],
    [3,"pencil","","鉛筆","Is this your pencil?"],
    [3,"ruler","","尺","Is this your ruler?"],
    [4,"in","","在……裡面","It's in the box."],
    [4,"on","","在……上面","It's on the desk."],
    [4,"under","","在……底下","It's under the chair."],
    [4,"box","","盒子；箱子","Where's the box?"],
    [4,"chair","","椅子","It's on the chair."],
    [4,"desk","","書桌","It's under the desk."]
  ];
  var EN_O = [
    [1,"How's the weather?"],
    [1,"It's sunny."],
    [1,"How's the weather in Taipei?"],
    [1,"It's rainy in Tainan."],
    [1,"It's windy today."],
    [1,"It's cold and cloudy."],
    [2,"What time is it?"],
    [2,"It's twelve o'clock."],
    [2,"It's twelve thirty."],
    [2,"It's four fifteen."],
    [2,"What time is it in London?"],
    [2,"It's seven forty."],
    [2,"It's half past four."],
    [2,"It's a quarter past six."],
    [2,"It's a quarter to seven."],
    [3,"Is this your pencil?"],
    [3,"Yes, it is."],
    [3,"No, it's not."],
    [3,"Is this your book?"],
    [3,"It's my ruler."],
    [3,"It's not my pencil."],
    [4,"Where's the eraser?"],
    [4,"It's under the chair."],
    [4,"It's on the desk."],
    [4,"It's in the box."],
    [4,"Where's my schoolbag?"],
    [4,"Not on the desk."]
  ];
  EN_W.forEach(function (x) {
    cards.push({ id: 'ens:' + x[1], s: 'en', u: 'en' + x[0], type: 'spell', w: x[1], e: x[2], m: x[3], ex: x[4], label: '拼字：' + x[1] });
    cards.push({ id: 'enl:' + x[1], s: 'en', u: 'en' + x[0], type: 'pick', label: '聽音：' + x[1], listen: x[1], e: x[2], m: x[3] });
  });
  EN_O.forEach(function (x) { cards.push({ id: 'eno:' + hid(x[1]), s: 'en', u: 'en' + x[0], type: 'order', sent: x[1], label: '排句子：' + x[1] }); });

  // 拖曳「放到對的位置」
  // 國語：部件拼字（lr 左右、tb 上下）
  var PARTS = [[1, '漫', 'lr', '氵', '曼'], [1, '淡', 'lr', '氵', '炎'], [1, '伴', 'lr', '亻', '半'], [1, '姿', 'tb', '次', '女'],
    [2, '汽', 'lr', '氵', '气'], [2, '換', 'lr', '扌', '奐'], [2, '餓', 'lr', '飠', '我'], [2, '菜', 'tb', '艹', '采'],
    [3, '拆', 'lr', '扌', '斥'], [3, '酸', 'lr', '酉', '夋'], [3, '蓮', 'tb', '艹', '連'], [3, '志', 'tb', '士', '心'],
    [4, '淺', 'lr', '氵', '戔'], [4, '針', 'lr', '金', '十'], [4, '峰', 'lr', '山', '夆'], [4, '領', 'lr', '令', '頁'],
    [5, '挑', 'lr', '扌', '兆'], [5, '程', 'lr', '禾', '呈'], [5, '驕', 'lr', '馬', '喬'], [5, '震', 'tb', '雨', '辰'],
    [6, '洲', 'lr', '氵', '州'], [6, '鋼', 'lr', '金', '岡'], [6, '標', 'lr', '木', '票'], [6, '俯', 'lr', '亻', '府'],
    [7, '情', 'lr', '忄', '青'], [7, '陶', 'lr', '阝', '匋'], [7, '返', 'lr', '辶', '反'], [7, '渡', 'lr', '氵', '度']];
  PARTS.forEach(function (x) {
    var ch = CHARS.filter(function (c) { return c.c === x[1]; })[0];
    cards.push({ id: 'cnd:' + x[1], s: 'cn', u: 'cn' + x[0], type: 'drag', gen: 'parts', label: '部件拼字：' + x[1], c: x[1], lay: x[2], a: x[3], b: x[4], zy: ch ? ch.zy : '', tx: ch ? ch.tx : '' });
  });
  cards.push({ id: 'nad:fish', s: 'na', u: 'na2', type: 'drag', gen: 'fishParts', label: '魚的身體構造' });
  cards.push({ id: 'nad:pond', s: 'na', u: 'na2', type: 'drag', gen: 'pondPlants', label: '水生植物住哪裡' });
  cards.push({ id: 'mad:tri', s: 'ma', u: 'ma6', type: 'drag', gen: 'triSort', label: '三角形分類籃子' });
  cards.push({ id: 'mad:angle', s: 'ma', u: 'ma3', type: 'drag', gen: 'angleSort', label: '角度分類籃子' });

  /* 出題：把卡片變成這一次要作答的題目 */
  function make(card) {
    if (card.gen) { var g = GEN[card.gen](card); g.kind = g.kind || 'num'; return g; }
    if (card.type === 'pick' && card.w) { var opts = [card.a].concat(card.w); return { kind: 'pick', q: card.q, opts: opts, a: 0, ex: card.ex, wi: card.wi }; }
    if (card.type === 'spot') return { kind: 'spot', block: false, q: card.q, parts: card.parts, bad: card.bad, fix: card.fix, ex: card.ex };
    if (card.type === 'pick' && card.opts) return { kind: 'pick', q: card.q, opts: card.opts, a: card.ai, ex: card.ex };
    if (card.type === 'pick' && card.listen) {
      var same = cards.filter(function (c) { return c.listen && c.u === card.u && c.m !== card.m; }), others = cards.filter(function (c) { return c.listen && c.u !== card.u; });
      var pool = (same.length >= 2 ? same : same.concat(others)).slice().sort(function () { return Math.random() - .5; }).slice(0, 2);
      return { kind: 'pick', listen: card.listen, q: '聽一聽，這個英文是什麼意思？', opts: [card.m].concat(pool.map(function (c) { return c.m; })), a: 0, ex: '<b>' + card.listen + '</b>' + (card.e ? ' ' + card.e : '') + '：' + card.m };
    }
    if (card.type === 'spell') {
      var letters = card.w.split(''), abc = 'abcdefghijklmnoprstuwy'.split('').filter(function (l) { return card.w.indexOf(l) < 0; }).sort(function () { return Math.random() - .5; });
      return { kind: 'spell', w: card.w, e: card.e, m: card.m, ex: card.ex, tiles: letters.concat(abc.slice(0, 2)).sort(function () { return Math.random() - .5; }) };
    }
    if (card.type === 'order') { var ws = card.sent.split(' '); var t; do { t = ws.slice().sort(function () { return Math.random() - .5; }); } while (ws.length > 1 && t.join(' ') === card.sent); return { kind: 'order', sent: card.sent, words: ws, tiles: t }; }
    if (card.type === 'drag') return GEN[card.gen](card);
    return { kind: card.type };
  }

  // 還沒教的單元：卡片帶 later，排程才知道預設關掉
  var LATER = {}; UNITS.forEach(function (u) { if (u.later) LATER[u.k] = true; });
  cards.forEach(function (c) { if (LATER[c.u]) c.later = true; });

  root.REVIEW_BANK = { subjects: SUBJECTS, units: UNITS, cards: cards, make: make, readNum: readNum, moonSVG: moonSVG, GEN: GEN, fmtD: fmtD, readD: readD, gridSVG: gridSVG, fq: fq, mx: mx, fracBars: fracBars, barSVG: barSVG, lineSVG: lineSVG, pictoHTML: pictoHTML, barChart: barChart };
})(typeof window !== 'undefined' ? window : this);
