'use client';
import { useEffect, useMemo, useState } from 'react';
import { Ban, Search, UserRoundX } from 'lucide-react';
import { getBlockedUsers, unblockUser } from '@/lib/actions/security';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

type Blocked = { id: string; blocked_id: string; created_at: string; profiles?: { full_name?: string; username?: string; avatar_url?: string } | null };

export function BlockedUsers() {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const [items, setItems] = useState<Blocked[]>([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlockedUsers().then(result => {
      setItems(result.data as Blocked[]);
      if (!result.ok) setMessage(result.error || t.blUnavailable);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () => items.filter(item => `${item.profiles?.full_name || ''} ${item.profiles?.username || ''}`.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  async function unblock(item: Blocked) {
    const name = item.profiles?.full_name || t.blDefaultName;
    if (!window.confirm(t.blConfirm.replace('{name}', name))) return;
    const result = await unblockUser(item.blocked_id);
    if (result.ok) {
      setItems(current => current.filter(row => row.id !== item.id));
      setMessage(t.blUnblocked);
    } else setMessage(result.error || t.blFailed);
  }

  const locale = language === 'id' ? 'id-ID' : language;

  return (
    <div className="security-card">
      <div className="security-card-head">
        <div><span className="eyebrow">{t.blEyebrow}</span><h3>{t.blTitle}</h3></div>
        <Ban size={20} />
      </div>
      <div className="security-search">
        <Search size={15} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.blSearch} aria-label={t.blSearch} />
      </div>
      {loading ? <p className="security-empty">{t.blLoading}</p> : filtered.length ? (
        <div className="blocked-list">
          {filtered.map(item => (
            <div className="blocked-row" key={item.id}>
              <span className="avatar">{(item.profiles?.full_name || 'U').slice(0, 2).toUpperCase()}</span>
              <span>
                <strong>{item.profiles?.full_name || t.blUser}</strong>
                <small>@{item.profiles?.username || t.blAccount} · {t.blBlockedOn} {new Date(item.created_at).toLocaleDateString(locale)}</small>
              </span>
              <button className="danger-btn" onClick={() => unblock(item)}>{t.blUnblock}</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="security-empty"><UserRoundX size={28} /><strong>{t.blEmpty}</strong><p>{t.blEmptyDesc}</p></div>
      )}
      {message && <p className="security-feedback" role="status">{message}</p>}
    </div>
  );
}
