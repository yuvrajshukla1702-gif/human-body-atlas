/** HuBMAP reference — organ groups + inner-part pin definitions (CC BY 4.0). */
export const ORGANS = [
  {
    id: "heart",
    title: "Heart",
    detailKey: "heart",
    patterns: [/VH_F_heart/i, /cardiac_(chamber|atrium|ventricle)/i, /interventricular_septum/i, /papillary_muscle_of_heart/i, /aortic_valve|mitral_valve|tricuspid_valve|pulmonary_valve/i, /blood_vasculature_of_heart/i, /arteries_of_heart/i, /veins_of_heart/i, /cardiac_vein/i],
    color: "#b42a3a",
    trace: ["svc", "ra", "tricuspid", "rv", "pulmonary", "la", "mitral", "lv", "aortic"],
    traceLabel: "Follow the blood",
    pins: [
      { id: "svc", name: "Superior vena cava", match: /vena_cava|superior_vena/i, role: "Returns used blood from the upper body to the right atrium.", remember: "Superior = upper.", vein: true },
      { id: "aortic", name: "Aorta", match: /aortic(?!_valve)|ascending_aorta|aorta/i, role: "Largest artery — blood to the body.", remember: "Leaves the left ventricle.", vein: false },
      { id: "pulmonary", name: "Pulmonary trunk", match: /pulmonary(?!_valve)|pulmonary_trunk/i, role: "Right ventricle to the lungs.", remember: "Only artery with oxygen-poor blood.", vein: true },
      { id: "ra", name: "Right atrium", match: /right_cardiac_atrium|right_atrium/i, role: "Receives venae cavae blood.", remember: "Entrance hall.", vein: true },
      { id: "tricuspid", name: "Tricuspid valve", match: /tricuspid/i, role: "Right atrium → right ventricle.", remember: "Three cusps.", vein: true },
      { id: "rv", name: "Right ventricle", match: /right_ventricle/i, role: "Pumps to the lungs.", remember: "Thinner wall.", vein: true },
      { id: "la", name: "Left atrium", match: /left_cardiac_atrium|left_atrium/i, role: "Receives blood from lungs.", remember: "Pulmonary veins.", vein: false },
      { id: "mitral", name: "Mitral valve", match: /mitral/i, role: "Left atrium → left ventricle.", remember: "Two cusps.", vein: false },
      { id: "lv", name: "Left ventricle", match: /left_ventricle/i, role: "Pumps into the aorta.", remember: "Thickest wall.", vein: false }
    ]
  },
  {
    id: "lungs",
    title: "Lungs",
    detailKey: "lung",
    patterns: [/VH_F_lungs/i, /VH_F_.*lung/i, /trachea/i, /bronch/i, /respiratory_system/i],
    exclude: [/impression/i],
    color: "#d07080",
    trace: ["trachea", "bronchi", "rlung", "llung"],
    traceLabel: "Follow the air",
    pins: [
      { id: "trachea", name: "Trachea", match: /trachea/i, role: "Windpipe.", remember: "Cartilage rings.", vein: false },
      { id: "bronchi", name: "Bronchi", match: /bronch/i, role: "Split to each lung.", remember: "Right is steeper.", vein: false },
      { id: "rlung", name: "Right lung", match: /right.*lung|_R$/i, role: "Three lobes.", remember: "Right = three.", vein: true },
      { id: "llung", name: "Left lung", match: /left.*lung|_L$/i, role: "Two lobes.", remember: "Cardiac notch.", vein: false }
    ]
  },
  {
    id: "brain",
    title: "Brain",
    patterns: [/^Allen_/i],
    color: "#c48474",
    pins: [
      { id: "frontal", name: "Frontal lobe", match: /frontal/i, role: "Planning and voluntary movement.", remember: "Front of behaviour.", vein: false },
      { id: "temporal", name: "Temporal lobe", match: /temporal/i, role: "Hearing and memory.", remember: "Beside the ears.", vein: false },
      { id: "cerebellum", name: "Cerebellum", match: /cerebellum/i, role: "Balance and coordination.", remember: "Clumsy if damaged.", vein: true },
      { id: "stem", name: "Brainstem", match: /brainstem|midbrain|pons|medulla/i, role: "Breathing and heartbeat.", remember: "Midbrain → medulla.", vein: true }
    ]
  },
  {
    id: "skeleton",
    title: "Skeleton",
    patterns: [/vertebra/i, /VH_F_femur/i, /VH_F_sternum/i, /VH_F_sacrum/i, /VH_F_ilium/i, /compact_bone/i, /trabecular/i, /VH_F_vertebral_column/i],
    color: "#e8dfd0",
    pins: [
      { id: "spine", name: "Vertebral column", match: /vertebra|vertebral_column/i, role: "Protects the spinal cord.", remember: "7-12-5.", vein: false },
      { id: "sternum", name: "Sternum", match: /sternum/i, role: "Breastbone.", remember: "Heart sits behind it.", vein: false },
      { id: "pelvis", name: "Pelvis", match: /ilium|sacrum|pelvis/i, role: "Hip ring.", remember: "Iliac crest.", vein: true }
    ]
  },
  {
    id: "digestion",
    title: "Digestion",
    detailKey: "liver",
    patterns: [/digestive_system/i, /colon/i, /small_intestine/i, /VH_F_liver/i, /pancreas/i, /spleen/i, /gallbladder/i, /duodenum/i],
    exclude: [/impression/i, /esophageal_impression/i],
    color: "#9d4a52",
    trace: ["liver", "stomach", "bowel"],
    traceLabel: "Follow the food",
    pins: [
      { id: "liver", name: "Liver", match: /liver/i, role: "Bile and blood processing.", remember: "Right upper abdomen.", vein: false },
      { id: "stomach", name: "Stomach", match: /stomach|gastric/i, role: "Churns food.", remember: "Person’s left.", vein: false },
      { id: "bowel", name: "Intestines", match: /intestine|colon|duodenum/i, role: "Absorption.", remember: "Small vs large.", vein: true }
    ]
  },
  {
    id: "kidneys",
    title: "Kidneys",
    patterns: [/VH_F_kidney/i, /renal_pelvis/i, /ureter/i],
    exclude: [/adrenal/i],
    color: "#8b4048",
    pins: [
      { id: "kidney", name: "Kidney", match: /kidney/i, role: "Filters blood.", remember: "Left sits higher.", vein: true },
      { id: "ureter", name: "Ureter", match: /ureter/i, role: "Urine to bladder.", remember: "Not urethra.", vein: false }
    ]
  },
  {
    id: "vessels",
    title: "Blood vessels",
    patterns: [/VH_F_aorta/i, /vena_cava/i, /arteries_of/i, /veins_of/i, /blood_vasculature/i, /pulmonary_artery/i, /pulmonary_vein/i],
    color: "#c43848",
    pins: [
      { id: "aorta", name: "Aorta", match: /aorta/i, role: "Main artery.", remember: "Ascends and arches.", vein: false },
      { id: "svc", name: "Superior vena cava", match: /superior_vena|vena_cava/i, role: "Upper body return.", remember: "Right atrium.", vein: true }
    ]
  },
  {
    id: "muscles",
    title: "Muscles",
    patterns: [/VH_F_muscles_of/i, /skeletal_muscle/i, /rectus/i, /oblique/i, /deltoid/i, /gluteus/i],
    exclude: [/ciliary_muscle/i, /conjunctiva/i, /vitreous/i],
    color: "#8f3d45",
    pins: [{ id: "muscle", name: "Skeletal muscle", match: /muscle/i, role: "Moves bones.", remember: "Tendons attach.", vein: false }]
  },
  {
    id: "eyes",
    title: "Eyes",
    patterns: [/conjunctiva/i, /vitreous/i, /optic_/i, /cornea/i, /ciliary/i, /macula/i, /choroid/i, /ocular/i, /palpebral/i],
    color: "#d8a898",
    pins: [{ id: "eye", name: "Eye", match: /optic|retina|cornea|vitreous/i, role: "Vision.", remember: "Cornea + lens.", vein: false }]
  },
  {
    id: "breast",
    title: "Breast",
    patterns: [/mammary/i, /lactiferous/i, /areolar/i],
    color: "#c87888",
    pins: [{ id: "breast", name: "Mammary tissue", match: /mammary|lactiferous/i, role: "Milk production.", remember: "Lactiferous ducts.", vein: false }]
  },
  {
    id: "reproductive",
    title: "Reproductive",
    patterns: [/uter/i, /ovary/i, /uterine_tube/i],
    color: "#c96a78",
    pins: [
      { id: "uterus", name: "Uterus", match: /uterus/i, role: "Pregnancy.", remember: "Anteverted.", vein: false },
      { id: "ovary", name: "Ovary", match: /ovary/i, role: "Eggs and hormones.", remember: "Both sides.", vein: true }
    ]
  },
  {
    id: "spinal",
    title: "Spinal cord",
    patterns: [/VH_F_spinal_cord/i, /segment_of_.*spinal_cord/i],
    color: "#e8c8c0",
    pins: [{ id: "cord", name: "Spinal cord", match: /spinal_cord/i, role: "Nerve highway.", remember: "Ends ~L1–L2.", vein: false }]
  }
];

export function matchOrgan(nodeName) {
  if (!nodeName) return null;
  if (/^VH_F_skin$/i.test(nodeName)) return "skin";
  for (const organ of ORGANS) {
    if (organ.exclude?.some((re) => re.test(nodeName))) continue;
    if (organ.patterns.some((re) => re.test(nodeName))) return organ.id;
  }
  return null;
}
