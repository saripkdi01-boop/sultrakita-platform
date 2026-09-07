'use server';

import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { requireServerUser } from '@/lib/supabase/server';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024;

export async function createPropertyUpload({ fileName, contentType, kind }: { fileName: string; contentType: string; kind: 'image' | 'document' }) {
  const { user } = await requireServerUser();
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!endpoint || !bucket || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || (kind === 'image' && !publicBaseUrl)) throw new Error('Storage upload belum dikonfigurasi.');
  const allowed = kind === 'image' ? ['image/jpeg', 'image/png', 'image/webp'] : ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowed.includes(contentType)) throw new Error('Tipe file tidak diizinkan.');
  const safeName = fileName.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  const key = `properties/${user.id}/${kind}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;
  const client = new S3Client({ region: 'auto', endpoint, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
  const maxBytes = kind === 'image' ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  const presigned = await createPresignedPost(client, { Bucket: bucket, Key: key, Conditions: [['content-length-range', 1, maxBytes], ['eq', '$Content-Type', contentType]], Fields: { 'Content-Type': contentType }, Expires: 600 });
  return { ...presigned, key, publicUrl: kind === 'image' && publicBaseUrl ? `${publicBaseUrl.replace(/\/$/, '')}/${key}` : null };
}
