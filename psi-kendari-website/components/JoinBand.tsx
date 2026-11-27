import { LINKS } from "@/config/site";
import { IconExternal } from "./icons";

/** Ajakan bergabung — SELALU diarahkan ke kanal resmi psi.id / aku.psi.id (tanpa formulir lokal). */
export function JoinBand() {
  return (
    <section aria-labelledby="gabung" className="overflow-hidden rounded-3xl bg-red text-white">
      <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-white">Partai Super TBK</p>
          <h2 id="gabung" className="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">
            Bergabung dengan PSI lewat kanal resmi
          </h2>
          <p className="mt-3 max-w-2xl text-white">
            Pendaftaran anggota dan relawan dilakukan langsung di psi.id dan aku.psi.id. Situs ini tidak
            mengumpulkan NIK, foto KTP, nomor HP, atau data pribadi lainnya.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <a
            href={LINKS.daftarAnggota}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-extrabold text-red-strong hover:bg-zinc-100"
          >
            Daftar Anggota <IconExternal />
          </a>
          <a
            href={LINKS.relawan}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white px-5 py-3 font-extrabold text-white hover:bg-white/10"
          >
            Daftar Relawan <IconExternal />
          </a>
        </div>
      </div>
    </section>
  );
}
