import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ORGANS, LAYERS, matchOrgan, organLayer, allPins } from "./organs-catalog.js";
import { MODELS } from "./assets.js";
import { parts } from "./parts-data.js";

const PARTS_KEY = { digestion: "gut" };
function partPack(organId) {
  return parts[PARTS_KEY[organId] || organId];
}

const app = document.getElementById("app");
app.innerHTML = `
  <div id="view"></div>
  <div class="hud reel">
    <div class="topbar">
      <button type="button" class="back pill" id="back" hidden>Back to the body</button>
      <div class="title" id="title">Human Body Atlas</div>
      <div class="brand"><b>Human Body Atlas</b><span id="hint">Loading…</span></div>
    </div>
    <div class="layers" id="layers"></div>
    <div class="search">
      <input id="q" type="search" placeholder="Search any structure…" autocomplete="off">
      <div class="hits" id="hits"></div>
    </div>
    <div id="pins"></div>
    <div class="callout pill-dark" id="callout" hidden></div>
    <section class="card reel-card show" id="card"></section>
    <nav class="dock" id="dock"></nav>
    <div class="loading" id="loading"><div class="spin"></div><p id="loadtext">Loading 3D body…</p></div>
  </div>
`;

const view = app.querySelector("#view");
const pinsEl = app.querySelector("#pins");
const card = app.querySelector("#card");
const callout = app.querySelector("#callout");
const loading = app.querySelector("#loading");
const loadtext = app.querySelector("#loadtext");
const titleEl = app.querySelector("#title");
const hintEl = app.querySelector("#hint");
const backBtn = app.querySelector("#back");
const dock = app.querySelector("#dock");
const layersEl = app.querySelector("#layers");
const searchInput = app.querySelector("#q");
const hitsEl = app.querySelector("#hits");

dock.innerHTML = ORGANS.map((o) => `<button type="button" data-organ="${o.id}">${o.title}</button>`).join("");
layersEl.innerHTML = LAYERS.map((l) => `<button type="button" data-layer="${l.id}" class="on">${l.label}</button>`).join("");

const state = {
  ready: false,
  mode: "body",
  organ: null,
  selected: null,
  traceTimer: 0,
  traceStep: 0,
  drag: false,
  idle: 0,
  t: 0,
  layers: Object.fromEntries(LAYERS.map((l) => [l.id, true])),
  moved: false
};

const organMeshes = new Map();
ORGANS.forEach((o) => organMeshes.set(o.id, []));
organMeshes.set("skin", []);
organMeshes.set("other", []);

const organBoxes = new Map();
const organCenters = new Map();
const overlayCache = new Map();
const anchors = [];

let bodyRoot = null;
let detailRoot = null;
let traceLine = null;
let peel = { t: 1 };
let popIn = null;
let camAnim = null;

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.localClippingEnabled = true;
view.append(renderer.domElement);

try {
  const probe = document.createElement("canvas");
  if (!probe.getContext("webgl2") && !probe.getContext("webgl")) {
    loadtext.textContent = "WebGL is off — enable hardware acceleration in browser settings.";
  }
} catch {
  loadtext.textContent = "WebGL unavailable on this device.";
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#050506");

const camera = new THREE.PerspectiveCamera(28, 1, 0.02, 80);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.enablePan = false;
controls.rotateSpeed = 0.55;

scene.add(new THREE.HemisphereLight("#fff6ee", "#1a1018", 0.85));
const key = new THREE.DirectionalLight("#fff8f0", 2.3);
key.position.set(2.2, 4, 3.2);
scene.add(key);
const rim = new THREE.DirectionalLight("#ffb0a8", 0.85);
rim.position.set(-3, 2, -2);
scene.add(rim);
const fill = new THREE.DirectionalLight("#a8c4ff", 0.45);
fill.position.set(-1, 0.4, 3);
scene.add(fill);

const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 999);
const scratch = new THREE.Vector3();
const loader = new GLTFLoader();

