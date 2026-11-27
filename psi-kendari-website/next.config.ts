import type { NextConfig } from "next";

/**
 * Konfigurasi Next.js — PSI Kendari.
 *
 * Catatan model cache: proyek ini SENGAJA memakai model ISR klasik
 * (`export const revalidate` + `fetch(..., { next: { revalidate } })`)
 * sesuai spesifikasi (SSG + ISR, revalidate 900 detik). `cacheComponents`
 * dimatikan; lihat README bagian "Arsitektur data".
 */

const isDev = process.env.NODE_ENV !== "production";

const PSI_API_BASE =
  process.env.PSI_API_BASE || "https://psi.id/wp-json/wp/v2";
const PUBLIC_PSI_API_BASE =
  process.env.NEXT_PUBLIC_PSI_API_BASE || PSI_API_BASE;

function originOf(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

const gaId = process.env.NEXT_PUBLIC_GA_ID;

const connectSrc = new Set<string>(["'self'", "https://psi.id"]);
for (const u of [PSI_API_BASE, PUBLIC_PSI_API_BASE]) {
  const o = originOf(u);
  if (o) connectSrc.add(o);
}
if (gaId) {
  connectSrc.add("https://www.google-analytics.com");
  connectSrc.add("https://*.google-analytics.com");
  connectSrc.add("https://www.googletagmanager.com");
}
if (isDev) connectSrc.add("ws:");

const scriptSrc = ["'self'", "'unsafe-inline'"];
if (isDev) scriptSrc.push("'unsafe-eval'");
if (gaId) scriptSrc.push("https://www.googletagmanager.com");

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src ${Array.from(connectSrc).join(" ")}`,
  "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
  "media-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pastikan folder /content ikut dibundel untuk render ulang ISR di server.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  reactStrictMode: true,
  images: {
    // Gambar psi.id dirender `unoptimized` (langsung dari browser) karena
    // psi.id saat ini memasang Cloudflare challenge untuk IP datacenter,
    // sehingga optimizer gambar di server tidak bisa mengambilnya.
    // remotePatterns tetap dicatat agar optimisasi bisa diaktifkan kembali.
    remotePatterns: [
      { protocol: "https", hostname: "psi.id" },
      { protocol: "https", hostname: "**.psi.id" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
