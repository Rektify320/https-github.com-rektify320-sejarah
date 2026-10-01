// ==========================================================================
// HISTORICAL DOCUMENTS & ARTIFACTS DATA (BAG INVENTORY)
// ==========================================================================
const HISTORICAL_DOCUMENTS_DATA = [
  {
    id: "doc_max_havelaar",
    title: "Novel Max Havelaar (1860)",
    author: "Eduard Douwes Dekker (Multatuli)",
    era: "Lebak, Banten (1860)",
    icon: "📖",
    stars: "★★★★★",
    quote: "\"Adinda telah mati, kerbaunya telah dirampas, dan pemerasan Tanam Paksa telah menelanjangi nurani manusia.\"",
    text: "Buku fiksi bersejarah yang ditulis Multatuli di Belgia ini membongkar korupsi pejabat kolonial dan penderitaan petani Lebak di bawah Sistem Tanam Paksa (Cultuurstelsel). Karya ini menjadi gempa politik di parlemen Belanda dan memicu perdebatan moral yang melahirkan Politik Etis!"
  },
  {
    id: "doc_een_eereschuld",
    title: "Naskah 'Een Eereschuld' (1899)",
    author: "Mr. C.Th. van Deventer",
    era: "Majalah De Gids (1899)",
    icon: "📜",
    stars: "★★★★★",
    quote: "\"Belanda memiliki utang kehormatan (moral) sebesar 187 juta gulden yang harus dikembalikan dalam bentuk kemakmuran bagi rakyat Hindia Belanda.\"",
    text: "Artikel fenomenal karya pakar hukum C.Th. van Deventer yang membuktikan bahwa kemakmuran negeri Belanda dibangun di atas surplus finansial Hindia Belanda. Van Deventer merumuskan Trias: Irigasi, Edukasi, dan Emigrasi."
  },
  {
    id: "doc_de_locomotief",
    title: "Koran 'De Locomotief' (1901)",
    author: "Pieter Brooshooft",
    era: "Semarang (1901)",
    icon: "📰",
    stars: "★★★★☆",
    quote: "\"Pena pers kami tidak akan berhenti sebelum rakyat bumiputra mendapatkan keadilan pangan dan pendidikan!\"",
    text: "Surat kabar berbahasa Belanda terkemuka di Semarang yang dipimpin oleh Pieter Brooshooft. Brooshooft secara berani melancarkan investigasi jurnalistik tentang kemiskinan dan kelaparan petani Jawa, mendesak Den Haag turun tangan."
  },
  {
    id: "doc_irigasi_brantas",
    title: "Denah Bendungan Kali Brantas",
    author: "Departemen Pekerjaan Umum Kolonial",
    era: "Jawa Timur (1904)",
    icon: "💧",
    stars: "★★★★☆",
    quote: "\"Pintu air nomor satu mengalir ke perkebunan tebu Suikerfabriek; pintu air nomor dua untuk sawah padi pribumi.\"",
    text: "Dokumen teknis pembangunan saluran primer dan waduk irigasi. Catatan arsip ini membuktikan adanya diskriminasi: air bersih berlimpah dialirkan siang hari ke perkebunan milik pengusaha Belanda, sementara petani rakyat hanya mendapat jatah sisa di malam hari."
  },
  {
    id: "doc_kartini_letters",
    title: "Kumpulan Surat R.A. Kartini",
    author: "Raden Ajeng Kartini",
    era: "Jepara (1899–1904)",
    icon: "✉️",
    stars: "★★★★★",
    quote: "\"Door Duisternis tot Licht — Habis Gelap Terbitlah Terang. Kami berhasrat membuka pintu kemajuan bagi perempuan bumiputra.\"",
    text: "Korespondensi pribadi R.A. Kartini kepada sahabat penanya di Belanda (seperti Ny. Rosa Abendanon). Surat-surat ini menyuarakan jeritan perempuan yang terbelenggu pingitan feodal dan menuntut akses pendidikan modern bagi gadis pribumi."
  },
  {
    id: "doc_poenale_sanctie",
    title: "Daftar Registrasi Kuli Deli",
    author: "Deli Planters Vereeniging (DPV)",
    era: "Sumatra Timur (1905)",
    icon: "⛓️",
    stars: "★★★★☆",
    quote: "\"Barangsiapa kuli kontrak melarikan diri atau membantah mandor, diancam hukuman cambuk dan kerja paksa (Poenale Sanctie).\"",
    text: "Peraturan ketenagakerjaan perkebunan tembakau Deli. Di bawah kedok program Emigrasi/Transmigrasi, puluhan ribu kuli dari Jawa dikirim ke Deli dan terjerat sistem hutang serta hukuman cambuk yang sangat kejam."
  },
  {
    id: "doc_budi_utomo",
    title: "Manifesto Budi Utomo 1908",
    author: "dr. Soetomo & Mahasiswa STOVIA",
    era: "Batavia (20 Mei 1908)",
    icon: "🏛️",
    stars: "★★★★★",
    quote: "\"Suatu bangsa yang merdeka harus dibangun oleh bangsa itu sendiri melalui ilmu pengetahuan, kesadaran budi, dan persatuan!\"",
    text: "Akta kelahiran organisasi pergerakan modern pertama di Indonesia. Didirikan di gedung STOVIA Batavia atas dorongan dr. Wahidin Soedirohoesodo, menandai fajar baru Kebangkitan Nasional Indonesia!"
  },
  {
    id: "doc_megalitikum",
    title: "Prasasti Menhir & Dolmen Megalit",
    author: "Leluhur Peradaban Nusantara",
    era: "Zaman Batu Besar (Megalitikum)",
    icon: "🗿",
    stars: "★★★★★",
    quote: "\"Batu tegak ini saksi kemandirian pangan dan kedaulatan tanah leluhur ribuan tahun sebelum bangsa asing menjejakkan kaki.\"",
    text: "Artefak batu purbakala yang membuktikan peradaban agraris mandiri bangsa Nusantara telah berdiri kokoh ribuan tahun silam dengan tradisi swasembada pangan dan gotong royong."
  }
];

