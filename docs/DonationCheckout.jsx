import { useEffect, useMemo, useState } from 'react';

const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export default function DonationCheckout({ campaignId = 1, apiBaseUrl = '' }) {
  const [amount, setAmount] = useState(50000);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState(() => localStorage.getItem('sultrakita:last-donation') || '');
  const [paymentStatus, setPaymentStatus] = useState('');
  const submitLabel = useMemo(() => status === 'submitting' ? 'Membuat halaman pembayaran…' : `Bayar ${formatRupiah(amount)}`, [status, amount]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('donation') !== 'success' || !transactionId) return;
    let cancelled = false;
    const check = async () => {
      const response = await fetch(`${apiBaseUrl}/api/donations/${encodeURIComponent(transactionId)}`);
      const result = await response.json();
      if (!cancelled && result.success) setPaymentStatus(result.data.payment_status);
    };
    check().catch(() => {});
    const timer = window.setInterval(() => check().catch(() => {}), 5000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [apiBaseUrl, transactionId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('submitting'); setMessage('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/donations`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ campaign_id: campaignId, amount: Number(amount), name: name || 'Hamba Allah', email: email || null, payment_method: 'qris' }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Transaksi belum dapat dibuat.');
      localStorage.setItem('sultrakita:last-donation', result.data.transaction_id);
      setTransactionId(result.data.transaction_id);
      if (!result.data.payment_url) { setStatus('pending'); setMessage(result.data.message); return; }
      setStatus('redirecting'); setMessage(`Mengalihkan ke ${result.data.provider}…`);
      window.location.assign(result.data.payment_url);
    } catch (error) { setStatus('error'); setMessage(error.message); }
  }

  return <form onSubmit={handleSubmit} className="donation-checkout" aria-busy={status === 'submitting'}>
    <label>Nominal<input type="number" min="10000" step="1000" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
    <label>Nama tampilan<input value={name} maxLength={100} onChange={(event) => setName(event.target.value)} placeholder="Hamba Allah" /></label>
    <label>Email opsional<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
    <button type="submit" disabled={status === 'submitting' || status === 'redirecting'}>{submitLabel}</button>
    <p role="status">{message}</p>
    {paymentStatus && <p>Status transaksi: <strong>{paymentStatus}</strong></p>}
  </form>;
}
