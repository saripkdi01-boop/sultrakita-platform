'use client';

import { Sparkles, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { generateListingFromImage, type ListingAiResult } from '@/lib/actions/ai-listing';

type Props = {
  file?: File;
  onGenerated: (result: ListingAiResult) => void;
};

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

  async function handleGenerate() {
    if (!file) {
      setMessage('Pilih foto produk terlebih dahulu agar AI dapat menganalisisnya.');
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
      setGenerated(true);
      setMessage('Draft listing berhasil diisi. Silakan periksa dan edit sebelum terbitkan.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'AI belum dapat membantu. Silakan isi manual.');
    } finally {
      setLoading(false);
    }
  }

  return <div className="ai-listing-assistant bg-sultra-mint/70 text-sultra-forest shadow-soft" aria-live="polite">
    <div className="ai-listing-copy"><span className="ai-listing-icon"><WandSparkles size={17}/></span><div><strong>Listing lebih cepat dengan AI</strong><small>Analisis foto untuk menyusun judul, deskripsi, kategori, dan perkiraan harga.</small></div></div>
    <button type="button" className="ai-listing-button bg-sultra-gold" onClick={handleGenerate} disabled={loading}>{loading ? <><span className="ai-spinner"/> Menganalisis...</> : <><Sparkles size={15}/> Generate Otomatis dengan AI</>}</button>
    {message && <p className={`ai-listing-message ${generated ? 'success' : ''}`}>{message}</p>}
    {generated && <button type="button" className="ai-edit-manual" onClick={() => setMessage('Silakan ubah field di atas sesuai kondisi produk sebenarnya.')}>Edit Manual</button>}
  </div>;
}