// --- 1.5. DATA INFOGRAFIS DAN ALUR CERITA (PERSIS POSTER REFERENSI USER) ---
const INFOGRAPHIC_TIMELINE_DATA = [
  {
    id: 1,
    chapter: 1,
    section: "LATAR BELAKANG",
    side: "left",
    title: "LATAR BELAKANG",
    summary: "Politik Etis adalah kebijakan pemerintah Belanda yang mulai diterapkan pada tahun 1901 sebagai bentuk \"balas budi\" kepada rakyat Indonesia. Kebijakan ini muncul karena Belanda mendapat banyak kritik akibat penjajahan yang menyebabkan penderitaan dan kemiskinan rakyat Indonesia.",
    fullDetails: [
      "Salah satu kritik terkenal disampaikan oleh <strong>Eduard Douwes Dekker (Multatuli)</strong> melalui buku <em>Max Havelaar</em>, yang menceritakan penderitaan rakyat akibat sistem Tanam Paksa.",
      "Kemudian, <strong>C. Th. van Deventer</strong> menulis artikel berjudul <em>\"Een Eereschuld\" (Utang Kehormatan)</em> yang menyatakan bahwa Belanda memiliki utang moral kepada rakyat Indonesia dan harus memberikan kesejahteraan kembali.",
      "Selain itu, Belanda juga mulai menyadari bahwa kondisi rakyat Indonesia yang buruk dapat mengancam kepentingan pemerintahan kolonial. Oleh karena itu, pada masa pemerintahan Ratu Wilhelmina, Politik Etis dijalankan melalui tiga program utama, yaitu irigasi, edukasi, dan transmigrasi."
    ],
    quote: "\"Belanda telah menghisap jutaan gulden kekayaan Nusantara, kini saatnya melunasi Utang Kehormatan (Een Eereschuld) demi kesejahteraan bumiputra!\"",
    quiz: {
      question: "Apa judul artikel mengguncang yang ditulis C.Th. van Deventer pada 1899?",
      options: [
        { text: "Een Eereschuld (Utang Kehormatan)", correct: true },
        { text: "Max Havelaar di Lebak Banten", correct: false },
        { text: "Suikerkontrakten en Kolonisatie", correct: false }
      ],
      explanation: "Tepat sekali! Artikel 'Een Eereschuld' (Utang Kehormatan) dimuat di majalah De Gids 1899 dan menjadi landasan lahirnya Politik Etis."
    }
  },
  {
    id: 2,
    chapter: 2,
    section: "TOKOH",
    side: "right",
    title: "TOKOH UTAMA",
    summary: "Tiga figur sentral yang memicu dan meresmikan pelaksanaan Politik Etis di Hindia Belanda.",
    fullDetails: [
      "<strong>Van Deventer</strong> &rarr; pencetus Politik Etis melalui gagasan <em>\"Een Eereschuld\" (Utang Kehormatan)</em>.",
      "<strong>Ratu Wilhelmina</strong> &rarr; Ratu Belanda yang mengumumkan pelaksanaan Politik Etis pada pidato takhta tahun 1901.",
      "<strong>Pieter Brooshooft</strong> &rarr; wartawan dan redaktur koran <em>De Locomotief</em> yang mengkritik kebijakan kolonial dan memperjuangkan kesejahteraan rakyat Indonesia."
    ],
    quote: "\"Pemerintah Belanda mempunyai kewajiban moral dan utang budi terhadap bangsa bumiputra di Hindia Belanda.\" — Pidato Takhta Ratu Wilhelmina (1901)",
    quiz: {
      question: "Siapakah wartawan koran De Locomotief yang vokal membela kesejahteraan rakyat Indonesia?",
      options: [
        { text: "Pieter Brooshooft", correct: true },
        { text: "Johannes van den Bosch", correct: false },
        { text: "Daendels", correct: false }
      ],
      explanation: "Tepat! Pieter Brooshooft bersama C.Th. van Deventer adalah tokoh pers etis yang gigih membela hak rakyat bumiputra."
    }
  },
  {
    id: 3,
    chapter: 3,
    section: "TUJUAN",
    side: "left",
    title: "TUJUAN POLITIK ETIS",
    summary: "Politik Etis bertujuan untuk memperbaiki kehidupan rakyat Indonesia setelah rakyat banyak mengalami penderitaan akibat penjajahan dan kebijakan ekonomi Belanda.",
    fullDetails: [
      "Tujuan utamanya adalah:",
      "1. <strong>Meningkatkan kesejahteraan rakyat</strong>, terutama dalam bidang pertanian dan kehidupan sehari-hari.",
      "2. <strong>Memberikan pendidikan</strong> agar rakyat Indonesia memiliki pengetahuan dan keterampilan.",
      "3. <strong>Memperbaiki sistem pertanian</strong> dengan membangun irigasi atau pengairan.",
      "4. <strong>Mengurangi kepadatan penduduk di Pulau Jawa</strong> melalui program transmigrasi."
    ],
    quote: "\"Empat pilar cita-cita: Sejahtera bertani, terdidik berpengetahuan, air mengalir merata, dan sebaran penduduk berimbang.\"",
    quiz: {
      question: "Manakah di bawah ini yang BUKAN tujuan utama pelaksanaan Politik Etis?",
      options: [
        { text: "Mewajibkan seluruh pemuda pribumi bergabung militer Belanda", correct: true },
        { text: "Meningkatkan kesejahteraan rakyat dan hasil pertanian", correct: false },
        { text: "Memberikan pendidikan dan keterampilan bagi rakyat", correct: false }
      ],
      explanation: "Benar! Politik Etis bertujuan memajukan pertanian, pendidikan, irigasi, dan transmigrasi, bukan militerisasi paksa."
    }
  },
  {
    id: 4,
    chapter: 4,
    section: "KEBIJAKAN",
    side: "right",
    title: "KEBIJAKAN (TRILOGI VAN DEVENTER)",
    summary: "Tiga program nyata pemerintah Belanda beserta realitas penyimpangannya di lapangan.",
    fullDetails: [
      "1. <strong>Irigasi (pengairan)</strong>: Pemerintah Belanda membangun dan memperbaiki saluran irigasi, bendungan, dan waduk. Tujuannya untuk meningkatkan hasil pertanian dan membantu perkebunan. <em>Tetapi dalam praktiknya, pembangunan irigasi juga banyak menguntungkan perkebunan milik Belanda</em>.",
      "2. <strong>Edukasi (pendidikan)</strong>: Pemerintah Belanda mulai membuka sekolah bagi penduduk pribumi. Contohnya sekolah rakyat, sekolah guru, dan sekolah untuk kalangan bangsawan/priyayi. <em>Pendidikan melahirkan kaum terpelajar Indonesia yang kemudian berperan dalam pergerakan nasional</em>.",
      "3. <strong>Transmigrasi / Emigrasi</strong>: Penduduk dari daerah yang padat, terutama Jawa, dipindahkan ke daerah yang penduduknya lebih sedikit seperti Sumatra. Tujuannya mengurangi kepadatan dan menyediakan tenaga kerja di daerah perkebunan. <em>Program ini kemudian menjadi salah satu dasar perkembangan transmigrasi di Indonesia</em>."
    ],
    quote: "\"Niat di atas kertas seringkali berbelok di lapangan: Air untuk tebu Belanda, sekolah untuk pegawai rendahan, dan transmigrasi untuk kuli Deli.\"",
    quiz: {
      question: "Bagaimana penyimpangan program Irigasi dalam praktiknya di lapangan?",
      options: [
        { text: "Air diprioritaskan mengaliri perkebunan tebu/tembakau milik Belanda", correct: true },
        { text: "Saluran air sengaja ditutup total sehingga tidak ada yang bertani", correct: false },
        { text: "Semua bendungan dibongkar kembali oleh pemerintah kolonial", correct: false }
      ],
      explanation: "Tepat! Air irigasi dialirkan siang hari ke perkebunan komersial Belanda, sedangkan sawah rakyat hanya kebagian malam hari."
    }
  },
  {
    id: 5,
    chapter: 5,
    section: "DAMPAK",
    side: "left",
    title: "DAMPAK POLITIK ETIS",
    summary: "Perubahan besar yang terjadi di Nusantara pada 4 bidang kehidupan berbangsa.",
    fullDetails: [
      "1. <strong>Bidang pendidikan</strong>: Muncul sekolah-sekolah bagi pribumi. Lahir kaum terpelajar intelektual Indonesia. Kaum terpelajar mulai menyadari pentingnya persatuan dan kemerdekaan.",
      "2. <strong>Bidang ekonomi</strong>: Pembangunan irigasi membantu pertanian. Namun, sebagian besar pembangunan tetap lebih menguntungkan pemerintah kolonial.",
      "3. <strong>Bidang sosial</strong>: Muncul golongan terpelajar dan kaum intelektual baru. Kesadaran nasionalisme semakin berkembang pesat.",
      "4. <strong>Bidang politik</strong>: Lahir organisasi pergerakan nasional seperti Budi Utomo, Sarekat Islam, dan Indische Partij. Tumbuh perjuangan untuk memperoleh kemerdekaan."
    ],
    quote: "\"Dari rahim sekolah-sekolah inilah lahir kesadaran baru: Kita bukan sekadar orang Jawa, Sunda, atau Melayu, kita adalah SATU BANGSA INDONESIA!\"",
    quiz: {
      question: "Dampak paling mendasar Politik Etis di bidang sosial dan politik adalah...",
      options: [
        { text: "Lahirnya kaum terpelajar yang mempelopori organisasi pergerakan nasional", correct: true },
        { text: "Seluruh rakyat Indonesia langsung diangkat menjadi warga negara Belanda", correct: false },
        { text: "Sistem kerajaan tradisional dipulihkan seperti zaman Sriwijaya", correct: false }
      ],
      explanation: "Tepat sekali! Kaum terpelajar lulusan STOVIA dan sekolah rakyat menyadari ketidakadilan dan memimpin perjuangan kemerdekaan."
    }
  },
  {
    id: 6,
    chapter: 6,
    section: "AKHIR",
    side: "right",
    title: "AKHIR POLITIK ETIS & KEBANGKITAN NASIONAL",
    summary: "Politik Etis tidak berakhir secara tiba-tiba tetapi pelaksanaannya semakin menyimpang dari tujuan awal. Belanda lebih banyak menggunakan kebijakan ini untuk kepentingan ekonomi kekuasaan kolonial.",
    fullDetails: [
      "Dari kebijakan inilah muncul kelompok <strong>kaum masyarakat terpelajar yang memiliki pengetahuan dan wawasan luas</strong>.",
      "Dan kaum terdidik ini mulai menyadari ketidakadilan sistem penjajahan dan menjadi <strong>pelopor lahirnya pergerakan nasional</strong>.",
      "Organisasi-organisasi seperti <strong>Budi Utomo (1908)</strong> dan <strong>Sarekat Islam</strong> tumbuh sebagai wadah perjuangan yang lebih terorganisasi dan berorientasi pada perubahan sosial serta politik kemerdekaan bangsa!"
    ],
    quote: "\"Politik Etis menjadi 'Senjata Makan Tuan' bagi Belanda: Anak-anak panah pemikiran yang mereka asah berbalik meruntuhkan pilar penjajahan!\"",
    quiz: {
      question: "Mengapa Politik Etis disebut 'Senjata Makan Tuan' bagi pemerintah kolonial Belanda?",
      options: [
        { text: "Pendidikan yang dibuka justru melahirkan kaum terpelajar yang menuntut kemerdekaan", correct: true },
        { text: "Bendungan irigasi yang dibangun Belanda meledak dan menghancurkan kota", correct: false },
        { text: "Ratu Wilhelmina mencabut kembali status kewarganegaraan seluruh orang Belanda", correct: false }
      ],
      explanation: "Tepat! Niat mendidik untuk pegawai rendahan justru melahirkan para pelopor kemerdekaan seperti dr. Soetomo, Ki Hadjar Dewantara, dan Kartini."
    }
  }
];

