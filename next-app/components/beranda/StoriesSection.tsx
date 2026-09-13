import { Plus, Sparkles } from 'lucide-react';

type Props = { onCreate?: () => void };

export function StoriesSection({ onCreate }: Props) {
  return <section className="beranda-stories" aria-label="Cerita warga">
    <div className="beranda-stories-heading"><div><span className="beranda-stories-kicker"><Sparkles size={12} aria-hidden="true"/> KOMUNITAS SUKI</span><h2>Cerita warga</h2></div><button type="button" className="beranda-stories-link" onClick={onCreate}>Lihat semua</button></div>
    <div className="beranda-story-rail">
      <button type="button" className="story-card story-create" onClick={onCreate} aria-label="Buat cerita warga"><span className="story-card-visual story-create-visual"><span className="story-avatar"><Plus size={19} aria-hidden="true"/></span></span><span className="story-card-label">Buat cerita</span></button>
      <button type="button" className="story-card story-empty" onClick={onCreate}><span className="story-card-visual"><span className="story-empty-mark">＋</span></span><span className="story-card-label">Belum ada cerita</span><small>Jadilah warga pertama</small></button>
    </div>
  </section>;
}
