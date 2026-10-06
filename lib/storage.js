'use strict';

// Lapisan object storage (Cloudflare R2 native + fallback HTTP PUT) —
// diekstrak dari server.js tanpa perubahan perilaku.
const path = require('node:path');
const crypto = require('node:crypto');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const r2Endpoint = () =>
  process.env.R2_S3_ENDPOINT || (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : '');

const nativeR2Configured = () =>
  Boolean(r2Endpoint() && process.env.R2_BUCKET_NAME && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_PUBLIC_BASE_URL);

const r2Client = () =>
  nativeR2Configured()
    ? new S3Client({
        region: process.env.R2_REGION || 'auto',
        endpoint: r2Endpoint(),
        forcePathStyle: true,
        credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
      })
    : null;

const objectStorageConfigured = () =>
  nativeR2Configured() || Boolean(process.env.R2_UPLOAD_URL && process.env.R2_UPLOAD_TOKEN && process.env.R2_PUBLIC_BASE_URL);

const presignStorageConfigured = () =>
  nativeR2Configured() || Boolean(process.env.R2_PRESIGN_URL && process.env.R2_PUBLIC_BASE_URL);

const objectKey = file =>
  `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname || file.name || '').toLowerCase()}`;

const publicObjectUrl = key => `${String(process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '')}/${key}`;

const uploadObject = async file => {
  if (nativeR2Configured()) {
    const key = objectKey(file);
    await r2Client().send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    return publicObjectUrl(key);
  }
  if (!objectStorageConfigured()) {
    throw new Error('Object storage belum dikonfigurasi. Set R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_BASE_URL, dan R2_S3_ENDPOINT.');
  }
  const key = objectKey(file);
  const response = await fetch(`${process.env.R2_UPLOAD_URL}/${key}`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${process.env.R2_UPLOAD_TOKEN}`,
      'content-type': file.mimetype,
      'cache-control': 'public, max-age=31536000, immutable',
    },
    body: file.buffer,
  });
  if (!response.ok) throw new Error('Upload object storage gagal');
  return publicObjectUrl(key);
};

// Presigned PUT untuk satu file gambar (dipakai endpoint /api/uploads/presign).
const presignObject = async file => {
  const key = objectKey(file);
  const uploadUrl = await getSignedUrl(
    r2Client(),
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
    { expiresIn: 900 }
  );
  return { key, uploadUrl, publicUrl: publicObjectUrl(key), contentType: file.type };
};

module.exports = {
  r2Endpoint, nativeR2Configured, r2Client, objectStorageConfigured, presignStorageConfigured,
  objectKey, publicObjectUrl, uploadObject, presignObject,
};
