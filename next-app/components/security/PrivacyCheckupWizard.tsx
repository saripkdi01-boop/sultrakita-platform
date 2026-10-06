'use client';
import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, LockKeyhole, X } from 'lucide-react';
import { saveVisibilitySettings } from '@/lib/actions/privacy';
import type { VisibilityLevel, VisibilitySettings } from '@/lib/privacy-defaults';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

type Props = { initial?: VisibilitySettings; onClose: () => void; onSaved?: () => void };

export function PrivacyCheckupWizard({ initial = {}, onClose, onSaved }: Props) {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<VisibilitySettings>({ full_name: 'public', bio: 'public', location: 'public', phone: 'followers', ...initial });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const fields = [
    { key: 'full_name', label: t.pcFieldFullName },
    { key: 'bio', label: t.pcFieldBio },
    { key: 'location', label: t.pcFieldLocation },
    { key: 'phone', label: t.pcFieldPhone },
  ];
  const levels: { value: VisibilityLevel; label: string }[] = [
    { value: 'public', label: t.pcLevelPublic },
    { value: 'followers', label: t.pcLevelFollowers },
    { value: 'private', label: t.pcLevelPrivate },
  ];

  async function save() {
    setSaving(true);
    const result = await saveVisibilitySettings(settings);
    setSaving(false);
    setMessage(result.ok ? t.pcSaved : result.error || t.pcSaveFailed);
    if (result.ok) onSaved?.();
  }

  const previewLabel = settings.full_name === 'public' ? t.pcVisiblePublic : settings.full_name === 'followers' ? t.pcVisibleFollowers : t.pcVisibleOnlyYou;

  return (
    <div className="security-overlay" role="dialog" aria-modal="true" aria-labelledby="privacy-checkup-title">
      <div className="security-dialog">
        <header>
          <div><span className="eyebrow">Privacy Checkup</span><h2 id="privacy-checkup-title">{t.pcTitle}</h2></div>
          <button className="dialog-close" onClick={onClose} aria-label={t.pcClose}><X size={18} /></button>
        </header>
        <div className="security-progress"><i style={{ width: `${(step / 3) * 100}%` }} /></div>
        <div className="security-step">
          <small>{t.pcStepOf.replace('{step}', String(step))}</small>
          {step === 1 && (
            <>
              <h3>{t.pcStep1Title}</h3>
              <p className="muted-copy">{t.pcStep1Desc}</p>
              <div className="privacy-preview"><LockKeyhole size={18} /><strong>{previewLabel}</strong><span>{t.pcPreviewNote}</span></div>
              {fields.map(field => (
                <label className="privacy-row" key={field.key}>
                  <span>{field.label}</span>
                  <select value={settings[field.key]} onChange={e => setSettings({ ...settings, [field.key]: e.target.value as VisibilityLevel })}>
                    {levels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                  </select>
                </label>
              ))}
            </>
          )}
          {step === 2 && (
            <>
              <h3>{t.pcStep2Title}</h3>
              <p className="muted-copy">{t.pcStep2Desc}</p>
              <div className="security-choice">
                <strong>{t.pcWhoCanMessage}</strong>
                {levels.map(level => <button className={settings.messaging === level.value ? 'selected' : ''} key={level.value} onClick={() => setSettings({ ...settings, messaging: level.value })}>{level.label}</button>)}
              </div>
              <div className="privacy-preview"><Check size={18} /><span>{t.pcChangeAnytime}</span></div>
            </>
          )}
          {step === 3 && (
            <>
              <h3>{t.pcStep3Title}</h3>
              <p className="muted-copy">{t.pcStep3Desc}</p>
              <div className="security-choice">
                <strong>{t.pcShowOnlineTo}</strong>
                {levels.map(level => <button className={settings.online_status === level.value ? 'selected' : ''} key={level.value} onClick={() => setSettings({ ...settings, online_status: level.value })}>{level.label}</button>)}
              </div>
              <label className="privacy-row"><span>{t.pcAllowTag}</span><input type="checkbox" defaultChecked aria-label={t.pcAllowTag} /></label>
            </>
          )}
        </div>
        <footer>
          <button className="text-link" onClick={onClose}>{t.pcSkip}</button>
          <div>
            <button className="ghost-btn dark" disabled={step === 1} onClick={() => setStep(Math.max(1, step - 1))}><ChevronLeft size={15} /> {t.pcBack}</button>
            {step < 3 ? (
              <button className="primary-btn" onClick={() => setStep(step + 1)}>{t.pcNext} <ChevronRight size={15} /></button>
            ) : (
              <button className="primary-btn" disabled={saving} onClick={save}>{saving ? t.pcSaving : t.pcSave}</button>
            )}
          </div>
        </footer>
        {message && <p className="security-feedback" role="status">{message}</p>}
      </div>
    </div>
  );
}
