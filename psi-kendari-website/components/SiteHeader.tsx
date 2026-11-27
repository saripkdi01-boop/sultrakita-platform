import Link from "next/link";
import { LINKS, NAV, SITE } from "@/config/site";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { IconExternal, IconSearch } from "./icons";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${SITE.title} — beranda`}>
          <Logo variant="horizontal" tone="auto" height={40} priority />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-lg font-extrabold tracking-tight text-fg sm:text-xl">
              PSI <span className="text-red-ink">Kendari</span>
            </span>
            <span className="block truncate text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
              {SITE.tagline}
            </span>
          </span>
        </Link>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/cari"
            aria-label="Cari berita"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg hover:bg-bg-soft"
          >
            <IconSearch />
          </Link>
          <ThemeToggle />
          <a
            href={LINKS.daftarAnggota}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-red px-4 py-2.5 text-sm font-bold text-white hover:bg-red-strong sm:inline-flex"
          >
            Daftar Anggota
            <IconExternal />
            <span className="sr-only">(membuka psi.id di tab baru)</span>
          </a>
        </div>
      </div>
      <nav aria-label="Menu utama" className="border-t border-border">
        <NavLinks items={NAV} />
      </nav>
      <div className="border-t border-border bg-red sm:hidden">
        <a
          href={LINKS.daftarAnggota}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white"
        >
          Daftar Anggota di psi.id <IconExternal />
        </a>
      </div>
    </header>
  );
}
