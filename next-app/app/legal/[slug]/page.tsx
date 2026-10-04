'use client';

import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { LegalDocumentViewer } from '@/components/support/SupportComponents';
import { supabase } from '@/lib/supabase/client';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

// Slug Inggris lawas -> dokumen kanonis berbahasa Indonesia.
// Tabel legal_documents belum ada di production, sehingga tanpa redirect
// /legal/privacy & /legal/terms hanya menampilkan teks "sedang dipersiapkan"
// padahal dokumen aslinya sudah live di slug kanonis.
const CANONICAL_SLUGS: Record<string, string> = {
  privacy: '/legal/kebijakan-privasi',
  terms: '/legal/syarat-ketentuan',
};

export default function LegalPage() {
  const router = useRouter();
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const [doc, setDoc] = useState<any>(null);
  const [agree, setAgree] = useState(false);
  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || 'terms' : 'terms';
  const canonicalTarget = CANONICAL_SLUGS[slug];

  useEffect(() => {
    if (canonicalTarget) {
      router.replace(canonicalTarget);
      return;
    }
    async function load() {
      if (!supabase) return;
      const { data } = await supabase.from('legal_documents').select('title,content,version').eq('slug', slug).eq('is_active', true).maybeSingle();
      setDoc(data || {
        title: slug === 'privacy' ? 'Kebijakan Privasi' : 'Syarat & Ketentuan',
        version: '1.0.0',
        content: 'Dokumen kebijakan sedang dipersiapkan oleh tim SUKI.',
      });
    }
    void load();
  }, [slug, canonicalTarget, router]);

  // Sedang dialihkan ke dokumen kanonis — jangan render apa pun.
  if (canonicalTarget) return null;

  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-3xl">
        <Link href="/help-center" className="mb-5 inline-flex items-center gap-2 text-sm text-sultra-teal">
          <ArrowLeft size={16} /> {t.helpBack}
        </Link>
        {doc && (
          <>
            <LegalDocumentViewer {...doc} />
            <label className="mt-5 flex items-center gap-3 rounded-2xl border border-sultra-mint bg-white p-4 text-sm dark:bg-sultra-dark">
              <input type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} />
              <span>{t.legalAgree}</span>
            </label>
            {agree && (
              <button
                type="button"
                onClick={() => router.back()}
                className="mt-3 flex items-center gap-2 rounded-xl bg-sultra-teal px-4 py-2 text-sm font-semibold text-white"
              >
                <Check size={16} /> {t.legalAccept}
              </button>
            )}
          </>
        )}
      </main>
    </AppLayout>
  );
}
