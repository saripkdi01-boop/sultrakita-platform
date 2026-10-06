#!/usr/bin/env python3
"""
Monitor gambar live di sukiapps.web.id.

Cek setiap gambar penting:
1. HTTP 200
2. Body adalah binary image valid (bukan base64 text / HTML error)
3. Ukuran wajar (>1KB)

Kirim notifikasi via tg_notify.py jika ada masalah.

CATATAN JARINGAN (2026-10-06): VM ini keluar internet lewat egress proxy
yang butuh HTTP Basic auth. Python urllib TIDAK otomatis mengirim proxy
auth -> selalu 403. Karena itu fetch memakai `curl` (bisa proxy auth),
bukan urllib. Jangan ganti kembali ke urllib tanpa ProxyBasicAuthHandler.

Anti false-alarm: sebelum mengirim notifikasi, pastikan monitor benar-benar
bisa menjangkau situs. Kalau situs tidak terjangkau sama sekali (jaringan
monitor bermasalah), lewati notifikasi dan exit 2.

Jalankan manual atau via cron:
  python3 scripts/monitor-images-live.py [--no-notify]
"""
import argparse
import os
import subprocess
import sys
import tempfile

SITE = "https://sukiapps.web.id"
# Host tambahan: www pernah menunjuk ke deployment lama (2026-10-06),
# sehingga aset di www bisa basi/rusak walau apex sehat.
SITES = ["https://sukiapps.web.id", "https://www.sukiapps.web.id"]

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


def curl_fetch(url, max_bytes=65536, timeout=20):
    """Fetch via curl (proxy-auth aware). Return (ok, status, ctype, head_bytes, err).

    ok=False berarti jaringan/transport gagal (bukan HTTP error).
    """
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    try:
        p = subprocess.run(
            ["curl", "-sS", "-m", str(timeout), "-o", tmp.name,
             "-w", "%{http_code}\n%{content_type}", url],
            capture_output=True, text=True, timeout=timeout + 10)
    except Exception as e:
        return False, 0, "", b"", f"curl exception: {str(e)[:60]}"
    finally:
        pass
    try:
        with open(tmp.name, "rb") as f:
            body = f.read(max_bytes)
    except OSError:
        body = b""
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass
    if p.returncode != 0:
        return False, 0, "", b"", f"curl exit {p.returncode}: {p.stderr.strip()[:80]}"
    lines = p.stdout.strip().split("\n")
    try:
        status = int(lines[0].strip())
    except (IndexError, ValueError):
        return False, 0, "", b"", "respons curl tak terduga"
    ctype = lines[1].strip() if len(lines) > 1 else ""
    return True, status, ctype, body, ""


def site_reachable(site):
    """True jika monitor bisa menjangkau situs (respons HTTP apa pun)."""
    ok, status, _, _, _ = curl_fetch(site + "/", timeout=15)
    return ok  # HTTP 4xx/5xx pun berarti jaringan monitor OK


def check_image(site, path):
    """Return (ok, pesan)."""
    url = site + path
    ok, status, ctype, body, err = curl_fetch(url, max_bytes=4096)
    if not ok:
        return False, f"{path}: fetch gagal ({err})"
    if status != 200:
        return False, f"{path}: HTTP {status}"

    # Cek apakah body adalah base64 text (masalah 2026-10-06)
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
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-notify", action="store_true",
                    help="jangan kirim notifikasi Telegram (untuk verifikasi manual)")
    args = ap.parse_args()

    total = len(SITES) * len(IMAGES)
    print(f"Monitoring {len(IMAGES)} gambar di {len(SITES)} host...\n")
    failures = []
    transport_failed = 0
    checks = 0
    for site in SITES:
        reachable = site_reachable(site)
        for path in IMAGES:
            checks += 1
            if not reachable:
                msg = f"{site}{path}: host tak terjangkau (jaringan monitor?)"
                print("SKIP " + msg)
                transport_failed += 1
                continue
            ok, msg = check_image(site, path)
            print(("OK   " if ok else "FAIL ") + f"{site} :: " + msg)
            if not ok:
                failures.append(f"{site} :: {msg}")
                if "fetch gagal" in msg:
                    transport_failed += 1

    real_failures = [f for f in failures if "fetch gagal" not in f]
    bad = len(real_failures) + transport_failed
    print(f"\n--- {checks - bad}/{checks} OK "
          f"({len(real_failures)} rusak, {transport_failed} transport) ---")

    if not real_failures:
        if transport_failed:
            print("Hanya kegagalan transport/jaringan monitor — "
                  "notifikasi dilewati agar tidak false alarm.")
            return 2
        return 0

    alert = ("Image Monitor: masalah gambar terdeteksi\n\n" +
             "\n".join(real_failures))
    if args.no_notify:
        print("\n(--no-notify: notifikasi Telegram dilewati)")
    else:
        notify(alert)
        print("\nNotifikasi terkirim via Telegram.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
