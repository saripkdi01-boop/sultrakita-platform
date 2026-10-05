// Otak JS SWAT v2 — pencocokan cerdas berbasis skor + intent
// Bahasa Indonesia, tanpa dependensi eksternal.

export type FaqEntry = {
  keys: string[];      // kata kunci (bobot lebih tinggi jika frasa multi-kata)
  synonyms?: string[];  // sinonim / variasi ejaan
  answer: string;
  followUp?: string[];  // pertanyaan lanjutan yang disarankan
};

const WA_NUMBER = '6281993532722';

export const FAQ: FaqEntry[] = [
  {
    keys: ['apa itu suki apps', 'tentang suki', 'suki apps itu apa'],
    synonyms: ['suki', 'aplikasi suki', 'platform suki'],
    answer: 'SUKI Apps adalah super-app lokal Sulawesi Tenggara 🇮🇩 — marketplace, properti (800+ listing), komunitas, lowongan kerja, berita, dan game dalam satu platform. Gratis dipakai, semua Bahasa Indonesia!',
    followUp: ['Cara jualan di marketplace?', 'Game apa saja yang ada?', 'Cara daftar akun?'],
  },
  {
    keys: ['cara jualan', 'cara menjual', 'pasang iklan', 'buat listing', 'jualan'],
    synonyms: ['jual', 'seller', 'dagang', 'lapak'],
    answer: 'Cara jualan di SUKI Marketplace 📸:\n1. Buka menu Marketplace\n2. Tekan tombol "+ Jual"\n3. Isi foto (bisa beberapa), judul, harga, deskripsi\n4. Tekan "Terbitkan" — listing langsung tayang otomatis!\n\nGratis, tanpa biaya pasang iklan.',
    followUp: ['Apakah jualan gratis?', 'Cara beli barang?'],
  },
  {
    keys: ['cara beli', 'cara membeli', 'cara order', 'belanja'],
    synonyms: ['beli', 'order', 'checkout', 'pembeli'],
    answer: 'Cara beli di SUKI Marketplace 💬:\n1. Cari barang yang kamu mau\n2. Buka halaman detailnya\n3. Hubungi penjual via tombol chat/WhatsApp\n4. Sepakati harga & pengiriman langsung dengan penjual',
    followUp: ['Apakah aman belanja di sini?', 'Cara jualan di marketplace?'],
  },
  {
    keys: ['apakah gratis', 'bayar', 'biaya', 'harga layanan', 'berapa harga'],
    synonyms: ['gratis', 'free', 'cost', 'tarif'],
    answer: 'SUKI Apps GRATIS untuk pengguna! 🎉\n• Daftar akun: gratis\n• Pasang iklan marketplace: gratis\n• Main game: gratis\n• Gabung komunitas: gratis\n\nBerbayar hanya: SUKI Web Studio (jasa bikin website, mulai Rp 1,5 jt).',
    followUp: ['Apa itu SUKI Web Studio?', 'Cara daftar akun?'],
  },
  {
    keys: ['web studio', 'bikin website', 'jasa website', 'buat web'],
    synonyms: ['website', 'web', 'landing page', 'company profile', 'toko online'],
    answer: 'SUKI Web Studio 🌐 — jasa pembuatan website profesional:\n• Landing Page: Rp 1,5 jt\n• Company Profile: Rp 3 jt\n• Toko Online: Rp 6 jt\n• Web App Custom: Rp 15 jt\n• Care Plan: Rp 500rb/bulan\n\nBuka menu SUKI Web Studio untuk order langsung via WhatsApp!',
    followUp: ['Berapa lama pembuatan website?', 'Apakah ada garansi?'],
  },
  {
    keys: ['properti', 'cari rumah', 'cari tanah', 'kos', 'kontrakan', 'ruko'],
    synonyms: ['rumah', 'tanah', 'property', 'hunian', 'apartemen'],
    answer: 'Cari properti di SUKI Properti 🏠 — 800+ listing rumah, tanah, kos, dan ruko di Sulawesi Tenggara! Lengkap dengan foto, harga transparan, dan peta lokasi. Buka menu Properti.',
    followUp: ['Apakah data properti valid?', 'Bisa pasang iklan properti?'],
  },
  {
    keys: ['game', 'main game', 'jala', 'kampung', 'bermain'],
    synonyms: ['games', 'suki games', 'nelayan', 'berkebun'],
    answer: 'Ada 2 game seru di SUKI Games 🎮:\n• **JALA** — simulasi jadi nelayan Sultra! Lempar jala, tarik ikan, lelang hasil tangkapan\n• **SUKI Kampung** — game berkebun: tanam, panen, ikut kuis\n\nBuka menu Ekosistem → SUKI Games. Gratis dimainkan!',
    followUp: ['Apakah game gratis?', 'Cara main JALA?'],
  },
  {
    keys: ['cara daftar', 'buat akun', 'registrasi', 'signup', 'mendaftar'],
    synonyms: ['daftar', 'register', 'akun baru'],
    answer: 'Daftar akun SUKI Apps gratis ✨:\n1. Tekan tombol "Masuk" di kanan atas\n2. Pilih "Daftar"\n3. Bisa pakai akun Google (1 klik) atau email\n\nLangsung bisa jualan, gabung komunitas, dan main game!',
    followUp: ['Lupa password bagaimana?', 'Apakah gratis?'],
  },
  {
    keys: ['lupa password', 'reset password', 'ganti password'],
    synonyms: ['password', 'kata sandi', 'sandi'],
    answer: 'Reset password 📧:\n1. Di halaman Masuk, klik "Lupa password"\n2. Masukkan email terdaftar\n3. Cek inbox email → klik link reset\n4. Buat password baru\n\nTidak terima email? Cek folder spam.',
  },
  {
    keys: ['cara masuk', 'login', 'log in', 'sign in'],
    synonyms: ['masuk', 'signin'],
    answer: 'Tekan tombol "Masuk" di kanan atas 🔑, lalu login dengan Google atau email + password yang sudah terdaftar.',
  },
  {
    keys: ['lowongan kerja', 'loker', 'cari kerja', 'jobs'],
    synonyms: ['kerja', 'karier', 'pekerjaan', 'rekrutmen'],
    answer: 'Cek SUKI Jobs 💼 untuk lowongan kerja di Sulawesi Tenggara! Perusahaan/UMKM juga bisa pasang loker gratis di sana. Buka menu SUKI Jobs.',
    followUp: ['Cara pasang lowongan?', 'Apakah melamar gratis?'],
  },
  {
    keys: ['komunitas', 'grup', 'gabung grup', 'community'],
    synonyms: ['group', 'komunitas lokal'],
    answer: 'Gabung komunitas di menu Komunitas 👥 — banyak grup sesuai minat dan daerahmu: hobi, bisnis, daerah, dan lainnya. Gratis!',
  },
  {
    keys: ['berita', 'news', 'portal berita', 'info terkini'],
    synonyms: ['artikel', 'kabar'],
    answer: 'Baca berita terkini Sultra di Portal Berita SUKI 📰 — info lokal, bisnis, dan komunitas. Buka menu Berita.',
  },
  {
    keys: ['kontak', 'hubungi', 'customer service', 'cs', 'bantuan langsung', 'whatsapp', 'nomor wa'],
    synonyms: ['help', 'bantuan', 'admin', 'call center'],
    answer: `Butuh bantuan langsung dari tim manusia? 📱\n\nHubungi kami via WhatsApp: https://wa.me/${WA_NUMBER}\n\nTim SUKI siap membantu jam kerja!`,
  },
  {
    keys: ['apakah aman', 'keamanan', 'penipuan', 'scam', 'terpercaya'],
    synonyms: ['aman', 'trusted', 'kepercayaan'],
    answer: 'Keamananmu prioritas kami 🛡️:\n• Jangan transfer sebelum ketemu/barang jelas\n• Manfaatkan fitur chat untuk rekam jejak\n• Laporkan akun mencurigakan via tombol Lapor\n• COD (ketemu langsung) paling aman untuk barang bekas',
    followUp: ['Cara lapor akun?', 'Tips belanja aman?'],
  },
  {
    keys: ['cara lapor', 'report', 'blokir pengguna'],
    synonyms: ['lapor', 'laporkan', 'report user'],
    answer: 'Laporkan konten/akun bermasalah 🚨:\n1. Buka listing/profil yang bermasalah\n2. Tekan tombol "Laporkan"\n3. Pilih alasan & kirim\n\nTim moderasi kami akan menindaklanjuti.',
  },
  {
    keys: ['edit iklan', 'ubah listing', 'hapus iklan', 'edit listing'],
    synonyms: ['edit', 'update iklan', 'delete listing'],
    answer: 'Kelola iklanmu 📝:\n1. Buka Profil → "Iklan Saya"\n2. Pilih listing → Edit atau Hapus\n3. Perubahan langsung tersimpan',
  },
  {
    keys: ['suki stats', 'statistik'],
    synonyms: ['stats', 'data'],
    answer: 'SUKI Stats 📊 menampilkan data dan insight menarik seputar aktivitas di platform SUKI Apps. Buka menu Ekosistem → SUKI Stats!',
  },
  {
    keys: ['ajak teman', 'referral', 'undang teman', 'kode referral'],
    synonyms: ['referal', 'invite', 'ajak'],
    answer: 'Ajak teman gabung SUKI! 🎁 Buka menu "Ajak Teman" untuk dapatkan link undanganmu dan bagikan ke WhatsApp/medsos.',
  },
  {
    keys: ['bahasa', 'ganti bahasa', 'language', 'english'],
    synonyms: ['basa', 'translate'],
    answer: 'SUKI Apps mendukung 27 bahasa! 🌍 Ganti via ikon bahasa di sidebar/menu — termasuk English, Arab, Jepang, dan lainnya.',
  },
  {
    keys: ['mode gelap', 'dark mode', 'tema gelap', 'mode terang', 'light mode'],
    synonyms: ['dark', 'light', 'tema'],
    answer: 'Ganti tema via tombol bulan/matahari ☀️🌙 di header atau sidebar. SUKI Apps mendukung mode terang dan mode gelap!',
  },
  {
    keys: ['aplikasi android', 'apk', 'download app', 'install app', 'aplikasi mobile'],
    synonyms: ['android', 'play store', 'aplikasi'],
    answer: 'SUKI Apps bisa di-install sebagai aplikasi! 📱\n• Buka sukiapps.web.id di Chrome Android\n• Menu → "Install app" / "Tambahkan ke layar utama"\n• Atau unduh APK langsung dari situs kami\n\nRingan, cepat, dan bisa dibuka fullscreen!',
  },
  {
    keys: ['kendari', 'sultra', 'sulawesi tenggara'],
    synonyms: ['daerah', 'lokasi', 'wilayah'],
    answer: 'SUKI Apps lahir di Kendari, Sulawesi Tenggara 🌴 — dibangun untuk melayani masyarakat Sultra dulu, lalu seluruh Indonesia. Bangga produk lokal!',
    followUp: ['Apa itu SUKI Apps?'],
  },
];

