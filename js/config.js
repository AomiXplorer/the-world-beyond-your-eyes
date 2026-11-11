/* ============================================================
   The World Beyond Your Eyes - configuration & asset manifest
   v2.2.1 - fullscreen from the first tap, a title screen that fits the
   rotated landscape shell, half-body waist-up character sprites
   ============================================================ */
window.VN = window.VN || {};

(function () {
  'use strict';

  VN.ASSET = 'assets/';
  VN.TITLE = 'The World Beyond Your Eyes';
  VN.TITLE_ID = 'Dunia di Balik Matamu';
  VN.VERSION = '2.2.1';
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
  /* Half-body sprites. Every face is generated as a waist-up illustration on a
     1200x1500 transparent canvas and normalised so the head sits at the top
     edge and the waist at the bottom edge. Nothing is a full-body render cut
     down by CSS: the composition itself stops at the waist. */
  VN.SPRITE = {
    canvas: [1200, 1500],
    anchor: 'waist',
    height: 0.82,       /* share of stage height, wide screens */
    heightSmall: 0.92   /* short landscape phones */
  };

  VN.CHARACTERS = {
    shiori: { name: 'Shiori Amane',   color: '#e0b463', sprite: true },
    mio:    { name: 'Mio Kanzaki',    color: '#c86b62', sprite: true },
    ren:    { name: 'Ren Takahashi',  color: '#8fa7bb', sprite: false }
  };

  /* The ten faces rendered for each heroine. Same head size, same shoulders,
     same crop in every one, so an expression swap never moves the character. */
  VN.FACES = ['neutral', 'smile', 'tender', 'laugh', 'shy',
              'blush', 'sad', 'cry', 'surprised', 'angry'];

  VN.CHAR = {
    shiori: {
      neutral:   'characters/shiori/neutral.webp',
      smile:     'characters/shiori/smile.webp',
      tender:    'characters/shiori/tender.webp',
      laugh:     'characters/shiori/laugh.webp',
      shy:       'characters/shiori/shy.webp',
      blush:     'characters/shiori/blush.webp',
      sad:       'characters/shiori/sad.webp',
      cry:       'characters/shiori/cry.webp',
      surprised: 'characters/shiori/surprised.webp',
      angry:     'characters/shiori/angry.webp'
    },
    mio: {
      neutral:   'characters/mio/neutral.webp',
      smile:     'characters/mio/smile.webp',
      smirk:     'characters/mio/smirk.webp',
      tender:    'characters/mio/tender.webp',
      laugh:     'characters/mio/laugh.webp',
      shy:       'characters/mio/shy.webp',
      blush:     'characters/mio/blush.webp',
      sad:       'characters/mio/sad.webp',
      cry:       'characters/mio/cry.webp',
      surprised: 'characters/mio/surprised.webp',
      angry:     'characters/mio/angry.webp'
    },
    ren: {
      neutral:   'characters/ren/neutral.webp'
    }
  };

  /* Extra expression words a script may use, mapped onto a shipped face. */
  VN.EXPR_ALIAS = {
    shiori: {
      happy: 'laugh', gentle: 'tender', soft: 'tender', calm: 'neutral',
      shy: 'shy', embarrassed: 'blush', bashful: 'shy', flustered: 'blush',
      crying: 'cry', tears: 'cry', worried: 'sad', nervous: 'shy',
      excited: 'laugh', tease: 'smile', smirk: 'smile', annoyed: 'angry',
      proud: 'smile', moved: 'cry'
    },
    mio: {
      happy: 'laugh', gentle: 'tender', soft: 'tender', calm: 'neutral',
      embarrassed: 'blush', bashful: 'shy', flustered: 'blush',
      crying: 'cry', tears: 'cry', worried: 'sad', nervous: 'shy',
      excited: 'laugh', tease: 'smirk', annoyed: 'angry',
      proud: 'smirk', moved: 'tender'
    },
    ren: {
      happy: 'neutral', sad: 'neutral', surprised: 'neutral', angry: 'neutral',
      smile: 'neutral', gentle: 'neutral', calm: 'neutral', shy: 'neutral',
      blush: 'neutral', tender: 'neutral', laugh: 'neutral', cry: 'neutral'
    }
  };

  /* Legacy accessor - every story file keeps working untouched. */
  VN.SPR = VN.CHAR;

  /* Every expression is a real render now, so no stand-in glyphs are needed.
     The stage still knows how to draw them if a future face is missing. */
  VN.EMOTE = {};

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
