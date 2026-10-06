'use strict';

// Pemrosesan gambar (avatar + validasi signature) — diekstrak dari server.js tanpa perubahan perilaku.
const multer = require('multer');
const sharp = require('sharp');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
});

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)),
});

// Validasi magic bytes agar isi file benar-benar sesuai klaim MIME (anti-polyglot).
// Catatan perilaku asli: GIF tidak divalidasi di sini — endpoint avatar
// melewati GIF (mimetype gif lolos tanpa cek signature).
const hasValidImageSignature = async file => {
  const bytes = file.buffer;
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.length >= 8 && Buffer.from(bytes.subarray(0, 8)).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const webp = bytes.length >= 12 && bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  return (file.mimetype === 'image/jpeg' && jpeg) || (file.mimetype === 'image/png' && png) || (file.mimetype === 'image/webp' && webp);
};

const parseGeminiBox = payload => {
  const text = payload?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const value = JSON.parse(match[0]);
    const numbers = ['x', 'y', 'width', 'height'].map(key => Number(value[key]));
    if (!numbers.every(Number.isFinite)) return null;
    const [x, y, width, height] = numbers.map(item => Math.max(0, Math.min(1000, item)));
    return width >= 20 && height >= 20 ? { x, y, width, height } : null;
  } catch { return null; }
};

const findAvatarFocus = async (buffer, mimetype) => {
  if (!process.env.GEMINI_API_KEY) return null;
  const endpoint = `${process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta'}/models/${encodeURIComponent(process.env.GEMINI_MODEL || 'gemini-2.5-flash')}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    signal: AbortSignal.timeout(5000),
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: mimetype, data: buffer.toString('base64') } },
          { text: 'Temukan subjek utama untuk foto profil. Balas HANYA JSON valid dengan koordinat relatif 0-1000: {"x":number,"y":number,"width":number,"height":number}. Jika wajah terlihat, gunakan area wajah dan bahu; jika tidak, gunakan subjek utama. Jangan sertakan markdown.' },
        ],
      }],
    }),
  });
  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
  return parseGeminiBox(await response.json());
};

const normalizeAvatar = async file => {
  const metadata = await sharp(file.buffer, { animated: false }).metadata();
  if (!metadata.width || !metadata.height) throw new Error('Ukuran gambar tidak dapat dibaca');
  let focus = null;
  try { focus = await findAvatarFocus(file.buffer, file.mimetype); } catch (error) { console.warn('[avatar-gemini-fallback]', error.message); }
  const sourceSize = Math.min(metadata.width, metadata.height);
  const centerX = focus ? (focus.x + focus.width / 2) / 1000 * metadata.width : metadata.width / 2;
  const centerY = focus ? (focus.y + focus.height / 2) / 1000 * metadata.height : metadata.height / 2;
  const focusSize = focus ? Math.max(focus.width / 1000 * metadata.width, focus.height / 1000 * metadata.height) * 1.35 : sourceSize;
  const cropSize = Math.max(1, Math.min(sourceSize, Math.round(focusSize)));
  const left = Math.max(0, Math.min(metadata.width - cropSize, Math.round(centerX - cropSize / 2)));
  const top = Math.max(0, Math.min(metadata.height - cropSize, Math.round(centerY - cropSize / 2)));
  const buffer = await sharp(file.buffer, { animated: false })
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(512, 512, { fit: 'cover' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  return { buffer, mimetype: 'image/jpeg', originalname: 'avatar-512.jpg', crop: { left, top, size: cropSize }, focusSource: focus ? 'gemini' : 'center' };
};

module.exports = { upload, avatarUpload, hasValidImageSignature, parseGeminiBox, findAvatarFocus, normalizeAvatar };
