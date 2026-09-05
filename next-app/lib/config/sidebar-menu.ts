export type SidebarStatus = 'active' | 'conditional' | 'coming-soon';
export type SidebarIconName = 'User' | 'ShoppingBag' | 'MessageCircle' | 'Video' | 'Users' | 'Building' | 'Bookmark' | 'Bell' | 'BarChart3' | 'Settings' | 'HelpCircle' | 'Calendar' | 'Clock' | 'Store';
export type SidebarMenuItem = { id: string; label: string; icon: SidebarIconName; href: string; status: SidebarStatus; badgeKey?: 'marketplace_unread' | 'unread_messages' | 'unread_notifications'; condition?: 'seller' | 'seller_or_community'; subItems?: { label: string; href: string }[] };
export const sidebarMenuConfig: SidebarMenuItem[] = [
  { id: 'profile', label: 'Profil Anda', icon: 'User', href: '/profile', status: 'active' },
  { id: 'marketplace', label: 'Marketplace', icon: 'ShoppingBag', href: '/marketplace', status: 'active', badgeKey: 'marketplace_unread' },
  { id: 'chat', label: 'SUKI Chat', icon: 'MessageCircle', href: '/chat', status: 'active', badgeKey: 'unread_messages' },
  { id: 'reels', label: 'Reels', icon: 'Video', href: '/reels', status: 'active' },
  { id: 'groups', label: 'Grup Komunitas', icon: 'Users', href: '/groups', status: 'active' },
  { id: 'suki-suits', label: 'Suki Suits (Properti)', icon: 'Building', href: '/properti', status: 'active', subItems: [{ label: 'Beranda Properti', href: '/properti' }, { label: 'Rumah Sewa', href: '/properti?category=rumah_sewa' }, { label: 'Kos-kosan', href: '/properti?category=kos_kosan' }, { label: 'Rumah Takeover', href: '/properti?category=rumah_takeover' }, { label: 'Lelang', href: '/properti?category=lelang' }, { label: 'Rumah Subsidi', href: '/properti?category=rumah_subsidi' }] },
  { id: 'saved', label: 'Tersimpan', icon: 'Bookmark', href: '/saved', status: 'active' },
  { id: 'notifications', label: 'Notifikasi', icon: 'Bell', href: '/notifications', status: 'active', badgeKey: 'unread_notifications' },
  { id: 'seller-dashboard', label: 'Dashboard Seller', icon: 'BarChart3', href: '/seller/dashboard', status: 'conditional', condition: 'seller' },
  { id: 'settings', label: 'Pengaturan & Privasi', icon: 'Settings', href: '/settings', status: 'active' },
  { id: 'help', label: 'Bantuan & Dukungan', icon: 'HelpCircle', href: '/help', status: 'active' },
  { id: 'events', label: 'Acara', icon: 'Calendar', href: '#', status: 'coming-soon' },
  { id: 'memories', label: 'Kenangan', icon: 'Clock', href: '#', status: 'coming-soon' },
  { id: 'store', label: 'Toko / Bisnis Saya', icon: 'Store', href: '/seller/dashboard', status: 'conditional', condition: 'seller_or_community' },
];
