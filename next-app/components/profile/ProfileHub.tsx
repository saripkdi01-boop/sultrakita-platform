'use client';

import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Activity, Bell, Bookmark, ChevronLeft, ChevronRight, CircleHelp, Clock3, LogOut, Palette, Shield, Star, Store, UserRound, UsersRound, X } from 'lucide-react';
import Link from 'next/link';
import { SettingTab, useProfileStore, UserProfile, UserRole } from '@/store/profile';
import { apiErrorMessage } from '@/lib/api-client';
import { ActiveSessions } from '@/components/security/ActiveSessions';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { ActivityLogs } from '@/components/security/ActivityLogs';
import { BlockedUsers } from '@/components/security/BlockedUsers';
import { PrivacyCheckupWizard } from '@/components/security/PrivacyCheckupWizard';
import { ProfileVisibilitySettings } from '@/components/security/ProfileVisibilitySettings';
import { SellerAnalyticsCard } from '@/components/analytics/SellerAnalyticsCard';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import { csrfFetch } from '@/lib/security/csrf-client';
import { supabase } from '@/lib/supabase/client';
import { signOutAndRedirect } from '@/lib/auth/logout';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { mergeLabels } from '@/lib/i18n/dict-authprofile';

export function getCategories(t: Record<string, string>): { id: SettingTab; label: string; description: string; icon: typeof UserRound }[] {
  return [
    { id: 'account', label: t.profileCatAccount, description: t.profileCatAccountDesc, icon: UserRound },
    { id: 'privacy', label: t.profileCatPrivacy, description: t.profileCatPrivacyDesc, icon: Shield },
    { id: 'notifications', label: t.notifications, description: t.profileCatNotificationsDesc, icon: Bell },
    { id: 'security', label: t.profileCatSecurity, description: t.profileCatSecurityDesc, icon: Shield },
    { id: 'activity', label: t.profileCatActivity, description: t.profileCatActivityDesc, icon: Activity },
    { id: 'blocked', label: t.profileCatBlocked, description: t.profileCatBlockedDesc, icon: UsersRound },
    { id: 'appearance', label: t.profileCatAppearance, description: t.profileCatAppearanceDesc, icon: Palette },
    { id: 'seller', label: t.profileCatSeller, description: t.profileCatSellerDesc, icon: Store },
    { id: 'help', label: t.profileCatHelp, description: t.profileCatHelpDesc, icon: CircleHelp },
  ];
}
function getInterests(t: Record<string, string>): string[] {
  return [t.marketplace, t.profileInterestCulinary, t.profileInterestTravel, t.profileInterestUmkm, t.profileInterestMotor, t.property, t.profileInterestFashion, t.profileInterestHobby];
}

export function ProfileHub() {
  const { language } = usePreferences(); const t = mergeLabels(getCoreLabels(language), language);
  const { profile, menuOpen, setupOpen, settingsOpen, activeTab, toggleMenu, openSetup, closeOverlays, setProfile } = useProfileStore();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, profile: sessionProfile } = useSessionProfile();
  const displayName = getProfileNickname(user, sessionProfile);
  const avatarUrl = sessionProfile?.avatar_url || profile.avatar_url;
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeOverlays(); }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [closeOverlays]);
  useEffect(() => { if (!menuOpen) return; const onPointerDown = (event: PointerEvent) => { const target = event.target as Node; if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) closeOverlays(); }; document.addEventListener('pointerdown', onPointerDown); return () => document.removeEventListener('pointerdown', onPointerDown); }, [closeOverlays, menuOpen]);
  useEffect(() => { document.documentElement.classList.toggle('dark', profile.dark_mode); document.documentElement.classList.toggle('reduce-motion', profile.reduce_motion); }, [profile.dark_mode, profile.reduce_motion]);
  useEffect(() => { if (sessionProfile) setProfile({ full_name: sessionProfile.full_name || '', username: sessionProfile.username || '', avatar_url: sessionProfile.avatar_url || '', role: (sessionProfile.role as UserRole) || 'buyer', email: user?.email || '', bio: sessionProfile.bio || '', city: sessionProfile.city || '', district: sessionProfile.district || '' }); }, [sessionProfile, setProfile, user?.email]);
  return <>
    <div className="profile-hub-anchor"><button ref={triggerRef} className="profile-pill profile-hub-trigger" onClick={toggleMenu} aria-expanded={menuOpen} aria-controls="profile-menu" aria-haspopup="menu" aria-label={menuOpen ? t.profileMenuCloseAria.replace('{name}', displayName) : t.profileMenuOpenAria.replace('{name}', displayName)}><span className="avatar">{avatarUrl ? <img src={avatarUrl} alt={displayName}/> : initials}</span><span className="profile-name">{displayName.split(/\s+/)[0]}</span></button>{menuOpen && <div ref={menuRef}><ProfileMenu onClose={closeOverlays} onSetup={openSetup} onSettings={(tab) => { closeOverlays(); router.push(`/settings/${tab || 'account'}`); }} displayName={displayName} avatarUrl={avatarUrl} role={sessionProfile?.role || profile.role} city={sessionProfile?.district || ''}/></div>}</div>
    {(setupOpen || settingsOpen) && <ProfileOverlayPortal>{setupOpen ? <ProfileSetup onClose={closeOverlays} userId={user?.id}/> : <SettingsPanel onClose={closeOverlays} activeTab={activeTab} userId={user?.id}/>}</ProfileOverlayPortal>}
  </>;
}

function ProfileOverlayPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

 function ProfileMenu({ onClose, onSetup, onSettings, displayName, avatarUrl, role, city }: { onClose: () => void; onSetup: () => void; onSettings: (tab?: SettingTab) => void; displayName: string; avatarUrl: string; role?: string | null; city?: string }) { const { language } = usePreferences(); const t = mergeLabels(getCoreLabels(language), language); const { profile } = useProfileStore(); return <div id="profile-menu" className="profile-menu-panel shadow-float border border-line" role="menu"><div className="profile-menu-head"><div className="avatar large">{avatarUrl ? <img src={avatarUrl} alt=""/> : displayName.slice(0, 2).toUpperCase()}</div><div><strong>{displayName}</strong><small>{profile.email || t.profileVerifiedAccount}</small><span>{role === 'seller' ? t.profileRoleSeller : role === 'admin' ? t.profileRoleAdmin : t.profileRoleMember}{city ? ` · ${city}` : ''}</span></div></div><Link className="profile-marketplace-link" href="/marketplace/profile" onClick={onClose}><Store size={17}/> {t.profileMenuMarketplace} <ChevronRight size={15}/></Link><div className="profile-marketplace-shortcuts" aria-label={t.profileMenuShortcuts}><Link href="/marketplace/profile#saved" onClick={onClose} aria-label={t.profileMenuSavedAria}><Bookmark size={16}/><span>{t.profileMenuSaved}</span></Link>{/* Fase 0: shortcut Pesan (/chat) disembunyikan sementara. */}<Link href="/marketplace/profile#reviews" onClick={onClose} aria-label={t.profileMenuReviews}><Star size={16}/><span>{t.profileMenuReviews}</span></Link><Link href="/marketplace/profile#recent" onClick={onClose} aria-label={t.profileMenuHistoryAria}><Clock3 size={16}/><span>{t.profileMenuHistory}</span></Link></div><button role="menuitem" onClick={onSetup}><UserRound size={17}/> {t.profileMenuSetup} <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('account')}><UserRound size={17}/> Account Center <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('privacy')}><Shield size={17}/> {t.profileCatPrivacy} <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('notifications')}><Bell size={17}/> {t.notifications} <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('security')}><Shield size={17}/> {t.profileCatSecurity} <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('blocked')}><UsersRound size={17}/> {t.profileCatBlocked} <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('appearance')}><Palette size={17}/> {t.profileMenuAppearance} <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('seller')}><Store size={17}/> {t.profileMenuSeller} <ChevronRight size={15}/></button><button role="menuitem" onClick={() => onSettings('help')}><CircleHelp size={17}/> {t.profileCatHelp} <ChevronRight size={15}/></button><div className="profile-menu-separator"/><button className="danger-menu" role="menuitem" onClick={() => { onClose(); void signOutAndRedirect(); }}><LogOut size={17}/> {t.profileMenuLogout}</button></div> }

