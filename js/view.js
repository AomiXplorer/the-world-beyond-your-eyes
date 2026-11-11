/* ============================================================
   View layer: fullscreen, screen orientation, responsive layout.

   FullscreenManager / OrientationManager / ResponsiveLayoutManager.
   Every browser request here is best-effort: the API may be missing,
   may require fullscreen first, or may simply refuse. Nothing in the
   game depends on it working - the layout adapts either way.
   ============================================================ */
(function () {
  'use strict';

  var V = {};
  var appEl = null;
  var inGame = false;
  var touch = null;
  var isFs = false;
  var isLocked = false;
  var subs = [];
  var rafPending = false;

  function fire(evt) {
    subs.forEach(function (fn) { try { fn(evt); } catch (e) {} });
  }

  V.on = function (fn) { subs.push(fn); };

  V.isTouch = function () {
    if (touch === null) {
      touch = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);
    }
    return touch;
  };

  V.isIOS = function () {
    return /iP(hone|ad|od)/.test(navigator.platform || '') ||
      (navigator.userAgent.indexOf('Mac') > -1 && 'ontouchend' in document);
  };

  V.standalone = function () {
    return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  };

  V.supported = function () {
    var d = document.documentElement;
    return {
      fullscreen: !!(d.requestFullscreen || d.webkitRequestFullscreen || d.mozRequestFullScreen || d.msRequestFullscreen),
      orientation: !!(screen.orientation && screen.orientation.lock),
      standalone: V.standalone()
    };
  };

  /* --------------------------------- fullscreen -------------------------------- */
  function fsElement() {
    return document.fullscreenElement || document.webkitFullscreenElement ||
      document.mozFullScreenElement || document.msFullscreenElement || null;
  }

  V.requestFullscreen = function () {
    var el = appEl || document.documentElement;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen ||
      el.mozRequestFullScreen || el.msRequestFullscreen;
    if (!fn) return Promise.resolve(false);
    var r;
    try { r = fn.call(el, { navigationUI: 'hide' }); }
    catch (e) {
      try { r = fn.call(el); } catch (e2) { return Promise.resolve(false); }
    }
    if (r && typeof r.then === 'function') {
      return r.then(function () { return true; }).catch(function () { return false; });
    }
    return Promise.resolve(true);
  };

  V.exitFullscreen = function () {
    var fn = document.exitFullscreen || document.webkitExitFullscreen ||
      document.mozCancelFullScreen || document.msExitFullscreen;
    if (!fn || !fsElement()) return Promise.resolve(false);
    var r;
    try { r = fn.call(document); } catch (e) { return Promise.resolve(false); }
    if (r && typeof r.then === 'function') {
      return r.then(function () { return true; }).catch(function () { return false; });
    }
    return Promise.resolve(true);
  };

  V.toggleFullscreen = function () {
    return fsElement() ? V.exitFullscreen() : V.requestFullscreen();
  };

  /* -------------------------------- orientation -------------------------------- */
  V.lockLandscape = function () {
    if (!(screen.orientation && screen.orientation.lock)) return Promise.resolve(false);
    var r;
    try { r = screen.orientation.lock('landscape'); }
    catch (e) { return Promise.resolve(false); }
    if (r && typeof r.then === 'function') {
      return r.then(function () { isLocked = true; return true; })
        .catch(function () { isLocked = false; return false; });
    }
    isLocked = true;
    return Promise.resolve(true);
  };

  V.unlock = function () {
    if (screen.orientation && screen.orientation.unlock) {
      try { screen.orientation.unlock(); } catch (e) {}
    }
    isLocked = false;
  };

  /* Player pressed New Game / Continue: ask for the real game view. Must be
     called synchronously from the user gesture, before any await. */
  V.enterGameMode = function () {
    var res = { fullscreen: false, locked: false, requested: false };
    if (!V.isTouch()) return Promise.resolve(res);
    res.requested = true;
    return V.requestFullscreen().then(function (fs) {
      res.fullscreen = fs;
      isFs = fs || !!fsElement();
      return V.lockLandscape();
    }).then(function (lk) {
      res.locked = lk;
      V.update();
      fire({ type: 'fullscreen', active: isFs });
      return res;
    });
  };

  V.isFullscreen = function () { return !!fsElement(); };
  V.isLocked = function () { return isLocked; };

  /* ------------------------------ responsive layout ----------------------------- */
  function measure() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var vv = window.visualViewport;
    // Mobile browsers report a viewport that ignores their own chrome; dvh is
    // correct where it exists, and this variable is the fallback everywhere.
    var hh = vv ? Math.round(vv.height) : h;
    document.documentElement.style.setProperty('--app-h', hh + 'px');
    document.documentElement.style.setProperty('--app-w', w + 'px');
    return { w: w, h: hh };
  }

  V.update = function () {
    var m = measure();
    var portrait = m.h > m.w * 1.02;
    var small = Math.min(m.w, m.h) < 760;
    var touchy = V.isTouch();
    var body = document.body;

    body.classList.toggle('layout-portrait', portrait);
    body.classList.toggle('layout-landscape', !portrait);
    body.classList.toggle('is-touch', touchy);
    body.classList.toggle('is-compact', small);
    body.classList.toggle('is-fullscreen', !!fsElement());

    // A phone/tablet held upright cannot show a landscape stage without
    // breaking it, so we ask the player to turn the device instead.
    var needRotate = inGame && portrait && (touchy || small);
    document.documentElement.classList.toggle('need-rotate', needRotate);
    if (needRotate) fire({ type: 'rotate', needed: true });
    return m;
  };

  function scheduleUpdate() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(function () {
      rafPending = false;
      V.update();
    });
  }

  V.setInGame = function (on) {
    inGame = !!on;
    V.update();
    if (!inGame) {
      V.unlock();
      if (fsElement() && !V.isTouch()) V.exitFullscreen();
    }
  };

  V.inGame = function () { return inGame; };

  V.init = function () {
    appEl = document.getElementById('app') || document.body;
    V.update();

    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('orientationchange', function () {
      scheduleUpdate();
      window.setTimeout(scheduleUpdate, 320);
    }, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', scheduleUpdate, { passive: true });

    document.addEventListener('fullscreenchange', function () {
      isFs = !!fsElement();
      document.body.classList.toggle('is-fullscreen', isFs);
      V.update();
      fire({ type: 'fullscreen', active: isFs });
    });

    // Pause the story while the tab or app is in the background.
    document.addEventListener('visibilitychange', function () {
      fire({ type: 'visibility', hidden: document.hidden });
    });
  };

  VN.View = V;
})();
