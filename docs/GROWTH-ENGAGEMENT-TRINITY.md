# Growth & Engagement Trinity

## Modul yang ditambahkan

SultraKita kini memiliki fondasi tiga modul: **Real-time Chat**, **Seller Analytics**, dan **Reels Feed**. Semua operasi database berada di Server Actions dengan pemeriksaan autentikasi, sedangkan UI client hanya menerima data yang diperlukan.

## Supabase migration

Terapkan `supabase/migrations/20260906000000_growth_trinity.sql` pada project Supabase. Migration membuat `conversations`, `messages`, `listing_analytics`, `reels`, materialized view `seller_daily_stats`, index performa, RLS, serta menambahkan tabel chat dan reels ke publication `supabase_realtime` bila publication tersedia.

> Catatan kompatibilitas: repository lama menggunakan `public.listings.id` sebagai bigint dan `seller_id` legacy. Migration menggunakan `listing_id bigint` dan melakukan cast `seller_id::text` pada materialized view/policy agar tetap kompatibel dengan schema yang ada. Verifikasi tipe kolom di staging sebelum apply production.

## Chat dan WhatsApp n8n

`ChatWindow` berlangganan `postgres_changes` pada `messages` dengan filter `conversation_id`. `ChatDrawer` responsif untuk desktop dan mobile. Setelah pesan tersimpan, Server Action mengirim payload berikut ke `N8N_WHATSAPP_WEBHOOK_URL` jika env tersebut tersedia:

```json
{
  "seller_phone": "+628xxxxxxxxxx",
  "buyer_name": "Nama Warga",
  "listing_title": "Kain Tenun Buton Premium",
  "message_content": "Apakah stok masih tersedia?"
}
```

Tambahkan `N8N_WEBHOOK_SECRET` dan validasi header `x-webhook-secret` di workflow n8n. Kegagalan WhatsApp tidak menggagalkan pengiriman pesan chat; notifikasi adalah side effect yang boleh dicoba ulang.

## Seller analytics

`SellerAnalyticsCard` tersedia melalui Account Center → Seller dan Toko ketika user Supabase aktif. Metrik meliputi total views, contact clicks, total conversations, response rate, dan mini chart CSS-only. `getSellerStats` membatasi akses hanya kepada seller yang sama dengan user login dan mendukung 7 atau 30 hari.

Materialized view dapat direfresh melalui job database terjadwal setelah event ingestion stabil:

```sql
refresh materialized view concurrently public.seller_daily_stats;
```

## Reels

`ReelsFeed` menggunakan cursor pagination 10 item, district discovery, scroll snap, lazy autoplay melalui Intersection Observer, mute toggle, like state lokal, dan share. Jika Supabase belum aktif, halaman tetap menggunakan demo reels sebagai fallback. Untuk production, aktifkan storage/CDN video dan batasi MIME type serta ukuran upload pada flow creator.

## Testing checklist

1. Apply migration di staging dan validasi tipe `listings.id` serta `listings.seller_id`.
2. Test dua akun: buyer hanya dapat membaca percakapan yang diikutinya; user lain mendapat empty/denied response.
3. Kirim pesan dan pastikan row `messages` muncul tanpa refresh melalui Supabase Realtime.
4. Set `N8N_WHATSAPP_WEBHOOK_URL` pada Preview dan pastikan payload diterima workflow n8n tanpa mencetak secret.
5. Buka Seller dan Toko sebagai seller; verifikasi metrik 7/30 hari dan empty state seller tanpa listing.
6. Buka Reels dan pastikan video hanya berjalan ketika card berada di area tengah viewport.
7. Jalankan `npm run build`, `git diff --check`, dan uji mobile viewport sebelum deploy.
