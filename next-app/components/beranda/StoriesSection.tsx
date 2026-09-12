import { Plus, Sparkles } from 'lucide-react';

export function StoriesSection() {
  return <section className="beranda-stories" aria-label="Cerita warga">
    <div className="beranda-stories-heading"><div><span className="beranda-stories-kicker"><Sparkles size={12}/> KOMUNITAS SUKI</span><h2>Cerita warga</h2></div><span className="beranda-stories-link">Terbaru</span></div>
    <div className="beranda-story-rail">
      <button type="button" className="story-create"><span className="story-avatar"><Plus size={18}/></span><span>Buat cerita</span></button>
      <div className="story-empty"><span>Belum ada cerita baru</span><small>Jadilah warga pertama yang berbagi hari ini.</small></div>
    </div>
  </section>;
}
