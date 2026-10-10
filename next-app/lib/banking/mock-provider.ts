/**
 * MockBankingProvider — implementasi stub untuk pengembangan & pengujian.
 *
 * - 100% in-memory. Tidak ada HTTP keluar, tidak ada kredensial, tidak ada
 *   uang yang bergerak.
 * - Mensimulasikan alur realistis: submitted -> verifying -> approved/rejected.
 * - Deterministik untuk pengujian: keputusan memakai aturan sederhana
 *   (bukan acak) agar smoke test dapat diulang.
 *
 * JANGAN dipakai di production untuk pengajuan KPR nyata.
 */

import { randomUUID } from 'node:crypto';
import type {
  BankingProvider,
  IdentityVerificationInput,
  IdentityVerificationResult,
  KprApplication,
  KprApplicationInput,
  KprApplicationStatus,
} from './types';

const now = () => new Date().toISOString();

export class MockBankingProvider implements BankingProvider {
  readonly providerCode = 'mock';
  readonly displayName = 'Bank Mock (pengembangan)';
  readonly isMock = true;

  private store = new Map<string, KprApplication>();

  /**
   * Aturan keputusan mock (deterministik, untuk pengujian):
   * - DP >= 30% dan cicilan estimasi <= 35% penghasilan -> approved
   * - Selain itu -> verifying (menunggu "analis bank"), lalu tetap verifying
   *   sampai dibatalkan — mensimulasikan SLA bank tanpa mengarang hasil.
   */
  private decide(input: KprApplicationInput): KprApplicationStatus {
    const { property, applicant } = input;
    if (property.tenorYears < 1 || property.tenorYears > 30) return 'rejected';
    if (applicant.monthlyIncome <= 0 || property.price <= 0) return 'rejected';
    const dpRatio = property.downPayment / property.price;
    const loan = property.price - property.downPayment;
    // Estimasi cicilan flat 8%/tahun (mock — bukan penawaran bank nyata).
    const monthlyRate = 0.08 / 12;
    const n = property.tenorYears * 12;
    const installment = (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
    if (dpRatio >= 0.3 && installment <= applicant.monthlyIncome * 0.35) return 'approved';
    return 'verifying';
  }

  async submitKprApplication(input: KprApplicationInput): Promise<KprApplication> {
    if (!input.applicant.nik || input.applicant.nik.length < 8) {
      throw new Error('NIK tidak valid.');
    }
    const app: KprApplication = {
      id: randomUUID(),
      providerCode: this.providerCode,
      externalRef: null,
      status: 'submitted',
      bankCode: input.bankCode,
      propertyId: input.property.propertyId,
      price: input.property.price,
      downPayment: input.property.downPayment,
      tenorYears: input.property.tenorYears,
      createdAt: now(),
      updatedAt: now(),
    };
    this.store.set(app.id, app);
    // Simulasi pemrosesan bank: langsung tentukan hasil mock.
    const decided: KprApplication = { ...app, status: this.decide(input), updatedAt: now() };
    this.store.set(app.id, decided);
    // NIK tidak disimpan di mana pun — hanya dipakai untuk validasi format.
    return decided;
  }

  async getKprApplicationStatus(applicationId: string): Promise<KprApplication> {
    const app = this.store.get(applicationId);
    if (!app) throw new Error('Pengajuan tidak ditemukan.');
    return app;
  }

  async cancelKprApplication(applicationId: string, reason?: string): Promise<KprApplication> {
    const app = this.store.get(applicationId);
    if (!app) throw new Error('Pengajuan tidak ditemukan.');
    if (app.status === 'disbursed' || app.status === 'cancelled') {
      throw new Error(`Pengajuan berstatus ${app.status} tidak dapat dibatalkan.`);
    }
    const cancelled: KprApplication = {
      ...app,
      status: 'cancelled',
      updatedAt: now(),
    };
    void reason;
    this.store.set(applicationId, cancelled);
    return cancelled;
  }

  async verifyIdentity(input: IdentityVerificationInput): Promise<IdentityVerificationResult> {
    // Mock e-KYC: lolos bila NIK 16 digit dan nama terisi.
    // Bank nyata akan memverifikasi ke Dukcapil — mock tidak mengarang hasil Dukcapil.
    const nikOk = /^\d{16}$/.test(input.nik.replace(/\D/g, ''));
    const nameOk = input.fullName.trim().length >= 3;
    if (nikOk && nameOk) {
      return { verified: true, score: 95, reason: 'mock: format dokumen valid' };
    }
    return { verified: false, score: 20, reason: 'mock: format NIK/nama tidak valid' };
  }
}
