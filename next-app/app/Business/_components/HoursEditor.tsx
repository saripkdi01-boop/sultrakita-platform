'use client';

import { fieldError } from './formStyles';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

export type DayHours = { open: string; close: string } | null;
export type BusinessHours = Record<string, DayHours>;

export const DAY_ORDER = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'] as const;

const DAY_KEYS: Record<string, 'bDayMon' | 'bDayTue' | 'bDayWed' | 'bDayThu' | 'bDayFri' | 'bDaySat' | 'bDaySun'> = {
  senin: 'bDayMon',
  selasa: 'bDayTue',
  rabu: 'bDayWed',
  kamis: 'bDayThu',
  jumat: 'bDayFri',
  sabtu: 'bDaySat',
  minggu: 'bDaySun',
};

export const DAY_LABELS: Record<string, string> = {
  senin: 'Senin',
  selasa: 'Selasa',
  rabu: 'Rabu',
  kamis: 'Kamis',
  jumat: 'Jumat',
  sabtu: 'Sabtu',
  minggu: 'Minggu',
};

export const DEFAULT_HOURS: BusinessHours = {
  senin: { open: '08:00', close: '17:00' },
  selasa: { open: '08:00', close: '17:00' },
  rabu: { open: '08:00', close: '17:00' },
  kamis: { open: '08:00', close: '17:00' },
  jumat: { open: '08:00', close: '17:00' },
  sabtu: { open: '08:00', close: '13:00' },
  minggu: null,
};

/** Normalisasi nilai jam dari database/API menjadi BusinessHours yang valid. */
export function normalizeHours(input: unknown): BusinessHours {
  const out: BusinessHours = { ...DEFAULT_HOURS };
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    const record = input as Record<string, unknown>;
    for (const day of DAY_ORDER) {
      const raw = record[day];
      if (raw === null || raw === undefined) {
        out[day] = null;
        continue;
      }
      if (typeof raw === 'object') {
        const r = raw as Record<string, unknown>;
        const open = typeof r.open === 'string' ? r.open : '';
        const close = typeof r.close === 'string' ? r.close : '';
        out[day] = open && close ? { open, close } : null;
      }
    }
  }
  return out;
}

type HoursEditorProps = {
  value: BusinessHours;
  onChange: (next: BusinessHours) => void;
  /** Prefix untuk id tiap input (asosiasi label). */
  idPrefix?: string;
  /** Error per hari dari validasi form induk, keyed by nama hari (mis. 'senin'). */
  dayErrors?: Record<string, string>;
};

/** Editor jam operasional 7 hari. Nilai null = tutup. */
export default function HoursEditor({ value, onChange, idPrefix = 'jam', dayErrors = {} }: HoursEditorProps) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);
  function setDay(day: string, next: DayHours) {
    onChange({ ...value, [day]: next });
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {DAY_ORDER.map((day) => {
        const current = value[day] ?? null;
        const externalError = dayErrors[day];
        const localError =
          current !== null && current.open && current.close && current.open >= current.close
            ? b.bHoursCloseAfterOpen
            : null;
        const error = externalError ?? localError;
        const errorId = `${idPrefix}-${day}-error`;
        return (
          <div
            key={day}
            style={{
              border: '1px solid var(--sb-line)',
              borderRadius: 14,
              padding: '13px 14px',
              background: 'var(--sb-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span id={`${idPrefix}-${day}-label`} style={{ fontWeight: 800, fontSize: 14, color: 'var(--sb-ink)' }}>
                {b[DAY_KEYS[day]]}
              </span>
              <label
                htmlFor={`${idPrefix}-${day}-closed`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--sb-muted)',
                  cursor: 'pointer',
                  minHeight: 32,
                }}
              >
                <input
                  id={`${idPrefix}-${day}-closed`}
                  type="checkbox"
                  checked={current === null}
                  onChange={(event) =>
                    setDay(day, event.target.checked ? null : { open: '08:00', close: '17:00' })
                  }
                  style={{ width: 20, height: 20, accentColor: 'var(--sb-teal)' }}
                />
                {b.bHoursClosed}
              </label>
            </div>

            {current !== null && (
              <div
                role="group"
                aria-labelledby={`${idPrefix}-${day}-label`}
                style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}
              >
                <label
                  htmlFor={`${idPrefix}-${day}-open`}
                  style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--sb-muted)', flex: '1 1 120px' }}
                >
                  {b.bHoursOpen}
                  <input
                    id={`${idPrefix}-${day}-open`}
                    type="time"
                    value={current.open}
                    onChange={(event) => setDay(day, { open: event.target.value, close: current.close })}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    style={{
                      minHeight: 44,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid var(--sb-line)',
                      fontSize: 15,
                      fontFamily: 'inherit',
                      color: 'var(--sb-ink)',
                      background: 'var(--sb-surface)',
                      width: '100%',
                    }}
                  />
                </label>
                <label
                  htmlFor={`${idPrefix}-${day}-close`}
                  style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--sb-muted)', flex: '1 1 120px' }}
                >
                  {b.bHoursClose}
                  <input
                    id={`${idPrefix}-${day}-close`}
                    type="time"
                    value={current.close}
                    onChange={(event) => setDay(day, { open: current.open, close: event.target.value })}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    style={{
                      minHeight: 44,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid var(--sb-line)',
                      fontSize: 15,
                      fontFamily: 'inherit',
                      color: 'var(--sb-ink)',
                      background: 'var(--sb-surface)',
                      width: '100%',
                    }}
                  />
                </label>
              </div>
            )}

            {error && (
              <p id={errorId} role="alert" style={{ ...fieldError, marginTop: 8 }}>
                {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
