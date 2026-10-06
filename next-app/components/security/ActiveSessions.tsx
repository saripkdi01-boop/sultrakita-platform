'use client';
import { useEffect, useState } from 'react';
import { Laptop, LogOut, Smartphone, Tablet } from 'lucide-react';
import { getActiveSessions, logoutAllOtherSessions, logoutSession } from '@/lib/actions/security';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

type Session = { id: string; device_info?: { device?: string; browser?: string; os?: string; type?: string }; location?: string; is_current: boolean; last_active_at: string };

function DeviceIcon({ type }: { type?: string }) {
  return type === 'mobile' ? <Smartphone size={19} /> : type === 'tablet' ? <Tablet size={19} /> : <Laptop size={19} />;
}

export function ActiveSessions() {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const [items, setItems] = useState<Session[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveSessions().then(result => {
      setItems(result.data as Session[]);
      if (!result.ok) setMessage(result.error || t.sessUnavailable);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout(id: string) {
    const result = await logoutSession(id);
    if (result.ok) {
      setItems(current => current.filter(item => item.id !== id));
      setMessage(t.sessLoggedOut);
    } else setMessage(result.error || t.sessLogoutFailed);
  }

  async function logoutOthers() {
    if (!window.confirm(t.sessConfirmOthers)) return;
    const result = await logoutAllOtherSessions();
    if (result.ok) {
      setItems(current => current.filter(item => item.is_current));
      setMessage(t.sessOthersLoggedOut);
    } else setMessage(result.error || t.sessOthersFailed);
  }

  const locale = language === 'id' ? 'id-ID' : language;

  return (
    <div className="security-card">
      <div className="security-card-head">
        <div><span className="eyebrow">{t.sessEyebrow}</span><h3>{t.sessTitle}</h3></div>
        <button className="danger-btn" onClick={logoutOthers}><LogOut size={14} /> {t.sessLogoutOthers}</button>
      </div>
      {loading ? <p className="security-empty">{t.sessLoading}</p> : items.length ? (
        <div className="session-list">
          {items.map(item => (
            <div className="session-row" key={item.id}>
              <span className="session-icon"><DeviceIcon type={item.device_info?.type} /></span>
              <span>
                <strong>{item.device_info?.device || t.sessDevice} · {item.device_info?.browser || t.sessBrowser}</strong>
                <small>{item.device_info?.os || t.sessUnknownOs} · {item.location || t.sessUnknownLoc} · {t.sessActiveAt} {new Date(item.last_active_at).toLocaleString(locale)}</small>
              </span>
              {item.is_current ? <b className="current-badge">{t.sessCurrent}</b> : <button className="text-link" onClick={() => logout(item.id)}>{t.sessLogout}</button>}
            </div>
          ))}
        </div>
      ) : (
        <div className="security-empty"><Laptop size={28} /><strong>{t.sessEmpty}</strong><p>{t.sessEmptyDesc}</p></div>
      )}
      {message && <p className="security-feedback" role="status">{message}</p>}
    </div>
  );
}
