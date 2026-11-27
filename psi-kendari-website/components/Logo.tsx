import Image from "next/image";
import manifest from "@/lib/generated/logo-manifest.json";

type Asset = { src: string; width: number; height: number } | null;
type Manifest = Record<
  "horizontalWarna" | "horizontalPutih" | "vertikalWarna" | "vertikalPutih" | "kepalaMerah",
  Asset
>;

const logos = manifest as Manifest;

export const LOGO_ALT = "Logo Partai Solidaritas Indonesia (PSI)";

export function hasLogo(key: keyof Manifest): boolean {
  return Boolean(logos[key]);
}

export function getLogo(key: keyof Manifest): Asset {
  return logos[key];
}

/**
 * Menampilkan logo RESMI dari public/logo/. Bila berkas tidak tersedia,
 * komponen tidak merender apa pun (tidak ada logo tiruan/placeholder).
 *
 * `tone="auto"` merender versi warna untuk tema terang dan versi putih
 * untuk tema gelap.
 */
export function Logo({
  variant = "horizontal",
  tone = "auto",
  height = 40,
  priority = false,
  className = "",
}: {
  variant?: "horizontal" | "vertikal";
  tone?: "warna" | "putih" | "auto";
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  const warna = variant === "horizontal" ? logos.horizontalWarna : logos.vertikalWarna;
  const putih = variant === "horizontal" ? logos.horizontalPutih : logos.vertikalPutih;

  const render = (a: NonNullable<Asset>, extra: string) => (
    <Image
      key={a.src}
      src={a.src}
      width={Math.round((a.width / a.height) * height)}
      height={height}
      alt={LOGO_ALT}
      priority={priority}
      className={`${extra} ${className}`}
      style={{ height, width: "auto" }}
    />
  );

  if (tone === "warna") return warna ? render(warna, "") : null;
  if (tone === "putih") return putih ? render(putih, "") : null;

  if (warna && putih) {
    return (
      <>
        {render(warna, "dark:hidden")}
        {render(putih, "hidden dark:block")}
      </>
    );
  }
  const single = warna ?? putih;
  return single ? render(single, "") : null;
}