function detailUrl(def) {
  return def.detailKey ? MODELS[def.detailKey] : null;
}

function partColor(name) {
  const n = (name || "").toLowerCase();
  if (/valve|mitral|tricuspid|aortic|pulmonary_valve/.test(n)) return "#f2ddd0";
  if (/atrium/.test(n)) return "#c45a68";
  if (/left_ventricle/.test(n)) return "#9d2436";
  if (/right_ventricle/.test(n)) return "#b13344";
  if (/vein|vena/.test(n)) return "#5a7eb8";
  if (/aorta|artery/.test(n)) return "#c43848";
  if (/lung|bronch|trachea/.test(n)) return "#d97888";
  if (/liver/.test(n)) return "#8d4a55";
  if (/Allen|brain/.test(n)) return "#c48474";
  if (/vertebra|bone|femur|sternum/.test(n)) return "#e8dfd0";
  return "#b42a3a";
}

function mat(organId, name) {
  const isSkin = organId === "skin";
  return new THREE.MeshStandardMaterial({
    color: partColor(name),
    roughness: isSkin ? 0.72 : 0.42,
    metalness: 0.02,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0,
    transparent: false,
    opacity: 1,
    clippingPlanes: [clipPlane]
  });
}

function classify(chain) {
  for (let i = chain.length - 1; i >= 0; i--) {
    const id = matchOrgan(chain[i]);
    if (id) return id;
  }
  return "other";
}

function indexModel(root) {
  root.traverse((node) => {
    if (!node.isMesh) return;
    const chain = [];
    for (let p = node; p; p = p.parent) if (p.name) chain.push(p.name);
    const organId = classify(chain);
    node.userData.organId = organId;
    node.userData.nodeName = node.name || "";
    node.material = mat(organId, node.name);
    node.geometry?.computeVertexNormals?.();
    organMeshes.get(organId)?.push(node);
  });
  for (const o of ORGANS) {
    const list = organMeshes.get(o.id);
    if (!list?.length) continue;
    const box = new THREE.Box3();
    list.forEach((m) => box.expandByObject(m));
    organCenters.set(o.id, box.getCenter(new THREE.Vector3()));
    organBoxes.set(o.id, box.clone());
  }
}

function normalizeRoot(root) {
  const box = new THREE.Box3().setFromObject(root);
  root.position.sub(box.getCenter(new THREE.Vector3()));
  root.scale.setScalar(1.72 / box.getSize(new THREE.Vector3()).y);
  root.updateMatrixWorld(true);
}

function fitBox(object, pad = 1.38) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(camera.aspect, 0.25));
  const dist = Math.max(size.y / (2 * Math.tan(vFov / 2)), size.x / (2 * Math.tan(hFov / 2))) * pad;
  return { center, dist };
}

function snapCamera(target, pad = 1.38) {
  const fit = fitBox(target, pad);
  camera.position.set(fit.center.x + fit.dist * 0.04, fit.center.y, fit.center.z + fit.dist);
  controls.target.copy(fit.center);
  controls.update();
}

function flyCamera(target, pad = 1.38) {
  const fit = fitBox(target, pad);
  camAnim = {
    t: 0,
    dur: 1,
    fromP: camera.position.clone(),
    toP: new THREE.Vector3(fit.center.x + fit.dist * 0.04, fit.center.y, fit.center.z + fit.dist),
    fromT: controls.target.clone(),
    toT: fit.center.clone()
  };
}

function buildPlaceholderBody() {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: "#c9957a", roughness: 0.7 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 18), skin);
  head.position.set(0, 1.58, 0);
  g.add(head);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.55, 8, 16), skin);
  torso.position.set(0, 1.12, 0);
  g.add(torso);
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.52, 6, 12), skin);
    leg.position.set(s * 0.11, 0.35, 0);
    g.add(leg);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.4, 6, 12), skin);
    arm.position.set(s * 0.31, 1.17, 0);
    arm.rotation.z = s * 0.35;
    g.add(arm);
  }
  scene.add(g);
  snapCamera(g, 1.55);
  return g;
}

