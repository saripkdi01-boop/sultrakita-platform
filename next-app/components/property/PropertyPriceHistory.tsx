import { TrendingDown, TrendingUp, History } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';

function rupiah(value: number) {
  return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value)}`;
}

// Riwayat harga ala Zillow. ANTI-FABRIKASI: section hanya tampil bila tabel
// property_price_history ADA dan punya baris. Bila tabel belum ada (migrasi
// belum dijalankan) atau kosong → section disembunyikan total, bukan diarang.
export default async function PropertyPriceHistory({ propertyId }: { propertyId: string }) {
  let rows: { old_price: number; new_price: number; changed_at: string }[] = [];
  try {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from('property_price_history')
      .select('old_price,new_price,changed_at')
      .eq('property_id', propertyId)
      .order('changed_at', { ascending: false })
      .limit(10);
    if (error) return null; // tabel belum ada / RLS → sembunyikan, jangan error
    rows = (data || []) as typeof rows;
  } catch {
    return null;
  }
  if (rows.length === 0) return null;

  return (
    <section className="mt-6 rounded-3xl border border-sultra-mint bg-white p-6 dark:border-sultra-forest/30 dark:bg-sultra-dark" aria-labelledby="price-history-title">
      <div className="flex items-center gap-2 text-sultra-forest dark:text-sultra-sand">
        <History size={18} aria-hidden="true" />
        <h2 id="price-history-title" className="text-lg font-bold">Riwayat harga</h2>
      </div>
      <p className="mt-1 text-xs text-slate-500">Perubahan harga tercatat dari data listing ini.</p>
      <ol className="mt-4 space-y-3">
        {rows.map((row, i) => {
          const down = Number(row.new_price) < Number(row.old_price);
          const pct = Number(row.old_price) > 0
            ? Math.abs((Number(row.new_price) - Number(row.old_price)) / Number(row.old_price)) * 100
            : 0;
          return (
            <li key={i} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {rupiah(Number(row.old_price))} → {rupiah(Number(row.new_price))}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {new Date(row.changed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${down ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
                {down ? <TrendingDown size={13} aria-hidden="true" /> : <TrendingUp size={13} aria-hidden="true" />}
                {pct.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
