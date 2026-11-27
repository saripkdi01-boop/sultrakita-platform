"use client";

import { useState } from "react";

const TOPIK = ["Pertanyaan umum", "Media / pers", "Klarifikasi informasi", "Kegiatan & agenda", "Lainnya"];

/**
 * Formulir kontak yang HANYA membuka aplikasi email pengunjung (mailto:).
 * Tidak ada data yang dikirim ke / disimpan di server situs ini.
 */
export function ContactForm({ email }: { email: string }) {
  const [topik, setTopik] = useState(TOPIK[0]);
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const disabled = !email;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const subject = `[PSI Kendari] ${topik}`;
    const body = `${pesan}\n\n— ${nama || "Pengunjung situs"}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const field = "mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-fg disabled:opacity-60";
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-5" aria-describedby="catatan-form">
      <div>
        <label htmlFor="topik" className="text-sm font-bold">Topik</label>
        <select id="topik" value={topik} onChange={(e) => setTopik(e.target.value)} className={field} disabled={disabled}>
          {TOPIK.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="nama" className="text-sm font-bold">Nama panggilan <span className="font-normal text-muted">(opsional)</span></label>
        <input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} maxLength={60} autoComplete="nickname" className={field} disabled={disabled} />
      </div>
      <div>
        <label htmlFor="pesan" className="text-sm font-bold">Pesan</label>
        <textarea id="pesan" required rows={6} maxLength={2000} value={pesan} onChange={(e) => setPesan(e.target.value)} className={field} disabled={disabled} />
      </div>
      <p id="catatan-form" className="text-xs text-muted">
        Tombol di bawah hanya membuka aplikasi email Anda dengan pesan yang sudah terisi. Tidak ada data yang dikirim
        ke atau disimpan oleh server situs ini. Mohon jangan menuliskan NIK, foto KTP, nomor HP, atau data pribadi lain.
      </p>
      {disabled ? (
        <p className="rounded-xl border border-gold bg-bg-soft p-3 text-sm">
          Alamat email resmi belum dikonfigurasi, sehingga formulir dinonaktifkan sementara.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center rounded-full bg-red px-5 py-2.5 font-extrabold text-white hover:bg-red-strong disabled:cursor-not-allowed disabled:opacity-60"
      >
        Buka aplikasi email
      </button>
    </form>
  );
}
