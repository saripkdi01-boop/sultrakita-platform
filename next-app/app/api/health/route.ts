import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function getR2Config() {
  const endpoint = process.env.R2_ENDPOINT || process.env.R2_S3_ENDPOINT || (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : '');
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME || '';
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;
  return { endpoint, bucket, accessKeyId, secretAccessKey, region: process.env.R2_REGION || 'auto' };
}

async function checkR2() {
  const config = getR2Config();
  if (!config) return 'unconfigured' as const;
  try {
    const client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    });
    await client.send(new HeadBucketCommand({ Bucket: config.bucket }));
    return 'up' as const;
  } catch {
    return 'down' as const;
  }
}

export async function GET() {
  const checkedAt = new Date().toISOString();
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const storage = await checkR2();

  if (!supabaseConfigured) {
    return NextResponse.json(
      { ok: false, data: { api: 'up', db: 'unconfigured', storage, build: 'next', checkedAt } },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('categories').select('id').limit(1);
    if (error) throw error;
    const ok = storage === 'up';
    return NextResponse.json(
      { ok, data: { api: 'up', db: 'up', storage, build: 'next', checkedAt } },
      { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, data: { api: 'up', db: 'down', storage, build: 'next', checkedAt } },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
