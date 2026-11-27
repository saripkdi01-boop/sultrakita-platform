"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Gambar mini dari situs sumber (dimuat langsung dari server media, tanpa disalin).
 * Bila gambar gagal dimuat / tidak ada, tampil blok netral bertuliskan nama media.
 */
export function RemoteThumb({
  src,
  alt,
  source,
  credit,
  sizes,
  className = "",
}: {
  src?: string | null;
  alt: string;
  source?: string;
  credit?: string;
  sizes: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const show = Boolean(src) && !failed;
  return (
    <div className={`relative overflow-hidden bg-bg-soft ${className}`}>
      {show ? (
        <>
          <Image
            src={src!}
            alt={alt}
            fill
            unoptimized
            sizes={sizes}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
          {credit ? (
            <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-1.5 pb-1 pt-4 text-[0.6rem] font-semibold text-white">
              {credit}
            </span>
          ) : null}
        </>
      ) : (
        <span aria-hidden="true" className="flex h-full w-full items-center justify-center p-2 text-center text-[0.7rem] font-extrabold uppercase tracking-wider text-muted">
          {source ?? ""}
        </span>
      )}
    </div>
  );
}
