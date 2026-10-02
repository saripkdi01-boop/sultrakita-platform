'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

// Semua jawaban di bawah ini merujuk pada fitur yang BENAR-BENAR ada di
// aplikasi (hasil audit kode 2026-10-02). Tidak ada klaim fiktif.
const GROUPS: FaqGroup[] = [
  {
    id: 'akun',
    title: 'Akun & pendaftaran',
    items: [
      {
        q: 'Bagaimana cara mendaftar akun SUKI Apps?',
        a: (
          <>
            Buka halaman <Link href="/signup" className="font-semibold text-[var(--sk-teal)] hover:underline">Pendaftaran</Link> lalu
            pilih salah satu cara: (1) <strong>daftar dengan email</strong> — isi nama, email, dan kata sandi, lalu
            klik tautan verifikasi yang dikirim ke email Anda; atau (2) <strong>lanjutkan dengan Google</strong> —
            masuk instan memakai akun Google Anda. Pendaftaran gratis dan hanya butuh waktu kurang dari semenit.
          </>
        ),
      },
      {
        q: 'Apakah bisa masuk dengan Facebook?',
        a: (
          <>
            Tombol &ldquo;Lanjutkan dengan Facebook&rdquo; memang tampil di halaman login, tetapi <strong>login
            Facebook belum aktif</strong> — penyedia Facebook belum dihubungkan di sisi server kami. Silakan
            gunakan email atau Google untuk saat ini. Kami akan mengumumkannya bila sudah tersedia.
          </>
        ),
      },
      {
        q: 'Saya lupa kata sandi. Bagaimana cara reset?',
        a: (
          <>
            Di halaman <Link href="/login" className="font-semibold text-[var(--sk-teal)] hover:underline">login</Link>, pilih
            opsi lupa kata sandi, masukkan email terdaftar, dan ikuti tautan reset yang dikirim ke email Anda.
            Tautan hanya berlaku terbatas — segera gunakan setelah diterima.
          </>
        ),
      },
      {
        q: 'Bagaimana cara mengamankan akun saya?',
        a: (
          <>
            Buka <Link href="/security-center" className="font-semibold text-[var(--sk-teal)] hover:underline">Pusat Keamanan</Link> untuk
            melihat perangkat yang pernah login dan menghapus perangkat yang tidak dikenal. Jangan pernah
            membagikan OTP, kata sandi, atau tautan verifikasi kepada siapa pun — tim SUKI tidak akan pernah memintanya.
          </>
        ),
      },
    ],
  },
  {
    id: 'jual',
    title: 'Cara berjualan',
    items: [
      {
        q: 'Bagaimana cara memasang listing di Marketplace?',
        a: (
          <>
            Masuk ke akun Anda, buka <Link href="/marketplace" className="font-semibold text-[var(--sk-teal)] hover:underline">Marketplace</Link> lalu
            pilih <strong>Buat listing</strong> (atau langsung ke <Link href="/marketplace/create" className="font-semibold text-[var(--sk-teal)] hover:underline">/marketplace/create</Link>).
            Isi judul, kategori, harga, kondisi barang, deskripsi jujur, dan unggah foto asli barang
            (bisa lebih dari satu). Listing tampil setelah tersimpan — pastikan data benar karena pembeli
            menilai dari kelengkapan info Anda.
          </>
        ),
      },
      {
        q: 'Bagaimana cara memasang listing properti?',
        a: (
          <>
            Buka <Link href="/properti" className="font-semibold text-[var(--sk-teal)] hover:underline">SUKI Suits</Link> lalu
            pilih buat listing properti (<Link href="/properti/create" className="font-semibold text-[var(--sk-teal)] hover:underline">/properti/create</Link>).
            Lengkapi alamat/kecamatan (dipakai untuk tampil di peta), harga, luas, jumlah kamar, status
            sertifikat, dan foto. Listing dengan sertifikat terverifikasi mendapat badge khusus.
          </>
        ),
      },
      {
        q: 'Apakah ada biaya untuk pasang listing?',
        a: (
          <>
            <strong>Memasang listing dasar gratis.</strong> Fitur promosi berbayar (seperti boost listing
            atau langganan toko) masih dalam tahap persiapan — sistem pembayaran kami saat ini berjalan
            dalam mode <strong>sandbox (simulasi)</strong>, sehingga belum ada pembayaran uang nyata di
            aplikasi. Setiap fitur berbayar akan diumumkan beserta harga resminya sebelum diaktifkan.
          </>
        ),
      },
      {
        q: 'Bagaimana cara mendapat badge Toko Terverifikasi?',
        a: (
          <>
            Badge kepercayaan (mis. Toko Official/Terverifikasi) diberikan berdasarkan data dan proses
            verifikasi oleh tim SUKI. Pastikan profil toko lengkap, identitas jelas, dan riwayat transaksi
            bersih. Pengajuan verifikasi berbayar masih dalam tahap persiapan dan akan diumumkan terpisah.
          </>
        ),
      },
    ],
  },
  {
    id: 'beli-aman',
    title: 'Cara beli dengan aman',
    items: [
      {
        q: 'Bagaimana cara belanja yang aman di SUKI Apps?',
        a: (
          <>
            <ul className="list-disc space-y-2 pl-5">
              <li>Periksa <strong>badge seller</strong> (Terverifikasi/Official), rating, dan ulasan sebelum membeli.</li>
              <li>Baca deskripsi & foto dengan teliti; tanyakan kondisi barang lewat chat bila ragu.</li>
              <li>Waspadai harga yang tidak masuk akal dan penjual yang mendesak transfer cepat.</li>
              <li>Jangan pernah mengirim OTP atau kata sandi kepada siapa pun.</li>
            </ul>
          </>
        ),
      },
      {
        q: 'Apakah SUKI Apps menampung dana / menyediakan escrow?',
        a: (
          <>
            <strong>Belum.</strong> Saat ini transaksi jual-beli terjadi langsung antara pembeli dan penjual —
            SUKI Apps adalah platform perantara, bukan pihak dalam akad. Layanan penampungan dana (escrow)
            masih dalam rencana dan hanya akan diluncurkan setelah sistem pembayaran nyata, dispute, dan
            refund siap dan diuji.
          </>
        ),
      },
      {
        q: 'Saya menemukan listing mencurigakan. Apa yang harus dilakukan?',
        a: (
          <>
            Gunakan tombol <strong>&ldquo;Laporkan&rdquo;</strong> yang tersedia di postingan feed, pratinjau
            listing marketplace, dan halaman detail properti. Pilih alasan laporan — laporan Anda masuk ke
            antrean moderasi dan ditinjau tim kami. Untuk kasus penipuan, segera buat tiket di{' '}
            <Link href="/support" className="font-semibold text-[var(--sk-teal)] hover:underline">Laporkan Masalah</Link>.
          </>
        ),
      },
    ],
  },
  {
    id: 'properti',
    title: 'Properti (SUKI Suits)',
    items: [
      {
        q: 'Bagaimana cara mencari properti di peta?',
        a: (
          <>
            Buka <Link href="/properti" className="font-semibold text-[var(--sk-teal)] hover:underline">halaman Properti</Link> —
            tampilannya ala peta: daftar listing di satu sisi dan peta interaktif di sisi lain (di HP, geser
            tab Daftar/Peta). Pin harga menunjukkan lokasi tiap listing; gunakan filter harga, tipe, dan
            sertifikat untuk mempersempit hasil.
          </>
        ),
      },
      {
        q: 'Bagaimana cara menghubungi pemilik properti?',
        a: (
          <>
            Di halaman detail properti, gunakan <strong>formulir inquiry</strong> untuk mengirim pertanyaan
            langsung ke pemilik/agen. Cantumkan kebutuhan Anda dengan jelas agar direspons cepat.
          </>
        ),
      },
    ],
  },
  {
    id: 'privasi',
    title: 'Privasi & data',
    items: [
      {
        q: 'Data apa saja yang disimpan SUKI Apps tentang saya?',
        a: (
          <>
            Data profil (nama, username, foto, bio, wilayah), email akun, konten yang Anda buat (listing,
            postingan, komentar), serta log keamanan dan analitik penggunaan. Detail lengkap ada di{' '}
            <Link href="/legal/kebijakan-privasi" className="font-semibold text-[var(--sk-teal)] hover:underline">Kebijakan Privasi</Link> kami
            yang disusun sesuai UU PDP No. 27/2022.
          </>
        ),
      },
      {
        q: 'Bisakah saya menghapus akun dan data saya?',
        a: (
          <>
            Ya. Anda berhak meminta penghapusan Data Pribadi sesuai UU PDP. Kelola data profil di{' '}
            <Link href="/settings" className="font-semibold text-[var(--sk-teal)] hover:underline">Pengaturan</Link> dan{' '}
            <Link href="/security-center" className="font-semibold text-[var(--sk-teal)] hover:underline">Pusat Keamanan</Link>,
            atau ajukan permintaan penghapusan melalui{' '}
            <Link href="/kontak" className="font-semibold text-[var(--sk-teal)] hover:underline">halaman kontak</Link> dengan
            subjek &ldquo;Permintaan Data Pribadi&rdquo;. Kami menindaklanjuti maksimal 30 hari kalender.
          </>
        ),
      },
      {
        q: 'Di mana saya bisa membaca Syarat & Ketentuan lengkap?',
        a: (
          <>
            Di <Link href="/legal/syarat-ketentuan" className="font-semibold text-[var(--sk-teal)] hover:underline">Syarat & Ketentuan</Link> dan{' '}
            <Link href="/legal/kebijakan-privasi" className="font-semibold text-[var(--sk-teal)] hover:underline">Kebijakan Privasi</Link> —
            keduanya berlaku sejak 2 Oktober 2026 dan tersedia dalam Bahasa Indonesia.
          </>
        ),
      },
    ],
  },
];

