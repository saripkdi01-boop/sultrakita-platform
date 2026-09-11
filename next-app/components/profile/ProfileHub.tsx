'use client';

import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Activity, Bell, Bookmark, ChevronLeft, ChevronRight, CircleHelp, Clock3, LogOut, MessageCircle, Palette, Shield, Star, Store, UserRound, UsersRound, X } from 'lucide-react';
import Link from 'next/link';
import { SettingTab, useProfileStore, UserProfile, UserRole } from '@/store/profile';
import { ActiveSessions } from '@/components/security/ActiveSessions';
import { ActivityLogs } from '@/components/security/ActivityLogs';
import { BlockedUsers } from '@/components/security/BlockedUsers';
import { PrivacyCheckupWizard } from '@/components/security/PrivacyCheckupWizard';
import { ProfileVisibilitySettings } from '@/components/security/ProfileVisibilitySettings';
import { SellerAnalyticsCard } from '@/components/analytics/SellerAnalyticsCard';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import { supabase } from '@/lib/supabase/client';

const categories: { id: SettingTab; label: string; description: string; icon: typeof UserRound }[] = [
  { id: 'account', label: 'Akun dan profil', description: 'Nama, kontak, bio, dan identitas lokal', icon: UserRound },
  { id: 'privacy', label: 'Privasi', description: 'Visibility per field dan Privacy Checkup', icon: Shield },
  { id: 'notifications', label: 'Notifikasi', description: 'Atur kabar dari aktivitas dan komunitas', icon: Bell },
  { id: 'security', label: 'Keamanan', description: 'Sesi aktif dan login akun', icon: Shield },
  { id: 'activity', label: 'Aktivitas & Log', description: 'Tinjau aktivitas keamanan akun', icon: Activity },
  { id: 'blocked', label: 'Blokir & Batasi', description: 'Kelola pengguna yang diblokir', icon: UsersRound },
  { id: 'appearance', label: 'Tampilan', description: 'Tema, video, bahasa, dan aksesibilitas', icon: Palette },
  { id: 'seller', label: 'Seller dan toko', description: 'Pengaturan jualan dan operasional toko', icon: Store },
  { id: 'help', label: 'Bantuan dan feedback', description: 'Pusat bantuan dan laporan masalah', icon: CircleHelp },
];
const interests = ['Marketplace', 'Kuliner', 'Wisata', 'UMKM', 'Motor', 'Properti', 'Fashion', 'Hobi'];

function prepareAvatar(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const sourceUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      const size = Math.min(image.naturalWidth, image.naturalHeight);
      const sx = (image.naturalWidth - size) / 2;
      const sy = (image.naturalHeight - size) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = 512; canvas.height = 512;
      const context = canvas.getContext('2d');
      if (!context) { reject(new Error('Canvas tidak tersedia.')); return; }
      context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
      context.drawImage(image, sx, sy, size, size, 0, 0, 512, 512);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Foto tidak dapat diproses.')); return; }
        resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg', lastModified: Date.now() }));
      }, 'image/jpeg', 0.88);
    };
    image.onerror = () => { URL.revokeObjectURL(sourceUrl); reject(new Error('Foto tidak dapat dibaca.')); };
    image.src = sourceUrl;
  });
}

