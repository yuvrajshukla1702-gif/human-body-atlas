# Anatomy assets

The optimized body, heart, lung, and liver files are derived from the existing Human Reference Atlas (HRA / HuBMAP) reference-organ GLBs in this project. Reference-organ models: Kristen Browne, Heidi Schlehlein, and the Human Reference Atlas contributors, with provenance described in the [HRA 3D Reference Object Library](https://humanatlas.io/3d-reference-library).

License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). The HRA team's [data publication](https://www.nature.com/articles/s41597-025-05183-6) describes the reference-organ distribution and confirms that HRA data are released under CC BY 4.0.

Source URLs recorded by the pre-existing project:

- Body: https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.10/assets/3d-vh-f-united.glb
- Heart: https://cdn.humanatlas.io/digital-objects/ref-organ/heart-female/v1.3/assets/3d-vh-f-heart.glb
- Lung: https://cdn.humanatlas.io/digital-objects/ref-organ/lung-female/v1.4/assets/3d-vh-f-lung.glb
- Liver: https://cdn.humanatlas.io/digital-objects/ref-organ/liver-female/v1.2/assets/3d-vh-f-liver.glb

Modifications for this atlas, 17 October 2026: duplicate vertices welded; geometry simplified with bounded mesh-relative error; area-weighted smooth surface normals regenerated; meshopt compression and quantization applied. Original node names, hierarchy, material assignments, model transforms, and anatomical metadata were retained. Additional internal nodes may be introduced by quantization. Rendered colors, transparency, labels, and illustrative motion are supplied by the viewer and are not physical measurements.

`anatomy-metadata.json` records the original GLB node labels, ontology references, hierarchy, and world-space bounds. `optimization-report.json` records source and output geometry counts and file sizes. The reproducible conversion script and dependency lockfile are in `.model-tools`.

This is a female reference-organ collection. It includes detailed organs and selected skeletal and muscular structures, rather than a complete dissection of every human structure. In particular, the source contains eye and knee muscles and a partial skeleton. The body model does not contain baked physiological animation. None of these optimized assets is derived from the separate, unverified `heart-detail.glb` file.

Keep this attribution with redistributed copies of the optimized model files. The HRA creators do not endorse this viewer.
