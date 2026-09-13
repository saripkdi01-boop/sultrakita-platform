# Profile Avatar Resize Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Proses foto profil di backend menjadi gambar persegi JPEG 512×512 untuk semua viewport, menggunakan Gemini hanya untuk membantu framing wajah dan fallback deterministik bila Gemini tidak tersedia.

**Architecture:** Browser mengirim multipart upload ke endpoint terautentikasi. Express memvalidasi ukuran, MIME, dan signature, meminta Gemini JSON bounding box secara server-side, melakukan crop/resize dengan `sharp`, mengunggah hasil ke object storage yang sudah digunakan repo, lalu menyimpan URL pada `users.avatar_url`. UI menampilkan preview lokal, status proses, dan tetap memakai endpoint yang sama di desktop, tablet, dan mobile.

**Tech Stack:** Node.js CommonJS, Express, multer memory storage, sharp, Gemini REST API, Cloudflare R2/S3-compatible storage, vanilla HTML/CSS/JS.

**Spec:** User request 2026-09-13 — otomatis resize foto profil memakai Gemini API untuk desktop, mobile, dan tablet.

## Global Constraints

- File input menerima JPG, PNG, WebP, atau GIF; backend menolak file lebih besar dari 5 MB.
- Hasil tersimpan sebagai JPEG persegi 512×512.
- API key Gemini hanya berada di environment backend.
- Gemini framing bersifat best effort; upload tetap berjalan dengan crop tengah jika Gemini unavailable atau respons tidak valid.
- Endpoint wajib terautentikasi dan tidak mengubah kontrak profile PATCH lama.

---

### Task 1: Backend image pipeline

**Files:**
- Modify: `server.js`
- Modify: `.env.example`
- Modify: `package.json`, `package-lock.json`

- [ ] Import `sharp` and add a multipart avatar endpoint at `POST /api/me/avatar`.
- [ ] Validate size, MIME, and image signature; accept GIF input but normalize the output to JPEG.
- [ ] Call Gemini REST with an inline base64 image and a strict JSON framing prompt; never expose the key.
- [ ] Clamp Gemini coordinates, compute a safe square crop, resize to 512×512, upload via existing `uploadObject`, update `users.avatar_url`, and return URL plus processing metadata.
- [ ] Use centered crop fallback when Gemini is unconfigured, times out, or returns invalid JSON.

### Task 2: Responsive account UI

**Files:**
- Modify: `public/account.html`
- Modify: `public/account.js`
- Modify: `public/account.css`

- [ ] Add avatar preview, file input, accessible status, and copy stating 512×512 output and 5 MB limit.
- [ ] Upload with `FormData` after profile form submission, show local preview immediately, and refresh stored avatar after success.
- [ ] Use fluid CSS sizing and mobile-safe controls so the same form works at 360px, 820px, and 1440px widths.

### Task 3: Validation and release

**Files:**
- Test: existing npm test/lint/build suites plus targeted endpoint smoke checks.

- [ ] Run syntax checks, lint, tests, and build.
- [ ] Verify no secret is committed and inspect staged diff.
- [ ] Commit to `main`, push to `origin/main`, deploy with the existing Vercel integration, and verify the public account route.

## Completion Criteria

A valid authenticated avatar upload is accepted from all supported viewport layouts, produces a storage URL for a 512×512 JPEG, preserves existing profile fields, rejects invalid/oversized input, and does not fail the rest of the profile save when no image is selected.