// --- 2. ACHIEVEMENTS & QUESTS DATA ---
const ACHIEVEMENTS_DATA = [
  {
    id: "utang_kehormatan",
    title: "Een Eereschuld: Utang Kehormatan",
    desc: "Mendalami latar belakang Multatuli & artikel C.Th. van Deventer tahun 1899.",
    icon: "📜",
    unlocked: false
  },
  {
    id: "misi_irigasi",
    title: "Irigasi & Dilema Agraria",
    desc: "Membongkar diskriminasi pengairan antara perkebunan kolonial vs sawah rakyat Pak Kromo.",
    icon: "🌾",
    unlocked: false
  },
  {
    id: "misi_edukasi",
    title: "Lahirnya Kaum Terpelajar & Emansipasi",
    desc: "Menyelidiki sekolah STOVIA & gagasan pendidikan wanita R.A. Kartini.",
    icon: "🎓",
    unlocked: false
  },
  {
    id: "misi_transmigrasi",
    title: "Pelopor Emigrasi & Sisi Gelap Deli",
    desc: "Memahami pemindahan penduduk Jawa serta penderitaan kuli Poenale Sanctie.",
    icon: "🚢",
    unlocked: false
  },
  {
    id: "fajar_kebangkitan",
    title: "Fajar Kebangkitan Nasional 1908",
    desc: "Mengevaluasi 4 dampak besar Politik Etis dan berdirinya Budi Utomo 1908 bersama dr. Soetomo.",
    icon: "🌟",
    unlocked: false
  },
  {
    id: "akhir_politik_etis",
    title: "Senjata Makan Tuan: Akhir Etis",
    desc: "Menuntaskan refleksi akhir mengapa Politik Etis gagal dan melahirkan kemerdekaan.",
    icon: "👑",
    unlocked: false
  }
];

const QUESTS_DATA = [
  {
    id: 1,
    chapter: 1,
    title: "Babak 1: Latar Belakang & Utang Kehormatan",
    desc: "Temui Multatuli (Max Havelaar) & Mr. C.Th. van Deventer (Een Eereschuld 1899) di pelataran Den Haag.",
    step: 1,
    totalSteps: 2,
    targetNPC: "deventer"
  },
  {
    id: 2,
    chapter: 2,
    title: "Babak 2: Para Tokoh & Pidato Takhta 1901",
    desc: "Temui Pieter Brooshooft (De Locomotief) & dengarkan Pidato Takhta 1901 Ratu Wilhelmina.",
    step: 1,
    totalSteps: 2,
    targetNPC: "brooshooft"
  },
  {
    id: 3,
    chapter: 3,
    title: "Babak 3: Empat Tujuan Utama Politik Etis",
    desc: "Pelajari 4 tujuan luhur Politik Balas Budi bersama Kala sebelum turun menyelidiki ke lapangan.",
    step: 1,
    totalSteps: 2,
    targetNPC: "kala"
  },
  {
    id: 4,
    chapter: 4,
    title: "Babak 4: Trilogi Kebijakan & Penyimpangannya",
    desc: "Selidiki 3 pilar: Irigasi (Pak Kromo), Edukasi (R.A. Kartini & dr. Wahidin), dan Emigrasi (Amat Kuli Deli).",
    step: 1,
    totalSteps: 3,
    targetNPC: "farmer"
  },
  {
    id: 5,
    chapter: 5,
    title: "Babak 5: Menilai Dampak di 4 Bidang",
    desc: "Evaluasi 4 dampak besar Politik Etis bersama dr. Soetomo di Gedung STOVIA Batavia.",
    step: 1,
    totalSteps: 2,
    targetNPC: "soetomo"
  },
  {
    id: 6,
    chapter: 6,
    title: "Babak 6: Akhir Etis & Fajar Kebangkitan Nasional",
    desc: "Kunjungi Tugu Sejarah Selatan untuk merefleksikan 'Senjata Makan Tuan' dan mengukir gelar Pakar Sejarah!",
    step: 1,
    totalSteps: 2,
    targetNPC: "kala_monument"
  },
  {
    id: 7,
    chapter: 7,
    title: "✦ Pakar Sejarah Politik Etis Nusantara ✦",
    desc: "Selamat! Kamu telah menguasai seluruh alur infografis, dokumen arsip, dan fakta sejarah Politik Etis!",
    step: 2,
    totalSteps: 2,
    targetNPC: null
  }
];

