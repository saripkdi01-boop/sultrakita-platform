import type { Metadata } from "next";
import Link from "next/link";
import { getKlarifikasi } from "@/lib/content";
import { formatTanggal } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { VerificationBadge } from "@/components/Badges";
import { LabelLegend } from "@/components/LabelLegend";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Klarifikasi & Cek Fakta",
  description: "Kanal klarifikasi dan cek fakta PSI Kendari dengan template baku anti-hoaks: klaim, label, fakta, sumber, dan keputusan.",
  alternates: { canonical: "/klarifikasi" },
};

const SOP = [
  "Klaim dicatat persis seperti beredar.",
  "Dicatat kapan dan di mana klaim pertama beredar (bila diketahui).",
  "Setiap fakta wajib punya sumber dan tanggal.",
  "Hal yang belum diketahui ditulis terbuka, tidak ditebak.",
  "Keputusan memakai salah satu dari lima label baku.",
];

export default function KlarifikasiPage() {
  const list = getKlarifikasi();
  return (
    <>
      <PageHeader
        title="Klarifikasi & Cek Fakta"
        kicker="SOP anti-hoaks"
        crumbs={[{ label: "Klarifikasi" }]}
        lead="Setiap entri memakai template baku: klaim persis, pertama beredar, label, fakta + sumber + tanggal, yang belum diketahui, dan keputusan."
      />
      <Container className="space-y-12 py-10">
        <section aria-labelledby="label">
          <SectionHeading id="label" title="Lima label baku" />
          <LabelLegend />
        </section>

        <section aria-labelledby="entri">
          <SectionHeading id="entri" title="Entri klarifikasi" />
          {list.length ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {list.map((k) => (
                <li key={k.slug}>
                  <Link href={`/klarifikasi/${k.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 hover:border-red">
                    <VerificationBadge label={k.label} />
                    <h3 className="mt-3 text-lg font-extrabold leading-snug group-hover:text-red-ink">{k.judul}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted">Klaim: “{k.klaim}”</p>
                    <p className="mt-3 text-sm font-semibold">Keputusan: {k.keputusan}</p>
                    <p className="mt-auto pt-3 text-xs text-muted">
                      Diperbarui <time dateTime={k.tanggal}>{formatTanggal(k.tanggal)}</time>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Belum ada entri klarifikasi" />
          )}
        </section>

        <section aria-labelledby="sop" className="rounded-2xl border border-border bg-bg-soft p-6">
          <h2 id="sop" className="text-lg font-extrabold">SOP singkat</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
            {SOP.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">
            Punya informasi yang perlu diklarifikasi? Sampaikan melalui halaman <Link className="font-bold text-red-ink underline" href="/kontak">Kontak</Link>{" "}
            tanpa menyertakan data pribadi.
          </p>
        </section>
      </Container>
    </>
  );
}
