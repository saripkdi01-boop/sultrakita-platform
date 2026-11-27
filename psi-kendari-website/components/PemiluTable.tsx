import type { DataPemilu } from "@/lib/content";
import { formatAngka, formatPersen } from "@/lib/format";

export function PemiluTable({ data, id }: { data: DataPemilu; id: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table id={id} className="w-full min-w-[420px] text-left text-sm">
        <caption className="px-4 pt-3 text-left text-xs text-muted">
          Tabel data: suara PSI per dapil, {data.lembaga} — {data.pemilu}. Sumber: {data.sumber.dokumen}.
        </caption>
        <thead className="bg-bg-soft">
          <tr>
            <th scope="col" className="px-4 py-3">Dapil</th>
            <th scope="col" className="px-4 py-3 text-right">Suara PSI</th>
            <th scope="col" className="px-4 py-3 text-right">Porsi dari suara PSI</th>
          </tr>
        </thead>
        <tbody>
          {data.dapil.map((d) => (
            <tr key={d.nama} className="border-t border-border">
              <th scope="row" className="px-4 py-3 font-semibold">{d.nama}</th>
              <td className="px-4 py-3 text-right tabular-nums">{formatAngka(d.suara)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatPersen(d.suara, data.total_suara_partai)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-fg font-extrabold">
            <th scope="row" className="px-4 py-3">Total</th>
            <td className="px-4 py-3 text-right tabular-nums">{formatAngka(data.total_suara_partai)}</td>
            <td className="px-4 py-3 text-right tabular-nums">100,0%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function SumberPemilu({ data }: { data: DataPemilu }) {
  return (
    <div className="rounded-2xl border-l-4 border-red bg-bg-soft p-5 text-sm">
      <p className="font-bold">Sumber data</p>
      <p className="mt-1">
        {data.sumber.url ? (
          <a href={data.sumber.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-ink underline">
            {data.sumber.dokumen}
          </a>
        ) : (
          <strong>{data.sumber.dokumen}</strong>
        )}{" "}
        — diterbitkan {data.sumber.penerbit}. Status: {data.sumber.status_verifikasi}.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
        {data.catatan.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
