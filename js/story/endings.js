/* ============================================================
   Four endings + the resolver that decides which one you reach.
   ============================================================ */

/* ------------------------------- TRUE ------------------------------- */
VN.chapters.push({
  id: 'ending_true',
  no: 9,
  kind: 'ending',
  en: 'Beyond the Blue',
  bgm: 'ending_true',
  amb: null,
  rain: false,
  beats: [
    { bg: 'station', veil: true },
    { show: 'shiori', pos: 'right', e: 'neutral' },
    { t: 'Kami berdiri di peron itu, dua orang yang belum tidur, dengan pasir di sepatu dan dua tiket yang sudah tidak berguna.' },
    { w: 'Shiori', t: 'Terus sekarang apa?' },
    { w: 'Ren', t: 'Sekarang aku beli tiket lagi.' },
    { w: 'Shiori', e: 'surprised', t: 'Hah?' },
    { w: 'Ren', t: 'Bulan depan. Aku udah cek, kereta dari sini ke Sapporo itu delapan jam kalau naik yang malam.' },
    { w: 'Ren', t: 'Kalau aku berangkat Jumat malam, aku sampai Sabtu pagi. Bisa pulang Minggu malam. Aku nggak akan bolos sekolah.' },
    { t: 'Dia menatapku cukup lama. Lalu dia mulai tertawa, dan tertawa itu naik terus sampai dia harus menutupi mulutnya dengan dua tangan.' },
    { w: 'Shiori', e: 'laugh', t: 'Kamu ngitung lagi.' },
    { w: 'Ren', t: 'Aku selalu ngitung.' },
    { w: 'Shiori', t: 'Delapan jam.' },
    { w: 'Ren', t: 'Delapan jam.' },
    { w: 'Shiori', e: 'tender', t: 'Itu jauh.' },
    { w: 'Ren', t: 'Iya. Tapi bukan delapan jam yang nggak ada ujungnya.' },

    { t: 'Kereta pertama datang. Pintu terbuka. Dia tidak bergerak.' },
    { w: 'Shiori', t: 'Ren.' },
    { w: 'Ren', t: 'Iya.' },
    { w: 'Shiori', t: 'Aku suka kamu.' },
    { t: 'Aku sudah membayangkan kalimat itu berkali-kali. Di dalam kepala, kalimat itu selalu terdengar seperti sesuatu yang besar, dengan musik dan langit.' },
    { t: 'Yang terjadi justru sebaliknya. Dia mengatakannya dengan suara yang sangat biasa, di peron yang bau besi, sambil memegang tongkat lipat.' },
    { w: 'Shiori', e: 'blush', t: 'Aku udah suka dari lama. Dari hari kamu bilang kopinya kayak kayu kena matahari sore.' },
    { w: 'Ren', t: 'Itu kalimat bodoh.' },
    { w: 'Shiori', t: 'Iya. Itu sebabnya.' },
    { t: 'Aku membuka mulut. Tidak ada yang keluar. Jadi aku melakukan hal yang lebih baik dari bicara: aku meraih tangannya, dan kali ini aku tidak bertanya, karena dia sudah mengulurkan tangannya lebih dulu.' },
    { w: 'Ren', t: 'Aku juga.' },
    { w: 'Shiori', t: 'Aku juga apa?' },
    { w: 'Ren', t: 'Kamu tahu.' },
    { w: 'Shiori', e: 'smile', t: 'Aku mau dengar.' },
    { w: 'Ren', t: 'Aku suka kamu. Dari hari kamu bilang kamu bisa dengar langkahku.' },

    { t: 'Pintu kereta mulai menutup. Dia masuk, dan aku masuk juga, walaupun sekolahku bukan ke arah sana.' },
    { t: 'Kami duduk di gerbong yang sama, dan dia menyandarkan kepalanya ke bahuku, dan aku tidak menghitung apa pun.' },

    { bg: 'cafe_rain', veil: true, rain: true },
    { b: 'cafe' },
    { amb: 'rain_window' },
    { t: 'Empat bulan kemudian, Sapporo sudah turun salju, dan aku sudah tiga kali naik kereta malam.' },
    { t: 'Dia sudah bisa naik kereta sendiri dari asrama ke sekolah. Dia sudah bisa masak tiga menu, dan dua di antaranya benar-benar enak.' },
    { t: 'Malam ini dia menelepon, dan dia bilang sesuatu yang tidak akan aku lupakan.' },
    { w: 'Shiori', t: 'Ren. Aku ke pantai kemarin.' },
    { w: 'Ren', t: 'Sendiri?' },
    { w: 'Shiori', t: 'Sama teman asrama. Tapi yang cerita aku.' },
    { w: 'Shiori', t: 'Aku cerita soal warna. Kuning yang kayak lampu dapur. Jingga yang kayak kulit jeruk kemarin. Matahari yang jadi putih kayak logam dipanasin.' },
    { w: 'Shiori', t: 'Terus temanku bilang, "kok kamu tahu?".' },
    { w: 'Ren', t: 'Terus kamu jawab apa?' },
    { w: 'Shiori', t: 'Aku jawab, "ada yang pernah cerita".' },
    { t: 'Di ujung telepon, dia diam sebentar.' },
    { w: 'Shiori', t: 'Ren. Di sini dingin banget.' },
    { w: 'Ren', t: 'Aku tahu. Kamu udah bilang tiga kali.' },
    { w: 'Shiori', e: 'tender', t: 'Aku bilang lagi biar kamu tahu aku masih di sini.' },

    { bg: 'cafe_rain', veil: true, rain: true },
    { t: 'Sebelum menutup telepon, dia bertanya satu hal, seperti yang selalu dia tanyakan.' },
    { w: 'Shiori', t: 'Besok kamu akan datang lagi, kan?' },
    { w: 'Ren', t: 'Aku akan datang.' },
    { t: 'Dan untuk pertama kalinya, jawaban itu bukan janji. Itu cuma keterangan.' },

    { t: 'Hujan di luar jendela kafe ini masih sama seperti dulu. Dua hujan sekaligus: yang di luar, dan yang di kaca.' },
    { t: 'Bedanya sekarang aku tahu harus menceritakannya ke siapa.' },

    { end: {
      id: 'true',
      kicker: 'True Ending',
      title: 'Beyond the Blue',
      sub: 'Kamu memilih untuk tidak menahan, dan justru karena itu dia tetap tinggal. Di seberang laut, di ujung telepon, di hari yang sama setiap tahun.'
    } }
  ]
});

