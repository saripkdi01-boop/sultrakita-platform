import type { Metadata } from "next";
import { BeritaPsiListing } from "@/components/psi/BeritaPsiListing";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Berita PSI",
  description: "Liputan nasional, liputan daerah, siaran pers, sikap, dan kolom resmi DPP PSI dari psi.id.",
  alternates: { canonical: "/berita-psi" },
};

export default function BeritaPsiPage() {
  return <BeritaPsiListing filterKey="semua" page={1} />;
}
