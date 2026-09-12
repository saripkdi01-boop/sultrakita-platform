import { Megaphone, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import EcosystemSlider from '@/components/marketing/EcosystemSlider';

export const metadata = {
  title: 'SUKI Campaign Hub · SultraKita',
  description: 'Temukan campaign terbaru dari ekosistem SUKI dan SultraKita.',
};

export default function CampaignsPage() {
  return <AppLayout>
    <main className="page-shell campaign-hub-page" aria-labelledby="campaign-hub-title">
      <section className="campaign-hub-intro">
        <div>
          <span className="eyebrow"><Megaphone size={14} /> SUKI CAMPAIGN HUB</span>
          <h1 id="campaign-hub-title">Campaign yang sedang hidup di ekosistem SUKI.</h1>
          <p>Temukan pilihan terbaru dari Marketplace, Jobs, dan Suits dalam satu ruang. Banner diperbarui otomatis ketika campaign aktif berubah.</p>
        </div>
        <Sparkles className="campaign-hub-sparkle" size={34} aria-hidden="true" />
      </section>
      <section aria-labelledby="campaign-marketplace-title">
        <div className="campaign-hub-section-heading"><div><span className="eyebrow">SUKI MARKETPLACE</span><h2 id="campaign-marketplace-title">Pilihan lokal untuk hari ini</h2></div></div>
        <EcosystemSlider appSlug="marketplace" />
      </section>
      <section aria-labelledby="campaign-jobs-title">
        <div className="campaign-hub-section-heading"><div><span className="eyebrow">SUKI JOBS</span><h2 id="campaign-jobs-title">Peluang yang sedang dibuka</h2></div></div>
        <EcosystemSlider appSlug="jobs" />
      </section>
      <section aria-labelledby="campaign-suits-title">
        <div className="campaign-hub-section-heading"><div><span className="eyebrow">SUKI SUITS</span><h2 id="campaign-suits-title">Hunian dan ruang usaha pilihan</h2></div></div>
        <EcosystemSlider appSlug="suits" />
      </section>
    </main>
  </AppLayout>;
}
