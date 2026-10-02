// Kategori bisnis — modul murni tanpa dependensi server, aman diimpor
// komponen client. Semua label dalam Bahasa Indonesia.

export const BUSINESS_CATEGORIES: Array<{ value: string; label: string }> = [
  { value: 'kuliner', label: 'Kuliner' },
  { value: 'fashion', label: 'Fesyen' },
  { value: 'kerajinan', label: 'Kerajinan' },
  { value: 'jasa', label: 'Jasa' },
  { value: 'properti', label: 'Properti' },
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'pendidikan', label: 'Pendidikan' },
  { value: 'otomotif', label: 'Otomotif' },
  { value: 'pertanian', label: 'Pertanian' },
  { value: 'pariwisata', label: 'Pariwisata' },
  { value: 'lainnya', label: 'Lainnya' },
];

export function businessCategoryLabel(value: string): string {
  return BUSINESS_CATEGORIES.find((entry) => entry.value === value)?.label ?? value;
}

export function isValidBusinessCategory(value: string): boolean {
  return BUSINESS_CATEGORIES.some((entry) => entry.value === value);
}
