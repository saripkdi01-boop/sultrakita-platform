'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  BadgeCheck, ChevronDown, Copy, Gift, Medal, MousePointerClick,
  QrCode, RefreshCw, Share2, Sparkles, TrendingUp, UserPlus, Users, Wallet,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { apiErrorMessage } from '@/lib/api-client';
import { csrfFetch } from '@/lib/security/csrf-client';
import { supabase } from '@/lib/supabase/client';
import { claimReferralBestEffort } from '@/lib/referral-claim-client';
import { REF_CODE_RE } from '@/lib/referral-attribution';
import './referral.css';

/* ---------- types ---------- */
type Campaign = { name?: string; pointsPerQualifiedInvite?: number; pointsPerRupiah?: number; minimumRedemption?: number; endDate?: string };
type Summary = {
  user_id?: string; referral_code?: string; total_points?: number; lifetime_points?: number;
  qualified_referrals?: number; campaign?: Campaign;
  recent_activity?: Array<{ event_type: string; source_channel?: string; created_at?: string }>;
};
type Leader = { rank: number; name: string; qualified_referrals: number; total_points: number; you?: boolean };
type Redemption = { id: string | number; points: number; rupiah_amount: number; status: string; created_at?: string };
type Analytics = { totals: { visits: number; signups: number; qualified: number }; channels: Array<{ channel: string; visits: number; signups: number; qualified: number }> };

/* ---------- constants ---------- */
const LEVELS = [
  { name: 'Pemula', min: 0 },
  { name: 'Aktif', min: 5 },
  { name: 'Pejuang', min: 20 },
  { name: 'Legenda', min: 50 },
];
const SECTIONS = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'bagikan', label: 'Bagikan' },
  { id: 'performa', label: 'Performa' },
  { id: 'peringkat', label: 'Peringkat' },
  { id: 'dompet', label: 'Dompet' },
  { id: 'bantuan', label: 'Bantuan' },
];
const FAQS: Array<[string, string]> = [
  ['Apakah ikut program ini gratis?', 'Ya, 100% gratis. Cukup punya akun SUKI Apps, kamu langsung dapat kode referral pribadi. Tidak ada biaya pendaftaran, tidak ada target belanja, dan tidak ada potongan tersembunyi.'],
  ['Kapan Koin masuk ke saldo saya?', 'Koin masuk otomatis setelah teman yang kamu ajak menyelesaikan aktivasi qualified — misalnya melengkapi profil, memasang listing pertama, atau aktif di komunitas. Bukan sekadar klik link atau daftar saja, supaya program tetap sehat dan adil.'],
  ['Apa itu aktivasi qualified?', 'Aktivasi qualified adalah tindakan bermakna yang menunjukkan temanmu benar-benar memakai SUKI Apps, sesuai kriteria campaign yang sedang berjalan. Detail kriteria selalu tertulis di halaman ini dan bisa berubah antar campaign.'],
  ['Bagaimana cara mencairkan Koin?', 'Kumpulkan minimal 1.000 Koin, lalu ajukan pencairan lewat tab Dompet ke transfer bank atau e-wallet. Setiap pengajuan diperiksa manual oleh tim SUKI (biasanya 1–3 hari kerja) sebelum dana dikirim.'],
  ['Bolehkah promosi di grup WhatsApp atau media sosial?', 'Boleh, dan memang itu cara terbaik. Yang tidak boleh: spam berulang, mengklaim penghasilan pasti, menyesatkan orang, atau memakai materi yang bukan hakmu. Promosi jujur = akun aman.'],
  ['Data apa yang dicatat dari link referral saya?', 'Hanya kunjungan link, pendaftaran, dan aktivasi yang teratribusi ke kodemu — tanpa data pribadi temanmu yang dibagikan kepadamu. Semua pencatatan mengikuti Kebijakan Privasi SUKI Apps.'],
];
const RULES: Array<[string, string]> = [
  ['Aktivasi qualified', 'Koin hanya diberikan untuk referral yang memenuhi kriteria aktivasi campaign. Klik atau daftar saja belum menghasilkan Koin.'],
  ['Satu akun, satu atribusi', 'Akun ganda, kode sendiri, bot, dan manipulasi atribusi tidak memenuhi syarat dan ditandai sistem anti-fraud.'],
  ['Reward mengikuti campaign', 'Rasio konversi, minimum pencairan, dan benefit dapat berubah mengikuti ketentuan campaign resmi yang diumumkan di halaman ini.'],
  ['Promosi bertanggung jawab', 'Dilarang spam, klaim penghasilan pasti, atau menyesatkan calon pengguna dalam bentuk apa pun.'],
  ['Verifikasi manual', 'Setiap pengajuan pencairan diperiksa tim SUKI. Dana hanya dikirim setelah data valid dan lolos verifikasi.'],
];

