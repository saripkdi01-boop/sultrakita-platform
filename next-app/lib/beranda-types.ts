// Tipe + helper murni untuk data /beranda — aman diimpor komponen client
// (tidak menyentuh next/headers atau Supabase server).
export type BerandaProduct = { id: string; title: string; seller: string; place: string; tag: string; tone: string };
export type BerandaEvent = { id: string; date: string; month: string; title: string; place: string; type: string };

export function formatEventMonth(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', { month: 'short' }).replace('.', '').toUpperCase();
}
