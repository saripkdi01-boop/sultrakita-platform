# SultraKita WhatsApp Business Operating System

## Tujuan

SultraKita akan menjadi commerce operating system yang menghubungkan katalog warga, percakapan WhatsApp, lead, handoff manusia, dan revenue event. Nomor WhatsApp Business yang sudah menggunakan Meta Business Agent tetap diperlakukan sebagai aset produksi yang tidak boleh diputus atau diubah tanpa validasi kelayakan dan persetujuan pemilik akun.

## Prinsip arsitektur

1. **Human control first.** Topik sensitif, transaksi, komplain, negosiasi harga besar, dan permintaan data pribadi selalu dapat dialihkan ke manusia.
2. **One source of truth.** Listing, seller, buyer, conversation, lead, dan revenue event tetap berada pada database SultraKita; Google Workspace menjadi operational mirror dan collaboration layer.
3. **Idempotent by default.** Setiap event Meta disimpan berdasarkan message ID/event ID agar retry tidak membuat lead, pesan, atau revenue event ganda.
4. **No secret in frontend.** Token Meta, webhook verify token, Supabase service key, dan kredensial Workspace hanya berada pada secret manager/server.
5. **Progressive activation.** Mulai dari webhook sandbox, shadow logging, human-approved replies, lalu automasi terbatas. Jangan langsung mengaktifkan auto-reply produksi.

## Kondisi codebase saat ini

