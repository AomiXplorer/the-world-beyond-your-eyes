/* ============================================================
   The World Beyond Your Eyes - configuration & asset manifest
   ============================================================ */
window.VN = window.VN || {};

(function () {
  'use strict';

  // Base path for assets. The single-file build swaps this to a CDN prefix.
  VN.ASSET = 'assets/';

  VN.TITLE = 'The World Beyond Your Eyes';
  VN.TITLE_ID = 'Dunia di Balik Matamu';
  VN.VERSION = '1.0.1';

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

  // Falling-rain overlay is only painted over open-air locations.
  // Indoors the rain lives in the artwork (window) and in the ambience, never on
  // top of the room - it read as blue stripes across interior scenes.
  VN.RAIN_BG = {
    street_spring: true
  };

  VN.SPR = {
    shiori: {
      neutral:   'char/shiori_neutral.webp',
      smile:     'char/shiori_smile.webp',
      sad:       'char/shiori_sad.webp',
      cry:       'char/shiori_cry.webp',
      blush:     'char/shiori_blush.webp',
      surprised: 'char/shiori_surprised.webp',
      angry:     'char/shiori_angry.webp',
      laugh:     'char/shiori_laugh.webp',
      tender:    'char/shiori_tender.webp'
    },
    mio: {
      neutral:   'char/mio_neutral.webp',
      smirk:     'char/mio_smirk.webp',
      surprised: 'char/mio_surprised.webp',
      sad:       'char/mio_sad.webp',
      laugh:     'char/mio_laugh.webp',
      angry:     'char/mio_angry.webp'
    }
  };

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
    { id: 'keyart',     bg: 'keyart',     title: 'Rain, and a Girl',        sub: 'Dari judul' },
    { id: 'cg_festival',bg: 'cg_festival',title: 'Festival Musim Panas',     sub: 'Bab 6' },
    { id: 'cg_beach',   bg: 'cg_beach',   title: 'The Last Sunset',         sub: 'Bab 7' },
    { id: 'cg_ending',  bg: 'cg_ending',  title: 'Beyond the Blue',         sub: 'True Ending' }
  ];

  VN.CREDITS = [
    ['Cerita & Skenario', 'The World Beyond Your Eyes'],
    ['Karakter', 'Ren Takahashi, Shiori Amane, Mio Kanzaki'],
    ['Ilustrasi', 'Dibuat dengan AI image generation, arahan seni manual'],
    ['Musik & Sound', 'Skor orisinal hasil sintesis, dibuat khusus untuk game ini'],
    ['Engine', 'Vanilla JavaScript, tanpa framework'],
    ['Terima kasih', 'Untuk semua orang yang pernah menunggu seseorang di bawah hujan']
  ];

  // Meta about the save format, bumped if the shape changes.
  VN.SAVE_VERSION = 1;
})();
