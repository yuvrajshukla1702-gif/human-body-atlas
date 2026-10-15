/** Model URLs — CDN works from any network; add ?local=1 to use files in /models on your PC. */
const local = new URLSearchParams(location.search).has("local");

export const MODELS = {
  united: local
    ? "models/united-female.glb"
    : "https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.10/assets/3d-vh-f-united.glb",
  heart: local
    ? "models/heart.glb"
    : "https://cdn.humanatlas.io/digital-objects/ref-organ/heart-female/v1.3/assets/3d-vh-f-heart.glb",
  lung: local
    ? "models/lung.glb"
    : "https://cdn.humanatlas.io/digital-objects/ref-organ/lung-female/v1.4/assets/3d-vh-f-lung.glb",
  liver: local
    ? "models/liver.glb"
    : "https://cdn.humanatlas.io/digital-objects/ref-organ/liver-female/v1.2/assets/3d-vh-f-liver.glb",
  pancreas: "https://cdn.humanatlas.io/digital-objects/ref-organ/pancreas-female/v1.2/assets/3d-vh-f-pancreas.glb",
  bladder: "https://cdn.humanatlas.io/digital-objects/ref-organ/urinary-bladder-female/v1.2/assets/3d-vh-f-urinary-bladder.glb"
};
