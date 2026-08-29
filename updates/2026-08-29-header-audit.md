# Header Audit — 29 Agustus 2026

## Root cause
Header sebelumnya terdiri dari topbar sticky dan tabbar sticky yang berada di luar topbar, sehingga dua sistem memiliki offset berbeda (`top: 0` dan `top: 64px`) serta stylesheet tambahan menimpa positioning-nya. Pada mobile, topbar juga dapat membungkus inner row dan searchbar diposisikan fixed, sehingga first-screen header menjadi tidak stabil.

## Fix
Primary navigation sekarang nested di dalam elemen `<header>` yang sama dengan topbar. Header memakai satu sticky stack, topbar row 64px, dan primary navigation 52–54px pada mobile/tablet. Searchbar mobile tidak lagi fixed; ketika dibuka ia menjadi bagian normal dari stack header dan langsung menerima focus melalui JavaScript. Nav state sekarang mengelola `aria-current="page"`, dan search toggle memakai helper stateful.

## Verification
Pada 390x844, topbar dan primary nav terlihat utuh di bagian atas tanpa blank gap; brand, hamburger, create, search, theme, ikon, dan label nav ter-align. Pada 834x1194, header juga menjadi satu stack yang rapih dengan content dimulai tepat setelah header, tanpa overlap dengan compact rail. Marketplace dan filter tetap dapat diakses. Screenshot tablet sempat menangkap state loading listing karena request API sedang berlangsung, bukan karena header layout.
