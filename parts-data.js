export const order = ["heart", "lungs", "brain", "skeleton", "gut"];

export const parts = {
  heart: {
    title: "Heart",
    model: "heart.glb",
    kind: "gltf",
    intro: "Front view of the chest. The person’s right side is on your left.",
    traceLabel: "Follow the blood",
    trace: ["svc", "ra", "rv", "pt", "la", "lv", "aorta"],
    bodyPin: { x: 0.06, y: 1.22, z: 0.14 },
    pins: [
      { id: "svc", name: "Superior vena cava", role: "The wide vein that returns used blood from the head, neck, and arms into the right atrium.", remember: "Vena cava means the hollow vein. Superior means the upper one.", at: [-0.35, 0.55, 0.18], vein: true },
      { id: "aorta", name: "Aorta", role: "The body’s largest artery. It leaves the left ventricle and carries oxygen-rich blood to the whole body.", remember: "Blood leaving the left ventricle enters the aorta.", at: [0.22, 0.62, 0.05], vein: false },
      { id: "pt", name: "Pulmonary trunk", role: "Leaves the right ventricle and carries blood toward the lungs.", remember: "This artery carries oxygen-poor blood.", at: [-0.08, 0.48, 0.32], vein: true },
      { id: "ra", name: "Right atrium", role: "Receives blood from the venae cavae and passes it to the right ventricle.", remember: "Atrium means entrance hall.", at: [-0.38, 0.12, 0.38], vein: true },
      { id: "rv", name: "Right ventricle", role: "Pumps blood to the lungs. Its wall is thinner than the left ventricle.", remember: "Right ventricle, lungs.", at: [-0.32, -0.22, 0.42], vein: true },
      { id: "lv", name: "Left ventricle", role: "The thick chamber that forms the apex and pumps blood into the aorta.", remember: "The apex is mostly left ventricle.", at: [0.28, -0.38, 0.35], vein: false },
      { id: "la", name: "Left atrium", role: "Receives oxygen-rich blood from the pulmonary veins.", remember: "Pulmonary veins carry oxygen-rich blood.", at: [0.35, 0.18, 0.22], vein: false },
      { id: "mitral", name: "Mitral valve", role: "Between the left atrium and left ventricle.", remember: "Mitral is on the left.", at: [0.12, 0.02, 0.4], vein: false }
    ]
  },
  lungs: {
    title: "Lungs",
    model: "lung.glb",
    kind: "gltf",
    intro: "The right lung has three lobes. The left has two, leaving room for the heart.",
    traceLabel: "Follow the air",
    trace: ["trachea", "bronchi", "rlung", "llung", "diaphragm"],
    bodyPin: { x: 0, y: 1.18, z: 0.22 },
    pins: [
      { id: "trachea", name: "Trachea", role: "The windpipe. Air travels down before it splits into the bronchi.", remember: "Held open by C-shaped cartilage rings.", at: [0, 0.72, 0.08], vein: false },
      { id: "bronchi", name: "Bronchi", role: "The trachea divides into right and left main bronchi.", remember: "The right bronchus is wider and steeper.", at: [0, 0.45, 0.22], vein: false },
      { id: "rlung", name: "Right lung", role: "Three lobes: upper, middle, and lower.", remember: "Right lung, three lobes.", at: [-0.42, 0, 0.28], vein: true },
      { id: "llung", name: "Left lung", role: "Two lobes with a cardiac notch for the heart.", remember: "Left lung, two lobes.", at: [0.38, 0, 0.22], vein: false },
      { id: "diaphragm", name: "Diaphragm", role: "The muscle dome under the lungs. When it contracts, air is drawn in.", remember: "Breathing in is active muscular work.", at: [0, -0.55, 0.12], vein: false }
    ]
  },
  brain: {
    title: "Brain",
    kind: "svg",
    viewBox: "0 0 420 360",
    depth: 0.18,
    intro: "Left side of the brain. The front of the head is toward the left of the model.",
    bodyPin: { x: 0, y: 1.58, z: 0.08 },
    pins: [
      { id: "frontal", name: "Frontal lobe", role: "Plans movement and is involved in judgement, attention, and speech.", remember: "Front of the brain, front of behaviour.", at: [-0.35, 0.08, 0.12] },
      { id: "parietal", name: "Parietal lobe", role: "Touch, body position, and spatial sense.", remember: "Touch is mapped on the postcentral gyrus.", at: [0.05, 0.18, 0.08] },
      { id: "occipital", name: "Occipital lobe", role: "Visual processing at the back of the cerebrum.", remember: "Back of head injuries can disturb vision.", at: [0.38, 0.02, 0.02] },
      { id: "temporal", name: "Temporal lobe", role: "Hearing, memory, and language understanding.", remember: "The ears sit beside this lobe.", at: [0.12, -0.12, 0.14] },
      { id: "cerebellum", name: "Cerebellum", role: "Coordinates movement, balance, and timing.", remember: "Damage makes movement clumsy.", at: [0.32, -0.18, 0.06] },
      { id: "stem", name: "Brainstem", role: "Connects brain to spinal cord; breathing and heartbeat centres.", remember: "Midbrain, pons, medulla.", at: [-0.08, -0.22, 0.04] }
    ],
    svg: `<path fill="#c48474" d="M70 190 C70 100 140 48 230 48 C330 48 390 110 392 180 C394 240 360 250 340 236 C360 270 300 300 250 292 C210 286 190 250 170 250 C150 300 90 280 70 230 Z"/><path fill="#e7b5a6" d="M250 230 C300 210 346 230 340 268 C320 310 260 318 230 292 C250 270 246 248 250 230 Z"/><path fill="#d7a090" d="M168 248 C190 230 210 250 200 290 C170 320 130 300 128 268 C126 250 146 246 168 248 Z"/>`
  },
  skeleton: {
    title: "Skeleton",
    kind: "svg",
    viewBox: "0 0 360 480",
    depth: 0.12,
    intro: "Axial skeleton: skull, spine, ribs, and pelvis.",
    bodyPin: { x: 0, y: 1.05, z: 0.05 },
    pins: [
      { id: "skull", name: "Skull", role: "Protects the brain. Facial bones form jaws and orbits.", remember: "Foramen magnum is where the brainstem exits.", at: [0, 0.42, 0.02] },
      { id: "spine", name: "Vertebral column", role: "7 cervical, 12 thoracic, 5 lumbar, then sacrum and coccyx.", remember: "Breakfast, lunch, dinner: 7, 12, 5.", at: [0, 0, 0] },
      { id: "ribs", name: "Ribs", role: "Twelve pairs. Upper seven are true ribs.", remember: "Ribs 11 and 12 are floating.", at: [-0.22, 0.08, 0.06] },
      { id: "sternum", name: "Sternum", role: "Breastbone. The heart sits behind its lower part.", remember: "Manubrium, body, xiphoid.", at: [0, 0.12, 0.1] },
      { id: "pelvis", name: "Pelvis", role: "Transfers weight to the legs and protects pelvic organs.", remember: "Feel the iliac crest at the waist.", at: [0, -0.38, 0.02] }
    ],
    svg: `<ellipse cx="180" cy="62" rx="42" ry="48" fill="#efe6d6"/><path d="M180 112 v250" stroke="#efe6d6" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M180 150 C120 150 90 190 80 230 M180 150 C240 150 270 190 280 230" stroke="#efe6d6" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M100 168 h160 M112 190 h136 M124 212 h112" stroke="#efe6d6" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M130 360 C130 410 150 440 180 440 C210 440 230 410 230 360" stroke="#efe6d6" stroke-width="8" fill="none" stroke-linecap="round"/>`
  },
  gut: {
    title: "Digestion",
    model: "liver.glb",
    kind: "gltf-gut",
    intro: "Food path plus the liver, which handles bile and gut blood.",
    traceLabel: "Follow the food",
    trace: ["eso", "stomach", "liver", "bowel"],
    bodyPin: { x: 0.02, y: 0.88, z: 0.18 },
    pins: [
      { id: "eso", name: "Oesophagus", role: "Muscular tube from throat to stomach.", remember: "Passes through the diaphragm.", at: [0, 0.42, 0.08], vein: false },
      { id: "stomach", name: "Stomach", role: "Muscular bag under the left ribs. Churns food and starts protein digestion.", remember: "Stomach is on the person’s left.", at: [0.18, 0.05, 0.2], vein: false },
      { id: "liver", name: "Liver", role: "Under the right ribs. Makes bile and processes blood from the gut.", remember: "Liver right, stomach left.", at: [-0.2, 0.08, 0.18], vein: false },
      { id: "bowel", name: "Intestines", role: "Small intestine absorbs nutrients; large intestine absorbs water.", remember: "Small is longer; large is wider.", at: [0.05, -0.35, 0.12], vein: true }
    ]
  }
};

export const bodyOrgans = order.map((id) => ({
  id,
  title: parts[id].title,
  pin: parts[id].bodyPin
}));
