'use client';

/**
 * SukiTrafficWidget — Widget homepage: statistik traffic nyata + countdown launch.
 *
 * ATURAN KERAS: semua angka dari /api/public/site-stats (data nyata).
 * Jika API gagal/kosong → tampilkan empty state jujur, JANGAN angka karangan.
 * "LiveNow" belum ada infrastruktur presence → tampil "Segera", bukan angka palsu.
 */
import { useEffect, useState } from 'react';

type Stats = {
  ok: boolean;
  registeredUsers: number | null;
  active7d: number | null;
  listings: number | null;
  liveNow: number | null;
};

function useCountdown(targetIso: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!targetIso) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetIso]);
  if (!targetIso) return null;
  const diff = new Date(targetIso).getTime() - now;
  if (Number.isNaN(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: false,
  };
}

function StatNumber({ value, label }: { value: number | null; label: string }) {
  if (value === null || value === undefined) {
    return (
      <div className="st-traffic-stat">
        <span className="st-traffic-num st-traffic-num--empty">—</span>
        <span className="st-traffic-label">{label}</span>
      </div>
    );
  }
  return (
    <div className="st-traffic-stat">
      <span className="st-traffic-num">{value.toLocaleString('id-ID')}</span>
      <span className="st-traffic-label">{label}</span>
    </div>
  );
}

export default function SukiTrafficWidget({
  launchDateIso = null,
}: {
  /** ISO date string tanggal launch; null = TBA (jangan karang tanggal). */
  launchDateIso?: string | null;
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const countdown = useCountdown(launchDateIso);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/public/site-stats', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d) setStats(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="st-traffic" aria-label="Statistik komunitas SUKI Apps">
      <div className="st-traffic-inner">
        <div className="st-traffic-head">
          <span className="st-traffic-pulse" aria-hidden="true" />
          <h2 className="st-traffic-title">Denpasar Bergerak Bersama</h2>
          <p className="st-traffic-sub">Angka nyata dari komunitas — tanpa karangan.</p>
        </div>

        <div className="st-traffic-grid">
          <StatNumber value={stats?.registeredUsers ?? null} label="Pengguna terdaftar" />
          <StatNumber value={stats?.active7d ?? null} label="Aktif 7 hari terakhir" />
          <StatNumber value={stats?.listings ?? null} label="Listing marketplace" />
          <div className="st-traffic-stat">
            <span className="st-traffic-num st-traffic-num--soon">Segera</span>
            <span className="st-traffic-label">Sedang online saat ini</span>
          </div>
        </div>

        <div className="st-traffic-countdown">
          {countdown ? (
            <>
              <span className="st-traffic-cd-label">
                {countdown.done ? 'Peluncuran tiba!' : 'Menuju peluncuran besar'}
              </span>
              <div className="st-traffic-cd-grid" role="timer" aria-live="off">
                {[
                  [countdown.days, 'Hari'],
                  [countdown.hours, 'Jam'],
                  [countdown.minutes, 'Menit'],
                  [countdown.seconds, 'Detik'],
                ].map(([v, l]) => (
                  <div key={l as string} className="st-traffic-cd-cell">
                    <span className="st-traffic-cd-num">{String(v).padStart(2, '0')}</span>
                    <span className="st-traffic-cd-unit">{l}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <span className="st-traffic-cd-label">Tanggal peluncuran segera diumumkan</span>
          )}
        </div>
      </div>
    </section>
  );
}
