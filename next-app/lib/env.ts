import { z } from 'zod';

// Fase 1.4: validasi environment khusus-server saat startup.
// - Wajib (aplikasi tidak bisa jalan tanpanya): throw dengan pesan jelas.
// - Opsional (fitur terkait): console.warn sekali — fitur jangan "mati diam-diam".

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL harus berupa URL valid.'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY wajib diisi.'),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUKI_WA_NUMBER: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().min(1).optional(),
  R2_ENDPOINT: z.string().min(1).optional(),
  R2_BUCKET: z.string().min(1).optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  N8N_WHATSAPP_WEBHOOK_URL: z.string().url().optional(),
  N8N_WEBHOOK_SECRET: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  SUKI_BILLING_PROVIDER: z.string().min(1).optional(),
  SUKI_BILLING_WEBHOOK_SECRET: z.string().min(1).optional(),
  SUKI_BILLING_CURRENCY: z.string().min(1).optional(),
  // --- Billing MIDTRANS (server-only; JANGAN pernah prefix NEXT_PUBLIC_) ---
  MIDTRANS_SERVER_KEY: z.string().min(1).optional(),
  MIDTRANS_CLIENT_KEY: z.string().min(1).optional(),
  // 'true' = pakai endpoint production Midtrans. Default (kosong/lainnya) = sandbox.
  MIDTRANS_IS_PRODUCTION: z.string().optional(),
  // 'true' = izinkan kunci PRODUCTION dipakai. Tanpa ini, scaffold menolak kunci live.
  SUKI_BILLING_ALLOW_LIVE: z.string().optional(),
  NEXT_PUBLIC_CHAT_WS_URL: z.string().min(1).optional(),
  FEED_CURSOR_SECRET: z.string().min(1).optional(),
  ALLOW_DEMO_DATA: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

// Fitur -> env yang dibutuhkannya, untuk peringatan yang bisa ditindaklanjuti.
const featureRequirements: Array<{ feature: string; vars: string[]; hint: string }> = [
  { feature: 'Listing publik & operasi admin', vars: ['SUPABASE_SERVICE_ROLE_KEY'], hint: 'API publik /api/listings dan operasi admin memakai service role.' },
  { feature: 'Email transaksional', vars: ['RESEND_API_KEY', 'RESEND_FROM_EMAIL'], hint: 'Notifikasi email via Resend tidak akan terkirim.' },
  { feature: 'Upload berkas', vars: ['R2_ENDPOINT', 'R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'], hint: 'Upload avatar/dokumen ke R2 tidak akan berfungsi.' },
  { feature: 'Fitur AI (fokus foto, dsb.)', vars: ['GEMINI_API_KEY'], hint: 'Fitur AI dinonaktifkan; fallback lokal dipakai bila ada.' },
  { feature: 'OTP WhatsApp', vars: ['N8N_WHATSAPP_WEBHOOK_URL', 'N8N_WEBHOOK_SECRET'], hint: 'OTP WhatsApp via webhook n8n tidak akan terkirim.' },
  { feature: 'Rate limit lintas instance', vars: ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'], hint: 'Rate limiting memakai memori per-instance (tidak sinkron antar instance).' },
  { feature: 'Billing/monetisasi', vars: ['SUKI_BILLING_PROVIDER', 'SUKI_BILLING_WEBHOOK_SECRET'], hint: 'Mode sandbox; pembayaran nyata berstatus not_configured.' },
  { feature: 'Billing Midtrans (nyata)', vars: ['MIDTRANS_SERVER_KEY'], hint: 'SUKI_BILLING_PROVIDER=midtrans akan 503 not_configured; butuh juga MIDTRANS_IS_PRODUCTION + SUKI_BILLING_ALLOW_LIVE=true untuk production.' },
];

let validated = false;

export function validateServerEnv(): ServerEnv {
  if (validated) return process.env as unknown as ServerEnv;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`[env] Konfigurasi server tidak valid — ${details} Periksa environment variables di Vercel.`);
  }
  for (const { feature, vars, hint } of featureRequirements) {
    const missing = vars.filter((name) => !process.env[name]);
    if (missing.length > 0) {
      console.warn(`[env] ${missing.join(', ')} belum diset — ${feature} nonaktif. ${hint}`);
    }
  }
  if (process.env.ALLOW_DEMO_DATA === 'true' && process.env.NODE_ENV === 'production') {
    console.warn('[env] ALLOW_DEMO_DATA=true di production — data contoh berlabel boleh muncul. Pastikan ini disengaja.');
  }
  validated = true;
  return parsed.data;
}