function ProfileSetup({ onClose, userId }: { onClose: () => void; userId?: string }) { const { language } = usePreferences(); const t = mergeLabels(getCoreLabels(language), language); const { profile, setProfile } = useProfileStore(); const [step, setStep] = useState(1); const [draft, setDraft] = useState(profile); const update = (key: keyof typeof draft, value: string) => setDraft({ ...draft, [key]: value }); const finish = async (event: FormEvent) => { event.preventDefault(); if (!userId || !supabase) { setProfile(draft); onClose(); window.dispatchEvent(new CustomEvent('sultra-toast', { detail: t.profileToastOfflineSaved })); return; } const payload = { full_name: draft.full_name.trim(), display_name: draft.username.trim() || draft.full_name.trim(), username: draft.username.trim().toLowerCase().replace(/\s+/g, '_') || null, bio: draft.bio.trim() || null, district: draft.district.trim() || null }; const { error } = await supabase.from('profiles').update(payload).eq('id', userId); if (error) { window.dispatchEvent(new CustomEvent('sultra-toast', { detail: t.profileToastSaveFailed })); return; } setProfile(draft); onClose(); window.dispatchEvent(new CustomEvent('sultra-profile-updated')); window.dispatchEvent(new CustomEvent('sultra-toast', { detail: t.profileToastSaved })); };  return <div className="profile-overlay"><form className="profile-dialog setup-dialog" onSubmit={finish}><header><div><span className="eyebrow">{t.profileSetupEyebrow}</span><h2>{t.profileSetupTitle}</h2><small>{t.profileSetupStep.replace('{step}', String(step))}</small></div><button type="button" onClick={onClose} aria-label={t.profileSetupCloseAria}><X size={19}/></button></header><div className="setup-progress"><i style={{ width: `${step * 25}%` }}/></div><div className="setup-content">{step === 1 && <><label>{t.profileSetupFullName}<input value={draft.full_name} onChange={e => update('full_name', e.target.value)} required/></label><label>{t.profileSetupUsername}<input value={draft.username} onChange={e => update('username', e.target.value)} placeholder={t.profileSetupUsernamePh}/></label><label>{t.profileSetupBio}<textarea value={draft.bio} onChange={e => update('bio', e.target.value)} rows={3} placeholder={t.profileSetupBioPh}/></label></>}{step === 2 && <><label>{t.profileSetupCity}<input value={draft.city} onChange={e => update('city', e.target.value)}/></label><label>{t.profileSetupDistrict}<input value={draft.district} onChange={e => update('district', e.target.value)}/></label><label>{t.profileSetupLanguage}<select value={draft.language} onChange={e => update('language', e.target.value)}><option>{t.profileSetupLangId}</option><option>{t.profileSetupLangMixed}</option></select></label></>}{step === 3 && <div><strong>{t.profileSetupInterests}</strong><p className="muted-copy">{t.profileSetupInterestsDesc}</p><div className="interest-grid">{getInterests(t).map(item => <button type="button" key={item} className={draft.interests.includes(item) ? 'selected' : ''} onClick={() => setDraft({ ...draft, interests: draft.interests.includes(item) ? draft.interests.filter(x => x !== item) : [...draft.interests, item] })}>{item}</button>)}</div></div>}{step === 4 && <div><strong>{t.profileSetupRoleTitle}</strong><div className="role-grid">{([['buyer', t.profileRoleBuyer], ['seller', t.profileRoleSellerFull], ['creator', t.profileRoleCreator], ['community', t.profileRoleCommunity]] as [UserRole, string][]).map(([value, label]) => <button type="button" key={value} className={draft.role === value ? 'selected' : ''} onClick={() => setDraft({ ...draft, role: value })}><b>{label}</b><small>{value === 'seller' ? t.profileRoleSellerDesc : t.profileRoleOtherDesc}</small></button>)}</div></div>}</div><footer><button type="button" className="text-link" onClick={onClose}>{t.profileSetupLater}</button><div>{step > 1 && <button type="button" className="soft-btn" onClick={() => setStep(step - 1)}><ChevronLeft size={15}/> {t.back}</button>}<button type={step === 4 ? 'submit' : 'button'} className="primary-btn" onClick={() => step < 4 && setStep(step + 1)}>{step === 4 ? t.profileSetupDone : t.next} <ChevronRight size={15}/></button></div></footer></form></div> }

