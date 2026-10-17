import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { ORGANS, matchOrgan, organLayer } from "./organs-catalog.js";

const MODELS = {
  body: "models/optimized-body.glb",
  heart: "models/optimized-heart.glb",
  lungs: "models/optimized-lung.glb",
  digestion: "models/optimized-liver.glb"
};

export function createScene(host, handlers = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.02, 40);
  camera.position.set(0.15, 0.12, 2.35);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 0.35;
  controls.maxDistance = 4.2;
  controls.target.set(0, 0.05, 0);

  scene.add(new THREE.HemisphereLight("#e8fff4", "#1a1410", 1.05));
  const key = new THREE.DirectionalLight("#fff7ee", 2.1);
  key.position.set(1.6, 2.4, 2.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight("#9ad4c8", 0.7);
  rim.position.set(-2.2, 1.2, -1.4);
  scene.add(rim);

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);

  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const scratch = new THREE.Vector3();

  const organMeshes = new Map();
  ORGANS.forEach((o) => organMeshes.set(o.id, []));
  organMeshes.set("skin", []);
  organMeshes.set("other", []);

  const state = {
    ready: false,
    root: null,
    layers: Object.fromEntries(["skin", "muscle", "bone", "organ", "vessel", "nerve"].map((id) => [id, true])),
    isolated: null,
    explode: 0,
    spin: true,
    selected: null,
    drag: false
  };

  const rest = new Map();

  function classify(node) {
    const chain = [];
    for (let p = node; p; p = p.parent) if (p.name) chain.push(p.name);
    for (const name of chain) {
      const id = matchOrgan(name);
      if (id) return id;
    }
    return "other";
  }

  function tint(organId, name = "") {
    const n = name.toLowerCase();
    if (/valve/.test(n)) return "#f2ddd0";
    if (/atrium/.test(n)) return "#c45a68";
    if (/ventricle/.test(n)) return "#9d2436";
    if (/vein|vena/.test(n)) return "#5a7eb8";
    if (/aorta|artery/.test(n)) return "#c43848";
    const organ = ORGANS.find((o) => o.id === organId);
    if (organId === "skin") return "#c9a07c";
    return organ?.color || "#b86b68";
  }

  function applyMaterial(mesh, organId) {
    const skin = organId === "skin";
    mesh.material = new THREE.MeshStandardMaterial({
      color: tint(organId, mesh.name),
      roughness: skin ? 0.72 : 0.42,
      metalness: 0.02,
      transparent: skin,
      opacity: skin ? 0.16 : 1,
      depthWrite: !skin,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0
    });
  }

  function indexRoot(root) {
    organMeshes.forEach((list) => list.length = 0);
    rest.clear();
    root.traverse((node) => {
      if (!node.isMesh) return;
      const id = classify(node);
      node.userData.organId = id;
      node.userData.nodeName = node.name || "";
      applyMaterial(node, id);
      node.geometry?.computeVertexNormals?.();
      organMeshes.get(id)?.push(node);
      rest.set(node, node.position.clone());
    });
  }

  function layerOn(organId) {
    return state.layers[organLayer(organId)] !== false;
  }

  function refreshVisibility() {
    if (!state.root) return;
    state.root.traverse((node) => {
      if (!node.isMesh) return;
      const id = node.userData.organId;
      const isolated = state.isolated;
      node.visible = isolated ? id === isolated : layerOn(id);
    });
  }

  function fit(object, pad = 1.35) {
    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const dist = Math.max(size.y / (2 * Math.tan(vFov / 2)), size.x / (2 * Math.tan(vFov / 2))) * pad;
    camera.position.set(center.x + dist * 0.08, center.y, center.z + dist);
    controls.target.copy(center);
    controls.update();
  }

  function setCamera(view) {
    if (!state.root) return;
    const box = new THREE.Box3().setFromObject(state.root);
    const c = box.getCenter(new THREE.Vector3());
    const d = box.getSize(new THREE.Vector3()).length() * 0.85;
    if (view === "front") camera.position.set(c.x, c.y, c.z + d);
    if (view === "side") camera.position.set(c.x + d, c.y, c.z);
    if (view === "top") camera.position.set(c.x, c.y + d, c.z + 0.01);
    controls.target.copy(c);
  }

  function highlight(organId, pin) {
    state.selected = pin?.id || organId;
    for (const [id, list] of organMeshes) {
      for (const mesh of list) {
        const on = pin ? pin.match?.test(mesh.userData.nodeName || "") : id === organId;
        mesh.material.emissive.set(on ? 0xc2e9c3 : 0x000000);
        mesh.material.emissiveIntensity = on ? 0.55 : 0;
      }
    }
  }

  function isolate(organId) {
    state.isolated = organId;
    refreshVisibility();
    const list = organMeshes.get(organId) || [];
    if (list.length) {
      const g = new THREE.Group();
      list.forEach((m) => g.add(m.clone()));
      const box = new THREE.Box3();
      list.forEach((m) => box.expandByObject(m));
      const helper = new THREE.Object3D();
      helper.position.copy(box.getCenter(new THREE.Vector3()));
      fit({ traverse: (fn) => list.forEach(fn), isObject3D: true, ...{} } , 1.25);
      const dummy = new THREE.Box3().setFromPoints(list.map((m) => {
        const b = new THREE.Box3().setFromObject(m);
        return b.getCenter(new THREE.Vector3());
      }));
      if (!dummy.isEmpty()) {
        const size = dummy.getSize(new THREE.Vector3());
        const center = dummy.getCenter(new THREE.Vector3());
        const dist = Math.max(size.length(), 0.18) * 1.6;
        camera.position.set(center.x + dist * 0.1, center.y, center.z + dist);
        controls.target.copy(center);
      }
    }
  }

  function explode(amount) {
    state.explode = amount;
    if (!state.root) return;
    const origin = new THREE.Vector3();
    state.root.traverse((node) => {
      if (!node.isMesh || !rest.has(node)) return;
      const home = rest.get(node);
      if (!amount) {
        node.position.copy(home);
        return;
      }
      scratch.copy(home).sub(origin).normalize();
      node.position.copy(home).addScaledVector(scratch, amount * 0.18);
    });
  }

  async function loadBody(onProgress) {
    const gltf = await loader.loadAsync(MODELS.body, (xhr) => {
      if (xhr.total) onProgress?.(xhr.loaded / xhr.total);
    });
    if (state.root) state.root.removeFromParent();
    state.root = gltf.scene;
    scene.add(state.root);
    indexRoot(state.root);
    refreshVisibility();
    fit(state.root, 1.38);
    state.ready = true;
    handlers.onReady?.(state);
    return state.root;
  }

  async function loadDetail(organId, onProgress) {
    const url = MODELS[organId];
    if (!url) return null;
    const gltf = await loader.loadAsync(url, (xhr) => {
      if (xhr.total) onProgress?.(xhr.loaded / xhr.total);
    });
    const group = gltf.scene;
    group.traverse((node) => {
      if (!node.isMesh) return;
      node.userData.organId = organId;
      node.userData.nodeName = node.name || "";
      applyMaterial(node, organId);
    });
    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);
    group.scale.setScalar(0.42 / Math.max(size.y, 0.01));
    if (state.root) state.root.visible = false;
    scene.add(group);
    fit(group, 1.28);
    return group;
  }

  function restoreBody() {
    scene.children.filter((c) => c !== state.root && c.isObject3D && c.type === "Group" && c !== scene).forEach((g) => {
      if (g !== state.root && g.userData?.detail) g.removeFromParent();
    });
    if (state.root) {
      state.root.visible = true;
      state.isolated = null;
      refreshVisibility();
      fit(state.root, 1.38);
    }
  }

  function pick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    const meshes = [];
    state.root?.traverse((n) => { if (n.isMesh && n.visible) meshes.push(n); });
    const hit = raycaster.intersectObjects(meshes, false)[0];
    if (!hit) return null;
    return { organId: hit.object.userData.organId, mesh: hit.object, name: hit.object.userData.nodeName };
  }

  function labelPosition(organId) {
    const list = organMeshes.get(organId) || [];
    if (!list.length) return null;
    const box = new THREE.Box3();
    list.forEach((m) => box.expandByObject(m));
    const p = box.getCenter(scratch);
    p.project(camera);
    const w = host.clientWidth;
    const h = host.clientHeight;
    return { x: (p.x * 0.5 + 0.5) * w, y: (-p.y * 0.5 + 0.5) * h, behind: p.z > 1 };
  }

  function resize() {
    const w = host.clientWidth;
    const h = Math.max(host.clientHeight, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  renderer.domElement.addEventListener("pointerdown", () => { state.drag = false; });
  renderer.domElement.addEventListener("pointermove", (e) => { if (e.buttons) state.drag = true; });
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (state.drag) return;
    const hit = pick(e);
    if (hit && ORGANS.some((o) => o.id === hit.organId)) handlers.onSelect?.(hit);
  });

  function frame() {
    requestAnimationFrame(frame);
    const t = clock.getElapsedTime();
    if (state.root && state.spin && !state.drag && !state.isolated) state.root.rotation.y += 0.0022;
    for (const list of organMeshes.values()) {
      for (const mesh of list) {
        if (mesh.material?.emissiveIntensity > 0.2) {
          mesh.material.emissiveIntensity = 0.35 + Math.sin(t * 4) * 0.2;
        }
      }
    }
    controls.update();
    renderer.render(scene, camera);
  }
  frame();

  return {
    state,
    loadBody,
    loadDetail,
    restoreBody,
    isolate,
    explode,
    highlight,
    setCamera,
    refreshVisibility,
    labelPosition,
    setLayer(id, on) { state.layers[id] = on; if (!state.isolated) refreshVisibility(); },
    setSpin(on) { state.spin = on; },
    organCount(id) { return organMeshes.get(id)?.length || 0; }
  };
}
