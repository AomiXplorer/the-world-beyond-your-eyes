/* ============================================================
   SceneRenderer - what the player sees on stage.

   Four small managers sharing one DOM tree:
     BackgroundRenderer  - two cross-fading plates + grade + atmosphere
     CharacterSprite     - standing sprite with expression swapping
     CharacterPosition   - left / center / right staging, dim + focus
     Effects             - veil, flash, shake
   ============================================================ */
(function () {
  'use strict';

  var S = {};
  var sceneEl, bgs = [], rainEl, spriteRoot, veilEl, flashEl;
  var slots = {};
  var front = 0;
  var currentBg = null;
  var rainOn = false;
  var preloaded = {};

  function $(id) { return document.getElementById(id); }
  function asset(p) { return VN.ASSET + p; }
  function reduced() { return document.body.classList.contains('reduce-motion'); }

  /* ------------------------------ background ------------------------------ */
  S.paint = function (key) {
    if (!key) return;
    if (key === currentBg) return;
    var path = VN.BG[key];
    if (!path) { console.warn('[scene] missing bg', key); return; }
    currentBg = key;
    var back = bgs[1 - front];
    if (!back) return;
    back.style.backgroundImage = 'url("' + asset(path) + '")';
    back.classList.add('is-on');
    bgs[front].classList.remove('is-on');
    front = 1 - front;
    S.syncRain();
  };

  S.resetBackground = function () { currentBg = null; };

  S.syncRain = function () {
    var allowed = rainOn && !reduced() && !!(VN.RAIN_BG && VN.RAIN_BG[currentBg]);
    if (rainEl) rainEl.classList.toggle('is-on', allowed);
  };

  S.setRain = function (on) { rainOn = !!on; S.syncRain(); };
  S.background = function () { return currentBg; };

  /* ------------------------------ characters ------------------------------ */
  function buildSlots() {
    if (!spriteRoot) return;
    spriteRoot.innerHTML = '';
    slots = {};
    ['left', 'center', 'right'].forEach(function (pos) {
      var el = document.createElement('div');
      el.className = 'sprite-slot';
      el.setAttribute('data-pos', pos);
      var img = document.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      el.appendChild(img);
      var sh = document.createElement('span');
      sh.className = 'sprite-shadow';
      el.appendChild(sh);
      var em = document.createElement('span');
      em.className = 'sprite-emote';
      em.setAttribute('aria-hidden', 'true');
      el.appendChild(em);
      spriteRoot.appendChild(el);
      slots[pos] = { el: el, img: img, emote: em, id: null, expr: null };
    });
  }

  function slotOf(id) {
    for (var k in slots) if (slots[k].id === id) return k;
    return null;
  }

  /* Two half-body sprites need more room than a standing figure does, so the
     stage steps back when a second character arrives and relaxes again when the
     stage is empty. Driven by what is really visible, not by the script. */
  function syncLayout() {
    if (!spriteRoot) return;
    var n = 0;
    for (var k in slots) if (slots[k].id) n++;
    spriteRoot.classList.toggle('is-duo', n > 1);
  }

  function freeSlot(pref) {
    if (slots[pref] && !slots[pref].id) return pref;
    for (var k in slots) if (!slots[k].id) return k;
    return pref;
  }

  /* A glyph only shows when the face on screen is a stand-in for the written
     expression, so rendered faces are never decorated. */
  var GLYPH = {
    spark: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3l3.4 10.4L34 17l-10.6 3.6L20 31l-3.4-10.4L6 17l10.6-3.6z"/><path d="M31 27l1.6 4.4L37 33l-4.4 1.6L31 39l-1.6-4.4L25 33l4.4-1.6z" opacity=".75"/></svg>',
    anger: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 6c3 2.6 6.4 3.4 10.4 2.4M34 14c-3.4 1.2-5.8 3.6-7 7.2M28 34c-2.6-3-3.4-6.4-2.4-10.4M6 26c2.8-2.2 5.2-2.6 8-1.4"/><path d="M18.6 12.4l9 9M27.6 12.4l-9 9" stroke-width="2.6"/></svg>'
  };

  function setEmote(slot, id, expr) {
    if (!slot || !slot.emote) return;
    var want = (VN.EMOTE && VN.EMOTE[id] && !VN.isExact(id, expr) && VN.EMOTE[id][expr]) || null;
    if (!want || !GLYPH[want]) { slot.emote.classList.remove('is-on'); slot.emote.innerHTML = ''; return; }
    if (slot.emote.getAttribute('data-g') === want && slot.emote.classList.contains('is-on')) return;
    slot.emote.setAttribute('data-g', want);
    slot.emote.innerHTML = GLYPH[want];
    slot.emote.classList.remove('is-on');
    void slot.emote.offsetWidth;
    slot.emote.classList.add('is-on');
  }

  S.show = function (id, expr, pos) {
    if (!VN.CHAR[id]) { console.warn('[scene] unknown character', id); return; }
    var meta = VN.CHARACTERS && VN.CHARACTERS[id];
    if (meta && meta.sprite === false) return;   /* first-person narrator: voice only */
    expr = expr || 'neutral';
    pos = pos || 'center';
    if (slotOf(id)) { S.setExpr(id, expr); return; }
    var key = freeSlot(pos);
    var s = slots[key];
    if (!s) return;
    s.id = id;
    s.expr = expr;
    s.img.src = asset(VN.resolveSprite(id, expr));
    s.el.setAttribute('data-char', id);
    s.el.setAttribute('data-expr', expr);
    s.el.classList.add('is-in');
    s.el.classList.remove('is-leaving');
    setEmote(s, id, expr);
    syncLayout();
  };

  S.hide = function (id) {
    var key = slotOf(id);
    if (!key) return;
    var s = slots[key];
    s.el.classList.remove('is-in');
    s.el.classList.add('is-leaving');
    s.id = null;
    s.expr = null;
    s.el.removeAttribute('data-char');
    if (s.emote) { s.emote.classList.remove('is-on'); s.emote.innerHTML = ''; }
    syncLayout();
    window.setTimeout(function () {
      if (!s.id) { s.el.classList.remove('is-leaving'); s.img.removeAttribute('src'); }
    }, 460);
  };

  S.hideAll = function () {
    for (var k in slots) if (slots[k].id) S.hide(slots[k].id);
    syncLayout();
  };

  var lastExprCue = 0;

  /* A face swap is a quiet thing: a soft rustle, detuned slightly every time, and
     never twice inside 140ms so a burst of expression beats cannot machine-gun
     it. */
  function exprCue() {
    if (!VN.Audio || !VN.Audio.sfx) return;
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    if (now - lastExprCue < 140) return;
    lastExprCue = now;
    VN.Audio.sfx('expr_shift', 0.5, 0.94 + Math.random() * 0.12);
  }

  S.setExpr = function (id, expr) {
    var key = slotOf(id);
    if (!key) return;
    var s = slots[key];
    var src = asset(VN.resolveSprite(id, expr || 'neutral'));
    s.expr = expr;
    s.el.setAttribute('data-expr', expr || 'neutral');
    setEmote(s, id, expr || 'neutral');
    if (s.img.getAttribute('src') === src) return;
    s.img.src = src;
    exprCue();
    s.img.classList.remove('is-swapping');
    void s.img.offsetWidth;
    s.img.classList.add('is-swapping');
    window.setTimeout(function () { s.img.classList.remove('is-swapping'); }, 200);
  };

  /* Dim everyone who is not speaking, lift the one who is. */
  S.stage = function (speakerId) {
    for (var k in slots) {
      var s = slots[k];
      if (!s.id) continue;
      s.el.classList.toggle('is-talk', !!(speakerId && s.id === speakerId));
      s.el.classList.toggle('is-dim', !!(speakerId && s.id !== speakerId));
    }
  };

  S.has = function (id) { return !!slotOf(id); };

  S.state = function () {
    var out = { left: null, center: null, right: null };
    for (var k in slots) if (slots[k].id) out[k] = { id: slots[k].id, e: slots[k].expr };
    return out;
  };

  S.restore = function (map) {
    for (var k in slots) {
      if (slots[k].id) {
        slots[k].el.classList.remove('is-in');
        slots[k].id = null; slots[k].expr = null;
      }
    }
    if (!map) return;
    ['left', 'center', 'right'].forEach(function (p) {
      var v = map[p];
      if (v && v.id && slots[p]) {
        slots[p].id = v.id;
        slots[p].expr = v.e || 'neutral';
        slots[p].img.src = asset(VN.resolveSprite(v.id, v.e));
        slots[p].el.setAttribute('data-char', v.id);
        slots[p].el.setAttribute('data-expr', v.e || 'neutral');
        slots[p].el.classList.add('is-in');
        setEmote(slots[p], v.id, v.e || 'neutral');
      }
    });
    syncLayout();
  };

  /* -------------------------------- effects -------------------------------- */
  S.veil = function (on) { if (veilEl) veilEl.classList.toggle('is-on', !!on); };

  S.flash = function () {
    if (!flashEl) return;
    flashEl.classList.add('is-on');
    window.setTimeout(function () { flashEl.classList.remove('is-on'); }, 110);
  };

  S.shake = function () {
    if (!sceneEl || reduced()) return;
    sceneEl.animate(
      [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(-7px,2px,0)' },
       { transform: 'translate3d(6px,-2px,0)' }, { transform: 'translate3d(-3px,1px,0)' },
       { transform: 'translate3d(0,0,0)' }],
      { duration: 400, easing: 'cubic-bezier(.36,.07,.19,.97)' }
    );
  };

  /* ------------------------------- preloading ------------------------------- */
  S.preloadChapter = function (ch) {
    if (!ch || !ch.beats) return Promise.resolve();
    var urls = {};
    ch.beats.forEach(function (b) {
      if (b && b.show && VN.CHAR[b.show]) urls[asset(VN.resolveSprite(b.show, b.e))] = 1;
    });
    var list = Object.keys(urls).filter(function (u) { return !preloaded[u]; });
    return Promise.all(list.map(function (u) {
      return new Promise(function (res) {
        var im = new Image();
        im.onload = im.onerror = function () { preloaded[u] = 1; res(); };
        im.src = u;
      });
    }));
  };

  S.init = function () {
    sceneEl = $('scene');
    bgs = [document.querySelector('.bg-plate[data-i="0"]'), document.querySelector('.bg-plate[data-i="1"]')];
    rainEl = $('bg-rain');
    spriteRoot = $('sprite-root');
    veilEl = $('veil');
    flashEl = $('flash');
    buildSlots();
  };

  VN.Scene = S;
})();
