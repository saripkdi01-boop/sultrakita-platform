import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWilayah, getWilayahList, wilayahTerisi } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusChip, StrukturTable } from "@/components/StrukturTable";
import { OfficeCard } from "@/components/OfficeCard";
import { EmptyState } from "@/components/EmptyState";
import { IconArrowRight } from "@/components/icons";

export const revalidate = 900;
export const dynamicParams = false;

type Props = { params: Promise<{ wilayah: string }> };

export function generateStaticParams() {
  return getWilayahList().map((w) => ({ wilayah: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = getWilayah((await params).wilayah);
  if (!w) return {};
  return {
    title: `${w.dpd}`,
    description: `Struktur ${w.dpd}, Sulawesi Tenggara — data kepengurusan apa adanya dan kabar terbaru wilayah ${w.nama}.`,
    alternates: { canonical: `/struktur/${w.slug}` },
  };
}

export default async function WilayahPage({ params }: Props) {
  const w = getWilayah((await params).wilayah);
  if (!w) notFound();
  const terisi = wilayahTerisi(w);

  return (
    <>
      <PageHeader
        title={w.dpd}
        kicker={`${w.jenis} · Sulawesi Tenggara`}
        crumbs={[{ label: "Struktur", href: "/struktur" }, { label: w.nama }]}
        lead={terisi ? undefined : "Halaman struktur ini belum terisi. Data hanya ditampilkan setelah tersedia di berkas data resmi — kami tidak mengisi nama atau angka tanpa sumber."}
      >
        <div className="mt-4">
          <StatusChip terisi={terisi} />
        </div>
      </PageHeader>
      <Container className="space-y-12 py-10">
        <section aria-labelledby="pengurus">
          <SectionHeading id="pengurus" title="Pengurus" />
          {terisi ? (
            <StrukturTable pengurus={w.pengurus} caption={`Pengurus ${w.dpd}`} />
          ) : (
            <EmptyState title="Susunan pengurus menunggu data resmi">{w.catatan}</EmptyState>
          )}
        </section>

        <section aria-labelledby="sekretariat" className="grid gap-6 md:grid-cols-2">
          <div>
            <SectionHeading id="sekretariat" title="Sekretariat & SK" />
            <OfficeCard title={`Sekretariat ${w.dpd}`} alamat={w.kantor?.alamat ?? []} catatan={w.kantor?.catatan}>
              <p className="mt-3 text-sm">
                <span className="text-muted">SK kepengurusan: </span>
                {w.sk ? <strong>{`SK ${w.sk.penerbit} No. ${w.sk.nomor}`}</strong> : <em className="text-muted">menunggu data resmi</em>}
              </p>
            </OfficeCard>
          </div>
          {w.data_pemilu ? (
            <div>
              <SectionHeading title="Data pemilu" />
              <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="font-bold">Perolehan suara PSI — DPRD {w.nama} 2024</p>
                <Link href="/data-pemilu" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-red-ink hover:underline">
                  Lihat data per dapil <IconArrowRight />
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      </Container>
    </>
  );
}
