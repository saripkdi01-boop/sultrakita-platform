import { EmptyState } from "../EmptyState";
import { IconExternal } from "../icons";

export function PsiUnavailable({ sourceHref = "https://psi.id/", what = "Berita dari psi.id" }: { sourceHref?: string; what?: string }) {
  return (
    <EmptyState title={`${what} sementara tidak dapat dimuat`} tone="warning">
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
