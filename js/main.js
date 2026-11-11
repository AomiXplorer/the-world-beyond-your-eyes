/* ============================================================
   Boot sequence and preloading.
   ============================================================ */
(function () {
  'use strict';

  var preloaded = { ok: 0, fail: 0 };

  function preloadImage(src) {
    return new Promise(function (resolve) {
      var im = new Image();
      var done = false;
      var finish = function (ok) {
        if (done) return;
        done = true;
        ok ? preloaded.ok++ : preloaded.fail++;
        resolve(ok);
      };
      im.onload = function () { finish(true); };
      im.onerror = function () {
        console.warn('[assets] gagal memuat', src);
        finish(false);
      };
      im.src = src;
      window.setTimeout(function () { finish(true); }, 9000);
    });
  }

  function url(p) { return VN.ASSET + p; }

  function warmAudio() {
    ['expr_shift', 'ui_click'].forEach(function (k) {
      if (VN.Audio && VN.Audio.warm) VN.Audio.warm(k);
    });
  }

  function collectCore() {
    var list = [];
    list.push(url(VN.BG.keyart));
    ['cafe_rain', 'cafe_evening', 'street_spring', 'classroom'].forEach(function (k) {
      if (VN.BG[k]) list.push(url(VN.BG[k]));
    });
    /* Only the neutral face of each character is core. Every other expression is
       preloaded per chapter by the scene, so the first paint is not held up by
       thirty half-body illustrations. */
    Object.keys(VN.CHAR).forEach(function (id) {
      if (VN.CHAR[id].neutral) list.push(url(VN.CHAR[id].neutral));
    });
    return list;
  }

  function collectAll() {
    return Object.keys(VN.BG).map(function (k) { return url(VN.BG[k]); });
  }

  var started = false;

  function boot() {
    if (started) return;
    started = true;

    VN.View.init();
    VN.Scene.init();
    VN.UI.init();
    VN.UI.boot(0.05, 'Membaca kenangan...');

    VN.Save.init().then(function () {
      VN.UI.boot(0.12, 'Menyiapkan suara hujan...');
      return VN.Game.init();
    }).then(function () {
      VN.Audio.init();
      warmAudio();
      VN.UI.syncSettings();

      var core = collectCore();
      var total = core.length;
      var doneCount = 0;

      VN.UI.boot(0.2, 'Memuat ilustrasi...');

      var jobs = core.map(function (src) {
        return preloadImage(src).then(function () {
          doneCount++;
          VN.UI.boot(0.2 + (doneCount / total) * 0.7,
            doneCount >= total ? 'Siap.' : 'Memuat ilustrasi... (' + doneCount + '/' + total + ')');
        });
      });

      // never let loading block the front door for longer than ~7s
      return Promise.race([
        Promise.all(jobs),
        new Promise(function (r) { window.setTimeout(r, 7000); })
      ]);
    }).then(function () {
      VN.UI.boot(1, 'Siap.');
      window.setTimeout(function () {
        VN.UI.hideBoot();
        VN.UI.showTitle();
      }, 320);
      // keep warming the rest of the art in the background
      window.setTimeout(function () {
        collectAll().forEach(function (src) {
          var im = new Image(); im.src = src;
        });
      }, 1200);
    }).catch(function (err) {
      console.error('[boot]', err);
      VN.UI.boot(1, 'Ada masalah saat memuat, tapi game tetap bisa dimainkan.');
      window.setTimeout(function () { VN.UI.hideBoot(); VN.UI.showTitle(); }, 600);
    });
  }

  // expose a diagnostic surface for automated playthrough tests
  // Ask the browser to keep the game installed-friendly off the network.
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function () {
        // A new build takes over on its own; show it on the title screen so a
        // returning player never keeps reading an old version by accident. Mid
        // game it waits for the next visit instead of interrupting.
        var reloading = false;
        navigator.serviceWorker.addEventListener('controllerchange', function () {
          if (reloading || document.body.classList.contains('in-game')) return;
          reloading = true;
          location.reload();
        });
      }).catch(function () {});
    });
  }

  window.__vn = {
    chapters: function () { return VN.chapters.map(function (c) { return c.id + ':' + c.beats.length; }); },
    state: function () { return VN.Game.getState(); },
    preload: preloaded,
    scene: function () { return VN.Scene.state(); },
    view: function () { return { fullscreen: VN.View.isFullscreen(), locked: VN.View.isLocked(), touch: VN.View.isTouch() }; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
