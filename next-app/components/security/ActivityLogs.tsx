'use client';
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { getActivityLogs } from '@/lib/actions/security';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

type Log = { id: string; activity_type: string; activity_data: Record<string, unknown>; created_at: string };

export function ActivityLogs() {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const [items, setItems] = useState<Log[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const labels: Record<string, string> = {
    login: t.actTypeLogin,
    post_created: t.actTypePost,
    profile_updated: t.actTypeProfile,
    setting_changed: t.actTypeSetting,
    security_event: t.actTypeSecurity,
  };

  useEffect(() => {
    getActivityLogs().then(result => {
      setItems(result.data as Log[]);
      if (!result.ok) setMessage(result.error || t.actUnavailable);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locale = language === 'id' ? 'id-ID' : language;

  return (
    <div className="security-card">
      <div className="security-card-head">
        <div><span className="eyebrow">{t.actEyebrow}</span><h3>{t.actTitle}</h3></div>
        <Activity size={20} />
      </div>
      {loading ? <p className="security-empty">{t.actLoading}</p> : items.length ? (
        <div className="session-list">
          {items.map(item => (
            <div className="session-row" key={item.id}>
              <span className="session-icon"><Activity size={17} /></span>
              <span><strong>{labels[item.activity_type] || item.activity_type}</strong><small>{new Date(item.created_at).toLocaleString(locale)}</small></span>
            </div>
          ))}
        </div>
      ) : (
        <div className="security-empty"><Activity size={28} /><strong>{t.actEmpty}</strong><p>{t.actEmptyDesc}</p></div>
      )}
      {message && <p className="security-feedback" role="status">{message}</p>}
    </div>
  );
}
