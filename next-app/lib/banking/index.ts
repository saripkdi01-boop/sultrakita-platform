/**
 * Factory provider perbankan.
 *
 * Saat ini hanya `mock` yang tersedia. Provider nyata dipasang nanti dengan:
 *   BANKING_PROVIDER=bca        (contoh)
 *   BANKING_BCA_API_KEY=...     (dari bank — JANGAN commit)
 *   BANKING_BCA_API_SECRET=...
 *   BANKING_WEBHOOK_SECRET=...  (untuk verifikasi webhook)
 *
 * Kode pemanggil tidak berubah — cukup tambah kelas yang mengimplementasikan
 * BankingProvider dan daftarkan di sini.
 */
import type { BankingProvider } from './types';
import { MockBankingProvider } from './mock-provider';

export function getBankingProvider(): BankingProvider {
  const code = (process.env.BANKING_PROVIDER || 'mock').toLowerCase();
  if (code === 'mock') return new MockBankingProvider();
  throw new Error(
    `Provider banking "${code}" belum dikonfigurasi. ` +
      'Butuh kredensial resmi dari bank (API key/secret, endpoint, format signature webhook).',
  );
}

export type { BankingProvider };
export * from './types';
