#!/usr/bin/env python3
"""
Validasi & auto-fix gambar di public/images.

Fungsi:
1. Deteksi file gambar yang tersimpan sebagai base64 text (bukan binary)
2. Auto-decode ke binary asli
3. Validasi semua gambar bisa dibaca sebagai image valid
4. Laporkan ukuran file untuk monitoring

Jalankan: python3 scripts/validate-images.py [--fix] [--check-only]

Exit code 0 = semua OK, 1 = ada masalah (untuk CI).
"""
import base64
import os
import sys

IMAGE_DIR = os.path.join(os.path.dirname(__file__), "..", "next-app", "public", "images")
IMAGE_DIR = os.path.abspath(IMAGE_DIR)

# Magic bytes untuk deteksi format
MAGIC = {
    b"\xff\xd8\xff": "JPEG",
    b"\x89PNG": "PNG",
    b"GIF8": "GIF",
    b"RIFF": "WEBP",  # perlu cek lanjutan, tapi cukup
}

# Prefix base64 untuk tiap format
B64_PREFIX = {
    "/9j/": "JPEG",
    "iVBOR": "PNG",
    "R0lGOD": "GIF",
    "UklGR": "WEBP",
}


def is_base64_text(path):
    """Cek apakah file adalah base64 text, bukan binary."""
    try:
        with open(path, "rb") as f:
            head = f.read(8)
        # Jika bisa di-decode sebagai ASCII dan diawali prefix base64 dikenal
        try:
            text = head.decode("ascii")
            for prefix in B64_PREFIX:
                if text.startswith(prefix):
                    return True
        except UnicodeDecodeError:
            pass
        return False
    except Exception:
        return False


def is_valid_image(path):
    """Cek apakah file adalah gambar binary valid."""
    try:
        with open(path, "rb") as f:
            head = f.read(12)
        for magic in MAGIC:
            if head.startswith(magic):
                return True
        return False
    except Exception:
        return False


def decode_base64_file(path):
    """Decode file base64 ke binary."""
    with open(path, "r") as f:
        content = f.read().strip()
    # Bersihkan whitespace/newline
    content = "".join(content.split())
    binary = base64.b64decode(content)
    with open(path, "wb") as f:
        f.write(binary)


def main():
    fix = "--fix" in sys.argv
    check_only = "--check-only" in sys.argv

    if not os.path.isdir(IMAGE_DIR):
        print(f"SKIP: direktori tidak ada: {IMAGE_DIR}")
        return 0

    files = [f for f in os.listdir(IMAGE_DIR)
             if f.lower().endswith((".jpg", ".jpeg", ".png", ".gif", ".webp"))]
    if not files:
        print("SKIP: tidak ada file gambar")
        return 0

    errors = []
    fixed = []

    for fname in sorted(files):
        path = os.path.join(IMAGE_DIR, fname)
        size = os.path.getsize(path)

        if is_base64_text(path):
            if fix and not check_only:
                try:
                    decode_base64_file(path)
                    fixed.append(fname)
                    print(f"FIXED: {fname} (base64 -> binary)")
                except Exception as e:
                    errors.append(f"{fname}: gagal decode ({e})")
                    print(f"ERROR: {fname}: gagal decode: {e}")
            else:
                errors.append(f"{fname}: masih base64 text ({size} bytes)")
                print(f"ERROR: {fname}: base64 text, bukan binary!")
        elif not is_valid_image(path):
            errors.append(f"{fname}: bukan gambar valid ({size} bytes)")
            print(f"ERROR: {fname}: format tidak dikenali!")
        else:
            # Valid, tampilkan info
            fmt = "?"
            with open(path, "rb") as f:
                head = f.read(12)
            for magic, name in MAGIC.items():
                if head.startswith(magic):
                    fmt = name
                    break
            print(f"OK: {fname} ({fmt}, {size:,} bytes)")

    print(f"\n--- Ringkasan: {len(files)} file, {len(fixed)} diperbaiki, "
          f"{len(errors)} error ---")

    if check_only and errors:
        print("\nJalankan dengan --fix untuk perbaiki otomatis.")
        return 1
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
