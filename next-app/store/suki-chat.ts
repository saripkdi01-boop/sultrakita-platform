'use client';

import { create } from 'zustand';

export type DeliveryStatus = 'sending' | 'sent' | 'read';
export type ChatMessage = {
  id: string;
  conversationId: string;
  sender: 'me' | 'them';
  content: string;
  createdAt: string;
  status: DeliveryStatus;
  reaction?: string;
};

export type ChatContact = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color: 'coral' | 'indigo' | 'mint' | 'lilac' | 'sand';
  status: 'online' | 'away' | 'offline';
  preview: string;
  time: string;
  unread?: number;
  isGroup?: boolean;
};

const now = Date.now();
export const chatContacts: ChatContact[] = [
  { id: 'wa-ode', name: 'Wa Ode Rahma', handle: 'Penjual kopra Tolaki', initials: 'WR', color: 'coral', status: 'online', preview: 'Kalau ada pertanyaan lain, langsung kabari saja.', time: '09.42', unread: 2 },
  { id: 'la-ode', name: 'La Ode Fikri', handle: 'Komunitas Kendari', initials: 'LF', color: 'indigo', status: 'online', preview: 'Besok jadi kumpul di ruang kreatif?', time: 'Kemarin' },
  { id: 'suki-team', name: 'SUKI Community', handle: '24 anggota', initials: 'SC', color: 'mint', status: 'online', preview: 'Rina membagikan sebuah foto', time: 'Sen', unread: 5, isGroup: true },
  { id: 'rina', name: 'Rina Mardiana', handle: 'Online 5 menit lalu', initials: 'RM', color: 'lilac', status: 'away', preview: 'Terima kasih rekomendasinya!', time: 'Min' },
  { id: 'budi', name: 'Budi Santoso', handle: 'Terakhir dilihat 2 jam lalu', initials: 'BS', color: 'sand', status: 'offline', preview: 'File sudah aku terima.', time: 'Min' },
];

const seedMessages: ChatMessage[] = [
  { id: 'm-1', conversationId: 'wa-ode', sender: 'them', content: 'Halo! Listing kopra Tolaki yang kamu simpan masih tersedia.', createdAt: new Date(now - 1000 * 60 * 17).toISOString(), status: 'read' },
  { id: 'm-2', conversationId: 'wa-ode', sender: 'me', content: 'Mantap. Bisa kirim detail lokasi dan kisaran harganya?', createdAt: new Date(now - 1000 * 60 * 15).toISOString(), status: 'read' },
  { id: 'm-3', conversationId: 'wa-ode', sender: 'them', content: 'Tentu, aku kirimkan sore ini. Lokasinya di Poasia, dekat pasar.', createdAt: new Date(now - 1000 * 60 * 12).toISOString(), status: 'read' },
  { id: 'm-4', conversationId: 'wa-ode', sender: 'me', content: 'Oke, terima kasih. Aku tunggu ya.', createdAt: new Date(now - 1000 * 60 * 9).toISOString(), status: 'read' },
  { id: 'm-5', conversationId: 'wa-ode', sender: 'them', content: 'Siap. Kalau ada pertanyaan lain, langsung kabari saja.', createdAt: new Date(now - 1000 * 60 * 6).toISOString(), status: 'read' },
];

