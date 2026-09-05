'use client';

import { X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
type Props = { open: boolean; onClose: () => void; conversationId?: string; currentUserId?: string; sellerName?: string };
export function ChatDrawer({ open, onClose, conversationId, currentUserId, sellerName = 'Seller SultraKita' }: Props) { if (!open) return null; return <div className="chat-drawer-layer" role="dialog" aria-modal="true" aria-label={`Chat dengan ${sellerName}`}><aside className="chat-drawer"><header><div><span className="eyebrow">Pesan langsung</span><h2>{sellerName}</h2></div><button onClick={onClose} aria-label="Tutup chat"><X size={18}/></button></header>{conversationId && currentUserId ? <ChatWindow conversationId={conversationId} currentUserId={currentUserId}/> : <div className="chat-login-state">Login diperlukan untuk memulai chat dengan seller.</div>}</aside></div>; }
