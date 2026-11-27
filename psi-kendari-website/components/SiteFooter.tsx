import Link from "next/link";
import { KANTOR_DPP, KANTOR_DPW_SULTRA, LINKS, SITE, SOCIAL_LINKS } from "@/config/site";
import { Logo } from "./Logo";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-white/10 bg-ink text-zinc-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo variant="vertikal" tone="putih" height={96} />
          <p className="mt-3 text-xl font-extrabold text-white">
            PSI <span className="text-[#ff4d57]">Kendari</span>
          </p>
          <p className="text-sm text-zinc-300">{SITE.tagline} · Kota Kendari & Sulawesi Tenggara</p>
          <p className="mt-4 text-sm text-zinc-300">
            Situs informasi PSI wilayah Kota Kendari dan sekitarnya. Situs resmi DPP PSI:{" "}
            <a className="font-semibold text-white underline underline-offset-4" href={LINKS.psi} {...ext}>
              psi.id
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">{KANTOR_DPP.nama}</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-zinc-300">
            {KANTOR_DPP.alamat.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <h2 className="mt-6 text-sm font-bold uppercase tracking-widest text-white">{KANTOR_DPW_SULTRA.nama}</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-zinc-300">
            {KANTOR_DPW_SULTRA.alamat.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Tautan resmi</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="hover:text-white hover:underline" href={LINKS.psi} {...ext}>psi.id — DPP PSI</a></li>
            <li><a className="hover:text-white hover:underline" href={LINKS.akuPsi} {...ext}>aku.psi.id — portal anggota</a></li>
            <li><a className="hover:text-white hover:underline" href={LINKS.daftarAnggota} {...ext}>Daftar Anggota</a></li>
            <li><a className="hover:text-white hover:underline" href={LINKS.relawan} {...ext}>Daftar Relawan</a></li>
            <li><a className="hover:text-white hover:underline" href={LINKS.kpu} {...ext}>KPU RI</a></li>
            <li><a className="hover:text-white hover:underline" href={LINKS.bawaslu} {...ext}>Bawaslu RI</a></li>
          </ul>
          <h2 className="mt-6 text-sm font-bold uppercase tracking-widest text-white">Media sosial resmi</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.href}><a className="hover:text-white hover:underline" href={s.href} {...ext}>{s.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Jelajahi</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm lg:grid-cols-1">
            <li><Link className="hover:text-white hover:underline" href="/berita-psi">Berita PSI</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/kendari-sultra">Kendari & Sultra</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/politik-terbaru">Politik Terbaru</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/data-pemilu">Data Pemilu</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/klarifikasi">Klarifikasi</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/struktur">Struktur</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/agenda">Agenda</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/kontak">Kontak</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} PSI Kendari. Artikel psi.id © pemiliknya; berita media lain hanya ringkasan + tautan ke sumber asli.</p>
          <p>Waktu ditampilkan dalam {SITE.timeZoneLabel} (Asia/Makassar).</p>
        </div>
      </div>
    </footer>
  );
}