export function ProfileHub() {
  const { profile, menuOpen, setupOpen, settingsOpen, activeTab, toggleMenu, openSetup, openSettings, closeOverlays, setProfile } = useProfileStore();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, profile: sessionProfile } = useSessionProfile();
  const displayName = getProfileNickname(user, sessionProfile);
  const avatarUrl = sessionProfile?.avatar_url || profile.avatar_url;
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeOverlays(); }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [closeOverlays]);
  useEffect(() => { if (!menuOpen) return; const onPointerDown = (event: PointerEvent) => { const target = event.target as Node; if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) closeOverlays(); }; document.addEventListener('pointerdown', onPointerDown); return () => document.removeEventListener('pointerdown', onPointerDown); }, [closeOverlays, menuOpen]);
  useEffect(() => { document.documentElement.classList.toggle('dark', profile.dark_mode); document.documentElement.classList.toggle('reduce-motion', profile.reduce_motion); }, [profile.dark_mode, profile.reduce_motion]);
  useEffect(() => { if (sessionProfile) setProfile({ full_name: sessionProfile.full_name || '', username: sessionProfile.username || '', avatar_url: sessionProfile.avatar_url || '', role: (sessionProfile.role as UserRole) || 'buyer', email: user?.email || '', bio: sessionProfile.bio || '', city: '', district: sessionProfile.district || '' }); }, [sessionProfile, setProfile, user?.email]);
  return <>
    <div className="profile-hub-anchor"><button ref={triggerRef} className="profile-pill profile-hub-trigger" onClick={toggleMenu} aria-expanded={menuOpen} aria-controls="profile-menu" aria-haspopup="menu" aria-label={`${menuOpen ? 'Tutup' : 'Buka'} menu profil ${displayName}`}><span className="avatar">{avatarUrl ? <img src={avatarUrl} alt={displayName}/> : initials}</span><span className="profile-name">{displayName.split(/\s+/)[0]}</span></button>{menuOpen && <div ref={menuRef}><ProfileMenu onClose={closeOverlays} onSetup={openSetup} onSettings={openSettings} displayName={displayName} avatarUrl={avatarUrl} role={sessionProfile?.role || profile.role} city={sessionProfile?.district || ''}/></div>}</div>
    {(setupOpen || settingsOpen) && <ProfileOverlayPortal>{setupOpen ? <ProfileSetup onClose={closeOverlays} userId={user?.id}/> : <SettingsPanel onClose={closeOverlays} activeTab={activeTab} userId={user?.id}/>}</ProfileOverlayPortal>}
  </>;
}

function ProfileOverlayPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

function ProfileMenu({ onClose, onSetup, onSettings, displayName, avatarUrl, role, city }: { onClose: () => void; onSetup: () => void; onSettings: (tab?: SettingTab) => void; displayName: string; avatarUrl: string; role?: string | null; city?: string }) { const { profile } = useProfileStore(); return <div id="profile-menu" className="profile-menu-panel shadow-float border border-line" role="menu"><div className="profile-menu-head"><div className="avatar large">{avatarUrl ? <img src={avatarUrl} alt=""/> : displayName.slice(0, 2).toUpperCase()}</div><div><strong>{displayName}</strong><small>{profile.email || 'Akun terverifikasi dari login'}</small><span>{role === 'seller' ? 'Seller' : role === 'admin' ? 'Admin' : 'Warga'}{city ? ` · ${city}` : ''}</span></div></div><Link className="profile-marketplace-link" href="/marketplace/profile" onClick={onClose}><Store size={17}/> Profil Marketplace <ChevronRight size={15}/></Link><div className="profile-marketplace-shortcuts" aria-label="Shortcut Marketplace"><Link href="/marketplace/profile#saved" onClick={onClose} aria-label="Item tersimpan"><Bookmark size={16}/><span>Tersimpan</span></Link><Link href="/chat" onClick={onClose} aria-label="Kotak masuk"><MessageCircle size={16}/><span>Pesan</span></Link><Link href="/marketplace/profile#reviews" onClick={onClose} aria-label="Ulasan"><Star size={16}/><span>Ulasan</span></Link><Link href="/marketplace/profile#recent" onClick={onClose} aria-label="Baru saja dilihat"><Clock3 size={16}/><span>Riwayat</span></Link></div><button role="menuitem" onClick={onSetup}><UserRound size={17}/> Setup profil <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('account')}><UserRound size={17}/> Account Center <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('privacy')}><Shield size={17}/> Privasi <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('notifications')}><Bell size={17}/> Notifikasi <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('security')}><Shield size={17}/> Keamanan <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('blocked')}><UsersRound size={17}/> Blokir & Batasi <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('appearance')}><Palette size={17}/> Preferensi tampilan <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('seller')}><Store size={17}/> Pengaturan seller <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('help')}><CircleHelp size={17}/> Bantuan & feedback <ChevronRight size={15}/></button><div className="profile-menu-separator"/><button className="danger-menu" role="menuitem" onClick={async () => { onClose(); if (supabase) await supabase.auth.signOut(); window.location.href = '/login'; }}><LogOut size={17}/> Keluar</button></div> }

