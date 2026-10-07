/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Fase 3: geolocation=(self) agar tombol "Lokasi saya" pada peta properti dapat memakai Geolocation API milik origin sendiri.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  // HSTS: paksa HTTPS 1 tahun untuk domain + subdomain (item 19 audit 2026-10-02).
  // `preload` SENGAJA tidak dipakai dulu — sekali masuk daftar preload browser
  // praktis tidak bisa dibatalkan cepat; tambahkan setelah stabil beberapa bulan.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://images.unsplash.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'" },
];

const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }, { protocol: 'https', hostname: '**.supabase.co' }, { protocol: 'https', hostname: '**.r2.dev' }] },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      // Area admin tidak boleh terindeks mesin pencari.
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  // Fase 0: rapikan URL duplikat/mati. `permanent: true` menghasilkan 308.
  // Fase 0: rapikan URL duplikat/mati. `permanent: true` menghasilkan 308.
  // (Pengalihan domain kanonis sukiapps.web.id ditangani di middleware.ts,
  //  karena aturan `has: host` di next.config tidak dievaluasi untuk host ini.)
  async redirects() {
    return [
      // Komunitas hidup di /groups; /komunitas hanya alias lama yang me-return 404.
      { source: '/komunitas', destination: '/groups', permanent: true },
      { source: '/komunitas/:path*', destination: '/groups/:path*', permanent: true },
    ];
  },
};
export default nextConfig;