function SettingsPanel({ onClose, activeTab, userId }: { onClose: () => void; activeTab: SettingTab; userId?: string }) { const { language } = usePreferences(); const t = mergeLabels(getCoreLabels(language), language); const [mobileDetail, setMobileDetail] = useState(false); const active = getCategories(t).find(item => item.id === activeTab) || getCategories(t)[0]; return <div className="profile-overlay"><div className="profile-dialog settings-dialog"><header><div><span className="eyebrow">Account Center</span><h2>{t.profileSettingsTitle}</h2></div><button onClick={onClose} aria-label={t.profileSettingsCloseAria}><X size={19}/></button></header><div className="settings-layout"><nav className={mobileDetail ? 'settings-nav mobile-hidden' : 'settings-nav'}>{getCategories(t).map(item => <button key={item.id} className={`${item.id === activeTab ? 'active' : ''}`} onClick={() => { useProfileStore.getState().setActiveTab(item.id); setMobileDetail(true); }}><item.icon size={17}/><span><b>{item.label}</b><small>{item.description}</small></span><ChevronRight size={15}/></button>)}</nav><section className={mobileDetail ? 'settings-detail' : 'settings-detail mobile-hidden'}><button className="settings-back" onClick={() => setMobileDetail(false)}><ChevronLeft size={15}/> {t.profileSettingsAll}</button><h3>{active.label}</h3><p className="muted-copy">{active.description}</p><SettingContent tab={activeTab} userId={userId}/></section></div></div></div> }

