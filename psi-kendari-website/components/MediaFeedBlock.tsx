import type { FeedItem } from "@/lib/feeds";
import { feedToCard } from "@/lib/feeds";
import { NewsCard } from "./NewsCard";
import { EmptyState } from "./EmptyState";

/** Blok berita media (ringkasan + tautan keluar, label DILAPORKAN MEDIA). */
export function MediaFeedBlock({ items, ok, emptyText = "Belum ada berita media untuk wilayah ini." }: { items: FeedItem[]; ok: boolean; emptyText?: string }) {
  if (!items.length) return <EmptyState title={ok ? emptyText : "Berita media sementara tidak dapat dimuat"} />;
  return (
    <div>
      <div className="grid gap-x-8 md:grid-cols-2">
        {items.map((it) => (
          <NewsCard key={it.id} item={feedToCard(it)} variant="text" />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Ringkasan dari RSS resmi media; isi lengkap dan hak cipta ada pada media sumber.</p>
    </div>
  );
}
