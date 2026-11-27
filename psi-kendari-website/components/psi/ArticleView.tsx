import Image from "next/image";
import { formatTanggalWaktu } from "@/lib/format";
import type { PsiPost } from "@/lib/psi-types";
import { RubrikBadge, VerificationBadge } from "../Badges";
import { ShareButtons } from "../ShareButtons";
import { IconExternal } from "../icons";

/**
 * Tampilan artikel psi.id. `html` HARUS sudah disanitasi
 * (sanitize-html di server atau DOMPurify di browser).
 */
export function ArticleView({ post, html, shareUrl }: { post: PsiPost; html: string; shareUrl: string }) {
  const updated = post.modified && post.modified.slice(0, 16) !== post.date.slice(0, 16);
  return (
    <article className="mx-auto max-w-3xl" lang="id">
      <div className="flex flex-wrap items-center gap-2">
        <RubrikBadge>{post.rubrikLabel}</RubrikBadge>
        <VerificationBadge label="TERVERIFIKASI" />
        <span className="text-xs font-semibold text-muted">Sumber: psi.id (situs resmi DPP PSI)</span>
      </div>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        <span>
          Dipublikasikan <time dateTime={post.date}>{formatTanggalWaktu(post.date)}</time>
        </span>
        {updated ? (
          <span>
            · Diperbarui <time dateTime={post.modified}>{formatTanggalWaktu(post.modified)}</time>
          </span>
        ) : null}
        {post.author ? <span>· {post.author}</span> : null}
      </div>
      <div className="mt-5">
        <ShareButtons url={shareUrl} title={post.title} />
      </div>

      {post.image ? (
        <figure className="mt-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-bg-soft">
            <Image src={post.image.src} alt={post.image.alt} fill unoptimized priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-2 text-xs text-muted">
            {post.image.caption ? `${post.image.caption} · ` : ""}Foto: psi.id
          </figcaption>
        </figure>
      ) : null}

      <div className="prose-psi mt-8" dangerouslySetInnerHTML={{ __html: html }} />

      <aside className="mt-10 rounded-2xl border-l-4 border-red bg-bg-soft p-5">
        <p className="text-sm text-muted">
          Artikel ini diterbitkan oleh DPP PSI di psi.id pada <time dateTime={post.date}>{formatTanggalWaktu(post.date)}</time>{" "}
          dalam rubrik <strong className="text-fg">{post.rubrikLabel}</strong>. Hak cipta pada pemiliknya.
        </p>
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-red px-5 py-2.5 text-sm font-extrabold text-white hover:bg-red-strong"
        >
          Baca di situs resmi PSI <IconExternal />
        </a>
      </aside>
    </article>
  );
}
