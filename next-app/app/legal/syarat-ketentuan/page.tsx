import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDoc, P, Ul, type LegalSection } from '@/components/legal/LegalDoc';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | SUKI Apps',
  description:
    'Syarat & Ketentuan penggunaan SUKI Apps (sukiapps.web.id): aturan akun, listing marketplace & properti, transaksi, kekayaan intelektual, tanggung jawab, dan penyelesaian sengketa.',
  alternates: { canonical: 'https://sukiapps.web.id/legal/syarat-ketentuan' },
  openGraph: {
    title: 'Syarat & Ketentuan | SUKI Apps',
    description:
      'Aturan penggunaan SUKI Apps: akun, listing, transaksi, dan tanggung jawab pengguna.',
    url: 'https://sukiapps.web.id/legal/syarat-ketentuan',
    type: 'website',
  },
};

// Berlaku sejak peluncuran dokumen legal T6 (2026-10-02).
const EFFECTIVE_DATE = '2 Oktober 2026';

const sections: LegalSection[] = [
  {
    id: 'definisi-layanan',
    title: 'Definisi & ruang lingkup layanan',
    body: (
      <>
        <P>
          <strong>SUKI Apps</strong> (sukiapps.web.id, dikelola dengan nama SULTRAKITA) adalah platform
          digital yang menghubungkan warga Sulawesi Tenggara melalui modul: <strong>Beranda</strong> (feed
          komunitas), <strong>Marketplace</strong> (jual-beli barang & jasa lokal), <strong>SUKI Suits</strong>{' '}
          (listing properti), <strong>Jobs</strong> (lowongan kerja), <strong>Komunitas</strong> (grup),
          dan fitur pendukung seperti chat, notifikasi, dan pencarian tersimpan.
        </P>
        <P>
          Dengan membuat akun atau menggunakan layanan apa pun di SUKI Apps, Anda menyatakan telah membaca,
          memahami, dan menyetujui Syarat &amp; Ketentuan ini beserta{' '}
          <Link href="/legal/kebijakan-privasi" className="font-semibold text-[var(--sk-teal)] hover:underline">
            Kebijakan Privasi
          </Link>{' '}
          kami. Jika tidak setuju, mohon tidak menggunakan layanan ini.
        </P>
      </>
    ),
  },
  {
    id: 'akun-kewajiban',
    title: 'Akun & kewajiban pengguna',
    body: (
      <>
        <Ul>
          <li>Anda wajib berusia minimal 13 tahun, atau menggunakan layanan dengan pendampingan orang tua/wali.</li>
          <li>Anda bertanggung jawab atas keamanan kredensial akun (kata sandi, sesi login, perangkat tepercaya). Segera amankan akun melalui <Link href="/security-center" className="font-semibold text-[var(--sk-teal)] hover:underline">Pusat Keamanan</Link> bila mencurigai akses tidak sah.</li>
          <li>Data profil yang Anda berikan (nama tampilan, username, foto, bio, wilayah) harus benar dan bukan milik orang lain.</li>
          <li>Satu orang hanya boleh memiliki satu akun utama; akun ganda untuk menipu, memanipulasi rating, atau menghindari moderasi dilarang.</li>
          <li>Kami dapat menangguhkan atau menutup akun yang melanggar ketentuan ini, menipu pengguna lain, atau membahayakan keamanan platform — dengan atau tanpa pemberitahuan terlebih dahulu bila situasinya mendesak.</li>
        </Ul>
      </>
    ),
  },
  {
    id: 'konten-listing-larangan',
    title: 'Konten, listing & larangan',
    body: (
      <>
        <P>
          Anda bertanggung jawab penuh atas konten yang Anda unggah: postingan feed, listing marketplace,
          listing properti, lowongan kerja, komentar, foto, dan pesan. Dengan mengunggah konten, Anda
          menyatakan memiliki hak atas konten tersebut dan konten tidak melanggar hukum yang berlaku.
        </P>
        <P><strong>Dilarang mengunggah atau memperjualbelikan:</strong></P>
        <Ul>
          <li>Barang/jasa ilegal: narkotika, senjata, barang curian, dokumen palsu, dan sejenisnya.</li>
          <li>Konten penipuan: harga palsu, deskripsi menyesatkan, foto bukan milik sendiri, testimoni fiktif.</li>
          <li>Konten SARA, ujaran kebencian, pornografi, kekerasan, atau pelecehan terhadap individu/kelompok.</li>
          <li>Spam, promosi berulang yang mengganggu, dan tautan phishing/malware.</li>
          <li>Data pribadi orang lain (nomor telepon, alamat, KTP) tanpa persetujuan pemiliknya.</li>
        </Ul>
        <P>
          Konten yang dilaporkan akan masuk antrean moderasi dan dapat diturunkan, disembunyikan, atau
          dihapus. Pelanggaran berat atau berulang berakibat pada penangguhan akun. Anda dapat melaporkan
          konten mencurigakan melalui tombol <strong>&ldquo;Laporkan&rdquo;</strong> yang tersedia di
          postingan feed, listing marketplace, dan halaman properti.
        </P>
      </>
    ),
  },
  {
    id: 'transaksi-pembayaran',
    title: 'Transaksi & pembayaran',
    body: (
      <>
        <P>
          <strong>Status pembayaran saat ini:</strong> sistem pembayaran SUKI Apps masih berjalan dalam
          mode <strong>sandbox (simulasi)</strong>. Artinya setiap alur &ldquo;checkout&rdquo;, langganan,
          atau pembelian fitur di aplikasi saat ini <strong>bukan transaksi uang nyata</strong> dan tidak
          memindahkan dana sungguhan.
        </P>
        <Ul>
          <li>Transaksi jual-beli antar pengguna (marketplace, properti, jasa) terjadi langsung antara pembeli dan penjual. SUKI Apps adalah perantara platform, bukan pihak dalam akad jual-beli.</li>
          <li>Selalu verifikasi identitas penjual, kondisi barang, dan legalitas dokumen (mis. sertifikat properti) sebelum membayar. Waspadai permintaan transfer di luar jalur yang disepakati.</li>
          <li>Fitur berbayar yang direncanakan (mis. boost listing, langganan toko, verifikasi seller) akan diumumkan terpisah beserta harga dan mekanisme refund <em>sebelum</em> pembayaran nyata diaktifkan.</li>
          <li>Selama mode sandbox, tidak ada pengembalian dana (refund) karena tidak ada dana nyata yang berpindah.</li>
        </Ul>
      </>
    ),
  },
  {
    id: 'kekayaan-intelektual',
    title: 'Kekayaan intelektual',
    body: (
      <>
        <P>
          Logo, nama &ldquo;SUKI&rdquo;, &ldquo;SUKI Apps&rdquo;, desain antarmuka, dan kode platform adalah
          milik pengelola SUKI Apps dan dilindungi hukum. Anda tidak boleh menyalin, memodifikasi,
          atau menggunakan merek tersebut untuk layanan lain tanpa izin tertulis.
        </P>
        <P>
          Konten yang Anda unggah tetap milik Anda. Dengan mengunggahnya, Anda memberi SUKI Apps lisensi
          non-eksklusif untuk menampilkan, menyimpan, dan mendistribusikan konten tersebut di dalam
          platform (mis. menampilkan listing di hasil pencarian atau feed).
        </P>
      </>
    ),
  },
  {
    id: 'pembatasan-tanggung-jawab',
    title: 'Pembatasan tanggung jawab',
    body: (
      <>
        <Ul>
          <li>Layanan disediakan &ldquo;sebagaimana adanya&rdquo;. Kami berupaya menjaga keandalan, namun tidak menjamin layanan bebas gangguan 100%.</li>
          <li>Kami tidak bertanggung jawab atas kerugian akibat transaksi antar pengguna, keterlambatan pengiriman, barang tidak sesuai, atau sengketa di luar platform.</li>
          <li>Kami tidak bertanggung jawab atas kerugian akibat kelalaian Anda menjaga keamanan akun.</li>
          <li>Dalam batas yang diizinkan hukum, total tanggung jawab kami terbatas pada nilai layanan yang Anda bayar kepada kami dalam 12 bulan terakhir (yang saat ini nihil selama mode sandbox).</li>
        </Ul>
      </>
    ),
  },
  {
    id: 'penyelesaian-sengketa',
    title: 'Penyelesaian sengketa',
    body: (
      <>
        <P>
          Sengketa antara Anda dan SUKI Apps diselesaikan terlebih dahulu secara musyawarah melalui kanal
          resmi kami (<Link href="/kontak" className="font-semibold text-[var(--sk-teal)] hover:underline">halaman kontak</Link> atau{' '}
          <Link href="/support" className="font-semibold text-[var(--sk-teal)] hover:underline">tiket dukungan</Link>).
          Bila musyawarah tidak mencapai kesepakatan dalam 30 hari kalender, sengketa diselesaikan sesuai
          hukum yang berlaku di Republik Indonesia.
        </P>
        <P>
          Untuk sengketa jual-beli antar pengguna, kami mendorong penyelesaian damai antara kedua pihak;
          tim moderasi dapat membantu memfasilitasi sepanjang datanya tersedia di platform.
        </P>
      </>
    ),
  },
  {
    id: 'perubahan-ketentuan',
    title: 'Perubahan ketentuan',
    body: (
      <>
        <P>
          Kami dapat memperbarui Syarat &amp; Ketentuan ini mengikuti perkembangan layanan dan peraturan
          perundang-undangan. Perubahan material akan diumumkan di aplikasi dan tanggal berlaku akan
          diperbarui di bagian atas dokumen ini. Penggunaan layanan yang berkelanjutan setelah perubahan
          berlaku dianggap sebagai persetujuan Anda.
        </P>
      </>
    ),
  },
];

export default function SyaratKetentuanPage() {
  return (
    <LegalDoc
      eyebrow="Dokumen Legal"
      title="Syarat & Ketentuan"
      description="Aturan main menggunakan SUKI Apps: hak dan kewajiban Anda sebagai pengguna, aturan konten dan listing, status transaksi, serta cara penyelesaian sengketa."
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
    />
  );
}