/* ------------------------------- GOOD ------------------------------- */
VN.chapters.push({
  id: 'ending_good',
  no: 9,
  kind: 'ending',
  en: 'A Promise Remains',
  bgm: 'ending_good',
  amb: null,
  rain: false,
  beats: [
    { bg: 'station', veil: true },
    { show: 'shiori', pos: 'right', e: 'neutral' },
    { t: 'Kereta pertama datang, dan dia masuk, dan aku masuk juga walaupun harus turun dua stasiun kemudian untuk kembali.' },
    { w: 'Shiori', t: 'Kamu salah arah.' },
    { w: 'Ren', t: 'Aku tahu.' },
    { w: 'Shiori', e: 'smile', t: 'Kamu nggak keberatan?' },
    { w: 'Ren', t: 'Aku keberatan. Tapi aku lebih keberatan kalau kamu pulang sendiri.' },

    { t: 'Kami tidak banyak bicara di kereta. Kami cuma duduk, dan tangannya ada di tanganku, dan itu sudah cukup untuk hari itu.' },
    { w: 'Shiori', t: 'Ren. Jarak jauh itu susah.' },
    { w: 'Ren', t: 'Iya.' },
    { w: 'Shiori', t: 'Aku mungkin nggak bisa telepon tiap hari. Aku mungkin capek. Aku mungkin jadi orang yang beda.' },
    { w: 'Ren', t: 'Aku juga.' },
    { w: 'Shiori', e: 'sad', t: 'Terus?' },
    { w: 'Ren', t: 'Terus kita coba aja. Kalau nanti nggak bisa, kita berhenti dengan cara yang bener.' },
    { w: 'Shiori', t: 'Itu bukan jawaban yang romantis.' },
    { w: 'Ren', t: 'Aku bukan orang yang romantis.' },
    { w: 'Shiori', e: 'smile', t: 'Bohong. Kamu bilang kopi itu kayak kayu kena matahari sore.' },

    { bg: 'street_spring', veil: true },
    { t: 'Dua minggu kemudian dia berangkat. Aku tidak ikut ke stasiun, karena dia bilang kalau aku ikut, dia akan menangis di depan orang banyak dan dia tidak mau.' },
    { t: 'Jadi aku berdiri di depan kafe, di bawah atap yang bocor di dua tempat, dan aku menunggu pesan.' },
    { t: '"Udah naik kereta. Kursinya deket jendela. Terus ada kerbau yang ngeliatin kereta."' },
    { t: 'Aku tertawa sendirian di trotoar sampai ada orang yang menoleh.' },

    { bg: 'cafe_evening', veil: true },
    { b: 'piano' },
    { t: 'Tiga bulan pertama itu berat dengan cara yang membosankan. Bukan drama. Cuma sepi yang datang pelan-pelan, seperti hujan gerimis yang tidak membuat orang berteduh.' },
    { t: 'Kami bertengkar dua kali. Yang pertama karena aku tidak menelepon selama empat hari dan aku pikir itu tidak apa-apa. Yang kedua karena dia tidak bilang dia sedang sakit.' },
    { t: 'Kami selesai dua kali, dan keduanya bukan karena kami berhenti sayang. Kami selesai karena kami sama-sama tahu kami belum mau berhenti.' },

    { t: 'Desember. Aku duduk di meja ujung dengan dua cangkir, dan Pak Ogata tidak bertanya kenapa yang kedua tidak diminum.' },
    { sfx: 'phone' },
    { t: 'Telepon masuk jam sebelas malam.' },
    { w: 'Shiori', t: 'Ren. Aku capek.' },
    { w: 'Ren', t: 'Oke.' },
    { w: 'Shiori', t: 'Bukan capek sama kamu. Capek aja. Hari ini berat.' },
    { w: 'Ren', t: 'Oke. Mau cerita?' },
    { w: 'Shiori', t: 'Nggak. Aku cuma mau telepon.' },
    { t: 'Jadi kami diam di telepon selama enam menit, dan aku mendengar kulkas asramanya berdengung, dan dia mendengar kasir kafe ini berbunyi.' },
    { w: 'Shiori', t: 'Itu kasirnya, ya?' },
    { w: 'Ren', t: 'Iya.' },
    { w: 'Shiori', e: 'tender', t: 'Bunyinya masih kayak mesin jahit.' },

    { t: 'Kami tidak bilang "selamanya". Kami sudah belajar bahwa kalimat itu terlalu mahal.' },
    { t: 'Yang kami bilang cuma ini, setiap kali menutup telepon:' },
    { w: 'Shiori', t: 'Besok kamu akan datang lagi, kan?' },
    { w: 'Ren', t: 'Aku akan datang.' },
    { t: 'Dan untuk sementara, itu cukup.' },

    { end: {
      id: 'good',
      kicker: 'Good Ending',
      title: 'A Promise Remains',
      sub: 'Kamu memilih untuk menunggu, dan dia memilih untuk kembali. Bukan kisah yang selesai, tapi janji yang masih dipegang dari dua kota yang berbeda.'
    } }
  ]
});