function flyToOrgan(organId) {
  const box = new THREE.Box3();
  if (detailRoot?.visible) box.setFromObject(detailRoot);
  else (organMeshes.get(organId) || []).forEach((m) => box.expandByObject(m));
  const c = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(camera.aspect, 0.25));
  const dist = Math.max(size.y / (2 * Math.tan(vFov / 2)), size.x / (2 * Math.tan(hFov / 2)), 0.2) * 1.3;
  camAnim = {
    t: 0,
    dur: 1,
    fromP: camera.position.clone(),
    toP: new THREE.Vector3(c.x + dist * 0.05, c.y, c.z + dist),
    fromT: controls.target.clone(),
    toT: c.clone()
  };
}

function styleDetail(group, organId) {
  group.traverse((node) => {
    if (!node.isMesh) return;
    node.userData.organId = organId;
    node.userData.nodeName = node.name || "";
    const shell = /^VH_F_heart$/i.test(node.name);
    node.material = mat(organId, node.name);
    node.material.userData.shell = shell;
    node.geometry?.computeVertexNormals?.();
  });
}

function alignDetail(group, organId) {
  const box = organBoxes.get(organId) || new THREE.Box3();
  const cb = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const gb = new THREE.Box3().setFromObject(group);
  const gc = gb.getCenter(new THREE.Vector3());
  const gs = gb.getSize(new THREE.Vector3());
  group.position.sub(gc);
  const s = (Math.max(size.x, size.y, size.z) / Math.max(gs.x, gs.y, gs.z, 0.001)) * 0.98;
  group.scale.setScalar(s);
  group.userData.baseScale = s;
  group.position.add(cb);
}

async function ensureDetail(organId) {
  const def = ORGANS.find((o) => o.id === organId);
  const url = detailUrl(def);
  if (!url) return null;
  let group = overlayCache.get(organId);
  if (!group) {
    loadtext.textContent = `Loading inner ${def.title}…`;
    loading.hidden = false;
    try {
      const gltf = await loader.loadAsync(url);
      group = gltf.scene;
      styleDetail(group, organId);
      overlayCache.set(organId, group);
    } catch (e) {
      console.warn("Detail model failed", organId, e);
      loading.hidden = state.ready;
      return null;
    }
    loading.hidden = state.ready;
  }
  alignDetail(group, organId);
  if (!group.parent) bodyRoot.add(group);
  group.visible = false;
  return group;
}

function addHeartVessels(root) {
  const tube = (pts, r, c) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, r, 12, false), mat("heart", c)));
  };
  if (root.userData.vessels) return;
  tube([[-0.22, 0.38, 0.06], [-0.18, 0.72, 0.02], [-0.12, 0.98, 0]], 0.045, "#4a6eae");
  tube([[0.08, 0.28, 0.02], [0.14, 0.58, -0.02], [0.34, 0.82, -0.1], [0.52, 0.58, -0.18]], 0.055, "#c43848");
  tube([[-0.04, 0.22, 0.2], [0.02, 0.48, 0.16], [0.14, 0.62, 0.04]], 0.04, "#e7b4bc");
  root.userData.vessels = true;
}

function layerOn(organId) {
  return state.layers[organLayer(organId)] !== false;
}

function applyBodyView() {
  detailRoot = null;
  for (const g of overlayCache.values()) g.visible = false;
  bodyRoot.traverse((node) => {
    if (!node.isMesh) return;
    if ([...overlayCache.values()].some((g) => g === node || g.children?.includes?.(node))) return;
    const id = node.userData.organId;
    const on = layerOn(id);
    node.visible = on;
    if (!on) return;
    if (id === "skin") {
      node.material.opacity = 0.1;
      node.material.transparent = true;
      node.material.depthWrite = false;
      node.material.color.set("#d4a574");
    } else if (id === "other") {
      node.material.opacity = 0.45;
      node.material.transparent = true;
    } else {
      node.material.opacity = 1;
      node.material.transparent = false;
      node.material.emissiveIntensity = 0;
    }
  });
  clipPlane.constant = 999;
}

