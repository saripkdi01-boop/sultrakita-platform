/**
 * R2 Unified Upload Library — satu pintu untuk semua upload file di SukiApps.
 *
 * Dipakai oleh: marketplace listing, properti, avatar, dokumen, beranda.
 * Mendukung R2_ENDPOINT langsung atau diturunkan dari R2_ACCOUNT_ID.
 */
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { randomUUID } from 'crypto';

export interface R2Config {
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
}

/**
 * Resolve konfigurasi R2 dari env.
 * Prioritas endpoint: R2_ENDPOINT > R2_S3_ENDPOINT > diturunkan dari R2_ACCOUNT_ID.
 * Return null jika konfigurasi tidak lengkap (caller wajib handle dengan pesan user-friendly).
 */
export function getR2Config(): R2Config | null {
  const endpoint =
    process.env.R2_ENDPOINT ||
    process.env.R2_S3_ENDPOINT ||
    (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : '');
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME || '';
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
  const publicBaseUrl = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;
  return { endpoint, bucket, accessKeyId, secretAccessKey, publicBaseUrl };
}

/** Buat S3Client yang terkonfigurasi untuk R2. Throw jika config tidak lengkap. */
export function createR2Client(): { client: S3Client; config: R2Config } {
  const config = getR2Config();
  if (!config) throw new Error('Storage media belum dikonfigurasi.');
  const client = new S3Client({
    region: 'auto',
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  return { client, config };
}

/** URL publik untuk object key. Fallback ke endpoint S3 jika publicBaseUrl kosong. */
export function getR2PublicUrl(key: string): string {
  const config = getR2Config();
  const base = config?.publicBaseUrl || config?.endpoint.replace(/\/$/, '') || '';
  return `${base}/${key}`;
}

/** Sanitasi nama file agar aman untuk object key. */
export function sanitizeFileName(fileName: string): string {
  return fileName.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-120);
}

export interface PresignedUploadOptions {
  /** Prefix folder, mis. 'marketplace', 'properties/{uid}/image', 'avatars' */
  prefix: string;
  fileName: string;
  contentType: string;
  maxBytes: number;
  /** Tipe konten yang diizinkan, mis. ['image/jpeg', 'image/png'] */
  allowedTypes: string[];
  /** Butuh public URL? (false untuk dokumen private) */
  needsPublicUrl?: boolean;
}

export interface PresignedUploadResult {
  url: string;
  fields: Record<string, string>;
  key: string;
  publicUrl: string | null;
}

/**
 * Generate presigned POST untuk upload langsung dari browser ke R2.
 * Satu fungsi untuk semua jenis upload di ekosistem SukiApps.
 */
export async function createR2PresignedUpload(
  opts: PresignedUploadOptions,
): Promise<PresignedUploadResult> {
  const { client, config } = createR2Client();

  if (opts.allowedTypes.length > 0 && !opts.allowedTypes.includes(opts.contentType)) {
    throw new Error('Tipe file tidak diizinkan.');
  }
  if (!Number.isFinite(opts.maxBytes) || opts.maxBytes < 1) {
    throw new Error('Batas ukuran file tidak valid.');
  }

  const safeName = sanitizeFileName(opts.fileName);
  const datePrefix = new Date().toISOString().slice(0, 10);
  const key = `${opts.prefix}/${datePrefix}/${randomUUID()}-${safeName}`;

  const presigned = await createPresignedPost(
    client,
    {
      Bucket: config.bucket,
      Key: key,
      Conditions: [
        ['content-length-range', 1, opts.maxBytes],
        ['eq', '$Content-Type', opts.contentType],
      ],
      Fields: { 'Content-Type': opts.contentType },
      Expires: 600,
    },
  );

  const needsPublic = opts.needsPublicUrl !== false;
  return {
    ...presigned,
    key,
    publicUrl: needsPublic ? getR2PublicUrl(key) : null,
  };
}
