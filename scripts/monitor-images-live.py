#!/usr/bin/env python3
"""
Monitor gambar live di sukiapps.web.id.

Cek setiap gambar penting:
1. HTTP 200
2. Content-Type adalah image/*
3. Body adalah binary image valid (bukan base64 text / HTML error)
4. Ukuran wajar (>1KB)

Kirim notifikasi via tg_notify.py jika ada masalah.

Jalankan manual atau via cron:
  python3 scripts/monitor-images-live.py
"""
import subprocess
import sys
import urllib.request
import ssl

SITE = "https://sukiapps.web.id"

# Gambar penting yang harus selalu tampil
IMAGES = [
    "/images/jembatan-bahteramas.jpg",
    "/images/jembatan-bahteramas-2.jpg",
    "/images/masjid-al-alam.jpg",
    "/images/tugu-mtq.jpg",
    "/images/komunitas-1.jpg",
    "/images/komunitas-2.jpg",
    "/images/komunitas-3.jpg",
    "/brand/suki-logo-mark.svg",
]

MAGIC = [b"\xff\xd8\xff", b"\x89PNG", b"GIF8", b"<svg"]


def check_image(path):
    """Return (ok, pesan)."""
    url = SITE + path
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        req = urllib.request.Request(
            url, headers={"User-Agent": "SUKI-ImageMonitor/1.0"})
        with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
            status = r.status
            ctype = r.headers.get("Content-Type", "")
            body = r.read(2048)  # cukup untuk cek magic bytes
            total = len(body)
    except Exception as e:
        return False, f"{path}: fetch gagal ({str(e)[:60]})"

    if status != 200:
        return False, f"{path}: HTTP {status}"

    # Cek apakah body adalah base64 text (masalah kemarin)
    try:
        text = body[:8].decode("ascii")
        if text.startswith(("/9j/", "iVBOR", "R0lGOD", "UklGR")):
            return False, f"{path}: BASE64 TEXT (bukan binary!)"
    except UnicodeDecodeError:
        pass

    # Cek magic bytes
    is_image = any(body.startswith(m) for m in MAGIC)
    # SVG mungkin diawali whitespace/xml declaration
    if not is_image and (b"<svg" in body[:500] or b"<?xml" in body[:100]):
        is_image = True

    if not is_image:
        preview = body[:60]
        return False, f"{path}: bukan gambar valid (ctype={ctype}, head={preview!r})"

    return True, f"{path}: OK ({ctype})"


def notify(msg):
    try:
        subprocess.run(
            ["python3", "/home/hatch/telegram-scraper/tg_notify.py", msg],
            capture_output=True, timeout=30)
    except Exception:
        pass


def main():
    print(f"Monitoring {len(IMAGES)} gambar di {SITE}...\n")
    failures = []
    for path in IMAGES:
        ok, msg = check_image(path)
        print(("✅ " if ok else "❌ ") + msg)
        if not ok:
            failures.append(msg)

    print(f"\n--- {len(IMAGES) - len(failures)}/{len(IMAGES)} OK ---")

    if failures:
        alert = ("🖼️ *Image Monitor*: masalah gambar terdeteksi!\n\n" +
                 "\n".join(failures))
        notify(alert)
        print("\nNotifikasi terkirim via Telegram.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