function applyOrganView(organId) {
  bodyRoot.traverse((node) => {
    if (!node.isMesh) return;
    if ([...overlayCache.values()].some((g) => g === node)) return;
    const id = node.userData.organId;
    if (!layerOn(id) && id !== organId) {
      node.visible = false;
    } else if (id === "skin") {
      node.visible = true;
      node.material.opacity = 0.035;
      node.material.transparent = true;
      node.material.depthWrite = false;
    } else if (id === organId && !detailUrl(ORGANS.find((o) => o.id === organId))) {
      node.visible = true;
      node.material.opacity = 1;
    } else if (id === organId) {
      node.visible = false;
    } else if (id === "other") {
      node.visible = false;
    } else {
      node.visible = true;
      node.material.opacity = 0.07;
      node.material.transparent = true;
      node.material.depthWrite = false;
    }
  });

  if (detailRoot) {
    detailRoot.visible = true;
    if (organId === "heart") addHeartVessels(detailRoot);
    detailRoot.traverse((node) => {
      if (!node.isMesh) return;
      const shell = node.material.userData.shell;
      node.visible = true;
      if (shell) {
        node.material.opacity = 0.15;
        node.material.transparent = true;
        node.material.depthWrite = false;
      } else {
        node.material.opacity = 1;
        node.material.transparent = false;
      }
    });
    peel = { t: 0, from: 1, to: 0.12 };
    popIn = { t: 0, obj: detailRoot, from: detailRoot.userData.baseScale * 0.86, to: detailRoot.userData.baseScale };
    const db = new THREE.Box3().setFromObject(detailRoot);
    const dc = db.getCenter(new THREE.Vector3());
    const n = new THREE.Vector3(0, 0, 1).applyQuaternion(detailRoot.getWorldQuaternion(new THREE.Quaternion()));
    clipPlane.normal.copy(n);
    clipPlane.constant = dc.dot(n) + db.getSize(new THREE.Vector3()).z * 0.12;
  }
}

function clearAnchors() {
  anchors.forEach((a) => a.anchor.remove());
  anchors.length = 0;
  pinsEl.innerHTML = "";
}

function activeMeshes() {
  const list = [];
  if (detailRoot?.visible) detailRoot.traverse((n) => { if (n.isMesh) list.push(n); });
  else if (state.organ) list.push(...(organMeshes.get(state.organ) || []));
  return list;
}

function findPinMesh(pin) {
  let best = null;
  for (const m of activeMeshes()) {
    const n = m.userData.nodeName || "";
    if (!pin.match?.test(n)) continue;
    const b = new THREE.Box3().setFromObject(m);
    const vol = b.getSize(new THREE.Vector3()).length();
    if (!best || vol < best.vol) best = { mesh: m, c: b.getCenter(new THREE.Vector3()), vol };
  }
  return best;
}

function buildBodyPins() {
  clearAnchors();
  for (const o of ORGANS) {
    if (!layerOn(o.id)) continue;
    const c = organCenters.get(o.id);
    if (!c) continue;
    const anchor = new THREE.Object3D();
    anchor.position.copy(c);
    bodyRoot.add(anchor);
    const btn = document.createElement("button");
    btn.className = "pin body-pin";
    btn.dataset.organ = o.id;
    btn.setAttribute("aria-label", o.title);
    btn.addEventListener("click", () => focusOrgan(o.id));
    pinsEl.append(btn);
    anchors.push({ anchor, button: btn, pin: null });
  }
}

