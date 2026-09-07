'use client';

import { Sparkles, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { generateListingFromImage } from '@/lib/actions/ai-listing';
import { submitAiListingFeedback } from '@/lib/actions/ai-listing-feedback';

type ListingAiResult = {
  title: string;
  description: string;
  category: 'Elektronik' | 'Fashion' | 'Kuliner' | 'Properti' | 'Kendaraan' | 'Jasa' | 'Hobi';
  estimated_price_min: number;
  estimated_price_max: number;
  suggested_tags: string[];
};

type Props = {
  file?: File;
  onGenerated: (result: ListingAiResult) => void;
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Foto tidak dapat dibaca oleh browser.'));
    reader.readAsDataURL(file);
  });
}

export function AiListingAssistant({ file, onGenerated }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [generated, setGenerated] = useState(false);
  const [generationId, setGenerationId] = useState('');
  const [feedbackChoice, setFeedbackChoice] = useState<boolean | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  async function handleGenerate() {
    if (!file) {
      setMessage('Pilih foto produk terlebih dahulu agar AI dapat menganalisisnya.');
      return;
    }
    if (!SUPPORTED_TYPES.has(file.type)) {
      setMessage('Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage('Ukuran foto maksimal 8 MB. Silakan pilih foto yang lebih kecil.');
      return;
    }
    setLoading(true);
    setMessage('Sedang menganalisis foto dan menyusun listing...');
    setGenerated(false);
    try {
      const base64 = await readAsDataUrl(file);
      const response = await generateListingFromImage({ base64, mimeType: file.type });
      if (!response.ok) throw new Error(response.error);
      onGenerated(response.data);
      setGenerationId(response.generationId);
      setGenerated(true);
      setFeedbackChoice(null);
      setFeedbackComment('');
      setFeedbackSent(false);
      setMessage('Draft listing berhasil diisi. Silakan periksa dan edit sebelum terbitkan.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'AI belum dapat membantu. Silakan isi manual.');
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback() {
    if (!generationId || feedbackChoice === null) return;
    setFeedbackLoading(true);
    const response = await submitAiListingFeedback({ generationId, helpful: feedbackChoice, comment: feedbackComment, correctedFields: [] });
    setFeedbackLoading(false);
    if (response.ok) setFeedbackSent(true);
    else setMessage(response.error);
  }

  return <div className="ai-listing-assistant bg-mint/70 text-forest shadow-soft" aria-live="polite" aria-busy={loading}>
    <div className="ai-listing-copy"><span className="ai-listing-icon"><WandSparkles size={17}/></span><div><strong>Listing lebih cepat dengan AI</strong><small>Analisis foto untuk menyusun judul, deskripsi, kategori, dan perkiraan harga.</small></div></div>
    <button type="button" className="ai-listing-button bg-gold" onClick={handleGenerate} disabled={loading} aria-describedby="ai-listing-help">{loading ? <><span className="ai-spinner" aria-hidden="true"/> Menganalisis...</> : <><Sparkles size={15} aria-hidden="true"/> Generate Otomatis dengan AI</>}</button>
    <p id="ai-listing-help" className="sr-only">AI hanya mengisi draft. Periksa semua hasil dan kirim form secara manual.</p>
    {message && <p className={`ai-listing-message ${generated ? 'success' : ''}`} role={generated ? 'status' : 'alert'}>{message}</p>}
    {generated && <>
      <button type="button" className="ai-edit-manual" onClick={() => setMessage('Silakan ubah field di atas sesuai kondisi produk sebenarnya.')}>Edit Manual</button>
      <div className="mt-3 border-t border-forest/15 pt-3" aria-labelledby="ai-feedback-title">
        <p id="ai-feedback-title" className="text-xs font-semibold">Apakah draft AI membantu?</p>
        {feedbackSent ? <p className="mt-1 text-xs" role="status">Terima kasih, feedback kamu membantu kami memperbaiki assistant.</p> : <>
          <div className="mt-2 flex gap-2">
            <button type="button" className="rounded-lg border px-3 py-1 text-xs" aria-pressed={feedbackChoice === true} onClick={() => setFeedbackChoice(true)}>Ya, membantu</button>
            <button type="button" className="rounded-lg border px-3 py-1 text-xs" aria-pressed={feedbackChoice === false} onClick={() => setFeedbackChoice(false)}>Perlu perbaikan</button>
          </div>
          {feedbackChoice !== null && <>
            <label className="sr-only" htmlFor="ai-feedback-comment">Komentar feedback (opsional)</label>
            <textarea id="ai-feedback-comment" value={feedbackComment} onChange={event => setFeedbackComment(event.target.value.slice(0, 1000))} className="mt-2 w-full rounded-lg border p-2 text-xs" maxLength={1000} placeholder="Komentar singkat (opsional)" />
            <button type="button" className="mt-2 rounded-lg bg-forest px-3 py-1 text-xs text-white disabled:opacity-50" disabled={feedbackLoading} onClick={() => void handleFeedback()}>{feedbackLoading ? 'Menyimpan...' : 'Kirim feedback'}</button>
          </>}
        </>}
      </div>
    </>}
  </div>;
}
