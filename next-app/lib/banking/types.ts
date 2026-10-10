/**
 * Lapisan abstraksi integrasi perbankan Indonesia untuk SUKI Apps.
 *
 * DESAIN — BUKAN INTEGRASI NYATA:
 * - Tidak ada koneksi ke sistem bank sungguhan.
 * - Tidak ada kredensial nyata. Satu-satunya implementasi adalah Mock.
 * - Provider nyata (BCA/Mandiri/BNI/BRI/dll) dipasang nanti via
 *   `BANKING_PROVIDER` + kredensial bank, tanpa mengubah kode pemanggil.
 *
 * Prinsip keamanan:
 * - NIK/KTP TIDAK PERNAH disimpan plain — hanya hash referensi. Verifikasi
 *   identitas asli terjadi di sisi bank (e-KYC), bukan di database SUKI.
 * - Semua aksi sensitif dicatat ke audit_events (lihat lib/security/audit.ts).
 * - Webhook bank memakai verifikasi signature fail-closed (lihat
 *   app/api/banking/webhook/route.ts).
 */

export type KprApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'verifying'
  | 'approved'
  | 'rejected'
  | 'disbursed'
  | 'cancelled';

export interface KprApplicant {
  userId: string;
  fullName: string;
  /** NIK KTP — sensitif. Jangan simpan plain; hanya diteruskan ke bank saat submit. */
  nik: string;
  phone: string;
  email?: string;
  monthlyIncome: number; // IDR / bulan
  employmentType: 'karyawan' | 'wiraswasta' | 'profesional' | 'lainnya';
}

export interface KprProperty {
  propertyId: string;
  price: number; // IDR
  downPayment: number; // IDR
  tenorYears: number; // 1–30
}

export interface KprApplicationInput {
  applicant: KprApplicant;
  property: KprProperty;
  /** Kode bank tujuan, mis. 'BCA', 'MANDIRI', 'BNI', 'BRI'. */
  bankCode: string;
}

export interface KprApplication {
  id: string;
  providerCode: string;
  /** Referensi dari bank (null untuk mock). */
  externalRef: string | null;
  status: KprApplicationStatus;
  bankCode: string;
  propertyId: string;
  price: number;
  downPayment: number;
  tenorYears: number;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityVerificationInput {
  userId: string;
  fullName: string;
  /** NIK — hanya diteruskan ke bank, tidak disimpan. */
  nik: string;
  dateOfBirth: string; // YYYY-MM-DD
  documentImageUrl?: string;
  selfieImageUrl?: string;
}

export interface IdentityVerificationResult {
  verified: boolean;
  /** Skor kepercayaan 0–100 (bila disediakan bank). */
  score?: number;
  reason?: string;
}

/**
 * Kontrak provider perbankan. Implementasi nyata wajib memenuhi interface ini
 * sehingga kode pemanggil (server actions / API routes) tidak berubah saat
 * bank asli dipasang.
 */
export interface BankingProvider {
  readonly providerCode: string;
  readonly displayName: string;
  /** true untuk mock/stub — tidak menyentuh sistem bank nyata. */
  readonly isMock: boolean;

  /** Mengajukan KPR. Tidak memindahkan uang — hanya mencatat pengajuan. */
  submitKprApplication(input: KprApplicationInput): Promise<KprApplication>;
  /** Mengecek status pengajuan ke bank. */
  getKprApplicationStatus(applicationId: string): Promise<KprApplication>;
  /** Membatalkan pengajuan yang belum final. */
  cancelKprApplication(applicationId: string, reason?: string): Promise<KprApplication>;
  /** Verifikasi identitas (e-KYC). NIK tidak disimpan oleh SUKI. */
  verifyIdentity(input: IdentityVerificationInput): Promise<IdentityVerificationResult>;
}