// --- 5. COMPREHENSIVE HISTORICAL SCRIPTS WITH CUSTOM VOICE PER CHARACTER ---
const DIALOGUE_SCRIPTS = {
  // MENHIR & ARTEFAK PRASEJARAH INSPECT
  "menhir_inspect": [
    {
      speaker: "Kala",
      role: "✦ AKAR SEJARAH PRASEJARAH ✦",
      characterKey: "kala",
      text: "Lihatlah batu Menhir dan Dolmen Megalitikum ini! Jauh sebelum bangsa Eropa menginjakkan kaki di tanah ini, nenek moyang bangsa Indonesia telah hidup mandiri dengan tradisi agraris yang luhur dan gotong royong.",
      choices: [
        { text: "Bagaimana hubungan peninggalan prasejarah ini dengan Politik Etis?", nextKey: "menhir_konteks" }
      ]
    }
  ],
  "menhir_konteks": [
    {
      speaker: "Kala",
      role: "✦ AKAR SEJARAH PRASEJARAH ✦",
      characterKey: "kala",
      text: "Tanah Nusantara yang kaya peradaban inilah yang disedot habis-habisan selama berabad-abad lewat Tanam Paksa. Itulah mengapa Van Deventer menyebutnya 'Utang Kehormatan' yang wajib dikembalikan!",
      choices: [
        { text: "Mari temui Mr. Van Deventer di pelataran Den Haag!", nextKey: "deventer_start" }
      ]
    }
  ],

  // PUNDEN BERUNDAK INSPECT
  "punden_inspect": [
    {
      speaker: "Kala",
      role: "✦ PUNDEN BERUNDAK PRASEJARAH ✦",
      characterKey: "kala",
      text: "Punden berundak dan sarkofagus batu purba ini adalah saksi bisu kearifan lokal sistem pengairan dan penghormatan kepada tanah air. Warisan inilah yang kelak dibangkitkan kembali oleh para tokoh 1908!",
      choices: [
        { text: "Lanjutkan penjelajahan sejarah.", nextKey: null }
      ]
    }
  ],

  
  // PIETER BROOSHOOFT (WARTAWAN DE LOCOMOTIEF)
  "brooshooft_start": [
    {
      speaker: "Pieter Brooshooft",
      role: "✦ WARTAWAN DE LOCOMOTIEF ✦",
      characterKey: "brooshooft",
      text: "Selamat datang di meja redaksi De Locomotief! Saya Pieter Brooshooft. Sebagai wartawan, pena saya tidak akan tinggal diam melihat penderitaan rakyat Nusantara akibat sistem kolonial yang memeras keringat bumiputra!",
      choices: [
        { text: "Apa peran tulisan Anda dan pers dalam mendorong Politik Etis?", nextKey: "brooshooft_peran" },
        { text: "Bagaimana hubungan Anda dengan artikel Van Deventer?", nextKey: "brooshooft_deventer" }
      ]
    }
  ],
  "brooshooft_peran": [
    {
      speaker: "Pieter Brooshooft",
      role: "✦ SUARA PERS KRITIS ✦",
      characterKey: "brooshooft",
      text: "Pada tahun 1887 dan 1901, saya menulis pamflet dan artikel mendesak pemerintah Den Haag bertanggung jawab. Kondisi kemiskinan rakyat yang kian parah bukan hanya ketidakadilan moral, tapi juga ancaman nyata bagi stabilitas kolonial!",
      choices: [
        { text: "Lalu bagaimana gagasan ini didengar oleh Ratu Wilhelmina?", nextKey: "brooshooft_ke_ratu" }
      ]
    }
  ],
  "brooshooft_deventer": [
    {
      speaker: "Pieter Brooshooft",
      role: "✦ ALIANSI MORAL ✦",
      characterKey: "brooshooft",
      text: "Saya bersama sahabat saya, Mr. C.Th. van Deventer, terus menyuarakan bahwa Belanda berutang budi ratusan juta gulden. Kami mendesak diterapkannya tiga pilar: Irigasi, Edukasi, dan Emigrasi!",
      choices: [
        { text: "Mari kita saksikan bagaimana Ratu Wilhelmina meresmikannya!", nextKey: "brooshooft_ke_ratu" }
      ]
    }
  ],
  "brooshooft_ke_ratu": [
    {
      speaker: "Pieter Brooshooft",
      role: "✦ MENUJU PIDATO TAKHTA ✦",
      characterKey: "brooshooft",
      text: "Perjuangan pena pers etis akhirnya berbuah manis! Sekarang, temui Ratu Wilhelmina di panggung utara untuk mendengarkan Pidato Takhta (Troonrede) 1901 yang secara resmi menetapkan Politik Etis sebagai kebijakan kerajaan!",
      choices: [
        { text: "✦ Dengarkan Pidato Takhta Ratu Wilhelmina sekarang!", nextKey: "wilhelmina_start" }
      ]
    }
  ],
  "brooshooft_finish_b1": [
    {
      speaker: "Pieter Brooshooft",
      role: "✦ MENUJU PIDATO TAKHTA ✦",
      characterKey: "brooshooft",
      text: "Dengarkan baik-baik pidato sang Ratu di panggung utara!",
      choices: [
        { text: "Menuju Panggung Pidato Takhta Ratu Wilhelmina", nextKey: "wilhelmina_start" }
      ]
    }
  ],

  // 1. KALA START
  "kala_start": [
    {
      speaker: "Kala",
      role: "✦ ROH WAKTU ✦",
      characterKey: "kala",
      text: "Halo Pengelana Waktu! Kita sedang menyaksikan babak paling menentukan dalam sejarah Nusantara: Kelahiran POLITIK ETIS (1899–1901) dan jalan panjang menuju Kebangkitan Nasional 1908!",
      choices: [
        { text: "Siapa saja tokoh-tokoh besar di area Den Haag & Batavia ini?", nextKey: "kala_tokoh_list" },
        { text: "Dengarkan dulu kisah novel Max Havelaar dari Multatuli!", nextKey: "multatuli_start" },
        { text: "Ayo kita mulai bicara dengan Mr. C.Th. van Deventer!", nextKey: "deventer_start" }
      ]
    }
  ],
  "kala_tokoh_list": [
    {
      speaker: "Kala",
      role: "✦ ROH WAKTU ✦",
      characterKey: "kala",
      text: "Di sebelahmu ada Mr. C.Th. van Deventer, novelis Eduard Douwes Dekker (Multatuli), wartawan Pieter Brooshooft dari De Locomotief, serta Ratu Wilhelmina yang membacakan Pidato Takhta 1901!",
      choices: [
        { text: "Mari temui Multatuli untuk memahami akar Tanam Paksa!", nextKey: "multatuli_start" },
        { text: "Mari temui Mr. Van Deventer sekarang!", nextKey: "deventer_start" }
      ]
    }
  ],

  
  // BABAK 3: TUJUAN POLITIK ETIS
  "kala_tujuan_start": [
    {
      speaker: "Kala",
      role: "✦ EMPAT TUJUAN UTAMA ✦",
      characterKey: "kala",
      text: "Kini kita berada di BABAK 3: TUJUAN POLITIK ETIS! Ingatlah 4 tujuan luhur yang dicita-citakan: (1) Menyejahterakan kehidupan rakyat & petani, (2) Memberi pendidikan pengetahuan dan keterampilan, (3) Memperbaiki tata irigasi sawah rakyat, dan (4) Mengurangi kepadatan penduduk Pulau Jawa lewat transmigrasi.",
      choices: [
        { text: "Bagaimana tujuan-tujuan ini dijalankan dalam praktiknya di lapangan?", nextKey: "kala_tujuan_next" }
      ]
    }
  ],
  "kala_tujuan_next": [
    {
      speaker: "Kala",
      role: "✦ MENUJU TRILOGI KEBIJAKAN ✦",
      characterKey: "kala",
      text: "Mari kita selidiki langsung di lapangan apakah 4 tujuan luhur ini terwujud atau justru disimpangkan! Pergilah ke Sawah Sidoarjo di selatan untuk memeriksa Saluran Irigasi Pak Kromo!",
      onEnter: () => {
        questManager.completeQuest(3);
        setTimeout(() => showChapterRecap(3), 600);
      },
      choices: [
        { text: "✦ Mulai Penyelidikan Babak 4: Menuju Sawah Pak Kromo (Irigasi)!", nextKey: "farmer_start" },
        { text: "Jelajahi dunia secara bebas", nextKey: null }
      ]
    }
  ],

  // 2. MR. C.TH. VAN DEVENTER
  // 2. MR. C.TH. VAN DEVENTER
  "deventer_start": [
    {
      speaker: "C.Th. van Deventer",
      role: "✦ PENCETUS EEN EERESCHULD ✦",
      characterKey: "deventer",
      text: "Gegroet! Saya Conrad Theodor van Deventer. Saya melihat dengan mata kepala sendiri bagaimana jutaan gulden disedot dari Hindia Belanda melalui Sistem Tanam Paksa. Negeri Belanda berutang budi atas kehormatan moralnya!",
      choices: [
        { text: "Kisah apa yang Anda tulis dalam artikel 'Een Eereschuld' (1899)?", nextKey: "deventer_cerita" },
        { text: "Bagaimana Anda merumuskan konsep Trias Van Deventer?", nextKey: "deventer_trias" }
      ]
    }
  ],
  "deventer_cerita": [
    {
      speaker: "C.Th. van Deventer",
      role: "✦ UTANG KEHORMATAN ✦",
      characterKey: "deventer",
      text: "Saya menghitung bahwa sejak 1867, kas Belanda telah menyerap sedikitnya 187 juta gulden surplus murni dari Hindia Belanda. Dana sebesar itu harus dikembalikan untuk memajukan rakyat pribumi melalui kebijakan balas budi!",
      choices: [
        { text: "Apa 3 pilar yang Anda tawarkan sebagai jalan keluarnya?", nextKey: "deventer_trias" }
      ]
    }
  ],
  "deventer_trias": [
    {
      speaker: "C.Th. van Deventer",
      role: "✦ TRIAS VAN DEVENTER ✦",
      characterKey: "deventer",
      text: "Tiga pilar mutlak: 1. IRIGASI (Pengairan sawah pangan), 2. EDUKASI (Membuka sekolah bagi kaum pribumi), dan 3. EMIGRASI (Memindahkan penduduk Jawa yang padat ke Sumatra). Inilah Trias Van Deventer!",
      choices: [
        { text: "✦ Selesaikan Babak 1: Catat Utang Kehormatan & Lanjut ke Babak 2!", nextKey: "deventer_finish_b1" },
        { text: "Dengarkan kesaksian penderitaan Lebak dari Multatuli!", nextKey: "multatuli_start" }
      ]
    }
  ],
  "deventer_finish_b1": [
    {
      speaker: "Kala",
      role: "✦ REFLEKSI BABAK 1: LATAR BELAKANG ✦",
      characterKey: "kala",
      text: "Luar biasa! Kritik Max Havelaar dan naskah Een Eereschuld 1899 telah terukir dalam Buku Catatan Waktu. Mari buka infografis Babak 1 sebelum melangkah ke Babak Tokoh bersama Pieter Brooshooft & Ratu Wilhelmina!",
      onEnter: () => {
        achievementManager.unlock("utang_kehormatan");
        questManager.completeQuest(1);
        setTimeout(() => showChapterRecap(1), 600);
      },
      choices: [
        { text: "✦ Menuju Meja Redaksi Pieter Brooshooft (Babak 2)", nextKey: "brooshooft_start" },
        { text: "Lanjut menjelajah bebas di pelataran Den Haag", nextKey: null }
      ]
    }
  ],

  // 3. EDUARD DOUWES DEKKER (MULTATULI)
  "multatuli_start": [
    {
      speaker: "Multatuli (E. Douwes Dekker)",
      role: "✦ PENULIS MAX HAVELAAR ✦",
      characterKey: "multatuli",
      text: "Salam. Saya menulis roman 'Max Havelaar' pada 1860 menggunakan nama pena Multatuli—artinya 'Aku yang banyak menderita'. Saya menyaksikan langsung pemerasan bupati feodal dan pejabat kolonial terhadap rakyat kecil di Lebak Banten di bawah Tanam Paksa!",
      choices: [
        { text: "Ceritakan kisah tragis Saijah dan Adinda dalam buku Anda, Tuan.", nextKey: "multatuli_saijah" },
        { text: "Bagaimana tanggapan publik Eropa saat buku Anda terbit?", nextKey: "multatuli_efek" }
      ]
    }
  ],
  "multatuli_saijah": [
    {
      speaker: "Multatuli (E. Douwes Dekker)",
      role: "✦ TANGISAN LEBAK ✦",
      characterKey: "multatuli",
      text: "Kerbau milik keluarga Saijah dirampas berulang kali oleh penguasa untuk setoran pajak tanam paksa, hingga keluarganya mati menderita dan Adinda terbunuh. Cerita itu nyata! Saya tak sanggup berdiam diri melihat kezaliman itu.",
      choices: [
        { text: "Buku Anda benar-benar mengguncang nurani bangsa Eropa!", nextKey: "multatuli_efek" }
      ]
    }
  ],
  "multatuli_efek": [
    {
      speaker: "Multatuli (E. Douwes Dekker)",
      role: "✦ DAMPAK NOVEL ✦",
      characterKey: "multatuli",
      text: "Buku saya memecah keheningan kaum borjuis di Den Haag! Karya ini membuka mata kaum intelektual seperti Mr. C.Th. van Deventer dan jurnalis Pieter Brooshooft untuk menuntut keadilan moral bagi rakyat bumiputra!",
      choices: [
        { text: "Bicara dengan Mr. C.Th. van Deventer tentang Een Eereschuld!", nextKey: "deventer_start" },
        { text: "Bicara dengan wartawan Pieter Brooshooft di meja redaksi!", nextKey: "brooshooft_start" }
      ]
    }
  ],

  // 4. RATU WILHELMINA
  "wilhelmina_start": [
    {
      speaker: "Ratu Wilhelmina",
      role: "✦ RATU BELANDA (1901) ✦",
      characterKey: "wilhelmina",
      text: "Pada pembukaan parlemen bulan September 1901, dalam Pidato Takhta (Troonrede), saya menyatakan di hadapan seluruh anggota dewan: 'Sebagai bangsa Kristen, Belanda memiliki panggilan moral dan utang kehormatan untuk memajukan kemakmuran bangsa bumiputra di Hindia Belanda'.",
      choices: [
        { text: "Dengan demikian, Politik Etis resmi menjadi kebijakan kerajaan!", nextKey: "wilhelmina_finish" }
      ]
    }
  ],
  "wilhelmina_finish": [
    {
      speaker: "Ratu Wilhelmina",
      role: "✦ RATU BELANDA (1901) ✦",
      characterKey: "wilhelmina",
      text: "Melalui pidato resmi kerajaan ini, Babak Tokoh Utama telah paripurna. Namun ingatlah: kebijakan di atas kertas harus diuji di tanah Hindia Belanda! Pergilah temui Kala untuk memahami 4 tujuan luhur Politik Etis sebelum turun ke lapangan!",
      onEnter: () => {
        questManager.completeQuest(2);
        setTimeout(() => showChapterRecap(2), 600);
      },
      choices: [
        { text: "✦ Menuju Babak 3: Pahami 4 Tujuan Utama Politik Etis bersama Kala!", nextKey: "kala_tujuan_start" },
        { text: "Jelajahi area sekitar Den Haag", nextKey: null }
      ]
    }
  ],

  // 5. PAK KROMO (PETANI TRADISIONAL - PILAR IRIGASI)
  "farmer_start": [
    {
      speaker: "Pak Kromo",
      role: "✦ PETANI SAWAH ✦",
      characterKey: "farmer",
      text: "Duh Gusti... Kisanak, lihatlah sawah kami di pinggir Kali Brantas ini. Pemerintah memang membangun bendungan beton besar dan kincir air megah. Tapi tahukah kamu siapa yang minum airnya?",
      choices: [
        { text: "Siapa yang paling banyak mendapat aliran air bendungan, Pak?", nextKey: "kromo_curhat" },
        { text: "Apakah ada pembagian jadwal giliran air?", nextKey: "kromo_jadwal" }
      ]
    }
  ],
  "kromo_jadwal": [
    {
      speaker: "Pak Kromo",
      role: "✦ DISKRIMINASI AIR ✦",
      characterKey: "farmer",
      text: "Jadwalnya sangat tidak adil! Pada siang hari saat matahari terik, pintu air dibuka lebar-lebar menuju perkebunan tebu (*Suikerfabriek*) dan tembakau milik tuan tanah Belanda. Sawah padi kami hanya boleh mengambil sisa tetesan air di tengah malam buta!",
      choices: [
        { text: "Penyimpangan irigasi yang sangat merugikan rakyat!", nextKey: "kromo_curhat" }
      ]
    }
  ],
  "kromo_curhat": [
    {
      speaker: "Pak Kromo",
      role: "✦ GETIRNYA PETANI ✦",
      characterKey: "farmer",
      text: "Tebu milik pabrik gula Belanda tumbuh subur dan mereka meraup jutaan gulden dari ekspor gula dunia. Sedangkan kami para petani tetap dicekik pajak tanah (*landrente*). Irigasi Politik Etis hanya manis di bibir penguasa!",
      choices: [
        { text: "[KUIS] Mengapa air irigasi lebih diutamakan untuk perkebunan Belanda?", nextKey: "kromo_quiz" }
      ]
    }
  ],
  "kromo_quiz": [
    {
      speaker: "Pak Kromo",
      role: "✦ KUIS SEJARAH ✦",
      characterKey: "farmer",
      text: "Berdasarkan kenyataan tadi, mengapa pemerintah kolonial lebih memprioritaskan air irigasi ke perkebunan tebu Belanda dibanding sawah rakyat?",
      choices: [
        { text: "A. Karena gula tebu adalah komoditas ekspor bernilai tinggi bagi kas Belanda", nextKey: "quiz_kromo_benar" },
        { text: "B. Karena sawah padi rakyat tidak membutuhkan air sama sekali", nextKey: "quiz_kromo_salah" }
      ]
    }
  ],
  "quiz_kromo_benar": [
    {
      speaker: "Pak Kromo",
      role: "✦ JAWABAN TEPAT ✦",
      characterKey: "farmer",
      text: "Tepat sekali! Demi keuntungan ekspor gula dan kas kolonial, nasib pangan rakyat pribumi dikorbankan. Catatlah kenyataan ini di jurnalmu!",
      choices: [
        { text: "Terima kasih Pak Kromo. Saya akan selidiki pilar Edukasi!", nextKey: "kromo_finish" }
      ]
    }
  ],
  "quiz_kromo_salah": [
    {
      speaker: "Pak Kromo",
      role: "✦ PENJELASAN ✦",
      characterKey: "farmer",
      text: "Bukan begitu, kisanak! Padi sangat butuh air. Belanda membelokkan air demi keuntungan komoditas ekspor pabrik gula mereka.",
      choices: [
        { text: "Saya paham sekarang. Mari menuju Kampus STOVIA!", nextKey: "kromo_finish" }
      ]
    }
  ],
  "kromo_finish": [
    {
      speaker: "Pak Kromo",
      role: "✦ PETANI SAWAH ✦",
      characterKey: "farmer",
      text: "Penyimpangan irigasi telah terang benderang bagi matamu. Sekarang pergilah ke timur laut menuju Kampus STOVIA! Di sana ada Raden Ajeng Kartini dan dr. Wahidin yang sedang memperjuangkan pilar kedua: Edukasi!",
      onEnter: () => {
        achievementManager.unlock("misi_irigasi");
      },
      choices: [
        { text: "✦ Menuju Pilar Edukasi: Temui Ibu Kartini & dr. Wahidin!", nextKey: "kartini_start" },
        { text: "Periksa pintu air bendungan dulu", nextKey: null }
      ]
    }
  ],

  // DAM INSPECT
  "dam_inspect": [
    {
      speaker: "Kala",
      role: "✦ ARSIP PINTU AIR ✦",
      characterKey: "kala",
      text: "Papan Kontrol Pintu Air: Katup Primer mengarah ke Pabrik Gula Suikerfabriek Klampis. Katup Sekunder mengalir ke persawahan rakyat dengan debit air minim. Sebuah bukti tak terbantahkan penyimpangan pilar Irigasi!",
      choices: [
        { text: "Catat temuan ini.", nextKey: null }
      ]
    }
  ],

  // 6. RADEN AJENG KARTINI (PILAR EDUKASI & EMANSIPASI)
  "kartini_start": [
    {
      speaker: "R.A. Kartini",
      role: "✦ PELOPOR EMANSIPASI ✦",
      characterKey: "kartini",
      text: "Salam sejahtera, sahabatku. Saya menulis surat-surat kepada sahabat saya di Belanda, Ny. Rosa Abendanon. Saya merindukan masa depan di mana perempuan bumiputra tidak lagi terkurung dalam pingitan adat, melainkan bebas bersekolah dan berkarya!",
      choices: [
        { text: "Apa cita-cita terbesar Anda bagi pendidikan wanita pribumi?", nextKey: "kartini_sekolah" },
        { text: "Bagaimana surat-surat Anda menginspirasi Politik Etis?", nextKey: "kartini_surat" }
      ]
    }
  ],
  "kartini_surat": [
    {
      speaker: "R.A. Kartini",
      role: "✦ HABIS GELAP TERBITLAH TERANG ✦",
      characterKey: "kartini",
      text: "Pikiran-pikiran yang saya tuangkan dalam kumpulan 'Door Duisternis tot Licht' (Habis Gelap Terbitlah Terang) menyadarkan para tokoh Politik Etis seperti Mr. Abendanon bahwa mendidik kaum perempuan adalah kunci utama peradaban bangsa!",
      choices: [
        { text: "Dan Anda mendirikan sekolah wanita pertama di Jepara?", nextKey: "kartini_sekolah" }
      ]
    }
  ],
  "kartini_sekolah": [
    {
      speaker: "R.A. Kartini",
      role: "✦ SEKOLAH KARTINI ✦",
      characterKey: "kartini",
      text: "Ya! Bersama adik-adik saya, kami membuka sekolah kejuruan dan membaca bagi putri-putri bumiputra. Kini, temui dr. Wahidin Soedirohoesodo di sebelah. Beliau sedang menggalang dana beasiswa bagi pemuda terpelajar!",
      choices: [
        { text: "Sungguh mulia perjuangan Ibu Kartini. Saya akan temui dr. Wahidin!", nextKey: "wahidin_start" }
      ]
    }
  ],

  // 7. DR. WAHIDIN SOEDIROHOESODO
  "wahidin_start": [
    {
      speaker: "dr. Wahidin Soedirohoesodo",
      role: "✦ PELOPOR STUDIEFONDS ✦",
      characterKey: "wahidin",
      text: "Sugeng pinanggih! Saya dr. Wahidin, lulusan Sekolah Dokter Jawa. Saya berkeliling pulau Jawa mengetuk pintu para priyayi dan bangsawan untuk mengumpulkan 'Studiefonds' (Dana Beasiswa Pendidikan).",
      choices: [
        { text: "Mengapa Anda begitu gigih memperjuangkan beasiswa pendidikan?", nextKey: "wahidin_cerita" },
        { text: "Bagaimana gagasan Anda melahirkan Budi Utomo 1908?", nextKey: "wahidin_budi_utomo" }
      ]
    }
  ],
  "wahidin_cerita": [
    {
      speaker: "dr. Wahidin Soedirohoesodo",
      role: "✦ STUDIEFONDS PENDIDIKAN ✦",
      characterKey: "wahidin",
      text: "Banyak anak-anak rakyat jelata yang cerdas dan berbakat, namun terpaksa putus sekolah karena tidak punya biaya. Bangsa ini hanya bisa bangkit jika rakyatnya cerdas dan berilmu!",
      choices: [
        { text: "Dan gagasan itu disambut oleh mahasiswa STOVIA?", nextKey: "wahidin_budi_utomo" }
      ]
    }
  ],
  "wahidin_budi_utomo": [
    {
      speaker: "dr. Wahidin Soedirohoesodo",
      role: "✦ GAGASAN KEBANGKITAN ✦",
      characterKey: "wahidin",
      text: "Tepat pada akhir 1907, saya berpidato di hadapan siswa-siswa STOVIA di Batavia. Pemuda Soetomo dan kawan-kawannya sangat terharu hingga memutuskan mendirikan organisasi Budi Utomo pada 20 Mei 1908!",
      choices: [
        { text: "Pendidikan benar-benar memicu lahirnya kebangkitan bangsa!", nextKey: "wahidin_finish" }
      ]
    }
  ],
  "wahidin_finish": [
    {
      speaker: "dr. Wahidin Soedirohoesodo",
      role: "✦ DOKTER BUDIMAN ✦",
      characterKey: "wahidin",
      text: "Belanda membuka sekolah untuk mencari juru tulis kantor yang murah, tetapi mereka lupa: ilmu pengetahuan selalu melahirkan jiwa kemerdekaan! Sekarang pergilah ke dermaga selatan untuk menyelidiki pilar ketiga: Emigrasi / Transmigrasi!",
      onEnter: () => {
        achievementManager.unlock("misi_edukasi");
      },
      choices: [
        { text: "✦ Menuju Pilar Emigrasi: Temui Amat Kuli Deli di Dermaga!", nextKey: "kuli_deli_start" },
        { text: "Jelajahi kampus STOVIA lebih lanjut", nextKey: null }
      ]
    }
  ],

  // 8. AMAT (KULI KONTRAK DELI - PILAR TRANSMIGRASI)
  "kuli_deli_start": [
    {
      speaker: "Amat (Kuli Kontrak Deli)",
      role: "✦ KORBAN POENALE SANCTIE ✦",
      characterKey: "kuli_deli",
      text: "Tolong dengarkan suara kami... Saya tergoda bujuk rayu mandor yang menjanjikan tanah dan upah besar di perkebunan tembakau Deli Sumatra. Namun sesampainya di sana, kami diperlakukan tak ubahnya budak!",
      choices: [
        { text: "Apa yang terjadi jika kuli mencoba kabur atau memprotes?", nextKey: "amat_poenale" },
        { text: "Bagaimana kondisi kerja di perkebunan Deli saat itu?", nextKey: "amat_kondisi" }
      ]
    }
  ],
  "amat_kondisi": [
    {
      speaker: "Amat (Kuli Kontrak Deli)",
      role: "✦ JERITAN PERKEBUNAN DELI ✦",
      characterKey: "kuli_deli",
      text: "Kami bekerja dari subuh hingga petang di bawah terik matahari dan ancaman cambuk. Upah kami dipotong hutang perjalanan dan perjudian yang sengaja disediakan mandor Belanda agar kami tak bisa pulang ke Jawa!",
      choices: [
        { text: "Lalu apa aturan hukum kejam 'Poenale Sanctie' itu?", nextKey: "amat_poenale" }
      ]
    }
  ],
  "amat_poenale": [
    {
      speaker: "Amat (Kuli Kontrak Deli)",
      role: "✦ SANKSI PIDANA CAMBUK ✦",
      characterKey: "kuli_deli",
      text: "Hukum kolonial 'Poenale Sanctie' memberi hak legal kepada pengusaha Belanda untuk menangkap, mencambuk, atau memenjarakan kuli yang melarikan diri dari perkebunan. Emigrasi ini bagi kami adalah jeratan rantai perbudakan!",
      choices: [
        { text: "[KUIS] Apa dampak sanksi Poenale Sanctie bagi kuli kontrak?", nextKey: "amat_quiz" }
      ]
    }
  ],
  "amat_quiz": [
    {
      speaker: "Amat (Kuli Kontrak Deli)",
      role: "✦ KUIS SEJARAH ✦",
      characterKey: "kuli_deli",
      text: "Tahukah kamu apa yang terjadi jika seorang kuli kontrak di perkebunan Sumatra melanggar perjanjian kerja di bawah hukum Poenale Sanctie?",
      choices: [
        { text: "A. Dijatuhi hukuman denda, kerja paksa, atau kurungan penjara oleh polisi kolonial", nextKey: "quiz_amat_benar" },
        { text: "B. Diizinkan pulang gratis naik kapal ke kampung halaman", nextKey: "quiz_amat_salah" }
      ]
    }
  ],
  "quiz_amat_benar": [
    {
      speaker: "Amat (Kuli Kontrak Deli)",
      role: "✦ KEBENARAN SEJARAH ✦",
      characterKey: "kuli_deli",
      text: "Benar sekali... Banyak kuli yang disiksa hingga tewas sampai kasus ini dibongkar oleh J. van den Brand dalam pamflet 'De Millioenen uit Deli' (Jutaan Gulden dari Deli)!",
      choices: [
        { text: "Bicara dengan Koordinator Emigrasi Lampung di sebelah!", nextKey: "migrant_start" }
      ]
    }
  ],
  "quiz_amat_salah": [
    {
      speaker: "Amat (Kuli Kontrak Deli)",
      role: "✦ PENJELASAN ✦",
      characterKey: "kuli_deli",
      text: "Mustahil! Kuli yang kabur akan diburu polisi seperti buronan dan dijatuhi hukuman cambuk atau kerja paksa.",
      choices: [
        { text: "Kenyataan yang sangat memilukan. Mari temui Koordinator!", nextKey: "migrant_start" }
      ]
    }
  ],

  // 9. KOORDINATOR TRANSMIGRASI LAMPUNG 1905
  "migrant_start": [
    {
      speaker: "Koordinator Emigrasi",
      role: "✦ PELOPOR TRANSMIGRASI 1905 ✦",
      characterKey: "migrant",
      text: "Di sisi lain dari kuli kontrak Deli, pada November 1905 pemerintah secara resmi memberangkatkan rombongan pertama kolonisasi: 155 keluarga dari Kedu Jawa Tengah menuju Gedong Tataan, Lampung!",
      choices: [
        { text: "Mengapa peristiwa Gedong Tataan 1905 dianggap sangat bersejarah?", nextKey: "migrant_sejarah" }
      ]
    }
  ],
  "migrant_sejarah": [
    {
      speaker: "Koordinator Emigrasi",
      role: "✦ TONGGAK TRANSMIGRASI ✦",
      characterKey: "migrant",
      text: "Karena inilah cikal bakal resmi program TRANSMIGRASI nasional Indonesia! Setelah merdeka, konsep ini dilanjutkan oleh Presiden Soekarno dan pemerintah Indonesia untuk pemerataan penduduk dan pembangunan antarpulau.",
      choices: [
        { text: "Lengkap sudah 3 pilar: Irigasi, Edukasi, dan Emigrasi!", nextKey: "migrant_finish" }
      ]
    }
  ],
  "migrant_finish": [
    {
      speaker: "Koordinator Emigrasi",
      role: "✦ MENUJU AULA 1908 ✦",
      characterKey: "migrant",
      text: "Lengkap sudah penyelidikan 3 pilar: Irigasi, Edukasi, dan Emigrasi beserta penyimpangannya! Sekarang masuklah ke Aula STOVIA di tengah. dr. Soetomo dan para pemuda pergerakan sedang merumuskan 4 dampak besar Politik Etis!",
      onEnter: () => {
        achievementManager.unlock("misi_transmigrasi");
        questManager.completeQuest(4);
        setTimeout(() => showChapterRecap(4), 600);
      },
      choices: [
        { text: "✦ Menuju Babak 5: Temui dr. Soetomo di Aula STOVIA!", nextKey: "soetomo_start" },
        { text: "Jelajahi area dermaga Lampung", nextKey: null }
      ]
    }
  ],

  // 10. DR. SOETOMO (PUNCAK 4 DAMPAK BESAR & BUDI UTOMO 1908)
  "soetomo_start": [
    {
      speaker: "dr. Soetomo",
      role: "✦ PENDIRI BUDI UTOMO 1908 ✦",
      characterKey: "soetomo",
      text: "Saudaraku sebangsa dan setanah air! Pada hari Rabu, 20 Mei 1908, di ruang anatomi STOVIA, kami mendirikan Boedi Oetomo. Mari kita rumuskan bersama 4 Dampak Agung Politik Etis bagi nasib bangsa!",
      choices: [
        { text: "1. Apa dampak di Bidang Pendidikan & Sosial?", nextKey: "soetomo_pendidikan_sosial" },
        { text: "2. Apa dampak di Bidang Ekonomi?", nextKey: "soetomo_ekonomi" },
        { text: "3. Apa puncak dampak di Bidang Politik?", nextKey: "soetomo_politik" }
      ]
    }
  ],
  "soetomo_pendidikan_sosial": [
    {
      speaker: "dr. Soetomo",
      role: "✦ BIDANG PENDIDIKAN & SOSIAL ✦",
      characterKey: "soetomo",
      text: "Lahirnya golongan baru: KAUM INTELEKTUAL! Kedudukan feodal bangsawan kolot tergeser oleh kaum berpendidikan. Kesadaran nasionalisme tumbuh pesat, dan sekolah swasta kebangsaan bermunculan seperti Taman Siswa oleh Ki Hadjar Dewantara!",
      choices: [
        { text: "Bagaimana dampak di Bidang Ekonomi?", nextKey: "soetomo_ekonomi" },
        { text: "Dan apa puncaknya di Bidang Politik?", nextKey: "soetomo_politik" }
      ]
    }
  ],
  "soetomo_ekonomi": [
    {
      speaker: "dr. Soetomo",
      role: "✦ BIDANG EKONOMI ✦",
      characterKey: "soetomo",
      text: "Di bidang Ekonomi: Terjadi komersialisasi perkebunan dan jaringan kereta api. Namun sebagian besar surplus mengalir ke kas Belanda, sementara rakyat pribumi tetap terbebani pajak tanah (*landrente*).",
      choices: [
        { text: "Lalu apa dampak paling monumental di Bidang Politik?", nextKey: "soetomo_politik" }
      ]
    }
  ],
  "soetomo_politik": [
    {
      speaker: "dr. Soetomo",
      role: "✦ BIDANG POLITIK ✦",
      characterKey: "soetomo",
      text: "Puncaknya ada di Bidang Politik! Lahir organisasi pergerakan modern terstruktur: BUDI UTOMO (1908), disusul Sarekat Islam (1912) oleh H.O.S. Tjokroaminoto, dan Indische Partij (1912) oleh Tiga Serangkai yang berani menuntut kemerdekaan!",
      choices: [
        { text: "[KUIS SEJARAH] Siapakah 'Tiga Serangkai' pendiri Indische Partij?", nextKey: "soetomo_quiz" }
      ]
    }
  ],
  "soetomo_quiz": [
    {
      speaker: "dr. Soetomo",
      role: "✦ KUIS SEJARAH ✦",
      characterKey: "soetomo",
      text: "Tahukah kamu siapa 3 tokoh pendiri partai politik pertama di Nusantara (Indische Partij 1912) yang dikenal sebagai 'Tiga Serangkai'?",
      choices: [
        { text: "A. E.F.E. Douwes Dekker, dr. Tjipto Mangoenkoesoemo, dan Suwardi Suryaningrat (Ki Hadjar Dewantara)", nextKey: "quiz_soetomo_benar" },
        { text: "B. Van Deventer, Multatuli, dan Ratu Wilhelmina", nextKey: "quiz_soetomo_salah" }
      ]
    }
  ],
  "quiz_soetomo_benar": [
    {
      speaker: "dr. Soetomo",
      role: "✦ MAHASISWA TELADAN! ✦",
      characterKey: "soetomo",
      text: "Tepat sekali! Tiga Serangkai dengan lantang menyuarakan 'Indie voor Indiers' (Hindia untuk orang Hindia). Perjuangan fisik bersenjata telah berevolusi menjadi diplomasi politik modern!",
      choices: [
        { text: "Hari lahir Budi Utomo kini kita kenang sebagai Hari Kebangkitan Nasional!", nextKey: "soetomo_finish" }
      ]
    }
  ],
  "quiz_soetomo_salah": [
    {
      speaker: "dr. Soetomo",
      role: "✦ EVALUASI ✦",
      characterKey: "soetomo",
      text: "Tiga Serangkai adalah putra-putra pergerakan: Danudirja Setiabudi (E.F.E Douwes Dekker), dr. Tjipto Mangoenkoesoemo, dan Suwardi Suryaningrat (Ki Hadjar Dewantara)!",
      choices: [
        { text: "Paham! Lanjut ke refleksi akhir bersama Kala.", nextKey: "soetomo_finish" }
      ]
    }
  ],
  "soetomo_finish": [
    {
      speaker: "dr. Soetomo",
      role: "✦ PENDIRI BUDI UTOMO 1908 ✦",
      characterKey: "soetomo",
      text: "Empat dampak agung telah terpatri dalam sejarah! Sekarang temui Kala di Tugu Prasasti Selatan. Renungkanlah kesimpulan akhir mengapa Politik Etis menjadi 'senjata makan tuan' bagi Belanda!",
      onEnter: () => {
        achievementManager.unlock("fajar_kebangkitan");
        questManager.completeQuest(5);
        setTimeout(() => showChapterRecap(5), 600);
      },
      choices: [
        { text: "✦ Menuju Babak 6: Tugu Akhir Politik Etis (Senjata Makan Tuan)!", nextKey: "akhir_politik_etis_start" },
        { text: "Pelajari arsip di ruang STOVIA", nextKey: null }
      ]
    }
  ],

  // 11. AKHIR POLITIK ETIS & KESIMPULAN
  "akhir_politik_etis_start": [
    {
      speaker: "Kala",
      role: "✦ KESIMPULAN SEJARAH ✦",
      characterKey: "kala",
      text: "Lihatlah tugu ini! Pada akhirnya, mengapa Politik Etis berakhir? Ada 3 faktor utama: 1. Penentangan kaum konservatif Belanda, 2. Depresi ekonomi dunia (*Malaise 1929*), dan yang terpenting: Politik Etis terbukti menjadi 'SENJATA MAKAN TUAN' bagi Belanda!",
      choices: [
        { text: "Mengapa disebut 'Senjata Makan Tuan', Kala?", nextKey: "akhir_senjata" },
        { text: "Apa benang merahnya dengan kemerdekaan 1945?", nextKey: "akhir_kemerdekaan" }
      ]
    }
  ],
  "akhir_senjata": [
    {
      speaker: "Kala",
      role: "✦ SENJATA MAKAN TUAN ✦",
      characterKey: "kala",
      text: "Belanda membuka sekolah hanya demi mencetak juru tulis murah. Namun, para pemuda terpelajar itu justru memakai pena dan kepintaran diplomasi mereka untuk melawan penjajah, membakar semangat nasionalisme, hingga menyatukan seluruh suku bangsa!",
      choices: [
        { text: "Dan puncaknya adalah proklamasi kemerdekaan?", nextKey: "akhir_kemerdekaan" }
      ]
    }
  ],
  "akhir_kemerdekaan": [
    {
      speaker: "Kala",
      role: "✦ MENUJU 17 AGUSTUS 1945 ✦",
      characterKey: "kala",
      text: "Dari Budi Utomo 1908, lahirlah Sumpah Pemuda 1928, hingga akhirnya Soekarno dan Hatta memproklamasikan Kemerdekaan Indonesia pada 17 Agustus 1945! Kebijakan Politik Etis yang dirancang penjajah justru menggali kubur bagi kekuasaan kolonial itu sendiri!",
      choices: [
        { text: "Sebuah mahakarya sejarah persatuan yang abadi!", nextKey: "akhir_win" }
      ]
    }
  ],
  "akhir_win": [
    {
      speaker: "Kala",
      role: "✦ EKSPEDISI TUNTAS ✦",
      characterKey: "kala",
      text: "Selamat! Kamu telah menyelesaikan seluruh ekspedisi Trilogi Politik Etis Van Deventer, menguak seluruh pilar dan penyimpangannya, berbicara dengan seluruh tokoh sejarah, dan resmi menyandang gelar 'Pakar Sejarah Politik Etis Nusantara'!",
      onEnter: () => {
        achievementManager.unlock("akhir_politik_etis");
        questManager.completeQuest(6);
        setTimeout(() => showChapterRecap(6), 600);
      },
      choices: [
        { text: "✦ Aku bangga menjadi Generasi Penerus Bangsa Indonesia!", nextKey: null }
      ]
    }
  ]
};

