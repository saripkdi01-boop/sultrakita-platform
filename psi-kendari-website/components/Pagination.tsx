import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  hrefFor,
  label = "Navigasi halaman",
}: {
  page: number;
  totalPages: number;
  hrefFor: (p: number) => string;
  label?: string;
}) {
  if (totalPages <= 1) return null;
  const pages: number[] = [];
  const from = Math.max(1, page - 2);
  const to = Math.min(totalPages, page + 2);
  for (let p = from; p <= to; p++) pages.push(p);
  const cls = "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-bold";
  return (
    <nav aria-label={label} className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={`${cls} border-border hover:border-red`}>
          ‹ Sebelumnya
        </Link>
      ) : null}
      {from > 1 ? (
        <>
          <Link href={hrefFor(1)} className={`${cls} border-border hover:border-red`}>1</Link>
          {from > 2 ? <span aria-hidden="true">…</span> : null}
        </>
      ) : null}
      {pages.map((p) =>
        p === page ? (
          <span key={p} aria-current="page" className={`${cls} border-red bg-red text-white`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={hrefFor(p)} className={`${cls} border-border hover:border-red`}>
            {p}
          </Link>
        ),
      )}
      {to < totalPages ? <span aria-hidden="true">…</span> : null}
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" className={`${cls} border-border hover:border-red`}>
          Berikutnya ›
        </Link>
      ) : null}
    </nav>
  );
}
