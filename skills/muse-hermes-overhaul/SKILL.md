---
name: muse-hermes-overhaul
description: Upgrade maksimal aplikasi Hermes/SultraKita berbasis Expo React Native agar terasa seperti AI agent sungguhan dengan visual chat premium yang terinspirasi Hermes v6, tetap ringan, stabil, aman, dan usable pada Oppo A5s. Gunakan saat melakukan overhaul UI/UX, arsitektur chat AI, streaming, multimodal attachment, persona, model picker, voice input, penyimpanan lokal, atau optimasi Android low-end.
---

# Muse AI — Hermes Agent Overhaul

## Tujuan

Lakukan perubahan nyata pada repository yang sudah ada; jangan membuat aplikasi baru dan jangan melakukan rewrite total. Pertahankan kontrak backend, route, auth, serta data existing. Target hasil:

- Chat terasa seperti **agent AI nyata**, bukan mock: streaming token, status koneksi, cancel, retry, regenerate, edit-and-resend, context/token visibility, model/persona aktif, dan error yang actionable.
- Visual 90% menangkap **pola pengalaman** Hermes v6 yang dianalisis dari APK terlampir, tetapi jangan menyalin logo, nama, aset, atau kode proprietary secara literal. Gunakan identitas brand repository.
- UI premium, tenang, tactile, one-hand friendly, tanpa mengorbankan performa.
- Lulus pada Android low-end setara **Oppo A5s**: Android 8.1 / RAM terbatas / layar kecil. APK hingga sekitar 100 MB boleh, tetapi runtime memory dan startup tetap harus hemat.

## Baseline wajib sebelum mengubah kode

1. Baca `README.md`, `UPGRADE-MASTER-PROMPT-v3.md`, `DESIGN-SYSTEM.md`, `DESIGN.md`, `mobile/design.md`, `mobile/ideas.md`, serta semua route mobile.
2. Konfirmasi stack aktual: Expo Router + React Native + TypeScript + NativeWind + TanStack Query + TRPC/REST adapter. Jalankan dari `mobile/`: `pnpm check`, `pnpm lint`, `pnpm test`.
3. Catat commit awal, branch kerja, ukuran bundle/APK baseline, cold-start, dan daftar screen yang sudah ada. Jangan menghapus fitur yang sudah berjalan.
4. Jika APK referensi tersedia, lakukan inspeksi statis. Catatan Hermes v6: package `id.sukiapps.hermes`, version 6.0/code 7, min SDK 27, target SDK 34; activity onboarding/key setup/main/chat/settings; permission hanya INTERNET, ACCESS_NETWORK_STATE, RECORD_AUDIO; class kunci `AIProvider`, `JerouterProvider`, `SseParser`, `ChatActivity`, `ChatStore`, `ChatDb`, `KeyVault`, `KeyCipher`, `MdParser`, `Markdown`, `TokenEst`; API `GET /models`, `POST /chat/completions`, SSE `text/event-stream`, default base `https://je.jerouter.web.id/v1`.
5. Simpan hasil audit di `docs/HERMES-OVERHAUL-AUDIT.md` sebelum implementasi.

## Product contract: Hermes-like agent, brand-safe

Pertahankan brand SultraKita/Muse dan bahasa UI default `id-ID`. Gunakan istilah `Percakapan baru`, `Model`, `Persona`, `Lampiran`, `Streaming`, `Konteks`, `Coba lagi`, `Hentikan`, dan `Buat ulang`. Jangan menampilkan endpoint, API key, stack trace, atau klaim kemampuan yang belum diimplementasikan. Tampilkan status jujur: `Menyiapkan`, `Menghubungi model`, `Menulis`, `Selesai`, `Dibatalkan`, `Gagal`.

API key wajib berada di `expo-secure-store` atau secure native adapter, bukan AsyncStorage biasa; redaksi secret dari log.

## Arsitektur yang harus dibangun

### 1. Domain layer provider

Buat adapter typed yang dapat diganti provider tanpa mengubah UI:

```ts
interface AiProvider {
  listModels(signal?: AbortSignal): Promise<ModelInfo[]>;
  complete(input: ChatRequest, signal?: AbortSignal): Promise<ChatResponse>;
  stream(input: ChatRequest, callbacks: StreamCallbacks, signal?: AbortSignal): Promise<void>;
}
```

`ChatRequest` mendukung `model`, `messages`, `systemPrompt/persona`, `temperature`, `topP`, `maxTokens`, `attachments`, dan `stream`. Validasi ukuran attachment, MIME, dan context sebelum request. Default timeout; retry maksimal satu kali hanya untuk error transient.

### 2. Streaming yang stabil

