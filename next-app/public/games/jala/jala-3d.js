/* =========================================================
   JALA 3D — underwater scene ringan (Three.js)
   Prinsip: low-poly, material sederhana, pixel-ratio dibatasi.
   Dipanggil via window.JALA3D.init(container).
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
   showCatch(emoji, nama): tampilkan overlay ikan berputar 3D.
   Versi ringan: pakai CSS 3D (tanpa WebGL) agar tidak berat. */
function showCatch(nama, emoji, rarity){
  var old = document.getElementById('jala-3d-catch');
  if (old) old.remove();

  var ov = document.createElement('div');
  ov.id = 'jala-3d-catch';
  ov.style.cssText = 'position:fixed;inset:0;z-index:200;display:flex;' +
    'align-items:center;justify-content:center;background:rgba(4,30,28,.72);' +
    'backdrop-filter:blur(3px);perspective:800px;';

  var card = document.createElement('div');
  card.style.cssText = 'text-align:center;transform-style:preserve-3d;' +
    'animation:jalaSpin 2.4s ease-in-out;';
  card.innerHTML =
    '<div style="font-size:110px;transform:translateZ(60px);' +
    'filter:drop-shadow(0 18px 24px rgba(0,0,0,.5));">' + emoji + '</div>' +
    '<div style="margin-top:14px;font-size:24px;font-weight:800;color:#fff">' + nama + '</div>' +
    '<div style="margin-top:6px;font-size:14px;color:#ffd766;letter-spacing:2px">' +
    rarity.toUpperCase() + '</div>' +
    '<div style="margin-top:18px;font-size:13px;color:#a7cfc9">Ketuk untuk lanjut</div>';

  var st = document.createElement('style');
  st.textContent = '@keyframes jalaSpin{' +
    '0%{transform:rotateY(-540deg) scale(.3);opacity:0}' +
    '60%{transform:rotateY(20deg) scale(1.08);opacity:1}' +
    '80%{transform:rotateY(-12deg) scale(1)}' +
    '100%{transform:rotateY(0) scale(1)}}';

  ov.appendChild(st); ov.appendChild(card);
  ov.addEventListener('click', function(){ ov.remove(); });
  setTimeout(function(){ if (ov.parentNode) ov.remove(); }, 5000);
  document.body.appendChild(ov);
}

window.JALA3D = { init: init, showCatch: showCatch };
})();
