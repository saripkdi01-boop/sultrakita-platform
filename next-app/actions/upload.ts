'use server';

import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { randomUUID } from 'crypto';
import { requireServerUser } from '@/lib/supabase/server';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export async function createR2Upload({ fileName, contentType, size }: { fileName: string; contentType: string; size: number }) {
  await requireServerUser();
  const endpoint = process.env.R2_ENDPOINT; const bucket = process.env.R2_BUCKET; const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!endpoint || !bucket || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) throw new Error('Storage media belum dikonfigurasi.');
  if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) throw new Error('Hanya file gambar atau video yang diizinkan.');
  const maxBytes = contentType.startsWith('video/') ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (!Number.isFinite(size) || size < 1 || size > maxBytes) throw new Error(`Ukuran file maksimal ${contentType.startsWith('video/') ? '50 MB' : '20 MB'}.`);
  const safeName = fileName.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-120);
  const key = `beranda/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;
  const client = new S3Client({ region: 'auto', endpoint, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
  const presigned = await createPresignedPost(client, { Bucket: bucket, Key: key, Conditions: [['content-length-range', 1, maxBytes], ['eq', '$Content-Type', contentType]], Fields: { 'Content-Type': contentType }, Expires: 600 });
  return { ...presigned, key, publicUrl: `${publicBaseUrl?.replace(/\/$/, '') || endpoint.replace(/\/$/, '')}/${key}` };
}
