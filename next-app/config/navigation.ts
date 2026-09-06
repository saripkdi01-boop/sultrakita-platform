import {
  AlertTriangle,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  CreditCard,
  FileText,
  Globe2,
  Handshake,
  HelpCircle,
  History,
  Home,
  Link2,
  LockKeyhole,
  MessageCircle,
  Palette,
  Shield,
  ShoppingBag,
  Sparkles,
  Store,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type MenuItemConfig = {
  label: string;
  route: string;
  icon: LucideIcon;
  badge?: string;
  active?: boolean;
  requiredRole?: 'seller' | 'admin';
};

export const menuSections: { title: string; items: MenuItemConfig[] }[] = [
  {
    title: 'Pintasan Anda',
    items: [
      { label: 'Promo Belanja', route: '/marketplace', icon: ShoppingBag },
      { label: 'Grand Boulevard', route: '/properti', icon: Home },
    ],
  },
  {
    title: 'Menu Utama',
    items: [
      { label: 'SultraKita AI', route: '/chat', icon: Sparkles },
      { label: 'Tersimpan', route: '#saved', icon: Bookmark, badge: '4' },
      { label: 'Kenangan', route: '#memories', icon: History },
      { label: 'Marketplace', route: '/marketplace', icon: Store },
      { label: 'Grup', route: '/groups', icon: Users },
    ],
  },
  {
    title: 'Bantuan dan Dukungan',
    items: [
      { label: 'Pusat Perlindungan Penipuan', route: '/security-center', icon: Shield },
      { label: 'Dukungan', route: '/support', icon: HelpCircle },
      { label: 'Laporkan masalah', route: '/support#report', icon: AlertTriangle },
      { label: 'Ketentuan dan Kebijakan', route: '/help-center', icon: FileText },
    ],
  },
  {
    title: 'Pengaturan dan Privasi',
    items: [
      { label: 'Pengaturan', route: '#settings', icon: Palette },
      { label: 'Pusat Privasi', route: '/security-center', icon: LockKeyhole },
      { label: 'Manajemen waktu', route: '#time-management', icon: Clock3 },
      { label: 'Permintaan perangkat', route: '#device-requests', icon: Check },
      { label: 'Aktivitas iklan terkini', route: '#ad-activity', icon: BriefcaseBusiness },
      { label: 'Pesanan dan pembayaran', route: '#orders', icon: CreditCard },
      { label: 'Riwayat tautan', route: '#link-history', icon: Link2 },
      { label: 'Mode gelap', route: '#dark-mode', icon: Palette },
      { label: 'Bahasa', route: '#language', icon: Globe2 },
    ],
  },
  {
    title: 'EKOSISTEM SUKI',
    items: [
      { label: 'SUKI Chat', route: '/chat', icon: MessageCircle },
      { label: 'SUKI Events', route: '/groups', icon: CalendarDays },
      { label: 'SUKI Jobs', route: '/jobs', icon: BriefcaseBusiness, badge: 'NEW' },
      { label: 'SUKI Properti', route: '/properti', icon: Home },
    ],
  },
  {
    title: 'Juga dari SultraKita',
    items: [{ label: 'SUKI Partner', route: '#partner', icon: Handshake, badge: 'Segera hadir' }],
  },
];

export const propertyListings = [
  { id: 1, title: 'Nirwana Residence', location: 'Anduonohu, Kendari', price: 'Rp 850 Juta', mode: 'Dijual', status: 'Terverifikasi', statusTone: 'verified', photos: 6, beds: 3, baths: 2, area: 120, sikumbang: 'SK-2210', units: 4, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { id: 2, title: 'The Coast Villa', location: 'Nambo, Konawe Selatan', price: 'Rp 1,2 M', mode: 'Dijual', status: 'SUKI Select', statusTone: 'select', photos: 8, beds: 4, baths: 3, area: 180, sikumbang: 'SK-1832', units: 2, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' },
  { id: 3, title: 'Ruko Wua-Wua Corner', location: 'Wua-Wua, Kendari', price: 'Rp 95 Juta/tahun', mode: 'Disewa', status: 'Baru', statusTone: 'new', photos: 4, beds: 0, baths: 2, area: 86, sikumbang: 'SK-0941', units: 7, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80' },
] as const;
