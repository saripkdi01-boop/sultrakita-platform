'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { SukiChatWorkspace } from '@/components/chat/SukiChatWorkspace';

export default function ChatPage() {
  return <AppLayout active="chat"><SukiChatWorkspace /></AppLayout>;
}
