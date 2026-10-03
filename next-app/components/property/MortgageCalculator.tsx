'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { estimateMonthlyInstallment, isForSale, rupiah } from '@/lib/property-format';

type Props = {
  /** Harga listing (Rp), dipakai sebagai harga properti awal. */
  price: number;
  /** true bila seller menandai listing bisa KPR. */
  canKpr?: boolean;
  priceType?: string | null;
};

/**
 * Simulasi KPR ala portal properti (pola Zillow / Rumah123 / 99.co):
 * harga properti (dari listing), uang muka %, suku bunga tahunan %, tenor tahun
 * -> estimasi cicilan per bulan + rincian. Implementasi orisinal, murni hitungan
 * lokal tanpa data bank sungguhan, selalu disertai disclaimer estimasi.
 */
export default function MortgageCalculator({ price, canKpr, priceType }: Props) {
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(15);
  // Harga bisa diubah user untuk simulasi skema lain — default dari listing.
  // Murni input user, bukan data yang dikarang.
  const [priceInput, setPriceInput] = useState<number>(Number.isFinite(price) && price > 0 ? Math.round(price) : 0);
  useEffect(() => {
    setPriceInput(Number.isFinite(price) && price > 0 ? Math.round(price) : 0);
  }, [price]);

  const calc = useMemo(() => estimateMonthlyInstallment(priceInput, downPct, rate, years), [priceInput, downPct, rate, years]);
  if (!isForSale(priceType)) return null;

  const inputNumber = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-sultra-teal dark:border-slate-700 dark:bg-slate-900 dark:text-white';
  const range = 'h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-sultra-teal dark:bg-slate-700';

  return (
    <section aria-labelledby="kpr-calc-title" className="mt-6 rounded-3xl border border-sultra-mint bg-white p-5 sm:p-6 dark:border-sultra-forest/30 dark:bg-sultra-dark">
      <div className="flex items-center gap-2 text-sultra-forest dark:text-sultra-sand">
        <Calculator size={18} aria-hidden="true" />
        <h2 id="kpr-calc-title" className="text-lg font-bold">Simulasi KPR</h2>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {canKpr ? 'Listing ini ditandai Bisa KPR oleh penjual. ' : ''}
        Atur skema di bawah untuk melihat perkiraan cicilan properti ini.
      </p>

      <div className="mt-4">
        <label htmlFor="kpr-price" className="text-xs font-bold text-slate-600 dark:text-slate-300">Harga properti (Rp)</label>
        <input
          id="kpr-price"
          type="number"
          min={0}
          step={1000000}
          value={priceInput || ''}
          onChange={e => setPriceInput(Math.max(0, Number(e.target.value) || 0))}
          className={`${inputNumber} mt-1 max-w-xs`}
          inputMode="numeric"
        />
        <p className="mt-1 text-[11px] text-slate-500">Default dari harga listing — ubah untuk simulasi skema lain.</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="kpr-dp" className="text-xs font-bold text-slate-600 dark:text-slate-300">Uang muka (DP)</label>
            <output htmlFor="kpr-dp" className="text-sm font-black text-sultra-forest dark:text-sultra-sand">{downPct}%</output>
          </div>
          <input id="kpr-dp" type="range" min={0} max={90} step={5} value={downPct} onChange={e => setDownPct(Number(e.target.value))} className={range} aria-describedby="kpr-dp-value" />
          <p id="kpr-dp-value" className="mt-1 text-[11px] text-slate-500">{calc ? rupiah(calc.downPayment) : '—'}</p>
        </div>
        <div>
          <label htmlFor="kpr-rate" className="text-xs font-bold text-slate-600 dark:text-slate-300">Suku bunga per tahun</label>
          <div className="mt-1 flex items-center gap-2">
            <input id="kpr-rate" type="number" min={0} max={30} step={0.25} value={rate} onChange={e => setRate(Number(e.target.value))} className={inputNumber} inputMode="decimal" />
            <span className="text-sm font-bold text-slate-500">%</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="kpr-tenor" className="text-xs font-bold text-slate-600 dark:text-slate-300">Tenor</label>
            <output htmlFor="kpr-tenor" className="text-sm font-black text-sultra-forest dark:text-sultra-sand">{years} tahun</output>
          </div>
          <input id="kpr-tenor" type="range" min={5} max={30} step={1} value={years} onChange={e => setYears(Number(e.target.value))} className={range} />
          <p className="mt-1 text-[11px] text-slate-500">{calc ? `${calc.months} bulan` : '—'}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-sultra-mint/40 p-4 dark:bg-sultra-forest/20" aria-live="polite">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-sultra-teal">Estimasi cicilan per bulan</p>
        <p className="mt-1 text-2xl font-black tracking-tight text-sultra-forest sm:text-3xl dark:text-sultra-sand">
          {calc ? rupiah(calc.monthly) : '—'}
        </p>
        {calc && (
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
            <div><dt className="font-semibold text-slate-500 dark:text-slate-400">Pokok pinjaman</dt><dd className="mt-0.5 font-bold text-slate-800 dark:text-slate-100">{rupiah(calc.principal)}</dd></div>
            <div><dt className="font-semibold text-slate-500 dark:text-slate-400">Total bunga</dt><dd className="mt-0.5 font-bold text-slate-800 dark:text-slate-100">{rupiah(calc.totalInterest)}</dd></div>
            <div><dt className="font-semibold text-slate-500 dark:text-slate-400">Total dibayar</dt><dd className="mt-0.5 font-bold text-slate-800 dark:text-slate-100">{rupiah(calc.totalPaid)}</dd></div>
            <div><dt className="font-semibold text-slate-500 dark:text-slate-400">Harga properti</dt><dd className="mt-0.5 font-bold text-slate-800 dark:text-slate-100">{rupiah(priceInput)}</dd></div>
          </dl>
        )}
      </div>

      <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-5 text-slate-400 dark:text-slate-500">
        <Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
        Angka di atas adalah estimasi kasar (anuitas, bunga tetap). Suku bunga, biaya provisi,
        asuransi, dan ketentuan aktual mengikuti kebijakan bank pilihan Anda.
      </p>
    </section>
  );
}
