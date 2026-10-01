/**
 * Validasi unggahan berkas terpusat (P1-6).
 *
 * `validateUpload(file, constraints)` memeriksa, berurutan:
 * 1. Ukuran: tidak kosong & tidak melebihi `maxBytes`.
 * 2. Ekstensi berbahaya: `.exe`, `.php`, `.js`, `.html`, dsb. selalu ditolak.
 * 3. MIME: harus ada di `allowedMime` (mendukung wildcard `image/*`,
 *    kecuali `image/svg+xml` yang hanya boleh bila didaftarkan eksplisit
 *    karena SVG dapat membawa skrip).
 * 4. Konsistensi ekstensi vs MIME: menolak `nama.jpg` yang mengaku
 *    `application/x-php` (deteksi spoofing sederhana).
 *
 * Semua pesan error berbahasa Indonesia.
 */

export interface UploadFileInput {
  /** Nilai `file.type` dari FormData / `mimetype` dari Multer. */
  mimetype: string;
  /** Ukuran berkas dalam byte. */
  size: number;
  /** Nama berkas asli (untuk cek ekstensi). */
  originalname: string;
}

export interface UploadConstraints {
  /** Daftar MIME diizinkan, mis. `['image/jpeg']` atau `['image/*']`. */
  allowedMime: ReadonlyArray<string>;
  /** Batas ukuran dalam byte. */
  maxBytes: number;
}

export type UploadValidationResult = { ok: true } | { ok: false; error: string };

/** Ekstensi yang selalu ditolak (eksekutabel / skrip / HTML aktif). */
const DANGEROUS_EXTENSIONS = new Set([
  'exe',
  'bat',
  'cmd',
  'com',
  'scr',
  'pif',
  'ps1',
  'sh',
  'php',
  'phtml',
  'pl',
  'py',
  'rb',
  'js',
  'mjs',
  'jar',
  'msi',
  'dll',
  'html',
  'htm',
  'xhtml',
]);

/** Petakan ekstensi umum ke MIME yang wajar (untuk deteksi spoofing). */
const EXTENSION_TO_MIME: Record<string, string[]> = {
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  gif: ['image/gif'],
  avif: ['image/avif'],
  heic: ['image/heic'],
  heif: ['image/heif'],
  svg: ['image/svg+xml'],
  pdf: ['application/pdf'],
  mp4: ['video/mp4'],
  webm: ['video/webm'],
  mov: ['video/quicktime'],
  mp3: ['audio/mpeg'],
  wav: ['audio/wav'],
  ogg: ['audio/ogg'],
  zip: ['application/zip'],
};

export function getExtension(filename: string): string {
  const base = filename.split(/[\\/]/).pop() ?? '';
  const idx = base.lastIndexOf('.');
  if (idx <= 0 || idx === base.length - 1) return '';
  return base.slice(idx + 1).toLowerCase();
}

export function formatBytesId(bytes: number): string {
  if (bytes < 1024) return `${bytes} byte`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes % 1024 === 0 ? 0 : 1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes % (1024 * 1024) === 0 ? 0 : 1)} MB`;
}

function normalizeMime(mimetype: string): string {
  return mimetype.toLowerCase().split(';')[0]?.trim() ?? '';
}

function isMimeAllowed(mime: string, allowedMime: ReadonlyArray<string>): boolean {
  for (const rule of allowedMime) {
    const r = rule.toLowerCase().trim();
    if (r === mime) return true; // eksplisit, termasuk image/svg+xml
    if (r.endsWith('/*')) {
      const prefix = r.slice(0, -1); // mis. 'image/'
      // Wildcard tidak mencakup SVG (risiko skrip inline).
      if (mime.startsWith(prefix) && mime !== 'image/svg+xml') return true;
    }
  }
  return false;
}

export function validateUpload(
  file: UploadFileInput,
  constraints: UploadConstraints,
): UploadValidationResult {
  const size = file.size;
  const mime = normalizeMime(file.mimetype);
  const ext = getExtension(file.originalname);

  if (!Number.isFinite(size) || size <= 0) {
    return { ok: false, error: 'Berkas kosong atau tidak valid.' };
  }
  if (size > constraints.maxBytes) {
    return {
      ok: false,
      error: `Ukuran berkas melebihi batas ${formatBytesId(constraints.maxBytes)}.`,
    };
  }
  if (!mime) {
    return { ok: false, error: 'Jenis berkas tidak dikenali.' };
  }
  if (ext && DANGEROUS_EXTENSIONS.has(ext)) {
    return { ok: false, error: `Jenis berkas .${ext} tidak diizinkan demi keamanan.` };
  }
  if (!isMimeAllowed(mime, constraints.allowedMime)) {
    return { ok: false, error: `Jenis berkas (${mime || 'tidak diketahui'}) tidak diizinkan.` };
  }
  const expectedMimes = ext ? EXTENSION_TO_MIME[ext] : undefined;
  if (expectedMimes && !expectedMimes.includes(mime)) {
    return {
      ok: false,
      error: 'Nama berkas tidak sesuai dengan jenis isinya. Ganti nama atau pilih berkas lain.',
    };
  }
  return { ok: true };
}

/** Preset umum — sesuaikan `maxBytes` per kebutuhan endpoint. */
export const UPLOAD_PRESETS = {
  image: {
    allowedMime: ['image/jpeg', 'image/png', 'image/webp'],
    maxBytes: 5 * 1024 * 1024,
  },
  avatar: {
    allowedMime: ['image/jpeg', 'image/png', 'image/webp'],
    maxBytes: 2 * 1024 * 1024,
  },
  document: {
    allowedMime: ['application/pdf', 'image/jpeg', 'image/png'],
    maxBytes: 10 * 1024 * 1024,
  },
} as const;
