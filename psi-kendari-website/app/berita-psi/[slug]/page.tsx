import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/config/site";
import { RUBRIK } from "@/config/psi-categories";
import { getPostBySlug, getPosts, getRelatedPosts } from "@/lib/psi-api";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArticleView } from "@/components/psi/ArticleView";
import { PsiClientArticle } from "@/components/psi/PsiClientArticle";
import { PsiPosts } from "@/components/psi/PsiPosts";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 900;

type Props = { params: Promise<{ slug: string }> };

const SLUG_RE = /^[a-z0-9%_-]{1,200}$/i;

export async function generateStaticParams() {
  // Pra-render 20 artikel terbaru bila psi.id dapat diakses saat build; sisanya ISR on-demand.
  const r = await getPosts({ perPage: 20 });
  return r.ok ? r.posts.map((p) => ({ slug: p.slug })) : [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) return {};
  const r = await getPostBySlug(slug);
  const canonical = `/berita-psi/${slug}`;
  if (!r.ok || !r.post) {
    return { title: "Berita PSI", alternates: { canonical } };
  }
  const p = r.post;
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.excerpt,
      url: canonical,
      publishedTime: p.date,
      modifiedTime: p.modified,
      section: p.rubrikLabel,
      images: p.image ? [{ url: p.image.src, alt: p.image.alt }] : undefined,
    },
    twitter: { card: p.image ? "summary_large_image" : "summary", title: p.title, description: p.excerpt },
  };
}

export default async function ArtikelPage({ params }: Props) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) notFound();
  const shareUrl = `${SITE.url}/berita-psi/${slug}`;
  const r = await getPostBySlug(slug);

  if (r.ok && !r.post) notFound();

  if (!r.ok) {
    return (
      <Container className="py-8">
        <Breadcrumb items={[{ label: "Berita PSI", href: "/berita-psi" }, { label: "Artikel" }]} />
        <div className="mt-6">
          <PsiClientArticle slug={slug} shareUrl={shareUrl} />
        </div>
      </Container>
    );
  }

  const post = r.post!;
  const html = sanitizeArticleHtml(post.contentHtml ?? "");
  const related = await getRelatedPosts(post, 3);
  const rubrikCats = RUBRIK[post.rubrik].categories;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: post.title.slice(0, 110),
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.modified || post.date,
          articleSection: post.rubrikLabel,
          inLanguage: "id-ID",
          mainEntityOfPage: shareUrl,
          url: shareUrl,
          isBasedOn: post.link,
          image: post.image ? [post.image.src] : undefined,
          author: { "@type": "Organization", name: "DPP Partai Solidaritas Indonesia", url: "https://psi.id/" },
          publisher: { "@type": "Organization", name: SITE.title, url: SITE.url },
        }}
      />
      <Container className="py-8">
        <Breadcrumb items={[{ label: "Berita PSI", href: "/berita-psi" }, { label: post.rubrikLabel }]} />
        <div className="mt-6">
          <ArticleView post={post} html={html} shareUrl={shareUrl} />
        </div>
        <section aria-labelledby="terkait" className="mt-16">
          <SectionHeading id="terkait" title={`Terkait di ${RUBRIK[post.rubrik].label}`} />
          <PsiPosts
            result={related}
            query={{ categories: rubrikCats, perPage: 3, exclude: [post.id] }}
            view="grid"
            compactNotice
            emptyText="Belum ada artikel terkait."
          />
        </section>
      </Container>
    </>
  );
}
