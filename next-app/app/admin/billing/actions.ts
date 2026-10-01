/**
 * SLICE-C — Server actions admin untuk billing (SANDBOX).
 *
 * Semua mutasi: requireAdminUser + audit log via kontrak SLICE-A
 * (`logAuditEvent` dari '@/lib/security/audit' — file milik SLICE-A,
 * diimpor sesuai kontrak bersama; lihat SLICE-C-LOG.md).
 */
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdminUser } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/security/audit';

const UpdatePlanSchema = z.object({
  planId: z.string().min(1),
  priceMonthly: z.coerce.number().int().min(0).max(100_000_000),
  isActive: z.coerce.boolean(),
  features: z.string().max(5000), // JSON string, divalidasi manual
});

type ActionResult = { ok: true } | { ok: false; error: string };

function fail(error: unknown): ActionResult {
  return { ok: false, error: error instanceof Error ? error.message : 'Gagal memproses.' };
}

export async function updateBillingPlan(input: z.infer<typeof UpdatePlanSchema>): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAdminUser();
    const parsed = UpdatePlanSchema.safeParse(input);
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Input tidak valid.');

    let features: unknown;
    try {
      features = JSON.parse(parsed.data.features);
    } catch {
      return fail('Kolom fitur harus JSON valid.');
    }
    if (typeof features !== 'object' || features === null || Array.isArray(features)) {
      return fail('Kolom fitur harus objek JSON.');
    }

    const { error } = await supabase
      .from('billing_plans')
      .update({
        price_monthly: parsed.data.priceMonthly,
        is_active: parsed.data.isActive,
        features,
      })
      .eq('id', parsed.data.planId);
    if (error) throw error;

    await logAuditEvent(supabase, {
      actorId: user.id,
      action: 'admin.billing.plan.update',
      targetType: 'billing_plan',
      targetId: parsed.data.planId,
      metadata: { priceMonthly: parsed.data.priceMonthly, isActive: parsed.data.isActive },
    });

    revalidatePath('/admin/billing');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const CancelOrderSchema = z.object({
  orderId: z.string().uuid(),
});

export async function cancelBillingOrder(input: z.infer<typeof CancelOrderSchema>): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAdminUser();
    const parsed = CancelOrderSchema.safeParse(input);
    if (!parsed.success) return fail('Order tidak valid.');

    // Hanya order yang belum final yang bisa dibatalkan.
    const { data: order, error: fetchError } = await supabase
      .from('billing_orders')
      .select('id, status')
      .eq('id', parsed.data.orderId)
      .maybeSingle();
    if (fetchError || !order) return fail('Order tidak ditemukan.');
    if ((order as { status: string }).status !== 'pending' && (order as { status: string }).status !== 'draft') {
      return fail('Hanya order draft/pending yang bisa dibatalkan.');
    }

    const { error } = await supabase
      .from('billing_orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', parsed.data.orderId);
    if (error) throw error;

    await logAuditEvent(supabase, {
      actorId: user.id,
      action: 'admin.billing.order.cancel',
      targetType: 'billing_order',
      targetId: parsed.data.orderId,
    });

    revalidatePath('/admin/billing');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
