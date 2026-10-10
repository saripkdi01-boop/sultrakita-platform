'use server';

import { requireServerUser } from '@/lib/supabase/server';
import { createR2PresignedUpload } from '@/lib/r2';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024;

export async function createPropertyUpload({ fileName, contentType, kind }: { fileName: string; contentType: string; kind: 'image' | 'document' }) {
  const { user } = await requireServerUser();
  const allowed = kind === 'image' ? ['image/jpeg', 'image/png', 'image/webp'] : ['image/jpeg', 'image/png', 'application/pdf'];
  const maxBytes = kind === 'image' ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  return createR2PresignedUpload({
    prefix: `properties/${user.id}/${kind}`,
    fileName,
    contentType,
    maxBytes,
    allowedTypes: allowed,
    needsPublicUrl: kind === 'image',
  });
}
