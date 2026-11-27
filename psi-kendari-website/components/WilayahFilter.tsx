import Link from "next/link";
import type { Wilayah } from "@/lib/content";

export function WilayahFilter({ wilayah, active }: { wilayah: Pick<Wilayah, "slug" | "nama">[]; active?: string }) {
  const items = [{ slug: "", nama: "Semua wilayah" }, ...wilayah];
  return (
    <nav aria-label="Filter kabupaten/kota" className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {items.map((w) => {
          const on = (active ?? "") === w.slug;
          return (
            <li key={w.slug || "semua"}>
              <Link
                href={w.slug ? `/kendari-sultra/${w.slug}` : "/kendari-sultra"}
                aria-current={on ? "page" : undefined}
                className={`inline-block rounded-full border px-3.5 py-1.5 text-sm font-bold ${
                  on ? "border-red bg-red text-white" : "border-border bg-surface hover:border-red hover:text-red-ink"
                }`}
              >
                {w.nama.replace(/^Kabupaten /, "")}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