/* ------------------------------ NORMAL ------------------------------ */
VN.chapters.push({
  id: 'ending_normal',
  no: 9,
  kind: 'ending',
  en: 'The Sound of Summer',
  bgm: 'ending_normal',
  amb: null,
  rain: false,
  beats: [
    { bg: 'station', veil: true },
    { show: 'shiori', pos: 'right', e: 'sad' },
    { t: 'Kereta pertama datang. Dia masuk. Aku tidak masuk.' },
    { w: 'Shiori', t: 'Ren.' },
    { w: 'Ren', t: 'Iya.' },
    { w: 'Shiori', t: 'Aku mau kamu simpan fotonya.' },
    { w: 'Ren', t: 'Foto apa?' },
    { w: 'Shiori', t: 'Yang kamu ambil waktu kita di pantai. Kamu ambil satu, kan?' },
    { t: 'Aku mengeluarkan kamera. Aku memang mengambil satu. Meja tidak, cangkir tidak. Cuma langit, laut, dan ujung syal ibunya di sudut kanan.' },
    { w: 'Shiori', t: 'Bagus.' },
    { w: 'Ren', t: 'Kamu belum tahu fotonya.' },
    { w: 'Shiori', e: 'smile', t: 'Aku tahu kamu. Kamu nggak mungkin salah.' },

    { t: 'Pintu kereta menutup. Dia mengangkat tangan sedikit, dan aku mengangkat tangan juga, dan itu satu-satunya perpisahan yang kami punya.' },
    { sfx: 'train' },
    { hide: 'shiori' },

    { bg: 'cafe_evening', veil: true },
    { t: 'September. Aku masih datang ke kafe. Aku tidak tahu kenapa, karena tidak ada yang menunggu di sini.' },
    { t: 'Pak Ogata tidak bertanya. Dia cuma mulai menaruh dua cangkir setiap kali aku duduk di meja ujung. Yang kedua selalu dingin. Aku selalu meminumnya.' },
    { show: 'mio', pos: 'left', e: 'neutral' },
    { w: 'Mio', t: 'Kamu masih ke sini.' },
    { w: 'Ren', t: 'Kopinya enak.' },
    { w: 'Mio', e: 'smirk', t: 'Kopinya pahit, Ren.' },
    { w: 'Mio', e: 'sad', t: 'Kamu nggak apa-apa?' },
    { w: 'Ren', t: 'Aku nggak tahu. Tapi aku nggak hilang.' },
    { w: 'Mio', t: 'Itu cukup.' },

    { t: 'Dia mengirimi aku pesan sekali. Bukan pesan sayang. Cuma foto: sebuah jendela kereta, dengan pantulan lampu di kaca.' },
    { t: '"Ini jendela di asramaku. Kalau hujan, warnanya jadi dua. Aku inget kamu pernah bilang gitu."' },
    { t: 'Aku tidak membalas saat itu. Aku membalas tiga hari kemudian, dan dia menjawab esok harinya, dan pelan-pelan jeda di antara kami melebar sampai jadi normal.' },

    { bg: 'beach_sunset', veil: true },
    { t: 'Tahun berikutnya, aku pergi ke pantai sendiri.' },
    { t: 'Aku duduk di tempat yang sama. Aku mengambil satu foto. Lalu aku menutup mata, dan aku mendengarkan, dan aku mengerti kenapa dia suka yang pelan.' },
    { t: 'Semua orang di pantai itu berhenti bicara, dan untuk satu menit, dunia menjadi tempat yang paling sunyi.' },
    { t: 'Aku tidak sedih. Itu yang paling mengejutkan. Aku cuma merasa sedang berdiri di dalam sesuatu yang sudah selesai dengan baik.' },

    { bg: 'cafe_rain', veil: true, rain: true },
    { amb: 'rain_window' },
    { t: 'Sekarang kalau hujan, aku masih memotret. Tapi aku tidak lagi memotret dua hujan sekaligus.' },
    { t: 'Aku memotret satu saja, dan aku menamainya dengan benar, dan aku tidak menghapusnya.' },
    { t: 'Musim panas itu tidak selesai. Dia cuma berhenti, seperti lagu yang dimatikan di tengah, dan suaranya tetap ada di kepala.' },

    { end: {
      id: 'normal',
      kicker: 'Normal Ending',
      title: 'The Sound of Summer',
      sub: 'Kamu memilih untuk melepaskan sebelum ada yang terluka, dan kalian berpisah sebagai dua orang yang pernah benar-benar saling mengenal. Tidak semua hal harus jadi kisah cinta. Beberapa hal cukup jadi kenangan yang tidak kamu sesali.'
    } }
  ]
});

