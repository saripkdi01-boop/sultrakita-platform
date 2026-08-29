'use strict';

const apiKey = String(process.env.RESEND_API_KEY || '').trim();
const from = String(process.env.EMAIL_FROM || '').trim();
const to = String(process.env.RESEND_TEST_TO || '').trim();

if (!apiKey || !from || !to) {
  console.error('Resend smoke test membutuhkan RESEND_API_KEY, EMAIL_FROM, dan RESEND_TEST_TO.');
  process.exit(1);
}

const main = async () => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Uji email SultraKita',
      html: '<p>Pengiriman email Resend SultraKita berhasil diuji.</p>'
    })
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Resend gagal (${response.status}): ${body.slice(0, 300)}`);
  console.log(JSON.stringify({ sent: true, provider: 'resend', recipient: to.replace(/(^.).*(@.*$)/, '$1***$2'), response: JSON.parse(body) }));
};

main().catch(error => { console.error(error.message); process.exit(1); });