export const useSukiChatStore = create<{
  messages: ChatMessage[];
  activeConversationId: string;
  typing: boolean;
  commandOpen: boolean;
  theme: 'light' | 'dark';
  addMessage: (content: string) => void;
  addMessageOptimistic: (content: string, clientMessageId: string) => void;
  reconcileMessage: (clientMessageId: string, status: DeliveryStatus, serverId?: string) => void;
  addIncomingMessage: (message: { id: string; conversationId: string; sender: 'me' | 'them'; content: string; createdAt: string; status: DeliveryStatus }) => void;
  setActiveConversation: (id: string) => void;
  setTyping: (value: boolean) => void;
  setCommandOpen: (value: boolean) => void;
  toggleTheme: () => void;
  reactToMessage: (id: string, emoji: string) => void;
}>((set) => ({
  messages: seedMessages,
  activeConversationId: 'wa-ode',
  typing: false,
  commandOpen: false,
  theme: 'light',
  addMessage: (content) => {
    const id = `local-${Date.now()}`;
    set((state) => ({ messages: [...state.messages, { id, conversationId: state.activeConversationId, sender: 'me', content, createdAt: new Date().toISOString(), status: 'sending' }] }));
    window.setTimeout(() => set((state) => ({ messages: state.messages.map((message) => message.id === id ? { ...message, status: 'sent' } : message) })), 650);
    window.setTimeout(() => set((state) => ({ messages: state.messages.map((message) => message.id === id ? { ...message, status: 'read' } : message) })), 1900);
  },
  addMessageOptimistic: (content, clientMessageId) => set((state) => ({ messages: [...state.messages, { id: clientMessageId, conversationId: state.activeConversationId, sender: 'me', content, createdAt: new Date().toISOString(), status: 'sending' }] })),
  reconcileMessage: (clientMessageId, status, serverId) => set((state) => ({ messages: state.messages.map((message) => message.id === clientMessageId ? { ...message, id: serverId || message.id, status } : message) })),
  addIncomingMessage: (message) => set((state) => state.messages.some((item) => item.id === message.id) ? state : { messages: [...state.messages, message] }),
  setActiveConversation: (id) => set({ activeConversationId: id, typing: false }),
  setTyping: (typing) => set({ typing }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  reactToMessage: (id, emoji) => set((state) => ({ messages: state.messages.map((message) => message.id === id ? { ...message, reaction: message.reaction === emoji ? undefined : emoji } : message) })),
}));

export function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export function contactById(id: string) {
  return chatContacts.find((contact) => contact.id === id) || chatContacts[0];
}

export function messagesForConversation(messages: ChatMessage[], id: string, contactName: string) {
  const found = messages.filter((message) => message.conversationId === id);
  return found.length ? found : [{ id: `${id}-welcome`, conversationId: id, sender: 'them' as const, content: `Hai, aku ${contactName}. Ada yang bisa kubantu hari ini?`, createdAt: new Date().toISOString(), status: 'read' as const }];
}

export function unreadTotal() {
  return chatContacts.reduce((total, contact) => total + (contact.unread || 0), 0);
}

export function getAvatarClass(color: ChatContact['color']) {
  return `suki-avatar-${color}`;
}

export function statusLabel(status: DeliveryStatus) {
  return status === 'sending' ? 'Mengirim' : status === 'sent' ? 'Terkirim' : 'Dibaca';
}

export function getStatusClass(status: ChatContact['status']) {
  return status === 'online' ? 'online' : status === 'away' ? 'away' : 'offline';
}

export function getChatDataContract() {
  return { message: 'content, conversationId, sender, createdAt, status', presence: 'online, away, offline', history: 'cursor-paginated messages' };
}

export function getChatBackendContract() {
  return { presence: 'Redis/WebSocket', history: 'ScyllaDB', users: 'Postgres' };
}

export function getChatMotionTokens() {
  return { stiffness: 300, damping: 25 };
}

export function getChatDesignTokens() {
  return { primary: '#5B5FEF', accent: '#FF5A7A', light: '#F8FAFC', dark: '#0B0F19' };
}

export function getChatFeatureFlags() {
  return { commandPalette: true, virtualization: true, optimisticUi: true, contextMenu: true, reactions: true };
}

export function getChatAcceptanceCriteria() {
  return ['Ctrl/Cmd+K opens palette', '10k+ message list uses virtualizer', 'sending → sent → read', 'typing dots animate', 'context actions at cursor'];
}

export function getChatSummary() {
  return { route: '/chat', state: 'Zustand', virtualization: '@tanstack/react-virtual', animation: 'Framer Motion', persistence: 'mocked local state' };
}