function pinPosition(def, pin, center, hit) {
  if (hit?.c) return hit.c.clone();
  const pack = partPack(def.id);
  const fallback = pack?.pins?.find((p) => p.id === pin.id);
  if (fallback?.at) {
    return new THREE.Vector3(center.x + fallback.at[0], center.y + fallback.at[1], center.z + fallback.at[2]);
  }
  return center.clone();
}

function buildOrganPins(def) {
  clearAnchors();
  const center = (detailRoot ? new THREE.Box3().setFromObject(detailRoot) : organBoxes.get(def.id) || new THREE.Box3()).getCenter(new THREE.Vector3());
  for (const pin of def.pins) {
    const hit = findPinMesh(pin);
    const anchor = new THREE.Object3D();
    anchor.position.copy(pinPosition(def, pin, center, hit));
    bodyRoot.add(anchor);
    const btn = document.createElement("button");
    btn.className = "pin" + (pin.vein ? " vein" : "");
    btn.dataset.id = pin.id;
    btn.setAttribute("aria-label", pin.name);
    btn.addEventListener("click", () => choosePin(pin.id, true));
    pinsEl.append(btn);
    anchors.push({ anchor, button: btn, pin });
  }
}

function highlightPin(pinId) {
  const def = ORGANS.find((o) => o.id === state.organ);
  const pin = def?.pins.find((p) => p.id === pinId);
  for (const m of activeMeshes()) {
    const on = pin?.match?.test(m.userData.nodeName || "");
    m.material.emissive.set(on ? 0xf5c542 : 0x000000);
    m.material.emissiveIntensity = on ? 0.8 : m.material.opacity < 1 ? 0 : 0.06;
  }
}

function updateTrace(step) {
  if (traceLine) {
    traceLine.parent?.remove(traceLine);
    traceLine.geometry.dispose();
    traceLine.material.dispose();
    traceLine = null;
  }
  const def = ORGANS.find((o) => o.id === state.organ);
  if (!def?.trace || step < 1) return;
  const pts = [];
  for (const id of def.trace.slice(0, step + 1)) {
    const a = anchors.find((x) => x.pin?.id === id);
    if (!a) continue;
    const p = new THREE.Vector3();
    a.anchor.getWorldPosition(p);
    bodyRoot.worldToLocal(p);
    pts.push(p);
  }
  if (pts.length < 2) return;
  traceLine = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 56, 0.007, 8, false),
    new THREE.MeshBasicMaterial({ color: "#f5c542", transparent: true, opacity: 0.9 })
  );
  bodyRoot.add(traceLine);
}

function renderCard(pin, def) {
  const latin = pin.latin ? `<p class="latin">${pin.latin}</p>` : "";
  const clinical = pin.clinical ? `<p class="clinical">${pin.clinical}</p>` : "";
  const traceBtn = def.trace ? `<button type="button" id="trace">${def.traceLabel}</button>` : "";
  return `<p class="kicker">${def.subtitle || def.title}</p><h2>${pin.name}</h2>${latin}<p>${pin.role}</p>${clinical}<p class="remember">${pin.remember}</p><div class="row">${traceBtn}<button type="button" id="prev" class="ghost">Prev</button><button type="button" id="next" class="ghost">Next</button></div>`;
}

