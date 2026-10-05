import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { ADSENSE_CLIENT_ID, getPlacement } from '@/lib/ads/config';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/**
 * GET /api/ads/slot?placement=<id>
 * Resolusi provider per placement untuk AdSlot (client).
 * Publik & ringan: tanpa PII, tanpa secret (slot ID AdSense bersifat publik).
 * Bila tabel ad_placements/house_ads belum termigrasi → provider 'off' (aman).
 */
export async function GET(request: Request) {
  const placement = new URL(request.url).searchParams.get('placement') || '';
  const spec = getPlacement(placement);
  if (!spec) return NextResponse.json({ provider: 'off' }, { status: 400 });

  try {
    const supabase = await getServerSupabase();

    const { data: row, error: rowError } = await supabase
      .from('ad_placements')
      .select('provider, adsense_slot')
      .eq('placement', placement)
      .maybeSingle();
    if (rowError) throw rowError;

    const provider = row?.provider === 'adsense' || row?.provider === 'house' ? row.provider : 'off';

    if (provider === 'adsense' && ADSENSE_CLIENT_ID && row?.adsense_slot) {
      return NextResponse.json({ provider: 'adsense', adsenseSlot: row.adsense_slot });
    }

    // Fallback: house ads bila provider=house, atau adsense belum siap (tanpa client/slot).
    if (provider === 'house' || provider === 'adsense') {
      const now = new Date().toISOString();
      const { data: ad, error: adError } = await supabase
        .from('house_ads')
        .select('id, placement, title, image_url, link_url, html_snippet')
        .eq('placement', placement)
        .eq('active', true)
        .or(`starts_at.is.null,starts_at.lte.${now}`)
        .or(`ends_at.is.null,ends_at.gt.${now}`)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (adError) throw adError;
      if (ad) {
        return NextResponse.json({
          provider: 'house',
          houseAd: { id: ad.id, placement: ad.placement, title: ad.title, image_url: ad.image_url, link_url: ad.link_url, html_snippet: ad.html_snippet ?? null },
        });
      }
    }

    return NextResponse.json({ provider: 'off' });
  } catch {
    // Gagal baca config (mis. tabel belum ada) → slot nonaktif, tanpa error ke user.
    return NextResponse.json({ provider: 'off' });
  }
}
