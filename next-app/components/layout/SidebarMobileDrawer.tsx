'use client';
import { SidebarNavigation } from '@/components/navigation/SidebarNavigation';
import { useUIStore } from '@/store/ui';

export function SidebarMobileDrawer({ open }: { open: boolean }) {
  const { toggleMobile } = useUIStore();
  return <SidebarNavigation isOpen={open} onClose={toggleMobile} />;
}
