/* =========================================================
   JALA FISH — ilustrasi ikan SVG semi-3D per-spesies (v1.0.0)
   File BERSAMA: di-include index.html & miniapp.html.
   Gaya "stylized semi-3D": gradien 3-stop, highlight perut,
   sirip semi-transparan, mata berkilau, siluet akurat.
   Semua ikan menghadap KIRI. viewBox 0 0 120 60.
   API: JALAFISH.art(id, emojiFallback, px, opts)
   ========================================================= */
(function(){
'use strict';

var FISH = {

layang:
'<defs><linearGradient id="jf-layang-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#2f6fb8"/><stop offset=".55" stop-color="#6fa8e0"/>' +
'<stop offset="1" stop-color="#e6f3ff"/></linearGradient></defs>' +
'<g class="jf-swim">' +
'<g class="jf-tail"><path d="M78 30 L97 19 L92 30 L97 41 Z" fill="#2b5f96"/></g>' +
'<path d="M46 19.5 Q53 9 62 18.5 Q54 17 46 19.5 Z" fill="#245a8f"/>' +
'<ellipse cx="50" cy="30" rx="30" ry="11" fill="url(#jf-layang-b)"/>' +
'<path d="M24 30 Q50 26 76 30" stroke="#bcd8f5" stroke-width="1.2" fill="none" opacity=".6"/>' +
'<ellipse cx="46" cy="34" rx="18" ry="4.4" fill="#ffffff" opacity=".3"/>' +
'<path d="M56 38 Q62 45 68 39 Q61 38.5 56 38 Z" fill="#4d8fd0" opacity=".9"/>' +
'<circle cx="31" cy="27" r="3.2" fill="#fff"/><circle cx="31" cy="27" r="1.6" fill="#0b2233"/>' +
'<circle cx="31.7" cy="26.3" r=".6" fill="#fff"/>' +
'<path d="M26 33 Q30 35 34 34" stroke="#1c4e80" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
'</g>',

baronang:
'<defs><linearGradient id="jf-baronang-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#c99a1e"/><stop offset=".5" stop-color="#f2c93f"/>' +
'<stop offset="1" stop-color="#fff3cf"/></linearGradient></defs>' +
'<g class="jf-swim">' +
'<g class="jf-tail"><path d="M74 30 L90 21 L87 30 L90 39 Z" fill="#a87f14"/></g>' +
'<path d="M30 17 L35 6 L40 16 L45 5 L50 15 L55 6 L60 16 L65 7 L68 17 Z" fill="#8a6a10" opacity=".9"/>' +
'<ellipse cx="50" cy="30" rx="27" ry="15" fill="url(#jf-baronang-b)"/>' +
'<g fill="#7a5c0c"><circle cx="48" cy="26" r="1.6"/><circle cx="56" cy="31" r="1.8"/>' +
'<circle cx="44" cy="33" r="1.5"/><circle cx="62" cy="26" r="1.5"/>' +
'<circle cx="54" cy="36" r="1.4"/><circle cx="66" cy="33" r="1.3"/></g>' +
'<ellipse cx="46" cy="37" rx="15" ry="4.6" fill="#ffffff" opacity=".35"/>' +
'<path d="M52 44 Q58 50 64 45 Q57 44 52 44 Z" fill="#c99a1e"/>' +
'<circle cx="30" cy="27" r="3.4" fill="#fff"/><circle cx="30" cy="27" r="1.7" fill="#201500"/>' +
'<circle cx="30.7" cy="26.3" r=".7" fill="#fff"/>' +
'<path d="M25 33 Q29 35 33 34" stroke="#7a5c0c" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
'</g>',

cakalang:
'<defs><linearGradient id="jf-cakalang-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#134e5e"/><stop offset=".55" stop-color="#3d8fa3"/>' +
'<stop offset="1" stop-color="#dff3f6"/></linearGradient></defs>' +
'<g class="jf-swim">' +
'<g class="jf-tail"><path d="M79 30 L99 18 L93 30 L99 42 Z" fill="#0f3f4d"/></g>' +
'<circle cx="72" cy="19" r="2.2" fill="#0f3f4d"/><circle cx="78" cy="20.5" r="2" fill="#0f3f4d"/>' +
'<path d="M47 18 Q54 8 63 17.5 Q55 16 47 18 Z" fill="#0f3f4d"/>' +
'<ellipse cx="51" cy="30" rx="30" ry="12" fill="url(#jf-cakalang-b)"/>' +
'<path d="M40 36 Q58 34 74 37 M40 39.5 Q58 37.5 72 40" stroke="#0e3a46" stroke-width="1.4" fill="none" opacity=".7"/>' +
'<ellipse cx="47" cy="35" rx="17" ry="4" fill="#ffffff" opacity=".3"/>' +
'<path d="M56 41 Q62 48 68 42 Q61 41.5 56 41 Z" fill="#2b7c90"/>' +
'<circle cx="31" cy="27" r="3.2" fill="#fff"/><circle cx="31" cy="27" r="1.6" fill="#08181d"/>' +
'<circle cx="31.7" cy="26.3" r=".6" fill="#fff"/>' +
'<path d="M26 33 Q30 35 34 34" stroke="#0e3a46" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
'</g>',

kakap:
'<defs><linearGradient id="jf-kakap-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#a31616"/><stop offset=".55" stop-color="#e05252"/>' +
'<stop offset="1" stop-color="#ffd9d9"/></linearGradient></defs>' +
'<g class="jf-swim">' +
'<g class="jf-tail"><path d="M75 30 L94 19 L89 30 L94 41 Z" fill="#8c1010"/></g>' +
'<path d="M36 17 Q44 4 58 6 Q66 7 70 16 Q52 12 36 17 Z" fill="#8c1010"/>' +
'<ellipse cx="49" cy="30" rx="28" ry="14" fill="url(#jf-kakap-b)"/>' +
'<path d="M30 24 Q50 20 68 25" stroke="#ffd9d9" stroke-width="1.4" fill="none" opacity=".5"/>' +
'<ellipse cx="45" cy="36" rx="17" ry="5" fill="#ffffff" opacity=".32"/>' +
'<path d="M50 43 Q57 51 65 44 Q56 43 50 43 Z" fill="#c22f2f"/>' +
'<path d="M60 40 Q70 44 72 50 Q64 48 58 44 Z" fill="#c22f2f" opacity=".85"/>' +
'<circle cx="30" cy="27" r="3.6" fill="#fff"/><circle cx="30" cy="27" r="1.8" fill="#1d0505"/>' +
'<circle cx="30.8" cy="26.2" r=".7" fill="#fff"/>' +
'<path d="M24 33 Q29 36 34 34.5" stroke="#7a0d0d" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
'</g>',

kerapu:
'<defs><linearGradient id="jf-kerapu-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#4d3f24"/><stop offset=".55" stop-color="#8a6f42"/>' +
'<stop offset="1" stop-color="#ecdfbe"/></linearGradient></defs>' +
'<g class="jf-swim">' +
'<g class="jf-tail"><path d="M74 31 Q88 22 90 31 Q88 40 74 31 Z" fill="#3d3119"/></g>' +
'<path d="M32 17 Q42 5 56 7 Q64 8 68 17 Q50 12 32 17 Z" fill="#3d3119"/>' +
'<ellipse cx="49" cy="31" rx="27" ry="15" fill="url(#jf-kerapu-b)"/>' +
'<g fill="#2e2513" opacity=".8"><circle cx="45" cy="24" r="1.7"/><circle cx="54" cy="27" r="1.9"/>' +
'<circle cx="62" cy="24" r="1.6"/><circle cx="50" cy="33" r="1.8"/><circle cx="59" cy="34" r="1.6"/>' +
'<circle cx="67" cy="30" r="1.5"/><circle cx="42" cy="31" r="1.5"/><circle cx="56" cy="39" r="1.4"/>' +
'<circle cx="65" cy="37" r="1.3"/></g>' +
'<ellipse cx="45" cy="38" rx="15" ry="4.6" fill="#ffffff" opacity=".28"/>' +
'<path d="M50 45 Q57 52 65 46 Q56 45 50 45 Z" fill="#6b5732"/>' +
'<circle cx="30" cy="28" r="3.4" fill="#fff"/><circle cx="30" cy="28" r="1.7" fill="#140f02"/>' +
'<circle cx="30.7" cy="27.3" r=".7" fill="#fff"/>' +
'<path d="M22 35 Q28 38 35 36" stroke="#241b09" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
'</g>',

tenggiri:
'<defs><linearGradient id="jf-tenggiri-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#33506b"/><stop offset=".55" stop-color="#7d9ab5"/>' +
'<stop offset="1" stop-color="#eef6fb"/></linearGradient></defs>' +
'<g class="jf-swim">' +
'<g class="jf-tail"><path d="M81 30 L102 17 L95 30 L102 43 Z" fill="#243b52"/></g>' +
'<path d="M48 21 Q56 11 66 20 Q56 19 48 21 Z" fill="#243b52"/>' +
'<ellipse cx="51" cy="30" rx="32" ry="9.5" fill="url(#jf-tenggiri-b)"/>' +
'<path d="M22 30 Q20 30 18 31 L22 32 Z" fill="#243b52"/>' +
'<g fill="#243b52" opacity=".75"><circle cx="52" cy="28" r="1.3"/><circle cx="58" cy="30" r="1.3"/>' +
'<circle cx="64" cy="28" r="1.3"/><circle cx="70" cy="30" r="1.2"/><circle cx="76" cy="28" r="1.1"/></g>' +
'<ellipse cx="47" cy="33.5" rx="20" ry="3.4" fill="#ffffff" opacity=".35"/>' +
'<path d="M21 32.5 L23.5 34.5 L26 33 L24.5 35.5 L27 34.5" stroke="#ffffff" stroke-width="1" fill="none" opacity=".9"/>' +
'<circle cx="30" cy="27.5" r="3" fill="#fff"/><circle cx="30" cy="27.5" r="1.5" fill="#0a141d"/>' +
'<circle cx="30.6" cy="26.9" r=".6" fill="#fff"/>' +
'</g>',

kuwe:
'<defs><linearGradient id="jf-kuwe-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#23584d"/><stop offset=".55" stop-color="#57a892"/>' +
'<stop offset="1" stop-color="#e2f7ee"/></linearGradient></defs>' +
'<g class="jf-swim">' +
'<g class="jf-tail"><path d="M72 30 L92 19 L87 30 L92 41 Z" fill="#d9a91f"/></g>' +
'<path d="M38 15 Q48 3 62 6 Q68 8 70 15 Q54 11 38 15 Z" fill="#1d4a41"/>' +
'<path d="M24 30 Q26 18 38 15 Q30 22 28 30 Z" fill="#23584d"/>' +
'<ellipse cx="49" cy="30" rx="25" ry="16" fill="url(#jf-kuwe-b)"/>' +
'<ellipse cx="45" cy="37" rx="14" ry="5" fill="#ffffff" opacity=".3"/>' +
'<path d="M48 45 Q56 53 65 46 Q55 45 48 45 Z" fill="#d9a91f"/>' +
'<path d="M58 41 Q68 45 70 52 Q62 49 56 45 Z" fill="#b78a15"/>' +
'<circle cx="30" cy="27" r="3.6" fill="#fff"/><circle cx="30" cy="27" r="1.8" fill="#06231c"/>' +
'<circle cx="30.8" cy="26.2" r=".7" fill="#fff"/>' +
'<path d="M23 33 Q28 36 34 34.5" stroke="#123f36" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
'</g>',

tuna:
'<defs><linearGradient id="jf-tuna-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#1c3260"/><stop offset=".55" stop-color="#4a6fa5"/>' +
'<stop offset="1" stop-color="#e3edf9"/></linearGradient></defs>' +
'<g class="jf-swim">' +
'<g class="jf-tail"><path d="M80 30 Q92 30 100 20 Q96 30 100 40 Q92 30 80 30 Z" fill="#8a9c2e"/></g>' +
'<path d="M46 17.5 Q54 7 64 16.5 Q55 15 46 17.5 Z" fill="#141f3d"/>' +
'<path d="M66 18 Q70 10 74 17 Q70 16 66 18 Z" fill="#e8c51f"/>' +
'<circle cx="78" cy="20" r="1.8" fill="#e8c51f"/><circle cx="83" cy="21.5" r="1.6" fill="#e8c51f"/>' +
'<ellipse cx="51" cy="30" rx="31" ry="13" fill="url(#jf-tuna-b)"/>' +
'<ellipse cx="47" cy="35.5" rx="19" ry="4.6" fill="#ffffff" opacity=".3"/>' +
'<path d="M64 42 Q68 50 73 43 Q68 42 64 42 Z" fill="#e8c51f"/>' +
'<path d="M56 42 Q62 49 68 43 Q61 42 56 42 Z" fill="#c9a813" opacity=".9"/>' +
'<circle cx="30" cy="27" r="3.4" fill="#fff"/><circle cx="30" cy="27" r="1.7" fill="#060b18"/>' +
'<circle cx="30.7" cy="26.3" r=".7" fill="#fff"/>' +
'<path d="M24 33 Q29 35.5 34 34" stroke="#101c3f" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
'</g>',

lobster:
'<defs><linearGradient id="jf-lobster-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#a3321f"/><stop offset=".55" stop-color="#e0632f"/>' +
'<stop offset="1" stop-color="#ffd9b0"/></linearGradient></defs>' +
'<g class="jf-swim">' +
'<path d="M28 26 Q12 18 4 8 M28 28 Q14 26 4 22" stroke="#c24a24" stroke-width="2" fill="none" stroke-linecap="round"/>' +
'<path d="M30 24 L22 12 M34 23 L30 10" stroke="#8f2c14" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
'<g class="jf-tail"><path d="M78 30 L94 22 L94 38 Z" fill="#c24a24"/>' +
'<path d="M80 30 L93 27 M80 30 L93 33" stroke="#7e2812" stroke-width="1.2" fill="none"/></g>' +
'<ellipse cx="52" cy="30" rx="26" ry="11" fill="url(#jf-lobster-b)"/>' +
'<path d="M38 21 Q52 23 66 21 M38 25 Q52 27 66 25 M38 29 Q52 31 66 29 M38 33 Q52 35 66 33 M38 37 Q52 39 66 37" stroke="#7e2812" stroke-width="1.3" fill="none" opacity=".8"/>' +
'<ellipse cx="48" cy="33" rx="16" ry="3.6" fill="#ffffff" opacity=".25"/>' +
'<path d="M40 40 L36 50 M48 41 L46 51 M56 41 L56 51 M64 40 L66 50" stroke="#8f2c14" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
'<g fill="#ffe9c9"><circle cx="52" cy="26" r="1.2"/><circle cx="60" cy="31" r="1.2"/><circle cx="44" cy="31" r="1.1"/></g>' +
'<circle cx="30" cy="28" r="2.6" fill="#1a0a04"/><circle cx="30.7" cy="27.3" r=".8" fill="#fff"/>' +
'</g>',

legenda:
'<defs><linearGradient id="jf-legenda-b" x1="0" y1="0" x2="0" y2="1">' +
'<stop offset="0" stop-color="#3d2c07"/><stop offset=".55" stop-color="#8a6a1c"/>' +
'<stop offset="1" stop-color="#ffe9a8"/></linearGradient>' +
'<radialGradient id="jf-legenda-a" cx=".5" cy=".5" r=".5">' +
'<stop offset="0" stop-color="#ffd766" stop-opacity=".5"/>' +
'<stop offset="1" stop-color="#ffd766" stop-opacity="0"/></radialGradient></defs>' +
'<g class="jf-swim">' +
'<ellipse cx="55" cy="30" rx="52" ry="28" fill="url(#jf-legenda-a)"/>' +
'<g class="jf-tail"><path d="M80 30 Q92 30 101 19 Q97 30 101 41 Q92 30 80 30 Z" fill="#d9a91f"/></g>' +
'<path d="M46 17.5 Q54 6 65 16 Q55 14.5 46 17.5 Z" fill="#241a04"/>' +
'<ellipse cx="51" cy="30" rx="31" ry="13.5" fill="url(#jf-legenda-b)"/>' +
'<ellipse cx="47" cy="35.5" rx="19" ry="4.8" fill="#ffffff" opacity=".32"/>' +
'<path d="M64 42 Q69 51 74 43 Q68 42 64 42 Z" fill="#ffd766"/>' +
'<path d="M24 16 L26 8 L29 14 L32 7 L35 14 L38 8 L40 16 Z" fill="#ffd766" stroke="#8a6a1c" stroke-width="1"/>' +
'<circle cx="30" cy="27" r="3.6" fill="#fff"/><circle cx="30" cy="27" r="1.8" fill="#1d1200"/>' +
'<circle cx="30.8" cy="26.2" r=".8" fill="#fff"/>' +
'<path d="M24 33 Q29 35.5 34 34" stroke="#241a04" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
'</g>',

unknown:
'<circle cx="60" cy="30" r="18" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.4)" stroke-width="2"/>' +
'<text x="60" y="38" text-anchor="middle" font-size="22" font-weight="800" fill="#a7cfc9" font-family="sans-serif">?</text>'

};

var RARITY = {
  layang: 'umum', baronang: 'umum', cakalang: 'umum',
  kakap: 'sedang', kerapu: 'sedang', tenggiri: 'sedang', kuwe: 'sedang',
  tuna: 'langka', lobster: 'langka', legenda: 'legenda'
};

function esc(s){
  return String(s == null ? '' : s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* fishHTML(id, px, opts) -> string SVG.
   opts: {rarity, anim:false (matikan semua animasi), cls, label} */
function fishHTML(id, px, opts){
  opts = opts || {};
  var key = String(id || '').toLowerCase();
  var body = FISH[key] || FISH.unknown;
  var size = Math.max(16, parseInt(px, 10) || 64);
  var h = Math.round(size / 2);
  var rarity = opts.rarity || RARITY[key] || 'umum';
  var cls = 'jfish r-' + rarity + (opts.anim === false ? ' still' : ' swim') +
    (opts.cls ? ' ' + opts.cls : '');
  var label = esc(opts.label || key || 'ikan');
  return '<svg class="' + cls + '" width="' + size + '" height="' + h +
    '" viewBox="0 0 120 60" role="img" aria-label="' + label + '">' + body + '</svg>';
}

/* fishOrEmoji: bungkus aman — gagal render SVG -> kembalikan emoji. */
function fishOrEmoji(id, emoji, px, opts){
  try { return fishHTML(id, px, opts); }
  catch(e){ return emoji; }
}

window.JALAFISH = {
  html: fishHTML,
  art: fishOrEmoji,
  rarityOf: function(id){ return RARITY[String(id || '').toLowerCase()] || 'umum'; },
  ids: ['layang', 'baronang', 'cakalang', 'kakap', 'kerapu',
        'tenggiri', 'kuwe', 'tuna', 'lobster', 'legenda'],
  version: '1.0.0'
};

})();
