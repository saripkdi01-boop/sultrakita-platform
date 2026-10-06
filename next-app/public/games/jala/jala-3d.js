/* =========================================================
  JALA 3D — underwater scene ringan (Three.js)
  Prinsip: low-poly, material sederhana, pixel-ratio dibatasi.
  Dipanggil via window.JALA3D.init(container).
  Showcase: window.JALA3D.showCatch(nama, emoji, rarity, opts).
  opts opsional: {fishId, kg, nilai} — bila ada JALAFISH + CSS
  jala-visual.css, tampil versi sinematik; bila tidak, fallback
  ke kartu emoji ringan (kompatibel pemanggil lama).
  ========================================================= */
(function(){
'use strict';

var THREE_URL = 'https://unpkg.com/three@0.152.2/build/three.min.js';

var state = { inited: false, scene: null, renderer: null, camera: null,
              fishes: [], bubbles: null, rays: [], clock: 0 };

function loadThree(cb){
  if (window.THREE) return cb();
  var s = document.createElement('script');
  s.src = THREE_URL;
  s.onload = cb;
  s.onerror = function(){ console.warn('[JALA3D] Three.js gagal dimuat, 3D dinonaktifkan.'); };
  document.head.appendChild(s);
}

/* ---- ikan low-poly dari primitif ---- */
function makeFish(color, size){
  var g = new THREE.Group();
  var mat = new THREE.MeshLambertMaterial({ color: color });
  // badan: cone yang dipipihkan
  var body = new THREE.Mesh(new THREE.ConeGeometry(size*0.35, size*1.4, 6), mat);
  body.rotation.z = -Math.PI/2;
  body.scale.z = 0.55;
  g.add(body);
  // ekor
  var tail = new THREE.Mesh(new THREE.ConeGeometry(size*0.3, size*0.5, 4), mat);
  tail.position.x = size*0.9;
  tail.rotation.z = Math.PI/2;
  tail.scale.z = 0.3;
  g.add(tail);
  // sirip atas
  var fin = new THREE.Mesh(new THREE.ConeGeometry(size*0.18, size*0.4, 4), mat);
  fin.position.set(-size*0.1, size*0.35, 0);
  g.add(fin);
  g.userData = { tail: tail, phase: Math.random()*Math.PI*2,
                 speed: 0.3 + Math.random()*0.5,
                 radius: 6 + Math.random()*8,
                 yBase: -2 + Math.random()*5,
                 dir: Math.random() < 0.5 ? 1 : -1 };
  return g;
}

function init(container){
  if (state.inited) return;
  state.inited = true;

  loadThree(function(){
    var W = container.clientWidth || window.innerWidth;
    var H = container.clientHeight || window.innerHeight;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    // Batasi pixel ratio agar ringan di HP
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(W, H);
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;z-index:0;pointer-events:none;';
    container.insertBefore(renderer.domElement, container.firstChild);

    var scene = new THREE.Scene();
    // Kabut bawah laut
    scene.fog = new THREE.FogExp2(0x062a28, 0.028);

    var camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 100);
    camera.position.set(0, 1, 14);

    // Cahaya: ambient + directional (cahaya matahari dari atas)
    scene.add(new THREE.AmbientLight(0x88ccbb, 0.7));
    var sun = new THREE.DirectionalLight(0xfff2cc, 1.1);
    sun.position.set(3, 10, 4);
    scene.add(sun);

    // ---- sinar matahari (god rays) — plane transparan miring ----
    var rayMat = new THREE.MeshBasicMaterial({
      color: 0xfff6d8, transparent: true, opacity: 0.07,
      side: THREE.DoubleSide, depthWrite: false });
    for (var i = 0; i < 5; i++){
      var ray = new THREE.Mesh(new THREE.PlaneGeometry(1.5 + Math.random()*2, 30), rayMat);
      ray.position.set(-10 + i*5 + Math.random()*2, 6, -6 - Math.random()*4);
      ray.rotation.z = 0.35;
      scene.add(ray);
      state.rays.push({ mesh: ray, phase: Math.random()*Math.PI*2 });
    }

    // ---- gelembung (points) ----
    var bCount = 120;
    var bGeo = new THREE.BufferGeometry();
    var bPos = new Float32Array(bCount * 3);
    var bSpeed = new Float32Array(bCount);
    for (var b = 0; b < bCount; b++){
      bPos[b*3]   = (Math.random()-0.5) * 30;
      bPos[b*3+1] = (Math.random()-0.5) * 16;
      bPos[b*3+2] = -4 - Math.random()*10;
      bSpeed[b] = 0.5 + Math.random()*1.5;
    }
    bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
    var bMat = new THREE.PointsMaterial({
      color: 0xbfefff, size: 0.18, transparent: true, opacity: 0.55,
      depthWrite: false });
    var bubbles = new THREE.Points(bGeo, bMat);
    scene.add(bubbles);
    state.bubbles = { points: bubbles, speeds: bSpeed, count: bCount };

    // ---- ikan-ikan ----
    var palette = [0xff8c42, 0x4ecdc4, 0xffd166, 0x6a9f46, 0x7b9ff2, 0xf25c5c];
    for (var f = 0; f < 7; f++){
      var fish = makeFish(palette[f % palette.length], 0.7 + Math.random()*0.6);
      scene.add(fish);
      state.fishes.push(fish);
    }

    // ---- dasar laut sederhana ----
    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 30),
      new THREE.MeshLambertMaterial({ color: 0x0a4440 }));
    floor.rotation.x = -Math.PI/2;
    floor.position.y = -6;
    scene.add(floor);

    // karang sederhana (cone)
    var coralMat = new THREE.MeshLambertMaterial({ color: 0xd96a8b });
    var coralMat2 = new THREE.MeshLambertMaterial({ color: 0x4a9e8f });
    for (var c = 0; c < 8; c++){
      var h = 1 + Math.random()*2;
      var coral = new THREE.Mesh(
        new THREE.ConeGeometry(0.4 + Math.random()*0.4, h, 5),
        c % 2 ? coralMat : coralMat2);
      coral.position.set((Math.random()-0.5)*28, -6 + h/2, -5 - Math.random()*6);
      scene.add(coral);
    }

    state.scene = scene; state.renderer = renderer; state.camera = camera;

    window.addEventListener('resize', function(){
      var w = container.clientWidth || window.innerWidth;
      var h = container.clientHeight || window.innerHeight;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    requestAnimationFrame(tick);
  });
}

function tick(){
  requestAnimationFrame(tick);
  if (!state.scene) return;
  state.clock += 0.016;
  var t = state.clock;

  // ikan berenang melingkar + goyang ekor
  state.fishes.forEach(function(f){
    var u = f.userData;
    var a = t * u.speed * u.dir + u.phase;
    f.position.set(Math.cos(a) * u.radius, u.yBase + Math.sin(t*0.8 + u.phase)*0.5,
                   -4 + Math.sin(a*0.7)*3);
    f.rotation.y = -a + (u.dir > 0 ? 0 : Math.PI);
    // ekor bergoyang
    u.tail.rotation.y = Math.sin(t*8 + u.phase) * 0.5;
  });

  // gelembung naik
  var bp = state.bubbles.points.geometry.attributes.position;
  for (var i = 0; i < state.bubbles.count; i++){
    var y = bp.getY(i) + state.bubbles.speeds[i] * 0.016;
    if (y > 8) y = -8;
    bp.setY(i, y);
    bp.setX(i, bp.getX(i) + Math.sin(t*2 + i)*0.003);
  }
  bp.needsUpdate = true;

  // sinar bergoyang pelan
  state.rays.forEach(function(r){
    r.mesh.material.opacity = 0.05 + Math.sin(t*0.7 + r.phase)*0.025;
    r.mesh.rotation.z = 0.35 + Math.sin(t*0.4 + r.phase)*0.05;
  });

  // kamera bergoyang halus (efek bawah air)
  state.camera.position.x = Math.sin(t*0.2)*0.8;
  state.camera.position.y = 1 + Math.sin(t*0.3)*0.4;
  state.camera.lookAt(0, 0, -4);

  state.renderer.render(state.scene, state.camera);
}

/* ---- showcase 3D untuk momen tangkapan ----
   showCatch(nama, emoji, rarity, opts): overlay sinematik.
   Versi sinematik (bila JALAFISH + jala-visual.css ada):
   ikan SVG per-spesies + tilt-3D + efek per rarity + haptic.
   Fallback: kartu emoji ringan bila modul visual belum dimuat. */
function esc(s){
  return String(s == null ? '' : s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showCatchLegacy(nama, emoji, rarity){
  var old = document.getElementById('jala-3d-catch');
  if (old) old.remove();
  var ov = document.createElement('div');
  ov.id = 'jala-3d-catch';
  ov.style.cssText = 'position:fixed;inset:0;z-index:200;display:flex;' +
    'align-items:center;justify-content:center;background:rgba(4,30,28,.78);' +
    'padding:20px;';
  var card = document.createElement('div');
  card.style.cssText = 'text-align:center;background:#0e4a45;' +
    'border:1px solid rgba(255,215,102,.35);border-radius:20px;' +
    'padding:24px;max-width:320px;width:100%;';
  card.innerHTML =
    '<div style="font-size:96px">' + emoji + '</div>' +
    '<div style="margin-top:10px;font-size:22px;font-weight:800;color:#fff">' + esc(nama) + '</div>' +
    '<div style="margin-top:6px;font-size:13px;color:#ffd766;letter-spacing:3px;font-weight:800">' +
    esc(String(rarity || '').toUpperCase()) + '</div>' +
    '<button id="jlegacy-ok" style="margin-top:16px;width:100%;border:none;border-radius:14px;' +
    'padding:14px;font-size:16px;font-weight:800;cursor:pointer;' +
    'background:linear-gradient(135deg,#f5c542,#d9a91f);color:#3a2b00">Lanjut 🎣</button>';
  ov.appendChild(card);
  var tutup = function(){ if (ov.parentNode) ov.remove(); };
  card.querySelector('#jlegacy-ok').addEventListener('click', function(e){ e.stopPropagation(); tutup(); });
  ov.addEventListener('click', tutup);
  setTimeout(tutup, 6000);
  document.body.appendChild(ov);
}

function showCatch(nama, emoji, rarity, opts){
  opts = opts || {};
  rarity = String(rarity || 'umum').toLowerCase();
  if (['umum', 'sedang', 'langka', 'legenda'].indexOf(rarity) < 0) rarity = 'umum';
  if (!window.JALAFISH) { showCatchLegacy(nama, emoji, rarity); return; }

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){}

  var old = document.getElementById('jala-3d-catch');
  if (old) old.remove();

  var ov = document.createElement('div');
  ov.className = 'jcatch r-' + rarity;
  ov.id = 'jala-3d-catch';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-label', 'Tangkapan: ' + nama);

  var fish = window.JALAFISH.art(opts.fishId || '', emoji, 200);
  var sub = '';
  if (opts.kg != null) sub += '<b>' + esc(opts.kg) + ' kg</b>';
  if (opts.nilai) sub += (sub ? ' · ' : '') + '≈ ' + esc(opts.nilai);
  if (rarity === 'legenda') sub += '<div class="jlegenda-banner">👑 TANGKAPAN LEGENDA 👑</div>';
  else if (rarity === 'langka') sub = '<div class="jlegenda-banner" style="color:#67e8f9">✨ IKAN LANGKA! ✨</div>' + sub;

  ov.innerHTML =
    '<div class="jcatch-card">' +
    (rarity === 'langka' || rarity === 'legenda' ? '<div class="jray"></div>' : '') +
    '<div class="jcatch-fish">' + fish + '</div>' +
    '<div class="jcatch-name">' + esc(nama) + '</div>' +
    (sub ? '<div class="jcatch-sub">' + sub + '</div>' : '') +
    '<div class="jcatch-rarity r-' + rarity + '">' + esc(rarity.toUpperCase()) + '</div>' +
    '<button class="jcatch-btn" type="button">Lanjut 🎣</button>' +
    '<div class="jcatch-hint">Ketuk tombol atau area gelap untuk lanjut</div>' +
    '</div>';

  var card = ov.firstChild;
  var tutup = function(){ if (ov.parentNode) ov.remove(); };
  card.querySelector('.jcatch-btn').addEventListener('click', function(e){ e.stopPropagation(); tutup(); });
  ov.addEventListener('click', function(e){ if (e.target === ov) tutup(); });
  setTimeout(tutup, 6000);

  /* tilt-3D mengikuti sentuhan (maks 12 derajat) */
  if (!reduceMotion) {
    var raf = null, rx = 0, ry = 0, tx = 0, ty = 0;
    var render = function(){
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      card.style.transform = 'perspective(700px) rotateX(' + rx.toFixed(2) +
        'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      if (Math.abs(tx - rx) > 0.05 || Math.abs(ty - ry) > 0.05) raf = requestAnimationFrame(render);
      else raf = null;
    };
    var gerak = function(cx, cy){
      var r = card.getBoundingClientRect();
      var px = (cx - (r.left + r.width / 2)) / (r.width / 2);
      var py = (cy - (r.top + r.height / 2)) / (r.height / 2);
      px = Math.max(-1, Math.min(1, px)); py = Math.max(-1, Math.min(1, py));
      ty = px * 12; tx = -py * 12;
      if (!raf) raf = requestAnimationFrame(render);
    };
    var reset = function(){ tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(render); };
    ov.addEventListener('pointermove', function(e){ gerak(e.clientX, e.clientY); });
    ov.addEventListener('touchmove', function(e){
      if (e.touches && e.touches[0]) gerak(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    ov.addEventListener('pointerleave', reset);
    ov.addEventListener('touchend', reset);
  }

  /* efek partikel per rarity */
  if (!reduceMotion) {
    var i, el;
    var splashN = rarity === 'umum' ? 10 : rarity === 'sedang' ? 14 : 20;
    for (i = 0; i < splashN; i++){
      el = document.createElement('i');
      el.className = 'jsplash';
      el.style.left = (20 + Math.random() * 60) + '%';
      el.style.setProperty('--dx', Math.round((Math.random() - 0.5) * 160) + 'px');
      el.style.animationDelay = (Math.random() * 0.3) + 's';
      if (rarity === 'sedang') el.style.background = '#ffd766';
      if (rarity === 'legenda') el.style.background = ['#ffd766', '#fff3cf', '#ffb700'][i % 3];
      card.appendChild(el);
    }
    var rip = document.createElement('i');
    rip.className = 'jripple' + (rarity === 'umum' ? '' : ' gold');
    card.appendChild(rip);
    if (rarity === 'legenda') {
      var warna = ['#ffd766', '#fff3cf', '#ffb700', '#14b8a6', '#ffffff'];
      for (i = 0; i < 36; i++){
        el = document.createElement('i');
        el.className = 'jconfetti';
        el.style.left = (Math.random() * 100) + '%';
        el.style.background = warna[i % warna.length];
        el.style.animationDelay = (Math.random() * 0.8) + 's';
        card.appendChild(el);
      }
    }
  }

  /* haptic Telegram bila tersedia */
  try {
    if (window.JALA_HAPTIC) window.JALA_HAPTIC(rarity === 'legenda' ? 'success' : 'medium');
    else if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) {
      if (rarity === 'legenda') Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      else Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  } catch(e){}

  document.body.appendChild(ov);
}

window.JALA3D = { init: init, showCatch: showCatch };
})();