// ==========================================================================
// BANK SOAL UJIAN EVALUASI KEBANGKITAN NASIONAL (10 SOAL INTERAKTIF)
// Dilengkapi Pembahasan Akademik & Penilaian Otomatis
// ==========================================================================
const EVALUATION_QUIZ_DATA = [
  {
    id: 1,
    question: "Siapakah tokoh Belanda yang menulis artikel fenomenal 'Een Eereschuld' (Utang Kehormatan) pada tahun 1899?",
    options: [
      "Eduard Douwes Dekker (Multatuli)",
      "Conrad Theodor van Deventer",
      "Gubernur Jenderal Van den Bosch",
      "Pieter Brooshooft"
    ],
    answer: 1,
    explanation: "C.Th. van Deventer menulis artikel 'Een Eereschuld' di majalah De Gids (1899), menyatakan Belanda berutang moral 187 juta gulden kepada Hindia Belanda."
  },
  {
    id: 2,
    question: "Apa saja isi dari Trias Van Deventer dalam kebijakan Politik Etis?",
    options: [
      "Monopoli, Tanam Paksa, dan Romusha",
      "Irigasi, Edukasi, dan Emigrasi (Transmigrasi)",
      "Devide et Impera, Ekstirpasi, dan Pelayaran Hongi",
      "Agraria, Industrialisasi, dan Militerisasi"
    ],
    answer: 1,
    explanation: "Trias Van Deventer mencakup tiga program utama: Irigasi (pengairan), Edukasi (pendidikan), dan Emigrasi (pemindahan penduduk)."
  },
  {
    id: 3,
    question: "Buku karya Multatuli (1860) yang mengguncang nurani bangsa Eropa karena membongkar penderitaan rakyat Lebak berjudul...",
    options: [
      "De Locomotief",
      "Habis Gelap Terbitlah Terang",
      "Max Havelaar",
      "Een Eereschuld"
    ],
    answer: 2,
    explanation: "Novel 'Max Havelaar' karya Eduard Douwes Dekker (Multatuli) mengisahkan penindasan sistem Tanam Paksa di Lebak, Banten."
  },
  {
    id: 4,
    question: "Dalam pelaksanaannya, apa penyimpangan yang terjadi pada program Irigasi Politik Etis?",
    options: [
      "Saluran air sengaja diracuni oleh pejabat kolonial",
      "Air bersih melimpah dialirkan siang hari ke perkebunan tebu pengusaha Belanda, sedangkan sawah rakyat hanya malam hari",
      "Air irigasi dijual ke negara tetangga dengan harga mahal",
      "Petani pribumi dilarang menanam padi selamanya"
    ],
    answer: 1,
    explanation: "Irigasi mengalami diskriminasi besar: perkebunan swasta Belanda mendapat jatah utama di siang hari, sementara sawah rakyat hanya sisa malam hari."
  },
  {
    id: 5,
    question: "Lembaga pendidikan kedokteran bumiputra di Batavia yang menjadi kawah candradimuka pergerakan pemuda adalah...",
    options: [
      "STOVIA (School tot Opleiding van Inlandsche Artsen)",
      "OSVIA (Sekolah Calon Pamong Praja)",
      "HBS (Hogere Burgerschool)",
      "THS (Technische Hoogeschool)"
    ],
    answer: 0,
    explanation: "STOVIA di Batavia mencetak dokter bumiputra terpelajar yang sadar akan penindasan kolonial dan mendirikan organisasi Budi Utomo."
  },
  {
    id: 6,
    question: "Apa bentuk penindasan yang dialami para kuli kontrak Jawa yang dipindahkan ke Deli, Sumatra?",
    options: [
      "Dilarang berbicara bahasa Jawa",
      "Wajib membayar upeti emas setiap pekan",
      "Terjerat utang dan ancaman hukuman cambuk/kerja paksa (Poenale Sanctie)",
      "Diberikan tanah perkebunan cuma-cuma"
    ],
    answer: 2,
    explanation: "Para kuli kontrak di perkebunan Deli diikat aturan kejam Poenale Sanctie, di mana kuli yang kabur atau membantah mandor dihukum cambuk dan kerja paksa."
  },
  {
    id: 7,
    question: "Mengapa Politik Etis disebut menjadi 'Senjata Makan Tuan' bagi pemerintah kolonial Belanda?",
    options: [
      "Belanda kehabisan amunisi mesiu dan senjata api",
      "Edukasi yang awalnya untuk pegawai rendahan murah justru melahirkan kaum intelektual terpelajar yang memimpin perlawanan kemerdekaan",
      "Petani menyerang pos Belanda menggunakan cangkul irigasi",
      "Belanda bangkrut karena membangun terlalu banyak sekolah gratis"
    ],
    answer: 1,
    explanation: "Sekolah kolonial yang dibuka justru membukakan mata kaum intelektual bumiputra, yang berbalik melawan penjajahan hingga proklamasi kemerdekaan."
  },
  {
    id: 8,
    question: "Organisasi pergerakan modern pertama di Indonesia yang didirikan pada 20 Mei 1908 adalah...",
    options: [
      "Sarekat Islam",
      "Indische Partij",
      "Budi Utomo",
      "Perhimpunan Indonesia"
    ],
    answer: 2,
    explanation: "Budi Utomo didirikan oleh dr. Soetomo dan mahasiswa STOVIA atas gagasan dr. Wahidin Soedirohoesodo pada 20 Mei 1908 (Hari Kebangkitan Nasional)."
  },
  {
    id: 9,
    question: "Tokoh wanita pelopor emansipasi yang memperjuangkan pendidikan bagi kaum perempuan bumiputra melalui surat-suratnya adalah...",
    options: [
      "Cut Nyak Dien",
      "Raden Ajeng Kartini",
      "Dewi Sartika",
      "Rasuna Said"
    ],
    answer: 1,
    explanation: "R.A. Kartini menyuarakan perjuangan pendidikan perempuan melalui surat-suratnya (Door Duisternis tot Licht / Habis Gelap Terbitlah Terang)."
  },
  {
    id: 10,
    question: "Surat kabar berbahasa Belanda di Semarang yang gencar memuat kritik sosial tentang kemiskinan rakyat Jawa dipimpin oleh Pieter Brooshooft bernama...",
    options: [
      "Bataviaasch Nieuwsblad",
      "De Locomotief",
      "Java Bode",
      "Medan Prijaji"
    ],
    answer: 1,
    explanation: "Koran 'De Locomotief' yang dipimpin Pieter Brooshooft menjadi corong utama jurnalisme etis yang mendesak ratu Belanda bertindak."
  }
];

