import { readFile } from 'fs/promises';
import path from 'path';
import { AppLayout } from '@/components/layout/AppLayout';
import { requireRole, redirectToLogin } from '@/lib/admin/guards';

export const dynamic = 'force-dynamic';

// /admin/launch — checklist verifikasi pra-launch.
// Isi checklist DIBACA DINAMIS dari next-app/data/launch-checklist.json
// (TIDAK di-hardcode di kode). Koordinator mengisi hasil verifikasi final
// pada tahap assembly/T7; halaman ini me-render apa pun isi JSON-nya,
// termasuk empty state jujur bila belum ada item.

type ItemStatus = 'lolos' | 'gagal' | 'belum_diperiksa';

interface ChecklistItem {
  id: string;
  title: string;
  status: ItemStatus;
  evidence: string | null;
  checked_at: string | null;
  checked_by: string | null;
}

interface ChecklistCategory {
  id: string;
  title: string;
  description?: string | null;
  items: ChecklistItem[];
}

interface ChecklistData {
  version?: number;
  updated_at?: string | null;
  categories: ChecklistCategory[];
}

const EMPTY: ChecklistData = { categories: [] };

async function loadChecklist(): Promise<{ data: ChecklistData; error: string | null; source: string }> {
  const filePath = path.join(process.cwd(), 'data', 'launch-checklist.json');
  const source = `file next-app/data/launch-checklist.json (dibaca server-side saat halaman dibuka)`;
  try {
    const raw = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as ChecklistData;
    if (!Array.isArray(parsed.categories)) return { data: EMPTY, error: 'Format JSON tidak valid: "categories" harus array.', source };
    return { data: parsed, error: null, source };
  } catch (err) {
    return { data: EMPTY, error: err instanceof Error ? err.message : 'Gagal membaca file checklist.', source };
  }
}

const STATUS_META: Record<ItemStatus, { label: string; cls: string }> = {
  lolos: { label: 'LOLOS', cls: 'bg-[#e9f7f2] text-[#146355]' },
  gagal: { label: 'GAGAL', cls: 'bg-red-50 text-red-700' },
  belum_diperiksa: { label: 'BELUM DIPERIKSA', cls: 'bg-amber-50 text-amber-800' },
};

function statusOf(raw: unknown): ItemStatus {
  return raw === 'lolos' || raw === 'gagal' ? raw : 'belum_diperiksa';
}

export default async function AdminLaunchPage() {
  try {
    await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/launch');
  }

  const { data, error, source } = await loadChecklist();
  const items = data.categories.flatMap((c) => c.items ?? []);
  const counts: Record<ItemStatus, number> = { lolos: 0, gagal: 0, belum_diperiksa: 0 };
  for (const item of items) counts[statusOf(item.status)] += 1;

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Checklist launch</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
            Daftar verifikasi pra-launch. Status setiap item dibaca dinamis dari file JSON — halaman ini tidak
            meng-hardcode isi checklist.
          </p>
          {items.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {(Object.keys(counts) as ItemStatus[]).map((s) => (
                <span key={s} className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${STATUS_META[s].cls}`}>
                  {STATUS_META[s].label}: {counts[s]}
                </span>
              ))}
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold text-white">
                Total: {items.length}
              </span>
            </div>
          )}
        </section>

        {error && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Gagal memuat checklist: {error}
          </div>
        )}

        {!error && items.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-10 text-center dark:border-white/10 dark:bg-white/5">
            <p className="text-lg font-extrabold text-[#123f38] dark:text-white">Checklist belum diisi</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#78948c]">
              File <code>next-app/data/launch-checklist.json</code> belum memuat item verifikasi. Tampil apa adanya —
              koordinator akan mengisi hasil verifikasi final pada tahap assembly/T7.
            </p>
          </div>
        )}

        {!error && data.categories.length > 0 && (
          <div className="mt-8 space-y-8">
            {data.categories.map((cat) => (
              <section key={cat.id} aria-label={cat.title}>
                <h2 className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">{cat.title}</h2>
                {cat.description && <p className="mb-3 text-sm text-[#78948c]">{cat.description}</p>}
                {(cat.items ?? []).length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-[#dcebe5] p-6 text-center text-sm text-[#78948c] dark:border-white/10">
                    Kategori ini belum memiliki item.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {(cat.items ?? []).map((item) => {
                      const st = statusOf(item.status);
                      const meta = STATUS_META[st];
                      return (
                        <li
                          key={item.id}
                          className="rounded-3xl border border-[#dcebe5] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10231f]"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="font-bold text-[#123f38] dark:text-white">{item.title}</h3>
                            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${meta.cls}`}>{meta.label}</span>
                          </div>
                          {item.evidence && (
                            <p className="mt-2 text-sm leading-6 text-[#55736b] dark:text-white/70">
                              <span className="font-bold text-[#123f38] dark:text-white">Bukti:</span> {item.evidence}
                            </p>
                          )}
                          <p className="mt-2 text-[11px] text-[#78948c]">
                            {item.checked_by ? `Diperiksa oleh ${item.checked_by}` : 'Belum ada pemeriksa'}
                            {item.checked_at ? ` · ${item.checked_at}` : ''}
                            <span className="font-mono"> · id: {item.id}</span>
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-[#78948c]">
          Sumber: {source}
          {data.updated_at ? ` · diperbarui ${data.updated_at}` : ''}
        </p>
      </main>
    </AppLayout>
  );
}