function choosePin(id, tap = false) {
  state.selected = id;
  const def = ORGANS.find((o) => o.id === state.organ);
  const pin = def.pins.find((p) => p.id === id);
  callout.hidden = false;
  callout.textContent = pin.name;
  if (tap) callout.classList.add("pop");
  setTimeout(() => callout.classList.remove("pop"), 280);
  card.classList.remove("show");
  requestAnimationFrame(() => {
    card.innerHTML = renderCard(pin, def);
    card.classList.add("show");
    if (def.trace) card.querySelector("#trace").addEventListener("click", followPath);
    card.querySelector("#prev").addEventListener("click", () => {
      const i = def.pins.findIndex((p) => p.id === id);
      choosePin(def.pins[(i - 1 + def.pins.length) % def.pins.length].id, true);
    });
    card.querySelector("#next").addEventListener("click", () => {
      const i = def.pins.findIndex((p) => p.id === id);
      choosePin(def.pins[(i + 1) % def.pins.length].id, true);
    });
  });
  pinsEl.querySelectorAll(".pin[data-id]").forEach((el) => {
    el.classList.toggle("on", el.dataset.id === id);
    if (tap && el.dataset.id === id) {
      el.classList.add("tap");
      setTimeout(() => el.classList.remove("tap"), 380);
    }
  });
  highlightPin(id);
  if (tap) {
    const a = anchors.find((x) => x.pin?.id === id);
    if (a) {
      a.anchor.getWorldPosition(scratch);
      camAnim = {
        t: 0,
        dur: 0.65,
        fromP: camera.position.clone(),
        toP: new THREE.Vector3(scratch.x + 0.12, scratch.y + 0.04, scratch.z + 0.3),
        fromT: controls.target.clone(),
        toT: scratch.clone()
      };
    }
  }
}

function followPath() {
  const def = ORGANS.find((o) => o.id === state.organ);
  if (!def?.trace) return;
  clearInterval(state.traceTimer);
  let step = 0;
  choosePin(def.trace[0], true);
  updateTrace(0);
  state.traceTimer = setInterval(() => {
    step += 1;
    if (step >= def.trace.length) { clearInterval(state.traceTimer); return; }
    choosePin(def.trace[step], true);
    updateTrace(step);
  }, 1350);
}

function showBodyCard() {
  const n = allPins().length;
  card.innerHTML = `<p class="kicker">15 systems · ${n} structures</p><h2>Human Body Atlas</h2><p>Spin the full 3D body. Peel <strong>Skin / Muscle / Bone / Organs</strong> like the reel. Tap a gold pin or search any structure — each card has function, a clinical pearl, and a memory hook.</p><p class="remember">Follow the blood, air, food, or urine on the highlighted path.</p>`;
  card.classList.add("show");
  callout.hidden = true;
}

async function focusOrgan(id) {
  if (!state.ready) return;
  clearInterval(state.traceTimer);
  updateTrace(-1);
  state.mode = "organ";
  state.organ = id;
  const def = ORGANS.find((o) => o.id === id);
  detailRoot = await ensureDetail(id);
  if (detailRoot) (organMeshes.get(id) || []).forEach((m) => { m.visible = false; });
  else peel = { t: 1 };
  applyOrganView(id);
  buildOrganPins(def);
  backBtn.hidden = false;
  titleEl.textContent = def.title;
  hintEl.textContent = "Drag to turn · Pinch to zoom";
  dock.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.organ === id));
  flyToOrgan(id);
  card.classList.remove("show");
  requestAnimationFrame(() => {
    card.innerHTML = `<p class="kicker">${def.subtitle || def.title}</p><h2>${def.title}</h2><p>${def.intro || "Tap a gold pin on the organ."}</p><p class="remember">${def.pins.length} labelled parts · ${def.trace ? def.traceLabel : "Swipe Next through each structure"}</p><div class="row">${def.trace ? `<button type="button" id="trace">${def.traceLabel}</button>` : ""}<button type="button" id="next" class="ghost">Start tour</button></div>`;
    card.classList.add("show");
    if (def.trace) card.querySelector("#trace")?.addEventListener("click", followPath);
    card.querySelector("#next").addEventListener("click", () => choosePin(def.pins[0].id, true));
  });
  callout.hidden = true;
}

