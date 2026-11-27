import type { Metadata } from "next";
import Link from "next/link";
import { KANTOR_DPP, LINKS } from "@/config/site";
import { getStrukturDPW } from "@/lib/content";
import { formatAngka } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { OrgChart } from "@/components/OrgChart";
import { OfficeCard } from "@/components/OfficeCard";
import { Logo, hasLogo } from "@/components/Logo";
import { IconArrowRight, IconExternal } from "@/components/icons";

export const metadata: Metadata = {
  title: "Profil PSI",
  description:
    "Tentang Partai Solidaritas Indonesia (PSI): didirikan 16 November 2014, DNA Kebajikan & Keragaman, arti Partai Super TBK, dan struktur organisasi DPP hingga DPRt.",
  alternates: { canonical: "/profil" },
};

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function ProfilPage() {
  const dpw = getStrukturDPW();
  const ketua = dpw?.pengurus.find((p) => p.jabatan === "Ketua");

  return (
    <>
      <PageHeader
        title="Profil Partai Solidaritas Indonesia"
        kicker="Partai Super TBK"
        crumbs={[{ label: "Profil" }]}
        lead="PSI dikenal sebagai Partai Super TBK — Partai Super Terbuka."
      />
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-12">
            <section aria-labelledby="sejarah">
              <SectionHeading id="sejarah" title="Sejarah singkat" />
              <div className="prose-psi">
                <p>
                  Partai Solidaritas Indonesia (PSI) didirikan pada <strong>16 November 2014</strong>. Partai ini
                  dikenal dengan sebutan <strong>“Partai Super TBK”</strong> — Partai Super Terbuka.
                </p>
                <p>
                  Logo PSI bergambar <strong>gajah</strong> dengan kepala berwarna merah dan badan berwarna hitam.
                  Warna utama partai adalah merah, hitam, dan putih.
                </p>
              </div>
            </section>

            <section aria-labelledby="dna">
              <SectionHeading id="dna" title="DNA partai" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-red p-6 text-white">
                  <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-white">DNA 1</p>
                  <h3 className="mt-1 text-2xl font-extrabold">Kebajikan</h3>
                  <p className="mt-2 text-white">Sikap antikorupsi.</p>
                </div>
                <div className="rounded-2xl bg-ink p-6 text-white">
                  <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#ff4d57]">DNA 2</p>
                  <h3 className="mt-1 text-2xl font-extrabold">Keragaman</h3>
                  <p className="mt-2 text-zinc-300">Sikap anti-intoleransi.</p>
                </div>
              </div>
              <p className="mt-4 text-muted">
                Sasaran utama PSI adalah anak muda dan perempuan, dengan menjunjung pluralisme.
              </p>
            </section>

            <section aria-labelledby="tbk">
              <SectionHeading id="tbk" title="Arti “Partai Super TBK”" />
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-lg">
                  <strong>TBK = Terbuka.</strong> “Partai Super Terbuka” berarti partai ini dimiliki secara kolektif
                  oleh para kadernya.
                </p>
                <p className="mt-3 rounded-xl border-l-4 border-gold bg-bg-soft p-4 text-sm">
                  <strong>Penting:</strong> “TBK” di sini <strong>bukan</strong> berarti PSI adalah perusahaan
                  terbuka yang tercatat di bursa efek. PSI adalah partai politik, bukan emiten saham.
                </p>
              </div>
            </section>

            <section aria-labelledby="struktur-org">
              <SectionHeading id="struktur-org" title="Struktur organisasi" href="/struktur" hrefLabel="Struktur wilayah Sultra" />
              <OrgChart />
              <p className="mt-4 text-sm text-muted">
                Jenjang kepengurusan dari pusat hingga desa/kelurahan. Situs ini memuat struktur wilayah Sulawesi
                Tenggara, Kota Kendari, dan kabupaten/kota sekitarnya.
              </p>
            </section>

            <section aria-labelledby="dpp">
              <SectionHeading id="dpp" title="Kantor Pusat DPP PSI" />
              <OfficeCard title={KANTOR_DPP.nama} alamat={KANTOR_DPP.alamat} catatan={KANTOR_DPP.catatan}>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={LINKS.psi} {...ext} className="inline-flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm font-bold text-white hover:bg-red-strong">
                    psi.id <IconExternal />
                  </a>
                  <a href={LINKS.akuPsi} {...ext} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-bold hover:border-red">
                    aku.psi.id — portal anggota <IconExternal />
                  </a>
                </div>
              </OfficeCard>
            </section>
          </div>

          <aside className="space-y-6">
            {hasLogo("vertikalWarna") || hasLogo("vertikalPutih") ? (
              <div className="flex justify-center rounded-2xl border border-border bg-surface p-6">
                <Logo variant="vertikal" tone="auto" height={180} />
              </div>
            ) : null}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-lg font-extrabold">PSI di Sulawesi Tenggara</h2>
              {dpw ? (
                <dl className="mt-3 space-y-3 text-sm">
                  {ketua?.nama ? (
                    <div>
                      <dt className="text-muted">Ketua DPW</dt>
                      <dd className="font-semibold">{ketua.nama}</dd>
                    </div>
                  ) : null}
                  {dpw.sk ? (
                    <div>
                      <dt className="text-muted">Dasar kepengurusan</dt>
                      <dd className="font-semibold">SK {dpw.sk.penerbit} No. {dpw.sk.nomor}</dd>
                    </div>
                  ) : null}
                  {dpw.anggota_tercatat ? (
                    <div>
                      <dt className="text-muted">Anggota tercatat</dt>
                      <dd className="font-semibold">
                        {formatAngka(dpw.anggota_tercatat.jumlah)} orang{" "}
                        <span className="font-normal text-muted">({dpw.anggota_tercatat.sumber})</span>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
              <Link href="/struktur" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-red-ink hover:underline">
                Lihat struktur wilayah <IconArrowRight />
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
