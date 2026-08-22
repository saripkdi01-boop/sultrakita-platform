#!/usr/bin/env bash
set -Eeuo pipefail
: "${DATABASE_URL:?DATABASE_URL wajib diisi}"
: "${BACKUP_FILE:?BACKUP_FILE wajib menunjuk file .dump}"
[[ "${CONFIRM_RESTORE:-}" == "YES" ]] || { echo 'Set CONFIRM_RESTORE=YES untuk restore yang destruktif' >&2; exit 1; }
[[ -f "$BACKUP_FILE" && -f "$BACKUP_FILE.sha256" ]] || { echo 'File backup atau checksum tidak ditemukan' >&2; exit 1; }
sha256sum --check "$BACKUP_FILE.sha256"
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" "$BACKUP_FILE"
printf 'Restore completed from: %s\n' "$BACKUP_FILE"
