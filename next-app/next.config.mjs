/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://images.unsplash.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'" },
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
  async redirects() {
    return [
      // Komunitas hidup di /groups; /komunitas hanya alias lama yang me-return 404.
      { source: '/komunitas', destination: '/groups', permanent: true },
      { source: '/komunitas/:path*', destination: '/groups/:path*', permanent: true },
    ];
  },
};
export default nextConfig;