function ProfileSetup({ onClose, userId }: { onClose: () => void; userId?: string }) { const { profile, setProfile } = useProfileStore(); const [step, setStep] = useState(1); const [draft, setDraft] = useState(profile); const update = (key: keyof typeof draft, value: string) => setDraft({ ...draft, [key]: value }); const finish = async (event: FormEvent) => { event.preventDefault(); if (!userId || !supabase) { setProfile(draft); onClose(); window.dispatchEvent(new CustomEvent('sultra-toast', { detail: 'Profil tersimpan di perangkat; akun belum terhubung.' })); return; } const payload = { full_name: draft.full_name.trim(), display_name: draft.username.trim() || draft.full_name.trim(), username: draft.username.trim().toLowerCase().replace(/\s+/g, '_') || null, bio: draft.bio.trim() || null, city: draft.city.trim() || null, district: draft.district.trim() || null }; const { error } = await supabase.from('profiles').update(payload).eq('id', userId); if (error) { window.dispatchEvent(new CustomEvent('sultra-toast', { detail: 'Profil belum tersimpan. Periksa koneksi lalu coba lagi.' })); return; } setProfile(draft); onClose(); window.dispatchEvent(new CustomEvent('sultra-profile-updated')); window.dispatchEvent(new CustomEvent('sultra-toast', { detail: 'Profil berhasil disimpan ke Supabase.' })); };  return <div className="profile-overlay"><form className="profile-dialog setup-dialog" onSubmit={finish}><header><div><span className="eyebrow">Setup profil</span><h2>Kenalkan dirimu ke warga</h2><small>Langkah {step} dari 4</small></div><button type="button" onClick={onClose} aria-label="Tutup setup profil"><X size={19}/></button></header><div className="setup-progress"><i style={{ width: `${step * 25}%` }}/></div><div className="setup-content">{step === 1 && <><label>Nama lengkap (untuk data akun)<input value={draft.full_name} onChange={e => update('full_name', e.target.value)} required/></label><label>Nama panggilan / username<input value={draft.username} onChange={e => update('username', e.target.value)} placeholder="contoh: maya atau maya_kendari"/></label><label>Bio singkat<textarea value={draft.bio} onChange={e => update('bio', e.target.value)} rows={3} placeholder="Ceritakan sedikit tentang dirimu"/></label></>}{step === 2 && <><label>Kota/kabupaten<input value={draft.city} onChange={e => update('city', e.target.value)}/></label><label>Distrik<input value={draft.district} onChange={e => update('district', e.target.value)}/></label><label>Bahasa utama<select value={draft.language} onChange={e => update('language', e.target.value)}><option>Bahasa Indonesia</option><option>Indonesia dan bahasa daerah</option></select></label></>}{step === 3 && <div><strong>Minat komunitas</strong><p className="muted-copy">Pilih topik agar feed SultraKita lebih relevan.</p><div className="interest-grid">{interests.map(item => <button type="button" key={item} className={draft.interests.includes(item) ? 'selected' : ''} onClick={() => setDraft({ ...draft, interests: draft.interests.includes(item) ? draft.interests.filter(x => x !== item) : [...draft.interests, item] })}>{item}</button>)}</div></div>}{step === 4 && <div><strong>Saya bergabung sebagai</strong><div className="role-grid">{([['buyer', 'Pembeli'], ['seller', 'Seller / UMKM'], ['creator', 'Kreator konten'], ['community', 'Organisasi komunitas']] as [UserRole, string][]).map(([value, label]) => <button type="button" key={value} className={draft.role === value ? 'selected' : ''} onClick={() => setDraft({ ...draft, role: value })}><b>{label}</b><small>{value === 'seller' ? 'Jual produk atau jasa lokal' : 'Bangun pengalaman warga'}</small></button>)}</div></div>}</div><footer><button type="button" className="text-link" onClick={onClose}>Simpan nanti</button><div>{step > 1 && <button type="button" className="soft-btn" onClick={() => setStep(step - 1)}><ChevronLeft size={15}/> Kembali</button>}<button type={step === 4 ? 'submit' : 'button'} className="primary-btn" onClick={() => step < 4 && setStep(step + 1)}>{step === 4 ? 'Selesai' : 'Lanjut'} <ChevronRight size={15}/></button></div></footer></form></div> }