Parse SSE per buffer, termasuk event terpecah lintas chunk, `[DONE]`, delta kosong, HTTP error, timeout, disconnect, dan cancel. Throttle update UI sekitar 50–100 ms; persist final/partial valid; saat app pause hentikan stream atau tandai interrupted. Tombol kirim menjadi `Hentikan`. Gunakan `AbortController` dengan fallback cancellation flag.

### 3. Conversation store

Model minimal: `Conversation { id, title, createdAt, updatedAt, pinned, archived, personaId }` dan `Message { id, conversationId, role, content, status, createdAt, attachmentRefs?, model?, tokenEstimate? }`. Dukung list terbaru, search/filter, pin, archive, rename, delete dengan konfirmasi, export/backup, restore tervalidasi, migrasi, dan pagination/windowing. Jangan memuat seluruh history sekaligus.

### 4. Agent affordances

Implementasikan nyata: header chat dengan judul/model/status/menu; composer multiline auto-grow terbatas dengan send/stop/attach/voice/counter; copy/retry/regenerate/edit-and-resend/share; persona picker; model picker dengan cache/refresh dan state 404/timeout; attachment preview; Markdown aman untuk heading, emphasis, list, code, dan link tervalidasi; token/context indicator berlabel estimasi. Fitur provider baru harus adapter/fallback, bukan fake button.

## Visual direction

Gunakan token repository dan arah **Deep Teal + Warm Sand + Ember Coral**:

- light background `#F8FAF8`, dark `#141A18`;
- surface `#FFFFFF` / `#1D2421`;
- primary teal `#0B6E69`, pressed `#064E4A`;
- accent coral `#E87561` hanya untuk CTA/attention;
- sand `#F5EBDD`; text `#172321` / `#F2F5F2`; muted `#687773`; line `#DDE7E2`.

Chat adalah fokus: whitespace, bubble tidak terlalu bulat, assistant bubble lebih flat, user bubble memakai brand color, code block kontras. Header ringkas; model/persona terlihat tanpa memenuhi layar. Gunakan bottom sheet untuk picker/action, ikon vector existing, hit area minimum 44×44 dp. Hindari neon gradient, glassmorphism berat, blob, shadow besar, emoji sebagai ikon, dan animasi looping. Hormati reduced motion.

Screen target: onboarding/key setup 2–3 langkah; conversation list dengan search/pinned/archive/new; chat; settings provider/model/generation/persona/theme/backup/privacy; attachment preview/progress/error; model/persona bottom sheets.

## Oppo A5s performance gate

Hindari blur, parallax, Lottie, video background, dan full-screen gradients. Gunakan `expo-image` cache + thumbnail/downsampling; jangan menyimpan base64 besar di React state/SQLite, simpan file URI + metadata. Memoize message rows, stable callbacks, virtualisasi 100+ messages, debounce model search, lazy-load settings/Markdown bila memungkinkan, batasi PDF ke halaman awal dan teks attachment sesuai cap, deferred parsing/backup, dan pastikan keyboard/safe-area/back button bekerja.

Acceptance: tidak crash/ANR setelah 30 menit chat/scroll; first screen tidak menunggu model list; scrolling 100+ row tetap usable; streaming tidak membuat input lag; memory tidak terus naik setelah attachment preview; release build tidak bergantung dev server.

## Security and reliability

Gunakan TLS only; validasi extension + MIME + ukuran; sanitasi nama file; jangan membuka APK/ZIP otomatis; allowlist external links; jangan render HTML arbitrer; redaksi key/prompt/attachment dari log; error harus memberi langkah berikutnya; backup hanya data yang disetujui dan restore overwrite harus dikonfirmasi.

## Definition of done

Kerjakan bertahap: audit; tokens/app shell; conversation/local persistence; stream/cancel/retry; Markdown/attachments/voice; model/persona/settings/backup; performance/accessibility/security QA.

Wajib lulus `pnpm check`, `pnpm lint`, `pnpm test`; tambah unit test SSE parser, cancellation, error mapping, token estimation, backup validation, dan attachment limits. Uji light/dark, keyboard, safe area, reduced motion, offline, 401/404/429/5xx, timeout, empty model list, dan partial stream pada layar kecil/Android 8.1+. Dokumentasikan file berubah, kontrak provider, env, ukuran APK, profiling, dan fitur yang belum nyata.

## Batasan penting

Jangan mengubah schema/backend existing tanpa bukti dan migration. Jangan hardcode credential. Jangan menyalin aset atau identitas Hermes/SUKI secara literal. Jangan menjanjikan “100% Hermes”; targetnya parity pada pola pengalaman dan kemampuan yang benar-benar tersedia, dengan brand dan arsitektur repository sendiri.
