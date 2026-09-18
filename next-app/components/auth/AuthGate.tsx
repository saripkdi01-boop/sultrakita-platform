'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ArrowRight, Check, ChevronDown, Eye, EyeOff, Facebook, Globe2, LockKeyhole,
  Mail, ShieldCheck, Sparkles, UserRound, X, BriefcaseBusiness, House,
  ShoppingBag, UsersRound
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

const GOOGLE_OAUTH_GATEWAY_URL = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_GATEWAY_URL || '';
const MAX_SIGNUP_AVATAR_BYTES = 5 * 1024 * 1024;

function prepareSignupAvatar(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const size = Math.min(image.naturalWidth, image.naturalHeight);
      const sx = (image.naturalWidth - size) / 2;
      const sy = (image.naturalHeight - size) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = 512; canvas.height = 512;
      const context = canvas.getContext('2d');
      if (!context) { URL.revokeObjectURL(objectUrl); reject(new Error('Canvas tidak tersedia.')); return; }
      context.drawImage(image, sx, sy, size, size, 0, 0, 512, 512);
      canvas.toBlob(blob => {
        URL.revokeObjectURL(objectUrl);
        if (!blob) { reject(new Error('Foto tidak dapat diproses.')); return; }
        resolve(new File([blob], 'profile-avatar.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.88);
    };
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Foto tidak dapat dibaca.')); };
    image.src = objectUrl;
  });
}

function safeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/dashboard';
  const pathname = value.split('?')[0];
  return pathname === '/login' || pathname === '/signup' || pathname === '/auth/callback' ? '/dashboard' : value;
}

type Mode = 'login' | 'signup';
type Language = { code: string; label: string; native: string };

