/* ============================================================
   Persistence: IndexedDB with a localStorage fallback.
   Slots: 'auto' plus 1..8. Meta: settings, seen lines,
   unlocked chapters and gallery, endings seen.
   ============================================================ */
(function () {
  'use strict';

  var DB_NAME = 'twbye';
  var DB_VER = 1;
  var STORE = 'kv';

  var db = null;
  var useFallback = false;
  var mem = {};

  var DEFAULT_SETTINGS = {
    bgm: 0.7,
    sfx: 0.8,
    voice: 0.85,
    mute: false,
    textSpeed: 55,
    autoDelay: 50,
    reduceMotion: false
  };

  function lsGet(k) {
    try { var v = localStorage.getItem('twbye:' + k); return v === null ? null : JSON.parse(v); }
    catch (e) { return null; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem('twbye:' + k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }
  function lsDel(k) { try { localStorage.removeItem('twbye:' + k); } catch (e) {} }

  function open() {
    return new Promise(function (resolve) {
      if (!window.indexedDB) { useFallback = true; resolve(); return; }
      var req;
      try { req = indexedDB.open(DB_NAME, DB_VER); }
      catch (e) { useFallback = true; resolve(); return; }
      var settled = false;
      var to = setTimeout(function () {
        if (!settled) { settled = true; useFallback = true; resolve(); }
      }, 2600);

      req.onupgradeneeded = function (ev) {
        var d = ev.target.result;
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
      };
      req.onsuccess = function (ev) {
        if (settled) return;
        settled = true; clearTimeout(to);
        db = ev.target.result;
        resolve();
      };
      req.onerror = function () {
        if (settled) return;
        settled = true; clearTimeout(to);
        useFallback = true; resolve();
      };
      req.onblocked = function () {
        if (settled) return;
        settled = true; clearTimeout(to);
        useFallback = true; resolve();
      };
    });
  }

  function idbGet(k) {
    return new Promise(function (resolve) {
      if (useFallback || !db) { resolve(mem[k] !== undefined ? mem[k] : lsGet(k)); return; }
      try {
        var tx = db.transaction(STORE, 'readonly');
        var r = tx.objectStore(STORE).get(k);
        r.onsuccess = function () { resolve(r.result === undefined ? null : r.result); };
        r.onerror = function () { resolve(null); };
      } catch (e) { resolve(null); }
    });
  }

  function idbSet(k, v) {
    return new Promise(function (resolve) {
      mem[k] = v;
      if (useFallback || !db) { lsSet(k, v); resolve(true); return; }
      try {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(v, k);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { lsSet(k, v); resolve(false); };
      } catch (e) { lsSet(k, v); resolve(false); }
    });
  }

  function idbDel(k) {
    return new Promise(function (resolve) {
      delete mem[k];
      if (useFallback || !db) { lsDel(k); resolve(true); return; }
      try {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(k);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { lsDel(k); resolve(false); };
      } catch (e) { lsDel(k); resolve(false); }
    });
  }

  var S = {};

  S.init = function () {
    return open().then(function () {
      S.usingFallback = useFallback;
      return useFallback;
    });
  };

  /* ---------------------------- settings ---------------------------- */
  var settingsCache = null;

  S.getSettings = function () {
    if (settingsCache) return settingsCache;
    var raw = lsGet('settings') || {};
    var out = {};
    for (var k in DEFAULT_SETTINGS) {
      out[k] = (raw[k] === undefined || raw[k] === null) ? DEFAULT_SETTINGS[k] : raw[k];
    }
    settingsCache = out;
    return out;
  };

  S.setSettings = function (patch) {
    var s = S.getSettings();
    for (var k in patch) s[k] = patch[k];
    settingsCache = s;
    lsSet('settings', s);
    return s;
  };

  /* ------------------------------ meta ------------------------------ */
  S.getMeta = function (key, dflt) {
    return idbGet('meta:' + key).then(function (v) {
      return (v === null || v === undefined) ? dflt : v;
    });
  };

  S.setMeta = function (key, val) {
    return idbSet('meta:' + key, val);
  };

  /* ------------------------------ slots ------------------------------ */
  S.getSlot = function (slot) {
    return idbGet('slot:' + slot).then(function (v) { return v || null; });
  };

  S.putSlot = function (slot, data) {
    return idbSet('slot:' + slot, data);
  };

  S.delSlot = function (slot) {
    return idbDel('slot:' + slot);
  };

  S.allSlots = function () {
    var out = [];
    var jobs = [];
    ['auto', '1', '2', '3', '4', '5', '6', '7', '8'].forEach(function (s) {
      jobs.push(S.getSlot(s).then(function (v) { out.push({ slot: s, data: v }); }));
    });
    return Promise.all(jobs).then(function () {
      return out.sort(function (a, b) {
        if (a.slot === 'auto') return -1;
        if (b.slot === 'auto') return 1;
        return parseInt(a.slot, 10) - parseInt(b.slot, 10);
      });
    });
  };

  /* ---------------------------- wipe data ---------------------------- */
  S.clearSaves = function () {
    return S.allSlots().then(function (list) {
      return Promise.all(list.filter(function (x) { return x.data; })
        .map(function (x) { return S.delSlot(x.slot); }));
    });
  };

  S.clearEverything = function () {
    var keys = ['meta:seen', 'meta:chapters', 'meta:gallery', 'meta:endings', 'meta:last'];
    var jobs = keys.map(function (k) { return idbDel(k); });
    jobs.push(S.clearSaves());
    lsDel('settings');
    settingsCache = null;
    Object.keys(mem).forEach(function (k) { delete mem[k]; });
    return Promise.all(jobs);
  };

  S.latestSave = function () {
    return S.allSlots().then(function (list) {
      var best = null;
      list.forEach(function (x) {
        if (!x.data) return;
        if (!best || (x.data.savedAt || 0) > (best.data.savedAt || 0)) best = x;
      });
      return best;
    });
  };

  S.DEFAULTS = DEFAULT_SETTINGS;

  VN.Save = S;
})();
