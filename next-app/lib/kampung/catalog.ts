/**
 * SUKI KAMPUNG — katalog & konstanta kanonis (sumber kebenaran backend).
 *
 * Angka di sini HARUS sama dengan:
 * - supabase/migrations/20261003060000_suki_kampung.sql (seed building_catalog)
 * - ~/workspace/your_files/suki-kampung/docs/02-EKONOMI.md
 *
 * Prototipe demo di public/kampung/index.html memakai tuning yang
 * disengaja lebih cepat (interval detik) agar seru dicoba — lihat
 * tabel pemetaan di docs/09-STATUS-FITUR.md. Saat backend Fase 2
 * dibangun, tuning demo diselaraskan SATU ARAH ke angka kanonis ini.
 */

export type BuildingId =
  | 'rumah_panggung'
  | 'kebun_sayur'
  | 'pasar_pagi'
  | 'balai_warga'
  | 'warung_kopi'
  | 'taman_bermain'
  | 'perpustakaan'
  | 'ruko_umkm';

export interface BuildingSpec {
  id: BuildingId;
  name: string;
  description: string;
  unlockLevel: number;
  buildCost: number; // Koin SUKI
  yieldAmount: number; // Koin SUKI per interval
  yieldIntervalSec: number;
  footprintW: number;
  footprintH: number;
  benefit: string;
  icon: string;
  sortOrder: number;
}

export const BUILDING_CATALOG: BuildingSpec[] = [
  { id: 'rumah_panggung', name: 'Rumah Panggung', description: 'Hunian panggung khas Sultra, pondasi setiap kampung.', unlockLevel: 1, buildCost: 100, yieldAmount: 6, yieldIntervalSec: 300, footprintW: 2, footprintH: 2, benefit: 'Pondasi kampung', icon: 'home', sortOrder: 1 },
  { id: 'kebun_sayur', name: 'Kebun Sayur', description: 'Kebun sayur segar. Bonus XP quest panen +10%.', unlockLevel: 1, buildCost: 80, yieldAmount: 5, yieldIntervalSec: 300, footprintW: 2, footprintH: 2, benefit: 'Bonus XP quest panen +10%', icon: 'garden', sortOrder: 2 },
  { id: 'pasar_pagi', name: 'Pasar Pagi', description: 'Pasar pagi yang ramai. Membuka misi dagang harian.', unlockLevel: 2, buildCost: 350, yieldAmount: 22, yieldIntervalSec: 600, footprintW: 3, footprintH: 2, benefit: 'Membuka misi dagang harian', icon: 'market', sortOrder: 3 },
  { id: 'balai_warga', name: 'Balai Warga', description: 'Pusat musyawarah warga. Membuka proyek komunitas.', unlockLevel: 3, buildCost: 600, yieldAmount: 30, yieldIntervalSec: 900, footprintW: 3, footprintH: 3, benefit: 'Membuka proyek komunitas', icon: 'hall', sortOrder: 4 },
  { id: 'warung_kopi', name: 'Warung Kopi', description: 'Warung kopi tempat nongkrong. Bonus XP kuis +10%.', unlockLevel: 4, buildCost: 900, yieldAmount: 45, yieldIntervalSec: 900, footprintW: 2, footprintH: 2, benefit: 'Bonus XP kuis +10%', icon: 'cafe', sortOrder: 5 },
  { id: 'taman_bermain', name: 'Taman Bermain', description: 'Taman hijau. Cooldown quest -10% (min 1 jam).', unlockLevel: 5, buildCost: 1400, yieldAmount: 60, yieldIntervalSec: 1200, footprintW: 3, footprintH: 3, benefit: 'Cooldown quest -10%', icon: 'park', sortOrder: 6 },
  { id: 'perpustakaan', name: 'Perpustakaan Mini', description: 'Pusat ilmu kampung. Bonus XP kuis +25% (stack).', unlockLevel: 6, buildCost: 2000, yieldAmount: 75, yieldIntervalSec: 1200, footprintW: 3, footprintH: 2, benefit: 'Bonus XP kuis +25%', icon: 'library', sortOrder: 7 },
  { id: 'ruko_umkm', name: 'Ruko UMKM', description: 'Ruko usaha warga. Pendapatan tertinggi.', unlockLevel: 8, buildCost: 3200, yieldAmount: 110, yieldIntervalSec: 1800, footprintW: 3, footprintH: 3, benefit: 'Pendapatan tertinggi', icon: 'shop', sortOrder: 8 },
];

export const KAMPUNG_GRID_SIZE = 8;
export const KAMPUNG_MAX_BUILDING_LEVEL = 3;
export const KAMPUNG_STARTING_COINS = 600;

/** XP yang dibutuhkan untuk naik dari `level` ke `level + 1`. */
export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(Math.max(1, level), 1.5));
}

/** Kode referral game: namespace SKK- terpisah dari SULTRA- (ekosistem). */
export const KAMPUNG_REFERRAL_PREFIX = 'SKK-';
export const KAMPUNG_REFERRAL_CODE_RE = /^SKK-[A-Z0-9]{8}$/;

export function isValidKampungReferralCode(code: string): boolean {
  return KAMPUNG_REFERRAL_CODE_RE.test(code.trim().toUpperCase());
}
