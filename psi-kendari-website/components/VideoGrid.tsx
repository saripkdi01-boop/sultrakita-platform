import type { Video } from "@/lib/feeds";
import { LINKS } from "@/config/site";
import { formatTanggal } from "@/lib/format";
import { YouTubeLite } from "./YouTubeLite";
import { EmptyState } from "./EmptyState";
import { IconExternal } from "./icons";

export function VideoGrid({ videos, ok }: { videos: Video[]; ok: boolean }) {
  if (!videos.length) {
    return (
      <EmptyState
        title={ok ? "Belum ada video terbaru" : "Video sementara tidak dapat dimuat"}
        action={
          <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-red px-4 py-2 text-sm font-bold text-white hover:bg-red-strong">
            Buka kanal YouTube SolidaritasID <IconExternal />
          </a>
        }
      />
    );
  }
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {videos.map((v) => (
        <li key={v.id}>
          <YouTubeLite id={v.id} title={v.title} />
          <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug">
            <a href={v.url} target="_blank" rel="noopener noreferrer" className="hover:text-red-ink hover:underline">
              {v.title}
            </a>
          </h3>
          <p className="mt-1 text-xs text-muted">
            YouTube SolidaritasID · <time dateTime={v.date}>{formatTanggal(v.date)}</time>
          </p>
        </li>
      ))}
    </ul>
  );
}
