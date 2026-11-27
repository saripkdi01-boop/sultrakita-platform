'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import { DOORS, PRODUCTS, SIGNUP_HREF, STUDIO_HREF, WA_MESSAGES } from '@/lib/homepage/content';
import { HOME_ASSETS, type HomeAsset } from '@/lib/homepage/assets';
import { sukiWaLink } from '@/lib/whatsapp';
import { HomeImage, hasAsset } from './HomeImage';

/** Produk Suki — empat produk, satu kalimat manfaat masing-masing. */
export function ProductsSection() {
  return (
    <section id="produk" className="hm-section hm-section--tint" aria-labelledby="hm-products-title">
      <div className="hm-wrap">
        <header className="hm-section-head hm-reveal">
          <p className="hm-eyebrow">Produk Suki</p>
          <h2 id="hm-products-title" className="hm-h2">Empat produk, satu tim dari Kendari.</h2>
        </header>
        <ul className="hm-products">
          {PRODUCTS.map((product, index) => {
            const body = (
              <>
                <p className="hm-badge">{product.tag}</p>
                <h3 className="hm-h3">{product.name}</h3>
                <p>{product.benefit}</p>
                {product.href ? (
                  <span className="hm-link">
                    {product.external ? 'Kunjungi' : 'Buka'} <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="hm-product-note">Aplikasi Android · tautan unduh menyusul</span>
                )}
              </>
            );
            return (
              <li key={product.id} className="hm-reveal" style={{ '--i': index } as React.CSSProperties}>
                {product.href ? (
                  <a
                    href={product.href}
                    className="hm-product"
                    {...(product.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    {...(product.id === 'studio' ? { hrefLang: 'en' } : {})}
                  >
                    {body}
                  </a>
                ) : (
                  <div className="hm-product">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const STRIP: Array<{ asset: HomeAsset; caption: string }> = [
  { asset: HOME_ASSETS.bahteramas, caption: 'Teluk Kendari & Jembatan Bahteramas' },
  { asset: HOME_ASSETS.pasarPagi, caption: 'Pasar Pagi Kendari' },
  { asset: HOME_ASSETS.kreatorMuda, caption: 'Generasi muda Kendari' },
  { asset: HOME_ASSETS.bahari, caption: 'Bahari & nelayan' },
];

/** Tahap 4 corong — AKSI: gesekan menuju nol. */
export function ClosingSection() {
  const wa = sukiWaLink(WA_MESSAGES.general);
  // Slot yang belum punya foto (Pasar Pagi, Bahari) tidak dirender — tidak ada kotak kosong.
  const photos = STRIP.filter((item) => hasAsset(item.asset)).slice(0, 3);

  return (
    <section className="hm-closing" aria-labelledby="hm-closing-title">
      <div className="hm-wrap hm-closing-inner">
        <div className="hm-closing-copy hm-reveal">
          <p className="hm-eyebrow">Dari Kendari, untuk Kendari</p>
          <h2 id="hm-closing-title" className="hm-h2">Pintunya sudah terbuka. Tinggal masuk.</h2>
          <p className="hm-section-lead">Buat akun gratis, pilih pintu yang paling kamu butuhkan, dan mulai hari ini.</p>
          <div className="hm-cta-row">
            <Link
              href={SIGNUP_HREF}
              className="hm-btn hm-btn--primary hm-btn--lg"
              data-track="cta_mulai_gratis"
              data-track-placement="closing"
            >
              Mulai Gratis <ArrowRight size={20} aria-hidden="true" />
            </Link>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="hm-btn hm-btn--ghost hm-btn--lg"
                data-track="cta_whatsapp"
                data-track-placement="closing"
              >
                <MessageCircle size={20} aria-hidden="true" /> Chat WhatsApp
              </a>
            )}
          </div>
        </div>
        {photos.length > 0 && (
          <ul className={`hm-strip hm-strip--${photos.length}`}>
            {photos.map((item, index) => (
              <li key={item.caption} className="hm-reveal" style={{ '--i': index } as React.CSSProperties}>
                <figure>
                  <div className="hm-strip-frame">
                    <HomeImage asset={item.asset} sizes="(max-width: 900px) 46vw, 300px" className="hm-cover" />
                  </div>
                  <figcaption>{item.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function HomeFooter() {
  const wa = sukiWaLink(WA_MESSAGES.general);
  return (
    <footer className="hm-footer">
      <div className="hm-wrap">
        <div className="hm-footer-top">
          <div className="hm-footer-brand">
            <Link href="/" className="hm-brand" aria-label="Suki Apps — beranda">
              <Image src="/brand/suki-logo-mark.svg" alt="" width={32} height={32} />
              <span><strong>Suki Apps</strong><small>by SULTRAKITA</small></span>
            </Link>
            <p>Ekosistem digital Kendari dan Sulawesi Tenggara.</p>
          </div>
          <nav className="hm-footer-links" aria-label="Tautan footer">
            <div>
              <p>Enam pintu</p>
              {DOORS.map((door) => <Link key={door.id} href={door.href}>{door.name}</Link>)}
            </div>
            <div>
              <p>Produk</p>
              <a href="https://grahaos.vercel.app/" target="_blank" rel="noopener noreferrer">GrahaOS</a>
              <Link href="/beranda">Suki Apps</Link>
              <a href={STUDIO_HREF} hrefLang="en">Suki Studio Web</a>
              <a href="#harga">Harga</a>
            </div>
            <div>
              <p>Bantuan</p>
              <Link href="/help-center">Panduan</Link>
              <Link href="/bantuan/faq">FAQ</Link>
              <Link href="/kontak">Kontak</Link>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" data-track="cta_whatsapp" data-track-placement="footer">
                  WhatsApp
                </a>
              )}
            </div>
            <div>
              <p>Legal</p>
              <Link href="/legal/kebijakan-privasi">Kebijakan privasi</Link>
              <Link href="/legal/syarat-ketentuan">Syarat & ketentuan</Link>
              <Link href="/security-center">Keamanan</Link>
            </div>
          </nav>
        </div>
        <div className="hm-footer-bottom">
          <span>© 2026 Suki Apps · SULTRAKITA</span>
          <span>
            Bahasa: <strong lang="id">Indonesia</strong> · <a href={STUDIO_HREF} hrefLang="en" lang="en">English → Suki Studio</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/** Sticky CTA bawah — hanya mobile, muncul setelah hero lewat. Bukan pop-up. */
export function StickyCta({ visible }: { visible: boolean }) {
  const wa = sukiWaLink(WA_MESSAGES.general);
  return (
    <div className={`hm-sticky${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <Link
        href={SIGNUP_HREF}
        className="hm-btn hm-btn--primary"
        tabIndex={visible ? 0 : -1}
        data-track="cta_mulai_gratis"
        data-track-placement="sticky"
      >
        Mulai Gratis <ArrowRight size={18} aria-hidden="true" />
      </Link>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="hm-icon-btn hm-sticky-wa"
          aria-label="Chat WhatsApp"
          tabIndex={visible ? 0 : -1}
          data-track="cta_whatsapp"
          data-track-placement="sticky"
        >
          <MessageCircle size={22} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
