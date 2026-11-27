import type { Metadata } from "next";
import { CATEGORY_INFO, psiCategoryUrl } from "@/config/psi-categories";
import { describeFailure, getCategories, getPostsByCategory, PSI_API_BASE } from "@/lib/psi-api";
import { PsiPosts } from "@/components/psi/PsiPosts";
import { formatTanggalWaktu } from "@/lib/format";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Uji lapisan data psi.id",
  robots: { index: false, follow: false },
  alternates: { canonical: "/uji-data" },
};

const IDS = Object.keys(CATEGORY_INFO).map(Number);

export default async function UjiDataPage() {
  const [cats, ...lists] = await Promise.all([getCategories(), ...IDS.map((id) => getPostsByCategory(id, 1, 10))]);
  const checkedAt = formatTanggalWaktu(new Date().toISOString());

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold">Uji lapisan data psi.id</h1>
      <p className="mt-2 text-muted">
        Halaman teknis (tidak diindeks). Menampilkan 10 posting terbaru per kategori dari{" "}
        <code className="rounded bg-bg-soft px-1">{PSI_API_BASE}</code>. Dibuat: {checkedAt}.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Status server</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4">Kategori</th>
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Rubrik situs</th>
                <th className="py-2">Status server</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">/categories</td>
                <td className="py-2 pr-4">–</td>
                <td className="py-2 pr-4">–</td>
                <td className="py-2">{cats.ok ? `OK (${cats.categories.length} kategori)` : `Gagal — ${describeFailure(cats)} [${cats.message}]`}</td>
              </tr>
              {IDS.map((id, i) => {
                const r = lists[i];
                return (
                  <tr key={id} className="border-b border-border">
                    <td className="py-2 pr-4">{CATEGORY_INFO[id].label}</td>
                    <td className="py-2 pr-4">{id}</td>
                    <td className="py-2 pr-4">{CATEGORY_INFO[id].rubrik}</td>
                    <td className="py-2">
                      {r.ok ? `OK — ${r.posts.length} posting (total ${r.total})` : `Gagal (${r.reason}) — fallback browser aktif`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {IDS.map((id, i) => (
          <section key={id} aria-labelledby={`cat-${id}`}>
            <h2 id={`cat-${id}`} className="border-b-2 border-fg pb-1 text-lg font-extrabold">
              {CATEGORY_INFO[id].label} <span className="text-sm font-normal text-muted">(ID {id})</span>
            </h2>
            <PsiPosts
              result={lists[i]}
              query={{ categories: [id], perPage: 10 }}
              view="list"
              compactNotice
              sourceHref={psiCategoryUrl(id)}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
