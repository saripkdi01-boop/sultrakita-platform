// Validasi env khusus-server saat startup (Fase 1.4).
// Dipanggil sekali oleh Next.js sebelum server mulai melayani request.

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateServerEnv } = await import('./lib/env');
    validateServerEnv();
  }
}
