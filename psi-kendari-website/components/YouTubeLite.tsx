"use client";

import Image from "next/image";
import { useState } from "react";
import { IconPlay } from "./icons";

/**
 * Embed YouTube ringan: hanya gambar mini sampai diklik, lalu iframe
 * youtube-nocookie dimuat (hemat data & lebih cepat).
 */
export function YouTubeLite({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <iframe
        className="aspect-video w-full rounded-xl"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-ink"
      aria-label={`Putar video: ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        fill
        unoptimized
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red text-white shadow-lg transition-transform group-hover:scale-110">
          <IconPlay />
        </span>
      </span>
    </button>
  );
}