function goBody() {
  if (!state.ready) return;
  clearInterval(state.traceTimer);
  updateTrace(-1);
  state.mode = "body";
  state.organ = null;
  applyBodyView();
  buildBodyPins();
  backBtn.hidden = true;
  titleEl.textContent = "Human Body Atlas";
  hintEl.textContent = "Tap a gold marker on the body";
  dock.querySelectorAll("button").forEach((b) => b.classList.remove("on"));
  showBodyCard();
  flyCamera(bodyRoot, 1.45);
}

function placePins() {
  const w = view.clientWidth;
  const h = view.clientHeight;
  for (const item of anchors) {
    item.anchor.getWorldPosition(scratch);
    scratch.project(camera);
    const x = (scratch.x * 0.5 + 0.5) * w;
    const y = (-scratch.y * 0.5 + 0.5) * h;
    const hide = scratch.z > 1;
    item.button.hidden = hide;
    item.button.style.left = `${x}px`;
    item.button.style.top = `${y}px`;
    if (item.pin?.id === state.selected) {
      callout.hidden = hide;
      callout.classList.toggle("flip", x > w * 0.58);
      callout.style.left = `${x}px`;
      callout.style.top = `${y}px`;
    }
  }
}

backBtn.addEventListener("click", goBody);
dock.addEventListener("click", (e) => {
  const b = e.target.closest("[data-organ]");
  if (b && state.ready) focusOrgan(b.dataset.organ);
});
layersEl.addEventListener("click", (e) => {
  const b = e.target.closest("[data-layer]");
  if (!b || !state.ready) return;
  const id = b.dataset.layer;
  state.layers[id] = !state.layers[id];
  b.classList.toggle("on", state.layers[id]);
  if (state.mode === "body") {
    applyBodyView();
    buildBodyPins();
  } else if (state.organ) applyOrganView(state.organ);
});

function hideHits() { hitsEl.classList.remove("show"); hitsEl.innerHTML = ""; }
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 2) { hideHits(); return; }
  const hits = allPins().filter((p) =>
    `${p.name} ${p.latin || ""} ${p.organTitle} ${p.role}`.toLowerCase().includes(q)
  ).slice(0, 8);
  hitsEl.innerHTML = hits.map((p) =>
    `<button type="button" data-organ="${p.organId}" data-pin="${p.id}"><b>${p.name}</b><small>${p.organTitle}</small></button>`
  ).join("") || `<button type="button">No match</button>`;
  hitsEl.classList.add("show");
});
hitsEl.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-organ]");
  if (!b) return;
  hideHits();
  searchInput.value = "";
  await focusOrgan(b.dataset.organ);
  if (b.dataset.pin) choosePin(b.dataset.pin, true);
});
document.addEventListener("pointerdown", (e) => {
  if (!e.target.closest(".search")) hideHits();
});

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
view.addEventListener("pointerdown", (e) => {
  state.moved = false;
  state.idle = 0;
  state._px = e.clientX;
  state._py = e.clientY;
});
renderer.domElement.addEventListener("pointerdown", () => { state.drag = true; state.idle = 0; });
renderer.domElement.addEventListener("pointermove", (e) => {
  if (state.drag && (Math.abs(e.clientX - (state._px || 0)) > 8 || Math.abs(e.clientY - (state._py || 0)) > 8)) state.moved = true;
});
renderer.domElement.addEventListener("pointerup", (e) => {
  const wasDrag = state.drag;
  state.drag = false;
  if (!state.ready || !wasDrag || state.moved) return;
  const r = renderer.domElement.getBoundingClientRect();
  ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const meshes = [];
  bodyRoot?.traverse((n) => { if (n.isMesh && n.visible) meshes.push(n); });
  const hit = raycaster.intersectObjects(meshes, false)[0];
  if (!hit) return;
  const id = hit.object.userData.organId;
  if (state.mode === "body" && ORGANS.some((o) => o.id === id)) focusOrgan(id);
  else if (state.mode === "organ" && state.organ) {
    const def = ORGANS.find((o) => o.id === state.organ);
    const pin = def.pins.find((p) => p.match.test(hit.object.userData.nodeName || ""));
    if (pin) choosePin(pin.id, true);
  }
});