Codebase `saripkdi01-boop/sultrakita-platform` sudah memiliki Express runtime, endpoint health, conversations/messages, notification, listing, offer, order, revenue/donation flow, dan endpoint simulasi `/api/dev/whatsapp-webhook`. Source juga sudah mengenali key WhatsApp Cloud API: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_API_VERSION`, `WHATSAPP_TEMPLATE_NAME`, dan `WHATSAPP_TEMPLATE_LANGUAGE`. Gap utama adalah production webhook Meta, event ledger, intent router, lead entity, human handoff state, dan sinkronisasi Google Workspace.

## Target funnel WhatsApp

Pesan masuk → verifikasi signature/tenant → deduplikasi event → normalisasi contact → intent classification → lookup katalog/listing → buat atau update lead → balasan terkontrol → handoff bila perlu → catat outcome → sinkronkan ringkasan ke Google Sheets → ukur conversion dan revenue.

### Intent awal

| Intent | Respons awal | Handoff |
|---|---|---|
| Cari produk/listing | Cari katalog berdasarkan kata kunci, distrik, harga, dan kategori | Jika hasil ambigu atau stok perlu dikonfirmasi |
| Tanya seller | Buat lead terhubung ke listing dan seller | Jika seller perlu menjawab langsung |
| Jual listing | Kumpulkan kategori, lokasi, harga, foto, dan kontak | Jika moderasi atau data tidak lengkap |
| Status pesanan | Verifikasi identitas dan tampilkan status aman | Jika pembayaran/refund/komplain |
| Harga/pembayaran | Jawab dari knowledge base yang terversi | Selalu untuk negosiasi atau pembayaran aktual |
| Bantuan/komplain | Buat support case dengan prioritas | Segera untuk isu keamanan, penipuan, dan privasi |

## Meta Business Agent dan Cloud API

Meta Business Agent native pada WhatsApp Business App dapat menjawab pertanyaan dasar, merekomendasikan produk, menyampaikan harga, mengumpulkan informasi, serta melakukan handoff. Fitur ini memiliki kelayakan negara/bisnis dan batasan bahasa; mengaktifkannya dapat memengaruhi linked devices serta fitur aplikasi. Karena itu, Meta Business Agent diposisikan sebagai lapisan front-door yang harus divalidasi melalui aplikasi, bukan dipaksa melalui codebase.

Cloud API adalah jalur integrasi programatik. Tahapan production: Meta App + WhatsApp Business Account, Phone Number ID, system-user token, permission `whatsapp_business_messaging` dan `whatsapp_business_management`, endpoint HTTPS, verify token, subscription field `messages`, test payload, lalu live-mode review. Webhook wajib menerima retry secara idempotent dan mengembalikan HTTP 200 dengan cepat.

## Model data minimum

- `wa_contacts`: nomor/wa_id, display name, consent state, last inbound/outbound, source.
- `wa_conversations`: wa_id, listing_id, seller_id, state, assigned_to, handoff_reason, last_message_at.
- `wa_messages`: provider_message_id unik, direction, type, body, payload_hash, status, received_at.
- `wa_leads`: conversation_id, intent, listing_id, seller_id, score, stage, next_action_at, owner.
- `wa_events`: provider_event_id unik, event_type, raw_payload redacted, processed_at, processing_status.
- `wa_knowledge_versions`: source, version, effective_at, reviewer, checksum.
- `wa_handoffs`: conversation_id, reason, SLA, status, resolution_note.

## Google Workspace operating layer

Folder utama: `SultraKita WhatsApp OS`.

Dokumen yang disiapkan:

1. Masterplan ini sebagai strategic and technical reference.
2. `Knowledge Base & Reply Policy` untuk jam operasional, katalog, harga, pengiriman, pembayaran, privasi, dan contoh jawaban yang disetujui.
3. `Handoff & Incident Runbook` untuk eskalasi, SLA, penipuan, komplain, dan fallback ketika Meta/API gagal.

Spreadsheet operating console:

- `Leads`: satu baris per lead dengan lead_id, waktu masuk, wa_id tersamarkan, intent, listing, distrik, owner, stage, score, next action, outcome.
- `Messages`: event log ringkas; jangan simpan token atau payload sensitif yang tidak diperlukan.
- `Catalog`: listing_id, judul, kategori, distrik, harga, status, seller, last_verified_at, knowledge_version.
- `Revenue`: lead_id, order_id, channel, gross_value, status, event_at, attribution.
- `SLA`: status handoff, owner, due_at, overdue flag, resolution.

Sinkronisasi awal sebaiknya bersifat append-only atau upsert berdasarkan ID. Google Sheets bukan database transaksi; source of truth tetap database aplikasi.

## Keamanan dan kepatuhan

Gunakan secret manager untuk token. Redact nomor telepon pada log dan spreadsheet bila tidak diperlukan. Verifikasi webhook challenge dan signature sesuai dokumentasi Meta. Terapkan rate limit, replay protection, payload size limit, audit log, least privilege, dan kill switch untuk mematikan auto-reply. Jangan mengirim pesan marketing di luar aturan consent/template. Simpan data seperlunya dan sediakan proses penghapusan/ekspor sesuai kebijakan privasi.

## Roadmap 0–30 / 31–60 / 61–90 hari

### 0–30 hari: fondasi aman

Audit data model, tambah event ledger dan idempotency, aktifkan endpoint webhook staging, buat intent taxonomy, knowledge base v1, human handoff, dan Google Sheets mirror. Semua reply otomatis berada pada shadow mode atau approval mode.

### 31–60 hari: pilot terbatas

Validasi kelayakan nomor di Meta, sambungkan Phone Number ID dan system-user token, subscribe `messages`, uji test number, aktifkan catalog lookup, lead scoring, dan SLA. Mulai dari FAQ, pencarian listing, dan pengumpulan lead; transaksi, refund, dan komplain tetap handoff.

### 61–90 hari: optimasi revenue

Tambahkan attribution Click-to-WhatsApp, template lifecycle yang telah disetujui, dashboard conversion, revenue per listing/seller, replay queue, alert kegagalan, dan review mingguan knowledge base. Evaluasi apakah Meta Business Agent native, Cloud API, atau hybrid memberikan kualitas dan kontrol terbaik.

## KPI dan guardrails

| KPI | Target awal | Guardrail |
|---|---:|---|
| Webhook success rate | ≥ 99% | Alert jika < 98% selama 15 menit |
| Duplicate processing | 0 transaksi ganda | Unique provider event/message ID |
| First response FAQ | < 60 detik | Handoff saat confidence rendah |
| Qualified lead rate | baseline minggu 1 | Review sampel mingguan |
| Human handoff SLA | < 15 menit jam kerja | Escalate overdue |
| Catalog freshness | ≥ 95% < 24 jam | Jangan rekomendasikan listing stale |

## Gate akses yang masih diperlukan

- Konfirmasi apakah nomor tetap menjadi WhatsApp Business App + Meta Business Agent atau boleh dihubungkan ke Cloud API.
- Dari Meta App Dashboard: App ID, WABA ID, Phone Number ID, system-user token dengan permission minimal, dan webhook verify token. Token tidak boleh dikirim di chat.
- URL HTTPS production untuk webhook dan kebijakan environment staging/production.
- Pemilik/owner operasional untuk handoff dan SLA.
- Persetujuan folder/file Workspace yang dibuat pada akun `sultrakitaplatform@gmail.com`.

## Referensi resmi

- Meta WhatsApp Cloud API Get Started: https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started
- Meta WhatsApp Webhooks: https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview
- Meta Business Agent FAQ: https://faq.whatsapp.com/291930066973116
- Meta Business Agent product overview: https://whatsappbusiness.com/products/business-app-ai-agent/
