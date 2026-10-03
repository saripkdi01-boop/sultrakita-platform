'use client';

/**
 * Form "Jual di Marketplace" — /marketplace/create.
 * Mobile-first, namespace CSS fbmc-*, dark-mode aware (variabel --paper/--ink/dll),
 * hormat prefers-reduced-motion. Tidak ada tombol mati: setiap aksi berfungsi.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Crown,
  ImagePlus,
  Loader2,
  Lock,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/lib/supabase/client';
import { csrfFetch } from '@/lib/security/csrf-client';
import { createListingMediaUpload } from '@/lib/actions/marketplace';
import { EcosystemMarketplace } from '@/components/illustrations';
import {
  CREATE_ALLOWED_PHOTO_TYPES,
  CREATE_CATEGORY_LABELS,
  CREATE_CONDITIONS,
  CREATE_MAX_PHOTO_BYTES,
  CREATE_MAX_PHOTOS,
  SULTRA_REGIONS,
  createListingPayloadSchema,
  formatIDR,
  parsePriceInput,
} from '@/lib/marketplace-create';
import './create.css';

const DRAFT_KEY = 'sk_marketplace_draft_v1';
const LOGIN_REDIRECT = `/login?redirect=${encodeURIComponent('/marketplace/create')}`;

type PhotoStatus = 'uploading' | 'done' | 'error';
type PhotoItem = {
  id: string;
  status: PhotoStatus;
  url?: string;
  key?: string;
  error?: string;
};

type FieldKey = 'title' | 'category' | 'condition' | 'price' | 'stock' | 'description' | 'district' | 'whatsapp' | 'photos';
type FieldErrors = Partial<Record<FieldKey, string>>;
type SubmitState = 'idle' | 'sending' | 'success';

type PresignedOk = {
  ok: true;
  url: string;
  fields: Record<string, string>;
  key: string;
  publicUrl: string;
};

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `p-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function photoAcceptAttr(): string {
  return CREATE_ALLOWED_PHOTO_TYPES.join(',');
}

type DraftShape = {
  title: string;
  category: string;
  condition: string;
  price: string;
  negotiable: boolean;
  stock: number;
  description: string;
  district: string;
  whatsapp: string;
  photos: Array<{ url: string; key: string }>;
  savedAt: number;
};

function readDraft(): DraftShape | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DraftShape>;
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      category: typeof parsed.category === 'string' ? parsed.category : '',
      condition: typeof parsed.condition === 'string' ? parsed.condition : '',
      price: typeof parsed.price === 'string' ? parsed.price : '',
      negotiable: parsed.negotiable !== false,
      stock: typeof parsed.stock === 'number' && Number.isFinite(parsed.stock) ? Math.min(10000, Math.max(1, Math.round(parsed.stock))) : 1,
      description: typeof parsed.description === 'string' ? parsed.description : '',
      district: typeof parsed.district === 'string' ? parsed.district : '',
      whatsapp: typeof parsed.whatsapp === 'string' ? parsed.whatsapp : '',
      photos: Array.isArray(parsed.photos)
        ? parsed.photos.filter((p) => p && typeof p.url === 'string' && typeof p.key === 'string').slice(0, CREATE_MAX_PHOTOS)
        : [],
      savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : 0,
    };
  } catch {
    return null;
  }
}

export default function CreateListingForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sessionState, setSessionState] = useState<'checking' | 'authed' | 'guest'>('checking');
  const [userName, setUserName] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [stock, setStock] = useState(1);
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [photoNotice, setPhotoNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [gateNotice, setGateNotice] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const dirtyRef = useRef(false);
  const restoredRef = useRef(false);
  const inFlightRef = useRef(false);
  const firstErrorRef = useRef<HTMLDivElement>(null);

  // ---- Sesi ----
  useEffect(() => {
    let alive = true;
    if (!supabase) {
      if (alive) setSessionState('guest');
      return () => { alive = false; };
    }
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!alive) return;
        if (data.user) {
          setSessionState('authed');
          setGateNotice(null);
          const meta = data.user.user_metadata as Record<string, unknown> | undefined;
          const name = String(meta?.full_name || meta?.name || data.user.email?.split('@')[0] || 'Seller');
          setUserName(name);
        } else {
          setSessionState('guest');
        }
      })
      .catch(() => {
        if (alive) setSessionState('guest');
      });
    return () => { alive = false; };
  }, []);

  // ---- Pulihkan draft (sekali, sebelum ada interaksi) ----
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const draft = readDraft();
    if (!draft) return;
    const empty =
      !draft.title && !draft.category && !draft.condition && !draft.price &&
      !draft.description && !draft.district && !draft.whatsapp && draft.photos.length === 0;
    if (empty) return;
    setTitle(draft.title);
    setCategory(draft.category);
    setCondition(draft.condition);
    setPrice(draft.price);
    setNegotiable(draft.negotiable);
    setStock(draft.stock);
    setDescription(draft.description);
    setDistrict(draft.district);
    setWhatsapp(draft.whatsapp);
    setPhotos(draft.photos.map((p) => ({ id: newId(), status: 'done' as const, url: p.url, key: p.key })));
    setDraftSavedAt(draft.savedAt || null);
  }, []);

  // ---- Autosave draft (debounce) ----
  const draftSnapshot = useMemo<Partial<DraftShape>>(
    () => ({
      title, category, condition, price, negotiable, stock, description, district, whatsapp,
      photos: photos.filter((p) => p.status === 'done' && p.url && p.key).map((p) => ({ url: p.url as string, key: p.key as string })),
    }),
    [title, category, condition, price, negotiable, stock, description, district, whatsapp, photos],
  );

  useEffect(() => {
    if (!dirtyRef.current) return;
    const timer = window.setTimeout(() => {
      try {
        const payload: DraftShape = { ...(draftSnapshot as DraftShape), savedAt: Date.now() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        setDraftSavedAt(payload.savedAt);
      } catch {
        /* penyimpanan penuh / privat — abaikan diam-diam, bukan error fatal */
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [draftSnapshot]);

  const markDirty = useCallback(() => {
    dirtyRef.current = true;
  }, []);

  function clearFieldError(field: FieldKey) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  // ---- Foto: pilih & unggah ----
  const uploadOne = useCallback(async (itemId: string, file: File) => {
    setPhotos((prev) => prev.map((p) => (p.id === itemId ? { ...p, status: 'uploading' as const, error: undefined } : p)));
    try {
      const sig = (await createListingMediaUpload({
        fileName: file.name,
        contentType: file.type,
        size: file.size,
      })) as PresignedOk | { ok: false; error: string };
      if (!sig.ok) throw new Error(sig.error || 'Layanan unggah belum tersedia.');
      const formData = new FormData();
      for (const [k, v] of Object.entries(sig.fields)) formData.append(k, v);
      formData.append('file', file);
      const res = await fetch(sig.url, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Unggah foto gagal. Periksa koneksi lalu coba lagi.');
      setPhotos((prev) =>
        prev.map((p) => (p.id === itemId ? { ...p, status: 'done' as const, url: sig.publicUrl, key: sig.key } : p)),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unggah foto gagal.';
      setPhotos((prev) =>
        prev.map((p) => (p.id === itemId ? { ...p, status: 'error' as const, error: message } : p)),
      );
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;
      setPhotoNotice(null);
      const rejected: string[] = [];
      const accepted: File[] = [];
      for (const file of list) {
        if (!CREATE_ALLOWED_PHOTO_TYPES.includes(file.type as (typeof CREATE_ALLOWED_PHOTO_TYPES)[number])) {
          rejected.push(`“${file.name}” bukan gambar (gunakan JPG/PNG/WebP/GIF).`);
          continue;
        }
        if (file.size > CREATE_MAX_PHOTO_BYTES) {
          rejected.push(`“${file.name}” ${formatFileSize(file.size)} melebihi batas ${formatFileSize(CREATE_MAX_PHOTO_BYTES)}.`);
          continue;
        }
        accepted.push(file);
      }
      const slotsLeft = CREATE_MAX_PHOTOS - photos.length;
      if (accepted.length > slotsLeft) {
        rejected.push(`Maksimal ${CREATE_MAX_PHOTOS} foto — ${accepted.length - slotsLeft} foto tidak ditambahkan.`);
      }
      const toAdd = accepted.slice(0, Math.max(0, slotsLeft));
      if (rejected.length > 0) setPhotoNotice(rejected.join(' '));
      if (toAdd.length === 0) return;
      markDirty();
      clearFieldError('photos');
      const items: PhotoItem[] = toAdd.map((file) => ({ id: newId(), status: 'uploading' as const }));
      setPhotos((prev) => [...prev, ...items]);
      items.forEach((item, i) => void uploadOne(item.id, toAdd[i]));
    },
    [photos.length, uploadOne, markDirty],
  );

  const retryPhoto = useCallback(
    (itemId: string) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = photoAcceptAttr();
      input.onchange = () => {
        const file = input.files?.[0];
        if (file) {
          if (!CREATE_ALLOWED_PHOTO_TYPES.includes(file.type as (typeof CREATE_ALLOWED_PHOTO_TYPES)[number])) {
            setPhotoNotice('File pengganti harus gambar (JPG/PNG/WebP/GIF).');
            return;
          }
          if (file.size > CREATE_MAX_PHOTO_BYTES) {
            setPhotoNotice(`File pengganti ${formatFileSize(file.size)} melebihi batas ${formatFileSize(CREATE_MAX_PHOTO_BYTES)}.`);
            return;
          }
          markDirty();
          void uploadOne(itemId, file);
        }
      };
      input.click();
    },
    [uploadOne, markDirty],
  );

  const removePhoto = useCallback(
    (itemId: string) => {
      markDirty();
      setPhotos((prev) => prev.filter((p) => p.id !== itemId));
    },
    [markDirty],
  );

  const movePhoto = useCallback(
    (itemId: string, dir: -1 | 1) => {
      markDirty();
      setPhotos((prev) => {
        const idx = prev.findIndex((p) => p.id === itemId);
        const swap = idx + dir;
        if (idx < 0 || swap < 0 || swap >= prev.length) return prev;
        const next = [...prev];
        [next[idx], next[swap]] = [next[swap], next[idx]];
        return next;
      });
    },
    [markDirty],
  );

  const uploadingCount = photos.filter((p) => p.status === 'uploading').length;
  const donePhotos = photos.filter((p) => p.status === 'done' && p.url && p.key);

  // ---- Submit ----
  const submitNow = useCallback(async () => {
      if (inFlightRef.current || submitState !== 'idle') return;

      const priceNum = parsePriceInput(price);
      const payload = {
        title: title.trim(),
        category,
        condition,
        price: priceNum,
        negotiable,
        stock,
        description: description.trim(),
        district,
        whatsapp: whatsapp.trim() || null,
        photos: donePhotos.map((p) => ({ url: p.url as string, key: p.key as string })),
        idempotencyKey: newId(),
      };

      const parsed = createListingPayloadSchema.safeParse(payload);
      if (!parsed.success) {
        const errors: FieldErrors = {};
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0] || 'title') as FieldKey;
          if (!errors[key]) errors[key] = issue.message;
        }
        setFieldErrors(errors);
        setFormError('Periksa kembali isian yang ditandai — ada yang belum sesuai.');
        requestAnimationFrame(() => firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        return;
      }
      if (uploadingCount > 0) {
        setFormError(`Masih ada ${uploadingCount} foto yang diunggah. Tunggu hingga selesai.`);
        return;
      }

      inFlightRef.current = true;
      setSubmitState('sending');
      setFormError(null);
      try {
        const response = await csrfFetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        });
        const json = (await response.json().catch(() => null)) as {
          ok?: boolean;
          data?: { id?: string; title?: string };
          error?: { code?: string; message?: string; issues?: Array<{ field?: string; message?: string }> };
        } | null;

        if (response.status === 401) {
          setSessionState('guest');
          setGateNotice('Sesi Anda berakhir. Masuk kembali — draft Anda tetap tersimpan di perangkat ini.');
          return;
        }
        if (response.status === 403 && json?.error?.code === 'FORBIDDEN') {
          setFormError(json.error.message || 'Akses ditolak. Muat ulang halaman dan coba lagi.');
          return;
        }
        if (response.status === 429) {
          setFormError('Terlalu banyak percobaan. Tunggu sebentar lalu tekan “Coba lagi”.');
          return;
        }
        if (response.status === 422 && json?.error) {
          const errors: FieldErrors = {};
          for (const issue of json.error.issues || []) {
            const key = String(issue.field || '').split('.')[0] as FieldKey;
            if (key && !errors[key]) errors[key] = issue.message || json.error.message || '';
          }
          setFieldErrors(errors);
          setFormError(json.error.message || 'Data belum valid. Periksa isian yang ditandai.');
          requestAnimationFrame(() => firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          return;
        }
        if (!response.ok || !json?.ok || !json.data?.id) {
          setFormError(json?.error?.message || 'Listing gagal diterbitkan. Periksa koneksi lalu tekan “Coba lagi”.');
          return;
        }

        // Sukses
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch { /* abaikan */ }
        dirtyRef.current = false;
        setDraftSavedAt(null);
        setSubmitState('success');
        setToast('Listing diterbitkan & disetujui otomatis — langsung tayang!');
        window.setTimeout(() => {
          router.push(`/marketplace?listing=${encodeURIComponent(String(json.data?.id))}`);
        }, 1100);
      } catch {
        setFormError('Jaringan bermasalah. Data Anda aman — tekan “Coba lagi”.');
      } finally {
        inFlightRef.current = false;
        setSubmitState((s) => (s === 'success' ? s : 'idle'));
      }
    },
    [title, category, condition, price, negotiable, stock, description, district, whatsapp, donePhotos, uploadingCount, submitState, router],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      void submitNow();
    },
    [submitNow],
  );

  const handlePriceChange = useCallback(
    (raw: string) => {
      markDirty();
      clearFieldError('price');
      const digits = raw.replace(/\D/g, '').slice(0, 12);
      setPrice(digits ? new Intl.NumberFormat('id-ID').format(Number(digits)) : '');
    },
    [markDirty],
  );

  const pricePreview = useMemo(() => {
    const n = parsePriceInput(price);
    if (!Number.isFinite(n)) return null;
    return formatIDR(n);
  }, [price]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch { /* abaikan */ }
    dirtyRef.current = false;
    setDraftSavedAt(null);
    setToast('Draft dihapus.');
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (submitState === 'success') return; // toast sukses ikut redirect
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast, submitState]);

  const firstFieldErrorKey = (Object.keys(fieldErrors) as FieldKey[])[0];

  return (
    <AppLayout>
      <main className="fbmc-page">
        <div className="fbmc-wrap">
          <Link href="/marketplace" className="fbmc-back">
            <ArrowLeft size={16} /> Kembali ke Marketplace
          </Link>

          <header className="fbmc-hero">
            <span className="fbmc-hero-icon"><Store size={26} /></span>
            <div>
              <p className="dn-kicker">Marketplace Sultra</p>
              <h1>Jual barang & jasa lokal</h1>
              <p className="fbmc-hero-sub">
                {sessionState === 'authed'
                  ? `Halo, ${userName} — lengkapi detail di bawah, listing langsung tampil di marketplace.`
                  : 'Pasang listing gratis. Listing yang terbit langsung tampil di marketplace.'}
              </p>
            </div>
          </header>

          {sessionState === 'checking' && (
            <div className="fbmc-card" aria-busy="true" aria-label="Memuat">
              <div className="fbmc-skeleton-line" style={{ width: '45%' }} />
              <div className="fbmc-skeleton-line" style={{ width: '80%' }} />
              <div className="fbmc-skeleton-line" style={{ width: '65%' }} />
            </div>
          )}

          {sessionState === 'guest' && (
            <section className="fbmc-card fbmc-gate" aria-label="Perlu masuk">
              <span className="dn-empty-art" aria-hidden="true"><EcosystemMarketplace /></span>
              <span className="fbmc-gate-icon"><Lock size={30} /></span>
              <h2>Masuk dulu untuk mulai menjual</h2>
              {gateNotice && <p className="fbmc-field-note is-warn" role="status" style={{ justifyContent: 'center' }}><AlertCircle size={14} /> {gateNotice}</p>}
              <p>
                Anda perlu akun SUKI agar pembeli bisa percaya dan kami bisa menghubungi Anda.
                Draft yang sedang diisi tetap tersimpan di perangkat ini.
              </p>
              <Link href={LOGIN_REDIRECT} className="fbmc-btn fbmc-btn-primary">
                Masuk / Daftar <ArrowRight size={16} />
              </Link>
              <p className="fbmc-gate-note">Gratis — cukup dengan akun Google atau Facebook.</p>
            </section>
          )}

          {sessionState === 'authed' && (
            <form className="fbmc-form" onSubmit={handleSubmit} noValidate>
              {formError && (
                <div className="fbmc-alert fbmc-alert-error" role="alert" ref={firstErrorRef} tabIndex={-1}>
                  <AlertCircle size={18} />
                  <div>
                    <b>Belum bisa diterbitkan</b>
                    <p>{formError}</p>
                  </div>
                  <button
                    type="button"
                    className="fbmc-btn fbmc-btn-ghost"
                    onClick={() => { setFormError(null); void submitNow(); }}
                    disabled={submitState !== 'idle'}
                  >
                    <RefreshCw size={15} /> Coba lagi
                  </button>
                </div>
              )}

              {/* ---- 1. Foto ---- */}
              <section className="fbmc-card" aria-labelledby="fbmc-foto">
                <div className="fbmc-step"><span className="fbmc-step-num">1</span><div><h2 id="fbmc-foto">Foto barang</h2><p>Foto pertama menjadi sampul. Maksimal {CREATE_MAX_PHOTOS} foto, {formatFileSize(CREATE_MAX_PHOTO_BYTES)} per foto.</p></div></div>

                <div className="fbmc-photos" role="group" aria-label="Foto listing">
                  {photos.map((photo, index) => (
                    <figure key={photo.id} className={`fbmc-photo${photo.status === 'error' ? ' is-error' : ''}`}>
                      {photo.status === 'done' && photo.url ? (
                        <img src={photo.url} alt={`Foto ${index + 1}`} loading="lazy" />
                      ) : (
                        <span className="fbmc-photo-thumb" aria-hidden="true"><ImagePlus size={22} /></span>
                      )}
                      {index === 0 && photo.status === 'done' && (
                        <figcaption className="fbmc-photo-cover"><Crown size={12} /> Sampul</figcaption>
                      )}
                      {photo.status === 'uploading' && (
                        <span className="fbmc-photo-loading"><Loader2 size={20} className="fbmc-spin" /><small>Mengunggah…</small></span>
                      )}
                      {photo.status === 'error' && (
                        <span className="fbmc-photo-loading is-error">
                          <AlertCircle size={20} />
                          <small>{photo.error || 'Gagal.'}</small>
                          <button type="button" className="fbmc-chip-btn" onClick={() => retryPhoto(photo.id)}>
                            <RefreshCw size={12} /> Ulangi
                          </button>
                        </span>
                      )}
                      <span className="fbmc-photo-actions">
                        <button type="button" title="Geser ke kiri" aria-label={`Geser foto ${index + 1} ke kiri`} disabled={index === 0} onClick={() => movePhoto(photo.id, -1)}>
                          <ChevronLeft size={15} />
                        </button>
                        <button type="button" title="Geser ke kanan" aria-label={`Geser foto ${index + 1} ke kanan`} disabled={index === photos.length - 1} onClick={() => movePhoto(photo.id, 1)}>
                          <ChevronRight size={15} />
                        </button>
                        <button type="button" title="Hapus foto" aria-label={`Hapus foto ${index + 1}`} onClick={() => removePhoto(photo.id)}>
                          <Trash2 size={15} />
                        </button>
                      </span>
                    </figure>
                  ))}

                  {photos.length < CREATE_MAX_PHOTOS && (
                    <button
                      type="button"
                      className="fbmc-photo-add"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label={`Tambah foto (${photos.length}/${CREATE_MAX_PHOTOS})`}
                    >
                      <Camera size={24} />
                      <span>Tambah foto</span>
                      <small>{photos.length}/{CREATE_MAX_PHOTOS}</small>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={photoAcceptAttr()}
                  multiple
                  className="fbmc-hidden-input"
                  tabIndex={-1}
                  aria-hidden="true"
                  onChange={(e) => { handleFiles(e.target.files || []); e.target.value = ''; }}
                />
                {photoNotice && <p className="fbmc-field-note is-warn" role="status"><AlertCircle size={14} /> {photoNotice}</p>}
                {fieldErrors.photos && <p className="fbmc-field-error" role="alert">{fieldErrors.photos}</p>}
                <p className="fbmc-field-note">Tips: foto terang dari beberapa sudut lebih dipercaya pembeli.</p>
              </section>

              {/* ---- 2. Detail barang ---- */}
              <section className="fbmc-card" aria-labelledby="fbmc-detail">
                <div className="fbmc-step"><span className="fbmc-step-num">2</span><div><h2 id="fbmc-detail">Detail barang / jasa</h2><p>Judul yang jelas membuat listing mudah ditemukan.</p></div></div>

                <div className="fbmc-field">
                  <label htmlFor="fbmc-title">Judul <span className="fbmc-req">*</span></label>
                  <input
                    id="fbmc-title"
                    type="text"
                    maxLength={160}
                    placeholder="cth. Sepeda lipat Polygon Urbano 20 inci"
                    value={title}
                    aria-invalid={Boolean(fieldErrors.title)}
                    aria-describedby={fieldErrors.title ? 'fbmc-title-err' : undefined}
                    onChange={(e) => { markDirty(); clearFieldError('title'); setTitle(e.target.value); }}
                  />
                  <div className="fbmc-field-row">
                    {fieldErrors.title
                      ? <p className="fbmc-field-error" id="fbmc-title-err" role="alert">{fieldErrors.title}</p>
                      : <span />}
                    <span className="fbmc-count">{title.trim().length}/140</span>
                  </div>
                </div>

                <div className="fbmc-field">
                  <label htmlFor="fbmc-category">Kategori <span className="fbmc-req">*</span></label>
                  <select
                    id="fbmc-category"
                    value={category}
                    aria-invalid={Boolean(fieldErrors.category)}
                    aria-describedby={fieldErrors.category ? 'fbmc-category-err' : undefined}
                    onChange={(e) => { markDirty(); clearFieldError('category'); setCategory(e.target.value); }}
                  >
                    <option value="" disabled>Pilih kategori…</option>
                    {CREATE_CATEGORY_LABELS.map((label) => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                  {fieldErrors.category && <p className="fbmc-field-error" id="fbmc-category-err" role="alert">{fieldErrors.category}</p>}
                </div>

                <fieldset className="fbmc-field">
                  <legend>Kondisi <span className="fbmc-req">*</span></legend>
                  <div className="fbmc-pills" role="radiogroup" aria-label="Kondisi barang">
                    {CREATE_CONDITIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={condition === opt.value}
                        className={`fbmc-pill${condition === opt.value ? ' is-active' : ''}`}
                        onClick={() => { markDirty(); clearFieldError('condition'); setCondition(opt.value); }}
                      >
                        {condition === opt.value && <Check size={14} />}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.condition && <p className="fbmc-field-error" role="alert">{fieldErrors.condition}</p>}
                </fieldset>

                <div className="fbmc-field">
                  <div className="fbmc-stock-row">
                    <label htmlFor="fbmc-stock">Stok</label>
                    <div className="fbmc-stepper" role="group" aria-label="Jumlah stok">
                      <button type="button" aria-label="Kurangi stok" disabled={stock <= 1} onClick={() => { markDirty(); setStock((s) => Math.max(1, s - 1)); }}>
                        <Minus size={15} />
                      </button>
                      <input
                        id="fbmc-stock"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={10000}
                        value={stock}
                        onChange={(e) => {
                          markDirty(); clearFieldError('stock');
                          const n = Math.round(Number(e.target.value));
                          setStock(Number.isFinite(n) ? Math.min(10000, Math.max(1, n)) : 1);
                        }}
                      />
                      <button type="button" aria-label="Tambah stok" disabled={stock >= 10000} onClick={() => { markDirty(); setStock((s) => Math.min(10000, s + 1)); }}>
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                  {fieldErrors.stock && <p className="fbmc-field-error" role="alert">{fieldErrors.stock}</p>}
                </div>

                <div className="fbmc-field">
                  <label htmlFor="fbmc-desc">Deskripsi <span className="fbmc-req">*</span></label>
                  <textarea
                    id="fbmc-desc"
                    rows={5}
                    maxLength={5200}
                    placeholder="Ceritakan kondisi barang, kelengkapan, alasan dijual, dan cara serah terima…"
                    value={description}
                    aria-invalid={Boolean(fieldErrors.description)}
                    aria-describedby={fieldErrors.description ? 'fbmc-desc-err' : 'fbmc-desc-hint'}
                    onChange={(e) => { markDirty(); clearFieldError('description'); setDescription(e.target.value); }}
                  />
                  <div className="fbmc-field-row">
                    {fieldErrors.description
                      ? <p className="fbmc-field-error" id="fbmc-desc-err" role="alert">{fieldErrors.description}</p>
                      : <p className="fbmc-field-note" id="fbmc-desc-hint">Minimal 20 karakter — makin jelas, makin dipercaya.</p>}
                    <span className="fbmc-count">{description.trim().length}/5000</span>
                  </div>
                </div>
              </section>

              {/* ---- 3. Harga ---- */}
              <section className="fbmc-card" aria-labelledby="fbmc-harga">
                <div className="fbmc-step"><span className="fbmc-step-num">3</span><div><h2 id="fbmc-harga">Harga</h2><p>Harga wajar sesuai kondisi barang.</p></div></div>

                <div className="fbmc-field">
                  <label htmlFor="fbmc-price">Harga (Rp) <span className="fbmc-req">*</span></label>
                  <div className={`fbmc-price-wrap${fieldErrors.price ? ' is-invalid' : ''}`}>
                    <span aria-hidden="true">Rp</span>
                    <input
                      id="fbmc-price"
                      type="text"
                      inputMode="numeric"
                      placeholder="150.000"
                      value={price}
                      aria-invalid={Boolean(fieldErrors.price)}
                      aria-describedby={fieldErrors.price ? 'fbmc-price-err' : 'fbmc-price-hint'}
                      onChange={(e) => handlePriceChange(e.target.value)}
                    />
                  </div>
                  <div className="fbmc-field-row">
                    {fieldErrors.price
                      ? <p className="fbmc-field-error" id="fbmc-price-err" role="alert">{fieldErrors.price}</p>
                      : <p className="fbmc-field-note" id="fbmc-price-hint">
                          {pricePreview ? <>Pratinjau: <b>{pricePreview}</b></> : 'Isi 0 bila gratis.'}
                        </p>}
                  </div>
                  <label className="fbmc-check">
                    <input
                      type="checkbox"
                      checked={negotiable}
                      onChange={(e) => { markDirty(); setNegotiable(e.target.checked); }}
                    />
                    <span className="fbmc-check-box" aria-hidden="true">{negotiable && <Check size={13} />}</span>
                    Harga bisa nego
                  </label>
                </div>
              </section>

              {/* ---- 4. Lokasi & kontak ---- */}
              <section className="fbmc-card" aria-labelledby="fbmc-lokasi">
                <div className="fbmc-step"><span className="fbmc-step-num">4</span><div><h2 id="fbmc-lokasi">Lokasi & kontak</h2><p>Pembeli cenderung memilih yang dekat.</p></div></div>

                <div className="fbmc-field">
                  <label htmlFor="fbmc-district">Kota / Kabupaten <span className="fbmc-req">*</span></label>
                  <select
                    id="fbmc-district"
                    value={district}
                    aria-invalid={Boolean(fieldErrors.district)}
                    aria-describedby={fieldErrors.district ? 'fbmc-district-err' : undefined}
                    onChange={(e) => { markDirty(); clearFieldError('district'); setDistrict(e.target.value); }}
                  >
                    <option value="" disabled>Pilih kota/kabupaten…</option>
                    {SULTRA_REGIONS.map((r) => (
                      <option key={r.short} value={r.short}>{r.name}</option>
                    ))}
                  </select>
                  {fieldErrors.district && <p className="fbmc-field-error" id="fbmc-district-err" role="alert">{fieldErrors.district}</p>}
                </div>

                <div className="fbmc-field">
                  <label htmlFor="fbmc-wa">WhatsApp <span className="fbmc-opt">(opsional)</span></label>
                  <div className="fbmc-wa-wrap">
                    <span aria-hidden="true">+62</span>
                    <input
                      id="fbmc-wa"
                      type="tel"
                      inputMode="tel"
                      placeholder="81234567890"
                      value={whatsapp}
                      aria-invalid={Boolean(fieldErrors.whatsapp)}
                      aria-describedby={fieldErrors.whatsapp ? 'fbmc-wa-err' : 'fbmc-wa-hint'}
                      onChange={(e) => { markDirty(); clearFieldError('whatsapp'); setWhatsapp(e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 20)); }}
                    />
                  </div>
                  {fieldErrors.whatsapp
                    ? <p className="fbmc-field-error" id="fbmc-wa-err" role="alert">{fieldErrors.whatsapp}</p>
                    : <p className="fbmc-field-note" id="fbmc-wa-hint">Hanya dipakai agar pembeli bisa menghubungi Anda. Boleh dikosongkan.</p>}
                </div>
              </section>

              {/* ---- Draft ---- */}
              <div className="fbmc-draftbar" role="status">
                <span className="fbmc-draft-info">
                  <BadgeCheck size={15} />
                  {draftSavedAt
                    ? `Draft tersimpan otomatis · ${new Date(draftSavedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Isian tersimpan otomatis di perangkat ini'}
                </span>
                {draftSavedAt && (
                  <button type="button" className="fbmc-link-btn" onClick={clearDraft}>
                    Hapus draft
                  </button>
                )}
              </div>

              {/* ---- Aksi sticky ---- */}
              <div className="fbmc-actionbar">
                <div className="fbmc-action-summary" aria-live="polite">
                  {pricePreview ? <b>{pricePreview}</b> : <span>Atur harga</span>}
                  <small>{donePhotos.length} foto · {district || 'Pilih lokasi'}</small>
                </div>
                <button
                  type="submit"
                  className="fbmc-btn fbmc-btn-primary fbmc-btn-lg"
                  disabled={submitState !== 'idle'}
                >
                  {submitState === 'sending' ? (
                    <><Loader2 size={17} className="fbmc-spin" /> Menerbitkan…</>
                  ) : submitState === 'success' ? (
                    <><CheckCircle2 size={17} /> Berhasil!</>
                  ) : (
                    <>Terbitkan listing <ArrowRight size={16} /></>
                  )}
                </button>
              </div>

              <p className="fbmc-fineprint">
                Dengan menerbitkan, Anda menyatakan barang/jasa milik Anda dan deskripsi sesuai kondisi sebenarnya.
                Listing yang melanggar aturan dapat diturunkan.
              </p>
            </form>
          )}

          {toast && (
            <div className={`fbmc-toast${submitState === 'success' ? ' is-success' : ''}`} role="status">
              {submitState === 'success' ? <CheckCircle2 size={18} /> : <BadgeCheck size={18} />}
              {toast}
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