function FaqAccordion({ group }: { group: FaqGroup }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section aria-labelledby={`${group.id}-heading`} className="mt-8">
      <h2 id={`${group.id}-heading`} className="text-lg font-extrabold tracking-tight">
        {group.title}
      </h2>
      <div className="mt-4 space-y-3">
        {group.items.map((item) => {
          const key = `${group.id}-${item.q}`;
          const isOpen = open === key;
          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: 'var(--sk-line)', background: 'var(--sk-surface)' }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : key)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-sm font-bold sm:text-base">{item.q}</span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 transition-transform"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none', color: 'var(--sk-teal)' }}
                />
              </button>
              {isOpen && (
                <div
                  className="border-t px-5 py-4 text-sm leading-7"
                  style={{ borderColor: 'var(--sk-line)', color: 'var(--sk-ink-2)' }}
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function FaqClient() {
  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-3xl" style={{ background: 'var(--sk-bg)', color: 'var(--sk-ink)' }}>
        <Link href="/help-center" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--sk-teal)' }}>
          <ArrowLeft size={16} /> Pusat Bantuan
        </Link>
        <header className="rounded-3xl p-7 sm:p-10" style={{ background: 'var(--sk-teal)', color: '#fff' }}>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase" style={{ letterSpacing: '.18em', color: 'var(--sk-brand)' }}>
            <HelpCircle size={14} /> Bantuan
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Pertanyaan Umum (FAQ)</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'rgba(255,255,255,.85)' }}>
            Jawaban atas pertanyaan yang paling sering ditanyakan tentang akun, jual-beli, properti,
            keamanan, dan privasi di SUKI Apps.
          </p>
        </header>

        {GROUPS.map((group) => (
          <FaqAccordion key={group.id} group={group} />
        ))}

        <footer className="mb-10 mt-8 rounded-2xl border p-5 text-sm" style={{ borderColor: 'var(--sk-line)', background: 'var(--sk-surface-2)' }}>
          <p className="font-bold">Tidak menemukan jawaban?</p>
          <p className="mt-1" style={{ color: 'var(--sk-muted)' }}>
            Kunjungi <Link href="/help-center" className="font-semibold hover:underline" style={{ color: 'var(--sk-teal)' }}>Pusat Bantuan</Link>,{' '}
            buat tiket di <Link href="/support" className="font-semibold hover:underline" style={{ color: 'var(--sk-teal)' }}>Laporkan Masalah</Link>, atau{' '}
            <Link href="/kontak" className="font-semibold hover:underline" style={{ color: 'var(--sk-teal)' }}>hubungi kami</Link>.
          </p>
        </footer>
      </main>
    </AppLayout>
  );
}