function PrivacySettingsContent() { const { language } = usePreferences(); const t = mergeLabels(getCoreLabels(language), language); const [checkup, setCheckup] = useState(false); return <>{checkup && <PrivacyCheckupWizard onClose={() => setCheckup(false)} onSaved={() => setCheckup(false)}/>}<div className="setting-form"><button className="primary-btn" onClick={() => setCheckup(true)}>{t.profilePrivacyCheckupCta}</button><ProfileVisibilitySettings/></div></> }
function ActivityLogContent() { return <ActivityLogs/> }
function ProfileEditForm({ userId }: { userId?: string }) { const { language } = usePreferences(); const t = mergeLabels(getCoreLabels(language), language);
  const { profile, setProfile } = useProfileStore();
  const [draft, setDraft] = useState({ full_name: profile.full_name, username: profile.username, bio: profile.bio, city: profile.city, district: profile.district, avatar_url: profile.avatar_url });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { setDraft({ full_name: profile.full_name, username: profile.username, bio: profile.bio, city: profile.city, district: profile.district, avatar_url: profile.avatar_url }); }, [profile.full_name, profile.username, profile.bio, profile.city, profile.district, profile.avatar_url]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setMessage(''); setError('');
    if (!file) return;
    if (!userId || !supabase) { setError(t.profileErrNoAccount); return; }
    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    if (!allowedTypes.has(file.type)) { setError(t.profileErrAvatarType); return; }
    if (file.size > 5 * 1024 * 1024) { setError(t.profileErrAvatarSize); return; }
    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => { if (current) URL.revokeObjectURL(current); return nextPreviewUrl; });
    setUploading(true);
    const formData = new FormData(); formData.append('avatar', file);
    // CSRF: route /api/profile/avatar dilindungi csrfProtected (server).
    const response = await csrfFetch('/api/profile/avatar', { method: 'POST', body: formData });
    const payload = await response.json().catch(() => ({}));
    setUploading(false);
    if (!response.ok || !payload.ok) { setError(apiErrorMessage(payload, t.profileErrAvatarProcess)); return; }
    const avatarUrl = String(payload.data?.avatar_url || '');
    setDraft(current => ({ ...current, avatar_url: avatarUrl }));
    setProfile({ avatar_url: avatarUrl });
    window.dispatchEvent(new CustomEvent('sultra-profile-updated'));
    setMessage(t.profileAvatarSaved.replace('{w}', String(payload.data?.width || 512)).replace('{h}', String(payload.data?.height || 512)));
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setMessage(''); setError('');
    const fullName = draft.full_name.trim(); const username = draft.username.trim().toLowerCase().replace(/\s+/g, '_');
    if (!userId || !supabase) { setError(t.profileErrNoAccount); return; }
    if (!fullName) { setError(t.profileErrNameRequired); return; }
    setSaving(true);
    const { data, error: updateError } = await supabase.from('profiles').update({ full_name: fullName, display_name: fullName, username: username || null, bio: draft.bio.trim() || null, district: draft.district.trim() || null, avatar_url: draft.avatar_url.trim() || null }).eq('id', userId).select('full_name,username,bio,district,avatar_url').single();
    setSaving(false);
    if (updateError) { setError(updateError.code === '23505' ? t.profileErrUsernameTaken : t.profileErrSaveFailed); return; }
    setProfile({ full_name: data.full_name || fullName, username: data.username || '', bio: data.bio || '', city: draft.city, district: data.district || '', avatar_url: data.avatar_url || '' });
    window.dispatchEvent(new CustomEvent('sultra-profile-updated'));
    setMessage(t.profileToastSaved);
  }
  return <form className="setting-form" onSubmit={save}>
    <div className="profile-avatar-editor"><div className="profile-avatar-preview">{(previewUrl || draft.avatar_url) ? <img src={previewUrl || draft.avatar_url} alt={t.profilePhotoPreviewAlt} /> : profile.full_name.slice(0, 2).toUpperCase()}</div><div><strong>{t.profilePhotoTitle}</strong><small>{t.profilePhotoHint}</small><label className="profile-upload-button"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadAvatar} disabled={uploading || saving} />{uploading ? t.profilePhotoUploading : t.profilePhotoUpload}</label><small>{t.profilePhotoPrivacyNote}</small></div></div>
    <label>{t.profileSetupFullName}<input value={draft.full_name} onChange={e => setDraft({ ...draft, full_name: e.target.value })} required /></label><label>{t.profileSetupUsername}<input value={draft.username} onChange={e => setDraft({ ...draft, username: e.target.value.replace(/\s/g, '_') })} placeholder={t.profileSetupUsernamePh} /></label><label>{t.profileEmail}<input value={profile.email} readOnly placeholder={t.profileEmailEmpty} /></label><label>{t.profileSetupBio}<textarea value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} rows={3} placeholder={t.profileSetupBioPh} /></label><label>{t.profileSetupCity}<input value={draft.city} onChange={e => setDraft({ ...draft, city: e.target.value })} placeholder={t.profileCityPh} /></label><label>{t.profileSetupDistrict}<input value={draft.district} onChange={e => setDraft({ ...draft, district: e.target.value })} placeholder={t.profileDistrictPh} /></label>{error && <p className="profile-form-message error" role="alert">{error}</p>}{message && <p className="profile-form-message success" role="status">{message}</p>}<button className="primary-btn" type="submit" disabled={saving || uploading}>{saving ? t.profileSaving : t.profileSaveChanges}</button>
  </form>
}
export function SettingContent({ tab, userId }: { tab: SettingTab; userId?: string }) { const { language } = usePreferences(); const t = mergeLabels(getCoreLabels(language), language); const { profile, setProfile } = useProfileStore(); if (tab === 'account') return <ProfileEditForm userId={userId}/>; if (tab === 'privacy') return <PrivacySettingsContent/>; if (tab === 'security') return <ActiveSessions/>; if (tab === 'blocked') return <BlockedUsers/>; if (tab === 'activity') return <ActivityLogContent/>; if (tab === 'notifications') return <div className="setting-rows"><ToggleRow label={t.profileNotifPush} description={t.profileNotifPushDesc} value={profile.push_notifications} onChange={value => setProfile({ push_notifications: value })}/><ToggleRow label={t.profileEmail} description={t.profileNotifEmailDesc} value={profile.email_notifications} onChange={value => setProfile({ email_notifications: value })}/></div>; if (tab === 'appearance') return <div className="setting-rows"><div className="setting-row"><div><b>{t.language}</b><small>{t.profileAppearanceLanguageDesc}</small></div><LanguageSwitcher variant="select" showLabel={false} /></div><ToggleRow label={t.darkMode} description={t.profileAppearanceDarkDesc} value={profile.dark_mode} onChange={value => setProfile({ dark_mode: value })}/><ToggleRow label={t.profileAppearanceMotion} description={t.profileAppearanceMotionDesc} value={profile.reduce_motion} onChange={value => setProfile({ reduce_motion: value })}/><label>{t.profileAppearanceAutoplay}<select value={profile.autoplay} onChange={e => setProfile({ autoplay: e.target.value as UserProfile['autoplay'] })}><option value="always">{t.profileAutoplayAlways}</option><option value="wifi">{t.profileAutoplayWifi}</option><option value="never">{t.profileAutoplayNever}</option></select></label></div>; if (tab === 'seller') return userId ? <SellerAnalyticsCard sellerId={userId}/> : <div className="setting-empty"><Store size={28}/><h3>{t.profileSellerTitle}</h3><p>{t.profileSellerDesc}</p><button className="primary-btn">{t.profileSellerVerify}</button></div>; return <div className="setting-empty"><CircleHelp size={28}/><h3>{t.profileHelpTitle}</h3><p>{t.profileHelpDesc}</p><button className="soft-btn">{t.profileHelpCta}</button></div> }
function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (value: boolean) => void }) { return <div className="setting-row"><div><b>{label}</b><small>{description}</small></div><button type="button" className={`toggle ${value ? 'on' : ''}`} aria-pressed={value} onClick={() => onChange(!value)}><i/></button></div> }
