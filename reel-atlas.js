import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { matchOrgan } from "./organs-catalog.js";
import { MODELS } from "./assets.js";

/** Same study flow as the Astra / ivy_learns reel — heart first, then full body. */
const heartPart = {
  title: "Heart",
  trace: ["svc", "ra", "rv", "pt", "la", "lv", "aorta"],
  pins: [
    { id: "svc", name: "Superior vena cava", role: "The wide vein that returns used blood from the head, neck, and arms into the right atrium.", remember: "Vena cava means the hollow vein. Superior means the upper one.", vein: true, sx: 150, sy: 70 },
    { id: "aorta", name: "Aorta", role: "The body’s largest artery. It leaves the left ventricle, arches over, and carries oxygen-rich blood to the whole body.", remember: "If blood is leaving the left ventricle, the next stop is the aorta.", vein: false, sx: 250, sy: 108 },
    { id: "pt", name: "Pulmonary trunk", role: "Leaves the right ventricle and splits into the pulmonary arteries.", remember: "This is the one artery that carries oxygen-poor blood.", vein: true, sx: 96, sy: 132 },
    { id: "ra", name: "Right atrium", role: "Receives blood from both venae cavae.", remember: "Atrium means entrance hall.", vein: true, sx: 112, sy: 196 },
    { id: "rv", name: "Right ventricle", role: "Pumps blood to the lungs.", remember: "Right ventricle, lungs.", vein: true, sx: 128, sy: 280 },
    { id: "lv", name: "Left ventricle", role: "The thick chamber that forms the apex and pumps into the aorta.", remember: "The apex is mostly left ventricle.", vein: false, sx: 214, sy: 300 },
    { id: "la", name: "Left atrium", role: "Receives oxygen-rich blood from the pulmonary veins.", remember: "Pulmonary veins carry oxygen-rich blood.", vein: false, sx: 232, sy: 176 },
    { id: "lad", name: "Front coronary groove", role: "The anterior interventricular groove (LAD territory).", remember: "Coronary = heart’s own blood supply.", vein: false, sx: 168, sy: 250 }
  ]
};

const bodySystems = [
  { id: "heart", title: "Heart", organId: "heart" },
  { id: "lungs", title: "Lungs", organId: "lungs", soon: true },
  { id: "brain", title: "Brain", organId: "brain", soon: true },
  { id: "skeleton", title: "Skeleton", organId: "skeleton", soon: true },
  { id: "gut", title: "Digestion", organId: "digestion", soon: true }
];

