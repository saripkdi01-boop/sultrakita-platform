'use client';

import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

export default function GroupsLoading() {
  const { language } = usePreferences();
  const g = getGroupsLabels(language);
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6" aria-busy="true" aria-label={g.gLoadingGroups}>
      <div className="skeleton-line skeleton-shimmer" style={{ width: '40%', height: 32 }} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ marginTop: 16 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton-card skeleton-shimmer" aria-hidden="true">
            <div className="skeleton-line" style={{ width: '70%' }} /><div className="skeleton-line" style={{ width: '50%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
