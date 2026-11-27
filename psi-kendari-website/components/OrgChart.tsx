const LEVELS = [
  { kode: "DPP", nama: "Dewan Pimpinan Pusat", cakupan: "Nasional" },
  { kode: "DPW", nama: "Dewan Pimpinan Wilayah", cakupan: "Provinsi" },
  { kode: "DPD", nama: "Dewan Pimpinan Daerah", cakupan: "Kabupaten/Kota" },
  { kode: "DPC", nama: "Dewan Pimpinan Cabang", cakupan: "Kecamatan" },
  { kode: "DPRt", nama: "Dewan Pimpinan Ranting", cakupan: "Desa/Kelurahan" },
];

/** Bagan jenjang organisasi PSI (DPP → DPRt). */
export function OrgChart() {
  return (
    <ol className="grid gap-3 sm:grid-cols-5" aria-label="Jenjang struktur organisasi PSI">
      {LEVELS.map((l, i) => (
        <li key={l.kode} className="relative">
          <div className={`h-full rounded-2xl border p-4 ${i === 0 ? "border-red bg-red text-white" : "border-border bg-surface"}`}>
            <p className="text-2xl font-extrabold">{l.kode}</p>
            <p className={`mt-1 text-sm font-semibold ${i === 0 ? "text-white" : "text-fg"}`}>{l.nama}</p>
            <p className={`text-xs ${i === 0 ? "text-white/85" : "text-muted"}`}>{l.cakupan}</p>
          </div>
          {i < LEVELS.length - 1 ? (
            <span aria-hidden="true" className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-red-ink sm:-right-3 sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0">
              <span className="sm:hidden">▼</span>
              <span className="hidden sm:inline">▶</span>
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