/* ------------------------------- BAD ------------------------------- */
VN.chapters.push({
  id: 'ending_bad',
  no: 9,
  kind: 'ending',
  en: 'An Empty Café',
  bgm: 'ending_bad',
  amb: null,
  rain: false,
  beats: [
    { bg: 'station', veil: true },
    { show: 'shiori', pos: 'right', e: 'sad' },
    { t: 'Kereta pertama datang. Dia berdiri, mengambil tasnya, dan mencari ujung bangku dengan tangannya.' },
    { w: 'Shiori', t: 'Ren.' },
    { w: 'Ren', t: 'Iya.' },
    { w: 'Shiori', t: 'Makasih sudah bawa aku ke pantai.' },
    { w: 'Shiori', t: 'Beneran. Itu hari paling bagus yang pernah aku punya.' },
    { t: 'Dia menunggu. Aku tahu dia menunggu, karena dia berdiri di sana lebih lama dari yang diperlukan.' },
    { t: 'Aku tidak bilang apa-apa.' },
    { w: 'Shiori', e: 'cry', t: 'Oke.' },
    { w: 'Shiori', t: 'Oke. Dadah, Ren.' },
    { sfx: 'train' },
    { hide: 'shiori' },
    { t: 'Pintu menutup. Kereta berjalan. Dan aku berdiri di peron sampai matahari naik dan petugas kebersihan menyapuku dua kali.' },

    { bg: 'cafe_evening', veil: true },
    { t: 'Dia berangkat ke Sapporo seminggu kemudian. Aku tahu dari cerita Mio.' },
    { show: 'mio', pos: 'left', e: 'angry' },
    { w: 'Mio', t: 'Dia pergi.' },
    { w: 'Ren', t: 'Iya.' },
    { w: 'Mio', t: 'Kamu nggak nanya ke aku sama sekali.' },
    { w: 'Ren', t: 'Aku tahu.' },
    { w: 'Mio', e: 'sad', t: 'Ren. Kamu tahu masalah kamu apa? Kamu takut sama hal yang belum terjadi, jadi kamu nggak ngelakuin apa-apa.' },
    { w: 'Mio', t: 'Terus hal yang kamu takutin itu terjadi. Terus kamu bilang "kan aku udah duga".' },
    { w: 'Ren', t: '...' },
    { w: 'Mio', t: 'Kamu nggak salah duga, Ren. Kamu bikin itu jadi bener.' },

    { hide: 'all' },
    { bg: 'cafe_night', veil: true },
    { t: 'Aku berhenti datang ke kafe. Bukan karena keputusan. Cuma karena suatu hari aku sadar sudah dua bulan.' },
    { t: 'Folder dengan tiga puluh tujuh foto itu masih ada di laptopku. Aku tidak membukanya, tapi juga tidak menghapusnya.' },
    { t: 'Suatu malam, waktu sudah tidak tahan, aku membukanya. Semuanya foto meja, dua cangkir, dan tangan yang menangkup.' },
    { t: 'Di foto terakhir, tangan itu tidak ada. Cuma meja kosong dan cangkir yang belum diminum.' },
    { t: 'Aku menutupnya lagi.' },

    { bg: 'cafe_rain', veil: true, rain: true },
    { amb: 'rain_window' },
    { b: 'rain' },
    { t: 'Hujan pertama bulan Juni, setahun kemudian.' },
    { t: 'Aku membuka pintu Kissa Tsukimi. Bel pintunya masih berbunyi sama. Kasirnya masih berbunyi seperti mesin jahit.' },
    { w: 'Pemilik kafe', t: 'Ren. Lama nggak kelihatan.' },
    { w: 'Ren', t: 'Sibuk, Pak.' },
    { w: 'Pemilik kafe', t: 'Kopi yang pahit?' },
    { w: 'Ren', t: 'Iya.' },
    { t: 'Aku duduk di meja ujung. Meja yang ada colokannya.' },
    { t: 'Di seberang, tidak ada siapa-siapa. Tidak ada buku Braille yang jatuh. Tidak ada suara tongkat.' },
    { t: 'Aku memotret jendela. Hujan, dan lampu jalan yang pecah di genangan air.' },
    { sfx: 'shutter' },
    { t: 'Satu foto. Tidak bagus.' },
    { t: 'Aku duduk di sana sampai kafe tutup, dan Pak Ogata tidak menyalakan radio, dan hujan turun sepanjang malam seperti sedang menyelesaikan sesuatu yang tertunda.' },

    { end: {
      id: 'bad',
      kicker: 'Bad Ending',
      title: 'An Empty Café',
      sub: 'Kamu tidak pernah bilang apa yang sebenarnya kamu rasakan, dan dia tidak bisa membaca yang tidak kamu ucapkan. Beberapa pintu hanya terbuka sekali.'
    } }
  ]
});

