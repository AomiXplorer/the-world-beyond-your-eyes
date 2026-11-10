/* ============================================================
   Dialogue engine: beat interpreter, typewriter, choices,
   scene state, autosave, endings.
   ============================================================ */
(function () {
  'use strict';

  var E = {};

  var SPEAKERS = {
    'Ren':    { id: 'ren',    color: '#8fa7bb' },
    'Shiori': { id: 'shiori', color: '#b1493c' },
    'Mio':    { id: 'mio',    color: '#a3803f' },
    'Gadis itu': { id: 'shiori', color: '#b1493c' },
    'Perempuan itu': { id: 'shiori', color: '#b1493c' },
    'Pemilik kafe': { id: null, color: '#8d8272' },
    'Ibu Shiori': { id: null, color: '#8d8272' },
    'Suara di telepon': { id: null, color: '#8d8272' }
  };

  var TYPE_SPEED = [90, 52, 34, 22, 12];   // chars per frame-ish steps mapped from settings
  var state = null;
  var chapter = null;
  var labels = null;
  var busy = false;          // waiting on a timer / transition
  var typing = false;        // typewriter running
  var fullText = '';
  var shownChars = 0;
  var typeTimer = null;
  var autoTimer = null;
  var autoOn = false;
  var skipOn = false;
  var seenMap = {};
  var activeChoice = null;
  var pendingLineKey = null;
  var ended = false;

  var el = {};
  function $(id) { return document.getElementById(id); }

  function cacheDom() {
    el.bgA = $('bg-a'); el.bgB = $('bg-b');
    el.rain = $('bg-rain');
    el.sprites = document.querySelectorAll('.sprite-slot');
    el.dialogBox = $('dialog-box');
    el.dialogText = $('dialog-text');
    el.nameTag = $('name-tag');
    el.nameText = $('name-text');
    el.nextMark = $('next-mark');
    el.choices = $('choices');
    el.veil = $('veil');
    el.flash = $('flash');
    el.hudChapter = $('hud-chapter');
    el.hudTitle = $('hud-title');
    el.card = $('chapter-card');
    el.ccNo = $('cc-no'); el.ccTitle = $('cc-title'); el.ccSub = $('cc-sub');
    el.ending = $('ending-card');
    el.ecKicker = $('ec-kicker'); el.ecTitle = $('ec-title'); el.ecSub = $('ec-sub'); el.ecStats = $('ec-stats');
  }

  function freshState() {
    return {
      ch: null, pc: 0,
      bond: 0, trust: 0,
      flags: {},
      bg: null, bgm: null, amb: null, rain: false,
      sprites: { left: null, center: null, right: null },
      history: [],
      lines: 0,
      startedAt: Date.now()
    };
  }

  function getChapter(id) {
    for (var i = 0; i < VN.chapters.length; i++) {
      if (VN.chapters[i].id === id) return VN.chapters[i];
    }
    return null;
  }

  function buildLabels(ch) {
    var map = {};
    ch.beats.forEach(function (b, i) {
      if (b && typeof b.label === 'string') map[b.label] = i;
    });
    return map;
  }

  /* ------------------------------ scenes ------------------------------ */
  var bgFront = 'a';

  function applyBg(key, opts) {
    opts = opts || {};
    if (!key || state.bg === key) {
      if (key && VN.BG[key]) paintBg(key);
      return;
    }
    state.bg = key;
    paintBg(key);
  }

  function paintBg(key) {
    var path = VN.BG[key];
    if (!path) { console.warn('[engine] missing bg', key); return; }
    var front = bgFront === 'a' ? el.bgB : el.bgA;
    var back = bgFront === 'a' ? el.bgA : el.bgB;
    front.style.backgroundImage = 'url("' + VN.ASSET + path + '")';
    front.classList.add('is-on');
    back.classList.remove('is-on');
    bgFront = bgFront === 'a' ? 'b' : 'a';
    refreshRain();
  }

  function rainAllowed() {
    return !!state.rain &&
      !!(VN.RAIN_BG && VN.RAIN_BG[state.bg]) &&
      !document.body.classList.contains('reduce-motion');
  }

  function refreshRain() {
    if (el.rain) el.rain.classList.toggle('is-on', rainAllowed());
  }

  function setRain(on) {
    state.rain = !!on;
    refreshRain();
  }

  function slotFor(id) {
    var s = state.sprites;
    for (var k in s) if (s[k] && s[k].id === id) return k;
    return null;
  }

  function showSprite(id, expression, pos) {
    if (!VN.SPR[id]) { console.warn('[engine] unknown sprite', id); return; }
    pos = pos || 'center';
    var existing = slotFor(id);
    if (existing) {
      state.sprites[existing] = { id: id, e: expression || 'neutral' };
      renderSprites();
      return;
    }
    // free slot? clear whatever is there
    state.sprites[pos] = { id: id, e: expression || 'neutral' };
    renderSprites();
  }

  function hideSprite(id) {
    var slot = slotFor(id);
    if (slot) { state.sprites[slot] = null; renderSprites(); }
  }

  function hideAll() {
    state.sprites = { left: null, center: null, right: null };
    renderSprites();
  }

  function setExpr(id, expression) {
    var slot = slotFor(id);
    if (!slot) return;
    state.sprites[slot].e = expression;
    renderSprites();
  }

  function renderSprites(speakerId) {
    el.sprites.forEach(function (slotEl) {
      var pos = slotEl.getAttribute('data-pos');
      var data = state.sprites[pos];
      if (!data) {
        if (slotEl.classList.contains('is-in')) {
          slotEl.classList.remove('is-in');
          window.setTimeout(function () {
            if (!state.sprites[pos]) { var old = slotEl.querySelector('img'); if (old) old.remove(); }
          }, 640);
        }
        return;
      }
      var path = VN.SPR[data.id] && VN.SPR[data.id][data.e];
      if (!path) {
        path = VN.SPR[data.id] && VN.SPR[data.id].neutral;
        if (!path) return;
      }
      var img = slotEl.querySelector('img');
      var src = VN.ASSET + path;
      if (!img) {
        img = document.createElement('img');
        img.decoding = 'async';
        img.alt = '';
        img.src = src;
        slotEl.appendChild(img);
        slotEl.classList.add('is-in');
      } else if (img.getAttribute('src') !== src) {
        img.classList.add('is-swapping');
        var next = new Image();
        var capturedPath = src;
        next.onload = function () {
          if (img.getAttribute('src') === capturedPath || !img.getAttribute('src')) {}
          img.src = capturedPath;
          window.requestAnimationFrame(function () { img.classList.remove('is-swapping'); });
        };
        next.onerror = function () { img.classList.remove('is-swapping'); };
        next.src = src;
        // fall back quickly if the image is already cached
        if (next.complete) { img.src = src; img.classList.remove('is-swapping'); }
      }
      slotEl.classList.add('is-in');
      slotEl.classList.toggle('is-dim', !!(speakerId && data.id !== speakerId));
      slotEl.classList.toggle('is-talk', !!(speakerId && data.id === speakerId));
    });
  }

  /* ---------------------------- typewriter ---------------------------- */
  function speedMs() {
    var s = VN.Save.getSettings();
    var v = s.textSpeed; // 0..100
    // 0 = instant-ish slow, 100 = fast
    return Math.round(38 - (v / 100) * 32); // 38ms .. 6ms per char
  }

  function typeOut(text, onDone) {
    fullText = text;
    shownChars = 0;
    typing = true;
    el.dialogText.textContent = '';
    if (el.nextMark) el.nextMark.classList.remove('is-on');
    var per = speedMs();
    if (VN.Save.getSettings().textSpeed >= 99 || skipOn) per = 1;

    var i = 0;
    function tick() {
      if (!typing) return;
      // reveal a few chars per frame for long text so it never drags
      var step = fullText.length > 140 ? 2 : 1;
      i = Math.min(fullText.length, i + step);
      el.dialogText.textContent = fullText.slice(0, i);
      shownChars = i;
      if (i >= fullText.length) {
        finishType(onDone);
        return;
      }
      typeTimer = window.setTimeout(tick, per);
    }
    tick();
  }

  function finishType(onDone) {
    if (!typing) { if (onDone) onDone(); return; }
    typing = false;
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    el.dialogText.textContent = fullText;
    if (el.nextMark) el.nextMark.classList.add('is-on');
    if (onDone) onDone();
  }

  E.completeTyping = function () {
    if (!typing) return false;
    finishType(function () { scheduleAuto(); });
    return true;
  };

  E.isTyping = function () { return typing; };

  /* ------------------------------- auto ------------------------------- */
  function clearAuto() { if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; } }

  function scheduleAuto() {
    clearAuto();
    if (!autoOn || typing) return;
    var s = VN.Save.getSettings();
    var base = 1500 + (fullText.length * 26);
    var scale = 0.6 + (100 - s.autoDelay) / 100 * 1.5; // delay slider
    autoTimer = window.setTimeout(function () {
      if (autoOn && !typing) E.advance();
    }, Math.round(base * scale));
  }

  E.setAuto = function (on) {
    autoOn = !!on;
    if (autoOn) { scheduleAuto(); } else { clearAuto(); }
    if (VN.UI && VN.UI.syncToggles) VN.UI.syncToggles();
  };

  E.setSkip = function (on) {
    skipOn = !!on;
    if (skipOn) skipLoop();
    if (VN.UI && VN.UI.syncToggles) VN.UI.syncToggles();
  };

  function skipLoop() {
    if (!skipOn) return;
    if (typing) { finishType(); }
    var key = pendingLineKey;
    if (key && !seenMap[key]) { E.setSkip(false); toast('Skip berhenti: teks baru'); return; }
    if (activeChoice) { E.setSkip(false); return; }
    window.setTimeout(function () { if (skipOn) E.advance(); }, 42);
  }

  E.isAuto = function () { return autoOn; };
  E.isSkip = function () { return skipOn; };

  /* ------------------------------ helpers ------------------------------ */
  function toast(msg) {
    if (VN.UI && VN.UI.toast) VN.UI.toast(msg);
  }

  function lineKey() { return (state.ch || '') + ':' + state.pc; }

  function pushHistory(who, text, voice) {
    state.history.push({ w: who || null, t: text, v: voice || null });
    if (state.history.length > 220) state.history.shift();
    state.lines++;
    if (VN.UI && VN.UI.onLine) VN.UI.onLine(state.history[state.history.length - 1], state.history);
  }

  function markSeen(key) {
    if (!seenMap[key]) {
      seenMap[key] = 1;
      VN.Save.setMeta('seen', seenMap);
    }
  }

  /* ------------------------------- flow ------------------------------- */
  function jump(label) {
    if (labels && typeof labels[label] === 'number') {
      state.pc = labels[label];
      return true;
    }
    console.warn('[engine] missing label', label);
    return false;
  }

  function applySet(beat) {
    if (beat.bp) state.bond = Math.max(0, Math.min(100, state.bond + beat.bp));
    if (beat.tp) state.trust = Math.max(0, Math.min(100, state.trust + beat.tp));
    if (beat.flags) {
      for (var k in beat.flags) state.flags[k] = beat.flags[k];
    }
    if (beat.unset) {
      for (var j = 0; j < beat.unset.length; j++) delete state.flags[beat.unset[j]];
    }
    if (beat.unlock && VN.UI && VN.UI.unlockGallery) VN.UI.unlockGallery(beat.unlock);
  }

  function run() {
    busy = false;
    var guard = 0;
    while (guard++ < 4000) {
      var beat = chapter.beats[state.pc];
      if (!beat) { E.endOfChapter(); return; }

      // ---- structural ----
      if (typeof beat.label === 'string' && Object.keys(beat).length === 1) { state.pc++; continue; }

      if (beat.set || beat.bp !== undefined || beat.tp !== undefined || beat.flags || beat.unlock) {
        applySet(beat);
        if (beat.t === undefined && beat.w === undefined && !beat.choice && beat.bg === undefined) { state.pc++; continue; }
      }

      if (beat.go) {
        if (beat.if === undefined || beat.if(state)) { jump(beat.go); continue; }
        state.pc++; continue;
      }
      if (beat.if && !beat.go) {
        if (beat.if(state)) { state.pc++; } else { state.pc++; }
        continue;
      }

      // ---- visuals ----
      var visual = false;
      if (beat.bg !== undefined) {
        if (beat.veil) { veilTransition(beat.bg, beat.rain); return; }
        applyBg(beat.bg);
        if (beat.rain !== undefined) setRain(beat.rain);
        visual = true;
      } else if (beat.rain !== undefined) { setRain(beat.rain); visual = true; }

      if (beat.b !== undefined) {
        if (beat.b === null) VN.Audio.stopBgm(900);
        else VN.Audio.playBgm(beat.b);
        state.bgm = beat.b;
        visual = true;
      }
      if (beat.amb !== undefined) {
        if (beat.amb === null) { VN.Audio.ambienceOff(); state.amb = null; }
        else { VN.Audio.ambienceOn(beat.amb); state.amb = beat.amb; }
        visual = true;
      }
      if (beat.show) { showSprite(beat.show, beat.e, beat.pos); visual = true; }
      if (beat.hide === 'all') { hideAll(); visual = true; }
      else if (beat.hide) { hideSprite(beat.hide); visual = true; }
      if (beat.sfx) { VN.Audio.sfx(beat.sfx); visual = true; }
      if (beat.flash) { doFlash(); visual = true; }
      if (beat.shake) { doShake(); visual = true; }

      // ---- blocking ----
      if (beat.card) { showCard(beat.card); return; }
      if (beat.wait) {
        state.pc++;
        busy = true;
        window.setTimeout(function () { if (!ended) run(); }, beat.wait);
        return;
      }
      if (beat.choice) { state.pc = state.pc; renderChoices(beat); return; }
      if (beat.ending === 'auto') { resolveEnding(); return; }
      if (beat.end) { showEnding(beat.end); return; }
      if (beat.chapterEnd) { finishChapter(); return; }
      if (beat.jump) { startChapter(beat.jump, { fromSave: false }); return; }

      if (beat.t !== undefined || beat.w !== undefined) {
        showLine(beat);
        return;
      }

      if (visual) { state.pc++; continue; }
      state.pc++;
    }
    console.warn('[engine] beat loop guard tripped at', state.pc);
  }

  function veilTransition(bgKey, rain) {
    state.pc++;
    busy = true;
    el.veil.classList.add('is-on');
    window.setTimeout(function () {
      applyBg(bgKey);
      if (rain !== undefined) setRain(rain);
      el.veil.classList.remove('is-on');
      window.setTimeout(function () { if (!ended) run(); }, 480);
    }, 620);
  }

  function doFlash() {
    el.flash.classList.add('is-on');
    window.setTimeout(function () { el.flash.classList.remove('is-on'); }, 90);
  }

  function doShake() {
    var st = document.getElementById('stage');
    if (!st || document.body.classList.contains('reduce-motion')) return;
    st.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' },
       { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }],
      { duration: 380, easing: 'ease-in-out' }
    );
  }

  var cardTimer = null, cardOutTimer = null;

  // Close the chapter card early. Tapping, clicking or pressing a key during a
  // card means "yes, I read the title" - so it goes away immediately.
  function closeCard() {
    if (!el.card.classList.contains('is-on')) return false;
    if (cardTimer) { clearTimeout(cardTimer); cardTimer = null; }
    if (cardOutTimer) { clearTimeout(cardOutTimer); cardOutTimer = null; }
    el.card.classList.remove('is-on');
    cardOutTimer = window.setTimeout(function () {
      cardOutTimer = null;
      el.card.classList.add('is-hidden');
      state.pc++;
      busy = false;
      run();
    }, 420);
    return true;
  }

  function showCard(card) {
    busy = true;
    el.card.classList.remove('is-hidden');
    el.ccNo.textContent = card.no || '';
    el.ccTitle.textContent = card.en || '';
    el.ccSub.textContent = card.id || '';
    window.requestAnimationFrame(function () { el.card.classList.add('is-on'); });
    VN.Audio.sfx('ui_confirm', 0.5);
    cardTimer = window.setTimeout(function () {
      cardTimer = null;
      closeCard();
    }, 2500);
  }

  function showLine(beat) {
    var who = beat.w || null;
    var text = beat.t || '';
    if (beat.e && who) {
      var sp = SPEAKERS[who];
      if (sp && sp.id && slotFor(sp.id)) setExpr(sp.id, beat.e);
      else if (sp && sp.id && !slotFor(sp.id) && beat.autoShow !== false) showSprite(sp.id, beat.e, beat.pos || 'center');
    }

    var speakerId = null;
    if (who) {
      var info = SPEAKERS[who];
      var sid = info && info.id ? info.id : (VN.SPR[who.toLowerCase()] ? who.toLowerCase() : null);
      speakerId = sid;
      if (sid && !slotFor(sid) && VN.SPR[sid] && beat.autoShow !== false) {
        showSprite(sid, beat.e || 'neutral', beat.pos || 'center');
      }
    }
    renderSprites(speakerId);

    // dialogue box + name tag
    el.dialogBox.classList.remove('is-hidden');
    if (who) {
      el.nameTag.classList.add('is-on');
      el.nameText.textContent = who;
      el.dialogText.classList.remove('is-narration');
    } else {
      el.nameTag.classList.remove('is-on');
      el.dialogText.classList.add('is-narration');
    }

    pendingLineKey = lineKey();
    markSeen(pendingLineKey);

    if (beat.voice) VN.Audio.voice(beat.voice);
    else VN.Audio.stopVoice();

    pushHistory(who, text, beat.voice || null);

    // skip burnt through this line already?
    if (skipOn && seenMap[pendingLineKey]) {
      el.dialogText.textContent = text;
      fullText = text;
      typing = false;
      if (el.nextMark) el.nextMark.classList.add('is-on');
      window.setTimeout(function () { if (skipOn) E.advance(); }, 34);
      return;
    }

    typeOut(text, function () { scheduleAuto(); });
  }

  E.advance = function () {
    if (busy || ended) return;
    if (activeChoice) return;
    if (typing) { finishType(function () { scheduleAuto(); }); return; }
    clearAuto();
    state.pc++;
    run();
  };

  /* ------------------------------ choices ------------------------------ */
  function renderChoices(beat) {
    activeChoice = beat.choice;
    busy = true;
    el.choices.innerHTML = '';
    el.choices.classList.add('is-on');
    el.dialogBox.classList.remove('is-hidden');

    beat.choice.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.type = 'button';
      var ck = choiceKey(i, opt);
      if (seenMap[ck]) btn.classList.add('is-seen');
      btn.innerHTML = '<span class="num">' + String(i + 1).padStart(2, '0') + '</span>' +
                      '<span class="ctext"></span><span class="seen-mark"></span>';
      btn.querySelector('.ctext').textContent = opt.t;
      btn.style.animationDelay = (i * 60) + 'ms';
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        pick(i);
      });
      el.choices.appendChild(btn);
    });

    if (VN.UI && VN.UI.onChoices) VN.UI.onChoices(beat.choice);
  }

  function choiceKey(i, opt) {
    return (state.ch || '') + ':c' + state.pc + ':' + i;
  }

  function pick(i) {
    if (!activeChoice) return;
    var opt = activeChoice[i];
    if (!opt) return;
    VN.Audio.sfx('ui_click', 0.9);

    markSeen(choiceKey(i, opt));

    if (opt.bp) state.bond = Math.max(0, Math.min(100, state.bond + opt.bp));
    if (opt.tp) state.trust = Math.max(0, Math.min(100, state.trust + opt.tp));
    if (opt.flags) { for (var k in opt.flags) state.flags[k] = opt.flags[k]; }

    el.choices.classList.remove('is-on');
    el.choices.innerHTML = '';
    activeChoice = null;
    busy = false;

    pushHistory('Ren', opt.t);

    autosave();

    if (opt.go && jump(opt.go)) { run(); return; }
    state.pc++;
    run();
  }

  E.pickIndex = pick;

  /* ---------------------------- chapter flow ---------------------------- */
  function finishChapter() {
    var idx = -1;
    for (var i = 0; i < VN.chapters.length; i++) if (VN.chapters[i].id === state.ch) idx = i;
    var next = VN.chapters[idx + 1];
    var meta = VN.CHAPTER_META.filter(function (m) { return m.id === state.ch; })[0];

    return VN.Save.getMeta('chapters', []).then(function (list) {
      if (meta && list.indexOf(state.ch) === -1) list.push(state.ch);
      return VN.Save.setMeta('chapters', list);
    }).then(function () {
      autosave();
      if (next) {
        window.setTimeout(function () {
          startChapter(next.id, { continueRun: true });
        }, 400);
      } else {
        if (VN.UI && VN.UI.showTitle) VN.UI.showTitle();
      }
    });
  }

  function resolveEnding() {
    var key = VN.Endings.resolve(state);
    VN.Endings.record(key, state);
    var fr = VN.endings[key];
    var saveData = snapshot();
    saveData.finished = true;
    VN.Save.putSlot('auto', saveData);
    startChapter(fr.chapter, { ending: key });
  }

  function showEnding(cfg) {
    ended = true;
    clearAuto();
    autoOn = false; skipOn = false;
    VN.Audio.sfx('ui_confirm', 0.6);
    el.ending.classList.remove('is-hidden');
    el.ecKicker.textContent = cfg.kicker || 'Ending';
    el.ecTitle.textContent = cfg.title;
    el.ecSub.textContent = cfg.sub || '';
    el.ecStats.textContent = 'Kedekatan ' + state.bond + ' · Kejujuran ' + state.trust +
      ' · ' + Math.max(1, Math.round((Date.now() - (state.startedAt || Date.now())) / 60000)) + ' menit';
    window.requestAnimationFrame(function () { el.ending.classList.add('is-on'); });
    if (VN.UI && VN.UI.onEnding) VN.UI.onEnding(cfg.id, cfg);
  }

  E.hideEndingCard = function () {
    el.ending.classList.remove('is-on');
    window.setTimeout(function () { el.ending.classList.add('is-hidden'); }, 500);
  };

  function endOfChapter() { finishChapter(); }
  E.endOfChapter = endOfChapter;

  function startChapter(id, opts) {
    opts = opts || {};
    var ch = getChapter(id);
    if (!ch) { console.error('[engine] unknown chapter', id); return; }
    chapter = ch;
    labels = buildLabels(ch);
    ended = false;
    busy = false;
    clearAuto();
    activeChoice = null;

    if (!opts.fromSave) {
      state.ch = id;
      state.pc = 0;
      if (!opts.preserve) { state.history = state.history || []; }
      if (ch.bgm) { VN.Audio.playBgm(ch.bgm); state.bgm = ch.bgm; }
      if (ch.amb !== undefined) {
        if (ch.amb) { VN.Audio.ambienceOn(ch.amb); state.amb = ch.amb; } else { VN.Audio.ambienceOff(); state.amb = null; }
      }
      hideAll();
      setRain(!!ch.rain);
    }

    el.ending.classList.add('is-hidden');
    el.ending.classList.remove('is-on');
    el.choices.classList.remove('is-on');
    el.choices.innerHTML = '';
    el.dialogBox.classList.remove('is-hidden');

    var meta = VN.CHAPTER_META.filter(function (m) { return m.id === id; })[0];
    el.hudChapter.textContent = meta ? ('Bab ' + String(meta.no).padStart(2, '0')) : (ch.kind === 'ending' ? 'Ending' : '');
    el.hudTitle.textContent = ch.en || ch.title || '';
    if (VN.UI && VN.UI.onChapter) VN.UI.onChapter(ch, meta);

    VN.Save.getMeta('last', null).then(function () {});

    run();
  }

  E.startChapter = startChapter;

  /* ------------------------------ lifecycle ------------------------------ */
  E.newGame = function () {
    state = freshState();
    ended = false;
    startChapter('ch01', {});
  };

  E.snapshot = function () {
    return JSON.parse(JSON.stringify({
      v: VN.SAVE_VERSION,
      ch: state.ch,
      pc: state.pc,
      bond: state.bond,
      trust: state.trust,
      flags: state.flags,
      bg: state.bg,
      bgm: state.bgm,
      amb: state.amb,
      rain: state.rain,
      sprites: state.sprites,
      history: state.history.slice(-120),
      lines: state.lines,
      startedAt: state.startedAt,
      savedAt: Date.now(),
      title: (VN.CHAPTER_META.filter(function (m) { return m.id === state.ch; })[0] || {}).en || 'Ending',
      no: (VN.CHAPTER_META.filter(function (m) { return m.id === state.ch; })[0] || {}).no || 9
    }));
  };

  function snapshot() { return E.snapshot(); }

  function autosave() {
    if (!state || !state.ch) return;
    var data = E.snapshot();
    VN.Save.putSlot('auto', data);
    VN.Save.setMeta('last', { ch: data.ch, savedAt: data.savedAt });
  }
  E.autosave = autosave;

  E.restore = function (data) {
    if (!data || !data.ch) return false;
    state = freshState();
    state.ch = data.ch;
    state.pc = data.pc || 0;
    state.bond = data.bond || 0;
    state.trust = data.trust || 0;
    state.flags = data.flags || {};
    state.sprites = data.sprites || { left: null, center: null, right: null };
    state.history = data.history || [];
    state.lines = data.lines || 0;
    state.startedAt = data.startedAt || Date.now();
    state.rain = !!data.rain;

    chapter = getChapter(data.ch);
    if (!chapter) { console.error('[engine] save points at missing chapter', data.ch); return false; }
    labels = buildLabels(chapter);
    ended = false; busy = false; typing = false; activeChoice = null;

    // rebuild the whole visual state, then re-render the current line
    state.bg = null;
    hideAll();
    renderSprites();
    if (data.bg) { applyBg(data.bg); }
    setRain(!!data.rain);
    if (data.bgm) VN.Audio.playBgm(data.bgm, 500);
    if (data.amb) VN.Audio.ambienceOn(data.amb); else VN.Audio.ambienceOff();

    var meta = VN.CHAPTER_META.filter(function (m) { return m.id === data.ch; })[0];
    el.hudChapter.textContent = meta ? ('Bab ' + String(meta.no).padStart(2, '0')) : 'Ending';
    el.hudTitle.textContent = chapter.en || chapter.title || '';
    el.ending.classList.add('is-hidden');
    el.ending.classList.remove('is-on');
    el.choices.classList.remove('is-on');
    el.dialogBox.classList.remove('is-hidden');
    if (VN.UI && VN.UI.syncToggles) VN.UI.syncToggles();

    // re-display current beat without re-applying earlier side effects
    var beat = chapter.beats[state.pc];
    if (beat && (beat.t !== undefined || beat.w !== undefined)) {
      showLine(beat);
    } else {
      run();
    }
    return true;
  };

  /* -------------------------------- init -------------------------------- */
  E.init = function (data) {
    cacheDom();
    state = freshState();
    return VN.Save.getMeta('seen', {}).then(function (m) {
      seenMap = m || {};
      return true;
    });
  };

  E.getState = function () { return state; };
  E.skipCard = function () { return closeCard(); };
  E.getChapter = function () { return chapter; };
  E.markPaused = function () { /* reserved */ };

  E.setSeenMap = function (m) { seenMap = m || {}; };

  VN.Engine = E;
  VN.Game = E; // alias used by UI code
})();
