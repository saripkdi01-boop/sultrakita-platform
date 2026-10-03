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
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';
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
const LEVEL_KEYS = ['refLevelBeginner', 'refLevelActive', 'refLevelFighter', 'refLevelLegend'];
const LEVEL_MINS = [0, 5, 20, 50];
const SECTIONS = [
  { id: 'ringkasan', labelKey: 'refSecSummary' },
  { id: 'bagikan', labelKey: 'refSecShare' },
  { id: 'performa', labelKey: 'refSecPerformance' },
  { id: 'peringkat', labelKey: 'refSecLeaderboard' },
  { id: 'dompet', labelKey: 'refSecWallet' },
  { id: 'bantuan', labelKey: 'refSecHelp' },
];
const FAQ_KEYS: Array<[string, string]> = [
  ['refFaq1Q', 'refFaq1A'],
  ['refFaq2Q', 'refFaq2A'],
  ['refFaq3Q', 'refFaq3A'],
  ['refFaq4Q', 'refFaq4A'],
  ['refFaq5Q', 'refFaq5A'],
  ['refFaq6Q', 'refFaq6A'],
];
const RULE_KEYS: Array<[string, string]> = [
  ['refRule1T', 'refRule1D'],
  ['refRule2T', 'refRule2D'],
  ['refRule3T', 'refRule3D'],
  ['refRule4T', 'refRule4D'],
  ['refRule5T', 'refRule5D'],
];