function SettingsPanel({ onClose, activeTab, userId }: { onClose: () => void; activeTab: SettingTab; userId?: string }) { const [mobileDetail, setMobileDetail] = useState(false); const active = categories.find(item => item.id === activeTab) || categories[0]; return <div className="profile-overlay"><div className="profile-dialog settings-dialog"><header><div><span className="eyebrow">Account Center</span><h2>Pengaturan SultraKita</h2></div><button onClick={onClose} aria-label="Tutup pengaturan"><X size={19}/></button></header><div className="settings-layout"><nav className={mobileDetail ? 'settings-nav mobile-hidden' : 'settings-nav'}>{categories.map(item => <button key={item.id} className={`${item.id === activeTab ? 'active' : ''}`} onClick={() => { useProfileStore.getState().setActiveTab(item.id); setMobileDetail(true); }}><item.icon size={17}/><span><b>{item.label}</b><small>{item.description}</small></span><ChevronRight size={15}/></button>)}</nav><section className={mobileDetail ? 'settings-detail' : 'settings-detail mobile-hidden'}><button className="settings-back" onClick={() => setMobileDetail(false)}><ChevronLeft size={15}/> Semua pengaturan</button><h3>{active.label}</h3><p className="muted-copy">{active.description}</p><SettingContent tab={activeTab} userId={userId}/></section></div></div></div> }

