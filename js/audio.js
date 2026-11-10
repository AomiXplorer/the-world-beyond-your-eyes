/* ============================================================
   Audio manager - BGM / ambience / SFX / voice channels
   with real fades, no overlapping tracks, saved volumes.
   ============================================================ */
(function () {
  'use strict';

  var A = {
    bgm: { vol: 0.7 },
    sfxCh: { vol: 0.8 },
    voiceCh: { vol: 0.85 },
    muted: false,
    unlocked: false,
    current: null,      // { key, el }
    ambience: null,     // { key, el }
    els: {},
    pool: {}
  };

  var BGM_FADE = 1200;
  var AMB_FADE = 900;

  function url(path) { return VN.ASSET + path; }

  function makeEl(src, loop) {
    var el = new Audio();
    el.preload = 'auto';
    el.loop = !!loop;
    el.volume = 0;
    el.src = src;
    return el;
  }

  function fade(el, to, ms, done) {
    if (!el) { if (done) done(); return; }
    var from = el.volume;
    var start = performance.now();
    if (el._fadeRaf) cancelAnimationFrame(el._fadeRaf);
    function step(now) {
      var t = Math.min(1, (now - start) / Math.max(1, ms));
      // equal-power-ish curve reads smoother than linear on volume
      var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      el.volume = Math.max(0, Math.min(1, from + (to - from) * e));
      if (t < 1) {
        el._fadeRaf = requestAnimationFrame(step);
      } else {
        el._fadeRaf = null;
        if (done) done();
      }
    }
    el._fadeRaf = requestAnimationFrame(step);
  }

  A.init = function () {
    var s = VN.Save.getSettings();
    A.bgm.vol = s.bgm;
    A.sfxCh.vol = s.sfx;
    A.voiceCh.vol = s.voice;
    A.muted = !!s.mute;
    A.applyVolumes();
    // Browsers require a gesture before audio can start.
    var unlock = function () {
      if (A.unlocked) return;
      A.unlocked = true;
      var silent = makeEl('data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA', false);
      silent.volume = 0;
      var p = silent.play();
      if (p && p.catch) p.catch(function () {});
      if (A._pendingBgm) { A.playBgm(A._pendingBgm, 600); A._pendingBgm = null; }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    window.addEventListener('touchstart', unlock, { passive: true });
  };

  A.applyVolumes = function () {
    var m = A.muted ? 0 : 1;
    if (A.current && A.current.el) A.current.el.volume = A.bgm.vol * m * (A.current.el._target || 1);
    if (A.ambience && A.ambience.el) A.ambience.el.volume = A.sfxCh.vol * m * 0.75;
  };

  A.setVolume = function (kind, v) {
    v = Math.max(0, Math.min(1, v));
    var m = A.muted ? 0 : 1;
    if (kind === 'bgm') {
      A.bgm.vol = v;
      if (A.current && A.current.el && !A.current.el._fadeRaf) A.current.el.volume = v * m;
    } else if (kind === 'sfx') {
      A.sfxCh.vol = v;
      if (A.ambience && A.ambience.el && !A.ambience.el._fadeRaf) A.ambience.el.volume = v * m * 0.75;
    } else if (kind === 'voice') {
      A.voiceCh.vol = v;
    }
  };

  A.setMuted = function (on) {
    A.muted = !!on;
    var m = A.muted ? 0 : 1;
    if (A.current && A.current.el) A.current.el.volume = A.bgm.vol * m;
    if (A.ambience && A.ambience.el) A.ambience.el.volume = A.sfxCh.vol * m * 0.75;
  };

  /* ------------------------------ BGM ------------------------------ */
  A.playBgm = function (key, fadeMs) {
    if (!key) return;
    if (A.current && A.current.key === key) return;
    if (!A.unlocked) { A._pendingBgm = key; A.current = { key: key, el: null }; return; }

    var path = VN.BGM[key];
    if (!path) { console.warn('[audio] unknown bgm', key); return; }

    var old = A.current && A.current.el;
    var el = makeEl(url(path), true);
    el.volume = 0;
    var ms = typeof fadeMs === 'number' ? fadeMs : BGM_FADE;

    var playPromise = el.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        // Autoplay refused: keep the state but retry on the next gesture.
        A._pendingBgm = key;
      });
    }
    el._target = 1;
    fade(el, A.muted ? 0 : A.bgm.vol, ms);

    A.current = { key: key, el: el };

    if (old && old !== el) {
      fade(old, 0, ms, function () {
        try { old.pause(); old.src = ''; } catch (e) {}
      });
    }
  };

  A.stopBgm = function (fadeMs) {
    var ms = typeof fadeMs === 'number' ? fadeMs : BGM_FADE;
    if (A.current && A.current.el) {
      var el = A.current.el;
      fade(el, 0, ms, function () { try { el.pause(); el.src = ''; } catch (e) {} });
    }
    A.current = null;
    A._pendingBgm = null;
  };

  A.currentBgm = function () { return A.current ? A.current.key : null; };

  /* --------------------------- ambience --------------------------- */
  A.ambienceOn = function (key) {
    if (!key) { A.ambienceOff(); return; }
    if (A.ambience && A.ambience.key === key) return;
    if (!VN.SFX[key]) { console.warn('[audio] unknown ambience', key); return; }

    var old = A.ambience && A.ambience.el;
    var el = makeEl(url(VN.SFX[key]), true);
    el.volume = 0;
    var p = el.play();
    if (p && p.catch) p.catch(function () {});
    fade(el, A.muted ? 0 : A.sfxCh.vol * 0.75, AMB_FADE);
    A.ambience = { key: key, el: el };
    if (old && old !== el) fade(old, 0, AMB_FADE, function () { try { old.pause(); old.src = ''; } catch (e) {} });
  };

  A.ambienceOff = function (fadeMs) {
    var ms = typeof fadeMs === 'number' ? fadeMs : AMB_FADE;
    if (A.ambience && A.ambience.el) {
      var el = A.ambience.el;
      fade(el, 0, ms, function () { try { el.pause(); el.src = ''; } catch (e) {} });
    }
    A.ambience = null;
  };

  /* ------------------------------ SFX ------------------------------ */
  A.sfx = function (key, vol) {
    if (A.muted || !A.unlocked) return;
    var path = VN.SFX[key];
    if (!path) { console.warn('[audio] unknown sfx', key); return; }
    var pool = A.pool[key] || (A.pool[key] = []);
    var el = null;
    for (var i = 0; i < pool.length; i++) {
      if (pool[i].paused || pool[i].ended) { el = pool[i]; break; }
    }
    if (!el) {
      if (pool.length >= 4) el = pool[0];
      else { el = new Audio(url(path)); el.preload = 'auto'; pool.push(el); }
    }
    try {
      el.currentTime = 0;
      el.volume = Math.max(0, Math.min(1, A.sfxCh.vol * (typeof vol === 'number' ? vol : 1)));
      var p = el.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  };

  /* ------------------------------ voice ------------------------------ */
  // Voice lines are optional: drop files in assets/audio/voice/<id>.mp3
  // and the engine will play them on the matching line. Missing files are
  // silently skipped so the game never breaks or shows a dead control.
  A.voice = function (id) {
    if (!id || A.muted) return false;
    var path = 'audio/voice/' + id + '.mp3';
    var el = A.els.voice || (A.els.voice = new Audio());
    el.onerror = function () { /* no file shipped for this line */ };
    el.src = url(path);
    el.volume = A.voiceCh.vol;
    var p = el.play();
    if (p && p.catch) p.catch(function () {});
    return true;
  };

  A.stopVoice = function () {
    if (A.els.voice) { try { A.els.voice.pause(); A.els.voice.currentTime = 0; } catch (e) {} }
  };

  VN.Audio = A;
})();
