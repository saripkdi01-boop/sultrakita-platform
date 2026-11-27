import type { Pengurus } from "@/lib/content";

export function StrukturTable({ pengurus, caption }: { pengurus: Pengurus[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[420px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-bg-soft">
          <tr>
            <th scope="col" className="px-4 py-3 font-bold">Jabatan</th>
            <th scope="col" className="px-4 py-3 font-bold">Nama</th>
          </tr>
        </thead>
        <tbody>
          {pengurus.map((p) => (
            <tr key={p.jabatan} className="border-t border-border">
              <th scope="row" className="px-4 py-3 font-semibold">{p.jabatan}</th>
              <td className="px-4 py-3">
                {p.nama ? (
                  <span className="font-semibold">{p.nama}</span>
                ) : (
                  <span className="italic text-muted">{p.catatan || "menunggu data resmi"}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusChip({ terisi }: { terisi: boolean }) {
  return terisi ? (
    <span className="inline-block rounded-full bg-ink px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-white dark:bg-white dark:text-ink">
      Data terisi
    </span>
  ) : (
    <span className="inline-block rounded-full border border-border px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-muted">
      Menunggu data resmi
    </span>
  );
}
