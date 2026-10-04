'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, ImagePlus, Save, Star, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getMyProperty, updateProperty } from '@/lib/actions/property';

const MAX_PHOTOS = 12;

type FormState = {
  title: string;
  description: string;
  price: string;
  priceType: string;
  status: string;
  images: string[];
  bedrooms: string;
  bathrooms: string;
  floors: string;
  landAreaSqm: string;
  buildingAreaSqm: string;
  certificateType: string;
  condition: string;
  furnishing: string;
  canKpr: boolean;
  parkingSlots: string;
  acAvailable: boolean;
  furnished: boolean;
  amenities: string;
};

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  price: '',
  priceType: 'total',
  status: 'available',
  images: [],
  bedrooms: '0',
  bathrooms: '0',
  floors: '1',
  landAreaSqm: '',
  buildingAreaSqm: '',
  certificateType: '',
  condition: 'second',
  furnishing: '',
  canKpr: false,
  parkingSlots: '',
  acAvailable: false,
  furnished: false,
  amenities: '',
};

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-sultra-mint bg-white p-6 shadow-sm dark:border-sultra-forest/30 dark:bg-sultra-dark">
      <h2 className="text-lg font-bold text-sultra-forest dark:text-sultra-sand">{title}</h2>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

export default function EditSellerPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getMyProperty(params.id).then(response => {
      setLoading(false);
      if (response.ok && response.data) {
        const d: any = response.data;
        setForm({
          title: d.title || '',
          description: d.description || '',
          price: d.price !== null && d.price !== undefined ? String(d.price) : '',
          priceType: d.price_type || 'total',
          status: d.status || 'available',
          images: Array.isArray(d.images) ? d.images.filter(Boolean) : [],
          bedrooms: d.bedrooms !== null && d.bedrooms !== undefined ? String(d.bedrooms) : '0',
          bathrooms: d.bathrooms !== null && d.bathrooms !== undefined ? String(d.bathrooms) : '0',
          floors: d.floors !== null && d.floors !== undefined ? String(d.floors) : '1',
          landAreaSqm: d.land_area_sqm !== null && d.land_area_sqm !== undefined ? String(d.land_area_sqm) : '',
          buildingAreaSqm: d.building_area_sqm !== null && d.building_area_sqm !== undefined ? String(d.building_area_sqm) : '',
          certificateType: d.certificate_type || '',
          condition: d.condition || 'second',
          furnishing: d.furnishing || '',
          canKpr: Boolean(d.can_kpr),
          parkingSlots: d.parking_slots !== null && d.parking_slots !== undefined ? String(d.parking_slots) : '',
          acAvailable: Boolean(d.ac_available),
          furnished: Boolean(d.furnished),
          amenities: Array.isArray(d.amenities) ? d.amenities.join(', ') : '',
        });
      } else {
        setMessage(response.ok ? 'Properti tidak ditemukan.' : response.error);
      }
    });
  }, [params.id]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  function addPhoto() {
    setPhotoError('');
    const url = photoUrl.trim();
    if (!url) { setPhotoError('Tempel URL foto terlebih dahulu.'); return; }
    try { new URL(url); } catch { setPhotoError('URL tidak valid. Contoh: https://contoh.com/foto.jpg'); return; }
    if (form.images.includes(url)) { setPhotoError('Foto ini sudah ada di galeri.'); return; }
    if (form.images.length >= MAX_PHOTOS) { setPhotoError(`Maksimal ${MAX_PHOTOS} foto.`); return; }
    setForm(prev => ({ ...prev, images: [...prev.images, url] }));
    setPhotoUrl('');
  }

  function removePhoto(index: number) {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  function movePhoto(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= form.images.length) return;
    setForm(prev => {
      const images = [...prev.images];
      [images[index], images[next]] = [images[next], images[index]];
      return { ...prev, images };
    });
  }

  function setAsCover(index: number) {
    if (index === 0) return;
    setForm(prev => {
      const images = [...prev.images];
      const [picked] = images.splice(index, 1);
      images.unshift(picked);
      return { ...prev, images };
    });
  }

  async function save() {
    setSaving(true);
    setMessage('');
    const input: Record<string, unknown> = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      priceType: form.priceType,
      status: form.status,
      images: form.images,
      bedrooms: Math.max(0, Number(form.bedrooms) || 0),
      bathrooms: Math.max(0, Number(form.bathrooms) || 0),
      floors: Math.max(1, Number(form.floors) || 1),
      amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean).slice(0, 20),
      canKpr: form.canKpr,
      acAvailable: form.acAvailable,
      furnished: form.furnished,
    };
    if (form.landAreaSqm !== '' && Number(form.landAreaSqm) >= 0) input.landAreaSqm = Number(form.landAreaSqm);
    if (form.buildingAreaSqm !== '' && Number(form.buildingAreaSqm) >= 0) input.buildingAreaSqm = Number(form.buildingAreaSqm);
    if (form.parkingSlots !== '' && Number(form.parkingSlots) >= 0) input.parkingSlots = Math.floor(Number(form.parkingSlots));
    if (form.certificateType) input.certificateType = form.certificateType;
    if (form.condition) input.condition = form.condition;
    if (form.furnishing) input.furnishing = form.furnishing;

    const response = await updateProperty(params.id, input as any);
    setSaving(false);
    if (!response.ok) { setMessage(response.error); return; }
    router.push('/dashboard/properties');
  }

  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-3xl">
        <Link href="/dashboard/properties" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-sultra-teal">
          <ArrowLeft size={16} /> Kembali ke properti saya
        </Link>
        <h1 className="text-2xl font-bold text-sultra-forest dark:text-sultra-sand">Edit properti</h1>
        <p className="mt-1 text-sm text-gray-500">Perubahan hanya berlaku untuk listing milik akun yang sedang login.</p>

        {loading ? (
          <p className="mt-6 text-sm text-gray-500">Memuat data properti...</p>
        ) : (
          <div className="mt-6 grid gap-6">
            {/* Info dasar */}
            <Section title="Info dasar">
              <label className="grid gap-1 text-sm font-semibold">Judul
                <input value={form.title} onChange={e => set('title', e.target.value)} className="field-input" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">Deskripsi
                <textarea value={form.description} onChange={e => set('description', e.target.value)} className="field-input min-h-32" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-semibold">Harga
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} className="field-input" />
                </label>
                <label className="grid gap-1 text-sm font-semibold">Tipe harga
                  <select value={form.priceType} onChange={e => set('priceType', e.target.value)} className="field-input">
                    <option value="per_bulan">Per bulan</option>
                    <option value="per_tahun">Per tahun</option>
                    <option value="total">Total</option>
                    <option value="mulai_dari">Mulai dari</option>
                    <option value="nego">Nego</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-1 text-sm font-semibold">Status
                <select value={form.status} onChange={e => set('status', e.target.value)} className="field-input">
                  <option value="available">Aktif</option>
                  <option value="rented">Disewa</option>
                  <option value="sold">Terjual</option>
                  <option value="archived">Diarsipkan</option>
                </select>
              </label>
            </Section>

            {/* Foto / Galeri */}
            <Section title="Foto / Galeri" hint={`Foto pertama menjadi sampul listing. Maksimal ${MAX_PHOTOS} foto.`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-sultra-teal">{form.images.length}/{MAX_PHOTOS} foto</p>
              </div>
              {form.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {form.images.map((src, i) => (
                    <div key={`${src}-${i}`} className="group relative overflow-hidden rounded-2xl border border-sultra-mint dark:border-sultra-forest/30">
                      {/* eslint-disable-next-line @next/next/no-img-element -- URL foto admin bisa dari domain apapun di luar remotePatterns next/image */}
                      <img src={src} alt={`Foto ${i + 1}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                      {i === 0 && (
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-sultra-gold px-2 py-0.5 text-[11px] font-bold text-white">
                          <Star size={11} /> Sampul
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label={`Hapus foto ${i + 1}`}
                        onClick={() => removePhoto(i)}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            aria-label="Geser foto ke kiri"
                            disabled={i === 0}
                            onClick={() => movePhoto(i, -1)}
                            className="rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80 disabled:opacity-30"
                          >
                            <ArrowLeft size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label="Geser foto ke kanan"
                            disabled={i === form.images.length - 1}
                            onClick={() => movePhoto(i, 1)}
                            className="rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80 disabled:opacity-30"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>
                        {i !== 0 && (
                          <button
                            type="button"
                            onClick={() => setAsCover(i)}
                            className="rounded-full bg-black/60 px-2 py-1 text-[11px] font-bold text-white transition hover:bg-black/80"
                          >
                            Jadikan sampul
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-sultra-mint p-6 text-center text-sm text-gray-500">
                  Belum ada foto. Tambahkan foto pertama sebagai sampul listing.
                </p>
              )}
              <div>
                <label className="grid gap-1 text-sm font-semibold">Tambah foto via URL
                  <div className="flex gap-2">
                    <input
                      value={photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPhoto(); } }}
                      placeholder="https://contoh.com/foto.jpg"
                      className="field-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={addPhoto}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-sultra-teal px-4 py-2.5 text-sm font-bold text-white"
                    >
                      <ImagePlus size={16} /> Tambah
                    </button>
                  </div>
                </label>
                {photoError && <p className="mt-2 text-sm text-red-600">{photoError}</p>}
              </div>
            </Section>

            {/* Spesifikasi */}
            <Section title="Spesifikasi" hint="Data ini tampil di halaman detail properti.">
              <div className="grid grid-cols-3 gap-4">
                <label className="grid gap-1 text-sm font-semibold">Kamar tidur
                  <input type="number" min={0} value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} className="field-input" />
                </label>
                <label className="grid gap-1 text-sm font-semibold">Kamar mandi
                  <input type="number" min={0} value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} className="field-input" />
                </label>
                <label className="grid gap-1 text-sm font-semibold">Lantai
                  <input type="number" min={1} value={form.floors} onChange={e => set('floors', e.target.value)} className="field-input" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-semibold">Luas tanah (m²)
                  <input type="number" min={0} value={form.landAreaSqm} onChange={e => set('landAreaSqm', e.target.value)} placeholder="cth. 120" className="field-input" />
                </label>
                <label className="grid gap-1 text-sm font-semibold">Luas bangunan (m²)
                  <input type="number" min={0} value={form.buildingAreaSqm} onChange={e => set('buildingAreaSqm', e.target.value)} placeholder="cth. 90" className="field-input" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-1 text-sm font-semibold">Sertifikat
                  <select value={form.certificateType} onChange={e => set('certificateType', e.target.value)} className="field-input">
                    <option value="">Belum dicantumkan</option>
                    <option value="SHM">SHM</option>
                    <option value="SHGB">SHGB</option>
                    <option value="Girik">Girik</option>
                    <option value="Letter C">Letter C</option>
                    <option value="Adat">Adat</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-semibold">Kondisi
                  <select value={form.condition} onChange={e => set('condition', e.target.value)} className="field-input">
                    <option value="new">Baru</option>
                    <option value="second">Bekas/Second</option>
                    <option value="need_renovation">Butuh renovasi</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-semibold">Furnishing
                  <select value={form.furnishing} onChange={e => set('furnishing', e.target.value)} className="field-input">
                    <option value="">Belum dicantumkan</option>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi_furnished">Semi furnished</option>
                    <option value="furnished">Furnished</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-semibold">Slot parkir
                  <input type="number" min={0} value={form.parkingSlots} onChange={e => set('parkingSlots', e.target.value)} placeholder="cth. 2" className="field-input" />
                </label>
                <label className="grid gap-1 text-sm font-semibold">Fasilitas <span className="font-normal text-gray-500">(pisahkan dengan koma)</span>
                  <input value={form.amenities} onChange={e => set('amenities', e.target.value)} placeholder="cth. Kolam renang, Taman, Keamanan 24 jam" className="field-input" />
                </label>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={form.canKpr} onChange={e => set('canKpr', e.target.checked)} className="h-4 w-4 accent-teal-700" />
                  Bisa KPR
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={form.furnished} onChange={e => set('furnished', e.target.checked)} className="h-4 w-4 accent-teal-700" />
                  Furnished
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={form.acAvailable} onChange={e => set('acAvailable', e.target.checked)} className="h-4 w-4 accent-teal-700" />
                  AC tersedia
                </label>
              </div>
            </Section>

            {message && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}
            <div className="flex items-center gap-3">
              <button
                onClick={() => void save()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-sultra-forest px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                <Save size={16} />{saving ? 'Menyimpan...' : 'Simpan perubahan'}
              </button>
              <Link href="/dashboard/properties" className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900">
                <X size={16} /> Batal
              </Link>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
