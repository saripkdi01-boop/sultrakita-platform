#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
echo "Fixing Sidebar Navigation & Support System..."

if [[ -f "supabase/migrations/20260908000000_support_system.sql" ]]; then echo "Migration file exists"; else echo "Migration file not found"; exit 1; fi
SIDEBAR="next-app/components/navigation/SidebarNavigation.tsx"
for route in "/security-center" "/help-center" "/support" "/legal/terms"; do
  if grep -q "href=\"$route\"" "$SIDEBAR"; then echo "Sidebar route OK: $route"; else echo "Missing sidebar route: $route"; exit 1; fi
done
npm --prefix next-app run build
echo "All local sidebar and support checks passed."
echo "Next: run the Supabase migration, then npm run seed:help, push, and hard-refresh production."
