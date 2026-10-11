import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin } from '@/lib/admin/guards';

export const dynamic = 'force-dynamic';

// /admin/pengetahuan — Knowledge Base SUKI (hasil ekspor memori).
// Baca via RPC security-definer search_knowledge (tabel suki_knowledge terkunci RLS).
// Filter: ?q= (min 3 huruf), ?kategori= (filter client-side dari hasil).

interface KnowledgeRow {
  doc_key: string;
  title: string;
  category: string;
  snippet: string;
  updated_at: string;
}

const KATEGORI = ['semua', 'voice-note', 'dokumentasi', 'tentang', 'proyek', 'bot'] as const;

function formatTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });
  } catch {
    return iso;
  }
}

function kategoriLabel(k: string): string {
  const map: Record<string, string> = {
    'voice-note': '🎙️ Voice Note',
    'dokumentasi': '📄 Dokumentasi',
    'tentang': 'ℹ️ Tentang',
    'proyek': '📁 Proyek',
    'bot': '🤖 Bot',
  };
  return map[k] ?? `📦 ${k}`;
}

export default async function AdminPengetahuanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string }>;
}) {
  try {
    await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/pengetahuan');
  }

  const { q, kategori } = await searchParams;
  const query_text = (q ?? '').trim().slice(0, 80);
  const katFilter = (kategori ?? 'semua').trim();

  let rows: KnowledgeRow[] = [];
  let error: string | null = null;

  if (query_text.length >= 3) {
    try {
      const supabase = await getServerSupabase();
      const { data, error: rpcError } = await supabase.rpc('search_knowledge', {
        q: query_text,
        batas: 20,
      });
      if (rpcError) error = rpcError.message;
      else rows = (data ?? []) as KnowledgeRow[];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Gagal mencari.';
    }
  }

  const filtered =
    katFilter === 'semua' ? rows : rows.filter((r) => r.category === katFilter);

  const qParam = query_text ? `q=${encodeURIComponent(query_text)}&` : '';

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="text-2xl font-bold">📚 Pengetahuan SUKI</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Arsip memori & dokumentasi Suki Apps — tersinkron dari Penyimpanan Pintar.
        </p>

        <form method="get" className="mt-4 flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query_text}
            placeholder="Cari dokumen… (min 3 huruf)"
            minLength={3}
            maxLength={80}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 dark:border-white/10 dark:bg-white/5"
          />
          {katFilter !== 'semua' && (
            <input type="hidden" name="kategori" value={katFilter} />
          )}
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            Cari
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {KATEGORI.map((k) => (
            <Link
              key={k}
              href={`/admin/pengetahuan?${qParam}kategori=${k}`}
              className={`rounded-full px-3 py-1 text-sm ${
                katFilter === k
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300'
              }`}
            >
              {k === 'semua' ? '📚 Semua' : kategoriLabel(k)}
            </Link>
          ))}
        </div>

        <div className="mt-6">
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
              Error: {error}
            </p>
          )}
          {!error && query_text.length < 3 && (
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-white/5 dark:text-gray-400">
              Ketik minimal 3 huruf lalu tekan Cari untuk mencari arsip pengetahuan.
            </p>
          )}
          {!error && query_text.length >= 3 && filtered.length === 0 && (
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-white/5 dark:text-gray-400">
              Tidak ada dokumen yang cocok untuk “{query_text}”.
            </p>
          )}
          <div className="space-y-3">
            {filtered.map((r) => (
              <article
                key={r.doc_key}
                className="rounded-xl border border-gray-200 p-4 dark:border-white/10"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {kategoriLabel(r.category)}
                  </span>
                  <time className="text-xs text-gray-500">{formatTime(r.updated_at)}</time>
                </div>
                <h2 className="mt-2 font-semibold">{r.title}</h2>
                <p className="mt-1 line-clamp-3 whitespace-pre-line text-sm text-gray-600 dark:text-gray-400">
                  {r.snippet}
                </p>
                <p className="mt-2 text-xs text-gray-400">{r.doc_key}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
