'use server';

import { requireServerUser } from '@/lib/supabase/server';
import { createR2PresignedUpload } from '@/lib/r2';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export async function createR2Upload({ fileName, contentType, size }: { fileName: string; contentType: string; size: number }) {
  await requireServerUser();
  if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) throw new Error('Hanya file gambar atau video yang diizinkan.');
  const maxBytes = contentType.startsWith('video/') ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (!Number.isFinite(size) || size < 1 || size > maxBytes) throw new Error(`Ukuran file maksimal ${contentType.startsWith('video/') ? '50 MB' : '20 MB'}.`);
  // allowedTypes dikosongkan — validasi tipe sudah dilakukan di atas (image/*, video/*).
  return createR2PresignedUpload({
    prefix: 'beranda',
    fileName,
    contentType,
    maxBytes,
    allowedTypes: [],
    needsPublicUrl: true,
  });
}
