// Waktu relatif Bahasa Indonesia untuk feed sosial.
// menit -> jam -> hari -> minggu; selebihnya tanggal lokal singkat (mis. 12 Sep 2026).
// Dipakai feed postingan dan thread komentar (satu sumber kebenaran).

export function relativeTime(iso: string, now = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = now - then;
  if (diffMs < 0) return 'baru saja';
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes} mnt lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} mgg lalu`;
  return new Date(then).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
