'use client';

import { useEffect, useState } from 'react';
import { Eye, Info, LockKeyhole, Users } from 'lucide-react';
import { getVisibilitySettings, saveVisibilitySettings } from '@/lib/actions/privacy';
import type { VisibilityLevel, VisibilitySettings } from '@/lib/privacy-defaults';
import { useSessionProfile } from '@/hooks/useSessionProfile';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

export function ProfileVisibilitySettings() {
  const { nickname, profile } = useSessionProfile();
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const [settings, setSettings] = useState<VisibilitySettings>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fields = [
    { key: 'avatar', label: t.pvFieldAvatar, help: t.pvFieldAvatarHelp },
    { key: 'full_name', label: t.pvFieldFullName, help: t.pvFieldFullNameHelp },
    { key: 'username', label: t.pvFieldUsername, help: t.pvFieldUsernameHelp },
    { key: 'bio', label: t.pvFieldBio, help: t.pvFieldBioHelp },
    { key: 'phone', label: t.pvFieldPhone, help: t.pvFieldPhoneHelp },
    { key: 'email', label: t.pvFieldEmail, help: t.pvFieldEmailHelp },
    { key: 'location', label: t.pvFieldLocation, help: t.pvFieldLocationHelp },
    { key: 'interests', label: t.pvFieldInterests, help: t.pvFieldInterestsHelp },
    { key: 'online_status', label: t.pvFieldOnline, help: t.pvFieldOnlineHelp },
  ] as const;
  const labels = { public: t.pvLevelPublic, followers: t.pvLevelFollowers, private: t.pvLevelPrivate } as const;
  const descriptions = { public: t.pvDescPublic, followers: t.pvDescFollowers, private: t.pvDescPrivate } as const;

  useEffect(() => {
    let active = true;
    getVisibilitySettings().then((result) => {
      if (!active) return;
      setSettings(result.data);
      if (!result.ok) setMessage(result.error || t.pvUnavailable);
      setLoading(false);
    });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setSaving(true);
    const result = await saveVisibilitySettings(settings);
    setSaving(false);
    setMessage(result.ok ? t.pvSaved : result.error || t.pvFailed);
  }

  const nameShown = settings.username === 'private' || settings.full_name === 'private' ? t.pvNameHidden : nickname;
  const locShown = settings.location === 'private' ? t.pvLocHidden : (profile?.district || profile?.city || t.pvLocUnset);

  return (
    <div className="security-card">
      <div className="security-card-head">
        <div>
          <span className="eyebrow">{t.pvEyebrow}</span>
          <h3>{t.pvTitle}</h3>
          <p className="muted-copy">{t.pvDesc.replace('{followers}', t.pvFollowersWord)}</p>
        </div>
        <Eye size={20} aria-hidden="true" />
      </div>
      {loading ? (
        <p className="security-empty" role="status">{t.pvLoading}</p>
      ) : (
        <fieldset className="visibility-list">
          <legend className="visually-hidden">{t.pvTitle}</legend>
          {fields.map((field) => {
            const value = settings[field.key] || 'private';
            return (
              <div className="visibility-row" key={field.key}>
                <span className={`visibility-icon ${value}`} aria-hidden="true">
                  {value === 'public' ? <Eye size={14} /> : value === 'followers' ? <Users size={14} /> : <LockKeyhole size={14} />}
                </span>
                <span className="visibility-label"><b>{field.label}</b><small>{field.help}</small></span>
                <label className="visually-hidden" htmlFor={`visibility-${field.key}`}>{t.pvWhoCanSee.replace('{field}', field.label)}</label>
                <select id={`visibility-${field.key}`} value={value} onChange={(event) => setSettings({ ...settings, [field.key]: event.target.value as VisibilityLevel })}>
                  {Object.entries(labels).map(([option, label]) => <option key={option} value={option}>{label} — {descriptions[option as VisibilityLevel]}</option>)}
                </select>
              </div>
            );
          })}
        </fieldset>
      )}
      <div className="visibility-preview">
        <Info size={16} aria-hidden="true" />
        <div><strong>{t.pvPreview}</strong><p>{nameShown} · {locShown}</p></div>
      </div>
      <button className="primary-btn" disabled={saving || loading} onClick={() => void save()}>{saving ? t.pvSaving : t.pvSave}</button>
      {message && <p className="security-feedback" role="status" aria-live="polite">{message}</p>}
    </div>
  );
}
