import Link from 'next/link';
import { Globe, ShieldCheck, Users } from 'lucide-react';
import WcReveal from '@/components/ui/WcReveal';
import {
  SukiIconBisnis,
  SukiIconJobs,
  SukiIconKampung,
  SukiIconKomunitas,
  SukiIconMarketplace,
  SukiIconProperti,
} from '@/components/layout/SukiIcons';
import ImageSlot from './ImageSlot';

/* ------------------------------------------------------------------ */
/* Value strip — 3 proposisi jujur, tanpa angka karangan.              */
/* ------------------------------------------------------------------ */
const VALUES = [
  {
    Icon: Globe,
    title: 'Akar lokal, jangkauan luas',
    desc: 'Dibangun dari Kendari — memahami kebutuhan nyata warga Sulawesi Tenggara.',
  },
  {
    Icon: ShieldCheck,
    title: 'Aman & terpercaya',
    desc: 'Akun dan data Anda dilindungi dengan standar keamanan modern.',
  },
  {
    Icon: Users,
    title: 'Untuk semua orang Sultra',
    desc: 'Dari pelaku UMKM hingga pencari kerja — SUKI menghubungkan semua.',
  },
];

export function KendariValue() {
  return (
    <section className="kh-section kh-value" aria-label="Nilai SUKI Apps">
      <div className="kh-wrap">
        <div className="kh-value-grid">
          {VALUES.map((v, i) => (
            <WcReveal key={v.title} delay={(i % 3) as 0 | 1 | 2}>
              <div className="kh-value-card">
                <div className="kh-value-icon">
                  <v.Icon size={26} aria-hidden="true" />
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            </WcReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ekosistem — 6 modul dengan ikon SVG khas SUKI, link ke rute nyata.  */
/* ------------------------------------------------------------------ */
const MODULES = [
  {
    Icon: SukiIconMarketplace,
    title: 'Marketplace',
    desc: 'Belanja produk lokal Sultra — dari kerajinan tangan hingga hasil bumi.',
    href: '/marketplace',
  },
  {
    Icon: SukiIconProperti,
    title: 'Properti',
    desc: 'Rumah, tanah, dan ruang usaha di Kendari dan sekitarnya.',
    href: '/properti',
  },
  {
    Icon: SukiIconJobs,
    title: 'Jobs',
    desc: 'Lowongan dan peluang karier dari perusahaan dan UMKM lokal.',
    href: '/jobs',
  },
  {
    Icon: SukiIconKomunitas,
    title: 'Komunitas',
    desc: 'Ruang warga: cerita, diskusi, dan jejaring yang tumbuh dari sekitar.',
    href: '/groups',
  },
  {
    Icon: SukiIconKampung,
    title: 'Kampung',
    desc: 'Layanan digital untuk kampung dan kelurahan yang lebih modern.',
    href: '/kampung',
  },
  {
    Icon: SukiIconBisnis,
    title: 'Bisnis',
    desc: 'Daftarkan usaha Anda agar dikenal lebih luas di Sultra.',
    href: '/Business',
  },
];

export function KendariEcosystem() {
  return (
    <section className="kh-section kh-eco" id="ekosistem" aria-labelledby="kh-eco-title">
      <div className="kh-wrap">
        <WcReveal>
          <div className="kh-label">Ekosistem Digital</div>
        </WcReveal>
        <WcReveal delay={1}>
          <h2 className="kh-h2" id="kh-eco-title">
            Semua yang Sultra butuhkan,
            <br />
            dalam <span className="kh-gold">satu genggaman.</span>
          </h2>
        </WcReveal>
        <WcReveal delay={2}>
          <p className="kh-desc">
            Enam ruang terintegrasi yang saling terhubung — memudahkan Anda
            bertransaksi, mencari, dan berkembang.
          </p>
        </WcReveal>
        <div className="kh-eco-grid">
          {MODULES.map((m, i) => (
            <WcReveal key={m.title} delay={(i % 3) as 0 | 1 | 2}>
              <Link
                href={m.href}
                className="kh-eco-card"
                aria-label={`${m.title} — ${m.desc}`}
              >
                <span className="kh-eco-icon">
                  <m.Icon aria-hidden="true" />
                </span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <span className="kh-eco-arrow" aria-hidden="true">→</span>
              </Link>
            </WcReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bahteramas — metafora "menghubungkan" dipetakan ke fitur nyata.      */
/* ------------------------------------------------------------------ */
const BAHTERA_LINKS = [
  {
    title: 'UMKM & pembeli',
    desc: 'Produk lokal bertemu pembeli di seluruh Sulawesi Tenggara.',
    href: '/marketplace',
  },
  {
    title: 'Talenta & perusahaan',
    desc: 'Peluang kerja bertemu orang yang tepat.',
    href: '/jobs',
  },
  {
    title: 'Ruang & penghuni',
    desc: 'Properti bertemu pemilik dan penghuni barunya.',
    href: '/properti',
  },
];

export function KendariBahteramas() {
  return (
    <section className="kh-baht" id="menghubungkan" aria-labelledby="kh-baht-title">
      <div className="kh-baht-bg" aria-hidden="true">
        <ImageSlot
          src="/images/jembatan-bahteramas.jpg"
          alt=""
          imgAltHidden
          fallbackClass="kh-fb-bahteramas"
        />
      </div>
      <div className="kh-baht-veil" aria-hidden="true" />
      <div className="kh-wrap">
        <div className="kh-baht-grid">
          <div>
            <WcReveal>
              <div className="kh-label">Menghubungkan</div>
            </WcReveal>
            <WcReveal delay={1}>
              <h2 className="kh-h2" id="kh-baht-title">
                Seperti Jembatan Bahteramas,
                <br />
                <span className="kh-gold">SUKI menghubungkan Sultra.</span>
              </h2>
            </WcReveal>
            <WcReveal delay={2}>
              <p className="kh-desc">
                Membentang di atas Teluk Kendari, jembatan ini menyatukan dua
                sisi kota. Begitu pula SUKI — mempertemukan orang, usaha, dan
                peluang di seluruh Sulawesi Tenggara.
              </p>
            </WcReveal>
            <div className="kh-baht-feats">
              {BAHTERA_LINKS.map((f, i) => (
                <WcReveal key={f.title} delay={(i % 3) as 0 | 1 | 2}>
                  <Link href={f.href} className="kh-baht-feat">
                    <span>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </span>
                  </Link>
                </WcReveal>
              ))}
            </div>
          </div>
          <WcReveal delay={1}>
            <div className="kh-baht-visual">
              <ImageSlot
                src="/images/jembatan-bahteramas-2.jpg"
                alt="Jembatan Bahteramas"
                fallbackClass="kh-fb-bahteramas"
              />
            </div>
          </WcReveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Komunitas — foto warga + aksen Tugu MTQ (slot, fallback bila kosong).*/
/* ------------------------------------------------------------------ */
const KOM_CARDS = [
  {
    src: '/images/komunitas-1.jpg',
    alt: 'Suasana pasar di Kendari',
    tag: 'UMKM',
    title: 'Pelaku usaha lokal',
    desc: 'Dari pasar tradisional hingga toko daring.',
  },
  {
    src: '/images/komunitas-2.jpg',
    alt: 'Anak muda Kendari berkreasi',
    tag: 'Kreativitas',
    title: 'Generasi muda',
    desc: 'Anak muda Sultra yang berkarya lewat teknologi.',
  },
  {
    src: '/images/komunitas-3.jpg',
    alt: 'Nelayan Kendari',
    tag: 'Bahari',
    title: 'Nelayan & petani',
    desc: 'Tulang punggung ekonomi Sulawesi Tenggara.',
  },
];

export function KendariKomunitas() {
  return (
    <section className="kh-section kh-kom" id="komunitas" aria-labelledby="kh-kom-title">
      <div className="kh-tugu" aria-hidden="true">
        <ImageSlot
          src="/images/tugu-mtq.jpg"
          alt=""
          imgAltHidden
          fallbackClass="kh-fb-tugu"
        />
      </div>
      <div className="kh-wrap">
        <WcReveal>
          <div className="kh-label">Komunitas</div>
        </WcReveal>
        <WcReveal delay={1}>
          <h2 className="kh-h2" id="kh-kom-title">
            Dari Kendari,
            <br />
            <span className="kh-gold">untuk Kendari.</span>
          </h2>
        </WcReveal>
        <WcReveal delay={2}>
          <p className="kh-desc">
            SUKI adalah ruang bagi warga Sultra untuk tumbuh bersama — berkarya,
            berdagang, dan saling mendukung.
          </p>
        </WcReveal>
        <div className="kh-kom-grid">
          {KOM_CARDS.map((c, i) => (
            <WcReveal key={c.title} delay={(i % 3) as 0 | 1 | 2}>
              <article className="kh-kom-card">
                <div className="kh-kom-media">
                  <ImageSlot
                    src={c.src}
                    alt={c.alt}
                    fallbackClass="kh-fb-komunitas"
                  />
                  <div className="kh-kom-shade" aria-hidden="true" />
                </div>
                <div className="kh-kom-body">
                  <span className="kh-kom-tag">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </article>
            </WcReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