/* ============================================================
   Ending registry + resolver
   ============================================================ */
VN.endings = {
  true:   { chapter: 'ending_true',   name: 'Beyond the Blue',    label: 'True Ending',   bgm: 'ending_true' },
  good:   { chapter: 'ending_good',   name: 'A Promise Remains',  label: 'Good Ending',   bgm: 'ending_good' },
  normal: { chapter: 'ending_normal', name: 'The Sound of Summer', label: 'Normal Ending', bgm: 'ending_normal' },
  bad:    { chapter: 'ending_bad',    name: 'An Empty Café',      label: 'Bad Ending',    bgm: 'ending_bad' }
};

VN.Endings = {
  resolve: function (s) {
    var f = s.flags || {};
    var bond = s.bond || 0;
    var trust = s.trust || 0;

    // True: honest about the hard thing, chose her freedom over your fear.
    if (f.promiseBeach && f.selfless && f.confessed && bond >= 40 && trust >= 46) return 'true';

    // Good: you stayed, she came back, distance and all.
    if (f.confessed && bond >= 26) return 'good';

    // Normal: you let go on purpose, and it did not destroy either of you.
    if (f.friendsEnding || trust >= 34 || bond >= 14) return 'normal';

    return 'bad';
  },

  record: function (key, state) {
    if (!VN.Save) return;
    return VN.Save.getMeta('endings', {}).then(function (map) {
      map = map || {};
      map[key] = { at: Date.now(), bond: state.bond, trust: state.trust };
      return VN.Save.setMeta('endings', map);
    });
  },

  startFromChapter: function (id) {
    var meta = VN.CHAPTER_META.filter(function (m) { return m.id === id; })[0] || { no: 1 };
    var base = 16 + meta.no * 2;
    var st = {
      ch: id, pc: 0,
      bond: base, trust: base,
      flags: {},
      bg: null, bgm: null, amb: null, rain: false,
      sprites: { left: null, center: null, right: null },
      history: [], lines: 0, startedAt: Date.now()
    };
    if (meta.no >= 3) { st.flags.promiseBeach = true; st.flags.willCome = true; }
    if (meta.no >= 5) { st.flags.honestVow = true; st.flags.awareFeelings = true; }
    if (meta.no >= 6) { st.flags.beachConfirmed = true; st.flags.askedHand = true; }
    st.flags.preset = true;
    VN.Game.restore(st);
    if (VN.UI && VN.UI.toast) VN.UI.toast('Mulai dari Bab ' + String(meta.no).padStart(2, '0'));
  }
};
