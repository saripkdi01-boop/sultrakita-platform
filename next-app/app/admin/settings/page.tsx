import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin } from '@/lib/admin/guards';
import { MaintenanceToggle, SettingEditor, NewSettingForm } from './SettingForms';

export const dynamic = 'force-dynamic';

const PROTECTED_KEYS = ['maintenance_mode', 'signup_enabled'];

interface SettingRow {
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string | null;
}

export default async function AdminSettingsPage() {
  try {
    await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/settings');
  }

  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, description, updated_at')
    .order('key', { ascending: true });
  const rows = (data ?? []) as SettingRow[];
  const maintenance = rows.find((r) => r.key === 'maintenance_mode');
  const maintenanceOn = maintenance?.value === true;
  const others = rows.filter((r) => r.key !== 'maintenance_mode');

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Pengaturan situs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
            Feature flags & konfigurasi platform. Setiap perubahan divalidasi, dicatat di audit trail, dan berlaku ≤60 detik (cache flag).
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <MaintenanceToggle current={maintenanceOn} />

          <NewSettingForm />

          <div>
            <h2 className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">
              Semua pengaturan {error ? '' : `(${rows.length})`}
            </h2>
            {error && (
              <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                Gagal memuat pengaturan: {error.message}. Kemungkinan tabel <code>site_settings</code> belum termigrasi di database ini.
              </p>
            )}
            {!error && rows.length === 0 && (
              <p className="rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-10 text-center text-sm text-[#78948c] dark:border-white/10 dark:bg-white/5">
                Belum ada data — tampil apa adanya. Tambahkan pengaturan pertama di atas.
              </p>
            )}
            <div className="grid gap-4 lg:grid-cols-2">
              {others.map((row) => (
                <SettingEditor
                  key={row.key}
                  rowKey={row.key}
                  value={row.value}
                  description={row.description}
                  protectedKey={PROTECTED_KEYS.includes(row.key)}
                />
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-[#78948c]">
              Nilai disimpan sebagai JSON. Contoh: <code>true</code>, <code>"teks pengumuman"</code>, <code>123</code>, <code>{'{ "a": 1 }'}</code>.
            </p>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
