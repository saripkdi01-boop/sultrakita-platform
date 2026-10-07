import { createElement } from 'react';
import type { ComponentType, ReactElement, SVGProps } from 'react';
import {
  AlertTriangle,
  Bookmark,
  BriefcaseBusiness,
  Check,
  Clock3,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  Inbox,
  KeyRound,
  Languages,
  Link2,
  LockKeyhole,
  Megaphone,
  Palette,
  Shield,
  Store,
  type LucideIcon,
} from 'lucide-react';
import {
  SukiIconAjakTeman,
  SukiIconBisnis,
  SukiIconGames,
  SukiIconJobs,
  SukiIconKampung,
  SukiIconKomunitas,
  SukiIconMarketplace,
  SukiIconPesan,
  SukiIconProperti,
  SukiIconWebStudio,
} from '@/components/layout/SukiIcons';

/* ==========================================================================
   Ikon & nama menu sidebar.

   Setiap item HARUS mencerminkan realita ekosistem: nama menunya = nama
   produk/fitur yang benar-benar ada (rute + backend/API-nya hidup), ikonnya
   memakai set ikon khas SUKI (garis 2px + titik emas #FFD766) bila tersedia,
   fallback ke Lucide bila belum ada ikon khasnya.

   Audit realita 2026-10-03:
   - /chat DINONAKTIFKAN (placeholder "segera hadir", gateway WebSocket belum
     ada) -> menu SUKI Chat diberi badge jujur "Segera", bukan seolah hidup.
   - Tidak ada backend/frontend AI apapun di main (CS WA masih di branch
     fitur/ai-customer-service, belum deploy) -> item "SUKI AI" DIHAPUS.
   - Tidak ada fitur, tabel, API, maupun anchor "Kenangan" dimanapun ->
     item "Kenangan" DIHAPUS.
   - Badge jumlah "Tersimpan" sebelumnya hardcoded '4' (data palsu) ->
     badge dihapus; jumlah nyata bisa dihitung dari GET /api/saved.
   - "SUKI Suits" -> "SUKI Properti": /properti adalah direktori real estate
     (tabel properties + inquiry hidup), bukan "suits".
   - "SUKI Events" -> /groups adalah label salah (itu Grup/Komunitas);
     kini "SUKI Games" (/games = hub game; berisi JALA + game "SUKI Kampung"
     di /kampung, mode demo jujur).
   ========================================================================== */

export type MenuIconProps = { size?: number | string; className?: string };
export type MenuIcon = ComponentType<MenuIconProps>;

/** Bungkus ikon khas SUKI (SVGProps) agar bisa dipakai sebagai ikon menu. */
function suki(SukiIcon: (props: SVGProps<SVGSVGElement>) => ReactElement): MenuIcon {
  return function SukiMenuIcon({ size = 18, className }: MenuIconProps) {
    return createElement(SukiIcon, { width: size, height: size, className, 'aria-hidden': true });
  };
}

/** LucideIcon sudah kompatibel dengan MenuIcon (size + className opsional). */
const lucide = (Icon: LucideIcon): MenuIcon => Icon;

export type MenuItemConfig = {
  label: string;
  route: string;
  icon: MenuIcon;
  badge?: string;
  active?: boolean;
  interactive?: 'campaign';
  requiredRole?: 'seller' | 'admin';
};

