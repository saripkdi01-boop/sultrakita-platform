// Helper format tampilan properti (dipakai PropertyCard & halaman detail).
// Semua angka berasal dari data listing nyata; tidak ada nilai yang dikarang.

export function rupiah(value: number): string {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 'Rp 0';
  return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(numeric))}`;
}

/** true bila listing adalah jual (bukan sewa per hari/bulan/tahun). */
export function isForSale(priceType?: string | null): boolean {
  return !priceType || priceType === 'total';
}

/**
 * Label "Rp X/m²" — hanya untuk listing jual dengan luas tanah/bangunan > 0.
 * Prioritas luas tanah (pola portal properti), fallback luas bangunan.
 * Mengembalikan null bila tidak bisa dihitung (jujur: tidak ditampilkan).
 */
export function pricePerSqm(
  price: number,
  landAreaSqm?: number | null,
  buildingAreaSqm?: number | null,
  priceType?: string | null,
): string | null {
  if (!isForSale(priceType)) return null;
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) return null;
  const land = Number(landAreaSqm);
  const building = Number(buildingAreaSqm);
  const area = land > 0 ? land : building > 0 ? building : 0;
  if (area <= 0) return null;
  return `${rupiah(numericPrice / area)}/m²`;
}

/**
 * Estimasi cicilan KPR per bulan dengan rumus anuitas standar:
 *   M = P * r(1+r)^n / ((1+r)^n - 1)
 * Mengembalikan null bila input tidak valid.
 */
export function estimateMonthlyInstallment(
  price: number,
  downPaymentPct: number,
  annualRatePct: number,
  years: number,
): { monthly: number; principal: number; downPayment: number; totalInterest: number; totalPaid: number; months: number } | null {
  const p = Number(price);
  const dpPct = Math.min(95, Math.max(0, Number(downPaymentPct)));
  const ratePct = Math.min(30, Math.max(0, Number(annualRatePct)));
  const months = Math.min(360, Math.max(1, Math.round(Number(years) * 12)));
  if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(dpPct) || !Number.isFinite(ratePct) || !Number.isFinite(months)) return null;
  const downPayment = p * (dpPct / 100);
  const principal = p - downPayment;
  if (principal <= 0) return null;
  const r = ratePct / 100 / 12;
  const monthly = r <= 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPaid = monthly * months;
  return { monthly, principal, downPayment, totalInterest: totalPaid - principal, totalPaid, months };
}