const placeholder = buildPlaceholderBody();
loading.hidden = false;

loader.load(
  MODELS.united,
  (gltf) => {
    placeholder.visible = false;
    bodyRoot = gltf.scene;
    scene.add(bodyRoot);
    indexModel(bodyRoot);
    normalizeRoot(bodyRoot);
    applyBodyView();
    buildBodyPins();
    showBodyCard();
    state.ready = true;
    loading.hidden = true;
    hintEl.textContent = "Tap a gold marker on the body";
    snapCamera(bodyRoot, 1.45);
    flyCamera(bodyRoot, 1.45);
    const fit = fitBox(bodyRoot, 1.45);
    controls.minDistance = fit.dist * 0.35;
    controls.maxDistance = fit.dist * 2.2;
    for (const o of ORGANS.filter((x) => x.detailKey)) {
      const url = MODELS[o.detailKey];
      if (url) loader.loadAsync(url).then((g) => { styleDetail(g.scene, o.id); overlayCache.set(o.id, g.scene); }).catch(() => {});
    }
  },
  (xhr) => {
    if (xhr.total) loadtext.textContent = `Loading body ${Math.round((100 * xhr.loaded) / xhr.total)}%…`;
  },
  (err) => {
    loadtext.textContent = "Load failed — check internet or use ?local=1 on your PC.";
    console.error(err);
  }
);

function resize() {
  const w = view.clientWidth;
  const h = view.clientHeight;
  camera.aspect = w / Math.max(h, 1);
  renderer.setSize(w, h, false);
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();

function frame() {
  requestAnimationFrame(frame);
  state.t += 0.016;

  if (camAnim) {
    camAnim.t += 0.016 / camAnim.dur;
    const k = Math.min(camAnim.t, 1);
    const e = 1 - Math.pow(1 - k, 3);
    camera.position.lerpVectors(camAnim.fromP, camAnim.toP, e);
    controls.target.lerpVectors(camAnim.fromT, camAnim.toT, e);
    if (k >= 1) camAnim = null;
  }

  if (popIn?.obj) {
    popIn.t = Math.min(popIn.t + 0.016 / 0.75, 1);
    const k = 1 - Math.pow(1 - popIn.t, 3);
    popIn.obj.scale.setScalar(popIn.from + (popIn.to - popIn.from) * k);
    if (popIn.t >= 1) popIn = null;
  }

  if (detailRoot && peel.t < 1) {
    peel.t = Math.min(peel.t + 0.016 / 0.85, 1);
    const k = 1 - Math.pow(1 - peel.t, 2);
    const op = peel.from + (peel.to - peel.from) * k;
    detailRoot.traverse((node) => {
      if (node.isMesh && node.material.userData.shell) {
        node.material.opacity = op;
        node.material.transparent = true;
      }
    });
  }

  const spinTarget = state.ready && bodyRoot?.visible ? bodyRoot : placeholder?.visible ? placeholder : null;
  if (spinTarget && state.mode === "body" && !state.drag && !camAnim) {
    state.idle += 0.016;
    if (state.ready && bodyRoot) {
      const breath = 1 + Math.sin(state.t * 1.2) * 0.008;
      bodyRoot.scale.set(1, breath, 1);
    }
    if (state.idle > 2.5) spinTarget.rotation.y += 0.0018;
  }

  if (state.mode === "organ" && state.organ && !state.drag) {
    const pulse = 0.35 + Math.sin(state.t * 3.2) * 0.15;
    for (const m of activeMeshes()) {
      if (m.material.emissiveIntensity > 0.5) m.material.emissiveIntensity = pulse;
    }
  }

  if (traceLine?.material) traceLine.material.opacity = 0.5 + Math.sin(state.t * 5) * 0.4;

  controls.update();
  placePins();
  renderer.render(scene, camera);
}
frame();
