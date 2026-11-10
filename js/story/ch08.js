/* Chapter 08 - Beyond What Eyes Can See */
VN.chapters.push({
  id: 'ch08',
  no: 8,
  kind: 'chapter',
  en: 'Beyond What Eyes Can See',
  id_title: 'Melampaui yang Bisa Dilihat Mata',
  bgm: 'cinematic',
  amb: 'waves',
  rain: false,
  beats: [
    { card: { no: 'Bab 08', en: 'Beyond What Eyes Can See', id: 'Melampaui yang Bisa Dilihat Mata' } },

    { bg: 'station', veil: true },
    { t: 'Kami menghabiskan malam di bangku kayu stasiun, dengan dua kaleng kopi dari mesin otomatis dan satu selimut tipis yang entah dari mana.' },
    { t: 'Dia tidur dengan kepala di bahuku selama satu jam empat belas menit. Aku menghitung, karena aku tidak bisa tidur.' },
    { t: 'Lalu jam empat lewat, dia bangun, dan berkata:' },
    { show: 'shiori', pos: 'center', e: 'neutral' },
    { w: 'Shiori', t: 'Ren. Kita balik ke pantai.' },
    { w: 'Ren', t: 'Sekarang? Kereta jam lima.' },
    { w: 'Shiori', t: 'Sebentar aja. Aku mau dengar pagi.' },
    { w: 'Ren', t: 'Kamu belum pernah dengar pagi?' },
    { w: 'Shiori', e: 'smile', t: 'Di kota, pagi itu cuma berisik yang pelan.' },

    { bg: 'beach_morning', veil: true, amb: 'waves' },
    { t: 'Pantai jam empat pagi hampir tidak ada. Langit masih biru tua, dan pasirnya dingin seperti baru dicuci.' },
    { t: 'Kami duduk di tempat yang sama seperti semalam. Dia tidak perlu ditunjukkan. Dia hafal.' },
    { w: 'Shiori', t: 'Di sini, kan?' },
    { w: 'Ren', t: 'Sedikit ke kiri.' },
    { w: 'Shiori', e: 'smile', t: 'Bohong. Aku hafal.' },
    { w: 'Ren', t: 'Iya. Kamu hafal.' },

    { t: 'Kami menunggu. Langit perlahan berubah dari biru tua ke biru susu, lalu ke pucat, lalu ada garis tipis yang hampir tidak bisa disebut warna.' },
    { w: 'Ren', t: 'Mulai.' },
    { w: 'Shiori', t: 'Apa yang berubah duluan?' },
    { w: 'Ren', t: 'Yang di atas. Biasanya matahari yang duluan. Sekarang langitnya yang duluan terang.' },
    { w: 'Ren', t: 'Ada garis merah tipis di bawah. Tipis banget. Kayak salah satu goresan pensil yang nggak sengaja.' },
    { w: 'Shiori', t: 'Jadi pagi itu pelan.' },
    { w: 'Ren', t: 'Iya. Pagi itu pelan.' },
    { w: 'Shiori', e: 'tender', t: 'Aku suka yang pelan.' },

    { t: 'Matahari naik. Warnanya bukan kuning, tapi putih pucat, dan pantainya jadi terang dengan cara yang tidak masuk akal, seperti lampu yang dinyalakan pelan-pelan.' },
    { t: 'Dia menutup matanya. Bukan karena silau.' },
    { t: 'Kami duduk di sana sampai bayangan kami memanjang ke arah yang salah, dan akhirnya dia bicara.' },

    { w: 'Shiori', t: 'Ren. Aku mau nanya satu hal, dan aku mau kamu jujur.' },
    { w: 'Ren', t: 'Aku selalu jujur sama kamu.' },
    { w: 'Shiori', t: 'Belum selalu. Tapi hampir.' },
    { w: 'Shiori', t: 'Apa yang kamu mau?' },

    { t: 'Pertanyaan itu terlalu sederhana untuk terasa seberat itu. Angin dari laut masih bertiup, dan ombak masih datang dengan jadwal yang tidak peduli.' },

    {
      choice: [
        {
          t: '"Aku mau kamu memilih yang terbaik buat kamu. Apa pun itu. Walaupun itu bukan aku."',
          bp: 2, tp: 14, flags: { selfless: true }, go: 'c1_selfless'
        },
        {
          t: '"Aku mau kamu tetap di sini. Sama aku. Aku nggak peduli soal sekolah itu."',
          bp: 6, tp: -16, flags: { selfish: true }, go: 'c1_selfish'
        },
        {
          t: '"Aku nggak tahu. Aku cuma tahu aku nggak mau kehilangan kamu."',
          bp: 3, tp: -3, flags: { unsure: true }, go: 'c1_unsure'
        }
      ]
    },

    { label: 'c1_selfless' },
    { t: 'Dia tidak langsung menjawab. Angin meniup rambutnya ke depan wajahnya, dan dia tidak menyisirkannya.' },
    { w: 'Shiori', t: 'Itu jawaban yang sangat dewasa.' },
    { w: 'Ren', t: 'Itu bukan jawaban dewasa. Itu jawaban orang yang takut.' },
    { w: 'Shiori', e: 'surprised', t: 'Takut?' },
    { w: 'Ren', t: 'Kalau aku bilang aku mau kamu di sini, terus kamu tetap pergi, aku bakal jadi orang yang nahan kamu.' },
    { w: 'Ren', t: 'Aku nggak mau jadi orang itu. Jadi aku bilang apa yang lebih aman.' },
    { w: 'Shiori', t: 'Ren.' },
    { w: 'Ren', t: 'Tapi itu bukan bohong. Aku beneran mau kamu milih yang terbaik buat kamu.' },
    { w: 'Ren', t: 'Cuma... aku juga mau jujur kalau itu berat.' },
    { t: 'Dia menoleh ke arahku, dan meskipun aku tahu dia tidak melihat, aku tetap merasa sedang dilihat.' },
    { w: 'Shiori', e: 'tender', t: 'Nah. Yang tadi itu baru jujur.' },
    { go: 'r1' },

    { label: 'c1_selfish' },
    { w: 'Shiori', t: '...' },
    { w: 'Shiori', e: 'sad', t: 'Kamu nggak peduli soal sekolah itu.' },
    { w: 'Ren', t: 'Maksudku—' },
    { w: 'Shiori', t: 'Aku dengar apa yang kamu maksud.' },
    { t: 'Suaranya tidak naik. Itu yang paling buruk. Kalau dia marah, aku tahu harus berbuat apa.' },
    { w: 'Shiori', t: 'Ren. Sekolah itu satu-satunya hal yang aku punya yang bukan tentang kamu.' },
    { w: 'Shiori', t: 'Kalau kamu bilang kamu nggak peduli, itu artinya kamu nggak peduli sama separuh hidup aku.' },
    { w: 'Ren', t: 'Aku nggak gitu maksudnya. Aku cuma—' },
    { w: 'Shiori', e: 'cry', t: 'Aku tahu kamu cuma nggak mau kehilangan aku. Tapi kamu bilang itu dengan cara yang bikin aku harus milih antara aku dan kamu.' },
    { go: 'r1' },

    { label: 'c1_unsure' },
    { w: 'Shiori', t: 'Kamu nggak tahu.' },
    { w: 'Ren', t: 'Iya.' },
    { w: 'Shiori', t: 'Itu jujur.' },
    { w: 'Shiori', e: 'sad', t: 'Tapi aku udah denger "aku nggak tahu" dari orang lain, dan setelah itu dia pergi.' },
    { w: 'Ren', t: 'Aku bukan dia.' },
    { w: 'Shiori', t: 'Aku tahu. Aku cuma... capek nebak.' },
    { go: 'r1' },

    { label: 'r1' },
    { t: 'Ombak datang dan pergi tiga kali sebelum dia bicara lagi.' },
    { w: 'Shiori', t: 'Ren. Aku mau nanya satu lagi.' },
    { w: 'Ren', t: 'Nanya terus.' },
    { w: 'Shiori', e: 'smile', t: 'Karena kamu selalu jawab.' },
    { w: 'Shiori', t: 'Kalau aku pergi... kamu masih mau sama aku?' },
    { t: 'Bukan "kamu masih sayang aku". Bukan "kamu mau nunggu aku". Pertanyaannya jauh lebih kecil dari itu, dan justru karena kecil, jawabannya jadi berat.' },

    {
      choice: [
        {
          t: '"Aku mau coba. Jarak jauh, telepon, apa aja. Selama kamu juga mau."',
          bp: 7, tp: 6, flags: { confessed: true, longDistance: true }, go: 'c2_come' 
        },
        {
          t: '"Aku mau kamu fokus ke hidup kamu dulu. Aku nggak mau jadi beban yang kamu pikir tiap malam."',
          bp: 1, tp: 8, flags: { friendsEnding: true }, go: 'c2_friends'
        },
        {
          t: '"Aku nggak bisa janji apa-apa. Kamu tahu itu."',
          bp: -6, tp: -4, flags: { cannotPromise: true }, go: 'c2_nothing'
        }
      ]
    },

    { label: 'c2_come' },
    { w: 'Shiori', e: 'surprised', t: 'Jarak jauh.' },
    { w: 'Ren', t: 'Iya.' },
    { w: 'Shiori', t: 'Itu berat, Ren. Kamu tahu itu berat?' },
    { w: 'Ren', t: 'Aku tahu. Aku juga tahu aku bakal jadi orang yang nunggu telepon jam sebelas malem.' },
    { w: 'Shiori', t: 'Dan kalau aku nggak bisa dihubungi?' },
    { w: 'Ren', t: 'Ya aku bakal mikir yang aneh-aneh, terus aku bakal sadar, terus aku bakal tidur.' },
    { w: 'Shiori', e: 'cry', t: 'Kamu bikin kedengeran gampang.' },
    { w: 'Ren', t: 'Nggak gampang. Aku cuma udah mikirin.' },
    { t: 'Dia tertawa sambil menangis, yang menurutku adalah cara tertawa yang paling jujur.' },
    { w: 'Shiori', t: 'Aku mau.' },
    { w: 'Ren', t: 'Hah?' },
    { w: 'Shiori', e: 'tender', t: 'Aku juga mau coba.' },
    { go: 'ch8close' },

    { label: 'c2_friends' },
    { w: 'Shiori', t: 'Kamu nggak bakal jadi beban.' },
    { w: 'Ren', t: 'Aku tahu. Tapi kamu bakal mikir gitu.' },
    { w: 'Ren', t: 'Kamu bakal di Sapporo, kamu bakal capek, terus kamu bakal mikir "Ren nunggu". Itu beban, Shiori.' },
    { w: 'Shiori', e: 'sad', t: '...Iya.' },
    { w: 'Ren', t: 'Jadi—' },
    { w: 'Shiori', t: 'Jadi kita berhenti di sini.' },
    { t: 'Dia tidak bertanya. Dia menyelesaikan kalimatku, seperti biasa.' },
    { w: 'Shiori', t: 'Oke.' },
    { w: 'Shiori', e: 'cry', t: 'Oke. Kalau itu yang kamu mau.' },
    { w: 'Ren', t: 'Bukan itu yang aku mau.' },
    { w: 'Shiori', t: 'Tapi itu yang kamu pilih.' },
    { go: 'ch8close' },

    { label: 'c2_nothing' },
    { w: 'Shiori', e: 'sad', t: 'Iya.' },
    { w: 'Shiori', t: 'Aku tahu.' },
    { t: 'Kami duduk lebih lama dari yang seharusnya. Sampai matahari sudah tinggi dan bayangan kami memendek.' },
    { w: 'Shiori', t: 'Ren. Keretanya jam tujuh lewat.' },
    { w: 'Ren', t: 'Iya.' },
    { w: 'Shiori', t: 'Ayo.' },
    { go: 'ch8close' },

    { label: 'ch8close' },
    { bg: 'beach_morning' },
    { hide: 'all' },
    { t: 'Kami berjalan pulang lewat jalan menurun yang sama, dengan pasir di sandal kami yang tidak pernah benar-benar bersih.' },
    { t: 'Di kereta, dia tidur lagi. Kali ini kepalanya tidak di bahuku. Dia bersandar ke jendela, dan aku duduk di seberang, dan aku menghitung tiang listrik sampai aku kehilangan hitungan.' },
    { t: 'Dua jam. Lalu stasiun. Lalu peron yang sama tempat aku menunggu dia tiga bulan lalu.' },
    { t: 'Di situlah cerita ini memutuskan arahnya.' },

    { ending: 'auto' }
  ]
});
