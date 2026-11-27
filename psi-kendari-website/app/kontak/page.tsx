import type { Metadata } from "next";
import { KANTOR_DPD_KENDARI, KANTOR_DPP, KANTOR_DPW_SULTRA, LINKS, SITE, SOCIAL_LINKS } from "@/config/site";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { OfficeCard } from "@/components/OfficeCard";
import { ContactForm } from "@/components/ContactForm";
import { IconExternal } from "@/components/icons";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Alamat kantor DPP PSI (Jakarta), DPW PSI Sulawesi Tenggara (Kendari), dan DPD PSI Kota Kendari.",
  alternates: { canonical: "/kontak" },
};

export default function KontakPage() {
  return (
    <>
      <PageHeader title="Kontak" crumbs={[{ label: "Kontak" }]} lead="Alamat kantor dan kanal resmi PSI. Pendaftaran anggota hanya melalui psi.id dan aku.psi.id." />
      <Container className="py-10">
        <section aria-labelledby="kantor">
          <SectionHeading id="kantor" title="Kantor" />
          <div className="grid gap-4 md:grid-cols-3">
            <OfficeCard title={KANTOR_DPP.nama} alamat={KANTOR_DPP.alamat} catatan={KANTOR_DPP.catatan} />
            <OfficeCard title={KANTOR_DPW_SULTRA.nama} alamat={KANTOR_DPW_SULTRA.alamat} catatan={KANTOR_DPW_SULTRA.catatan} />
            <OfficeCard title={KANTOR_DPD_KENDARI.nama} alamat={KANTOR_DPD_KENDARI.alamat} catatan={KANTOR_DPD_KENDARI.catatan} />
          </div>
        </section>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <section aria-labelledby="pesan-judul">
            <SectionHeading id="pesan-judul" title="Kirim pesan" />
            <ContactForm email={SITE.contactEmail} />
          </section>
          <section aria-labelledby="kanal">
            <SectionHeading id="kanal" title="Kanal resmi" />
            <ul className="space-y-3">
              {[
                { label: "psi.id — situs resmi DPP PSI", href: LINKS.psi },
                { label: "Daftar Anggota (psi.id)", href: LINKS.daftarAnggota },
                { label: "aku.psi.id — portal anggota", href: LINKS.akuPsi },
                { label: "Daftar Relawan (psi.id)", href: LINKS.relawan },
                ...SOCIAL_LINKS,
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 font-semibold hover:border-red hover:text-red-ink">
                    {l.label} <IconExternal />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}
