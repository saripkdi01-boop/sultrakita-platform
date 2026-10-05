'use client';

import { useMemo, useState } from 'react';
import { AD_PLACEMENTS, AD_TEMPLATES, validateAdImageRatio, type AdProvider, type PlacementId } from '@/lib/ads/config';
import {
  createHouseAd,
  deleteHouseAd,
  saveAdPlacement,
  toggleHouseAd,
  updateHouseAd,
  type AdPlacementRow,
  type HouseAdInput,
  type HouseAdRow,
} from '@/lib/actions/ads';

interface Props {
  initialPlacements: AdPlacementRow[];
  placementsError: string | null;
  initialAds: HouseAdRow[];
  adsError: string | null;
}

const emptyForm: HouseAdInput = {
  placement: 'feed-infeed',
  title: '',
  image_url: '',
  link_url: '',
  html_snippet: '',
  active: true,
  starts_at: null,
  ends_at: null,
};

function statusOf(ad: HouseAdRow): string {
  if (!ad.active) return 'Nonaktif';
  const now = Date.now();
  if (ad.starts_at && Date.parse(ad.starts_at) > now) return 'Terjadwal';
  if (ad.ends_at && Date.parse(ad.ends_at) <= now) return 'Kedaluwarsa';
  return 'Tayang';
}

