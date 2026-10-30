/* zerotoinfy.github.io — renders the page from data/profile.json.
   Edit data/profile.json to update the site AND the downloadable résumé. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function photo(file, w) { return 'assets/img/photos/' + file + '-' + w + '.webp'; }
  function srcset(file) { return photo(file, 400) + ' 400w, ' + photo(file, 800) + ' 800w, ' + photo(file, 1600) + ' 1600w'; }

  /* ---------- icons (single-path, 24px stroke) ---------- */
  var ICON = {
    code: 'M8 6l-6 6 6 6M16 6l6 6-6 6',
    layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
    db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
    globe: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z',
    monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
    check: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM8 12l3 3 5-6',
    cloud: 'M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.7A4 4 0 0 0 7 19z',
    git: 'M6 3v12M18 9a3 3 0 1 0 0-6a3 3 0 1 0 0 6zM6 21a3 3 0 1 0 0-6a3 3 0 1 0 0 6zM18 9c0 6-12 3-12 9',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
    users: 'M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7zM2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M16 4a3.5 3.5 0 0 1 0 7M18 14c2.4.6 4 2.9 4 6',
    term: 'M3 4h18v16H3zM7 9l3 3-3 3M13 15h4',
    doc: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6',
    list: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
    plug: 'M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4',
    flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
    cap: 'M2 9l10-5 10 5-10 5-10-5zM6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5',
    book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5',
    pin: 'M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 7.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z',
    star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z',
    mail: 'M3 5h18v14H3zM3 7l9 6 9-6',
    heart: 'M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z',
    award: 'M12 15a6 6 0 1 0 0-12a6 6 0 1 0 0 12zM8.5 14l-1.5 8 5-3 5 3-1.5-8'
  };
  function svg(d, size, sw) {
    return '<svg width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  }
  var COLORS = ['#D63C3C', '#0E8F7E', '#C77700', '#1A7DB8', '#5B2A86', '#1F4E79'];

  /* ---------- language ---------- */
  var HI = {
    'skip': 'सामग्री पर जाएँ',
    'nav.about': 'परिचय', 'nav.projects': 'प्रोजेक्ट्स', 'nav.journey': 'सफ़र', 'nav.skills': 'कौशल', 'nav.trainings': 'प्रशिक्षण', 'nav.gallery': 'गैलरी', 'nav.contact': 'संपर्क करें', 'nav.contact2': 'संपर्क',
    'hero.role': 'डिप्टी मैनेजर (सिस्टम्स)', 'hero.org': 'भारतीय स्टेट बैंक', 'hero.hello': '| आपका यहाँ स्वागत है |',
    'hero.h1': 'नमस्ते, मैं इम्तियाज़ हुसैन हूँ।', 'hero.h2': 'मैं ऐसे सिस्टम्स की डिलीवरी का नेतृत्व करता हूँ जो', 'hero.h3': 'शुरू से अंत तक काम करें',
    'hero.now': 'अभी SBI में', 'hero.since': 'डिप्टी मैनेजर (सिस्टम्स) · जून 2025 से',
    'hero.resume': 'रिज़्यूमे डाउनलोड करें', 'hero.contact': 'बात करें',
    'about.h': 'मेरे बारे में', 'about.p': 'फुल स्टैक डेवलपर से डिलीवरी लीड तक — अब SBI में सिस्टम्स में।',
    'projects.h': 'प्रोजेक्ट्स और डिलीवरी', 'projects.p': 'मैंने क्या बनाया, उसके पीछे की समस्या, और डिलीवरी में मेरी भूमिका।',
    'cred.e': 'प्रमाणपत्र', 'cred.h': 'सर्टिफ़िकेशन', 'cred.p': 'प्रोजेक्ट मैनेजमेंट और टेक्नोलॉजी में सर्टिफ़िकेशन।',
    'journey.h': 'पुंछ से SBI तक',
    'rec.e': 'सिफ़ारिशें', 'rec.h': 'लोग क्या कहते हैं', 'rec.p': 'मैनेजर्स, सहकर्मियों और क्लाइंट्स की सिफ़ारिशें।',
    'skills.h': 'तकनीकी कौशल', 'skills.p': 'टूल्स और मेरी दक्षता देखने के लिए किसी टाइल पर क्लिक करें।', 'skills.h2': 'डिलीवरी और सहयोग', 'skills.p2': 'काम की योजना, ट्रैकिंग और डिलीवरी कैसे होती है।',
    'gh.h': 'हाल का कोड', 'gh.p': 'हाल ही में अपडेट की गई पब्लिक रिपॉज़िटरी।', 'gh.all': 'GitHub पर सभी देखें →',
    'train.h': 'प्रमाणित प्रशिक्षण', 'train.p': 'चार समर प्रोग्राम जिन्होंने नींव रखी।',
    'act.e': 'गतिविधियाँ', 'act.h': 'गतिविधियाँ और सॉफ्ट स्किल्स', 'act.p': 'कक्षा से परे सीखना, और हर टीम में लाई जाने वाली आदतें।', 'act.t1': 'सह-पाठ्यक्रम गतिविधियाँ', 'act.t2': 'सॉफ्ट स्किल्स', 'act.c1': 'श्रेणी', 'act.c2': 'विषय', 'act.c3': 'आयोजक',
    'notes.e': 'नोट्स', 'notes.h': 'लेखन', 'notes.p': 'डिलीवरी, टेक्नोलॉजी और बैंकिंग पर छोटे लेख।',
    'gallery.h': 'कोड से परे', 'gallery.p': 'ज़िंदगी आँसू, मुस्कान और यादें देती है। आँसू सूख जाते हैं, मुस्कान फीकी पड़ जाती है, पर यादें हमेशा रहती हैं।',
    'quotes.h': 'कुछ पसंदीदा उद्धरण',
    'contact.h': 'आइए बात करें।', 'contact.p': 'कोई सवाल, कोई प्रोजेक्ट, या बस नमस्ते कहना है? मुझे लिखें।', 'contact.name': 'आपका नाम *', 'contact.email': 'आपका ईमेल *', 'contact.phone': 'आपका फ़ोन (वैकल्पिक)', 'contact.msg': 'आपका संदेश *', 'contact.send': 'संदेश भेजें',
    'footer.top': 'ऊपर जाएँ ↑',
    // dynamic
    'd.problem': 'समस्या', 'd.delivered': 'मैंने क्या डिलीवर किया', 'd.result': 'परिणाम', 'd.photos': 'तस्वीरें', 'd.end': 'अगली कहानी का इंतज़ार!',
    'd.preparing': 'आपका PDF तैयार हो रहा है…', 'd.ready': 'रिज़्यूमे डाउनलोड हो गया।', 'd.pdfErr': 'PDF नहीं बन सका। कृपया पेज रीफ़्रेश करके फिर कोशिश करें।',
    'd.sending': 'भेजा जा रहा है…', 'd.sent': 'धन्यवाद! आपका संदेश भेज दिया गया है। मैं जल्द ही जवाब दूँगा।',
    'd.mailOpen': 'आपका ईमेल ऐप संदेश के साथ खुल रहा है। अगर नहीं खुले, तो लिखें: ', 'd.sendErr': 'संदेश नहीं भेजा जा सका। सीधे ईमेल करें: ',
    'd.activate': 'संपर्क फ़ॉर्म अभी सेट किया जा रहा है, इसलिए संदेश नहीं भेजा जा सका। कृपया सीधे ईमेल करें:',
    'd.invalid': 'कृपया अपना नाम, सही ईमेल और संदेश भरें।', 'd.dark': 'डार्क थीम चालू करें', 'd.light': 'लाइट थीम चालू करें', 'd.lang': 'View in English',
    'd.updated': 'अपडेट'
  };
  var EN = {
    'd.problem': 'The problem', 'd.delivered': 'What I delivered', 'd.result': 'Result', 'd.photos': 'photos', 'd.end': 'Waiting for another story to happen!',
    'd.preparing': 'Preparing your PDF…', 'd.ready': 'Résumé downloaded.', 'd.pdfErr': 'Could not create the PDF. Please refresh the page and try again.',
    'd.sending': 'Sending…', 'd.sent': 'Thank you! Your message has been sent. I will get back to you soon.',
    'd.mailOpen': 'Your email app is opening with the message ready. If it does not, write to ', 'd.sendErr': 'The message could not be sent. Please email ',
    'd.activate': 'The contact form is being set up and could not send yet. Please email me directly:',
    'd.invalid': 'Please fill in your name, a valid email and a message.', 'd.dark': 'Switch to dark theme', 'd.light': 'Switch to light theme', 'd.lang': 'हिन्दी में देखें',
    'd.updated': 'Updated'
  };
  var enCache = {};
  function lang() { return root.getAttribute('lang') === 'hi' ? 'hi' : 'en'; }
  function t(k) { return lang() === 'hi' ? (HI[k] || EN[k] || k) : (EN[k] || k); }
  function applyLang() {
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!(k in enCache)) enCache[k] = el.textContent;
      el.textContent = lang() === 'hi' && HI[k] ? HI[k] : enCache[k];
    });
    var lb = $('#langBtn');
    lb.textContent = lang() === 'hi' ? 'EN' : 'हि';
    lb.setAttribute('aria-label', t('d.lang'));
    if (DATA) { renderLangDependent(); }
  }

  /* ---------- theme ---------- */
  function applyThemeLabel() {
    var dark = root.getAttribute('data-theme') === 'dark';
    $('#themeBtn').setAttribute('aria-label', dark ? t('d.light') : t('d.dark'));
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#15171C' : '#1A1A1A');
  }

  var DATA = null;

  /* ---------- renderers ---------- */
  function renderAbout(d) {
    var cls = ['c-red', 'c-teal', 'c-amber', 'c-blue'];
    var icons = { role: ICON.flag, expertise: ICON.code, contact: ICON.mail, beyond: ICON.heart };
    var bg = ['var(--red)', 'var(--teal)', 'var(--amber)', 'var(--blue)'];
    $('#aboutCards').innerHTML = d.about.map(function (c, i) {
      var side = i % 2 === 0 ? 'l' : 'r';
      var dl = c.lines.map(function (ln) {
        var v = ln[2] ? '<a href="' + esc(ln[2]) + '"' + (/^https?:/.test(ln[2]) ? ' rel="me noopener" target="_blank"' : '') + '>' + esc(ln[1]) + '</a>' : esc(ln[1]);
        return '<dt>' + esc(ln[0]) + '</dt><dd>' + v + '</dd>';
      }).join('');
      return '<div class="pi ' + side + ' reveal"><span class="cn"></span>' +
        '<span class="bd" style="background:' + bg[i % 4] + (i % 4 === 2 ? ';color:#1A1A1A' : '') + '">' + svg(icons[c.key] || ICON.star, 20, 2.2) + '</span>' +
        '<div class="pc ' + cls[i % 4] + '"><h3 data-about="' + i + '">' + esc(c.title[lang()] || c.title.en) + '</h3><dl>' + dl + '</dl></div></div>';
    }).join('');
  }

  function renderCases(d) {
    $('#cases').innerHTML = d.caseStudies.map(function (c, i) {
      return '<article class="case reveal">' +
        '<div class="case-h" style="background:' + COLORS[i % COLORS.length] + '"><small>' + esc(c.org) + ' · ' + esc(c.years) + '</small><h3>' + esc(c.title) + '</h3><small style="margin-top:6px;text-transform:none;letter-spacing:0;font-family:inherit;font-weight:700">' + esc(c.role) + '</small></div>' +
        '<div class="case-b">' +
        '<h4 data-dyn="d.problem">' + t('d.problem') + '</h4><p>' + esc(c.problem) + '</p>' +
        '<h4 data-dyn="d.delivered">' + t('d.delivered') + '</h4><ul>' + c.delivered.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        (c.outcome ? '<h4 data-dyn="d.result">' + t('d.result') + '</h4><p class="case-out">' + esc(c.outcome) + '</p>' : '') +
        '<div class="chips">' + c.stack.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div>' +
        '</div></article>';
    }).join('');
  }

  function renderCreds(d) {
    if (!d.credentials || !d.credentials.length) return;
    $('#credentials').hidden = false;
    $('#creds').innerHTML = d.credentials.map(function (c) {
      var title = c.url ? '<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.name) + '</a>' : esc(c.name);
      return '<div class="cred reveal"><span class="cred-badge">' + svg(ICON.award, 26, 2) + '</span><div><h3>' + title + '</h3><p>' + esc(c.issuer || '') + (c.year ? ' · ' + esc(c.year) : '') + '</p>' + (c.status ? '<span class="tag">' + esc(c.status) + '</span>' : '') + '</div></div>';
    }).join('');
  }

  function renderRecs(d) {
    if (!d.recommendations || !d.recommendations.length) return;
    $('#recommendations').hidden = false;
    $('#recs').innerHTML = d.recommendations.map(function (r) {
      return '<figure class="rec reveal"><blockquote>“' + esc(r.text) + '”</blockquote><figcaption>' + esc(r.name) + '<span>' + esc(r.title || '') + (r.relation ? ' · ' + esc(r.relation) : '') + '</span></figcaption></figure>';
    }).join('');
  }

  function renderTimeline(d) {
    var items = [];
    d.education.slice().reverse().forEach(function (e) {
      items.push({ yr: e.years, title: e.title, body: '<strong>' + esc(e.place) + '</strong><br>' + esc(e.detail), photo: e.photo, icon: e.icon, alt: e.place });
    });
    d.experience.slice().reverse().forEach(function (x, idx, arr) {
      items.push({ yr: x.start + ' – ' + x.end, title: x.title, body: '<strong>' + esc(x.org) + '</strong>' + (x.location ? ', ' + esc(x.location) : '') + '<br>' + esc(x.summary) + (x.stack ? '<br>' + esc(x.stack) : ''), photo: x.photo, alt: x.org, now: idx === arr.length - 1 });
    });
    var iconBg = ['#1F4E79', '#0E8F7E'];
    var html = items.map(function (it, i) {
      var circle = it.photo
        ? '<div class="tc' + (it.now ? ' now' : '') + '"><img src="' + photo(it.photo, 400) + '" alt="' + esc(it.alt) + '" loading="lazy" width="160" height="160"></div>'
        : '<div class="tc" style="background:' + iconBg[i % 2] + '">' + svg(ICON[it.icon] || ICON.cap, 56, 1.8) + '</div>';
      return '<li class="tr ' + (i % 2 === 0 ? 'a' : 'b') + ' reveal">' + circle + '<div class="tt"><p class="yr">' + esc(it.yr) + '</p><h3>' + esc(it.title) + '</h3><p>' + it.body + '</p></div></li>';
    });
    html.push('<li class="tr ' + (items.length % 2 === 0 ? 'a' : 'b') + ' reveal" style="margin-bottom:0"><div class="tc end" data-dyn="d.end">' + t('d.end') + '</div></li>');
    $('#timeline').innerHTML = html.join('');
  }

  var LV = { vg: [3, 'Very good'], g: [2, 'Good'], f: [1, 'Familiar'], a: [1, 'Average'], l: [1, 'Learning'], e: [3, 'Integrated'] };
  var tileIndex = [];
  function renderTiles(list, el, offset) {
    el.innerHTML = list.map(function (g, i) {
      var color = COLORS[(i + offset) % COLORS.length];
      var idx = tileIndex.push({ g: g, color: color }) - 1;
      var names = g.items.map(function (x) { return x[0]; });
      var pv = names.slice(0, 3).join(' · ') + (names.length > 3 ? ' +' + (names.length - 3) : '');
      return '<button type="button" class="tile reveal" data-tile="' + idx + '" aria-haspopup="dialog"><span class="tic" style="background:' + color + '">' + svg(ICON[g.icon] || ICON.code, 32, 1.9) + '</span><b>' + esc(g.title) + '</b><span class="pv">' + esc(pv) + '</span></button>';
    }).join('');
  }
  function openSkill(idx, opener) {
    var x = tileIndex[idx]; if (!x) return;
    var dlg = $('#skillDlg');
    $('#skHead').style.background = x.color;
    $('#skIcon').setAttribute('d', ICON[x.g.icon] || ICON.code);
    $('#skTitle').textContent = x.g.title;
    $('#skBlurb').textContent = x.g.blurb || '';
    $('#skItems').innerHTML = x.g.items.map(function (it) {
      var lv = LV[it[1]] || LV.f;
      var bars = [1, 2, 3].map(function (n) { return '<i' + (n <= lv[0] ? ' style="background:' + x.color + '"' : '') + '></i>'; }).join('');
      return '<li><span style="font-weight:700">' + esc(it[0]) + '</span><span class="lvl" role="img" aria-label="' + esc(lv[1]) + '">' + bars + '</span><small>' + esc(lv[1]) + '</small></li>';
    }).join('');
    dlg._opener = opener;
    dlg.showModal();
  }

  function renderTrainings(d) {
    var heads = [['var(--red)', '#FFFFFF'], ['var(--teal)', '#FFFFFF'], ['var(--amber)', '#1A1A1A'], ['var(--blue)', '#FFFFFF']];
    $('#trains').innerHTML = d.trainings.map(function (x, i) {
      var h = heads[i % 4];
      return '<article class="train reveal"><div class="train-h" style="background:' + h[0] + ';color:' + h[1] + '"><span>' + esc(x.year) + '</span><h3>' + esc(x.title) + '</h3></div>' +
        '<div class="train-b"><p><strong>Duration:</strong> ' + esc(x.duration) + '</p><p><strong>Dates:</strong> ' + esc(x.dates) + '</p><p><strong>Institute:</strong> ' + esc(x.institute) + '</p>' +
        '<span class="tag' + (/robomq/i.test(x.tag) ? ' hot' : '') + '">' + esc(x.tag) + '</span></div></article>';
    }).join('');
  }

  function renderActivities(d) {
    $('#actRows').innerHTML = d.activities.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('');
    $('#panel-soft').innerHTML = d.softSkills.map(function (s, i) {
      return '<div class="soft"><i style="background:' + COLORS[i % COLORS.length] + '">' + svg('M5 12l5 5 9-10', 16, 3) + '</i><span>' + esc(s) + '</span></div>';
    }).join('');
  }

  function renderNotes(d) {
    if (!d.notes || !d.notes.length) return;
    $('#notes').hidden = false;
    $('#notesList').innerHTML = d.notes.map(function (n) {
      return '<a class="note reveal" href="' + esc(n.url) + '"><small>' + esc(n.date) + '</small><b>' + esc(n.title) + '</b><p>' + esc(n.summary || '') + '</p></a>';
    }).join('');
  }

  var ALBUMS = [];
  function renderAlbums(d) {
    ALBUMS = d.albums.map(function (a) {
      return { title: a.title, caption: a.caption, alt: a.alt, photos: a.photos.filter(function (p) { return p.show !== false; }) };
    }).filter(function (a) { return a.photos.length; });
    $('#albums').innerHTML = ALBUMS.map(function (a, i) {
      var cover = a.photos[0].file;
      return '<button type="button" class="gc reveal" data-album="' + i + '" aria-haspopup="dialog" aria-label="Open ' + esc(a.title) + ' album, ' + a.photos.length + ' photos">' +
        '<span class="gi"><img src="' + photo(cover, 800) + '" srcset="' + srcset(cover) + '" sizes="(max-width: 700px) 100vw, 380px" alt="' + esc(a.alt) + '" loading="lazy" width="800" height="550">' +
        '<span class="go"><span class="gp">' + svg('M12 5v14M5 12h14', 26, 2.6) + '</span></span>' +
        '<span class="gn">' + a.photos.length + ' <span data-dyn="d.photos">' + t('d.photos') + '</span></span></span>' +
        '<span class="gt"><b>' + esc(a.title) + '</b><span>' + esc(a.caption) + '</span></span></button>';
    }).join('');
  }

  var lbState = { a: 0, i: 0 };
  function lbShow() {
    var a = ALBUMS[lbState.a]; var n = a.photos.length;
    var p = a.photos[lbState.i];
    var img = $('#lbImg');
    img.src = photo(p.file, 1600);
    img.srcset = srcset(p.file);
    img.sizes = '100vw';
    img.alt = a.alt + ' (' + (lbState.i + 1) + ' of ' + n + ')';
    $('#lbCap').textContent = p.caption || '';
    $('#lbAlbum').textContent = a.title;
    $('#lbPos').textContent = (lbState.i + 1) + ' / ' + n;
    $$('#lbThumbs button').forEach(function (b, k) { b.setAttribute('aria-current', k === lbState.i ? 'true' : 'false'); });
    var cur = $('#lbThumbs button[aria-current="true"]');
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    // preload neighbours
    [1, -1].forEach(function (dlt) { var q = a.photos[(lbState.i + dlt + n) % n]; var im = new Image(); im.src = photo(q.file, 1600); });
  }
  function lbOpen(ai, opener) {
    lbState = { a: ai, i: 0 };
    var a = ALBUMS[ai];
    $('#lbThumbs').innerHTML = a.photos.map(function (p, k) {
      return '<button type="button" data-k="' + k + '" aria-label="Show photo ' + (k + 1) + '"><img src="' + photo(p.file, 400) + '" alt="" loading="lazy"></button>';
    }).join('');
    var dlg = $('#lightbox'); dlg._opener = opener;
    dlg.showModal(); lbShow();
    $('#lbNext').focus();
  }
  function lbStep(dlt) { var n = ALBUMS[lbState.a].photos.length; lbState.i = (lbState.i + dlt + n) % n; lbShow(); }

  var qi = 0, qTimer = null;
  function renderQuote() {
    var q = DATA.quotes[qi];
    $('#qText').textContent = '“' + q.text + '”';
    $('#qBy').textContent = '— ' + q.by;
    $$('#qDots button').forEach(function (b, k) { b.setAttribute('aria-current', k === qi ? 'true' : 'false'); });
  }
  function qGo(k, manual) {
    var n = DATA.quotes.length; qi = (k + n) % n;
    $('.q-fig').setAttribute('aria-live', manual ? 'polite' : 'off');
    renderQuote();
  }
  function qAuto(on) {
    clearInterval(qTimer); qTimer = null;
    if (on && !reduceMotion) qTimer = setInterval(function () { qGo(qi + 1, false); }, 8000);
  }

  function renderSocials(d) {
    var L = d.person.links;
    var items = [
      [L.linkedin, 'LinkedIn', '<span>in</span>'],
      [L.github, 'GitHub', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4 1.5-4-2-6-2.5M15 22v-3.5a3 3 0 0 0-.9-2.4c3-.3 6.1-1.5 6.1-6.6a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.6 12.6 0 0 0-6.6 0C5.8 1.9 4.7 2.2 4.7 2.2a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 3.2 9.4c0 5.1 3.1 6.3 6.1 6.6a3 3 0 0 0-.9 2.4V22"/></svg>'],
      [L.stackoverflow, 'Stack Overflow', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15v5h14v-5M8 17h6M8.5 13.5l6 1.3M9.5 9.8l5.6 2.6M11.5 6.3l4.7 4M15 3l3.4 5"/></svg>'],
      [L.instagram, 'Instagram', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.01"/></svg>'],
      [L.facebook, 'Facebook', '<span>f</span>'],
      [L.twitter, 'X (Twitter)', '<span>X</span>']
    ].filter(function (x) { return x[0]; });
    $('#socials').innerHTML = items.map(function (x) { return '<a class="soc" href="' + esc(x[0]) + '" target="_blank" rel="me noopener" aria-label="' + x[1] + '">' + x[2] + '</a>'; }).join('');
  }

  function renderLangDependent() {
    $('#heroProfile').textContent = DATA.profile[lang()] || DATA.profile.en;
    $$('[data-dyn]').forEach(function (el) { el.textContent = t(el.getAttribute('data-dyn')); });
    $$('[data-about]').forEach(function (el) { var c = DATA.about[+el.getAttribute('data-about')]; el.textContent = c.title[lang()] || c.title.en; });
    applyThemeLabel();
  }

  /* ---------- GitHub ---------- */
  function loadRepos(d) {
    var user = d.site.githubUser; if (!user) return;
    var key = 'gh:' + user, cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) {}
    var show = function (repos) {
      var hide = (d.site.githubHide || []).map(function (n) { return String(n).toLowerCase(); });
      var only = (d.site.githubShowOnly || []).map(function (n) { return String(n).toLowerCase(); });
      repos = repos.filter(function (r) {
        var n = r.name.toLowerCase();
        if (only.length) return only.indexOf(n) > -1;
        return !r.fork && !r.archived && hide.indexOf(n) === -1;
      })
        .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); })
        .slice(0, d.site.githubRepoCount || 6);
      if (!repos.length) return;
      $('#ghAll').href = 'https://github.com/' + encodeURIComponent(user) + '?tab=repositories';
      $('#repos').innerHTML = repos.map(function (r) {
        var dt = new Date(r.pushed_at);
        var when = dt.toLocaleDateString(lang() === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short', year: 'numeric' });
        return '<a class="repo" href="' + esc(r.html_url) + '" target="_blank" rel="noopener"><b>' + esc(r.name) + '</b><p>' + esc(r.description || '') + '</p>' +
          '<small>' + (r.language ? '<span>' + esc(r.language) + '</span>' : '') + (r.stargazers_count ? '<span>★ ' + r.stargazers_count + '</span>' : '') + '<span>' + t('d.updated') + ' ' + esc(when) + '</span></small></a>';
      }).join('');
      $('#code').hidden = false;
    };
    if (cached) { show(cached); return; }
    fetch('https://api.github.com/users/' + encodeURIComponent(user) + '/repos?per_page=100&sort=pushed', { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (repos) {
        var slim = repos.map(function (r) { return { name: r.name, description: r.description, html_url: r.html_url, language: r.language, stargazers_count: r.stargazers_count, pushed_at: r.pushed_at, fork: r.fork, archived: r.archived }; });
        try { sessionStorage.setItem(key, JSON.stringify(slim)); } catch (e) {}
        show(slim);
      })
      .catch(function () { /* section stays hidden */ });
  }

  /* ---------- contact ---------- */
  function initForm(d) {
    var form = $('#contactForm'), status = $('#formStatus'), btn = $('#sendBtn');
    var email = d.person.email;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = form.elements;
      var vals = { name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), message: f.message.value.trim() };
      var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email);
      f.name.setAttribute('aria-invalid', vals.name ? 'false' : 'true');
      f.email.setAttribute('aria-invalid', okEmail ? 'false' : 'true');
      f.message.setAttribute('aria-invalid', vals.message ? 'false' : 'true');
      status.className = 'cf-status';
      if (!vals.name || !okEmail || !vals.message) { status.className = 'cf-status err'; status.textContent = t('d.invalid'); return; }
      if (f._honey.value) { status.className = 'cf-status ok'; status.textContent = t('d.sent'); form.reset(); return; }

      var subject = 'New message from ' + vals.name + ' via zerotoinfy.github.io';
      var body = vals.message + '\n\n— ' + vals.name + '\n' + vals.email + (vals.phone ? '\n' + vals.phone : '');
      var mailto = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var mailLink = '<a href="' + esc(mailto) + '">' + esc(email) + '</a>';

      if (!d.site.formsubmitId) {
        window.location.href = mailto;
        status.innerHTML = esc(t('d.mailOpen')) + mailLink;
        return;
      }
      btn.disabled = true; status.textContent = t('d.sending');
      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(d.site.formsubmitId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: vals.name, email: vals.email, phone: vals.phone, message: vals.message, _subject: subject, _template: 'table', _captcha: 'false', _honey: '' })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok || String(j.success) !== 'true') { var e = new Error('fail'); e.info = String(j.message || ''); throw e; }
        }); })
        .then(function () { status.className = 'cf-status ok'; status.textContent = t('d.sent'); form.reset(); })
        .catch(function (e) {
          var info = (e && e.info) || '';
          if (window.console) console.warn('FormSubmit:', info || e);
          status.className = 'cf-status err';
          // Before the one-time activation, FormSubmit replies "This form needs Activation…" — show that so the owner knows what to do.
          if (/activat/i.test(info)) { status.innerHTML = esc(t('d.activate')) + ' ' + mailLink; return; }
          status.innerHTML = esc(t('d.sendErr')) + mailLink;
        })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- résumé PDF (generated in the browser) ---------- */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  function buildResume(d) {
    var P = d.person, GOLD = '#FED136', INK = '#1A1A1A', MUTED = '#4B5563', ACC = '#8A6A00';
    var H = function (txt) { return { text: txt.toUpperCase(), style: 'h', margin: [0, 12, 0, 6] }; };
    var expBlocks = [];
    d.experience.forEach(function (x) {
      expBlocks.push({ columns: [{ text: x.title, bold: true, fontSize: 11 }, { text: x.start + ' – ' + x.end, width: 'auto', fontSize: 9, color: MUTED, margin: [0, 1, 0, 0] }], margin: [0, 6, 0, 0] });
      expBlocks.push({ text: x.org + (x.location ? ', ' + x.location : ''), fontSize: 10, color: '#2B3240', margin: [0, 1, 0, 3] });
      expBlocks.push({ ul: x.bullets, fontSize: 9.5, color: '#2B3240', margin: [0, 0, 0, 2] });
    });
    var group = function (title, items) { return { text: [{ text: title + '\n', bold: true }, { text: items.join(', '), color: '#2B3240' }], fontSize: 9, margin: [0, 0, 0, 6] }; };
    var pick = function (list, names) {
      return list.filter(function (g) { return names.indexOf(g.title) > -1; }).map(function (g) {
        return group(g.title, g.items.filter(function (i) { return i[1] !== 'l'; }).map(function (i) { return i[0]; }));
      });
    };
    var skills = pick(d.skills.technical, ['Core Programming', 'Frameworks', 'Databases', 'Cloud & Infrastructure', 'Testing Tools']).concat(pick(d.skills.nonTechnical, ['Project Delivery']));
    var edu = d.education.map(function (e) { return { text: [{ text: e.short + '\n', bold: true }, { text: e.place + '\n', color: '#2B3240' }, { text: e.years + ' · ' + e.detail.split('·').pop().trim(), color: MUTED }], fontSize: 9, margin: [0, 0, 0, 6] }; });
    var side = [H('Skills')].concat(skills, [H('Education')], edu,
      [H('Training'), { text: d.trainings.map(function (x) { return x.title + ' (' + x.year + ')'; }).join(' · '), fontSize: 9, color: '#2B3240' }],
      [H('Languages'), { text: 'English, Hindi, Urdu, Punjabi', fontSize: 9, color: '#2B3240' }]);
    if (d.credentials && d.credentials.length) {
      side.push(H('Credentials'));
      d.credentials.forEach(function (c) { side.push({ text: c.name + (c.year ? ' (' + c.year + ')' : '') + (c.status ? ' — ' + c.status : ''), fontSize: 9, color: '#2B3240', margin: [0, 0, 0, 3] }); });
    }
    var main = [H('Profile'), { text: d.profile.en, fontSize: 10, color: '#2B3240', lineHeight: 1.25 }, H('Experience')].concat(expBlocks);
    var withOutcome = d.caseStudies.filter(function (c) { return c.outcome; });
    if (withOutcome.length) {
      main.push(H('Selected results'));
      main.push({ ul: withOutcome.map(function (c) { return c.title + ': ' + c.outcome; }), fontSize: 9.5, color: '#2B3240' });
    }
    return {
      pageSize: 'A4', pageMargins: [40, 36, 40, 40],
      info: { title: P.name + ' — Résumé', author: P.name, subject: P.role + ', ' + P.org },
      footer: function (cur, total) { return { text: 'zerotoinfy.github.io · ' + cur + '/' + total, alignment: 'center', fontSize: 8, color: MUTED }; },
      content: [
        { columns: [
          [{ text: P.name, fontSize: 24, bold: true, color: INK }, { text: P.role + ' · ' + P.org, fontSize: 12, bold: true, color: ACC, margin: [0, 2, 0, 2] }, { text: 'Project management & delivery · Java · Spring Boot · Angular · Microservices · Cloud', fontSize: 9, color: MUTED }],
          { width: 'auto', alignment: 'right', fontSize: 9, color: '#2B3240', stack: [
            { text: P.email, link: 'mailto:' + P.email }, P.resumePhone || '', P.location,
            { text: 'LinkedIn: imtiaz-choudhary', link: P.links.linkedin }, { text: 'zerotoinfy.github.io', link: d.site.url }
          ] }
        ] },
        { canvas: [{ type: 'rect', x: 0, y: 8, w: 515, h: 3, color: GOLD }], margin: [0, 0, 0, 4] },
        { columns: [{ width: '*', stack: main }, { width: 160, stack: side }], columnGap: 22 }
      ],
      styles: { h: { fontSize: 10, bold: true, color: ACC, characterSpacing: 1 } },
      defaultStyle: { font: 'Roboto', lineHeight: 1.15 }
    };
  }
  function initResume(d) {
    var btn = $('#resumeBtn'), st = $('#resumeStatus');
    btn.addEventListener('click', function () {
      btn.disabled = true; st.textContent = t('d.preparing');
      var ready = window.pdfMake && window.pdfMake.vfs ? Promise.resolve() :
        loadScript('assets/lib/pdfmake.min.js').then(function () { return loadScript('assets/lib/vfs_fonts.js'); });
      ready.then(function () {
        window.pdfMake.createPdf(buildResume(d)).download('Imtiaz-Hussain-Resume.pdf', function () { st.textContent = t('d.ready'); });
        setTimeout(function () { if (st.textContent === t('d.preparing')) st.textContent = t('d.ready'); }, 2500);
      }).catch(function () { st.textContent = t('d.pdfErr'); })
        .then(function () { btn.disabled = false; });
      if (window.goatcounter && window.goatcounter.count) { try { window.goatcounter.count({ path: 'resume-download', title: 'Résumé download', event: true }); } catch (e) {} }
    });
  }

  /* ---------- page behaviour ---------- */
  function initReveal() {
    var els = $$('.reveal:not(.in)');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  function initSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = $$('.nl');
    var map = {}; links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
          map[en.target.id].classList.add('active'); map[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  function init(d) {
    DATA = d;
    renderAbout(d); renderCases(d); renderCreds(d); renderRecs(d); renderTimeline(d);
    renderTiles(d.skills.technical, $('#techTiles'), 0);
    renderTiles(d.skills.nonTechnical, $('#softTiles'), 3);
    renderTrainings(d); renderActivities(d); renderNotes(d); renderAlbums(d); renderSocials(d);
    $('#qDots').innerHTML = d.quotes.map(function (q, k) { return '<button type="button" aria-label="Show quote ' + (k + 1) + '"></button>'; }).join('');
    renderQuote(); qAuto(true);
    renderLangDependent();
    initForm(d); initResume(d); loadRepos(d);
    initReveal(); initSpy();

    if (d.site.whatsappNumber) {
      var wa = $('#waBtn'); wa.href = 'https://wa.me/' + String(d.site.whatsappNumber).replace(/\D/g, ''); wa.target = '_blank'; wa.rel = 'noopener'; wa.hidden = false;
    }
    if (d.site.goatcounterCode) {
      var s = document.createElement('script'); s.async = true; s.src = 'https://gc.zgo.at/count.js';
      s.setAttribute('data-goatcounter', 'https://' + d.site.goatcounterCode + '.goatcounter.com/count');
      document.body.appendChild(s);
    }
  }

  /* ---------- static wiring (works before data loads) ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('#year').textContent = new Date().getFullYear();
    applyThemeLabel();

    $('#themeBtn').addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') !== 'dark';
      root.setAttribute('data-theme', dark ? 'dark' : 'light'); store.set('theme', dark ? 'dark' : 'light'); applyThemeLabel();
    });
    $('#langBtn').addEventListener('click', function () {
      root.setAttribute('lang', lang() === 'hi' ? 'en' : 'hi'); store.set('lang', lang()); applyLang();
    });
    if (lang() === 'hi') applyLang(); else { $('#langBtn').setAttribute('aria-label', t('d.lang')); }

    var menu = $('.nav-menu'), links = $('#nav-links');
    menu.addEventListener('click', function () { var o = links.classList.toggle('open'); menu.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    links.addEventListener('click', function (e) { if (e.target.closest('.nl')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });

    var toTop = $('#toTop');
    window.addEventListener('scroll', function () { toTop.hidden = window.scrollY < 900; }, { passive: true });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); $('.brand').focus(); });

    // tabs
    var tabs = $$('.tab');
    function selectTab(tab) {
      tabs.forEach(function (x) { var on = x === tab; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
      tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); selectTab(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]); }
      });
    });

    // skill tiles + albums (event delegation)
    document.addEventListener('click', function (e) {
      var tile = e.target.closest('[data-tile]'); if (tile) { openSkill(+tile.getAttribute('data-tile'), tile); return; }
      var alb = e.target.closest('[data-album]'); if (alb) { lbOpen(+alb.getAttribute('data-album'), alb); }
    });

    // dialogs: return focus, close on backdrop click
    [$('#skillDlg'), $('#lightbox')].forEach(function (dlg) {
      dlg.addEventListener('close', function () { if (dlg._opener) dlg._opener.focus(); });
    });
    $('#skillDlg').addEventListener('click', function (e) { if (e.target === this) this.close(); });
    $('#skClose').addEventListener('click', function () { $('#skillDlg').close(); });

    var lb = $('#lightbox');
    $('#lbClose').addEventListener('click', function () { lb.close(); });
    $('#lbPrev').addEventListener('click', function () { lbStep(-1); });
    $('#lbNext').addEventListener('click', function () { lbStep(1); });
    $('#lbStage').addEventListener('click', function (e) { if (e.target === this) lb.close(); });
    $('#lbThumbs').addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (b) { lbState.i = +b.getAttribute('data-k'); lbShow(); } });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); lbStep(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); lbStep(-1); }
      else if (e.key === 'Home') { e.preventDefault(); lbState.i = 0; lbShow(); }
      else if (e.key === 'End') { e.preventDefault(); lbState.i = ALBUMS[lbState.a].photos.length - 1; lbShow(); }
    });
    var tx = null;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
    }, { passive: true });

    // quotes
    $('#qPrev').addEventListener('click', function () { qGo(qi - 1, true); qAuto(false); });
    $('#qNext').addEventListener('click', function () { qGo(qi + 1, true); qAuto(false); });
    $('#qDots').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; qGo($$('#qDots button').indexOf(b), true); qAuto(false); });
    var qs = $('.quotes');
    qs.addEventListener('mouseenter', function () { qAuto(false); });
    qs.addEventListener('focusin', function () { qAuto(false); });

    fetch('data/profile.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(init)
      .catch(function (err) { console.error('Could not load data/profile.json', err); });
  });
})();
