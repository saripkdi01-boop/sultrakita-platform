import type { Metadata } from "next";
import { getAgenda, getWilayahList, type AgendaStatus } from "@/lib/content";
import { formatHari, formatTanggal, formatTanggalWaktu } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { EmptyState } from "@/components/EmptyState";
import { IconCalendar, IconMapPin } from "@/components/icons";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Agenda",
  description: "Agenda kegiatan DPW PSI Sulawesi Tenggara dan DPD PSI Kota Kendari (waktu WITA).",
  alternates: { canonical: "/agenda" },
};

const STATUS: Record<AgendaStatus, string> = {
  terjadwal: "Terjadwal",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
  ditunda: "Ditunda",
  dibatalkan: "Dibatalkan",
};

export default function AgendaPage() {
  const agenda = getAgenda();
  const wilayah = new Map(getWilayahList().map((w) => [w.slug, w.nama]));

  return (
    <>
      <PageHeader title="Agenda" kicker="Waktu dalam WITA" crumbs={[{ label: "Agenda" }]} lead="Agenda kegiatan DPW dan DPD PSI di Kota Kendari dan Sulawesi Tenggara." />
      <Container className="py-10">
        {agenda.length ? (
          <ol className="space-y-4">
            {agenda.map((a) => (
              <li key={a.id} className="grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-[9rem_1fr]">
                <div className="rounded-xl bg-red p-3 text-center text-white">
                  <p className="text-xs font-bold uppercase tracking-widest">{formatHari(a.mulai)}</p>
                  <p className="mt-1 text-lg font-extrabold leading-tight">{formatTanggal(a.mulai)}</p>
                </div>
                <div>
                  <span className="inline-block rounded-full border border-border px-2.5 py-0.5 text-xs font-bold">{STATUS[a.status] ?? a.status}</span>
                  <h2 className="mt-2 text-lg font-extrabold">{a.judul}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <IconCalendar size={16} /> {formatTanggalWaktu(a.mulai)}
                    {a.selesai ? ` – ${formatTanggalWaktu(a.selesai)}` : ""}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                    <IconMapPin size={16} /> {a.tempat}
                    {a.wilayah && wilayah.get(a.wilayah) ? ` · ${wilayah.get(a.wilayah)}` : ""}
                  </p>
                  <p className="mt-1 text-sm">Penyelenggara: {a.penyelenggara}</p>
                  {a.keterangan ? <p className="mt-2 text-sm text-muted">{a.keterangan}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState title="Belum ada agenda yang dipublikasikan">
            Agenda kegiatan DPW/DPD akan tampil di sini setelah ada data resmi. Kami tidak menampilkan agenda tanpa sumber.
          </EmptyState>
        )}
      </Container>
    </>
  );
}
