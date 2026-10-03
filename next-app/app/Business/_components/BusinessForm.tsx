'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { z } from 'zod';
import HoursEditor, { DAY_LABELS, DAY_ORDER, DEFAULT_HOURS, type BusinessHours } from './HoursEditor';
import {
  card,
  errorBox,
  fieldError,
  fieldHint,
  fieldInput,
  fieldLabel,
  fieldTextarea,
  visuallyHidden,
} from './formStyles';

export type CategoryOption = { value: string; label: string };

export type BusinessFormData = {
  nama: string;
  kategori: string;
  deskripsi: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telepon: string;
  whatsapp: string;
  email: string;
  website: string;
  jam_operasional: BusinessHours;
};

export type BusinessFormProps = {
  categories: CategoryOption[];
  mode: 'create' | 'edit';
  initial?: Partial<BusinessFormData>;
  onSubmit: (data: BusinessFormData) => Promise<void>;
  submitting: boolean;
  serverError: string | null;
};

const HOURS_PREFIX = 'bf-jam';

/* ---------- Skema validasi per langkah ---------- */

const step1Schema = z.object({
  nama: z.string().trim().min(3, 'Nama usaha minimal 3 karakter.').max(120, 'Nama usaha maksimal 120 karakter.'),
  kategori: z.string().min(1, 'Pilih kategori usaha.'),
  deskripsi: z.string().max(2000, 'Deskripsi maksimal 2000 karakter.').optional().default(''),
});

// Regex disamakan dengan API (POST /api/businesses): /^[+0-9()\-\s]{6,20}$/
const phoneRegex = /^[+0-9()\-\s]{6,20}$/;

const step2Schema = z.object({
  alamat: z.string().trim().min(5, 'Alamat minimal 5 karakter.').max(300, 'Alamat maksimal 300 karakter.'),
  kota: z.string().trim().min(2, 'Kota/kabupaten wajib diisi.').max(80, 'Kota/kabupaten maksimal 80 karakter.'),
  provinsi: z.string().trim().min(2, 'Provinsi wajib diisi.').max(80, 'Provinsi maksimal 80 karakter.'),
  telepon: z
    .string()
    .trim()
    .max(25, 'Nomor telepon maksimal 25 karakter.')
    .refine((v) => v === '' || phoneRegex.test(v), 'Format nomor telepon tidak valid.'),
  whatsapp: z
    .string()
    .trim()
    .max(25, 'Nomor WhatsApp maksimal 25 karakter.')
    .refine((v) => v === '' || phoneRegex.test(v), 'Format nomor WhatsApp tidak valid.'),
  email: z
    .string()
    .trim()
    .max(120, 'Email maksimal 120 karakter.')
    .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Format email tidak valid.'),
  website: z
    .string()
    .trim()
    .max(200, 'Website maksimal 200 karakter.')
    .refine(
      (v) => v === '' || /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v),
      'Format website tidak valid (contoh: https://usahaku.id).',
    ),
});

const step3Schema = z.object({
  jam_operasional: z
    .record(z.string(), z.object({ open: z.string(), close: z.string() }).nullable())
    .superRefine((val, ctx) => {
      for (const [day, range] of Object.entries(val)) {
        if (!range) continue;
        if (!range.open || !range.close) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['jam_operasional', day],
            message: `Lengkapi jam buka dan jam tutup hari ${DAY_LABELS[day] ?? day}.`,
          });
        } else if (range.open >= range.close) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['jam_operasional', day],
            message: 'Jam tutup harus lebih larut dari jam buka.',
          });
        }
      }
    }),
});

function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join('.');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function validateStep(step: number, values: BusinessFormData): Record<string, string> {
  if (step === 1) {
    const result = step1Schema.safeParse(values);
    return result.success ? {} : toFieldErrors(result.error);
  }
  if (step === 2) {
    const result = step2Schema.safeParse(values);
    return result.success ? {} : toFieldErrors(result.error);
  }
  const result = step3Schema.safeParse(values);
  return result.success ? {} : toFieldErrors(result.error);
}

const STEP_FIELDS: Record<number, string[]> = {
  1: ['nama', 'kategori', 'deskripsi'],
  2: ['alamat', 'kota', 'provinsi', 'telepon', 'whatsapp', 'email', 'website'],
  3: ['jam_operasional'],
};

