'use client';

import { Sparkles, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { generateListingFromImage } from '@/lib/actions/ai-listing';
import { submitAiListingFeedback } from '@/lib/actions/ai-listing-feedback';
import { usePreferences } from '@/lib/preferences';
import { getMarketplaceLabels } from '@/lib/i18n/dict-marketplace';

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
    reader.onerror = () => reject(new Error('MP_PHOTO_UNREADABLE'));
    reader.readAsDataURL(file);
  });
}

export function AiListingAssistant({ file, onGenerated }: Props) {
  const { language } = usePreferences();
  const mp = getMarketplaceLabels(language);
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
      setMessage(mp.mpChoosePhotoFirst);
      return;
    }
    if (!SUPPORTED_TYPES.has(file.type)) {
      setMessage(mp.mpPhotoFormatUnsupported);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage(mp.mpPhotoTooLarge);
      return;
    }
    setLoading(true);
    setMessage(mp.mpAnalyzing);
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
      setMessage(mp.mpDraftReady);
    } catch (error) {
      setMessage(error instanceof Error && error.message === 'MP_PHOTO_UNREADABLE' ? mp.mpPhotoUnreadable : mp.mpAiUnavailable);
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
    <div className="ai-listing-copy"><span className="ai-listing-icon"><WandSparkles size={17}/></span><div><strong>{mp.mpAiTitle}</strong><small>{mp.mpAiDesc}</small></div></div>
    <button type="button" className="ai-listing-button bg-gold" onClick={handleGenerate} disabled={loading} aria-describedby="ai-listing-help">{loading ? <><span className="ai-spinner" aria-hidden="true"/> {mp.mpAnalyzingShort}</> : <><Sparkles size={15} aria-hidden="true"/> {mp.mpGenerateWithAi}</>}</button>
    <p id="ai-listing-help" className="sr-only">{mp.mpAiDisclaimer}</p>
    {message && <p className={`ai-listing-message ${generated ? 'success' : ''}`} role={generated ? 'status' : 'alert'}>{message}</p>}
    {generated && <>
      <button type="button" className="ai-edit-manual" onClick={() => setMessage(mp.mpEditManuallyHint)}>{mp.mpEditManual}</button>
      <div className="mt-3 border-t border-forest/15 pt-3" aria-labelledby="ai-feedback-title">
        <p id="ai-feedback-title" className="text-xs font-semibold">{mp.mpFeedbackQuestion}</p>
        {feedbackSent ? <p className="mt-1 text-xs" role="status">{mp.mpFeedbackThanks}</p> : <>
          <div className="mt-2 flex gap-2">
            <button type="button" className="rounded-lg border px-3 py-1 text-xs" aria-pressed={feedbackChoice === true} onClick={() => setFeedbackChoice(true)}>{mp.mpFeedbackYes}</button>
            <button type="button" className="rounded-lg border px-3 py-1 text-xs" aria-pressed={feedbackChoice === false} onClick={() => setFeedbackChoice(false)}>{mp.mpFeedbackNo}</button>
          </div>
          {feedbackChoice !== null && <>
            <label className="sr-only" htmlFor="ai-feedback-comment">{mp.mpFeedbackCommentLabel}</label>
            <textarea id="ai-feedback-comment" value={feedbackComment} onChange={event => setFeedbackComment(event.target.value.slice(0, 1000))} className="mt-2 w-full rounded-lg border p-2 text-xs" maxLength={1000} placeholder={mp.mpFeedbackPlaceholder} />
            <button type="button" className="mt-2 rounded-lg bg-forest px-3 py-1 text-xs text-white disabled:opacity-50" disabled={feedbackLoading} onClick={() => void handleFeedback()}>{feedbackLoading ? mp.mpSavingFeedback : mp.mpSendFeedback}</button>
          </>}
        </>}
      </div>
    </>}
  </div>;
}
