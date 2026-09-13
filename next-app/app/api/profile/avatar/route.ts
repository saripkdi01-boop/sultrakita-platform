import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { requireServerUser } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

type FocusBox = { x: number; y: number; width: number; height: number };

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function parseFocus(payload: any): FocusBox | null {
  const text = payload?.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('') || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const value = JSON.parse(match[0]);
    const numbers = ['x', 'y', 'width', 'height'].map((key) => Number(value[key]));
    if (!numbers.every(Number.isFinite)) return null;
    const [x, y, width, height] = numbers.map((number) => Math.max(0, Math.min(1000, number)));
    return width >= 20 && height >= 20 ? { x, y, width, height } : null;
  } catch {
    return null;
  }
}

async function findFocus(buffer: Buffer) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const base = (process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const response = await fetch(`${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    signal: AbortSignal.timeout(7000),
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [
        { inline_data: { mime_type: 'image/jpeg', data: buffer.toString('base64') } },
        { text: 'Temukan subjek utama untuk foto profil. Balas HANYA JSON valid dengan koordinat relatif 0-1000: {"x":number,"y":number,"width":number,"height":number}. Jika wajah terlihat, gunakan area wajah dan bahu; jika tidak, gunakan subjek utama. Jangan sertakan markdown.' },
      ] }],
    }),
  });
  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
  return parseFocus(await response.json());
}

function getR2Config() {
  const endpoint = process.env.R2_ENDPOINT || process.env.R2_S3_ENDPOINT || (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : '');
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME || '';
  const secret = process.env.R2_SECRET_ACCESS_KEY || process.env.R2_SCREET_ACCESS_KEY || '';
  const publicBase = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (!endpoint || !bucket || !process.env.R2_ACCESS_KEY_ID || !secret || !publicBase) return null;
  return { endpoint, bucket, secret, publicBase };
}

async function processAvatar(input: Buffer) {
  const source = sharp(input, { animated: false });
  const metadata = await source.metadata();
  if (!metadata.width || !metadata.height) throw new Error('Ukuran gambar tidak dapat dibaca.');
  const analysis = await source.jpeg({ quality: 82 }).toBuffer();
  let focus: FocusBox | null = null;
  try { focus = await findFocus(analysis); } catch (error) { console.warn('[avatar-gemini-fallback]', error instanceof Error ? error.message : error); }
  const sourceSize = Math.min(metadata.width, metadata.height);
  const centerX = focus ? (focus.x + focus.width / 2) / 1000 * metadata.width : metadata.width / 2;
  const centerY = focus ? (focus.y + focus.height / 2) / 1000 * metadata.height : metadata.height / 2;
  const requested = focus ? Math.max(focus.width / 1000 * metadata.width, focus.height / 1000 * metadata.height) * 1.35 : sourceSize;
  const cropSize = Math.max(1, Math.min(sourceSize, Math.round(requested)));
  const left = Math.max(0, Math.min(metadata.width - cropSize, Math.round(centerX - cropSize / 2)));
  const top = Math.max(0, Math.min(metadata.height - cropSize, Math.round(centerY - cropSize / 2)));
  const output = await sharp(input, { animated: false }).extract({ left, top, width: cropSize, height: cropSize }).resize(512, 512, { fit: 'cover' }).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  return { output, focusSource: focus ? 'gemini' : 'center' };
}

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireServerUser();
    const form = await request.formData();
    const file = form.get('avatar');
    if (!(file instanceof File)) return jsonError('Foto profil wajib dipilih.', 422);
    if (!ALLOWED_TYPES.has(file.type)) return jsonError('Pilih JPG, PNG, WebP, atau GIF.', 422);
    if (file.size > MAX_BYTES) return jsonError('Foto profil maksimal 5 MB.', 413);
    const input = Buffer.from(await file.arrayBuffer());
    const { output, focusSource } = await processAvatar(input);
    const config = getR2Config();
    if (!config) return jsonError('Storage avatar belum terhubung. Pastikan R2_ENDPOINT/R2_BUCKET/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_PUBLIC_BASE_URL tersedia di environment Production.', 503);
    const client = new S3Client({ region: process.env.R2_REGION || 'auto', endpoint: config.endpoint, forcePathStyle: true, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: config.secret } });
    const objectPath = `avatars/${user.id}/${randomUUID()}.jpg`;
    await client.send(new PutObjectCommand({ Bucket: config.bucket, Key: objectPath, Body: output, ContentType: 'image/jpeg', CacheControl: 'public, max-age=31536000, immutable' }));
    const avatarUrl = `${config.publicBase}/${objectPath}`;
    const { error } = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
    if (error) return jsonError('Foto tersimpan tetapi profil gagal diperbarui.', 500);
    return NextResponse.json({ ok: true, data: { avatar_url: avatarUrl, width: 512, height: 512, focus_source: focusSource } });
  } catch (error) {
    console.error('[profile-avatar]', error instanceof Error ? error.message : error);
    return jsonError('Foto profil tidak dapat diproses saat ini.', 500);
  }
}