const languages: Language[] = [
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' }, { code: 'en', label: 'English', native: 'English' },
  { code: 'zh', label: 'Chinese', native: '中文' }, { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es', label: 'Spanish', native: 'Español' }, { code: 'fr', label: 'French', native: 'Français' },
  { code: 'ar', label: 'Arabic', native: 'العربية' }, { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'pt', label: 'Portuguese', native: 'Português' }, { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'ja', label: 'Japanese', native: '日本語' }, { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'ko', label: 'Korean', native: '한국어' }, { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe' }, { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'th', label: 'Thai', native: 'ไทย' }, { code: 'pl', label: 'Polish', native: 'Polski' },
  { code: 'uk', label: 'Ukrainian', native: 'Українська' }, { code: 'nl', label: 'Dutch', native: 'Nederlands' },
  { code: 'ms', label: 'Malay', native: 'Bahasa Melayu' }, { code: 'fa', label: 'Persian', native: 'فارسی' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili' }, { code: 'tl', label: 'Filipino', native: 'Filipino' },
];

const copy = {
  id: {
    login: 'Selamat datang kembali', signup: 'Bangun ruangmu di SultraKita',
    sub: 'Satu pintu untuk warga, usaha, dan cerita Sulawesi Tenggara.',
    loginCta: 'Masuk ke SultraKita', signupCta: 'Buat akun gratis',
    gmail: 'Lanjutkan dengan Google', facebook: 'Lanjutkan dengan Facebook'
  },
  en: {
    login: 'Welcome back', signup: 'Build your space on SultraKita',
    sub: 'One home for people, businesses, and stories from Southeast Sulawesi.',
    loginCta: 'Enter SultraKita', signupCta: 'Create free account',
    gmail: 'Continue with Google', facebook: 'Continue with Facebook'
  }
} as const;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="/" aria-label="SultraKita home" className="group flex items-center gap-2.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[13px] bg-[#0d4b43] shadow-[0_8px_24px_rgba(13,75,67,.16)] ring-1 ring-black/5">
        <img src="/brand/suki-logo-mark.svg" alt="" className="h-7 w-7 object-contain" />
      </span>
      {!compact && <span className="font-display text-[21px] font-bold tracking-[-.035em] text-[#123b35]">Sultra<span className="text-[#188875]">Kita</span></span>}
    </a>
  );
}

function strength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const fieldClass = 'auth-input h-12 w-full rounded-[14px] border border-[#dce8e3] bg-[#fbfdfc] pl-11 pr-4 text-[14px] font-medium text-[#173f39] outline-none transition placeholder:text-[#9aada8] hover:border-[#c5dad3] focus:border-[#188875] focus:bg-white focus:ring-4 focus:ring-[#188875]/10';

export function AuthGate({ initialMode = 'login' }: { initialMode?: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [language, setLanguage] = useState('id');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<'email'|'google'|'facebook'|null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [signupAvatar, setSignupAvatar] = useState<File | null>(null);
  const [signupAvatarPreview, setSignupAvatarPreview] = useState('');
  const [remember, setRemember] = useState(true);

  const selectedLanguage = languages.find(item => item.code === language) || languages[0];
  const t = copy[language === 'en' ? 'en' : 'id'];
  const score = useMemo(() => strength(password), [password]);

  useEffect(() => {
    if (params.get('error')) setError('Sesi sosial belum dapat diselesaikan. Coba lagi atau gunakan email.');
  }, [params]);

  function changeMode(next: Mode) {
    setMode(next); setError(''); setNotice('');
    router.replace(next === 'login' ? '/login' : '/signup');
  }

  async function selectSignupAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Foto profil harus JPG, PNG, WebP, atau GIF.'); return;
    }
    if (file.size > MAX_SIGNUP_AVATAR_BYTES) { setError('Ukuran foto profil maksimal 5 MB.'); return; }
    try {
      const processed = await prepareSignupAvatar(file);
      setSignupAvatar(processed); setSignupAvatarPreview(URL.createObjectURL(processed)); setError('');
    } catch { setError('Foto profil tidak dapat diproses. Coba pilih foto lain.'); }
  }

  async function saveSignupAvatar(userId: string, file: File) {
    const objectPath = `${userId}/${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await supabase!.storage.from('avatars').upload(objectPath, file, {
      cacheControl: '3600', contentType: 'image/jpeg', upsert: false
    });
    if (uploadError) throw uploadError;
    const { data } = supabase!.storage.from('avatars').getPublicUrl(objectPath);
    const { error: profileError } = await supabase!.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', userId);
    if (profileError) throw profileError;
  }

  async function social(provider: 'google'|'facebook') {
    setBusy(provider); setError('');
    const next = safeRedirect(params.get('redirect'));
    if (provider === 'google' && GOOGLE_OAUTH_GATEWAY_URL) {
      const gateway = new URL(GOOGLE_OAUTH_GATEWAY_URL, window.location.origin);
      gateway.searchParams.set('next', next);
      window.location.assign(gateway.toString()); return;
    }
    if (!supabase) { setBusy(null); setError('Autentikasi belum dikonfigurasi di environment ini.'); return; }
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` }
    });
    if (authError) { setBusy(null); setError(authError.message); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setError('Autentikasi belum dikonfigurasi di environment ini.'); return; }
    setBusy('email'); setError(''); setNotice('');
    if (mode === 'signup') {
      if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        setError('Username minimal 3 karakter dan hanya boleh berisi huruf, angka, atau underscore.'); setBusy(null); return;
      }
      if (password !== confirm) { setError('Konfirmasi password belum cocok.'); setBusy(null); return; }
      if (score < 4) { setError('Gunakan password dengan 8+ karakter, huruf besar, angka, dan simbol.'); setBusy(null); return; }
      const { data, error: authError } = await supabase.auth.signUp({
        email, password, options: { data: { username, full_name: fullName } }
      });
      if (authError) setError(authError.message);
      else if (data.session) {
        if (signupAvatar && data.user) {
          try { await saveSignupAvatar(data.user.id, signupAvatar); }
          catch { setNotice('Akun berhasil dibuat. Foto belum tersimpan, kamu bisa menggantinya di Pengaturan Profil.'); }
        }
        router.push('/');
      } else {
        setNotice(signupAvatar
          ? 'Link verifikasi sudah dikirim. Setelah akun aktif, unggah foto profil dari Pengaturan Profil.'
          : 'Link verifikasi sudah dikirim ke email kamu. Buka email tersebut untuk mengaktifkan akun.');
      }
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
      else router.push(safeRedirect(params.get('redirect')));
    }
    setBusy(null);
  }

  async function forgot() {
    if (!supabase || !email) { setError('Masukkan email terlebih dahulu untuk reset password.'); return; }
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` });
    if (authError) setError(authError.message);
    else setNotice('Link reset password sudah dikirim jika email terdaftar.');
  }

  return (
    <main className="min-h-[100svh] bg-[#f6faf8] text-[#163e38] selection:bg-[#bcebdc] selection:text-[#123b35]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#d8f4e9] blur-3xl opacity-70" />
        <div className="absolute -bottom-48 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#f3e8cb] blur-3xl opacity-60" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d7eae3] opacity-50" />
      </div>

      <header className="relative mx-auto flex w-full max-w-[1240px] items-center justify-between px-5 py-5 sm:px-7 lg:px-8">
        <Logo />
        <div className="relative">
          <button
            type="button" onClick={() => setLanguageOpen(value => !value)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d9e7e2] bg-white/80 px-3.5 text-xs font-bold text-[#41645d] shadow-sm backdrop-blur transition hover:border-[#bcd5cd] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#188875]/10"
            aria-expanded={languageOpen} aria-haspopup="listbox" aria-label="Pilih bahasa"
          >
            <Globe2 size={15} className="text-[#188875]" /> {selectedLanguage.native} <ChevronDown size={14} />
          </button>
          {languageOpen && (
            <div role="listbox" aria-label="Bahasa" className="absolute right-0 z-30 mt-2 max-h-80 w-64 overflow-y-auto rounded-2xl border border-[#dce9e4] bg-white p-1.5 shadow-[0_18px_50px_rgba(19,65,57,.16)]">
              {languages.map(item => (
                <button
                  type="button" role="option" aria-selected={item.code === language} key={item.code}
                  onClick={() => { setLanguage(item.code); setLanguageOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-[#edf8f3] focus:outline-none focus:ring-2 focus:ring-[#188875]/20 ${item.code === language ? 'bg-[#edf8f3] font-bold text-[#123f38]' : 'text-[#516f68]'}`}
                >
                  <span>{item.native}</span><small className="text-[11px] text-[#94a7a2]">{item.label}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-8 px-5 pb-8 pt-2 sm:px-7 lg:min-h-[calc(100svh-80px)] lg:grid-cols-[1fr_470px] lg:gap-16 lg:px-8 lg:pb-10">
        <section className="hidden lg:block">
          <div className="max-w-[590px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d7e9e2] bg-white/65 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#39776c] backdrop-blur">
              <Sparkles size={14} /> Ekosistem digital Sulawesi Tenggara
            </div>
            <h1 className="font-display text-[clamp(3.4rem,5vw,5.4rem)] font-black leading-[.94] tracking-[-.055em] text-[#103e37]">
              Satu ruang untuk
              <span className="mt-2 block text-[#188875]">banyak kemungkinan.</span>
            </h1>
            <p className="mt-7 max-w-[500px] text-[16px] leading-7 text-[#607d76]">
              Temukan marketplace lokal, properti, peluang kerja, komunitas, dan bisnis dalam satu pengalaman yang dekat dengan kehidupan Sultra.
            </p>

            <div className="mt-10 grid max-w-[550px] grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { icon: ShoppingBag, label: 'Marketplace' },
                { icon: House, label: 'Properti' },
                { icon: BriefcaseBusiness, label: 'Peluang kerja' },
                { icon: UsersRound, label: 'Komunitas' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl border border-[#deebe6] bg-white/70 p-3.5 shadow-[0_8px_30px_rgba(21,73,64,.05)] backdrop-blur">
                  <Icon size={17} className="text-[#188875]" />
                  <span className="mt-8 block text-xs font-bold text-[#355951]">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#718b85]">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e3f4ed]"><ShieldCheck size={15} className="text-[#188875]" /></span>
              Akun dan sesi autentikasi diproses melalui alur aman SUKI Apps.
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[470px] rounded-[26px] border border-white/90 bg-white/95 p-4 shadow-[0_24px_80px_rgba(18,70,61,.13)] backdrop-blur-xl sm:p-5 lg:p-6">
          <div className="mb-5 flex items-center justify-between lg:hidden"><Logo compact /></div>

          <div className="grid grid-cols-2 rounded-[15px] bg-[#eef6f2] p-1" aria-label="Mode autentikasi">
            <button type="button" onClick={() => changeMode('login')} aria-current={mode === 'login'} className={`min-h-10 rounded-[11px] text-[13px] font-extrabold transition focus:outline-none focus:ring-2 focus:ring-[#188875]/20 ${mode === 'login' ? 'bg-white text-[#153e38] shadow-sm' : 'text-[#718a84] hover:text-[#476961]'}`}>Masuk</button>
            <button type="button" onClick={() => changeMode('signup')} aria-current={mode === 'signup'} className={`min-h-10 rounded-[11px] text-[13px] font-extrabold transition focus:outline-none focus:ring-2 focus:ring-[#188875]/20 ${mode === 'signup' ? 'bg-white text-[#153e38] shadow-sm' : 'text-[#718a84] hover:text-[#476961]'}`}>Daftar</button>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-[28px] font-black leading-tight tracking-[-.035em] text-[#123d36]">{mode === 'login' ? t.login : t.signup}</h2>
            <p className="mt-2 text-[13px] leading-5 text-[#718983]">{t.sub}</p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <button type="button" disabled={!!busy} onClick={() => void social('google')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[13px] border border-[#dce8e3] bg-white px-2.5 text-[12px] font-extrabold text-[#38564f] transition hover:-translate-y-px hover:border-[#c6d9d2] hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-[#188875]/10 disabled:cursor-wait disabled:opacity-50">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-[#e5ebe8] bg-white text-[13px] font-black text-[#4285f4]">G</span>
              {busy === 'google' ? '...' : t.gmail}
            </button>
            <button type="button" disabled={!!busy} onClick={() => void social('facebook')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[13px] bg-[#1877f2] px-2.5 text-[12px] font-extrabold text-white transition hover:-translate-y-px hover:bg-[#166de0] focus:outline-none focus:ring-4 focus:ring-[#1877f2]/20 disabled:cursor-wait disabled:opacity-50">
              <Facebook size={16} fill="currentColor" /> {busy === 'facebook' ? '...' : 'Facebook'}
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#a0b1ac]">
            <span className="h-px flex-1 bg-[#e7efec]" /> atau email <span className="h-px flex-1 bg-[#e7efec]" />
          </div>

          <form onSubmit={submit} className="space-y-2.5">
            {mode === 'signup' && (
              <>
                <div className="relative">
                  <label className="sr-only" htmlFor="fullName">Nama lengkap</label>
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78938c]" size={16} aria-hidden="true" />
                  <input id="fullName" required value={fullName} onChange={event => setFullName(event.target.value)} className={fieldClass} placeholder="Nama lengkap" autoComplete="name" />
                </div>
                <div className="relative">
                  <label className="sr-only" htmlFor="username">Username</label>
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-black text-[#78938c]" aria-hidden="true">@</span>
                  <input id="username" required value={username} onChange={event => setUsername(event.target.value.toLowerCase())} className={fieldClass} placeholder="Username" autoComplete="username" />
                </div>

                <div className="flex items-center gap-3 rounded-[14px] border border-[#dce8e3] bg-[#fbfdfc] p-2.5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e6f6ef] text-[11px] font-black text-[#188875]">
                    {signupAvatarPreview ? <img src={signupAvatarPreview} alt="Pratinjau foto profil" className="h-full w-full object-cover" /> : fullName.slice(0, 2).toUpperCase() || 'FK'}
                  </div>
                  <label className="min-w-0 flex-1 cursor-pointer">
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={selectSignupAvatar} className="sr-only" disabled={!!busy} />
                    <span className="block text-[12px] font-extrabold text-[#188875]">{signupAvatar ? 'Ganti foto profil' : 'Tambahkan foto profil'}</span>
                    <small className="mt-0.5 block text-[10px] leading-4 text-[#819891]">Opsional · JPG, PNG, WebP, GIF · maks. 5 MB</small>
                  </label>
                </div>
              </>
            )}

            <div className="relative">
              <label className="sr-only" htmlFor="email">Email</label>
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78938c]" size={16} aria-hidden="true" />
              <input id="email" type="email" required value={email} onChange={event => setEmail(event.target.value)} className={fieldClass} placeholder="Email kamu" autoComplete="email" />
            </div>

            <div className="relative">
              <label className="sr-only" htmlFor="password">Password</label>
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78938c]" size={16} aria-hidden="true" />
              <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={event => setPassword(event.target.value)} className={`${fieldClass} pr-11`} placeholder="Password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#78938c] hover:bg-[#edf6f2] focus:outline-none focus:ring-2 focus:ring-[#188875]/20" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === 'signup' && (
              <>
                <div className="flex gap-1.5 pt-0.5" aria-label={`Kekuatan password: ${score} dari 4`}>
                  {[1, 2, 3, 4].map(item => (
                    <span key={item} className={`h-1.5 flex-1 rounded-full transition-colors ${score >= item ? (score >= 4 ? 'bg-[#188875]' : score >= 2 ? 'bg-[#d9ad4e]' : 'bg-[#d67d69]') : 'bg-[#e7efec]'}`} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-[#7e958f]">
                  {[
                    [password.length >= 8, '8+ karakter'], [/[A-Z]/.test(password), 'Huruf besar'],
                    [/[0-9]/.test(password), 'Angka'], [/[^A-Za-z0-9]/.test(password), 'Simbol']
                  ].map(([ok, label]) => <span key={label as string} className={ok ? 'text-[#188875]' : ''}>{ok ? <Check size={11} className="mr-1 inline" /> : <X size={11} className="mr-1 inline" />}{label as string}</span>)}
                </div>
                <div className="relative">
                  <label className="sr-only" htmlFor="confirm">Konfirmasi password</label>
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78938c]" size={16} aria-hidden="true" />
                  <input id="confirm" type={showPassword ? 'text' : 'password'} required value={confirm} onChange={event => setConfirm(event.target.value)} className={fieldClass} placeholder="Konfirmasi password" autoComplete="new-password" />
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between px-0.5 text-[11px]">
                <label className="inline-flex items-center gap-2 text-[#718983]">
                  <input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} className="h-3.5 w-3.5 rounded accent-[#188875] focus:ring-[#188875]" />
                  Ingat saya
                </label>
                <button type="button" onClick={() => void forgot()} className="font-extrabold text-[#188875] hover:underline focus:outline-none focus:ring-2 focus:ring-[#188875]/20">Lupa password?</button>
              </div>
            )}

            {error && <div role="alert" className="rounded-[13px] border border-[#f4d9d3] bg-[#fff7f5] p-3 text-[11px] leading-5 text-[#a84f40]">{error}</div>}
            {notice && <div role="status" className="rounded-[13px] border border-[#d0eadf] bg-[#f0faf5] p-3 text-[11px] leading-5 text-[#187461]">{notice}</div>}

            <button type="submit" disabled={!!busy} className="group mt-0.5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#103f38] px-4 text-[13px] font-extrabold text-white shadow-[0_10px_26px_rgba(16,63,56,.17)] transition hover:-translate-y-px hover:bg-[#15594f] focus:outline-none focus:ring-4 focus:ring-[#188875]/20 disabled:cursor-wait disabled:opacity-60">
              {busy === 'email' ? 'Memproses...' : mode === 'login' ? t.loginCta : t.signupCta}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-4 text-center text-[10px] leading-4.5 text-[#8ba29c]">
            Dengan melanjutkan, kamu menyetujui <a href="/legal/terms" className="font-extrabold text-[#188875] hover:underline">Ketentuan</a> dan <a href="/legal/privacy" className="font-extrabold text-[#188875] hover:underline">Kebijakan Privasi</a> SultraKita.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 border-t border-[#edf2f0] pt-3.5 text-[10px] font-semibold text-[#8ba29c]">
            <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-[#188875]" /> SSL Secure</span>
            <span className="flex items-center gap-1"><LockKeyhole size={12} className="text-[#188875]" /> Data terlindungi</span>
          </div>
        </section>
      </div>
    </main>
  );
}
