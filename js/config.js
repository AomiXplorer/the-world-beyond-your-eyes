/* ============================================================
   The World Beyond Your Eyes - configuration & asset manifest
   v2.1.0 - anime VN art direction, character sprite system
   ============================================================ */
window.VN = window.VN || {};

(function () {
  'use strict';

  VN.ASSET = 'assets/';
  VN.TITLE = 'The World Beyond Your Eyes';
  VN.TITLE_ID = 'Dunia di Balik Matamu';
  VN.VERSION = '2.1.0';
  VN.SAVE_VERSION = 3;

  /* ------------------------------ backgrounds ------------------------------ */
  VN.BG = {
    cafe_rain:     'bg/cafe_rain.jpg',
    cafe_evening:  'bg/cafe_evening.jpg',
    cafe_night:    'bg/cafe_night.jpg',
    street_spring: 'bg/street_spring.jpg',
    classroom:     'bg/classroom.jpg',
    station:       'bg/station.jpg',
    festival:      'bg/festival.jpg',
    shiori_room:   'bg/shiori_room.jpg',
    beach_sunset:  'bg/beach_sunset.jpg',
    beach_morning: 'bg/beach_morning.jpg',
    keyart:        'bg/keyart.jpg',
    cg_beach:      'bg/cg_beach.jpg',
    cg_festival:   'bg/cg_festival.jpg',
    cg_ending:     'bg/cg_ending.jpg'
  };

  /* Rain is painted only over open-air locations. Indoors the rain lives in the
     artwork and in the ambience, never as stripes across the room. */
  VN.RAIN_BG = { street_spring: true };

  /* ------------------------------ characters ------------------------------ */
  /* Standing sprites: 1100x1650 canvas, transparent, bottom anchored, head to
     feet. One transparent PNG per expression, generated for this project. */
  VN.CHARACTERS = {
    shiori: { name: 'Shiori Amane',   color: '#e0b463', sprite: true },
    mio:    { name: 'Mio Kanzaki',    color: '#c86b62', sprite: true },
    ren:    { name: 'Ren Takahashi',  color: '#8fa7bb', sprite: false }
  };

  VN.CHAR = {
    shiori: {
      neutral:   'characters/shiori/neutral.webp',
      smile:     'characters/shiori/smile.webp',
      laugh:     'characters/shiori/laugh.webp',
      sad:       'characters/shiori/sad.webp',
      tender:    'characters/shiori/tender.webp',
      surprised: 'characters/shiori/surprised.webp',
      blush:     'characters/shiori/blush.webp',
      angry:     'characters/shiori/angry.webp',
      cry:       'characters/shiori/cry.webp'
    },
    mio: {
      neutral:   'characters/mio/neutral.webp',
      smirk:     'characters/mio/smirk.webp',
      surprised: 'characters/mio/surprised.webp',
      sad:       'characters/mio/sad.webp'
      /* laugh and angry have no render yet: the alias table below borrows the
         closest face and the stage adds the matching anime emote glyph. */
    },
    ren: {
      neutral:   'characters/ren/neutral.webp'
    }
  };

  /* Extra expression words a script may use, mapped onto a shipped asset. */
  VN.EXPR_ALIAS = {
    shiori: {
      happy: 'smile', gentle: 'tender', shy: 'blush', embarrassed: 'blush',
      crying: 'cry', soft: 'tender', worried: 'sad', calm: 'neutral',
      excited: 'laugh', smirk: 'smile', tease: 'smile'
    },
    mio: {
      happy: 'smirk', gentle: 'neutral', shy: 'surprised', embarrassed: 'surprised',
      cry: 'sad', crying: 'sad', soft: 'neutral', worried: 'sad',
      calm: 'neutral', excited: 'smirk', annoyed: 'smirk', smile: 'smirk',
      laugh: 'smirk', angry: 'smirk', cry: 'sad'
    },
    ren: {
      happy: 'neutral', sad: 'neutral', surprised: 'neutral', angry: 'neutral',
      smile: 'neutral', gentle: 'neutral', calm: 'neutral'
    }
  };

  /* Legacy accessor - every story file keeps working untouched. */
  VN.SPR = VN.CHAR;

  /* Two of Mio's scripted expressions have no dedicated render in this build.
     Instead of borrowing a face that reads wrong, the engine keeps the closest
     shipped face and adds the emote glyph anime VNs use for that beat. */
  VN.EMOTE = {
    mio: { laugh: 'spark', angry: 'anger', annoyed: 'anger' }
  };

  /* True when the character actually has a rendered face for this expression. */
  VN.isExact = function (id, expr) {
    var set = VN.CHAR[id];
    return !!(set && expr && set[expr]);
  };

  VN.resolveSprite = function (id, expr) {
    var set = VN.CHAR[id];
    if (!set) return null;
    var e = expr || 'neutral';
    if (set[e]) return set[e];
    var al = (VN.EXPR_ALIAS[id] || {})[e];
    if (al && set[al]) return set[al];
    return set.neutral || null;
  };

  /* --------------------------------- audio --------------------------------- */
  VN.BGM = {
    cafe:          'audio/bgm/cafe.mp3',
    rain:          'audio/bgm/rain.mp3',
    piano:         'audio/bgm/piano.mp3',
    summer:        'audio/bgm/summer.mp3',
    cinematic:     'audio/bgm/cinematic.mp3',
    ending_true:   'audio/bgm/ending_true.mp3',
    ending_good:   'audio/bgm/ending_good.mp3',
    ending_normal: 'audio/bgm/ending_normal.mp3',
    ending_bad:    'audio/bgm/ending_bad.mp3'
  };

  VN.SFX = {
    rain_loop:   'audio/sfx/rain_loop.mp3',
    rain_window: 'audio/sfx/rain_window.mp3',
    waves:       'audio/sfx/waves.mp3',
    wind:        'audio/sfx/wind.mp3',
    train:       'audio/sfx/train.mp3',
    footsteps:   'audio/sfx/footsteps.mp3',
    door_bell:   'audio/sfx/door_bell.mp3',
    cup:         'audio/sfx/cup.mp3',
    crowd:       'audio/sfx/crowd.mp3',
    ui_click:    'audio/sfx/ui_click.mp3',
    ui_hover:    'audio/sfx/ui_hover.mp3',
    ui_confirm:  'audio/sfx/ui_confirm.mp3',
    page:        'audio/sfx/page.mp3',
    shutter:     'audio/sfx/shutter.mp3',
    heartbeat:   'audio/sfx/heartbeat.mp3',
    phone:       'audio/sfx/phone.mp3'
  };

  // No voice pack ships with this build; the engine skips missing clips.
  VN.HAS_VOICE = false;

  // Chapter registry - story files push into this.
  VN.chapters = [];
  VN.endings = {};

  VN.CHAPTER_META = [
    { id: 'ch01', no: 1, en: 'A Girl Who Listens to the Rain', id_title: 'Gadis yang Mendengarkan Hujan' },
    { id: 'ch02', no: 2, en: 'The World I Cannot See',        id_title: 'Dunia yang Tak Terlihat' },
    { id: 'ch03', no: 3, en: 'A Small Promise',               id_title: 'Sebuah Janji Kecil' },
    { id: 'ch04', no: 4, en: 'The Voice I Remember',          id_title: 'Suara yang Kuingat' },
    { id: 'ch05', no: 5, en: 'The Secret Behind Her Smile',   id_title: 'Rahasia di Balik Senyumnya' },
    { id: 'ch06', no: 6, en: 'An Unfinished Summer',          id_title: 'Musim Panas yang Belum Selesai' },
    { id: 'ch07', no: 7, en: 'The Last Sunset',               id_title: 'Matahari Terbenam Terakhir' },
    { id: 'ch08', no: 8, en: 'Beyond What Eyes Can See',      id_title: 'Melampaui yang Bisa Dilihat Mata' }
  ];

  VN.GALLERY = [
    { id: 'keyart',      bg: 'keyart',      title: 'Rain, and a Girl',    sub: 'Dari judul' },
    { id: 'cg_festival', bg: 'cg_festival', title: 'Festival Musim Panas', sub: 'Bab 6' },
    { id: 'cg_beach',    bg: 'cg_beach',    title: 'The Last Sunset',     sub: 'Bab 7' },
    { id: 'cg_ending',   bg: 'cg_ending',   title: 'Beyond the Blue',     sub: 'True Ending' }
  ];

  VN.CREDITS = [
    ['Cerita & Skenario', 'The World Beyond Your Eyes'],
    ['Karakter', 'Ren Takahashi, Shiori Amane, Mio Kanzaki'],
    ['Ilustrasi karakter', 'Sprite anime 2D, cel shading, digambar khusus untuk versi ini'],
    ['Latar', 'Ilustrasi anime, 1920x1080'],
    ['Musik & Sound', 'Skor orisinal hasil sintesis, dibuat khusus untuk game ini'],
    ['Engine', 'Vanilla JavaScript, tanpa framework'],
    ['Terima kasih', 'Untuk semua orang yang pernah menunggu seseorang di bawah hujan']
  ];
})();
