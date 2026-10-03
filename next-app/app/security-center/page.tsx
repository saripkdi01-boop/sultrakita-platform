'use client';

import { AlertTriangle, Download, Lock, ShieldCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/lib/supabase/client';
import { SecurityCheckup, DeviceList } from '@/components/support/SupportComponents';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

export default function SecurityCenterPage() {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('trusted_devices').select('id,device_name,last_active_at').eq('user_id', user.id).order('last_active_at', { ascending: false });
      setDevices(data || []);
    }
    void load();
  }, []);

  async function remove(id: string) {
    if (!supabase) return;
    await supabase.from('trusted_devices').delete().eq('id', id);
    setDevices(current => current.filter(device => device.id !== id));
  }

  const fraudTips = [t.secFraudTip1, t.secFraudTip2, t.secFraudTip3, t.secFraudTip4];

  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-5xl">
        <header className="mb-6 rounded-3xl bg-gradient-to-br from-sultra-forest to-sultra-teal p-7 text-white">
          <span className="eyebrow text-sultra-sand"><ShieldCheck size={14} /> {t.secEyebrow}</span>
          <h1 className="mt-3 text-3xl font-bold">{t.secTitle}</h1>
          <p className="mt-1 text-white/80">{t.secSubtitle}</p>
        </header>
        <div className="grid gap-5 md:grid-cols-2">
          <SecurityCheckup />
          <DeviceList devices={devices} onRemove={remove} />
        </div>
        <section className="mt-5 rounded-2xl border border-sultra-mint bg-white p-5 dark:bg-sultra-dark">
          <h2 className="flex items-center gap-2 font-bold"><AlertTriangle className="text-sultra-gold" /> {t.secFraudTitle}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-sultra-sand/80">
            {fraudTips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
          <Link href="/support" className="mt-4 inline-flex rounded-xl bg-sultra-teal px-4 py-2 text-sm font-semibold text-white">{t.secReportFraud}</Link>
        </section>
        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link href="/settings/privacy" className="soft-btn justify-center"><Lock size={16} /> {t.secPrivacySettings}</Link>
          <Link href="/kontak" className="soft-btn justify-center"><Download size={16} /> {t.secRequestData}</Link>
          <Link href="/support" className="soft-btn justify-center text-red-600"><Trash2 size={16} /> {t.secDeleteAccount}</Link>
        </section>
      </main>
    </AppLayout>
  );
}
