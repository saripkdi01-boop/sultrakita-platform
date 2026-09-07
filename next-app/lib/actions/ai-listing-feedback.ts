'use server';

import { z } from 'zod';
import { requireServerUser } from '@/lib/supabase/server';

const feedbackSchema = z.object({
  generationId: z.string().uuid(),
  helpful: z.boolean(),
  comment: z.string().trim().max(1000).optional().default(''),
  correctedFields: z.array(z.enum(['title', 'description', 'category', 'price', 'tags'])).max(5).default([]),
});

export async function submitAiListingFeedback(input: unknown) {
  try {
    const parsed = feedbackSchema.parse(input);
    const { supabase, user } = await requireServerUser();
    const { error } = await supabase.from('ai_listing_feedback').insert({
      seller_id: user.id,
      generation_id: parsed.generationId,
      helpful: parsed.helpful,
      comment: parsed.comment || null,
      corrected_fields: parsed.correctedFields,
    });
    if (error) throw error;
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    if (message.includes('duplicate') || message.includes('unique')) {
      return { ok: true as const };
    }
    return { ok: false as const, error: 'Feedback belum dapat disimpan. Kamu tetap dapat melanjutkan secara manual.' };
  }
}
