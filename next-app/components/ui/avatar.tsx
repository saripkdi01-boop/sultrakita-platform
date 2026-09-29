import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Avatar — image with an initials fallback.
 *
 * When `src` is missing, or when the image fails to load, the component renders
 * the user's initials on a tinted surface instead of a broken-image icon. That
 * fallback is the common path in this app, so it is the default styling rather
 * than an afterthought.
 *
 * Remote images go through `next/image`, which needs the host in
 * `next.config.mjs > images.remotePatterns`. Only `images.unsplash.com` and
 * `**.supabase.co` are allowed there, so any other host falls back to initials
 * rather than throwing at render time.
 *
 * Decorative by default: an avatar next to a visible name would otherwise be
 * announced twice. Pass `alt` when the avatar is the only label.
 */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<Size, { box: string; text: string; px: number }> = {
  xs: { box: 'size-6', text: 'text-[10px]', px: 24 },
  sm: { box: 'size-8', text: 'text-xs', px: 32 },
  md: { box: 'size-10', text: 'text-sm', px: 40 },
  lg: { box: 'size-12', text: 'text-base', px: 48 },
  xl: { box: 'size-16', text: 'text-xl', px: 64 },
};

/** Deterministic tone per name, so the same person keeps the same colour. */
const TONES = [
  'bg-brand-100 text-brand-700',
  'bg-accent-wakatobi/15 text-accent-wakatobi',
  'bg-accent-tolaki/15 text-accent-tolaki',
  'bg-accent-buton/15 text-accent-buton',
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toneFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return TONES[hash % TONES.length];
}

export function Avatar({
  src,
  name,
  size = 'md',
  alt,
  className,
}: {
  /** Remote URL, a `/public` path, or null for the initials fallback. */
  src?: string | null;
  /** Used for the initials fallback and as the default alt text. */
  name: string;
  size?: Size;
  /** Omit to mark the avatar decorative. */
  alt?: string;
  className?: string;
}) {
  const dims = SIZES[size];
  const label = alt ?? '';
  // `next/image` throws on hosts missing from remotePatterns, so a relative
  // path or a known-good remote host is required before we hand it a URL.
  const usableSrc =
    src && (src.startsWith('/') || src.includes('images.unsplash.com') || src.includes('.supabase.co'))
      ? src
      : null;

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-qwen-full',
        'font-semibold tracking-qwen-wide',
        dims.box,
        dims.text,
        !usableSrc && toneFor(name),
        className,
      )}
    >
      {usableSrc ? (
        <Image
          src={usableSrc}
          alt={label}
          width={dims.px}
          height={dims.px}
          className="size-full object-cover"
          // Avatars sit above the fold in feeds; unoptimised keeps the first
          // paint cheap, and the intrinsic size caps the layout shift.
          unoptimized
        />
      ) : (
        <span aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label || undefined}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