function PrivacySettingsContent() { const [checkup, setCheckup] = useState(false); return <>{checkup && <PrivacyCheckupWizard onClose={() => setCheckup(false)} onSaved={() => setCheckup(false)}/>}<div className="setting-form"><button className="primary-btn" onClick={() => setCheckup(true)}>Mulai Privacy Checkup</button><ProfileVisibilitySettings/></div></> }
function ActivityLogContent() { return <ActivityLogs/> }
function ProfileEditForm({ userId }: { userId?: string }) {
  const { profile, setProfile } = useProfileStore();
  const [draft, setDraft] = useState({ full_name: profile.full_name, username: profile.username, bio: profile.bio, district: profile.district, avatar_url: profile.avatar_url });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { setDraft({ full_name: profile.full_name, username: profile.username, bio: profile.bio, district: profile.district, avatar_url: profile.avatar_url }); }, [profile.full_name, profile.username, profile.bio, profile.district, profile.avatar_url]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setMessage(''); setError('');
    if (!file) return;
    if (!userId || !supabase) { setError('Profil belum terhubung ke akun Supabase.'); return; }
    if (!file.type.startsWith('image/')) { setError('Pilih file gambar JPG, PNG, WebP, atau GIF.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Ukuran foto maksimal 5 MB.'); return; }
    let processedFile: File;
    try { processedFile = await prepareAvatar(file); } catch { setError('Foto tidak dapat diproses. Coba pilih foto lain.'); return; }
    const nextPreviewUrl = URL.createObjectURL(processedFile);
    setPreviewUrl((current) => { if (current) URL.revokeObjectURL(current); return nextPreviewUrl; });
    const objectPath = `${userId}/${crypto.randomUUID()}.jpg`;
    setUploading(true);
    const { error: uploadError } = await supabase.storage.from('avatars').upload(objectPath, processedFile, { cacheControl: '3600', contentType: 'image/jpeg', upsert: false });
    if (uploadError) { setUploading(false); setError('Foto gagal diunggah. Pastikan bucket avatars dan izin storage sudah tersedia.'); return; }
    const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(objectPath);
    const avatarUrl = publicData.publicUrl;
    const { error: profileError } = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', userId);
    setUploading(false);
    if (profileError) { setError('Foto berhasil diunggah tetapi profil gagal diperbarui. Tekan simpan lagi.'); return; }
    setDraft(current => ({ ...current, avatar_url: avatarUrl }));
    setProfile({ avatar_url: avatarUrl });
    window.dispatchEvent(new CustomEvent('sultra-profile-updated'));
    setMessage('Foto profil berhasil diunggah ke Supabase Storage.');
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setMessage(''); setError('');
    const fullName = draft.full_name.trim(); const username = draft.username.trim().toLowerCase().replace(/\s+/g, '_');
    if (!userId || !supabase) { setError('Profil belum terhubung ke akun Supabase.'); return; }
    if (!fullName) { setError('Nama lengkap wajib diisi.'); return; }
    setSaving(true);
    const { data, error: updateError } = await supabase.from('profiles').update({ full_name: fullName, display_name: fullName, username: username || null, bio: draft.bio.trim() || null, district: draft.district.trim() || null, avatar_url: draft.avatar_url.trim() || null }).eq('id', userId).select('full_name,username,bio,district,avatar_url').single();
    setSaving(false);
    if (updateError) { setError(updateError.code === '23505' ? 'Username tersebut sudah digunakan.' : 'Profil gagal disimpan. Periksa koneksi dan izin akun.'); return; }
    setProfile({ full_name: data.full_name || fullName, username: data.username || '', bio: data.bio || '', district: data.district || '', avatar_url: data.avatar_url || '' });
    window.dispatchEvent(new CustomEvent('sultra-profile-updated'));
    setMessage('Profil berhasil disimpan ke Supabase.');
  }
  return <form className="setting-form" onSubmit={save}>
    <div className="profile-avatar-editor"><div className="profile-avatar-preview">{(previewUrl || draft.avatar_url) ? <img src={previewUrl || draft.avatar_url} alt="Pratinjau foto profil" /> : profile.full_name.slice(0, 2).toUpperCase()}</div><div><strong>Foto profil</strong><small>Foto dipotong persegi dan di-resize ke 512×512 px sebelum upload.</small><label className="profile-upload-button"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadAvatar} disabled={uploading || saving} />{uploading ? 'Mengunggah...' : 'Unggah foto'}</label></div></div>
    <label>Nama lengkap (untuk data akun)<input value={draft.full_name} onChange={e => setDraft({ ...draft, full_name: e.target.value })} required /></label><label>Nama panggilan / username<input value={draft.username} onChange={e => setDraft({ ...draft, username: e.target.value.replace(/\s/g, '_') })} placeholder="contoh: maya atau maya_kendari" /></label><label>Email<input value={profile.email} readOnly placeholder="Belum ditambahkan" /></label><label>Bio<textarea value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} rows={3} placeholder="Ceritakan sedikit tentang dirimu" /></label><label>Distrik<input value={draft.district} onChange={e => setDraft({ ...draft, district: e.target.value })} placeholder="Contoh: Kendari" /></label><label>URL foto profil<input type="url" value={draft.avatar_url} onChange={e => setDraft({ ...draft, avatar_url: e.target.value })} placeholder="https://..." /></label>{error && <p className="profile-form-message error" role="alert">{error}</p>}{message && <p className="profile-form-message success" role="status">{message}</p>}<button className="primary-btn" type="submit" disabled={saving || uploading}>{saving ? 'Menyimpan...' : 'Simpan perubahan'}</button>
  </form>
}
function SettingContent({ tab, userId }: { tab: SettingTab; userId?: string }) { const { profile, setProfile } = useProfileStore(); if (tab === 'account') return <ProfileEditForm userId={userId}/>; if (tab === 'privacy') return <PrivacySettingsContent/>; if (tab === 'security') return <ActiveSessions/>; if (tab === 'blocked') return <BlockedUsers/>; if (tab === 'activity') return <ActivityLogContent/>; if (tab === 'notifications') return <div className="setting-rows"><ToggleRow label="Notifikasi push" description="Dapatkan kabar aktivitas penting." value={profile.push_notifications} onChange={value => setProfile({ push_notifications: value })}/><ToggleRow label="Email" description="Ringkasan aktivitas melalui email." value={profile.email_notifications} onChange={value => setProfile({ email_notifications: value })}/></div>; if (tab === 'appearance') return <div className="setting-rows"><ToggleRow label="Mode gelap" description="Gunakan tampilan gelap di seluruh aplikasi." value={profile.dark_mode} onChange={value => setProfile({ dark_mode: value })}/><ToggleRow label="Kurangi animasi" description="Kurangi gerakan untuk pengalaman yang lebih nyaman." value={profile.reduce_motion} onChange={value => setProfile({ reduce_motion: value })}/><label>Autoplay Reels<select value={profile.autoplay} onChange={e => setProfile({ autoplay: e.target.value as UserProfile['autoplay'] })}><option value="always">Selalu</option><option value="wifi">Hanya Wi-Fi</option><option value="never">Nonaktif</option></select></label></div>; if (tab === 'seller') return userId ? <SellerAnalyticsCard sellerId={userId}/> : <div className="setting-empty"><Store size={28}/><h3>Mode seller</h3><p>Masuk dengan akun Supabase untuk melihat performa toko.</p><button className="primary-btn">Mulai verifikasi</button></div>; return <div className="setting-empty"><CircleHelp size={28}/><h3>Bagaimana kami dapat membantu?</h3><p>Lihat FAQ, laporkan masalah, atau kirim saran untuk SultraKita.</p><button className="soft-btn">Buka pusat bantuan</button></div> }
function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (value: boolean) => void }) { return <div className="setting-row"><div><b>{label}</b><small>{description}</small></div><button type="button" className={`toggle ${value ? 'on' : ''}`} aria-pressed={value} onClick={() => onChange(!value)}><i/></button></div> }
