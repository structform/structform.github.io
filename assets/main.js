(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var LINKS = window.SF_LINKS || {};

  /* ---------- Nav ---------- */
  var burger = $('#burger'), links = $('#links');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#links a').forEach(function (a) { a.addEventListener('click', function () { links.classList.remove('open'); }); });

  /* ---------- Modal / links ---------- */
  var modal = $('#modal');
  var NAMES = { paper: 'The paper', supp: 'The supplementary material', code: 'The code', models: 'The models', dataset: 'The dataset' };
  function soon(text) {
    $('#m-text').textContent = text;
    modal.hidden = false;
  }
  $$('[data-link]').forEach(function (a) {
    var key = a.getAttribute('data-link'), url = LINKS[key];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; return; }
    a.addEventListener('click', function (e) {
      e.preventDefault();
      soon((NAMES[key] || 'This resource') + ' will be released soon. Please check back later.');
    });
  });
  $$('[data-soon]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); soon(a.getAttribute('data-soon') + ' is not available yet.'); });
  });
  if (LINKS.code) { var cs = $('#code-state'); if (cs) cs.textContent = 'View on GitHub'; }
  if (!LINKS.supp) { var ss = $('#supp-state'); if (ss) ss.textContent = 'Coming soon'; }
  $('#m-close').addEventListener('click', function () { modal.hidden = true; });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { modal.hidden = true; $('#lightbox').hidden = true; } });

  /* ---------- Results tables (values from Table 1-4 of the paper) ---------- */
  var COLS = [['K-CER', 0], ['K-WER', 0], ['V-CER', 0], ['V-WER', 0], ['Pair F1', 1], ['EM', 1]]; // 0 = lower better
  var T1 = {
    english: [
      ['Open', 'Donut', .124, .228, .151, .283, .785, .452],
      ['Open', 'Nougat', .108, .195, .134, .249, .812, .496],
      ['Open', 'GOT-OCR 2.0', .085, .152, .109, .198, .857, .564],
      ['Open', 'LightOnOCR', .091, .168, .115, .213, .841, .538],
      ['Open', 'Surya OCR 2', .089, .161, .112, .206, .848, .551],
      ['Open', 'Dolphin-v2', .079, .143, .098, .182, .873, .591],
      ['Open', 'FormLens', .107, .193, .129, .228, .832, .522],
      ['Commercial', 'Google Document AI Form Parser', .042, .079, .052, .098, .951, .735],
      ['Commercial', 'Azure AI Document Intelligence', .058, .105, .073, .136, .911, .662],
      ['Ours', 'StructForm', .046, .087, .059, .111, .942, .718]
    ],
    bengali: [
      ['Open', 'LightOnOCR', .245, .412, .532, .728, .541, .218],
      ['Open', 'Surya OCR 2', .228, .384, .512, .695, .562, .239],
      ['Commercial', 'Google Document AI Form Parser', .084, .148, .188, .282, .852, .568],
      ['Commercial', 'Azure AI Document Intelligence', .115, .198, .278, .405, .782, .475],
      ['Ours', 'StructForm', .052, .095, .114, .182, .921, .685]
    ],
    hindi: [
      ['Open', 'LightOnOCR', .212, .354, .468, .651, .605, .284],
      ['Open', 'Surya OCR 2', .196, .331, .442, .624, .621, .305],
      ['Commercial', 'Google Document AI Form Parser', .069, .121, .152, .241, .886, .628],
      ['Commercial', 'Azure AI Document Intelligence', .095, .168, .225, .348, .826, .542],
      ['Ours', 'StructForm', .041, .076, .089, .142, .948, .742]
    ]
  };
  var f3 = function (v) { return v.toFixed(3); };

  function renderMain(lang) {
    var rows = T1[lang], best = [], second = [];
    COLS.forEach(function (c, i) {
      var vals = rows.map(function (r) { return r[i + 2]; }).sort(function (a, b) { return c[1] ? b - a : a - b; });
      best[i] = vals[0]; second[i] = vals[1];
    });
    var h = '<thead><tr><th>Method</th>' + COLS.map(function (c) { return '<th>' + c[0] + (c[1] ? ' &uarr;' : ' &darr;') + '</th>'; }).join('') + '</tr></thead><tbody>';
    var grp = '';
    rows.forEach(function (r) {
      if (r[0] !== grp) { grp = r[0]; h += '<tr class="grp"><td colspan="7">' + grp + '</td></tr>'; }
      h += '<tr' + (r[0] === 'Ours' ? ' class="ours"' : '') + '><td>' + r[1] + '</td>';
      COLS.forEach(function (c, i) {
        var v = r[i + 2], cls = v === best[i] ? 'best' : (v === second[i] ? 'second' : '');
        h += '<td class="' + cls + '">' + f3(v) + '</td>';
      });
      h += '</tr>';
    });
    $('#main-table').innerHTML = h + '</tbody>';
  }
  $$('#tbl-tabs .tab').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#tbl-tabs .tab').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active'); renderMain(b.getAttribute('data-lang'));
    });
  });
  renderMain('english');

  function simple(id, head, rows, boldRow) {
    var h = '<thead><tr>' + head.map(function (x, i) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r, ri) {
      h += '<tr' + (ri === boldRow ? ' class="ours"' : '') + '>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
    });
    $(id).innerHTML = h + '</tbody>';
  }
  simple('#abl-table', ['Setting', 'Syn. KV', 'Anchor', 'Real adapt.', 'Pair F1', 'EM'], [
    ['A', 'No', 'No', 'Yes', '0.742', '0.415'],
    ['B', 'Yes', 'No', 'Yes', '0.865', '0.582'],
    ['C', 'Yes', 'Yes', 'No', '0.814', '0.518'],
    ['D (full)', 'Yes', 'Yes', 'Yes', '0.937', '0.715']
  ], 3);
  simple('#cap-table', ['Capture', 'English', 'Bengali', 'Hindi'], [
    ['Flatbed scan', '0.958', '0.938', '0.961'],
    ['Mobile capture', '0.926', '0.904', '0.935']
  ], -1);
  simple('#anchor-table', ['Language', 'Key IoU', 'Value IoU', 'Assoc. Acc.'], [
    ['English', '0.892', '0.864', '0.952'],
    ['Bengali', '0.854', '0.812', '0.918'],
    ['Hindi', '0.868', '0.829', '0.931'],
    ['Average', '0.871', '0.835', '0.934']
  ], 3);

  /* ---------- Qualitative carousel ---------- */
  var SLIDES = [];
  [['english', 'English'], ['bengali', 'Bengali'], ['hindi', 'Hindi']].forEach(function (l) {
    for (var i = 1; i <= 4; i++) SLIDES.push({ lang: l[0], name: l[1], n: i, src: 'assets/qual/' + l[0] + '_' + i + '.jpg' });
  });
  var DELAY = 6000, cur = 0, list = SLIDES, playing = true, hover = false, t0 = 0, raf = 0, elapsed = 0;
  var img = $('#c-img'), label = $('#c-label'), dots = $('#c-dots'), prog = $('#c-progress'), playBtn = $('#c-play');

  function buildDots() {
    dots.innerHTML = '';
    list.forEach(function (s, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', function () { show(i); });
      dots.appendChild(b);
    });
  }
  function show(i) {
    cur = (i + list.length) % list.length;
    var s = list[cur];
    img.classList.add('fade');
    setTimeout(function () {
      img.src = s.src; img.alt = s.name + ' handwritten form, example ' + s.n + ': input and model outputs';
      img.classList.remove('fade');
    }, 160);
    label.textContent = s.name + ' · example ' + s.n + ' of 4  (' + (cur + 1) + '/' + list.length + ')';
    $$('button', dots).forEach(function (d, k) { d.classList.toggle('on', k === cur); });
    elapsed = 0; t0 = performance.now();
    // preload next
    var nx = new Image(); nx.src = list[(cur + 1) % list.length].src;
  }
  function tick(now) {
    if (playing && !hover && !document.hidden) {
      elapsed += now - t0;
      if (elapsed >= DELAY) show(cur + 1);
    }
    t0 = now;
    prog.style.width = Math.min(100, elapsed / DELAY * 100) + '%';
    raf = requestAnimationFrame(tick);
  }
  $('#c-prev').addEventListener('click', function () { show(cur - 1); });
  $('#c-next').addEventListener('click', function () { show(cur + 1); });
  playBtn.addEventListener('click', function () {
    playing = !playing; playBtn.textContent = playing ? 'Pause' : 'Play';
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  });
  var car = $('#carousel');
  car.addEventListener('mouseenter', function () { hover = true; });
  car.addEventListener('mouseleave', function () { hover = false; });
  car.addEventListener('touchstart', function () { hover = true; }, { passive: true });
  car.addEventListener('touchend', function () { setTimeout(function () { hover = false; }, 4000); }, { passive: true });
  $$('#q-tabs .tab').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#q-tabs .tab').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var l = b.getAttribute('data-lang');
      list = l === 'all' ? SLIDES : SLIDES.filter(function (s) { return s.lang === l; });
      buildDots(); show(0);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1);
  });
  /* swipe */
  var sx = null;
  car.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  car.addEventListener('touchend', function (e) {
    if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* lightbox */
  var lb = $('#lightbox');
  $('#c-stage').addEventListener('click', function () { $('img', lb).src = img.src; lb.hidden = false; });
  lb.addEventListener('click', function () { lb.hidden = true; });

  buildDots(); show(0); raf = requestAnimationFrame(tick);

  /* ---------- Citation copy ---------- */
  $('#copy').addEventListener('click', function () {
    var btn = this, txt = $('#bibtex').textContent;
    var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { });
    else { var r = document.createRange(); r.selectNode($('#bibtex')); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand('copy'); done(); }
  });

  /* ---------- Active nav highlight ---------- */
  var secs = $$('main section[id]'), nav = $$('#links a');
  window.addEventListener('scroll', function () {
    var y = scrollY + 90, cid = '';
    secs.forEach(function (s) { if (s.offsetTop <= y) cid = s.id; });
    nav.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cid); });
  }, { passive: true });
})();
