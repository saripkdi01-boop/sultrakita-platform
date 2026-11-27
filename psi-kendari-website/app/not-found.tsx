import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="text-7xl font-extrabold text-red-ink">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">Halaman tidak ditemukan</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted">
        Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan. Coba cari dengan kata kunci lain atau kembali
        ke beranda.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-red px-5 py-3 font-extrabold text-white hover:bg-red-strong">
          Kembali ke beranda
        </Link>
        <Link href="/cari" className="rounded-full border border-border px-5 py-3 font-extrabold hover:border-red">
          Cari berita
        </Link>
      </div>
    </Container>
  );
}
