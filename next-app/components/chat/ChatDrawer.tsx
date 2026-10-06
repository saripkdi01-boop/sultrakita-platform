'use client';

import { MessageCircle, X } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';
import { dictChatNews } from '@/lib/i18n/dict-chatnews';
import { ChatWindow } from './ChatWindow';
type Props = { open: boolean; onClose: () => void; conversationId?: string; currentUserId?: string; sellerName?: string };
export function ChatDrawer({ open, onClose, conversationId, currentUserId, sellerName = 'Seller SultraKita' }: Props) {
  const { language } = usePreferences();
  const t = dictChatNews[language] ?? dictChatNews.id;
  if (!open) return null;
  return <div className="chat-drawer-layer" role="dialog" aria-modal="true" aria-label={t.chatWithName.replace('{name}', sellerName)}>
    <aside className="chat-drawer"><header><div><span className="eyebrow">{t.chatDirectMessage}</span><h2>{sellerName}</h2></div><button onClick={onClose} aria-label={t.chatCloseChat}><X size={18}/></button></header>
      {conversationId && currentUserId ? <ChatWindow conversationId={conversationId} currentUserId={currentUserId}/> : <div className="chat-login-state bg-sultra-mint/40 text-sultra-teal" role="status"><MessageCircle size={30}/><strong>{t.chatStartFirst}</strong><span>{t.chatLoginToContact}</span><button type="button" className="soft-btn" onClick={onClose}>{t.chatCloseAndLogin}</button></div>}
    </aside>
  </div>;
}
