'use client';

import { useEffect, useState } from 'react';
import { Eye, Info, LockKeyhole, Users } from 'lucide-react';
import { getVisibilitySettings, saveVisibilitySettings } from '@/lib/actions/privacy';
import type { VisibilityLevel, VisibilitySettings } from '@/lib/privacy-defaults';
import { useSessionProfile } from '@/hooks/useSessionProfile';

const fields = [
  { key: 'avatar', label: 'Foto profil', help: 'Foto yang tampil di profil dan posting publik.' },
  { key: 'full_name', label: 'Nama lengkap', help: 'Nama yang membantu warga mengenalimu.' },
  { key: 'username', label: 'Username', help: 'Nama unik untuk tautan profil publik.' },
  { key: 'bio', label: 'Bio', help: 'Cerita singkat tentang siapa kamu.' },
  { key: 'phone', label: 'Nomor WhatsApp', help: 'Kontak langsung untuk kebutuhan yang kamu izinkan.' },
  { key: 'email', label: 'Email', help: 'Alamat email akun dan pemulihan.' },
  { key: 'location', label: 'Lokasi', help: 'Kota atau distrik yang kamu tampilkan.' },
  { key: 'interests', label: 'Minat', help: 'Topik yang membantu rekomendasi lebih relevan.' },
  { key: 'online_status', label: 'Status online', help: 'Apakah warga lain dapat melihat kamu sedang aktif.' },
] as const;
const labels = { public: 'Publik', followers: 'Pengikut', private: 'Hanya saya' } as const;
const descriptions = { public: 'Semua warga dapat melihat', followers: 'Hanya pengikut yang dapat melihat', private: 'Tidak ditampilkan ke warga lain' } as const;

export function ProfileVisibilitySettings() {
  const { nickname, profile } = useSessionProfile();
  const [settings, setSettings] = useState<VisibilitySettings>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => { let active = true; getVisibilitySettings().then((result) => { if (!active) return; setSettings(result.data); if (!result.ok) setMessage(result.error || 'Pengaturan privasi belum tersedia.'); setLoading(false); }); return () => { active = false; }; }, []);
  async function save() { setSaving(true); const result = await saveVisibilitySettings(settings); setSaving(false); setMessage(result.ok ? 'Visibilitas profil tersimpan dan akan dipakai pada profil publik.' : result.error || 'Belum dapat disimpan.'); }
  return <div className="security-card"><div className="security-card-head"><div><span className="eyebrow">Privasi granular</span><h3>Atur siapa yang dapat melihat profilmu</h3><p className="muted-copy">Pengaturan ini berlaku per informasi. Pilihan <strong>Pengikut</strong> tidak ditampilkan kepada pengunjung anonim.</p></div><Eye size={20} aria-hidden="true" /></div>{loading ? <p className="security-empty" role="status">Memuat pengaturan privasi dari akunmu...</p> : <fieldset className="visibility-list"><legend className="visually-hidden">Visibilitas setiap informasi profil</legend>{fields.map((field) => { const value = settings[field.key] || 'private'; return <div className="visibility-row" key={field.key}><span className={`visibility-icon ${value}`} aria-hidden="true">{value === 'public' ? <Eye size={14} /> : value === 'followers' ? <Users size={14} /> : <LockKeyhole size={14} />}</span><span className="visibility-label"><b>{field.label}</b><small>{field.help}</small></span><label className="visually-hidden" htmlFor={`visibility-${field.key}`}>{`Siapa yang dapat melihat ${field.label}`}</label><select id={`visibility-${field.key}`} value={value} onChange={(event) => setSettings({ ...settings, [field.key]: event.target.value as VisibilityLevel })}>{Object.entries(labels).map(([option, label]) => <option key={option} value={option}>{label} — {descriptions[option as VisibilityLevel]}</option>)}</select></div>; })}</fieldset>}<div className="visibility-preview"><Info size={16} aria-hidden="true" /><div><strong>Preview profil publik</strong><p>{settings.username === 'private' || settings.full_name === 'private' ? 'Nama disembunyikan' : nickname} · {settings.location === 'private' ? 'Lokasi disembunyikan' : (profile?.district || profile?.city || 'Lokasi belum diatur')}</p></div></div><button className="primary-btn" disabled={saving || loading} onClick={() => void save()}>{saving ? 'Menyimpan ke akun...' : 'Simpan pengaturan privasi'}</button>{message && <p className="security-feedback" role="status" aria-live="polite">{message}</p>}</div>;
}
