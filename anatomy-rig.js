/** Immediate 3D body — always on screen while small organ GLBs stream in. */
export function buildAnatomy(THREE) {
  const root = new THREE.Group();
  const parts = {};

  function std(color, extra = {}) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.45,
      metalness: 0.04,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
      ...extra
    });
  }

  function add(mesh, organId, name, parent = root) {
    mesh.userData.organId = organId;
    mesh.userData.nodeName = name;
    mesh.castShadow = false;
    parent.add(mesh);
    if (!parts[organId]) parts[organId] = [];
    parts[organId].push(mesh);
    return mesh;
  }

  const skinMat = std("#d4a07a", { transparent: true, opacity: 0.13, depthWrite: false });
  const head = add(new THREE.Mesh(new THREE.SphereGeometry(0.145, 28, 22), skinMat), "skin", "VH_F_skin");
  head.position.set(0, 1.62, 0);
  const neck = add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 14), skinMat), "skin", "VH_F_skin");
  neck.position.set(0, 1.46, 0);
  const torso = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.52, 10, 20), skinMat), "skin", "VH_F_skin");
  torso.position.set(0, 1.1, 0);
  torso.userData.breath = true;
  const pelvisSkin = add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), skinMat), "skin", "VH_F_skin");
  pelvisSkin.position.set(0, 0.76, 0);
  pelvisSkin.scale.set(1.15, 0.7, 0.9);

  for (const s of [-1, 1]) {
    const arm = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.46, 8, 12), skinMat), "muscles", "deltoid");
    arm.position.set(s * 0.34, 1.18, 0);
    arm.rotation.z = s * 0.38;
    const leg = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.58, 8, 12), skinMat), "skeleton", "femur");
    leg.position.set(s * 0.11, 0.32, 0);
    const glute = add(new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 12), std("#8f3d45")), "muscles", "gluteus");
    glute.position.set(s * 0.1, 0.7, -0.04);
  }

  const brain = add(new THREE.Mesh(new THREE.SphereGeometry(0.11, 22, 18), std("#c48474")), "brain", "Allen_frontal");
  brain.position.set(0, 1.63, 0.01);
  brain.scale.set(1.05, 0.9, 1.15);
  const cere = add(new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 12), std("#b07068")), "brain", "cerebellum");
  cere.position.set(0, 1.52, -0.08);
  const stem = add(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.08, 10), std("#a86860")), "brain", "brainstem");
  stem.position.set(0, 1.48, -0.02);

  const skull = add(new THREE.Mesh(new THREE.SphereGeometry(0.128, 20, 16), std("#efe6d6", { transparent: true, opacity: 0.35 })), "skeleton", "skull");
  skull.position.set(0, 1.62, 0);

  for (let i = 0; i < 16; i++) {
    const v = add(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.028, 0.05), std("#e8dfd0")), "skeleton", "vertebra");
    v.position.set(0, 1.38 - i * 0.042, -0.06);
  }
  const sternum = add(new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.22, 0.02), std("#efe6d6")), "skeleton", "sternum");
  sternum.position.set(0, 1.18, 0.16);
  for (let i = 0; i < 6; i++) {
    for (const s of [-1, 1]) {
      const rib = add(new THREE.Mesh(new THREE.TorusGeometry(0.18 + i * 0.012, 0.008, 6, 14, Math.PI * 0.7), std("#efe6d6")), "skeleton", "rib");
      rib.position.set(0, 1.32 - i * 0.045, 0.02);
      rib.rotation.set(0.15, s > 0 ? Math.PI : 0, s * 0.15);
    }
  }
  const pelvis = add(new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 8, 18, Math.PI), std("#e8dfd0")), "skeleton", "ilium");
  pelvis.position.set(0, 0.78, 0);
  pelvis.rotation.x = Math.PI / 2;

  const cord = add(new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.7, 10), std("#e8c8c0")), "spinal", "spinal_cord");
  cord.position.set(0, 1.08, -0.055);

  const heart = add(new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 16), std("#b42a3a")), "heart", "VH_F_left_ventricle");
  heart.position.set(0.04, 1.2, 0.08);
  heart.scale.set(0.95, 1.15, 0.85);
  heart.userData.beat = true;
  const ra = add(new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), std("#c45a68")), "heart", "right_atrium");
  ra.position.set(-0.03, 1.26, 0.1);

  for (const s of [-1, 1]) {
    const lung = add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 14), std(s < 0 ? "#d07080" : "#c86878")), "lungs", s < 0 ? "right_lung" : "left_lung");
    lung.position.set(s * 0.13, 1.18, 0.02);
    lung.scale.set(0.85, 1.25, 0.7);
    lung.userData.breath = true;
  }
  const trachea = add(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.16, 10), std("#e0b0b0")), "lungs", "trachea");
  trachea.position.set(0, 1.36, 0.06);

  const liver = add(new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), std("#8d4a55")), "digestion", "liver");
  liver.position.set(-0.08, 0.96, 0.08);
  liver.scale.set(1.3, 0.7, 0.9);
  const stomach = add(new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 12), std("#c07070")), "digestion", "stomach");
  stomach.position.set(0.08, 0.94, 0.1);
  stomach.scale.set(1.1, 0.75, 0.85);
  const bowel = add(new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.028, 8, 18), std("#9d4a52")), "digestion", "intestine");
  bowel.position.set(0.02, 0.82, 0.08);
  bowel.rotation.x = 0.8;

  for (const s of [-1, 1]) {
    const k = add(new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), std("#8b4048")), "kidneys", "kidney");
    k.position.set(s * 0.1, 0.92, -0.04);
    k.scale.set(0.7, 1.15, 0.6);
  }
  const bladder = add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), std("#7a4a58")), "kidneys", "bladder");
  bladder.position.set(0, 0.7, 0.1);

  const aorta = add(new THREE.Mesh(new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 1.14, 0.08),
      new THREE.Vector3(0.08, 1.3, 0.04),
      new THREE.Vector3(0.02, 1.34, -0.02),
      new THREE.Vector3(0.02, 0.85, -0.02)
    ]), 28, 0.016, 8, false
  ), std("#c43848")), "vessels", "aorta");
  const svc = add(new THREE.Mesh(new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 1.42, 0.04),
      new THREE.Vector3(-0.04, 1.28, 0.08),
      new THREE.Vector3(-0.02, 1.22, 0.1)
    ]), 16, 0.014, 8, false
  ), std("#5a7eb8")), "vessels", "superior_vena");

  const eyeL = add(new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), std("#d8a898")), "eyes", "cornea");
  eyeL.position.set(-0.045, 1.64, 0.12);
  const eyeR = add(new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), std("#d8a898")), "eyes", "cornea");
  eyeR.position.set(0.045, 1.64, 0.12);

  const breastL = add(new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), std("#c87888")), "breast", "mammary");
  breastL.position.set(-0.1, 1.22, 0.16);
  const breastR = add(new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), std("#c87888")), "breast", "mammary");
  breastR.position.set(0.1, 1.22, 0.16);

  const uterus = add(new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), std("#c96a78")), "reproductive", "uterus");
  uterus.position.set(0, 0.74, 0.06);
  uterus.scale.set(0.85, 1.2, 0.7);
  for (const s of [-1, 1]) {
    const ov = add(new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), std("#d08090")), "reproductive", "ovary");
    ov.position.set(s * 0.07, 0.75, 0.05);
  }

  const spleen = add(new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), std("#a05060")), "lymph", "spleen");
  spleen.position.set(0.14, 0.98, 0.02);
  spleen.scale.set(0.7, 1.1, 0.6);

  const pancreas = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.12, 6, 8), std("#c4a070")), "endocrine", "pancreas");
  pancreas.position.set(0.02, 0.9, 0.02);
  pancreas.rotation.z = 0.4;
  const thymus = add(new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), std("#c4a070")), "endocrine", "thymus");
  thymus.position.set(0, 1.32, 0.1);

  root.userData.parts = parts;
  return root;
}

export function implant(THREE, host, organId, scene, targetSize = 0.16) {
  if (!scene || !host) return;
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  scene.position.sub(center);
  const s = targetSize / Math.max(size.x, size.y, size.z, 0.001);
  scene.scale.setScalar(s);
  scene.userData.baseScale = s;
  scene.userData.beat = organId === "heart";
  scene.userData.breath = organId === "lungs";
  const sockets = {
    heart: [0.04, 1.2, 0.08],
    lungs: [0, 1.18, 0.03],
    liver: [-0.08, 0.96, 0.08],
    pancreas: [0.02, 0.9, 0.02],
    bladder: [0, 0.7, 0.1]
  };
  const at = sockets[organId] || [0, 1, 0];
  scene.position.add(new THREE.Vector3(...at));
  scene.traverse((n) => {
    if (!n.isMesh) return;
    n.userData.organId = organId;
    n.userData.nodeName = n.name || organId;
  });
  (host.userData.parts?.[organId] || []).forEach((m) => {
    m.visible = false;
    m.userData.replaced = true;
  });
  scene.userData.implanted = true;
  host.add(scene);
  return scene;
}