/* ---------- helpers ---------- */
const money = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);
const count = (v: number) => Number(v || 0).toLocaleString('id-ID');
function timeAgo(ts: number) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 10) return 'baru saja';
  if (s < 60) return `${s} dtk lalu`;
  return `${Math.floor(s / 60)} mnt lalu`;
}
function WaIcon() {
  return (<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>);
}
function TgIcon() {
  return (<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>);
}
function XIcon() {
  return (<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>);
}
function FbIcon() {
  return (<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>);
}

/* ---------- page ---------- */
export default function AjakTemanPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [live, setLive] = useState(false);
  const [liveReady, setLiveReady] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(() => Date.now());
  const [toast, setToast] = useState('');
  const [qrOpen, setQrOpen] = useState(false);
  const [qrChannel, setQrChannel] = useState('whatsapp');
  const [qrData, setQrData] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState('ringkasan');
  const [origin, setOrigin] = useState('https://sukiapps.web.id');
  const [redeemPoints, setRedeemPoints] = useState(1000);
  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 3400);
  }, []);

  /* ----- data loading ----- */
  const loadSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/referral?action=summary', { credentials: 'include' });
      if (res.status === 401) { setLoggedIn(false); return; }
      const payload = await res.json().catch(() => null);
      if (payload?.ok && payload.data) {
        setLoggedIn(true);
        setSummary(payload.data);
        setUpdatedAt(Date.now());
      }
    } catch { /* diam: empty state yang bicara */ }
  }, []);
  const loadAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/referral?action=analytics', { credentials: 'include' });
      const payload = await res.json().catch(() => null);
      if (payload?.ok && payload.data) setAnalytics(payload.data);
    } catch { /* diam */ }
  }, []);
  const loadLeaders = useCallback(async () => {
    try {
      const res = await fetch('/api/referral?action=leaderboard', { credentials: 'include' });
      const payload = await res.json().catch(() => null);
      if (payload?.ok && Array.isArray(payload.data)) setLeaders(payload.data);
    } catch { /* diam */ }
  }, []);
  const loadRedemptions = useCallback(async () => {
    try {
      const res = await fetch('/api/referral?action=redemptions', { credentials: 'include' });
      const payload = await res.json().catch(() => null);
      if (payload?.ok && Array.isArray(payload.data)) setRedemptions(payload.data);
    } catch { /* diam */ }
  }, []);

  useEffect(() => {
    setOrigin(window.location.origin);
    // Klaim referral tertunda (mis. signup OAuth yang klaim server-nya gagal).
    claimReferralBestEffort();
    // Catat kunjungan bila URL membawa kode milik orang lain.
    try {
      const params = new URLSearchParams(window.location.search);
      const incoming = params.get('ref');
      if (incoming && REF_CODE_RE.test(incoming.trim().toUpperCase())) {
        const src = (params.get('src') || 'direct').slice(0, 30);
        void csrfFetch('/api/referral', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: 'visit', referral_code: incoming.trim().toUpperCase(), source_channel: src }),
        }).catch(() => undefined);
      }
    } catch { /* abaikan */ }
    void Promise.all([loadSummary(), loadAnalytics(), loadLeaders(), loadRedemptions()])
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----- realtime: langganan event referral milik sendiri ----- */
  useEffect(() => {
    const uid = summary?.user_id;
    if (!uid || !supabase) { setLiveReady(true); return; }
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let settled = false;
    const fallback = window.setTimeout(() => { if (!settled) setLiveReady(true); }, 5000);
    try {
      channel = supabase
        .channel(`referral-hub:${uid}`)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'referral_account_events', filter: `referrer_id=eq.${uid}` },
          () => {
            setUpdatedAt(Date.now());
            showToast('Aktivitas referral baru masuk 🎉');
            void loadSummary();
            void loadAnalytics();
          })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            settled = true;
            window.clearTimeout(fallback);
            setLive(true);
            setLiveReady(true);
          }
        });
    } catch {
      window.clearTimeout(fallback);
      setLiveReady(true);
    }
    return () => {
      window.clearTimeout(fallback);
      if (channel && supabase) void supabase.removeChannel(channel).catch(() => undefined);
    };
  }, [summary?.user_id, loadSummary, loadAnalytics, showToast]);

  /* ----- polling fallback bila realtime belum tersedia ----- */
  useEffect(() => {
    if (live || loggedIn !== true) return;
    const id = window.setInterval(() => { void loadSummary(); }, 30000);
    const onFocus = () => { void loadSummary(); };
    window.addEventListener('focus', onFocus);
    return () => { window.clearInterval(id); window.removeEventListener('focus', onFocus); };
  }, [live, loggedIn, loadSummary]);

  /* ----- section spy untuk chip nav ----- */
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { rootMargin: '-35% 0px -55% 0px' });
    SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [loading]);

  /* ----- QR ----- */
  const referralCode = summary?.referral_code || '';
  const campaign = summary?.campaign || {};
  const pointsPerRupiah = campaign.pointsPerRupiah || 10;
  const minimumRedemption = campaign.minimumRedemption || 1000;
  const linkFor = useCallback((src: string) => `${origin}/?ref=${referralCode}${src ? `&src=${encodeURIComponent(src)}` : ''}`, [origin, referralCode]);

  useEffect(() => {
    if (!qrOpen || !referralCode) { setQrData(''); return; }
    void QRCode.toDataURL(linkFor(qrChannel), {
      width: 440, margin: 2, color: { dark: '#0b3b33', light: '#ffffff' },
    }).then(setQrData).catch(() => setQrData(''));
  }, [qrOpen, qrChannel, referralCode, linkFor]);

  /* ----- derived ----- */
  const qualified = summary?.qualified_referrals || 0;
  const balance = summary?.total_points || 0;
  const lifetime = summary?.lifetime_points || 0;
  const levelIdx = LEVELS.reduce((acc, l, i) => (qualified >= l.min ? i : acc), 0);
  const level = LEVELS[levelIdx];
  const nextLevel = LEVELS[levelIdx + 1];
  const progress = nextLevel ? Math.min(100, Math.round(((qualified - level.min) / (nextLevel.min - level.min)) * 100)) : 100;
  const totals = analytics?.totals || { visits: 0, signups: 0, qualified: 0 };
  const convVisitSignup = totals.visits ? Math.round((totals.signups / totals.visits) * 100) : 0;
  const convSignupQualified = totals.signups ? Math.round((totals.qualified / totals.signups) * 100) : 0;
  const convVisitQualified = totals.visits ? Math.round((totals.qualified / totals.visits) * 100) : 0;
  const topChannels = (analytics?.channels || []).slice(0, 5);
  const maxChannelQualified = Math.max(1, ...topChannels.map((c) => c.qualified));

  /* ----- actions ----- */
  async function copyText(text: string, doneMsg: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* abaikan */ }
      ta.remove();
    }
    showToast(doneMsg);
  }
  const shareText = (link: string) =>
    `Gabung SUKI Apps bareng aku yuk! Marketplace, properti, lowongan kerja, dan komunitas Sulawesi Tenggara dalam satu tempat.\n\nDaftar lewat link ini: ${link}`;
  async function nativeShare() {
    const link = linkFor('');
    if (navigator.share) {
      try { await navigator.share({ title: 'Ajak Teman ke SUKI Apps', text: shareText(link), url: link }); }
      catch { /* pengguna membatalkan */ }
    } else {
      await copyText(link, 'Link referral disalin.');
    }
  }
  async function redeem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await csrfFetch('/api/referral', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'redeem',
        points: Number(form.get('points')),
        payout_method: form.get('payout_method'),
        payout_account: form.get('payout_account'),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    showToast(payload?.data?.message || apiErrorMessage(payload, 'Pengajuan diterima untuk verifikasi.'));
    if (response.ok) {
      event.currentTarget.reset();
      setRedeemPoints(minimumRedemption);
      void loadSummary();
      void loadRedemptions();
    }
  }
  const statusChip = (status: string) => {
    if (status === 'paid') return <span className="refer-chip refer-chip-ok">Dibayar</span>;
    if (status === 'approved') return <span className="refer-chip refer-chip-info">Disetujui</span>;
    if (status === 'rejected') return <span className="refer-chip refer-chip-bad">Ditolak</span>;
    return <span className="refer-chip refer-chip-wait">Menunggu</span>;
  };

  const shareChannels = [
    { key: 'whatsapp', label: 'WhatsApp', icon: <WaIcon />, cls: 'icon-wa', hint: 'Grup & chat' },
    { key: 'telegram', label: 'Telegram', icon: <TgIcon />, cls: 'icon-tg', hint: 'Channel & grup' },
    { key: 'x', label: 'X', icon: <XIcon />, cls: 'icon-x', hint: 'Post publik' },
    { key: 'facebook', label: 'Facebook', icon: <FbIcon />, cls: 'icon-fb', hint: 'Kronologi' },
    { key: 'qr', label: 'QR Code', icon: <QrCode size={22} />, cls: 'icon-qr', hint: 'Cetak & booth' },
    { key: 'more', label: 'Lainnya', icon: <Share2 size={22} />, cls: 'icon-more', hint: 'Aplikasi lain' },
  ];
  function channelHref(key: string): string | null {
    const link = linkFor(key === 'more' ? '' : key);
    const text = shareText(link);
    if (key === 'whatsapp') return `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (key === 'telegram') return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText(''))}`;
    if (key === 'x') return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    if (key === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    return null;
  }

  return (
    <AppLayout active="home">
      <main className="refer-scope">
        <div className="refer-wrap">
          {/* sticky chip nav */}
          <nav className="refer-nav" aria-label="Navigasi halaman referral">
            {SECTIONS.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''} onClick={() => setActiveSection(id)}>{label}</a>
            ))}
          </nav>

          {/* ============ RINGKASAN ============ */}
          <section id="ringkasan" aria-label="Ringkasan referral">
            <div className="refer-hero-card">
              <div className="refer-hero-top">
                <span className="refer-kicker">Program Ajak Teman</span>
                {liveReady && (
                  <span className={`refer-live${live ? '' : ' is-polling'}`} title={live ? 'Terhubung real-time' : 'Diperbarui otomatis tiap 30 detik'}>
                    <i aria-hidden="true" />{live ? 'Live' : 'Otomatis'}
                  </span>
                )}
              </div>
              {loading ? (
                <p className="refer-balance-label">Memuat saldo…</p>
              ) : loggedIn === false ? (
                <>
                  <h1 className="refer-title" style={{ color: '#fff' }}>Ajak teman, kumpulkan Koin SUKI.</h1>
                  <p className="refer-balance-sub">Bagikan link referral ke WhatsApp, komunitas, atau media sosial. Setiap teman yang bergabung dan aktif, kamu dapat Koin yang bisa dicairkan.</p>
                  <div className="refer-login-cta">
                    <Link className="refer-btn refer-btn-primary" href="/login?redirect=/ajak-teman">Masuk untuk mulai</Link>
                    <Link className="refer-btn refer-btn-ghost" href="/signup?redirect=/ajak-teman">Buat akun gratis</Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="refer-balance-label">Saldo Koin SUKI kamu</p>
                  <p className="refer-balance">{count(balance)}</p>
                  <p className="refer-balance-sub">≈ <strong>{money(Math.floor(balance / pointsPerRupiah))}</strong> · {count(lifetime)} Koin terkumpul seumur hidup</p>
                  <div className="refer-level">
                    <div className="refer-level-head">
                      <b>Level {level.name}</b>
                      <span>{nextLevel ? `${count(nextLevel.min - qualified)} aktivasi lagi ke ${nextLevel.name}` : 'Level tertinggi tercapai 🎉'}</span>
                    </div>
                    <div className="refer-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progres level ${level.name}`}>
                      <i style={{ width: `${progress}%` }} />
                    </div>
                    <p>{count(qualified)} aktivasi qualified · Diperbarui {timeAgo(updatedAt)}</p>
                  </div>
                  <div className="refer-hero-actions">
                    <a className="refer-btn refer-btn-wa" href={channelHref('whatsapp') || '#bagikan'} target="_blank" rel="noopener noreferrer">
                      <WaIcon /> Bagikan via WhatsApp
                    </a>
                    <button className="refer-btn refer-btn-ghost" onClick={() => copyText(linkFor(''), 'Link referral disalin.')}>
                      <Copy size={17} /> Salin link
                    </button>
                  </div>
                </>
              )}
            </div>

            {loggedIn !== false && (
              <div className="refer-stats" style={{ marginTop: 14 }}>
                <article className="refer-stat">
                  <span className="icon"><MousePointerClick size={18} /></span>
                  <small>Link dikunjungi</small><b>{count(totals.visits)}</b>
                  <span>Orang membuka link referralmu</span>
                </article>
                <article className="refer-stat">
                  <span className="icon"><UserPlus size={18} /></span>
                  <small>Teman bergabung</small><b>{count(totals.signups)}</b>
                  <span>Mendaftar lewat kodemu · {convVisitSignup}% dari kunjungan</span>
                </article>
                <article className="refer-stat">
                  <span className="icon"><BadgeCheck size={18} /></span>
                  <small>Aktivasi qualified</small><b>{count(totals.qualified)}</b>
                  <span>Lolos verifikasi · {convSignupQualified}% dari pendaftar</span>
                </article>
                <article className="refer-stat">
                  <span className="icon"><TrendingUp size={18} /></span>
                  <small>Tingkat konversi</small><b>{convVisitQualified}%</b>
                  <span>Dari kunjungan menjadi Koin</span>
                </article>
              </div>
            )}
          </section>

          {/* ============ BAGIKAN ============ */}
          <section id="bagikan" aria-label="Bagikan referral">
            <div className="refer-card">
              <div className="refer-section-head">
                <span className="refer-kicker"><Share2 size={13} /> Bagikan</span>
                <h3>Link referral pribadimu</h3>
                <p className="desc">Setiap tombol di bawah memakai link dengan kode kamu — kunjungan tercatat otomatis ke kanal yang benar.</p>
              </div>
              {loggedIn === false ? (
                <p className="refer-empty">Masuk dulu untuk melihat kode referral pribadimu.<br /><Link href="/login?redirect=/ajak-teman" style={{ color: 'var(--theme-primary)', fontWeight: 800 }}>Masuk / daftar gratis →</Link></p>
              ) : (
                <>
                  <div className="refer-linkbox">
                    <input readOnly value={referralCode ? linkFor('') : 'Memuat…'} aria-label="Link referral pribadi" onFocus={(e) => e.target.select()} />
                    <button onClick={() => copyText(linkFor(''), 'Link referral disalin.')}>Salin</button>
                  </div>
                  <div className="refer-channels">
                    {shareChannels.map((ch) => {
                      const href = channelHref(ch.key);
                      const inner = (<><span className={`icon ${ch.cls}`}>{ch.icon}</span>{ch.label}<small>{ch.hint}</small></>);
                      if (ch.key === 'qr') return <button key={ch.key} className="refer-channel" onClick={() => setQrOpen((v) => !v)} aria-expanded={qrOpen}>{inner}</button>;
                      if (ch.key === 'more') return <button key={ch.key} className="refer-channel" onClick={nativeShare}>{inner}</button>;
                      return <a key={ch.key} className="refer-channel" href={href || '#bagikan'} target="_blank" rel="noopener noreferrer">{inner}</a>;
                    })}
                  </div>
                  {qrOpen && (
                    <div className="refer-qr-panel">
                      <div className="refer-qr-row">
                        <label>Kanal QR
                          <select value={qrChannel} onChange={(e) => setQrChannel(e.target.value)}>
                            {['whatsapp', 'telegram', 'instagram', 'community', 'website', 'direct'].map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </label>
                      </div>
                      {qrData ? <img src={qrData} alt={`Kode QR referral kanal ${qrChannel}`} /> : <p className="refer-note">Membuat QR…</p>}
                      {qrData && <a className="refer-btn-sm" href={qrData} download={`suki-referral-${qrChannel}.png`}>Unduh QR PNG</a>}
                      <p className="refer-note">Cetak untuk booth, warung, atau papan komunitas — setiap scan tercatat sebagai kunjungan dari kanal {qrChannel}.</p>
                    </div>
                  )}
                  <p className="refer-note" style={{ marginTop: 14 }}>Contoh pesan: “{shareText('').split('\n\n')[0]}” — jujur, tanpa janji penghasilan.</p>
                </>
              )}
            </div>
          </section>

          {/* ============ PERFORMA ============ */}
          <section id="performa" aria-label="Performa referral">
            <div className="refer-grid-2">
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker"><TrendingUp size={13} /> Performa</span>
                  <h3>Alur dari klik menjadi Koin</h3>
                  <p className="desc">Fokuskan energimu ke langkah yang paling bocor.</p>
                </div>
                <div className="refer-funnel">
                  <div className="refer-funnel-step">
                    <span className="dot">1</span>
                    <div><b>Kunjungan link</b><small>Orang yang membuka linkmu</small></div>
                    <strong>{count(totals.visits)}</strong>
                  </div>
                  <div className="refer-funnel-step">
                    <span className="dot">2</span>
                    <div><b>Pendaftar</b><small>Membuat akun SUKI Apps · {convVisitSignup}%</small>
                      <div className="refer-funnel-bar"><i style={{ width: `${convVisitSignup}%` }} /></div>
                    </div>
                    <strong>{count(totals.signups)}</strong>
                  </div>
                  <div className="refer-funnel-step">
                    <span className="dot">3</span>
                    <div><b>Qualified → Koin</b><small>Aktivasi terverifikasi · {convSignupQualified}%</small>
                      <div className="refer-funnel-bar"><i style={{ width: `${convSignupQualified}%` }} /></div>
                    </div>
                    <strong>{count(totals.qualified)}</strong>
                  </div>
                </div>
                <button className="refer-btn-sm" onClick={() => { void loadAnalytics(); void loadSummary(); setUpdatedAt(Date.now()); }}>
                  <RefreshCw size={14} /> Muat ulang data
                </button>
              </div>
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker"><Sparkles size={13} /> Kanal</span>
                  <h3>Kanal yang menghasilkan</h3>
                  <p className="desc">Diurutkan dari aktivasi qualified terbanyak.</p>
                </div>
                {topChannels.length ? (
                  <div className="refer-channels-bars">
                    {topChannels.map((c) => (
                      <div key={c.channel} className="refer-channel-bar">
                        <div className="row"><b>{c.channel}</b><span>{count(c.qualified)} qualified · {count(c.signups)} daftar</span></div>
                        <div className="track"><i style={{ width: `${Math.round((c.qualified / maxChannelQualified) * 100)}%` }} /></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="refer-empty">Belum ada data kanal. Bagikan link dengan tombol WhatsApp di atas, lalu lihat kanal mana yang paling menghasilkan.</p>
                )}
              </div>
            </div>
          </section>

          {/* ============ PERINGKAT ============ */}
          <section id="peringkat" aria-label="Papan peringkat">
            <div className="refer-card">
              <div className="refer-section-head">
                <span className="refer-kicker"><Medal size={13} /> Papan peringkat</span>
                <h3>Affiliator paling berdampak</h3>
                <p className="desc">Peringkat berdasarkan aktivasi qualified — bukan jumlah klik. Nama ditampilkan sebagai alias demi privasi.</p>
              </div>
              {leaders.length ? (
                <div className="refer-board">
                  {leaders.slice(0, 10).map((row) => (
                    <div key={row.rank} className={`refer-board-row${row.you ? ' is-you' : ''}`}>
                      <span className={`refer-rank${row.rank <= 3 ? ` r${row.rank}` : ''}`}>{row.rank}</span>
                      <div><b>{row.name}{row.you && <span className="refer-you-tag">KAMU</span>}</b><small>{count(row.qualified_referrals)} aktivasi qualified</small></div>
                      <strong>{count(row.total_points)} Koin</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="refer-empty">Belum ada data peringkat yang cukup untuk ditampilkan. Jadilah yang pertama mengumpulkan aktivasi qualified! 🚀</p>
              )}
            </div>
          </section>

          {/* ============ DOMPET ============ */}
          <section id="dompet" aria-label="Dompet Koin">
            <div className="refer-grid-2">
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker"><Wallet size={13} /> Dompet</span>
                  <h3>Cairkan Koin jadi rupiah</h3>
                  <p className="desc">Rasio {pointsPerRupiah} Koin = Rp1 · Minimum {count(minimumRedemption)} Koin per pengajuan. Setiap pengajuan diverifikasi manual 1–3 hari kerja.</p>
                </div>
                {loggedIn === false ? (
                  <p className="refer-empty">Masuk untuk melihat saldo dan mengajukan pencairan.</p>
                ) : (
                  <>
                    <div className="refer-wallet-balance">
                      <b>{count(balance)} <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--theme-text-muted)' }}>Koin</span></b>
                      <span>≈ {money(Math.floor(balance / pointsPerRupiah))}</span>
                    </div>
                    <form className="refer-form" onSubmit={redeem}>
                      <label>Jumlah Koin
                        <input name="points" type="number" min={minimumRedemption} step={pointsPerRupiah} value={redeemPoints} onChange={(e) => setRedeemPoints(Number(e.target.value))} required />
                        <small>Estimasi diterima: {money(Math.floor(redeemPoints / pointsPerRupiah))}</small>
                      </label>
                      <label>Metode pencairan
                        <select name="payout_method" required defaultValue="">
                          <option value="" disabled>Pilih metode</option>
                          <option value="bank_transfer">Transfer bank</option>
                          <option value="ewallet">E-wallet (DANA/OVO/GoPay)</option>
                        </select>
                      </label>
                      <label>Nomor rekening / akun e-wallet
                        <input name="payout_account" minLength={4} maxLength={80} required placeholder="Cth. 821234567890" autoComplete="off" />
                        <small>Nomor disimpan termasking dan hanya dipakai untuk pencairan.</small>
                      </label>
                      <button className="refer-btn refer-btn-primary" type="submit" style={{ width: '100%' }}>
                        <Gift size={17} /> Ajukan pencairan
                      </button>
                    </form>
                  </>
                )}
              </div>
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker"><Users size={13} /> Riwayat</span>
                  <h3>Pengajuan pencairan</h3>
                  <p className="desc">Status terbaru dari setiap pengajuanmu.</p>
                </div>
                {redemptions.length ? (
                  <div className="refer-history">
                    {redemptions.map((item) => (
                      <div key={item.id} className="refer-history-row">
                        <div>
                          <b>{money(item.rupiah_amount)}</b>
                          <small>{count(item.points)} Koin · {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</small>
                        </div>
                        {statusChip(item.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="refer-empty">Belum ada pengajuan. Kumpulkan {count(minimumRedemption)} Koin pertama, lalu cairkan di sini.</p>
                )}
                {summary?.recent_activity?.length ? (
                  <>
                    <div className="refer-section-head" style={{ marginTop: 20 }}>
                      <h3 style={{ fontSize: 15 }}>Aktivitas terbaru</h3>
                    </div>
                    <div className="refer-history">
                      {summary.recent_activity.slice(0, 5).map((ev, i) => (
                        <div key={`${ev.created_at}-${i}`} className="refer-history-row">
                          <div>
                            <b style={{ fontSize: 13 }}>{ev.event_type === 'qualified' ? 'Aktivasi qualified' : ev.event_type === 'signup' ? 'Teman bergabung' : 'Link dikunjungi'}</b>
                            <small>{ev.source_channel || 'direct'} · {ev.created_at ? new Date(ev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}</small>
                          </div>
                          <strong style={{ fontSize: 13, color: ev.event_type === 'qualified' ? 'var(--theme-success)' : 'var(--theme-text-muted)' }}>
                            {ev.event_type === 'qualified' ? `+${count(campaign.pointsPerQualifiedInvite || 100)}` : '•'}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </section>

          {/* ============ BANTUAN ============ */}
          <section id="bantuan" aria-label="Bantuan dan ketentuan">
            <div className="refer-grid-2">
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker">Cara kerja</span>
                  <h3>Empat langkah mudah</h3>
                </div>
                <div className="refer-steps" style={{ gridTemplateColumns: '1fr' }}>
                  {[
                    ['Salin link referralmu', 'Setiap akun punya kode unik. Link tercatat otomatis atas namamu.'],
                    ['Bagikan ke orang yang tepat', 'Grup WhatsApp keluarga, komunitas, teman kampus atau kantor — yang memang butuh SUKI Apps.'],
                    ['Teman daftar & aktif', 'Mereka mendaftar lewat linkmu lalu memakai fitur SUKI (profil, listing, komunitas).'],
                    ['Koin masuk otomatis', 'Setelah aktivasi qualified terverifikasi, Koin langsung masuk ke saldomu.'],
                  ].map(([t, d], i) => (
                    <div key={t} className="refer-step" style={{ gridTemplateColumns: '32px 1fr', display: 'grid' }}>
                      <span className="num">{i + 1}</span>
                      <div><b>{t}</b><br /><span>{d}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gap: 'clamp(16px, 2.5vw, 24px)', alignContent: 'start' }}>
                <div className="refer-card">
                  <div className="refer-section-head">
                    <span className="refer-kicker">Tanya jawab</span>
                    <h3>Yang sering ditanyakan</h3>
                  </div>
                  <div className="refer-faq">
                    {FAQS.map(([q, a], i) => (
                      <div key={q} className={`refer-faq-item${openFaq === i ? ' open' : ''}`}>
                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                          {q}<ChevronDown size={17} className="chev" />
                        </button>
                        <div className="answer"><p>{a}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="refer-card">
                  <div className="refer-section-head">
                    <span className="refer-kicker">Ketentuan</span>
                    <h3>Main adil, semua menang</h3>
                  </div>
                  <ul className="refer-rules">
                    {RULES.map(([t, d], i) => (
                      <li key={t}><span className="rn">{String(i + 1).padStart(2, '0')}</span><span><b>{t}.</b> {d}</span></li>
                    ))}
                  </ul>
                  <p className="refer-note" style={{ marginTop: 14 }}>Program “Ajak Teman, Tumbuh Bersama” berakhir {campaign.endDate || '31 Des 2026'} kecuali diperpanjang. SUKI Apps dapat menyesuaikan syarat dengan pemberitahuan di halaman ini.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* toast */}
        <div className={`refer-toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>
      </main>
    </AppLayout>
  );
}
