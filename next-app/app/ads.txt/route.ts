/**
 * /ads.txt — file otorisasi penjual AdSense (wajib untuk approval Google).
 * Diisi otomatis dari NEXT_PUBLIC_ADSENSE_CLIENT_ID; tanpa env → 404.
 */
export async function GET() {
  const clientId = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '').trim();
  if (!clientId) {
    return new Response('# AdSense belum dikonfigurasi — set NEXT_PUBLIC_ADSENSE_CLIENT_ID\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const pubId = clientId.replace(/^ca-pub-/, '');
  const body = `# SUKI Apps ads.txt — dibuat otomatis T-ADS\n` + `google.com, pub-${pubId}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
