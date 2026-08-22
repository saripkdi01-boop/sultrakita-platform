#!/usr/bin/env bash
set -Eeuo pipefail
: "${DATABASE_URL:?DATABASE_URL wajib diisi}"
BACKUP_DIR="${BACKUP_DIR:-./backups/postgres}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
if [[ "${CI:-false}" == "true" && -z "${BACKUP_S3_URI:-}" ]]; then
  echo 'BACKUP_S3_URI wajib diisi pada CI agar backup tidak hilang setelah runner selesai' >&2
  exit 1
fi
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BACKUP_DIR"
FILE="$BACKUP_DIR/sultrakita-$STAMP.dump"
pg_dump "$DATABASE_URL" --format=custom --compress=9 --file="$FILE"
sha256sum "$FILE" > "$FILE.sha256"
if [[ -n "${BACKUP_S3_URI:-}" ]]; then
  command -v aws >/dev/null || { echo 'aws CLI diperlukan saat BACKUP_S3_URI digunakan' >&2; exit 1; }
  aws s3 cp "$FILE" "$BACKUP_S3_URI/$(basename "$FILE")" --only-show-errors
  aws s3 cp "$FILE.sha256" "$BACKUP_S3_URI/$(basename "$FILE.sha256")" --only-show-errors
fi
find "$BACKUP_DIR" -type f -name 'sultrakita-*.dump*' -mtime "+$RETENTION_DAYS" -delete
printf 'Backup created: %s\n' "$FILE"