// Intent: sapaan
const GREETINGS = ['halo', 'hai', 'hello', 'hi', 'pagi', 'siang', 'sore', 'malam', 'assalamu', 'permisi', 'tes', 'test', 'p'];
// Intent: minta daftar / bantuan
const HELP_KEYS = ['list pertanyaan', 'daftar pertanyaan', 'apa yang bisa', 'bisa tanya apa', 'bantuan', 'help', 'menu', 'topik', 'panduan', 'cara pakai', 'gimana cara'];
// Intent: terima kasih
const THANKS_KEYS = ['terima kasih', 'makasih', 'thanks', 'thank you', 'mantap', 'oke', 'ok', 'sip', 'bagus', 'keren', 'hebat'];
// Intent: perpisahan
const BYE_KEYS = ['dadah', 'bye', 'sampai jumpa', 'selamat tinggal'];

export type SmartResult = { answer: string; followUp?: string[]; isMeta: boolean };

function normalize(s: string): string {
  return s.toLowerCase().replace(/[?!.,;:()"'`]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreEntry(q: string, entry: FaqEntry): number {
  let score = 0;
  const allKeys = [...entry.keys, ...(entry.synonyms || [])];
  for (const key of allKeys) {
    const nk = normalize(key);
    if (!nk) continue;
    if (q === nk) score += 100;                       // cocok persis
    else if (q.includes(nk)) score += nk.split(' ').length >= 2 ? 30 : 10; // frasa > kata tunggal
  }
  return score;
}

export function smartAnswer(rawQuestion: string): SmartResult {
  const q = normalize(rawQuestion);
  if (!q) return { answer: 'Silakan tulis pertanyaanmu dulu ya! 😊', isMeta: true };

  // 1. Intent: minta daftar pertanyaan
  if (HELP_KEYS.some((k) => q.includes(k))) {
    const topics = [
      '🛒 Jualan & belanja di Marketplace',
      '🏠 Cari properti di Sultra',
      '🎮 Main game JALA & Kampung',
      '👤 Daftar akun & login',
      '💼 Lowongan kerja (SUKI Jobs)',
      '🌐 Jasa bikin website (Web Studio)',
      '👥 Gabung komunitas',
      '📱 Install aplikasi Android',
      '🛡️ Keamanan & lapor akun',
    ];
    return {
      answer: `Tentu! Ini yang bisa kamu tanyakan ke JS SWAT:\n\n${topics.join('\n')}\n\nTinggal ketik salah satu topik, mis. "cara jualan" atau "cari properti"! 👇`,
      isMeta: true,
    };
  }

  // 2. Intent: sapaan (hanya jika pesan pendek)
  if (q.split(' ').length <= 3 && GREETINGS.some((g) => q.includes(g))) {
    return {
      answer: 'Halo juga! 👋 Senang bertemu denganmu. Ketik "list pertanyaan" untuk lihat semua yang bisa saya bantu!',
      followUp: ['List pertanyaan?'],
      isMeta: true,
    };
  }

  // 3. Intent: terima kasih / apresiasi
  if (THANKS_KEYS.some((k) => q.includes(k)) && q.split(' ').length <= 4) {
    return { answer: 'Sama-sama! 😊 Senang bisa membantu. Ada lagi yang bisa JS SWAT bantu?', isMeta: true };
  }

  // 4. Intent: perpisahan
  if (BYE_KEYS.some((k) => q.includes(k))) {
    return { answer: 'Dadah! 👋 Sampai jumpa lagi di SUKI Apps. Semoga harimu menyenangkan!', isMeta: true };
  }

  // 5. Pencocokan FAQ berbasis skor
  let best: FaqEntry | null = null;
  let bestScore = 0;
  for (const entry of FAQ) {
    const s = scoreEntry(q, entry);
    if (s > bestScore) { bestScore = s; best = entry; }
  }
  if (best && bestScore >= 10) {
    return { answer: best.answer, followUp: best.followUp, isMeta: false };
  }

  // 6. Fallback cerdas: sarankan topik terdekat
  return {
    answer: `Hmm, saya belum paham maksud "${rawQuestion.trim()}". 🤔\n\nCoba ketik kata kunci seperti: *jualan, properti, game, daftar, kerja, website* — atau ketik "list pertanyaan" untuk lihat semua topik!`,
    followUp: ['List pertanyaan?'],
    isMeta: true,
  };
}
