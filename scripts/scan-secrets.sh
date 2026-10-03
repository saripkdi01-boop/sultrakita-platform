#!/usr/bin/env bash
#
# scan-secrets.sh — pemindai pola secret yang ter-commit, read-only & idempoten.
#
# Pakai:  ./scripts/scan-secrets.sh [--staged | --all]
#   --staged : pindai file yang di-stage (git diff --cached) — cocok untuk pre-commit
#   --all    : pindai semua file tracked
#   (tanpa argumen): pindai file yang berubah di working tree vs HEAD
#
# Keluar 0 bila bersih, 1 bila ada temuan (nilai secret tidak dicetak penuh).
# TIDAK menulis/mengubah apa pun. Memakai `git grep` agar cepat di repo besar.
#
# CATATAN: skrip ini sengaja konservatif (sedikit false positive lebih baik
# daripada secret yang lolos). File *.example / *.sample / *.md dikecualikan
# dari pola assignment generik (tempat wajarnya placeholder), tetapi pola
# kunci provider & private key tetap dipindai di semua file.
#
# Keterbatasan: assignment lowercase (mis. `password = "..."` di kode)
# sengaja TIDAK dipindai untuk menghindari false positive pada validator
# seperti `password: Joi.string().min(8)`; pola kunci provider (AKIA, ghp_,
# sk_live_, dsb.) tetap dipindai sesuai format aslinya.

set -euo pipefail

MODE="${1:---changed}"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Pola yang TIDAK BOLEH ada di file mana pun (nilai nyata, bukan placeholder).
ALWAYS_RE='BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY|AKIA[0-9A-Z]{16}|xox[baprs]-[0-9A-Za-z-]{10,}|ghp_[0-9A-Za-z]{36}|github_pat_[0-9A-Za-z_]{22,}|sk_live_[0-9A-Za-z]{16,}|sk_test_[0-9A-Za-z]{16,}|xnd_(production|development)_[0-9A-Za-z]{10,}|[Ss][Bb]_?[Ss][Ee][Cc][Rr][Ee][Tt]_[0-9A-Za-z]{20,}|AIza[0-9A-Za-z_-]{35}|EAAB[0-9A-Za-z]{20,}'

# Pola assignment generik (UPPERCASE, konvensi env var) dengan nilai 8+ karakter.
ASSIGN_RE='(AWS_SECRET_ACCESS_KEY|SECRET_ACCESS_KEY|CLIENT_SECRET|APP_SECRET|API_SECRET)[[:space:]]*[:=][[:space:]]*["'"'"']?[^"'"'"'[:space:]]{8,}|(PASSWORD|PASSWD)[[:space:]]*[:=][[:space:]]*["'"'"']?[^"'"'"'[:space:]]{8,}'

# Nilai placeholder yang dikecualikan dari pola assignment (case-insensitive).
# Termasuk skema zod (z.string()), validator Joi, dan password dummy kanonis
# container postgres (kata mandiri 'postgres' — bukan bagian nama variabel).
PLACEHOLDER_RE='your-|your_|xxx|changeme|example|contoh|placeholder|dummy|test123|z\.string\(\)|Joi\.|\<postgres\>|<.*>|\$\{'

# Ekstensi/path yang dilewati pola assignment (tapi tetap kena ALWAYS_RE).
ASSIGN_EXCLUDES=( ':!*.example' ':!*.sample' ':!*.md' )

fail=0

# $1 = git-grep-able rev/file-list mode; jalankan pemindaian dan cetak temuan.
scan_with_git_grep() {
  local hits
  # 1) Pola keras — semua file tracked dalam cakupan
  hits="$(git grep -nE "$ALWAYS_RE" -- "$@" 2>/dev/null || true)"
  if [ -n "$hits" ]; then
    while IFS= read -r hit; do
      file="${hit%%:*}"; rest="${hit#*:}"; lineno="${rest%%:*}"
      echo "TEMUAN [$file:$lineno]: cocok pola kunci/provider secret (nilai disembunyikan)"
      fail=1
    done <<< "$hits"
  fi
  # 2) Pola assignment — kecuali file contoh & dokumentasi
  hits="$(git grep -nE "$ASSIGN_RE" -- "$@" "${ASSIGN_EXCLUDES[@]}" 2>/dev/null | grep -viE "$PLACEHOLDER_RE" || true)"
  if [ -n "$hits" ]; then
    while IFS= read -r hit; do
      file="${hit%%:*}"; rest="${hit#*:}"; lineno="${rest%%:*}"; line="${rest#*:}"
      redacted="$(echo "$line" | sed -E 's/^([^=|:]*[=|:][[:space:]]*).*/\1<redacted>/;s/^(.{80}).*/\1…/')"
      echo "TEMUAN [$file:$lineno]: kemungkinan assignment secret: $redacted"
      fail=1
    done <<< "$hits"
  fi
}

case "$MODE" in
  --all)
    scan_with_git_grep .
    ;;
  --staged)
    mapfile -t files < <(git diff --cached --name-only --diff-filter=ACMR || true)
    if ((${#files[@]})); then scan_with_git_grep "${files[@]}"; else echo "(tidak ada file staged)"; fi
    ;;
  *)
    mapfile -t files < <(git status --porcelain | awk '{print $2}' || true)
    if ((${#files[@]})); then scan_with_git_grep "${files[@]}"; else echo "(tidak ada perubahan vs HEAD)"; fi
    ;;
esac

echo "---"
if [ "$fail" -eq 0 ]; then
  echo "BERSIH (mode: $MODE): tidak ada pola secret terdeteksi."
else
  echo "GAGAL (mode: $MODE): ada temuan di atas — periksa sebelum commit/push."
fi
exit "$fail"
