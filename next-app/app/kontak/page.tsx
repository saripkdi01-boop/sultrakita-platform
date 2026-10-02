import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Inbox, Mail, MessageCircleQuestion, ShieldCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'Kontak | SUKI Apps',
  description:
    'Hubungi tim SUKI Apps: email resmi, tiket dukungan dalam aplikasi, dan pusat bantuan. Kanal kontak resmi sukiapps.web.id.',
  alternates: { canonical: 'https://sukiapps.web.id/kontak' },
  openGraph: {
    title: 'Kontak | SUKI Apps',
    description: 'Kanal resmi menghubungi tim SUKI Apps.',
    url: 'https://sukiapps.web.id/kontak',
    type: 'website',
  },
};

// Hanya kanal yang BENAR-BENAR terverifikasi ada di repo/dokumen:
// - hello@sukiapps.web.id (mailto di app/Business/page.tsx)
// - /support (tiket dukungan dalam aplikasi)
// - /help-center, /bantuan/faq, /security-center
// TIDAK mencantumkan alamat kantor / nomor telepon / WhatsApp karena tidak
// ada yang terverifikasi (env WhatsApp kosong; nomor di dokumen lama adalah
// data palsu yang sudah dihapus).
const CHANNELS = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@sukiapps.web.id',
    href: 'mailto:hello@sukiapps.web.id',
    desc: 'Untuk pertanyaan umum, kemitraan, dan permintaan data pribadi (subjek: "Permintaan Data Pribadi").',
  },
  {
    icon: Inbox,
    title: 'Tiket dukungan (dalam aplikasi)',
    value: 'Laporkan Masalah',
    href: '/support',
    desc: 'Laporkan bug, kendala akun, atau dugaan penipuan. Anda mendapat nomor tiket dan bisa melacak statusnya.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Pusat Bantuan & FAQ',
    value: 'Pusat Bantuan',
    href: '/help-center',
    desc: 'Cari panduan dan jawaban mandiri sebelum menghubungi tim.',
  },
  {
    icon: ShieldCheck,
    title: 'Pusat Keamanan',
    value: 'Keamanan akun',
    href: '/security-center',
    desc: 'Kelola perangkat login dan dapatkan tips perlindungan dari penipuan.',
  },
] as const;

export default function KontakPage() {
  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-3xl" style={{ background: 'var(--sk-bg)', color: 'var(--sk-ink)' }}>
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--sk-teal)' }}>
          <ArrowLeft size={16} /> Kembali ke beranda
        </Link>

        <header className="rounded-3xl p-7 sm:p-10" style={{ background: 'var(--sk-teal)', color: '#fff' }}>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase" style={{ letterSpacing: '.18em', color: 'var(--sk-brand)' }}>
            <Mail size={14} /> Kontak
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Hubungi tim SUKI</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'rgba(255,255,255,.85)' }}>
            Pilih kanal resmi di bawah ini. Kami membaca setiap pesan yang masuk.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold" style={{ color: 'rgba(255,255,255,.75)' }}>
            <Clock size={14} /> Respons tiket dukungan: umumnya 24–48 jam pada hari kerja.
          </p>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {CHANNELS.map((channel) => (
            <Link
              key={channel.title}
              href={channel.href}
              className="group rounded-2xl border p-6 transition-transform hover:-translate-y-0.5"
              style={{ borderColor: 'var(--sk-line)', background: 'var(--sk-surface)' }}
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ background: 'var(--sk-teal-soft)', color: 'var(--sk-teal)' }}
              >
                <channel.icon size={20} aria-hidden="true" />
              </span>
              <span className="mt-4 block text-xs font-extrabold uppercase" style={{ letterSpacing: '.12em', color: 'var(--sk-muted)' }}>
                {channel.title}
              </span>
              <span className="mt-1 block font-extrabold group-hover:underline" style={{ color: 'var(--sk-teal)' }}>
                {channel.value}
              </span>
              <span className="mt-2 block text-sm leading-6" style={{ color: 'var(--sk-ink-2)' }}>
                {channel.desc}
              </span>
            </Link>
          ))}
        </div>

        <section
          className="mb-10 mt-6 rounded-2xl border p-6 text-sm leading-7"
          style={{ borderColor: 'var(--sk-line)', background: 'var(--sk-surface-2)' }}
        >
          <p className="font-bold">Catatan transparansi</p>
          <p className="mt-2" style={{ color: 'var(--sk-muted)' }}>
            Saat ini kami belum mempublikasikan alamat kantor fisik atau nomor telepon/WhatsApp resmi.
            Waspadai pihak yang mengatasnamakan SUKI Apps melalui nomor tidak dikenal — kanal resmi kami
            hanya yang tercantum di halaman ini. Jangan pernah membagikan OTP, kata sandi, atau kode
            verifikasi kepada siapa pun.
          </p>
        </section>
      </main>
    </AppLayout>
  );
}