export const menuSections: { title: string; items: MenuItemConfig[] }[] = [
  {
    title: 'Pintasan Anda',
    items: [
      { label: 'Beranda', route: '/beranda', icon: lucide(Home) },
      { label: 'SUKI Marketplace', route: '/marketplace', icon: suki(SukiIconMarketplace) },
      { label: 'SUKI Properti', route: '/properti', icon: suki(SukiIconProperti) },
      { label: 'SUKI Chat', route: '/chat', icon: suki(SukiIconPesan), badge: 'Segera' },
      { label: 'Grup', route: '/groups', icon: suki(SukiIconKomunitas) },
    ],
  },
  {
    title: 'Menu Utama',
    items: [
      { label: 'Tersimpan', route: '/marketplace/profile#saved', icon: lucide(Bookmark) },
      { label: 'Ajak Teman', route: '/ajak-teman', icon: suki(SukiIconAjakTeman), badge: 'NEW' },
      { label: 'Properti Saya', route: '/dashboard/properties', icon: lucide(KeyRound) },
      { label: 'Pesan Properti', route: '/dashboard/inquiries', icon: lucide(Inbox) },
    ],
  },
  {
    title: 'Bantuan dan Dukungan',
    items: [
      { label: 'Pusat Perlindungan Penipuan', route: '/security-center', icon: lucide(Shield) },
      { label: 'Dukungan', route: '/support', icon: lucide(HelpCircle) },
      { label: 'Laporkan masalah', route: '/support#report', icon: lucide(AlertTriangle) },
      { label: 'Ketentuan dan Kebijakan', route: '/help-center', icon: lucide(FileText) },
    ],
  },
  {
    title: 'Pengaturan dan Privasi',
    items: [
      { label: 'Pengaturan', route: '/dashboard', icon: lucide(Palette) },
      { label: 'Pusat Privasi', route: '/security-center', icon: lucide(LockKeyhole) },
      { label: 'Manajemen waktu', route: '/dashboard', icon: lucide(Clock3) },
      { label: 'Permintaan perangkat', route: '/security-center', icon: lucide(Check) },
      { label: 'Aktivitas iklan terkini', route: '/help-center', icon: lucide(BriefcaseBusiness) },
      { label: 'Pesanan dan pembayaran', route: '/dashboard/inquiries', icon: lucide(CreditCard) },
      { label: 'Riwayat tautan', route: '/security-center', icon: lucide(Link2) },
      { label: 'Mode gelap', route: '#dark-mode', icon: lucide(Palette) },
      { label: 'Bahasa', route: '#language', icon: lucide(Languages) },
    ],
  },
  {
    title: 'EKOSISTEM SUKI',
    items: [
      { label: 'SUKI Properti', route: '/properti', icon: suki(SukiIconProperti) },
      { label: 'SUKI Jobs', route: '/jobs', icon: suki(SukiIconJobs), badge: 'NEW' },
      { label: 'SUKI Games', route: '/games', icon: suki(SukiIconGames), badge: 'Baru' },
      { label: 'SUKI Web Studio', route: '/web-studio', icon: suki(SukiIconWebStudio), badge: 'Baru' },
      { label: 'SUKI Campaign Hub', route: '/campaigns', icon: lucide(Megaphone), badge: 'LIVE', interactive: 'campaign' },
      { label: 'Direktori Bisnis', route: '/Business', icon: suki(SukiIconBisnis) },
    ],
  },
  {
    title: 'Ekosistem Digital SultraKita',
    items: [{ label: 'SUKI Partner', route: '#partner', icon: lucide(Store), badge: 'Segera hadir' }],
  },
];

export const propertyListings = [
  { id: 1, title: 'Nirwana Residence', location: 'Anduonohu, Kendari', price: 'Rp 850 Juta', mode: 'Dijual', status: 'Terverifikasi', statusTone: 'verified', photos: 6, beds: 3, baths: 2, area: 120, sikumbang: 'SK-2210', units: 4, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { id: 2, title: 'The Coast Villa', location: 'Nambo, Konawe Selatan', price: 'Rp 1,2 M', mode: 'Dijual', status: 'SUKI Select', statusTone: 'select', photos: 8, beds: 4, baths: 3, area: 180, sikumbang: 'SK-1832', units: 2, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' },
  { id: 3, title: 'Ruko Wua-Wua Corner', location: 'Wua-Wua, Kendari', price: 'Rp 95 Juta/tahun', mode: 'Disewa', status: 'Baru', statusTone: 'new', photos: 4, beds: 0, baths: 2, area: 86, sikumbang: 'SK-0941', units: 7, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80' },
] as const;