const STEPS = [
  { n: 1, title: 'Info dasar', desc: 'Nama, kategori, dan deskripsi usaha' },
  { n: 2, title: 'Kontak & lokasi', desc: 'Alamat dan cara pelanggan menghubungi Anda' },
  { n: 3, title: 'Jam operasional', desc: 'Kapan usaha Anda buka setiap hari' },
  { n: 4, title: 'Review & kirim', desc: 'Periksa kembali sebelum dikirim' },
];

function formatTimeId(hhmm: string): string {
  return hhmm.replace(':', '.');
}

function defaultValues(initial?: Partial<BusinessFormData>): BusinessFormData {
  return {
    nama: initial?.nama ?? '',
    kategori: initial?.kategori ?? '',
    deskripsi: initial?.deskripsi ?? '',
    alamat: initial?.alamat ?? '',
    kota: initial?.kota ?? 'Kendari',
    provinsi: initial?.provinsi ?? 'Sulawesi Tenggara',
    telepon: initial?.telepon ?? '',
    whatsapp: initial?.whatsapp ?? '',
    email: initial?.email ?? '',
    website: initial?.website ?? '',
    jam_operasional: initial?.jam_operasional ?? { ...DEFAULT_HOURS },
  };
}

/** Form multi-langkah pendaftaran / ubah data bisnis. */
export default function BusinessForm({ categories, mode, initial, onSubmit, submitting, serverError }: BusinessFormProps) {
  const [values, setValues] = useState<BusinessFormData>(() => defaultValues(initial));
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isEdit = mode === 'edit';

  useEffect(() => {
    headingRef.current?.focus();
  }, [step ]);

  function set<K extends keyof BusinessFormData>(key: K, value: BusinessFormData[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (k === key || k.startsWith(`${String(key)}.`)) delete next[k];
      }
      return next;
    });
  }

  function focusFirstError(fieldErrors: Record<string, string>, failedStep: number) {
    const order = STEP_FIELDS[failedStep] ?? [];
    for (const field of order) {
      const match = Object.keys(fieldErrors).find((k) => k === field || k.startsWith(`${field}.`));
      if (!match) continue;
      let targetId = `bf-${field}`;
      if (match.startsWith('jam_operasional.')) {
        const day = match.split('.')[1];
        const openEl = document.getElementById(`${HOURS_PREFIX}-${day}-open`);
        targetId = openEl ? `${HOURS_PREFIX}-${day}-open` : `${HOURS_PREFIX}-${day}-closed`;
      }
      document.getElementById(targetId)?.focus();
      return;
    }
  }

  function goNext() {
    const fieldErrors = validateStep(step, values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      focusFirstError(fieldErrors, step);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (step < 4) {
      goNext();
      return;
    }
    const fieldErrors = {
      ...validateStep(1, values),
      ...validateStep(2, values),
      ...validateStep(3, values),
    };
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const failedStep = Object.keys(fieldErrors).some((k) => k.startsWith('jam_operasional')) ? 3
        : STEP_FIELDS[2].some((f) => fieldErrors[f]) ? 2 : 1;
      setStep(failedStep);
      // Fokus setelah pindah langkah
      window.setTimeout(() => focusFirstError(fieldErrors, failedStep), 60);
      return;
    }
    setErrors({});
    await onSubmit(values);
  }

  const dayErrors: Record<string, string> = {};
  for (const [key, message] of Object.entries(errors)) {
    if (key.startsWith('jam_operasional.')) {
      const day = key.split('.')[1];
      if (day && !dayErrors[day]) dayErrors[day] = message;
    }
  }

  const resolvedCategoryLabel = categories.find((c) => c.value === values.kategori)?.label ?? values.kategori;

  function fieldErrorFor(name: string) {
    const message = errors[name];
    if (!message) return null;
    return (
      <p id={`bf-${name}-error`} role="alert" style={fieldError}>
        {message}
      </p>
    );
  }

  function describedBy(name: string, hintId?: string) {
    const ids: string[] = [];
    if (errors[name]) ids.push(`bf-${name}-error`);
    if (hintId) ids.push(hintId);
    return ids.length ? ids.join(' ') : undefined;
  }

  const requiredMark = (
    <span aria-hidden="true" style={{ color: 'var(--sb-danger)' }}>
      {' *'}
    </span>
  );

  return (
    <form onSubmit={(e) => void handleSubmit(e)} noValidate aria-busy={submitting}>
      {/* Indikator langkah */}
      <div style={{ marginBottom: 26 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--sb-muted)', margin: '0 0 10px' }}>
          Langkah {step} dari 4 — {STEPS[step - 1].title}
        </p>
        <div
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label="Kemajuan pengisian formulir"
          style={{ height: 8, borderRadius: 999, background: 'var(--sb-line)', overflow: 'hidden' }}
        >
          <div style={{ width: `${(step / 4) * 100}%`, height: '100%', borderRadius: 999, background: 'var(--sb-teal)' }} />
        </div>
        <ol
          aria-label="Tahapan pengisian"
          style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', gap: 8, flexWrap: 'wrap' }}
        >
          {STEPS.map((s) => {
            const state = s.n < step ? 'done' : s.n === step ? 'current' : 'todo';
            return (
              <li
                key={s.n}
                aria-current={state === 'current' ? 'step' : undefined}
                style={{
                  flex: '1 1 0',
                  minWidth: 120,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: state === 'todo' ? 'var(--sb-muted)' : 'var(--sb-ink)',
                  opacity: state === 'todo' ? 0.75 : 1,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    flex: 'none',
                    fontSize: 12,
                    fontWeight: 900,
                    background: state === 'done' ? 'var(--sb-teal)' : state === 'current' ? 'var(--sb-ink)' : 'var(--sb-surface)',
                    color: state === 'todo' ? 'var(--sb-muted)' : 'var(--sb-on-accent)',
                    border: state === 'todo' ? '1px solid var(--sb-line)' : 'none',
                    boxShadow:
                      state === 'current'
                        ? '0 0 0 4px color-mix(in srgb, var(--sb-teal) 22%, transparent)'
                        : 'none',
                  }}
                >
                  {state === 'done' ? '✓' : s.n}
                </span>
                <span>{s.title}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div style={{ ...card, padding: 22 }}>
        <h2 ref={headingRef} tabIndex={-1} style={{ margin: '0 0 6px', fontSize: 20, letterSpacing: '-.02em', outline: 'none' }}>
          {STEPS[step - 1].title}
        </h2>
        <p style={{ margin: '0 0 22px', fontSize: 13, color: 'var(--sb-muted)' }}>
          {STEPS[step - 1].desc}. Kolom bertanda <span aria-hidden="true" style={{ color: 'var(--sb-danger)' }}>*</span> wajib diisi.
        </p>

        {/* Langkah 1 — Info dasar */}
        {step === 1 && (
          <div style={{ display: 'grid', gap: 18 }}>
            <label htmlFor="bf-nama" style={fieldLabel}>
              <span>
                Nama usaha{requiredMark}
              </span>
              <input
                id="bf-nama"
                type="text"
                value={values.nama}
                onChange={(e) => set('nama', e.target.value)}
                maxLength={120}
                required
                aria-required="true"
                aria-invalid={errors.nama ? true : undefined}
                aria-describedby={describedBy('nama', 'bf-nama-hint')}
                autoComplete="organization"
                style={fieldInput}
              />
              <span id="bf-nama-hint" style={fieldHint}>
                Nama resmi atau nama populer usaha Anda.
              </span>
              {fieldErrorFor('nama')}
            </label>

            <label htmlFor="bf-kategori" style={fieldLabel}>
              <span>
                Kategori usaha{requiredMark}
              </span>
              <select
                id="bf-kategori"
                value={values.kategori}
                onChange={(e) => set('kategori', e.target.value)}
                required
                aria-required="true"
                aria-invalid={errors.kategori ? true : undefined}
                aria-describedby={describedBy('kategori')}
                style={fieldInput}
              >
                <option value="">Pilih kategori…</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {fieldErrorFor('kategori')}
            </label>

            <label htmlFor="bf-deskripsi" style={fieldLabel}>
              <span>Deskripsi usaha</span>
              <textarea
                id="bf-deskripsi"
                value={values.deskripsi}
                onChange={(e) => set('deskripsi', e.target.value)}
                maxLength={2000}
                aria-invalid={errors.deskripsi ? true : undefined}
                aria-describedby={describedBy('deskripsi', 'bf-deskripsi-hint')}
                style={fieldTextarea}
              />
              <span id="bf-deskripsi-hint" style={{ ...fieldHint, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span>Ceritakan produk, layanan, dan keunggulan usaha Anda.</span>
                <span aria-hidden="true">{values.deskripsi.length}/2000</span>
              </span>
              {fieldErrorFor('deskripsi')}
            </label>
          </div>
        )}

        {/* Langkah 2 — Kontak & lokasi */}
        {step === 2 && (
          <div style={{ display: 'grid', gap: 18 }}>
            <label htmlFor="bf-alamat" style={fieldLabel}>
              <span>
                Alamat lengkap{requiredMark}
              </span>
              <textarea
                id="bf-alamat"
                value={values.alamat}
                onChange={(e) => set('alamat', e.target.value)}
                maxLength={300}
                rows={2}
                required
                aria-required="true"
                aria-invalid={errors.alamat ? true : undefined}
                aria-describedby={describedBy('alamat')}
                autoComplete="street-address"
                style={{ ...fieldTextarea, minHeight: 84 }}
              />
              {fieldErrorFor('alamat')}
            </label>

            <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <label htmlFor="bf-kota" style={fieldLabel}>
                <span>
                  Kota/Kabupaten{requiredMark}
                </span>
                <input
                  id="bf-kota"
                  type="text"
                  value={values.kota}
                  onChange={(e) => set('kota', e.target.value)}
                  maxLength={80}
                  required
                  aria-required="true"
                  aria-invalid={errors.kota ? true : undefined}
                  aria-describedby={describedBy('kota')}
                  autoComplete="address-level2"
                  style={fieldInput}
                />
                {fieldErrorFor('kota')}
              </label>
              <label htmlFor="bf-provinsi" style={fieldLabel}>
                <span>
                  Provinsi{requiredMark}
                </span>
                <input
                  id="bf-provinsi"
                  type="text"
                  value={values.provinsi}
                  onChange={(e) => set('provinsi', e.target.value)}
                  maxLength={80}
                  required
                  aria-required="true"
                  aria-invalid={errors.provinsi ? true : undefined}
                  aria-describedby={describedBy('provinsi')}
                  autoComplete="address-level1"
                  style={fieldInput}
                />
                {fieldErrorFor('provinsi')}
              </label>
            </div>

            <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <label htmlFor="bf-telepon" style={fieldLabel}>
                <span>Nomor telepon (opsional)</span>
                <input
                  id="bf-telepon"
                  type="tel"
                  value={values.telepon}
                  onChange={(e) => set('telepon', e.target.value)}
                  maxLength={25}
                  aria-invalid={errors.telepon ? true : undefined}
                  aria-describedby={describedBy('telepon')}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="08xxxxxxxxxx"
                  style={fieldInput}
                />
                {fieldErrorFor('telepon')}
              </label>
              <label htmlFor="bf-whatsapp" style={fieldLabel}>
                <span>Nomor WhatsApp (opsional)</span>
                <input
                  id="bf-whatsapp"
                  type="tel"
                  value={values.whatsapp}
                  onChange={(e) => set('whatsapp', e.target.value)}
                  maxLength={25}
                  aria-invalid={errors.whatsapp ? true : undefined}
                  aria-describedby={describedBy('whatsapp', 'bf-whatsapp-hint')}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="08xxxxxxxxxx"
                  style={fieldInput}
                />
                <span id="bf-whatsapp-hint" style={fieldHint}>
                  Bisa sama dengan nomor telepon.
                </span>
                {fieldErrorFor('whatsapp')}
              </label>
            </div>

            <label htmlFor="bf-email" style={fieldLabel}>
              <span>Email usaha (opsional)</span>
              <input
                id="bf-email"
                type="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                maxLength={120}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy('email')}
                autoComplete="email"
                inputMode="email"
                placeholder="halo@usahaku.id"
                style={fieldInput}
              />
              {fieldErrorFor('email')}
            </label>

            <label htmlFor="bf-website" style={fieldLabel}>
              <span>Website (opsional)</span>
              <input
                id="bf-website"
                type="url"
                value={values.website}
                onChange={(e) => set('website', e.target.value)}
                maxLength={200}
                aria-invalid={errors.website ? true : undefined}
                aria-describedby={describedBy('website', 'bf-website-hint')}
                autoComplete="url"
                inputMode="url"
                placeholder="https://usahaku.id"
                style={fieldInput}
              />
              <span id="bf-website-hint" style={fieldHint}>
                Contoh: https://usahaku.id
              </span>
              {fieldErrorFor('website')}
            </label>
          </div>
        )}

        {/* Langkah 3 — Jam operasional */}
        {step === 3 && (
          <div>
            <p id="bf-jam-hint" style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--sb-muted)', lineHeight: 1.6 }}>
              Centang “Tutup” untuk hari libur usaha Anda.
            </p>
            <HoursEditor
              value={values.jam_operasional}
              onChange={(next) => set('jam_operasional', next)}
              idPrefix={HOURS_PREFIX}
              dayErrors={dayErrors}
            />
          </div>
        )}

        {/* Langkah 4 — Review & kirim */}
        {step === 4 && (
          <div>
            <dl style={{ margin: 0, display: 'grid', gap: 0, borderTop: '1px solid var(--sb-line)' }}>
              <ReviewRow label="Nama usaha" value={values.nama} />
              <ReviewRow label="Kategori usaha" value={resolvedCategoryLabel || '—'} />
              <ReviewRow label="Deskripsi usaha" value={values.deskripsi || '—'} multiline />
              <ReviewRow label="Alamat" value={`${values.alamat}, ${values.kota}, ${values.provinsi}`} multiline />
              <ReviewRow label="Telepon" value={values.telepon || '—'} />
              <ReviewRow label="WhatsApp" value={values.whatsapp || '—'} />
              <ReviewRow label="Email" value={values.email || '—'} />
              <ReviewRow label="Website" value={values.website || '—'} />
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--sb-line)' }}>
                <dt style={{ fontSize: 12, fontWeight: 800, color: 'var(--sb-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Jam operasional
                </dt>
                <dd style={{ margin: '8px 0 0', display: 'grid', gap: 4, fontSize: 14 }}>
                  {DAY_ORDER.map((day) => {
                    const range = values.jam_operasional[day] ?? null;
                    return (
                      <span key={day} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ color: 'var(--sb-muted)' }}>{DAY_LABELS[day]}</span>
                        <span style={{ fontWeight: 700 }}>
                          {range ? `${formatTimeId(range.open)}–${formatTimeId(range.close)}` : 'Tutup'}
                        </span>
                      </span>
                    );
                  })}
                </dd>
              </div>
            </dl>
            <p style={{ margin: '18px 0 0', fontSize: 13, color: 'var(--sb-muted)', lineHeight: 1.7 }}>
              {isEdit
                ? 'Periksa kembali perubahan di atas sebelum disimpan.'
                : 'Setelah dikirim, tim SUKI akan mengkurasi profil usaha Anda sebelum tayang.'}
            </p>
            {serverError && (
              <div role="alert" style={{ ...errorBox, marginTop: 16 }}>
                {serverError}
              </div>
            )}
          </div>
        )}

        {/* Navigasi */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className="suki-business-button suki-business-button-light"
              style={{ flex: '1 1 0' }}
            >
              Kembali
            </button>
          )}
          {step < 4 ? (
            <button
              type="submit"
              disabled={submitting}
              className="suki-business-button suki-business-button-dark"
              style={{ flex: '2 1 0' }}
            >
              Lanjut
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="suki-business-button suki-business-button-teal"
              style={{ flex: '2 1 0' }}
            >
              {submitting ? 'Mengirim…' : isEdit ? 'Simpan Perubahan' : 'Kirim untuk Kurasi'}
            </button>
          )}
        </div>
        {step < 4 && (
          <p style={visuallyHidden} aria-live="polite">
            {Object.keys(errors).length > 0 ? 'Ada kolom yang perlu diperbaiki.' : ''}
          </p>
        )}
      </div>
    </form>
  );
}

function ReviewRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--sb-line)' }}>
      <dt style={{ fontSize: 12, fontWeight: 800, color: 'var(--sb-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {label}
      </dt>
      <dd style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 600, color: 'var(--sb-ink)', whiteSpace: multiline ? 'pre-wrap' : undefined, overflowWrap: 'anywhere' }}>
        {value}
      </dd>
    </div>
  );
}
