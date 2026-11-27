#!/usr/bin/env node
/**
 * Menyiapkan aset logo resmi PSI.
 *
 * 1. Bila folder sumber ada (env PSI_LOGO_DIR, default ../psi-logo-aset),
 *    salin semua berkas gambar di dalamnya ke public/logo/.
 * 2. Pindai public/logo/ untuk berkas logo resmi yang dikenal, baca
 *    dimensinya, lalu tulis lib/generated/logo-manifest.json.
 *
 * Situs TIDAK pernah membuat logo tiruan/placeholder: bila berkas resmi
 * tidak ada, komponen <Logo> hanya menampilkan nama situs sebagai teks.
 *
 * Dijalankan otomatis sebelum `npm run dev` dan `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicLogo = path.join(root, "public", "logo");
const manifestPath = path.join(root, "lib", "generated", "logo-manifest.json");
const sourceDir = path.resolve(
  root,
  process.env.PSI_LOGO_DIR || path.join("..", "psi-logo-aset"),
);

const KNOWN = {
  horizontalWarna: "logo-horizontal-warna.png",
  horizontalPutih: "logo-horizontal-putih.png",
  vertikalWarna: "logo-vertikal-warna.png",
  vertikalPutih: "logo-vertikal-putih.png",
  kepalaMerah: "logo-kepala-merah.png",
};

const IMAGE_EXT = new Set([".png", ".svg", ".webp", ".jpg", ".jpeg"]);

fs.mkdirSync(publicLogo, { recursive: true });
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

let copied = 0;
if (fs.existsSync(sourceDir) && fs.statSync(sourceDir).isDirectory()) {
  for (const name of fs.readdirSync(sourceDir)) {
    if (!IMAGE_EXT.has(path.extname(name).toLowerCase())) continue;
    fs.copyFileSync(path.join(sourceDir, name), path.join(publicLogo, name));
    copied++;
  }
  console.log(`[logo] ${copied} berkas disalin dari ${sourceDir}`);
} else {
  console.log(`[logo] folder sumber tidak ditemukan (${sourceDir}) — memakai isi public/logo/ apa adanya`);
}

/** Baca lebar/tinggi PNG dari header IHDR. */
function pngSize(file) {
  const buf = fs.readFileSync(file);
  const sig = "89504e470d0a1a0a";
  if (buf.subarray(0, 8).toString("hex") !== sig) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const manifest = {};
for (const [key, file] of Object.entries(KNOWN)) {
  const full = path.join(publicLogo, file);
  if (!fs.existsSync(full)) {
    manifest[key] = null;
    continue;
  }
  const size = pngSize(full);
  manifest[key] = size
    ? { src: `/logo/${file}`, width: size.width, height: size.height }
    : null;
}

const next = JSON.stringify(manifest, null, 2) + "\n";
const prev = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8") : "";
if (prev !== next) fs.writeFileSync(manifestPath, next);

const found = Object.values(manifest).filter(Boolean).length;
console.log(`[logo] ${found}/${Object.keys(KNOWN).length} logo resmi terdeteksi di public/logo/`);