// ==========================================================================
// 5 PETI HARTA KARUN ARTEFAK SEJARAH TERSEMBUNYI (HIDDEN RELIC CHESTS)
// ==========================================================================
const HISTORICAL_CHESTS_DATA = [
  {
    id: "chest_megalith",
    x: 240,
    y: 1100,
    title: "Peti Relik Megalitikum",
    item: "Artefak Kapak Persegi & Manik Batu",
    exp: 100,
    desc: "Bukti peradaban agraris mandiri leluhur Nusantara sebelum era kolonialisme.",
    opened: false
  },
  {
    id: "chest_sawah",
    x: 1350,
    y: 1320,
    title: "Peti Rahasia Sawah Sidoarjo",
    item: "Buku Catatan Pembagian Air Kolonial 1904",
    exp: 100,
    desc: "Catatan rahasia yang mencatat jatah air perkebunan tebu Suikerfabriek.",
    opened: false
  },
  {
    id: "chest_pine_grove",
    x: 1820,
    y: 280,
    title: "Peti Arsip Hutan Cemara",
    item: "Naskah Surat Pembaca De Locomotief",
    exp: 100,
    desc: "Kritik tajam jurnalisme etis terhadap kelaparan di pedalaman Jawa.",
    opened: false
  },
  {
    id: "chest_stovia",
    x: 2850,
    y: 520,
    title: "Peti Dokumen Mahasiswa STOVIA",
    item: "Buku Catatan Kedokteran & Studiefonds",
    exp: 100,
    desc: "Rancangan awal dana beasiswa pelajar pintar bumiputra oleh dr. Wahidin.",
    opened: false
  },
  {
    id: "chest_deli",
    x: 2850,
    y: 1300,
    title: "Peti Besi Perkebunan Deli",
    item: "Salinan Surat Perjanjian Poenale Sanctie",
    exp: 100,
    desc: "Arsip bersejarah tentang sanksi cambuk bagi kuli kontrak yang melarikan diri.",
    opened: false
  }
];