const app = document.getElementById("app");
app.innerHTML = `
  <div id="view"></div>
  <div class="hud reel">
    <div class="topbar">
      <button type="button" class="back pill" id="back" hidden>Back to the body</button>
      <div class="title" id="title">Heart</div>
      <div class="brand"><b>Human Body Atlas</b><span id="hint">Drag to turn · Pinch to zoom</span></div>
    </div>
    <div id="pins"></div>
    <div class="callout pill-dark" id="callout" hidden></div>
    <section class="card reel-card show" id="card"></section>
    <div class="loading" id="loading"><div class="spin"></div><p id="loadtext">Loading heart…</p></div>
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

const state = { mode: "heart", selected: "lv", traceTimer: 0, drag: false, idle: 0, t: 0, bodyReady: false };
const anchors = [];
const organCenters = new Map();
const organMeshes = new Map();
bodySystems.forEach((s) => organMeshes.set(s.organId, []));

let bodyRoot = null;
let homeGroup = null;
let heartGroup = null;
let traceLine = null;
let camAnim = null;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
view.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#050506");

const camera = new THREE.PerspectiveCamera(30, 1, 0.02, 40);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.enablePan = false;
controls.rotateSpeed = 0.62;
controls.minDistance = 1.8;
controls.maxDistance = 5.5;

scene.add(new THREE.HemisphereLight("#fff5ee", "#180810", 0.75));
const key = new THREE.DirectionalLight("#fff8f2", 2.5);
key.position.set(1.8, 3.5, 4);
scene.add(key);
const rim = new THREE.DirectionalLight("#ffccc4", 1);
rim.position.set(-3, 1.5, -2);
scene.add(rim);
const fill = new THREE.DirectionalLight("#a8c4ff", 0.35);
fill.position.set(-1, 0.5, 3);
scene.add(fill);

function muscleMat(color = "#c43748") {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.32,
    metalness: 0.02,
    clearcoat: 0.62,
    clearcoatRoughness: 0.22,
    sheen: 0.55,
    sheenColor: new THREE.Color("#ffb8b8"),
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0
  });
}

function tube(points, radius, color) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 48, radius, 16, false), muscleMat(color));
}

function fitGroup(group, pad = 1.38) {
  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(camera.aspect, 0.25));
  const dist = Math.max(size.y / (2 * Math.tan(vFov / 2)), size.x / (2 * Math.tan(hFov / 2))) * pad;
  return { center, dist };
}

function flyCamera(group, pad = 1.38) {
  const fit = fitGroup(group, pad);
  camAnim = {
    t: 0,
    dur: 0.95,
    fromP: camera.position.clone(),
    toP: new THREE.Vector3(fit.center.x + fit.dist * 0.04, fit.center.y, fit.center.z + fit.dist),
    fromT: controls.target.clone(),
    toT: fit.center.clone()
  };
}

function addVessels(root) {
  root.add(tube([[-0.32, 0.52, 0.06], [-0.28, 0.82, 0.02], [-0.22, 1.05, 0]], 0.048, "#4a6eae"));
  root.add(tube([[0.08, 0.38, 0.04], [0.14, 0.72, 0], [0.38, 0.98, -0.06], [0.58, 0.72, -0.14], [0.62, 0.38, -0.2]], 0.058, "#d44a52"));
  root.add(tube([[-0.06, 0.32, 0.22], [-0.1, 0.58, 0.2], [0.04, 0.78, 0.06]], 0.045, "#e8a8b0"));
  root.add(tube([[0.04, 0.22, 0.38], [0.02, -0.08, 0.42], [0.14, -0.48, 0.28]], 0.014, "#6e1824"));
}

function prepareHeart(root) {
  root.traverse((node) => {
    if (!node.isMesh) return;
    const n = (node.name || "").toLowerCase();
    let color = "#c43748";
    if (n.includes("valve")) color = "#f2ddd0";
    else if (n.includes("atrium")) color = "#d05a68";
    else if (n.includes("left_ventricle")) color = "#9d2436";
    else if (n.includes("right_ventricle")) color = "#b13344";
    else if (n.includes("papillary")) { node.visible = false; return; }
    node.material = muscleMat(color);
    node.geometry.computeVertexNormals();
  });
  addVessels(root);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);
  root.scale.setScalar(2.35 / Math.max(size.x, size.y, size.z));
  root.rotation.y = Math.PI * 0.04;
}

function bodyMat(organId, name) {
  const isSkin = organId === "skin";
  const n = (name || "").toLowerCase();
  let color = "#b42a3a";
  if (isSkin) color = "#c9957a";
  else if (/lung|bronch|trachea/.test(n)) color = "#d97888";
  else if (/Allen|brain/.test(n)) color = "#c48474";
  else if (/vertebra|bone|femur|sternum/.test(n)) color = "#e8dfd0";
  else if (/liver|intestine|stomach/.test(n)) color = "#9d4a52";
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: isSkin ? 0.62 : 0.38,
    metalness: 0,
    clearcoat: isSkin ? 0.08 : 0.42,
    sheen: 0.4,
    sheenColor: new THREE.Color("#ffc8c8"),
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0,
    transparent: isSkin,
    opacity: isSkin ? 0.14 : 1
  });
}

function indexBody(root) {
  root.traverse((node) => {
    if (!node.isMesh) return;
    const chain = [];
    for (let p = node; p; p = p.parent) if (p.name) chain.push(p.name);
    let organId = "other";
    for (let i = chain.length - 1; i >= 0; i--) {
      const id = matchOrgan(chain[i]);
      if (id) { organId = id; break; }
    }
    node.userData.organId = organId;
    node.material = bodyMat(organId, node.name);
    node.geometry?.computeVertexNormals?.();
    if (organMeshes.has(organId)) organMeshes.get(organId).push(node);
  });
  for (const sys of bodySystems) {
    const list = organMeshes.get(sys.organId) || [];
    if (!list.length) continue;
    const box = new THREE.Box3();
    list.forEach((m) => box.expandByObject(m));
    organCenters.set(sys.id, box.getCenter(new THREE.Vector3()));
  }
}

function normalizeBody(root) {
  const box = new THREE.Box3().setFromObject(root);
  root.position.sub(box.getCenter(new THREE.Vector3()));
  root.scale.setScalar(1.72 / box.getSize(new THREE.Vector3()).y);
  root.updateMatrixWorld(true);
}

function styleBodyForHome() {
  if (!bodyRoot) return;
  bodyRoot.traverse((node) => {
    if (!node.isMesh) return;
    const id = node.userData.organId;
    if (id === "skin") {
      node.material.opacity = 0.12;
      node.material.transparent = true;
      node.material.depthWrite = false;
    } else if (id === "other") {
      node.material.opacity = 0.35;
      node.material.transparent = true;
    } else {
      node.material.opacity = 1;
      node.material.transparent = false;
    }
  });
}

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const scratch = new THREE.Vector3();

function pinOnSurface(sx, sy, root) {
  ndc.x = (sx / 360) * 2 - 1;
  ndc.y = -(sy / 460) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObject(root, true);
  if (hits[0]) return hits[0].point.clone();
  scratch.set((sx - 180) / 180, -(sy - 230) / 230, 0.35);
  return scratch;
}

function clearPins() {
  for (const a of anchors) a.anchor.remove();
  anchors.length = 0;
  pinsEl.innerHTML = "";
}

function buildHeartPins(root) {
  clearPins();
  for (const pin of heartPart.pins) {
    const anchor = new THREE.Object3D();
    anchor.position.copy(pinOnSurface(pin.sx, pin.sy, root));
    root.add(anchor);
    const btn = document.createElement("button");
    btn.className = "pin" + (pin.vein ? " vein" : "");
    btn.type = "button";
    btn.dataset.id = pin.id;
    btn.setAttribute("aria-label", pin.name);
    btn.addEventListener("click", () => choosePin(pin.id, true));
    pinsEl.append(btn);
    anchors.push({ anchor, button: btn, pin });
  }
}

function highlight() {
  if (!heartGroup) return;
  heartGroup.traverse((node) => {
    if (!node.isMesh) return;
    node.material.emissiveIntensity = 0.06;
    node.material.emissive.set(0x000000);
  });
}

function choosePin(id, tap = false) {
  state.selected = id;
  const pin = heartPart.pins.find((p) => p.id === id);
  callout.hidden = false;
  callout.textContent = pin.name;
  if (tap) callout.classList.add("pop");
  setTimeout(() => callout.classList.remove("pop"), 300);
  card.classList.remove("show");
  requestAnimationFrame(() => {
    card.innerHTML = `<h2>${pin.name}</h2><p>${pin.role}</p><p class="remember">${pin.remember}</p><div class="row"><button type="button" id="trace">Follow the blood</button><button type="button" id="next" class="ghost">Next</button></div>`;
    card.classList.add("show");
    card.querySelector("#trace").addEventListener("click", followBlood);
    card.querySelector("#next").addEventListener("click", () => {
      const i = heartPart.pins.findIndex((p) => p.id === id);
      choosePin(heartPart.pins[(i + 1) % heartPart.pins.length].id, true);
    });
  });
  pinsEl.querySelectorAll(".pin").forEach((el) => {
    el.classList.toggle("on", el.dataset.id === id);
    if (tap && el.dataset.id === id) {
      el.classList.add("tap");
      setTimeout(() => el.classList.remove("tap"), 380);
    }
  });
  highlight();
  if (tap) nudgeToPin(id);
}

function nudgeToPin(id) {
  const a = anchors.find((x) => x.pin.id === id);
  if (!a) return;
  a.anchor.getWorldPosition(scratch);
  camAnim = {
    t: 0,
    dur: 0.6,
    fromP: camera.position.clone(),
    toP: new THREE.Vector3(scratch.x + 0.1, scratch.y + 0.03, scratch.z + 0.32),
    fromT: controls.target.clone(),
    toT: scratch.clone()
  };
}

function updateTrace(step) {
  if (traceLine) {
    traceLine.parent?.remove(traceLine);
    traceLine.geometry.dispose();
    traceLine.material.dispose();
    traceLine = null;
  }
  if (step < 1) return;
  const pts = heartPart.trace.slice(0, step + 1).map((id) => {
    const a = anchors.find((x) => x.pin.id === id);
    const p = new THREE.Vector3();
    a.anchor.getWorldPosition(p);
    heartGroup.worldToLocal(p);
    return p;
  });
  if (pts.length < 2) return;
  traceLine = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.007, 8, false),
    new THREE.MeshBasicMaterial({ color: "#f5c542", transparent: true, opacity: 0.9 })
  );
  heartGroup.add(traceLine);
}

function followBlood() {
  clearInterval(state.traceTimer);
  let step = 0;
  choosePin(heartPart.trace[0], true);
  updateTrace(0);
  state.traceTimer = setInterval(() => {
    step += 1;
    if (step >= heartPart.trace.length) { clearInterval(state.traceTimer); return; }
    choosePin(heartPart.trace[step], true);
    updateTrace(step);
  }, 1300);
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

function buildHomeMarkers() {
  clearPins();
  const host = homeGroup;
  for (const sys of bodySystems) {
    const c = organCenters.get(sys.id);
    const anchor = new THREE.Object3D();
    if (c) anchor.position.copy(c);
    else anchor.position.set(sys.id === "heart" ? 0.05 : 0, 1.2, 0.15);
    host.add(anchor);
    const btn = document.createElement("button");
    btn.className = "pin body-pin" + (sys.soon ? " dim" : "");
    btn.type = "button";
    btn.dataset.system = sys.id;
    btn.setAttribute("aria-label", sys.title);
    btn.addEventListener("click", () => {
      if (sys.id === "heart") showHeart();
      else {
        card.innerHTML = `<h2>${sys.title}</h2><p>Same reel flow — open <strong>Heart</strong> for the full interactive 3D tour. More organs are next.</p>`;
        card.classList.add("show");
      }
    });
    pinsEl.append(btn);
    anchors.push({ anchor, button: btn, pin: { id: sys.id } });
  }
}

function showHome() {
  state.mode = "home";
  clearInterval(state.traceTimer);
  updateTrace(-1);
  if (heartGroup) heartGroup.visible = false;
  if (!state.bodyReady) {
    loadtext.textContent = "Loading full body…";
    loading.hidden = false;
    return;
  }
  loading.hidden = true;
  homeGroup.visible = true;
  styleBodyForHome();
  clearPins();
  backBtn.hidden = true;
  titleEl.textContent = "Human Body Atlas";
  hintEl.textContent = "Drag to turn · Pinch to zoom";
  card.innerHTML = `<h2>Human Body Atlas</h2><p>Tap <strong>Heart</strong> on the body — same as the reel: spin the organ, tap gold pins, read each part.</p><p class="remember">Free on phone, tablet, and PC.</p>`;
  card.classList.add("show");
  callout.hidden = true;
  buildHomeMarkers();
  flyCamera(homeGroup, 1.48);
}

function showHeart() {
  state.mode = "heart";
  if (homeGroup) homeGroup.visible = false;
  heartGroup.visible = true;
  backBtn.hidden = false;
  titleEl.textContent = "Heart";
  hintEl.textContent = "Drag to turn · Pinch to zoom";
  buildHeartPins(heartGroup);
  choosePin(state.selected || "lv");
  flyCamera(heartGroup, 1.32);
}

backBtn.addEventListener("click", showHome);

const loader = new GLTFLoader();
homeGroup = new THREE.Group();
homeGroup.visible = false;
scene.add(homeGroup);

heartGroup = new THREE.Group();
heartGroup.visible = false;
scene.add(heartGroup);

loader.load(
  MODELS.heart,
  (gltf) => {
    prepareHeart(gltf.scene);
    heartGroup.add(gltf.scene);
    loading.hidden = true;
    showHeart();
    choosePin("lv");
  },
  (xhr) => {
    if (xhr.total) loadtext.textContent = `Loading heart ${Math.round((100 * xhr.loaded) / xhr.total)}%…`;
  },
  () => { loadtext.textContent = "Could not load heart — check internet."; }
);

loader.load(
  MODELS.united,
  (gltf) => {
    bodyRoot = gltf.scene;
    homeGroup.add(bodyRoot);
    indexBody(bodyRoot);
    normalizeBody(bodyRoot);
    state.bodyReady = true;
    if (state.mode === "home") showHome();
    else if (!loading.hidden && loadtext.textContent.includes("body")) loading.hidden = true;
  },
  (xhr) => {
    if (xhr.total && state.mode === "home") loadtext.textContent = `Loading body ${Math.round((100 * xhr.loaded) / xhr.total)}%…`;
  },
  () => {}
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

renderer.domElement.addEventListener("pointerdown", () => { state.drag = true; state.idle = 0; });
renderer.domElement.addEventListener("pointerup", () => { state.drag = false; });

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
  const spin = state.mode === "heart" ? heartGroup : homeGroup;
  if (!state.drag && !camAnim && spin?.visible) {
    state.idle += 0.016;
    if (state.idle > 2.2) spin.rotation.y += 0.0018;
  }
  if (state.bodyReady && state.mode === "home" && homeGroup.visible) {
    const breath = 1 + Math.sin(state.t * 1.15) * 0.006;
    homeGroup.scale.set(1, breath, 1);
  }
  if (traceLine?.material) traceLine.material.opacity = 0.55 + Math.sin(state.t * 5) * 0.35;
  controls.update();
  if (state.mode === "heart" && heartGroup.visible) {
    for (const pin of heartPart.pins) {
      const a = anchors.find((x) => x.pin.id === pin.id);
      if (a) a.anchor.position.copy(pinOnSurface(pin.sx, pin.sy, heartGroup));
    }
  }
  placePins();
  renderer.render(scene, camera);
}
frame();
