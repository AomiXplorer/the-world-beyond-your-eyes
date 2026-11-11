/* ============================================================
   UI shell: boot, title, panels, save slots, gallery,
   chapters, history, settings wiring, keyboard.
   ============================================================ */
(function () {
  'use strict';

  var U = {};
  var bootEl, titleEl, stageEl;
  var currentPanel = null;
  var saveMode = 'save';
  var loaded = { chapters: [], gallery: [], endings: {} };
  var toastTimer = null;

  function $(id) { return document.getElementById(id); }

  /* The footer used to carry a hand-typed version, which went stale the moment
     the build moved on. It reads the real one now. */
  function stampVersion() {
    var el = $('title-version');
    if (el) el.textContent = 'v' + VN.VERSION;
  }

  /* Browsers only grant fullscreen from a real gesture, so the first click
     anywhere on the page asks for it. A click is dispatched after the tap has
     already picked its target, which is why swallowing it into fullscreen never
     makes the tap land on the wrong menu row. */
  function armFirstClickFullscreen() {
    var done = false;
    function once() {
      if (done) return;
      done = true;
      document.removeEventListener('click', once, true);
      enterGameView();
    }
    document.addEventListener('click', once, true);
  }

  /* Entering the story is also the moment to ask for the real game view:
     fullscreen plus a landscape lock, both requested from inside the click. */
  function enterGameView() {
    return VN.View.enterGameMode().then(function (r) {
      if (r && r.requested && !r.fullscreen && !VN.View.isFullscreen()) {
        // Browsers that refuse fullscreen still play - the stage just fills
        // the viewport they give us, and the rotate prompt covers portrait.
        document.body.classList.add('no-fullscreen');
      }
      return r;
    });
  }

  /* ------------------------------- boot ------------------------------- */
  U.boot = function (progress, label) {
    var fill = $('boot-bar-fill');
    var status = $('boot-status');
    if (fill) fill.style.width = Math.round(progress * 100) + '%';
    if (status && label) status.textContent = label;
  };

  U.hideBoot = function () {
    bootEl = $('boot');
    bootEl.classList.add('is-out');
    window.setTimeout(function () { bootEl.classList.add('is-hidden'); }, 640);
  };

  U.toast = function (msg, ms) {
    var t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.classList.remove('is-on'); }, ms || 2200);
  };

  /* ------------------------------- title ------------------------------- */
  U.showTitle = function () {
    stampVersion();
    titleEl = $('title-screen');
    stageEl = $('stage');
    stageEl.classList.add('is-hidden');
    titleEl.classList.remove('is-hidden');
    $('ending-card').classList.add('is-hidden');
    $('ending-card').classList.remove('is-on');
    $('veil').classList.remove('is-on');
    closePanels();
    VN.Audio.stopBgm(1400);
    VN.Audio.ambienceOff(1000);
    document.body.classList.remove('in-game');
    VN.View.setInGame(false);

    var art = $('title-art');
    art.style.backgroundImage = 'url("' + VN.ASSET + VN.BG.keyart + '")';
    window.requestAnimationFrame(function () { art.classList.add('is-on'); });

    VN.Save.latestSave().then(function (best) {
      var btn = $('menu-continue');
      var prog = $('title-progress');
      if (best && best.data) {
        btn.removeAttribute('disabled');
        var d = new Date(best.data.savedAt || Date.now());
        var no = best.data.no ? ('Bab ' + String(best.data.no).padStart(2, '0')) : '';
        prog.textContent = no + ' · ' + (best.data.title || '') + ' · ' +
          d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      } else {
        btn.setAttribute('disabled', 'disabled');
        prog.textContent = 'Belum ada data permainan';
      }
    });
    loadMeta();
  };

  U.showStage = function () {
    stageEl = $('stage');
    titleEl = $('title-screen');
    titleEl.classList.add('is-hidden');
    stageEl.classList.remove('is-hidden');
    document.body.classList.add('in-game');
    VN.View.setInGame(true);
    $('title-art').classList.remove('is-on');
  };

  function loadMeta() {
    return Promise.all([
      VN.Save.getMeta('chapters', []),
      VN.Save.getMeta('gallery', []),
      VN.Save.getMeta('endings', {})
    ]).then(function (r) {
      loaded.chapters = r[0] || [];
      loaded.gallery = r[1] || [];
      loaded.endings = r[2] || {};
    });
  }

  /* ------------------------------ panels ------------------------------ */
  function openPanel(id) {
    closePanels();
    var p = $(id);
    if (!p) return;
    p.classList.remove('is-hidden');
    currentPanel = id;
    if (VN.Audio) VN.Audio.sfx('ui_confirm', 0.5);
  }

  function closePanels() {
    document.querySelectorAll('.overlay').forEach(function (o) { o.classList.add('is-hidden'); });
    currentPanel = null;
  }
  U.closePanels = closePanels;

  /* ---------------------------- settings ---------------------------- */
  var SPEED_LABEL = function (v) {
    if (v <= 12) return 'Lambat';
    if (v <= 35) return 'Agak Lambat';
    if (v <= 62) return 'Normal';
    if (v <= 86) return 'Cepat';
    return 'Instan';
  };
  var DELAY_LABEL = function (v) {
    if (v <= 15) return 'Sangat Lama';
    if (v <= 40) return 'Lama';
    if (v <= 62) return 'Sedang';
    if (v <= 85) return 'Singkat';
    return 'Cepat';
  };

  function bindSettings() {
    var s = VN.Save.getSettings();

    function paint() {
      $('vol-bgm').value = Math.round(s.bgm * 100);
      $('vol-sfx').value = Math.round(s.sfx * 100);
      $('vol-bgm-out').textContent = Math.round(s.bgm * 100);
      $('vol-sfx-out').textContent = Math.round(s.sfx * 100);
      $('txt-speed').value = s.textSpeed;
      $('txt-speed-out').textContent = SPEED_LABEL(s.textSpeed);
      $('auto-delay').value = s.autoDelay;
      $('auto-delay-out').textContent = DELAY_LABEL(s.autoDelay);
      $('toggle-mute').setAttribute('aria-pressed', String(!!s.mute));
      $('toggle-mute').textContent = s.mute ? 'Suara Dibisukan' : 'Bisukan Semua';
      $('toggle-reduce').setAttribute('aria-pressed', String(!!s.reduceMotion));
      document.body.classList.toggle('reduce-motion', !!s.reduceMotion);
    }

    function commit(patch) {
      for (var k in patch) s[k] = patch[k];
      VN.Save.setSettings(s);
      paint();
    }

    $('vol-bgm').addEventListener('input', function () {
      commit({ bgm: this.value / 100 });
      VN.Audio.setVolume('bgm', s.bgm);
    });
    $('vol-sfx').addEventListener('input', function () {
      commit({ sfx: this.value / 100 });
      VN.Audio.setVolume('sfx', s.sfx);
    });
    $('vol-sfx').addEventListener('change', function () { VN.Audio.sfx('cup', 0.8); });
    $('txt-speed').addEventListener('input', function () { commit({ textSpeed: +this.value }); });
    $('auto-delay').addEventListener('input', function () { commit({ autoDelay: +this.value }); });

    $('toggle-mute').addEventListener('click', function () {
      commit({ mute: !s.mute });
      VN.Audio.setMuted(s.mute);
    });
    $('toggle-reduce').addEventListener('click', function () {
      commit({ reduceMotion: !s.reduceMotion });
      if (s.reduceMotion) $('bg-rain').classList.remove('is-on');
    });
    $('toggle-fullscreen').addEventListener('click', function () {
      if (!VN.View.supported().fullscreen) {
        U.toast('Browser ini tidak mendukung layar penuh');
        return;
      }
      VN.View.toggleFullscreen().then(function (ok) {
        if (!ok) U.toast('Layar penuh ditolak browser');
        paintFs();
      });
    });

    function paintFs() {
      var on = VN.View.isFullscreen();
      $('toggle-fullscreen').setAttribute('aria-pressed', String(on));
      var sup = VN.View.supported();
      var hint = $('fs-hint');
      if (!sup.fullscreen) hint.textContent = 'Browser ini tidak mendukung layar penuh.';
      else if (VN.View.isIOS()) hint.textContent = 'Di iPhone/iPad, layar penuh hanya tersedia setelah "Tambah ke Layar Utama".';
      else hint.textContent = on ? 'Layar penuh aktif.' : 'Layar penuh nonaktif.';
    }
    paintFs();
    VN.View.on(function (e) { if (e.type === 'fullscreen') paintFs(); });

    // character voice channel: only shown when a voice pack is shipped
    var vrow = $('row-voice');
    if (vrow && VN.HAS_VOICE) {
      vrow.hidden = false;
      $('vol-voice').value = Math.round(s.voice * 100);
      $('vol-voice-out').textContent = Math.round(s.voice * 100);
      $('vol-voice').addEventListener('input', function () {
        s.voice = this.value / 100;
        commit({ voice: s.voice });
        VN.Audio.setVolume('voice', s.voice);
      });
    }
    $('clear-seen').addEventListener('click', function () {
      VN.Save.setMeta('seen', {}).then(function () {
        VN.Game.setSeenMap({});
        U.toast('Riwayat "sudah dibaca" dihapus');
      });
    });
    $('clear-all').addEventListener('click', function () {
      if (!window.confirm('Hapus semua save, riwayat, dan pengaturan? Tindakan ini tidak bisa dibatalkan.')) return;
      VN.Save.clearEverything().then(function () {
        VN.Game.setSeenMap({});
        loaded = { chapters: [], gallery: [], endings: {} };
        U.toast('Semua data permainan dihapus');
        U.showTitle();
      });
    });

    $('storage-hint').textContent = VN.Save.usingFallback
      ? 'Browser ini memakai penyimpanan cadangan (localStorage). Progres tetap tersimpan.'
      : 'Progres disimpan di perangkat ini (IndexedDB).';

    paint();
  }

  U.syncSettings = function () {
    var s = VN.Save.getSettings();
    document.body.classList.toggle('reduce-motion', !!s.reduceMotion);
    if (s.reduceMotion) $('bg-rain').classList.remove('is-on');
  };

  /* ---------------------------- save slots ---------------------------- */
  function fmtDate(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
      d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  function renderSlots() {
    var grid = $('slot-grid');
    grid.innerHTML = '';
    VN.Save.allSlots().then(function (list) {
      list.forEach(function (item) {
        if (item.slot === 'auto' && saveMode === 'save') return;
        var d = item.data;
        var btn = document.createElement('button');
        btn.className = 'slot' + (d ? '' : ' slot-empty');
        btn.type = 'button';

        var label = item.slot === 'auto' ? 'Autosave' : ('Slot ' + item.slot);
        var thumb = d && d.bg && VN.BG[d.bg] ? VN.ASSET + VN.BG[d.bg] : '';
        var title = d ? (d.title || 'Tanpa judul') : 'Kosong';
        var meta = d ? (fmtDate(d.savedAt) + ' · KEDEKATAN ' + d.bond + ' · KEJUJURAN ' + d.trust) : 'Ketuk untuk menyimpan';

        btn.innerHTML =
          '<span class="slot-thumb"></span>' +
          '<span class="slot-meta">' +
            '<span class="slot-slot">' + label + '</span>' +
            '<span class="slot-title"></span>' +
            '<span class="slot-date"></span>' +
          '</span>' +
          '<span class="slot-actions"></span>';

        if (thumb) btn.querySelector('.slot-thumb').style.backgroundImage = 'url("' + thumb + '")';
        btn.querySelector('.slot-title').textContent = title;
        btn.querySelector('.slot-date').textContent = meta;

        var actions = btn.querySelector('.slot-actions');
        if (d && item.slot !== 'auto') {
          var del = document.createElement('span');
          del.className = 'slot-x';
          del.textContent = 'Hapus';
          del.setAttribute('role', 'button');
          del.addEventListener('click', function (ev) {
            ev.stopPropagation();
            VN.Save.delSlot(item.slot).then(function () {
              U.toast('Slot ' + item.slot + ' dihapus');
              renderSlots();
            });
          });
          actions.appendChild(del);
        }

        btn.addEventListener('click', function () {
          if (saveMode === 'save') {
            if (item.slot === 'auto') return;
            var snap = VN.Game.snapshot();
            VN.Save.putSlot(item.slot, snap).then(function () {
              U.toast('Tersimpan di Slot ' + item.slot);
              VN.Audio.sfx('ui_confirm', 0.6);
              renderSlots();
            });
          } else {
            if (!d) { U.toast('Slot ini kosong'); return; }
            closePanels();
            U.showStage();
            $('ending-card').classList.add('is-hidden');
            $('ending-card').classList.remove('is-on');
            if (!VN.Game.restore(d)) U.toast('Save tidak bisa dibuka');
            else U.toast('Dimuat dari ' + label);
          }
        });

        grid.appendChild(btn);
      });
    });
  }

  U.openSaves = function (mode) {
    saveMode = mode;
    $('saves-title').textContent = mode === 'save' ? 'Simpan Permainan' : 'Muat Permainan';
    openPanel('ov-saves');
    renderSlots();
  };

  /* ------------------------------ history ------------------------------ */
  U.openHistory = function (history) {
    var body = $('history-body');
    body.innerHTML = '';
    if (!history || !history.length) {
      body.innerHTML = '<p class="hint">Belum ada dialog.</p>';
    } else {
      history.slice(-120).forEach(function (h) {
        var d = document.createElement('div');
        d.className = 'hist-item';
        var w = document.createElement('p');
        w.className = 'hist-who' + (h.w ? '' : ' is-nar');
        w.textContent = h.w || 'Narasi';
        var t = document.createElement('p');
        t.className = 'hist-text';
        t.textContent = h.t;
        d.appendChild(w); d.appendChild(t);
        if (h.v) {
          var v = document.createElement('p');
          v.className = 'hist-voice';
          v.textContent = '♪ voice line';
          d.appendChild(v);
        }
        body.appendChild(d);
      });
    }
    openPanel('ov-history');
    var p = $('ov-history').querySelector('.panel-body');
    p.scrollTop = p.scrollHeight;
  };

  /* ------------------------------ gallery ------------------------------ */
  U.unlockGallery = function (id) {
    if (loaded.gallery.indexOf(id) !== -1) return;
    loaded.gallery.push(id);
    VN.Save.setMeta('gallery', loaded.gallery);
    U.toast('Galeri terbuka: ' + (VN.GALLERY.filter(function (g) { return g.id === id; })[0] || {}).title);
  };

  function renderGallery() {
    var grid = $('gallery-grid');
    grid.innerHTML = '';
    VN.GALLERY.forEach(function (g) {
      var unlocked = g.id === 'keyart' || loaded.gallery.indexOf(g.id) !== -1;
      var fig = document.createElement('figure');
      fig.className = 'gal-item' + (unlocked ? '' : ' is-locked');
      if (g.bg && VN.BG[g.bg]) fig.style.backgroundImage = 'url("' + VN.ASSET + VN.BG[g.bg] + '")';
      var cap = document.createElement('figcaption');
      cap.textContent = unlocked ? g.title : '— terkunci —';
      fig.appendChild(cap);
      if (!unlocked) {
        var lock = document.createElement('div');
        lock.className = 'gal-lock';
        lock.textContent = g.sub || 'Terkunci';
        fig.appendChild(lock);
      } else {
        fig.addEventListener('click', function () { openLightbox(g); });
        fig.setAttribute('role', 'button');
        fig.setAttribute('tabindex', '0');
        fig.addEventListener('keydown', function (e) { if (e.key === 'Enter') openLightbox(g); });
      }
      grid.appendChild(fig);
    });
  }

  function openLightbox(g) {
    var lb = $('lightbox');
    $('lb-img').src = VN.ASSET + VN.BG[g.bg];
    $('lb-img').alt = g.title;
    $('lb-cap').textContent = g.title + (g.sub ? ' · ' + g.sub : '');
    lb.classList.remove('is-hidden');
  }

  /* ---------------------------- chapter list ---------------------------- */
  function renderChapters() {
    var list = $('chapter-list');
    list.innerHTML = '';
    VN.CHAPTER_META.forEach(function (m, i) {
      var unlocked = m.id === 'ch01' || loaded.chapters.indexOf(m.id) !== -1 ||
        (i > 0 && loaded.chapters.indexOf(VN.CHAPTER_META[i - 1].id) !== -1);
      var b = document.createElement('button');
      b.className = 'ch-item';
      b.type = 'button';
      b.disabled = !unlocked;
      b.innerHTML = '<span class="ch-no">' + String(m.no).padStart(2, '0') + '</span>' +
        '<span class="ch-body"><span class="ch-en"></span><span class="ch-id"></span></span>' +
        '<span class="ch-flag">' + (unlocked ? 'Buka' : 'Terkunci') + '</span>';
      b.querySelector('.ch-en').textContent = m.en;
      b.querySelector('.ch-id').textContent = m.id_title;
      b.addEventListener('click', function () {
        closePanels();
        enterGameView();
        U.showStage();
        $('ending-card').classList.add('is-hidden');
        $('ending-card').classList.remove('is-on');
        VN.Endings.startFromChapter(m.id);
      });
      list.appendChild(b);
    });

    var endWrap = document.createElement('div');
    endWrap.style.marginTop = '24px';
    var known = Object.keys(loaded.endings || {});
    endWrap.innerHTML = '<h3 style="font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#8d8272;' +
      'border-bottom:1px solid rgba(242,232,218,.08);padding-bottom:9px;margin:0 0 14px">Ending ditemukan ' +
      known.length + ' / 4</h3><div id="ending-dots" style="display:flex;gap:8px;flex-wrap:wrap"></div>';
    list.appendChild(endWrap);

    var dots = endWrap.querySelector('#ending-dots');
    ['true', 'good', 'normal', 'bad'].forEach(function (k) {
      var fr = VN.endings[k];
      var d = document.createElement('span');
      var got = !!loaded.endings[k];
      d.textContent = got ? fr.name : '???';
      d.style.cssText = 'font-size:11px;letter-spacing:.1em;padding:7px 12px;border:1px solid ' +
        (got ? 'rgba(177,73,60,.6)' : 'rgba(242,232,218,.12)') + ';color:' + (got ? '#e5b3ab' : '#6e6459');
      dots.appendChild(d);
    });
  }

  /* ------------------------------ credits ------------------------------ */
  function renderCredits() {
    var body = $('credits-body');
    var html = '<dl>' + VN.CREDITS.map(function (r) {
      return '<div class="cred-row"><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
    }).join('') + '</dl>';
    html += '<p class="cred-note">Semua ilustrasi dibuat dengan AI image generation lalu diarahkan secara manual ' +
      '(komposisi, cropping, pemotongan sprite). Seluruh musik dan efek suara disintesis khusus untuk game ini, ' +
      'tidak memakai sampel pihak ketiga. Terinspirasi dari visual novel Jepang dan karya yang berani diam ' +
      'lebih lama dari yang nyaman.</p>';
    body.innerHTML = html;
  }

  /* --------------------------- engine hooks --------------------------- */
  U.onLine = function () {};
  U.onChoices = function () {};

  U.onChapter = function (ch) {
    document.querySelectorAll('.hud-btn[data-hud="skip"]').forEach(function (b) { b.classList.remove('is-active'); });
  };

  U.onEnding = function (id, cfg) {
    loaded.endings = loaded.endings || {};
    loaded.endings[id] = true;
    VN.Save.setMeta('endings', loaded.endings);
  };

  U.syncToggles = function () {
    var a = document.querySelector('.hud-btn[data-hud="auto"]');
    var s = document.querySelector('.hud-btn[data-hud="skip"]');
    if (a) a.setAttribute('aria-pressed', String(!!VN.Game.isAuto()));
    if (s) s.setAttribute('aria-pressed', String(!!VN.Game.isSkip()));
  };

  /* ------------------------------ wiring ------------------------------ */
  U.init = function () {
    stampVersion();
    armFirstClickFullscreen();
    bootEl = $('boot');
    titleEl = $('title-screen');
    stageEl = $('stage');

    $('title-menu').addEventListener('click', function (ev) {
      var b = ev.target.closest('.menu-item');
      if (!b || b.hasAttribute('disabled')) return;
      VN.Audio.sfx('ui_click', 0.8);
      var a = b.getAttribute('data-action');
      enterGameView();
      if (a === 'new') {
        U.showStage();
        VN.Game.newGame();
      } else if (a === 'continue') {
        VN.Save.latestSave().then(function (best) {
          if (!best || !best.data) { U.toast('Belum ada save'); return; }
          U.showStage();
          $('ending-card').classList.add('is-hidden');
          $('ending-card').classList.remove('is-on');
          VN.Game.restore(best.data);
        });
      } else if (a === 'load') { U.openSaves('load'); }
      else if (a === 'settings') { openPanel('ov-settings'); }
      else if (a === 'gallery') { renderGallery(); openPanel('ov-gallery'); }
      else if (a === 'chapters') { renderChapters(); openPanel('ov-chapters'); }
      else if (a === 'credits') { renderCredits(); openPanel('ov-credits'); }
    });

    $('title-menu').addEventListener('pointerover', function (ev) {
      var b = ev.target.closest('.menu-item');
      if (b && !b.hasAttribute('disabled')) VN.Audio.sfx('ui_hover', 0.5);
    });

    document.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () {
        closePanels();
        if (!document.body.classList.contains('in-game')) return;
      });
    });

    document.querySelectorAll('.overlay').forEach(function (o) {
      o.addEventListener('click', function (ev) { if (ev.target === o) closePanels(); });
    });

    $('lb-close').addEventListener('click', function () { $('lightbox').classList.add('is-hidden'); });
    $('lightbox').addEventListener('click', function (ev) {
      if (ev.target === this) this.classList.add('is-hidden');
    });

    $('hud' in window ? 'hud' : 'hud');

    document.querySelectorAll('.hud-btn').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var a = b.getAttribute('data-hud');
        if (a === 'auto') { VN.Game.setAuto(!VN.Game.isAuto()); U.toast(VN.Game.isAuto() ? 'Auto aktif' : 'Auto mati'); }
        else if (a === 'skip') { VN.Game.setSkip(!VN.Game.isSkip()); U.toast(VN.Game.isSkip() ? 'Skip aktif — berhenti di teks baru' : 'Skip mati'); }
        else if (a === 'log') { U.openHistory(VN.Game.getState().history); }
        else if (a === 'save') { U.openSaves('save'); }
        else if (a === 'load') { U.openSaves('load'); }
        else if (a === 'settings') { openPanel('ov-settings'); }
        else if (a === 'chapters') { loadMeta().then(function () { renderChapters(); openPanel('ov-chapters'); }); }
        else if (a === 'menu') {
          if (window.confirm('Kembali ke menu utama? Progres otomatis tersimpan.')) {
            VN.Game.autosave();
            U.showTitle();
          }
        }
      });
    });

    // advance by tapping the dialogue area or empty stage space
    $('dialog-box').addEventListener('click', function (ev) {
      ev.stopPropagation();
      VN.Game.advance();
    });
    $('stage').addEventListener('click', function (ev) {
      if (ev.target.closest('.hud') || ev.target.closest('.choices') ||
          ev.target.closest('.overlay') || ev.target.closest('.ending-card')) return;
      if (ev.target.closest('.chapter-card')) { VN.Game.skipCard(); return; }
      VN.Game.advance();
    });

    $('ec-title-btn').addEventListener('click', function () { U.showTitle(); });
    $('ec-gallery').addEventListener('click', function () {
      VN.Game.hideEndingCard();
      renderGallery();
      openPanel('ov-gallery');
      U.showStage();
    });

    bindSettings();

    document.addEventListener('keydown', function (ev) {
      if (ev.target && /input|textarea/i.test(ev.target.tagName)) return;
      var inGame = document.body.classList.contains('in-game');
      if (currentPanel) {
        if (ev.key === 'Escape') { closePanels(); ev.preventDefault(); }
        return;
      }
      if (!$('lightbox').classList.contains('is-hidden')) {
        if (ev.key === 'Escape') $('lightbox').classList.add('is-hidden');
        return;
      }
      if (!inGame) return;

      if (ev.key === ' ' || ev.key === 'Enter') {
        ev.preventDefault();
        if (VN.Game.skipCard && VN.Game.skipCard()) return;
        VN.Game.advance();
      }
      else if (ev.key === 'a' || ev.key === 'A') { VN.Game.setAuto(!VN.Game.isAuto()); }
      else if (ev.key === 's' || ev.key === 'S') { VN.Game.setSkip(!VN.Game.isSkip()); }
      else if (ev.key === 'l' || ev.key === 'L') { U.openHistory(VN.Game.getState().history); }
      else if (ev.key === 'Escape') {
        if (window.confirm('Kembali ke menu utama? Progres otomatis tersimpan.')) {
          VN.Game.autosave(); U.showTitle();
        }
      } else if (ev.key === 'h' || ev.key === 'H') {
        $('hud').classList.toggle('is-awake');
      } else if (/^[1-9]$/.test(ev.key) && document.querySelector('.choices.is-on')) {
        VN.Game.pickIndex(parseInt(ev.key, 10) - 1);
      }
    });

    /* Opening the game should already be landscape: view.js rotates the shell
       the moment the page loads, and the first touch anywhere asks the browser
       for the real fullscreen + orientation lock. The player never has to press
       Play just to get a landscape view. */
    if (VN.View.isTouch()) {
      var firstGesture = function () {
        ['pointerdown', 'touchstart', 'keydown'].forEach(function (k) {
          document.removeEventListener(k, firstGesture, true);
        });
        enterGameView();
      };
      ['pointerdown', 'touchstart', 'keydown'].forEach(function (k) {
        document.addEventListener(k, firstGesture, true);
      });

      window.setTimeout(function () {
        if (VN.View.isTouch() && window.innerHeight > window.innerWidth && !VN.View.inGame()) {
          U.toast('Putar HP ke mendatar');
        }
      }, 1600);
    }

    var rotBtn = $('rotate-fullscreen');
    if (rotBtn) rotBtn.addEventListener('click', function () {
      enterGameView();
      if (!VN.View.isFullscreen()) U.toast('Putar perangkat secara manual ke posisi mendatar');
    });

    // The story waits while the device is upright or the tab is hidden.
    VN.View.on(function (e) {
      if (e.type === 'rotate' && e.needed) {
        if (VN.Game.isAuto()) { VN.Game.setAuto(false); U.toast('Auto berhenti: putar perangkat'); }
        if (VN.Game.isSkip()) VN.Game.setSkip(false);
      }
      if (e.type === 'visibility' && e.hidden) {
        if (VN.Game.isAuto()) VN.Game.setAuto(false);
        if (VN.Game.isSkip()) VN.Game.setSkip(false);
      }
    });

    var hud = $('hud');
    var hudTimer = null;
    ['pointermove', 'pointerdown', 'touchstart'].forEach(function (e) {
      document.addEventListener(e, function () {
        hud.classList.add('is-awake');
        if (hudTimer) clearTimeout(hudTimer);
        hudTimer = window.setTimeout(function () { hud.classList.remove('is-awake'); }, 2600);
      }, { passive: true });
    });
  };

  U.renderGallery = renderGallery;
  U.refreshMeta = loadMeta;

  VN.UI = U;
})();
