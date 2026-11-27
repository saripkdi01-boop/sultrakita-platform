import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDataPemilu } from "@/lib/content";
import { formatAngka, formatPersen } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { BarChart } from "@/components/BarChart";
import { PemiluTable, SumberPemilu } from "@/components/PemiluTable";
import { VerificationBadge } from "@/components/Badges";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Data Pemilu Kendari 2024",
  description:
    "Perolehan suara PSI pada pemilihan DPRD Kota Kendari 2024 per dapil: total 547 suara (Kendari 1: 67, Kendari 2: 112, Kendari 3: 37, Kendari 4: 55, Kendari 5: 276). Sumber: Keputusan KPU Kota Kendari No. 93/2024.",
  alternates: { canonical: "/data-pemilu" },
};

export default function DataPemiluPage() {
  const data = getDataPemilu("kendari-2024");
  if (!data) notFound();
  const terbesar = [...data.dapil].sort((a, b) => b.suara - a.suara)[0];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: data.judul,
          description: `Suara PSI per dapil pada pemilihan ${data.lembaga} ${data.pemilu}.`,
          url: `${SITE.url}/data-pemilu`,
          inLanguage: "id-ID",
          isBasedOn: data.sumber.dokumen,
          creator: { "@type": "Organization", name: data.sumber.penerbit },
        }}
      />
      <PageHeader
        title="Data Pemilu Kendari 2024"
        kicker="DPRD Kota Kendari"
        crumbs={[{ label: "Data Pemilu" }]}
        lead={`Perolehan suara ${data.partai} pada pemilihan anggota ${data.lembaga}, ${data.pemilu}, per daerah pemilihan.`}
      >
        <div className="mt-4">
          <VerificationBadge label="TERVERIFIKASI" />
        </div>
      </PageHeader>
      <Container className="space-y-12 py-10">
        <section aria-labelledby="ringkasan" className="grid gap-4 sm:grid-cols-3">
          <h2 id="ringkasan" className="sr-only">Ringkasan</h2>
          <div className="rounded-2xl bg-red p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-white/85">Total suara PSI</p>
            <p className="mt-1 text-5xl font-extrabold tabular-nums">{formatAngka(data.total_suara_partai)}</p>
            <p className="mt-1 text-sm text-white/90">{data.lembaga}, {data.pemilu}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Total suara sah</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">{formatAngka(data.total_suara_sah)}</p>
            <p className="mt-1 text-sm text-muted">
              Porsi PSI: {formatPersen(data.total_suara_partai, data.total_suara_sah, 2)} dari suara sah
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Dapil terbesar</p>
            <p className="mt-1 text-3xl font-extrabold">{terbesar.nama}</p>
            <p className="mt-1 text-sm text-muted">
              {formatAngka(terbesar.suara)} suara ({formatPersen(terbesar.suara, data.total_suara_partai)} dari suara PSI)
            </p>
          </div>
        </section>

        <section aria-labelledby="grafik" className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading id="grafik" title="Suara PSI per dapil" />
            <BarChart
              title={`Suara PSI per dapil — ${data.lembaga} ${data.pemilu} (total ${formatAngka(data.total_suara_partai)})`}
              data={data.dapil.map((d) => ({ label: d.nama, value: d.suara }))}
              shareOf={data.total_suara_partai}
              shareLabel="dari suara PSI"
              tableId="tabel-pemilu"
            />
          </div>
          <div>
            <SectionHeading title="Tabel data" />
            <PemiluTable data={data} id="tabel-pemilu" />
          </div>
        </section>

        <SumberPemilu data={data} />
      </Container>
    </>
  );
}
