'use server';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { requireServerUser } from '@/lib/supabase/server';

export async function createPropertyDocumentDownload(propertyId: string, objectKey: string) {
  const { supabase, user } = await requireServerUser();
  const { data: property, error } = await supabase.from('properties').select('seller_id,verification_documents').eq('id', propertyId).maybeSingle();
  if (error) throw new Error('Properti tidak dapat diverifikasi.');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const isAdmin = profile?.role === 'admin';
  const isOwner = property?.seller_id === user.id;
  const allowedKeys = Array.isArray(property?.verification_documents) ? property.verification_documents : [];
  if (!property || (!isAdmin && !isOwner) || !allowedKeys.includes(objectKey)) throw new Error('Akses dokumen ditolak.');
  if (!objectKey.startsWith(`properties/${property.seller_id}/document/`)) throw new Error('Object key dokumen tidak valid.');
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET;
  if (!endpoint || !bucket || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) throw new Error('Storage download belum dikonfigurasi.');
  const client = new S3Client({ region: 'auto', endpoint, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
  const url = await getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: objectKey }), { expiresIn: 300 });
  return { ok: true as const, url, expiresIn: 300 };
}


async function requireAdmin() {
  const { supabase, user } = await requireServerUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') throw new Error('Akses admin diperlukan.');
  return { supabase, user };
}

export async function listAdminPropertyVerifications(filter: 'all' | 'pending' | 'verified' = 'pending') {
  try {
    const { supabase } = await requireAdmin();
    let request = supabase.from('properties').select('id,seller_id,title,category,status,is_admin_verified,verification_documents,created_at').not('verification_documents', 'eq', '{}').order('created_at', { ascending: false }).limit(100);
    if (filter === 'verified') request = request.eq('is_admin_verified', true);
    if (filter === 'pending') request = request.eq('is_admin_verified', false);
    const { data, error } = await request;
    if (error) throw error;
    return { ok: true as const, data: data || [] };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : 'Data verifikasi belum dapat dimuat.', data: [] };
  }
}

export async function reviewPropertyVerification(propertyId: string, verified: boolean) {
  try {
    const { supabase, user } = await requireAdmin();
    const { data, error } = await supabase.from('properties').update({ is_admin_verified: verified, status: verified ? 'available' : 'rejected', published_at: verified ? new Date().toISOString() : null }).eq('id', propertyId).select('id,is_admin_verified,status,published_at,updated_at').single();
    if (error) throw error;
    return { ok: true as const, data, reviewerId: user.id };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : 'Status verifikasi belum dapat diperbarui.' };
  }
}
