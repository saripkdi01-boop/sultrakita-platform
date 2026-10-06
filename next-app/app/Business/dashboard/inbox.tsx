'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getBusinessInquiries } from '../_components/business-api';
import InquiryList, { normalizeInquiry, type InquiryItem } from '../_components/InquiryList';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

type BusinessInquiriesProps = {
  businessId: string;
  /** Dipanggil dengan jumlah inquiry setelah termuat (untuk label <details> induk). */
  onCount?: (count: number) => void;
};

/** Daftar pertanyaan masuk untuk satu bisnis — fetch client-side dengan kredensial sesi. */
export default function BusinessInquiries({ businessId, onCount }: BusinessInquiriesProps) {
  const [items, setItems] = useState<InquiryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const onCountRef = useRef(onCount);
  onCountRef.current = onCount;
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  const load = useCallback(async () => {
    setError(null);
    try {
      const raw = await getBusinessInquiries(businessId);
      const normalized = raw.map(normalizeInquiry);
      setItems(normalized);
      onCountRef.current?.(normalized.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : b.bInqLoadError);
      setItems([]);
      onCountRef.current?.(0);
    }
  }, [businessId, b]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) {
    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          borderRadius: 14,
          border: '1px solid color-mix(in srgb, var(--sb-danger) 40%, transparent)',
          background: 'color-mix(in srgb, var(--sb-danger) 10%, var(--sb-surface))',
          color: 'var(--sb-danger)',
          padding: '12px 16px',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span>{error}</span>
        <button
          type="button"
          onClick={() => void load()}
          className="suki-business-button suki-business-button-light"
          style={{ minHeight: 38, fontSize: 12 }}
        >
          {b.bInqRetry}
        </button>
      </div>
    );
  }

  if (items === null) {
    return (
      <p style={{ margin: 0, fontSize: 13, color: 'var(--sb-muted)' }} aria-live="polite">
        {b.bInqLoading}
      </p>
    );
  }

  return <InquiryList items={items} />;
}
