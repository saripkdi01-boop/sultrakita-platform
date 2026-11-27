import { EmptyState } from "../EmptyState";
import { IconExternal } from "../icons";

/**
 * Pesan rapi saat psi.id tidak dapat dimuat. `compact` dipakai untuk blok
 * sekunder agar halaman tidak dipenuhi kotak peringatan berulang.
 */
export function PsiUnavailable({
  sourceHref = "https://psi.id/",
  what = "Berita dari psi.id",
  compact = false,
}: {
  sourceHref?: string;
  what?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <p role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-dashed border-border bg-bg-soft px-4 py-3 text-sm text-muted">
        <span>{what} sementara tidak dapat dimuat.</span>
        <a href={sourceHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-red-ink hover:underline">
          Baca di psi.id <IconExternal />
        </a>
      </p>
    );
  }
  return (
    <EmptyState title={`${what} sementara tidak dapat dimuat`} tone="warning" className="flex min-h-44 flex-col justify-center">
      <p>
        psi.id saat ini membatasi akses otomatis, sehingga daftar ini belum bisa ditampilkan di sini. Silakan
        baca langsung di situs resmi PSI.
      </p>
      <p className="mt-3">
        <a
          href={sourceHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm font-bold text-white hover:bg-red-strong"
        >
          Buka di psi.id <IconExternal />
        </a>
      </p>
    </EmptyState>
  );
}
