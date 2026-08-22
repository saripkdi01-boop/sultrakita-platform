const app = require('../server');
const server = app.listen(0, async () => {
  try {
    const port = server.address().port;
    const endpoint = `http://127.0.0.1:${port}`;
    const request = await fetch(`${endpoint}/api/auth/request-otp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone: '081234567891' }) });
    const requested = await request.json();
    if (!requested.success || !requested.data?.dev_code) throw new Error('OTP dev code tidak tersedia');
    const verify = await fetch(`${endpoint}/api/auth/verify-otp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone: '081234567891', code: requested.data.dev_code, name: 'Tester SultraKita' }) });
    const verified = await verify.json();
    if (!verified.success || !verified.data?.token || !verified.data?.user?.phone_verified) throw new Error('Verifikasi OTP gagal');
    console.log(JSON.stringify({ otp_request: request.status, otp_verify: verify.status, token_present: true, phone_verified: true }));
  } finally { server.close(); }
});
