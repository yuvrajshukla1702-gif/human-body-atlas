/** Astra studio uses local optimized GLBs; CDN is the fallback. */
const local = !new URLSearchParams(location.search).has("cdn");

export const MODELS = {
  united: local ? "models/optimized-body.glb" : "https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.10/assets/3d-vh-f-united.glb",
  heart: local ? "models/optimized-heart.glb" : "https://cdn.humanatlas.io/digital-objects/ref-organ/heart-female/v1.3/assets/3d-vh-f-heart.glb",
  lung: local ? "models/optimized-lung.glb" : "https://cdn.humanatlas.io/digital-objects/ref-organ/lung-female/v1.4/assets/3d-vh-f-lung.glb",
  liver: local ? "models/optimized-liver.glb" : "https://cdn.humanatlas.io/digital-objects/ref-organ/liver-female/v1.2/assets/3d-vh-f-liver.glb",
  pancreas: "https://cdn.humanatlas.io/digital-objects/ref-organ/pancreas-female/v1.2/assets/3d-vh-f-pancreas.glb",
  bladder: "https://cdn.humanatlas.io/digital-objects/ref-organ/urinary-bladder-female/v1.2/assets/3d-vh-f-urinary-bladder.glb"
};