/* ---------- helpers ---------- */
const money = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);
const count = (v: number) => Number(v || 0).toLocaleString('id-ID');
function timeAgo(ts: number, t: Record<string, string>) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 10) return t.refJustNow;
  if (s < 60) return t.refSecAgo.replace('{n}', String(s));
  return t.refMinAgo.replace('{n}', String(Math.floor(s / 60)));
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
  const { language } = usePreferences();
  const t = getMiscLabels(language);
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
            showToast(t.refNewActivity);
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
  const levelIdx = LEVEL_MINS.reduce((acc, min, i) => (qualified >= min ? i : acc), 0);
  const levelName = t[LEVEL_KEYS[levelIdx]];
  const nextLevelName = LEVEL_KEYS[levelIdx + 1] ? t[LEVEL_KEYS[levelIdx + 1]] : '';
  const nextLevelMin = LEVEL_MINS[levelIdx + 1];
  const progress = nextLevelMin !== undefined ? Math.min(100, Math.round(((qualified - LEVEL_MINS[levelIdx]) / (nextLevelMin - LEVEL_MINS[levelIdx])) * 100)) : 100;
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
    t.refShareText.replace('{link}', link);
  async function nativeShare() {
    const link = linkFor('');
    if (navigator.share) {
      try { await navigator.share({ title: t.refShareTitle2, text: shareText(link), url: link }); }
      catch { /* pengguna membatalkan */ }
    } else {
      await copyText(link, t.refLinkCopied);
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
    showToast(payload?.data?.message || apiErrorMessage(payload, t.refRedeemOk));
    if (response.ok) {
      event.currentTarget.reset();
      setRedeemPoints(minimumRedemption);
      void loadSummary();
      void loadRedemptions();
    }
  }
  const statusChip = (status: string) => {
    if (status === 'paid') return <span className="refer-chip refer-chip-ok">{t.refStatusPaid}</span>;
    if (status === 'approved') return <span className="refer-chip refer-chip-info">{t.refStatusApproved}</span>;
    if (status === 'rejected') return <span className="refer-chip refer-chip-bad">{t.refStatusRejected}</span>;
    return <span className="refer-chip refer-chip-wait">{t.refStatusWaiting}</span>;
  };

  const shareChannels = [
    { key: 'whatsapp', label: t.refChannelWa, icon: <WaIcon />, cls: 'icon-wa', hint: t.refChannelWaHint },
    { key: 'telegram', label: t.refChannelTg, icon: <TgIcon />, cls: 'icon-tg', hint: t.refChannelTgHint },
    { key: 'x', label: t.refChannelX, icon: <XIcon />, cls: 'icon-x', hint: t.refChannelXHint },
    { key: 'facebook', label: t.refChannelFb, icon: <FbIcon />, cls: 'icon-fb', hint: t.refChannelFbHint },
    { key: 'qr', label: t.refChannelQr, icon: <QrCode size={22} />, cls: 'icon-qr', hint: t.refChannelQrHint },
    { key: 'more', label: t.refChannelMore, icon: <Share2 size={22} />, cls: 'icon-more', hint: t.refChannelMoreHint },
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
          <nav className="refer-nav" aria-label={t.refNavAria}>
            {SECTIONS.map(({ id, labelKey }) => (
              <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''} onClick={() => setActiveSection(id)}>{t[labelKey]}</a>
            ))}
          </nav>

          {/* ============ RINGKASAN ============ */}
          <section id="ringkasan" aria-label={t.refSecSummary}>
            <div className="refer-hero-card">
              <div className="refer-hero-top">
                <span className="refer-kicker">{t.refKicker}</span>
                {liveReady && (
                  <span className={`refer-live${live ? '' : ' is-polling'}`} title={live ? t.refLiveTitle : t.refPollingTitle}>
                    <i aria-hidden="true" />{live ? t.refLive : t.refAuto}
                  </span>
                )}
              </div>
              {loading ? (
                <p className="refer-balance-label">{t.refLoadingBalance}</p>
              ) : loggedIn === false ? (
                <>
                  <h1 className="refer-title" style={{ color: '#fff' }}>{t.refHeroTitle}</h1>
                  <p className="refer-balance-sub">{t.refHeroDesc}</p>
                  <div className="refer-login-cta">
                    <Link className="refer-btn refer-btn-primary" href="/login?redirect=/ajak-teman">{t.refLoginCta}</Link>
                    <Link className="refer-btn refer-btn-ghost" href="/signup?redirect=/ajak-teman">{t.refSignupCta}</Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="refer-balance-label">{t.refBalanceLabel}</p>
                  <p className="refer-balance">{count(balance)}</p>
                  <p className="refer-balance-sub">≈ <strong>{money(Math.floor(balance / pointsPerRupiah))}</strong> · {t.refLifetime.replace('{n}', count(lifetime))}</p>
                  <div className="refer-level">
                    <div className="refer-level-head">
                      <b>{t.refLevel.replace('{name}', levelName)}</b>
                      <span>{nextLevelMin !== undefined ? t.refNextLevel.replace('{n}', count(nextLevelMin - qualified)).replace('{name}', nextLevelName) : t.refTopLevel}</span>
                    </div>
                    <div className="refer-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={t.refLevel.replace('{name}', levelName)}>
                      <i style={{ width: `${progress}%` }} />
                    </div>
                    <p>{t.refQualifiedCount.replace('{n}', count(qualified))} · {t.refUpdated.replace('{ago}', timeAgo(updatedAt, t))}</p>
                  </div>
                  <div className="refer-hero-actions">
                    <a className="refer-btn refer-btn-wa" href={channelHref('whatsapp') || '#bagikan'} target="_blank" rel="noopener noreferrer">
                      <WaIcon /> {t.refShareWa}
                    </a>
                    <button className="refer-btn refer-btn-ghost" onClick={() => copyText(linkFor(''), t.refLinkCopied)}>
                      <Copy size={17} /> {t.refCopyLink}
                    </button>
                  </div>
                </>
              )}
            </div>

            {loggedIn !== false && (
              <div className="refer-stats" style={{ marginTop: 14 }}>
                <article className="refer-stat">
                  <span className="icon"><MousePointerClick size={18} /></span>
                  <small>{t.refStatVisits}</small><b>{count(totals.visits)}</b>
                  <span>{t.refStatVisitsDesc}</span>
                </article>
                <article className="refer-stat">
                  <span className="icon"><UserPlus size={18} /></span>
                  <small>{t.refStatSignups}</small><b>{count(totals.signups)}</b>
                  <span>{t.refStatSignupsDesc.replace('{pct}', String(convVisitSignup))}</span>
                </article>
                <article className="refer-stat">
                  <span className="icon"><BadgeCheck size={18} /></span>
                  <small>{t.refStatQualified}</small><b>{count(totals.qualified)}</b>
                  <span>{t.refStatQualifiedDesc.replace('{pct}', String(convSignupQualified))}</span>
                </article>
                <article className="refer-stat">
                  <span className="icon"><TrendingUp size={18} /></span>
                  <small>{t.refStatConv}</small><b>{convVisitQualified}%</b>
                  <span>{t.refStatConvDesc}</span>
                </article>
              </div>
            )}
          </section>

          {/* ============ BAGIKAN ============ */}
          <section id="bagikan" aria-label={t.refSecShare}>
            <div className="refer-card">
              <div className="refer-section-head">
                <span className="refer-kicker"><Share2 size={13} /> {t.refSecShare}</span>
                <h3>{t.refShareTitle}</h3>
                <p className="desc">{t.refShareDesc}</p>
              </div>
              {loggedIn === false ? (
                <p className="refer-empty">{t.refLoginToSee}<br /><Link href="/login?redirect=/ajak-teman" style={{ color: 'var(--theme-primary)', fontWeight: 800 }}>{t.refLoginLink}</Link></p>
              ) : (
                <>
                  <div className="refer-linkbox">
                    <input readOnly value={referralCode ? linkFor('') : t.refLinkLoading} aria-label={t.refLinkAria} onFocus={(e) => e.target.select()} />
                    <button onClick={() => copyText(linkFor(''), t.refLinkCopied)}>{t.refCopy}</button>
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
                        <label>{t.refQrChannel}
                          <select value={qrChannel} onChange={(e) => setQrChannel(e.target.value)}>
                            {['whatsapp', 'telegram', 'instagram', 'community', 'website', 'direct'].map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </label>
                      </div>
                      {qrData ? <img src={qrData} alt={t.refQrAlt.replace('{channel}', qrChannel)} /> : <p className="refer-note">{t.refQrMaking}</p>}
                      {qrData && <a className="refer-btn-sm" href={qrData} download={`suki-referral-${qrChannel}.png`}>{t.refQrDownload}</a>}
                      <p className="refer-note">{t.refQrNote.replace('{channel}', qrChannel)}</p>
                    </div>
                  )}
                  <p className="refer-note" style={{ marginTop: 14 }}>{t.refShareExample.replace('{text}', shareText('').split('\n\n')[0])}</p>
                </>
              )}
            </div>
          </section>

          {/* ============ PERFORMA ============ */}
          <section id="performa" aria-label={t.refSecPerformance}>
            <div className="refer-grid-2">
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker"><TrendingUp size={13} /> {t.refSecPerformance}</span>
                  <h3>{t.refFunnelTitle}</h3>
                  <p className="desc">{t.refFunnelDesc}</p>
                </div>
                <div className="refer-funnel">
                  <div className="refer-funnel-step">
                    <span className="dot">1</span>
                    <div><b>{t.refFunnelVisit}</b><small>{t.refFunnelVisitDesc}</small></div>
                    <strong>{count(totals.visits)}</strong>
                  </div>
                  <div className="refer-funnel-step">
                    <span className="dot">2</span>
                    <div><b>{t.refFunnelSignup}</b><small>{t.refFunnelSignupDesc.replace('{pct}', String(convVisitSignup))}</small>
                      <div className="refer-funnel-bar"><i style={{ width: `${convVisitSignup}%` }} /></div>
                    </div>
                    <strong>{count(totals.signups)}</strong>
                  </div>
                  <div className="refer-funnel-step">
                    <span className="dot">3</span>
                    <div><b>{t.refFunnelQualified}</b><small>{t.refFunnelQualifiedDesc.replace('{pct}', String(convSignupQualified))}</small>
                      <div className="refer-funnel-bar"><i style={{ width: `${convSignupQualified}%` }} /></div>
                    </div>
                    <strong>{count(totals.qualified)}</strong>
                  </div>
                </div>
                <button className="refer-btn-sm" onClick={() => { void loadAnalytics(); void loadSummary(); setUpdatedAt(Date.now()); }}>
                  <RefreshCw size={14} /> {t.refReload}
                </button>
              </div>
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker"><Sparkles size={13} /> {t.refSecShare}</span>
                  <h3>{t.refChannelsTitle}</h3>
                  <p className="desc">{t.refChannelsDesc}</p>
                </div>
                {topChannels.length ? (
                  <div className="refer-channels-bars">
                    {topChannels.map((c) => (
                      <div key={c.channel} className="refer-channel-bar">
                        <div className="row"><b>{c.channel}</b><span>{t.refChannelQualified.replace('{n}', count(c.qualified)).replace('{m}', count(c.signups))}</span></div>
                        <div className="track"><i style={{ width: `${Math.round((c.qualified / maxChannelQualified) * 100)}%` }} /></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="refer-empty">{t.refNoChannels}</p>
                )}
              </div>
            </div>
          </section>

          {/* ============ PERINGKAT ============ */}
          <section id="peringkat" aria-label={t.refSecLeaderboard}>
            <div className="refer-card">
              <div className="refer-section-head">
                <span className="refer-kicker"><Medal size={13} /> {t.refSecLeaderboard}</span>
                <h3>{t.refBoardTitle}</h3>
                <p className="desc">{t.refBoardDesc}</p>
              </div>
              {leaders.length ? (
                <div className="refer-board">
                  {leaders.slice(0, 10).map((row) => (
                    <div key={row.rank} className={`refer-board-row${row.you ? ' is-you' : ''}`}>
                      <span className={`refer-rank${row.rank <= 3 ? ` r${row.rank}` : ''}`}>{row.rank}</span>
                      <div><b>{row.name}{row.you && <span className="refer-you-tag">{t.refYou}</span>}</b><small>{t.refBoardQualified.replace('{n}', count(row.qualified_referrals))}</small></div>
                      <strong>{t.refBoardCoins.replace('{n}', count(row.total_points))}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="refer-empty">{t.refNoBoard}</p>
              )}
            </div>
          </section>

          {/* ============ DOMPET ============ */}
          <section id="dompet" aria-label={t.refSecWallet}>
            <div className="refer-grid-2">
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker"><Wallet size={13} /> {t.refSecWallet}</span>
                  <h3>{t.refWalletTitle}</h3>
                  <p className="desc">{t.refWalletDesc.replace('{n}', String(pointsPerRupiah)).replace('{m}', count(minimumRedemption))}</p>
                </div>
                {loggedIn === false ? (
                  <p className="refer-empty">{t.refWalletLogin}</p>
                ) : (
                  <>
                    <div className="refer-wallet-balance">
                      <b>{count(balance)} <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--theme-text-muted)' }}>{t.refWalletCoins}</span></b>
                      <span>≈ {money(Math.floor(balance / pointsPerRupiah))}</span>
                    </div>
                    <form className="refer-form" onSubmit={redeem}>
                      <label>{t.refRedeemAmount}
                        <input name="points" type="number" min={minimumRedemption} step={pointsPerRupiah} value={redeemPoints} onChange={(e) => setRedeemPoints(Number(e.target.value))} required />
                        <small>{t.refRedeemEstimate.replace('{amount}', money(Math.floor(redeemPoints / pointsPerRupiah)))}</small>
                      </label>
                      <label>{t.refRedeemMethod}
                        <select name="payout_method" required defaultValue="">
                          <option value="" disabled>{t.refRedeemMethodPick}</option>
                          <option value="bank_transfer">{t.refRedeemBank}</option>
                          <option value="ewallet">{t.refRedeemEwallet}</option>
                        </select>
                      </label>
                      <label>{t.refRedeemAccount}
                        <input name="payout_account" minLength={4} maxLength={80} required placeholder={t.refRedeemAccountPh} autoComplete="off" />
                        <small>{t.refRedeemAccountNote}</small>
                      </label>
                      <button className="refer-btn refer-btn-primary" type="submit" style={{ width: '100%' }}>
                        <Gift size={17} /> {t.refRedeemSubmit}
                      </button>
                    </form>
                  </>
                )}
              </div>
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker"><Users size={13} /> {t.refSecWallet}</span>
                  <h3>{t.refHistoryTitle}</h3>
                  <p className="desc">{t.refHistoryDesc}</p>
                </div>
                {redemptions.length ? (
                  <div className="refer-history">
                    {redemptions.map((item) => (
                      <div key={item.id} className="refer-history-row">
                        <div>
                          <b>{money(item.rupiah_amount)}</b>
                          <small>{t.refBoardCoins.replace('{n}', count(item.points))} · {item.created_at ? new Date(item.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : language, { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</small>
                        </div>
                        {statusChip(item.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="refer-empty">{t.refNoHistory.replace('{n}', count(minimumRedemption))}</p>
                )}
                {summary?.recent_activity?.length ? (
                  <>
                    <div className="refer-section-head" style={{ marginTop: 20 }}>
                      <h3 style={{ fontSize: 15 }}>{t.refRecentTitle}</h3>
                    </div>
                    <div className="refer-history">
                      {summary.recent_activity.slice(0, 5).map((ev, i) => (
                        <div key={`${ev.created_at}-${i}`} className="refer-history-row">
                          <div>
                            <b style={{ fontSize: 13 }}>{ev.event_type === 'qualified' ? t.refEvQualified : ev.event_type === 'signup' ? t.refEvSignup : t.refEvVisit}</b>
                            <small>{ev.source_channel || 'direct'} · {ev.created_at ? new Date(ev.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : language, { day: 'numeric', month: 'short' }) : ''}</small>
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
          <section id="bantuan" aria-label={t.refSecHelp}>
            <div className="refer-grid-2">
              <div className="refer-card">
                <div className="refer-section-head">
                  <span className="refer-kicker">{t.refHowKicker}</span>
                  <h3>{t.refHowTitle}</h3>
                </div>
                <div className="refer-steps" style={{ gridTemplateColumns: '1fr' }}>
                  {[
                    [t.refStep1T, t.refStep1D],
                    [t.refStep2T, t.refStep2D],
                    [t.refStep3T, t.refStep3D],
                    [t.refStep4T, t.refStep4D],
                  ].map(([st, sd], i) => (
                    <div key={st} className="refer-step" style={{ gridTemplateColumns: '32px 1fr', display: 'grid' }}>
                      <span className="num">{i + 1}</span>
                      <div><b>{st}</b><br /><span>{sd}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gap: 'clamp(16px, 2.5vw, 24px)', alignContent: 'start' }}>
                <div className="refer-card">
                  <div className="refer-section-head">
                    <span className="refer-kicker">{t.refFaqKicker}</span>
                    <h3>{t.refFaqTitle}</h3>
                  </div>
                  <div className="refer-faq">
                    {FAQ_KEYS.map(([qk, ak], i) => (
                      <div key={qk} className={`refer-faq-item${openFaq === i ? ' open' : ''}`}>
                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                          {t[qk]}<ChevronDown size={17} className="chev" />
                        </button>
                        <div className="answer"><p>{t[ak]}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="refer-card">
                  <div className="refer-section-head">
                    <span className="refer-kicker">{t.refRulesKicker}</span>
                    <h3>{t.refRulesTitle}</h3>
                  </div>
                  <ul className="refer-rules">
                    {RULE_KEYS.map(([tk, dk], i) => (
                      <li key={tk}><span className="rn">{String(i + 1).padStart(2, '0')}</span><span><b>{t[tk]}.</b> {t[dk]}</span></li>
                    ))}
                  </ul>
                  <p className="refer-note" style={{ marginTop: 14 }}>{t.refProgramNote.replace('{date}', campaign.endDate || '31 Des 2026')}</p>
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
