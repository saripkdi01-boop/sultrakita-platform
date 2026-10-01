/**
 * SLICE-C — Admin Billing (SANDBOX).
 *
 * Halaman ini jujur: mode SANDBOX, pembayaran nyata belum dikonfigurasi.
 * Guard admin ditangani app/admin/layout.tsx (requireAdminUser).
 */
import { requireAdminUser } from '@/lib/supabase/server';
import { formatIDR } from '@/lib/billing/plans';
import { updateBillingPlan, cancelBillingOrder } from './actions';

export const dynamic = 'force-dynamic';

const ORDER_STATUSES = ['all', 'pending', 'sandbox_paid', 'sandbox_failed', 'cancelled', 'draft'] as const;

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  pending: 'Menunggu',
  sandbox_paid: 'Sandbox: Lunas (simulasi)',
  sandbox_failed: 'Sandbox: Gagal (simulasi)',
  cancelled: 'Dibatalkan',
};

function providerState(): { label: string; configured: boolean } {
  const provider = process.env.SUKI_BILLING_PROVIDER || 'sandbox';
  if (provider === 'sandbox') return { label: 'not_configured', configured: false };
  return { label: provider, configured: true };
}

export default async function AdminBillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { supabase } = await requireAdminUser();
  const params = await searchParams;
  const statusFilter = ORDER_STATUSES.includes(params.status as (typeof ORDER_STATUSES)[number])
    ? (params.status as string)
    : 'all';
  const billing = providerState();

  const [{ data: plans }, { data: orders }, { data: webhooks }] = await Promise.all([
    supabase.from('billing_plans').select('*').order('price_monthly'),
    (() => {
      let q = supabase.from('billing_orders').select('id, user_id, plan_id, amount, currency, status, provider, created_at').order('created_at', { ascending: false }).limit(50);
      if (statusFilter !== 'all') q = q.eq('status', statusFilter);
      return q;
    })(),
    supabase.from('webhook_events').select('id, provider, event_id, status, created_at').order('created_at', { ascending: false }).limit(20),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-muted-foreground">Kelola paket, order, dan webhook billing.</p>
      </header>

      {/* Banner jujur */}
      <div
        role="status"
        className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm"
      >
        <p className="font-semibold text-amber-700 dark:text-amber-300">
          Mode SANDBOX — pembayaran nyata belum dikonfigurasi (not_configured)
        </p>
        <p className="mt-1 text-amber-800/80 dark:text-amber-200/80">
          Semua order di halaman ini adalah simulasi. Tidak ada uang nyata yang ditagih
          atau dibayar. Status provider: <code className="font-mono">{billing.label}</code>.
          Jangan tampilkan status &quot;lunas&quot; ke pengguna sebagai pembayaran sungguhan.
        </p>
      </div>

      {/* Paket */}
      <section aria-labelledby="billing-plans">
        <h2 id="billing-plans" className="mb-3 text-lg font-semibold">Paket</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(plans ?? []).map((plan: { id: string; name: string; price_monthly: number; features: unknown; is_active: boolean }) => (
            <form
              key={plan.id}
              action={async (formData: FormData) => {
                'use server';
                const res = await updateBillingPlan({
                  planId: String(formData.get('planId')),
                  priceMonthly: Number(formData.get('priceMonthly')),
                  isActive: formData.get('isActive') === 'on',
                  features: String(formData.get('features')),
                });
                if (!res.ok) throw new Error(res.error);
              }}
              className="space-y-3 rounded-lg border p-4"
            >
              <input type="hidden" name="planId" value={plan.id} />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{plan.name} <span className="font-mono text-xs text-muted-foreground">({plan.id})</span></h3>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isActive" defaultChecked={plan.is_active} />
                  Aktif
                </label>
              </div>
              <label className="block text-sm">
                Harga/bulan (IDR)
                <input
                  type="number"
                  name="priceMonthly"
                  defaultValue={plan.price_monthly}
                  min={0}
                  className="mt-1 w-full rounded border px-2 py-1"
                />
                <span className="text-xs text-muted-foreground">Saat ini: {formatIDR(plan.price_monthly)} (asumsi, bukan harga final)</span>
              </label>
              <label className="block text-sm">
                Fitur (JSON)
                <textarea
                  name="features"
                  defaultValue={JSON.stringify(plan.features, null, 2)}
                  rows={6}
                  className="mt-1 w-full rounded border px-2 py-1 font-mono text-xs"
                />
              </label>
              <button type="submit" className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground">
                Simpan paket
              </button>
            </form>
          ))}
          {(!plans || plans.length === 0) && (
            <p className="text-sm text-muted-foreground">Belum ada paket. Jalankan migrasi billing.</p>
          )}
        </div>
      </section>

      {/* Order */}
      <section aria-labelledby="billing-orders">
        <h2 id="billing-orders" className="mb-3 text-lg font-semibold">Order sandbox</h2>
        <nav className="mb-3 flex flex-wrap gap-2" aria-label="Filter status">
          {ORDER_STATUSES.map((s) => (
            <a
              key={s}
              href={s === 'all' ? '/admin/billing' : `/admin/billing?status=${s}`}
              className={`rounded-full border px-3 py-1 text-xs ${statusFilter === s ? 'bg-primary text-primary-foreground' : ''}`}
            >
              {s === 'all' ? 'Semua' : (STATUS_LABEL[s] ?? s)}
            </a>
          ))}
        </nav>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Pengguna</th>
                <th className="px-3 py-2">Paket</th>
                <th className="px-3 py-2">Nominal</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Dibuat</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((o: { id: string; user_id: string; plan_id: string; amount: number; currency: string; status: string; created_at: string }) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="px-3 py-2 font-mono text-xs">{o.id.slice(0, 8)}…</td>
                  <td className="px-3 py-2 font-mono text-xs">{o.user_id.slice(0, 8)}…</td>
                  <td className="px-3 py-2">{o.plan_id}</td>
                  <td className="px-3 py-2">{formatIDR(o.amount)}</td>
                  <td className="px-3 py-2">{STATUS_LABEL[o.status] ?? o.status}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString('id-ID')}</td>
                  <td className="px-3 py-2">
                    {(o.status === 'pending' || o.status === 'draft') && (
                      <form
                        action={async () => {
                          'use server';
                          const res = await cancelBillingOrder({ orderId: o.id });
                          if (!res.ok) throw new Error(res.error);
                        }}
                      >
                        <button type="submit" className="rounded border px-2 py-1 text-xs">Batalkan</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={7} className="px-3 py-4 text-center text-muted-foreground">Belum ada order.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Webhook terakhir */}
      <section aria-labelledby="billing-webhooks">
        <h2 id="billing-webhooks" className="mb-3 text-lg font-semibold">Webhook terakhir</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-3 py-2">Event ID</th>
                <th className="px-3 py-2">Provider</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Diterima</th>
              </tr>
            </thead>
            <tbody>
              {(webhooks ?? []).map((w: { id: string; event_id: string; provider: string; status: string; created_at: string }) => (
                <tr key={w.id} className="border-b last:border-0">
                  <td className="px-3 py-2 font-mono text-xs">{w.event_id}</td>
                  <td className="px-3 py-2">{w.provider}</td>
                  <td className="px-3 py-2">{w.status}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{new Date(w.created_at).toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {(!webhooks || webhooks.length === 0) && (
                <tr><td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">Belum ada webhook.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
