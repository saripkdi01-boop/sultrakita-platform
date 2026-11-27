import type { Metadata } from "next";
import Link from "next/link";
import { getStrukturDPP, getStrukturDPW, getWilayahList, wilayahTerisi } from "@/lib/content";
import { formatAngka } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusChip, StrukturTable } from "@/components/StrukturTable";
import { OfficeCard } from "@/components/OfficeCard";
import { EmptyState } from "@/components/EmptyState";
import { IconArrowRight, IconExternal } from "@/components/icons";

export const metadata: Metadata = {
  title: "Struktur Wilayah",
  description:
    "Struktur PSI: DPP, DPW PSI Sulawesi Tenggara, DPD PSI Kota Kendari, dan DPD kabupaten/kota sekitar di Sulawesi Tenggara.",
  alternates: { canonical: "/struktur" },
};

export default function StrukturPage() {
  const dpp = getStrukturDPP();
  const dpw = getStrukturDPW();
  const wilayah = getWilayahList();
  const kendari = wilayah.find((w) => w.slug === "kota-kendari");
  const lainnya = wilayah.filter((w) => w.slug !== "kota-kendari");

  return (
    <>
      <PageHeader
        title="Struktur Wilayah"
        kicker="DPP → DPW → DPD"
        crumbs={[{ label: "Struktur" }]}
        lead="Data kepengurusan hanya ditampilkan bila tersedia di berkas data resmi situs ini. Kolom yang belum ada datanya ditandai “menunggu data resmi”."
      />
      <Container className="space-y-14 py-10">
        <section aria-labelledby="dpp">
          <SectionHeading id="dpp" title="DPP PSI (ringkas)" kicker="Nasional" />
          {dpp?.pengurus.length ? (
            <StrukturTable pengurus={dpp.pengurus} caption="Pengurus DPP PSI" />
          ) : (
            <EmptyState
              title="Susunan pengurus DPP menunggu data resmi"
              action={
                <a href="https://psi.id/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm font-bold text-white hover:bg-red-strong">
                  Rujuk psi.id <IconExternal />
                </a>
              }
            >
              {dpp?.catatan}
            </EmptyState>
          )}
        </section>

        {dpw ? (
          <section aria-labelledby="dpw">
            <SectionHeading id="dpw" title={dpw.nama} kicker="Provinsi" />
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <StrukturTable pengurus={dpw.pengurus} caption={`Pengurus ${dpw.nama}`} />
                {dpw.catatan ? <p className="mt-3 text-sm text-muted">{dpw.catatan}</p> : null}
              </div>
              <div className="space-y-4">
                <dl className="grid grid-cols-2 gap-4">
                  {dpw.sk ? (
                    <div className="col-span-2 rounded-2xl border border-border bg-surface p-4">
                      <dt className="text-xs font-bold uppercase tracking-widest text-muted">Dasar kepengurusan</dt>
                      <dd className="mt-1 text-lg font-extrabold">SK {dpw.sk.penerbit} No. {dpw.sk.nomor}</dd>
                    </div>
                  ) : null}
                  {dpw.anggota_tercatat ? (
                    <div className="col-span-2 rounded-2xl bg-red p-4 text-white">
                      <dt className="text-xs font-bold uppercase tracking-widest text-white">Anggota tercatat</dt>
                      <dd className="mt-1 text-3xl font-extrabold">{formatAngka(dpw.anggota_tercatat.jumlah)}</dd>
                      <dd className="text-sm text-white">
                        Sumber:{" "}
                        {dpw.anggota_tercatat.sumber_url ? (
                          <a className="underline" href={dpw.anggota_tercatat.sumber_url} target="_blank" rel="noopener noreferrer">
                            {dpw.anggota_tercatat.sumber}
                          </a>
                        ) : (
                          dpw.anggota_tercatat.sumber
                        )}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                {dpw.kantor ? <OfficeCard title="Kantor DPW" alamat={dpw.kantor.alamat} catatan={dpw.kantor.catatan} /> : null}
              </div>
            </div>
          </section>
        ) : null}

        {kendari ? (
          <section aria-labelledby="dpd-kendari">
            <SectionHeading id="dpd-kendari" title={kendari.dpd} kicker="Kota" href={`/struktur/${kendari.slug}`} hrefLabel="Halaman wilayah" />
            <div className="grid gap-6 lg:grid-cols-2">
              {wilayahTerisi(kendari) ? (
                <StrukturTable pengurus={kendari.pengurus} caption={`Pengurus ${kendari.dpd}`} />
              ) : (
                <EmptyState title="Susunan pengurus DPD Kota Kendari menunggu data resmi">{kendari.catatan}</EmptyState>
              )}
              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="font-extrabold">Data Pemilu DPRD Kota Kendari 2024</h3>
                <p className="mt-2 text-sm text-muted">
                  Perolehan suara PSI per dapil berdasarkan Keputusan KPU Kota Kendari No. 93/2024.
                </p>
                <Link href="/data-pemilu" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-red-ink hover:underline">
                  Lihat data pemilu <IconArrowRight />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="dpd-sekitar">
          <SectionHeading id="dpd-sekitar" title="DPD kabupaten/kota sekitar" kicker="Sulawesi Tenggara" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lainnya.map((w) => (
              <li key={w.slug}>
                <Link href={`/struktur/${w.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 hover:border-red">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted">{w.jenis}</span>
                  <span className="mt-1 text-lg font-extrabold group-hover:text-red-ink">{w.dpd}</span>
                  <span className="mt-3">
                    <StatusChip terisi={wilayahTerisi(w)} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
