import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDoc, P, Ul, type LegalSection } from '@/components/legal/LegalDoc';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | SUKI Apps',
  description:
    'Kebijakan Privasi SUKI Apps sesuai UU PDP No. 27/2022: data yang dikumpulkan, tujuan, dasar hukum, hak subjek data, retensi, keamanan, cookies, dan kontak permintaan data.',
  alternates: { canonical: 'https://sukiapps.web.id/legal/kebijakan-privasi' },
  openGraph: {
    title: 'Kebijakan Privasi | SUKI Apps',
    description:
      'Transparan soal data Anda: apa yang kami kumpulkan, untuk apa, dan hak Anda menurut UU PDP.',
    url: 'https://sukiapps.web.id/legal/kebijakan-privasi',
    type: 'website',
  },
};

// Berlaku sejak peluncuran dokumen legal T6 (2026-10-02).
const EFFECTIVE_DATE = '2 Oktober 2026';

// Isi di bawah ini disusun JUJUR dari praktik data aktual aplikasi
// (Supabase Auth/Database, Cloudflare R2, Resend, WhatsApp Cloud API,
// Google OAuth) — bukan klaim generik.
const sections: LegalSection[] = [
  {
    id: 'pengendali-data',
    title: 'Pengendali data pribadi',
    body: (
      <>
        <P>
          Pengendali Data Pribadi untuk layanan SUKI Apps (sukiapps.web.id) adalah{' '}
          <strong>SUKI Apps / SULTRAKITA</strong>. Untuk pertanyaan atau permintaan terkait data pribadi
          Anda, hubungi kami melalui{' '}
          <Link href="/kontak" className="font-semibold text-[var(--sk-teal)] hover:underline">
            halaman kontak
          </Link>{' '}
          atau email <a href="mailto:hello@sukiapps.web.id" className="font-semibold text-[var(--sk-teal)] hover:underline">hello@sukiapps.web.id</a>.
        </P>
        <P>
          Kebijakan ini disusun mengacu pada <strong>UU No. 27 Tahun 2022 tentang Pelindungan Data
          Pribadi (UU PDP)</strong> beserta peraturan pelaksananya.
        </P>
      </>
    ),
  },
  {
    id: 'data-dikumpulkan',
    title: 'Data yang kami kumpulkan',
    body: (
      <>
        <P><strong>1. Data akun (Anda berikan saat mendaftar/masuk):</strong></P>
        <Ul>
          <li>Nama tampilan, username, foto profil, bio, dan wilayah (kabupaten/kota) — tersimpan di profil Supabase.</li>
          <li>Alamat email — untuk autentikasi (Supabase Auth, termasuk login dengan Google).</li>
          <li>Kontak privat (mis. email/nomor telepon tambahan) yang Anda cantumkan untuk keperluan transaksi — hanya terlihat oleh Anda dan pihak yang berwenang.</li>
        </Ul>
        <P><strong>2. Data konten & aktivitas (Anda buat saat memakai layanan):</strong></P>
        <Ul>
          <li>Listing marketplace & properti: judul, harga, deskripsi, foto, lokasi (kecamatan/kabupaten), dan status.</li>
          <li>Postingan feed, komentar, suka, simpanan, ikuti (follow), lowongan kerja, dan data komunitas/grup.</li>
          <li>Tiket dukungan, pencarian tersimpan, wishlist, dan laporan konten yang Anda kirim.</li>
        </Ul>
        <P><strong>3. Data teknis (terkumpul otomatis):</strong></P>
        <Ul>
          <li>Log keamanan: riwayat login, perangkat tepercaya, dan audit trail tindakan sensitif.</li>
          <li>Analitik penggunaan agregat (mis. halaman dikunjungi, fitur dipakai) untuk meningkatkan layanan.</li>
          <li>Preferensi tampilan (tema gelap/terang, bahasa) yang tersimpan di perangkat Anda.</li>
        </Ul>
        <P>
          Kami <strong>tidak</strong> mengumpulkan data biometrik, dan kami tidak meminta data kartu
          kredit/debit karena pembayaran nyata belum diaktifkan (mode sandbox).
        </P>
      </>
    ),
  },
  {
    id: 'tujuan-dasar-hukum',
    title: 'Tujuan & dasar hukum pemrosesan',
    body: (
      <>
        <P>Kami memproses Data Pribadi Anda untuk tujuan berikut, dengan dasar hukum yang sesuai UU PDP:</P>
        <Ul>
          <li><strong>Menyediakan & mengoperasikan layanan</strong> (menampilkan profil, listing, feed, notifikasi) — dasar: pelaksanaan kontrak/perjanjian penggunaan layanan.</li>
          <li><strong>Keamanan & pencegahan penipuan</strong> (verifikasi sesi, moderasi konten, audit trail) — dasar: kepentingan yang sah & kewajiban hukum.</li>
          <li><strong>Komunikasi layanan</strong> (OTP, notifikasi email/WhatsApp tentang akun & transaksi Anda) — dasar: pelaksanaan kontrak & persetujuan Anda.</li>
          <li><strong>Peningkatan produk</strong> (analitik agregat, perbaikan bug) — dasar: kepentingan yang sah, dengan data yang dimininimalkan.</li>
          <li><strong>Kepatuhan hukum</strong> (menanggapi permintaan aparat penegak hukum yang sah) — dasar: kewajiban hukum.</li>
        </Ul>
        <P>
          Kami tidak menggunakan Data Pribadi Anda untuk tujuan yang tidak tercantum di sini tanpa
          persetujuan Anda terlebih dahulu, dan kami <strong>tidak menjual</strong> Data Pribadi Anda
          kepada pihak mana pun.
        </P>
      </>
    ),
  },
  {
    id: 'hak-subjek-data',
    title: 'Hak Anda sebagai subjek data',
    body: (
      <>
        <P>Sesuai UU PDP, Anda memiliki hak-hak berikut dan dapat mengajukannya kapan saja:</P>
        <Ul>
          <li><strong>Hak akses</strong> — mengetahui data apa saja yang kami simpan tentang Anda.</li>
          <li><strong>Hak koreksi/pembaruan</strong> — memperbaiki data yang tidak akurat (sebagian dapat Anda ubah sendiri di Pengaturan & Profil).</li>
          <li><strong>Hak penghapusan</strong> — meminta penghapusan Data Pribadi Anda, sepanjang tidak ada kewajiban hukum untuk menyimpannya.</li>
          <li><strong>Hak portabilitas</strong> — meminta salinan data Anda dalam format yang umum digunakan.</li>
          <li><strong>Hak menarik persetujuan</strong> — menarik kembali persetujuan pemrosesan berbasis persetujuan (mis. notifikasi promosi) kapan saja.</li>
          <li><strong>Hak keberatan & pembatasan</strong> — mengajukan keberatan atas pemrosesan tertentu atau meminta pembatasan sementara.</li>
          <li><strong>Hak atas keputusan non-otomatis</strong> — menolak keputusan yang sepenuhnya otomatis dan berdampak hukum/signifikan terhadap Anda.</li>
        </Ul>
        <P>
          Ajukan permintaan melalui <Link href="/kontak" className="font-semibold text-[var(--sk-teal)] hover:underline">halaman kontak</Link> atau{' '}
          <Link href="/support" className="font-semibold text-[var(--sk-teal)] hover:underline">tiket dukungan</Link> dengan
          subjek &ldquo;Permintaan Data Pribadi&rdquo;. Kami akan memverifikasi identitas Anda terlebih
          dahulu, lalu menindaklanjuti maksimal <strong>3×24 jam</strong> untuk permintaan akses/koreksi
          sederhana, dan maksimal <strong>30 hari kalender</strong> untuk permintaan kompleks seperti
          penghapusan/portabilitas.
        </P>
      </>
    ),
  },
  {
    id: 'retensi',
    title: 'Retensi (penyimpanan) data',
    body: (
      <>
        <Ul>
          <li>Data akun & profil disimpan selama akun Anda aktif.</li>
          <li>Konten publik (listing, postingan) disimpan selama Anda tidak menghapusnya; setelah dihapus, data dihapus dari database produksi dan dari cadangan (backup) mengikuti siklus rotasi backup.</li>
          <li>Log keamanan & audit trail disimpan maksimal <strong>2 tahun</strong> untuk kepentingan investigasi, lalu dihapus atau dianonimkan.</li>
          <li>Data analitik agregat disimpan tanpa identitas pribadi.</li>
          <li>Bila akun dihapus, Data Pribadi Anda dihapus kecuali wajib disimpan menurut peraturan perundang-undangan (mis. catatan transaksi untuk keperluan pajak/audit).</li>
        </Ul>
      </>
    ),
  },
  {
    id: 'keamanan',
    title: 'Keamanan data',
    body: (
      <>
        <P>Kami menerapkan langkah teknis dan organisasional yang wajar untuk melindungi Data Pribadi Anda:</P>
        <Ul>
          <li>Enkripsi saat transit (HTTPS/TLS) untuk seluruh komunikasi aplikasi.</li>
          <li>Kontrol akses berlapis di database (Row Level Security Supabase): data privat hanya dapat dibaca pemiliknya atau peran yang berwenang.</li>
          <li>Rate limiting & proteksi CSRF pada endpoint sensitif.</li>
          <li>Audit trail untuk tindakan moderasi dan administratif.</li>
          <li>Kredensial layanan (kunci API, secret) disimpan di sisi server dan tidak pernah dikirim ke browser.</li>
        </Ul>
        <P>
          Tidak ada sistem yang 100% kebal. Bila terjadi insiden kebocoran data yang berdampak pada Anda,
          kami akan memberitahukan Anda dan melaporkannya sesuai ketentuan UU PDP.
        </P>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies & teknologi serupa',
    body: (
      <>
        <Ul>
          <li><strong>Cookies esensial:</strong> sesi login Supabase dan token keamanan (wajib agar aplikasi berfungsi).</li>
          <li><strong>Penyimpanan lokal perangkat:</strong> preferensi tema (gelap/terang) dan bahasa — tersimpan di browser Anda, bukan di server kami.</li>
          <li>Kami tidak menggunakan cookies pelacakan iklan pihak ketiga.</li>
        </Ul>
        <P>
          Anda dapat menghapus cookies/penyimpanan lokal melalui pengaturan browser; sebagian fitur
          (mis. tetap login) mungkin tidak berfungsi setelahnya.
        </P>
      </>
    ),
  },
  {
    id: 'transfer-pihak-ketiga',
    title: 'Penyimpanan & pihak ketiga',
    body: (
      <>
        <P>
          Data Anda disimpan pada infrastruktur cloud yang kami gunakan untuk mengoperasikan layanan:
        </P>
        <Ul>
          <li><strong>Supabase</strong> — autentikasi, database, dan penyimpanan file utama.</li>
          <li><strong>Cloudflare R2</strong> — penyimpanan objek untuk foto listing, avatar, dan lampiran.</li>
          <li><strong>Resend</strong> — pengiriman email notifikasi & OTP (hanya alamat email dan isi notifikasi yang diteruskan).</li>
          <li><strong>Meta WhatsApp Cloud API</strong> (melalui orkestrasi n8n) — pengiriman OTP/notifikasi WhatsApp kepada nomor yang Anda daftarkan.</li>
          <li><strong>Google</strong> — bila Anda memilih &ldquo;Masuk dengan Google&rdquo;; Google membagikan data profil dasar sesuai persetujuan Anda di layar consent Google.</li>
          <li><strong>Google Gemini</strong> — dipakai untuk fitur bantuan AI internal (mis. umpan balik kualitas listing); tidak untuk profil iklan.</li>
        </Ul>
        <P>
          Penyedia di atas bertindak sebagai prosesor/pihak yang memproses data atas instruksi kami dan
          terikat kewajiban kontraktual menjaga kerahasiaan. Sebagian infrastruktur cloud dapat berada di
          luar Indonesia; dengan menggunakan layanan ini Anda menyetujui transfer tersebut sebagaimana
          diatur UU PDP.
        </P>
      </>
    ),
  },
  {
    id: 'anak',
    title: 'Data anak',
    body: (
      <>
        <P>
          Layanan ini tidak ditujukan untuk anak di bawah 13 tahun. Bila Anda orang tua/wali dan mengetahui
          anak Anda memberikan Data Pribadi tanpa persetujuan, hubungi kami agar data tersebut dihapus.
        </P>
      </>
    ),
  },
  {
    id: 'perubahan',
    title: 'Perubahan kebijakan',
    body: (
      <>
        <P>
          Kebijakan ini dapat diperbarui mengikuti perubahan layanan dan peraturan. Perubahan material
          akan diumumkan di aplikasi dan tanggal berlaku di bagian atas dokumen ini akan diperbarui.
          Penggunaan layanan yang berkelanjutan setelah perubahan berlaku dianggap sebagai persetujuan Anda.
        </P>
      </>
    ),
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <LegalDoc
      eyebrow="Dokumen Legal · UU PDP No. 27/2022"
      title="Kebijakan Privasi"
      description="Dokumen ini menjelaskan secara transparan data apa yang kami kumpulkan, untuk apa data itu dipakai, siapa saja pihak yang terlibat, dan hak-hak Anda menurut UU Pelindungan Data Pribadi."
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
    />
  );
}