export function AdminAdsClient({ initialPlacements, placementsError, initialAds, adsError }: Props) {
  const [placements, setPlacements] = useState<AdPlacementRow[]>(initialPlacements);
  const [ads, setAds] = useState<HouseAdRow[]>(initialAds);
  const [form, setForm] = useState<HouseAdInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [template, setTemplate] = useState('native-16:9');
  const [imageCheck, setImageCheck] = useState('');
  const [checkingImage, setCheckingImage] = useState(false);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const placementSpecs = useMemo(() => Object.values(AD_PLACEMENTS), []);
  const allowedTemplates = useMemo(() => AD_PLACEMENTS[form.placement as PlacementId]?.templates ?? [], [form.placement]);

  function setField<K extends keyof HouseAdInput>(key: K, value: HouseAdInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  // Validasi dimensi gambar (naturalWidth/naturalHeight) SEBELUM simpan.
  function checkImageDimensions(url: string, placementId: string, templateName: string) {
    setImageCheck('');
    if (!url.trim()) return;
    setCheckingImage(true);
    const probe = new Image();
    probe.onload = () => {
      const error = validateAdImageRatio(placementId as PlacementId, probe.naturalWidth, probe.naturalHeight, templateName);
      setImageCheck(error || `Rasio cocok ✓ (${probe.naturalWidth}×${probe.naturalHeight} untuk ${templateName}).`);
      setCheckingImage(false);
    };
    probe.onerror = () => {
      setImageCheck('Gambar tidak dapat dimuat dari URL tersebut. Periksa URL-nya.');
      setCheckingImage(false);
    };
    probe.src = url.trim();
  }

  async function handleSavePlacement(placement: string, provider: AdProvider, adsenseSlot: string) {
    setStatus('Menyimpan konfigurasi…');
    const result = await saveAdPlacement({ placement, provider, adsense_slot: adsenseSlot });
    if (!result.ok) {
      setStatus(`Gagal: ${result.error}`);
      return;
    }
    setPlacements((current) => current.map((row) => (row.placement === placement ? { ...row, provider, adsense_slot: adsenseSlot || null } : row)));
    setStatus('Konfigurasi placement tersimpan.');
  }

  async function handleSubmit() {
    // Bila kode HTML/JS diisi, gambar+link tidak wajib → lewati cek rasio gambar.
    const hasSnippet = form.html_snippet.trim().length > 0;
    const ratioError = !hasSnippet && (imageCheck.startsWith('Rasio gambar') || imageCheck.startsWith('Template')) ? imageCheck : null;
    if (ratioError) {
      setStatus(`Tidak dapat menyimpan: ${ratioError}`);
      return;
    }
    setSaving(true);
    setStatus(editingId ? 'Memperbarui house ad…' : 'Menyimpan house ad…');
    const result = editingId ? await updateHouseAd(editingId, form) : await createHouseAd(form);
    setSaving(false);
    if (!result.ok) {
      setStatus(`Gagal: ${result.error}`);
      return;
    }
    const saved = result.ad;
    setAds((current) => (editingId ? current.map((ad) => (ad.id === editingId ? saved : ad)) : [saved, ...current]));
    setEditingId(null);
    setForm(emptyForm);
    setImageCheck('');
    setStatus('House ad tersimpan.');
  }

  async function handleToggle(ad: HouseAdRow) {
    const result = await toggleHouseAd(ad.id, !ad.active);
    if (!result.ok) {
      setStatus(`Gagal: ${result.error}`);
      return;
    }
    setAds((current) => current.map((item) => (item.id === ad.id ? { ...item, active: !ad.active } : item)));
  }

  async function handleDelete(ad: HouseAdRow) {
    if (!window.confirm(`Hapus house ad "${ad.title}"?`)) return;
    const result = await deleteHouseAd(ad.id);
    if (!result.ok) {
      setStatus(`Gagal: ${result.error}`);
      return;
    }
    setAds((current) => current.filter((item) => item.id !== ad.id));
    setStatus('House ad dihapus.');
  }

  function handleEdit(ad: HouseAdRow) {
    setEditingId(ad.id);
    setForm({
      placement: ad.placement,
      title: ad.title,
      image_url: ad.image_url || '',
      link_url: ad.link_url || '',
      html_snippet: ad.html_snippet || '',
      active: ad.active,
      starts_at: ad.starts_at,
      ends_at: ad.ends_at,
    });
    setImageCheck('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="mt-8 grid gap-6">
      {status && (
        <p className="rounded-2xl border border-[#dcebe5] bg-[#f6fbf9] p-4 text-sm text-[#123f38] dark:border-white/10 dark:bg-white/5 dark:text-white" role="status">
          {status}
        </p>
      )}

      {/* Konfigurasi provider per placement */}
      <section aria-labelledby="ads-placements-title">
        <h2 id="ads-placements-title" className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">
          Provider per placement
        </h2>
        {placementsError ? (
          <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{placementsError}</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {placementSpecs.map((spec) => (
              <PlacementCard key={spec.id} spec={spec} row={placements.find((p) => p.placement === spec.id)} onSave={handleSavePlacement} />
            ))}
          </div>
        )}
      </section>

      {/* Form house ad */}
      <section aria-labelledby="ads-form-title" className="rounded-3xl border border-[#dcebe5] bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 id="ads-form-title" className="text-lg font-extrabold text-[#123f38] dark:text-white">
          {editingId ? 'Ubah house ad' : 'House ad baru'} <span className="text-sm font-normal text-[#78948c]">· sponsor langsung (UMKM)</span>
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">Placement</span>
            <select
              value={form.placement}
              onChange={(event) => {
                const next = event.target.value;
                setField('placement', next);
                const first = AD_PLACEMENTS[next as PlacementId]?.templates[0];
                if (first) setTemplate(first);
                setImageCheck('');
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/20"
            >
              {placementSpecs.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.title} — {spec.sizes[0]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">Template ukuran</span>
            <select value={template} onChange={(event) => { setTemplate(event.target.value); setImageCheck(''); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/20">
              {allowedTemplates.map((name) => (
                <option key={name} value={name}>
                  {AD_TEMPLATES[name]?.label ?? name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="font-semibold">Judul</span>
            <input value={form.title} onChange={(event) => setField('title', event.target.value)} maxLength={120} placeholder="mis. Kopi Kendari — diskon 20% akhir pekan" className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/20" />
          </label>
          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="font-semibold">URL gambar</span>
            <input
              value={form.image_url}
              onChange={(event) => {
                setField('image_url', event.target.value);
                setImageCheck('');
              }}
              onBlur={() => checkImageDimensions(form.image_url, form.placement, template)}
              placeholder="https://…"
              inputMode="url"
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/20"
            />
            <span className="text-xs text-[#78948c]">
              Rasio gambar dicek otomatis (naturalWidth/naturalHeight) terhadap template {template}. Gambar ditolak bila rasio tidak cocok.
            </span>
            {checkingImage && <span className="text-xs">Memeriksa dimensi gambar…</span>}
            {imageCheck && (
              <span className={`text-xs font-semibold ${imageCheck.includes('✓') ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`} role="status">
                {imageCheck}
              </span>
            )}
          </label>
          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="font-semibold">URL tujuan (link sponsor)</span>
            <input value={form.link_url} onChange={(event) => setField('link_url', event.target.value)} placeholder="https://…" inputMode="url" className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/20" />
            <span className="text-xs text-[#78948c]">
              Bila memakai kode HTML/JS jaringan iklan di bawah, URL gambar & tujuan boleh dikosongkan.
            </span>
          </label>
          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="font-semibold">Kode HTML/JS jaringan iklan <span className="font-normal text-[#78948c]">(opsional)</span></span>
            <textarea
              value={form.html_snippet}
              onChange={(event) => setField('html_snippet', event.target.value)}
              rows={4}
              spellCheck={false}
              placeholder='<script async src="https://…"></script>'
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 font-mono text-xs dark:border-white/10 dark:bg-black/20"
            />
            <span className="text-xs text-[#78948c]">
              Tempel kode dari jaringan iklan manapun (MGID, Adsterra, dsb). Kode menggantikan gambar+link di atas.
              <span className="font-semibold text-amber-700 dark:text-amber-400"> Hanya tempel kode dari sumber terpercaya</span> — kode ini berjalan sebagai script di browser pengunjung.
            </span>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">Mulai tayang (opsional)</span>
            <input type="datetime-local" value={form.starts_at ? form.starts_at.slice(0, 16) : ''} onChange={(event) => setField('starts_at', event.target.value ? new Date(event.target.value).toISOString() : null)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/20" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">Berakhir (opsional)</span>
            <input type="datetime-local" value={form.ends_at ? form.ends_at.slice(0, 16) : ''} onChange={(event) => setField('ends_at', event.target.value ? new Date(event.target.value).toISOString() : null)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/20" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(event) => setField('active', event.target.checked)} />
            <span className="font-semibold">Aktif</span>
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={() => { void handleSubmit(); }} disabled={saving} className="rounded-xl bg-[#0b7567] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {saving ? 'Menyimpan…' : editingId ? 'Simpan perubahan' : 'Tambah house ad'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setImageCheck(''); }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold">
              Batal
            </button>
          )}
        </div>
      </section>

      {/* Daftar house ads */}
      <section aria-labelledby="ads-list-title">
        <h2 id="ads-list-title" className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">
          House ads {ads.length > 0 && `(${ads.length})`}
        </h2>
        {adsError ? (
          <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{adsError}</p>
        ) : ads.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-10 text-center text-sm text-[#78948c] dark:border-white/10 dark:bg-white/5">
            Belum ada house ad. Tambahkan sponsor langsung pertama di formulir di atas.
          </p>
        ) : (
          <ul className="grid gap-3">
            {ads.map((ad) => (
              <li key={ad.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#dcebe5] bg-white p-4 dark:border-white/10 dark:bg-white/5">
                {ad.image_url && <img src={ad.image_url} alt="" className="h-12 w-20 rounded-lg object-cover" loading="lazy" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#123f38] dark:text-white">
                    {ad.title}
                    {ad.html_snippet && (
                      <span className="ml-2 rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                        kode HTML/JS
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#78948c]">
                    {AD_PLACEMENTS[ad.placement as PlacementId]?.title ?? ad.placement} · {statusOf(ad)}
                  </p>
                </div>
                <button type="button" onClick={() => { void handleToggle(ad); }} aria-pressed={ad.active} className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold">
                  {ad.active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button type="button" onClick={() => handleEdit(ad)} className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold">
                  Ubah
                </button>
                <button type="button" onClick={() => { void handleDelete(ad); }} className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PlacementCard({
  spec,
  row,
  onSave,
}: {
  spec: (typeof AD_PLACEMENTS)[PlacementId];
  row: AdPlacementRow | undefined;
  onSave: (placement: string, provider: AdProvider, adsenseSlot: string) => Promise<void>;
}) {
  const [provider, setProvider] = useState<AdProvider>(row?.provider ?? 'off');
  const [slot, setSlot] = useState(row?.adsense_slot ?? '');
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    setBusy(true);
    await onSave(spec.id, provider, slot);
    setBusy(false);
  }

  return (
    <div className="rounded-3xl border border-[#dcebe5] bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <h3 className="text-sm font-extrabold text-[#123f38] dark:text-white">{spec.title}</h3>
      <p className="mt-1 text-xs text-[#78948c]">{spec.description}</p>
      <p className="mt-1 text-xs text-[#78948c]">
        Ukuran: {spec.sizes.join(' · ')} · {spec.frequency}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Provider</span>
          <select value={provider} onChange={(event) => setProvider(event.target.value as AdProvider)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/20">
            <option value="off">Nonaktif</option>
            <option value="adsense">Google AdSense</option>
            <option value="house">House ads (sponsor langsung)</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">AdSense ad slot ID</span>
          <input value={slot} onChange={(event) => setSlot(event.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="mis. 1234567890" disabled={provider !== 'adsense'} className="rounded-xl border border-gray-200 bg-white px-3 py-2 disabled:opacity-50 dark:border-white/10 dark:bg-black/20" />
        </label>
      </div>
      <button type="button" onClick={() => { void handleSave(); }} disabled={busy} className="mt-4 rounded-xl bg-[#0b7567] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
        {busy ? 'Menyimpan…' : 'Simpan'}
      </button>
    </div>
  );
}
