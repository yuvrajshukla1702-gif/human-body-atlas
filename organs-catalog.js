/** Selected anatomy study topics for the HuBMAP female reference organ collection. */
import { SOURCES } from "./study-data.js";
export const ORGANS = [
  {
    id: "heart",
    title: "Heart",
    subtitle: "Cardiovascular · mediastinum",
    layer: "organ",
    detailKey: "heart",
    intro: "A four-chamber muscular pump in the mediastinum. In an anterior view, the person’s right is on your left. The right heart sends blood to the lungs; pulmonary veins return it to the left atrium before the left ventricle pumps to the body.",
    patterns: [/VH_F_heart/i, /cardiac_(chamber|atrium|ventricle)/i, /interventricular_septum/i, /papillary_muscle_of_heart/i, /aortic_valve|mitral_valve|tricuspid_valve|pulmonary_valve/i, /blood_vasculature_of_heart/i, /arteries_of_heart/i, /veins_of_heart/i, /cardiac_vein/i],
    color: "#b42a3a",
    trace: ["svc", "ra", "tricuspid", "rv", "pulmonaryvalve", "pulmonary"],
    traceLabel: "Right-heart flow · schematic",
    traceKind: "schematic",
    traceNote: "Selected right-heart landmarks. Blood next passes through lung capillaries, then returns through pulmonary veins to the left atrium. Lines are teaching guides, not vessel geometry.",
    pins: [
      { id: "svc", name: "Superior vena cava", latin: "Vena cava superior", match: /superior_vena_cava|vena_cava_superior/i, role: "Returns relatively oxygen-poor blood from the head, neck, upper limbs and much of the thorax to the right atrium.", clinical: "SVC obstruction can cause facial swelling and distended neck veins.", remember: "Superior vena cava = venous return from the upper body.", vein: true },
      { id: "aortic", name: "Aorta", latin: "Aorta", match: /aortic(?!_valve)|ascending_aorta|aorta/i, role: "The body’s largest artery. Oxygen-rich blood leaves the left ventricle, rises, arches, then descends to feed every organ.", clinical: "Aortic dissection is tearing of the wall — sudden tearing chest/back pain.", remember: "If blood is leaving the left ventricle, the next stop is the aorta.", vein: false },
      { id: "pulmonary", name: "Pulmonary trunk", latin: "Truncus pulmonalis", match: /pulmonary_trunk|trunk_of_pulmonary/i, role: "Leaves the right ventricle and divides into right and left pulmonary arteries, which supply the pulmonary circulation.", clinical: "Pulmonary embolism obstructs pulmonary arteries; symptoms and severity vary.", remember: "Pulmonary arteries carry relatively oxygen-poor blood after birth. Artery means away from the heart.", vein: true },
      { id: "pulmonaryvalve", name: "Pulmonary valve", latin: "Valva trunci pulmonalis", match: /pulmonary_valve/i, role: "Semilunar valve between the right ventricle and pulmonary trunk. It limits backward flow during ventricular relaxation.", clinical: "Pulmonary valve stenosis increases the load on the right ventricle.", remember: "Right ventricle → pulmonary valve → pulmonary trunk.", vein: true },
      { id: "ra", name: "Right atrium", latin: "Atrium dextrum", match: /right_cardiac_atrium|right_atrium/i, role: "Thin-walled entrance hall. Receives blood from both venae cavae and the coronary sinus, then sends it through the tricuspid valve.", clinical: "SA node sits in the upper right atrium — the heart’s natural pacemaker.", remember: "Atrium means entrance hall. Right side = used blood.", vein: true },
      { id: "tricuspid", name: "Tricuspid valve", latin: "Valva tricuspidalis", match: /tricuspid/i, role: "Three cusps between right atrium and right ventricle. Stops blood falling back when the ventricle squeezes.", clinical: "Tricuspid regurgitation is common with right-heart strain.", remember: "TRI-cuspid is on the RIGHT (both have ‘r’ sounds).", vein: true },
      { id: "rv", name: "Right ventricle", latin: "Ventriculus dexter", match: /right_ventricle/i, role: "Pumps only as far as the lungs, so its wall is thinner than the left. Forms most of the front of the heart.", clinical: "Right-heart failure shows as ankle swelling and raised neck veins.", remember: "Right ventricle → lungs. Left ventricle → body.", vein: true },
      { id: "la", name: "Left atrium", latin: "Atrium sinistrum", match: /left_cardiac_atrium|left_atrium/i, role: "Receives oxygen-rich blood from four pulmonary veins after the lungs have oxygenated it.", clinical: "Atrial fibrillation often starts in pulmonary-vein sleeves of the left atrium.", remember: "Pulmonary veins are the veins that carry oxygen-rich blood.", vein: false },
      { id: "mitral", name: "Mitral valve", latin: "Valva mitralis", match: /mitral/i, role: "Two cusps (bicuspid) between left atrium and left ventricle. Named because it looks like a bishop’s mitre.", clinical: "Mitral stenosis after rheumatic fever is a classic exam case.", remember: "Mitral = left. Two cusps.", vein: false },
      { id: "lv", name: "Left ventricle", latin: "Ventriculus sinister", match: /left_ventricle/i, role: "Thickest chamber. Forms the apex (tip) and generates systemic pressure into the aorta. Wall is about three times thicker than the right.", clinical: "Left-ventricular hypertrophy follows long-standing high blood pressure.", remember: "The apex you feel at the 5th intercostal space is mostly left ventricle.", vein: false },
      { id: "ivc", name: "Inferior vena cava", latin: "Vena cava inferior", match: /inferior_vena_cava|vena_cava_inferior/i, role: "Returns relatively oxygen-poor blood from the abdomen, pelvis and lower limbs to the right atrium.", clinical: "Thrombi from deep leg veins can travel through the IVC and right heart into pulmonary arteries.", remember: "Inferior = from below the diaphragm.", vein: true }
    ]
  },
  {
    id: "lungs",
    title: "Lungs",
    subtitle: "Respiratory system",
    layer: "organ",
    detailKey: "lung",
    intro: "Two spongy organs in the chest. Air travels trachea → bronchi → bronchioles → alveoli, where oxygen enters blood and carbon dioxide leaves.",
    patterns: [/VH_F_lungs/i, /VH_F_.*lung/i, /trachea/i, /bronch/i, /respiratory_system/i],
    exclude: [/impression/i],
    color: "#d07080",
    trace: ["trachea", "bronchi", "rlung"],
    traceLabel: "Right airway · schematic",
    traceKind: "schematic",
    traceNote: "This tour follows the right branch. Both lungs receive air in parallel through branching bronchi and bronchioles; alveoli are the gas-exchange endpoints.",
    pins: [
      { id: "trachea", name: "Trachea", latin: "Trachea", match: /trachea/i, role: "The windpipe. C-shaped cartilage rings support the airway; its flexible posterior wall lies in front of the oesophagus.", clinical: "Airway narrowing or loss of tracheal support can impede ventilation.", remember: "C-shaped rings have a flexible posterior wall.", vein: false },
      { id: "bronchi", name: "Main bronchi", latin: "Bronchi principales", match: /bronch/i, role: "The trachea splits at the carina into right and left main bronchi. Each then branches like a tree into every lobe.", clinical: "Inhaled objects usually fall into the right bronchus because it is wider and steeper.", remember: "Right bronchus = more vertical = more aspiration.", vein: false },
      { id: "rlung", name: "Right lung", latin: "Pulmo dexter", match: /right.*lung|lung.*right|lung_R$/i, role: "Three lobes — upper, middle, lower — separated by oblique and horizontal fissures. Usually larger than the left.", clinical: "The right middle lobe occupies an anterior position in the lower thorax.", remember: "Right = three lobes. Left = two.", vein: true },
      { id: "llung", name: "Left lung", latin: "Pulmo sinister", match: /left.*lung|lung.*left|lung_L$/i, role: "Two lobes separated by an oblique fissure. The superior lobe includes the lingula and has a cardiac notch along its anterior border.", clinical: "The retrocardiac region needs attention when assessing the left lower lobe on imaging.", remember: "The lingula belongs to the left superior lobe.", vein: false },
      { id: "pleura", name: "Pleura", latin: "Pleura", match: /pleura/i, role: "A double membrane: visceral on the lung, parietal on the chest wall, with a thin fluid film so the lung slides as you breathe.", clinical: "Pneumothorax is air in this space — the lung collapses.", remember: "Visceral = organ surface. Parietal = wall.", vein: false }
    ]
  },
  {
    id: "brain",
    title: "Brain",
    subtitle: "Central nervous system",
    layer: "organ",
    intro: "About 1.3 kg of networked neurones. Cerebrum thinks and moves; cerebellum times movement; brainstem keeps you alive without asking.",
    patterns: [/^Allen_/i],
    color: "#c48474",
    pins: [
      { id: "frontal", name: "Frontal lobe", latin: "Lobus frontalis", match: /frontal/i, role: "Planning, personality, voluntary movement (precentral gyrus), and speech production (Broca’s area, usually left).", clinical: "Frontal injury can change personality while memory stays intact.", remember: "Front of the brain = front of behaviour.", vein: false },
      { id: "parietal", name: "Parietal lobe", latin: "Lobus parietalis", match: /parietal/i, role: "Touch, temperature, pain, and where your body is in space. The postcentral gyrus is the sensory map.", clinical: "Parietal stroke can cause neglect of one side of the world.", remember: "Postcentral = sensation. Precentral = movement.", vein: false },
      { id: "temporal", name: "Temporal lobe", latin: "Lobus temporalis", match: /temporal/i, role: "Hearing, memory (hippocampus), and language understanding (Wernicke’s area). Sits beside the ears.", clinical: "Temporal-lobe epilepsy may start with a smell or a sudden memory.", remember: "Temples and ears — hearing and memory live here.", vein: false },
      { id: "occipital", name: "Occipital lobe", latin: "Lobus occipitalis", match: /occipital/i, role: "Primary visual cortex at the back of the head. Each half of the brain sees the opposite half of the visual field.", clinical: "A blow to the back of the head can cause cortical blindness with normal eyes.", remember: "Occiput = back of skull = vision.", vein: false },
      { id: "cerebellum", name: "Cerebellum", latin: "Cerebellum", match: /cerebellum/i, role: "Coordinates timing, balance, and fine motor skill. Does not start movement — it makes movement smooth.", clinical: "Cerebellar disease: wide gait, intention tremor, past-pointing.", remember: "Cerebellum damage = clumsy, not paralysed.", vein: true },
      { id: "stem", name: "Brainstem", latin: "Truncus encephali", match: /brainstem|midbrain|pons|medulla/i, role: "Midbrain, pons, medulla. Houses cranial-nerve nuclei and the vital centres for breathing and heartbeat.", clinical: "A lesion here is life-threatening; Glasgow Coma Scale tracks consciousness.", remember: "Midbrain → pons → medulla → spinal cord.", vein: true }
    ]
  },
  {
    id: "skeleton",
    title: "Skeleton",
    subtitle: "Selected bones · support and mineral storage",
    layer: "bone",
    intro: "The living scaffold. Protects organs, levers muscles, makes blood cells in marrow, and stores calcium.",
    patterns: [/vertebra/i, /VH_F_femur/i, /VH_F_sternum/i, /VH_F_sacrum/i, /VH_F_ilium/i, /compact_bone/i, /trabecular/i, /VH_F_vertebral_column/i],
    color: "#e8dfd0",
    pins: [
      { id: "skull", name: "Skull", latin: "Cranium", match: /skull|cranium|calvaria/i, role: "Cranial bones protect the brain; facial bones form orbits, nose, and jaws. The foramen magnum is the exit for the spinal cord.", clinical: "Base-of-skull fracture may show raccoon eyes or Battle’s sign.", remember: "Foramen magnum = big hole where the brainstem leaves.", vein: false },
      { id: "spine", name: "Vertebral column", latin: "Columna vertebralis", match: /vertebra|vertebral_column/i, role: "7 cervical, 12 thoracic, 5 lumbar, then sacrum and coccyx. Curves (lordosis and kyphosis) act as a spring.", clinical: "A slipped disc usually hits L4–L5 or L5–S1.", remember: "Breakfast 7, lunch 12, dinner 5.", vein: false },
      { id: "ribs", name: "Ribs", latin: "Costae", match: /rib|costa/i, role: "Twelve pairs. 1–7 true (reach the sternum), 8–10 false (share cartilage), 11–12 floating.", clinical: "A broken rib can puncture the lung — watch for pneumothorax.", remember: "11 and 12 float free.", vein: false },
      { id: "sternum", name: "Sternum", latin: "Sternum", match: /sternum/i, role: "Breastbone: manubrium, body, xiphoid. The heart sits behind the lower body of the sternum.", clinical: "Sternal angle (of Louis) marks rib 2 and the aortic arch.", remember: "Manubrium, body, xiphoid — three pieces, one bone.", vein: false },
      { id: "pelvis", name: "Pelvis", latin: "Pelvis", match: /ilium|ischium|pubis|sacrum|pelvis/i, role: "Each hip bone forms from fused ilium, ischium and pubis. The hip bones, sacrum and coccyx form the bony pelvis, transferring weight and protecting pelvic organs.", clinical: "Pelvic ring disruption can be associated with major internal bleeding.", remember: "Hip bones belong to the appendicular skeleton; sacrum and coccyx belong to the axial skeleton.", vein: true },
      { id: "femur", name: "Femur", latin: "Os femoris", match: /femur/i, role: "Longest, strongest bone. The neck of the femur is a common fracture site in older people.", clinical: "Neck-of-femur fracture: shortened, externally rotated leg.", remember: "Neck of femur, not the shaft, is the classic fall injury.", vein: false }
    ]
  },
  {
    id: "digestion",
    title: "Digestion",
    subtitle: "Gut, liver, pancreas",
    layer: "organ",
    detailKey: "liver",
    intro: "The alimentary canal carries food from mouth to anus. Liver, pancreas and gallbladder support digestion, but food does not pass through them.",
    patterns: [/digestive_system/i, /colon/i, /small_intestine/i, /VH_F_liver/i, /pancreas/i, /gallbladder/i, /duodenum/i, /esophag/i, /stomach/i],
    exclude: [/impression/i, /esophageal_impression/i],
    color: "#9d4a52",
    trace: ["eso", "stomach", "bowel"],
    traceLabel: "Food pathway · schematic",
    traceKind: "schematic",
    traceNote: "Selected landmarks only: oesophagus → stomach → small intestine → large intestine. Accessory organs are not on the food pathway; lines do not reproduce the gut lumen.",
    pins: [
      { id: "eso", name: "Oesophagus", latin: "Oesophagus", match: /esophag/i, role: "A 25 cm muscular tube. Food is pushed by peristalsis through the diaphragm at T10 to reach the stomach.", clinical: "Heartburn is acid reflux through a weak lower oesophageal sphincter.", remember: "Diaphragm openings: T8 IVC, T10 oesophagus, T12 aorta.", vein: false },
      { id: "stomach", name: "Stomach", latin: "Gaster", match: /stomach|gastric/i, role: "J-shaped bag under the left ribs. Churns food, secretes acid and pepsin, and starts protein digestion. Empties into the duodenum.", clinical: "Peptic ulcer can bleed (melaena) or perforate.", remember: "Stomach is on the person’s LEFT.", vein: false },
      { id: "liver", name: "Liver", latin: "Hepar", match: /liver/i, role: "Largest internal organ, right upper abdomen. Makes bile, stores glycogen, detoxifies blood from the gut (portal vein), and makes clotting proteins.", clinical: "Jaundice is yellow skin when bilirubin is not cleared.", remember: "Liver right, stomach left. Portal vein = gut blood to liver.", vein: false },
      { id: "pancreas", name: "Pancreas", latin: "Pancreas", match: /pancreas/i, role: "Lies across the back of the abdomen. Exocrine part makes digestive enzymes; endocrine islets make insulin and glucagon.", clinical: "Acute pancreatitis: severe central pain radiating to the back.", remember: "Insulin from β-cells. Glucagon from α-cells.", vein: false },
      { id: "gall", name: "Gallbladder", latin: "Vesica biliaris", match: /gallbladder|gall_bladder/i, role: "Stores and concentrates bile, then squirts it into the duodenum when you eat fat.", clinical: "Gallstones: right-upper-quadrant pain after a fatty meal.", remember: "Bile from liver, stored in gallbladder, used in duodenum.", vein: true },
      { id: "bowel", name: "Intestines", latin: "Intestinum", match: /intestine|colon|duodenum/i, role: "Small intestine (duodenum, jejunum, ileum) absorbs nutrients. Large intestine (colon) absorbs water and forms stool.", clinical: "Appendicitis starts as central pain that moves to the right iliac fossa.", remember: "Small is longer; large is wider.", vein: true }
    ]
  },
  {
    id: "kidneys",
    title: "Urinary",
    subtitle: "Kidneys, ureters, bladder",
    layer: "organ",
    detailKey: "bladder",
    intro: "Kidneys regulate water, electrolytes and acid–base balance. Adults form roughly 150–180 litres of filtrate daily, most of which is reabsorbed. Filtrate volume is different from blood flow; only a small fraction becomes urine.",
    patterns: [/VH_F_kidney/i, /renal_pelvis/i, /ureter/i, /urinary_bladder|bladder/i],
    exclude: [/adrenal/i],
    color: "#8b4048",
    trace: ["kidney", "ureter", "bladder"],
    traceLabel: "Urine pathway · schematic",
    traceKind: "schematic",
    traceNote: "Selected landmarks: renal collecting system → ureter → bladder. The urethra carries urine out after storage. Lines are guides rather than the actual lumen.",
    pins: [
      { id: "kidney", name: "Kidney", latin: "Ren", match: /kidney/i, role: "Bean-shaped filters on the posterior abdominal wall. Cortex filters; medulla concentrates; pelvis collects urine. Left sits slightly higher.", clinical: "Costovertebral-angle tenderness suggests pyelonephritis.", remember: "Left kidney higher — liver pushes the right one down.", vein: true },
      { id: "ureter", name: "Ureter", latin: "Ureter", match: /ureter/i, role: "A 25 cm muscular tube from renal pelvis to bladder. Three narrowings: PUJ, pelvic brim, VUJ — where stones lodge.", clinical: "Renal colic is wave-like loin-to-groin pain.", remember: "Ureter is not urethra. Ureter = kidney to bladder.", vein: false },
      { id: "bladder", name: "Urinary bladder", latin: "Vesica urinaria", match: /bladder/i, role: "A stretchy muscular bag behind the pubic bone. Detrusor muscle empties it; sphincters keep you dry.", clinical: "Cystitis: frequency, urgency, burning — more common in women (short urethra).", remember: "Bladder stores. Urethra exits.", vein: false }
    ]
  },
  {
    id: "vessels",
    title: "Blood vessels",
    subtitle: "Arteries and veins",
    layer: "vessel",
    intro: "Arteries carry blood away from the heart, capillaries support exchange, and veins return blood. Model colours are visual conventions; blood is never blue. Pulmonary vessels show why direction and oxygen content must be distinguished.",
    patterns: [/VH_F_aorta/i, /vena_cava/i, /arteries_of/i, /veins_of/i, /blood_vasculature/i, /pulmonary_artery/i, /pulmonary_vein/i],
    color: "#c43848",
    pins: [
      { id: "aorta", name: "Aorta", latin: "Aorta", match: /aorta/i, role: "Ascending aorta, arch (brachiocephalic, left carotid, left subclavian), then descending thoracic and abdominal aorta.", clinical: "Abdominal aortic aneurysm: pulsatile mass; rupture is a catastrophe.", remember: "Arch branches: ABC — Aorta’s Brachiocephalic, left Common carotid, left subclavian.", vein: false },
      { id: "svc", name: "Superior vena cava", latin: "Vena cava superior", match: /superior_vena_cava|vena_cava_superior/i, role: "Formed by the brachiocephalic veins. Returns blood from the head, neck, upper limbs and much of the thorax to the right atrium.", clinical: "Its relationship to the right atrium matters in central venous anatomy.", remember: "Pulmonary veins return lung blood separately to the left atrium.", vein: true },
      { id: "ivc", name: "Inferior vena cava", latin: "Vena cava inferior", match: /inferior_vena/i, role: "Formed by the common iliac veins. Climbs the right side of the spine and pierces the diaphragm at T8.", clinical: "Deep-vein thrombosis can embolise through the IVC to the lungs.", remember: "IVC on the right of the aorta.", vein: true }
    ]
  },
  {
    id: "muscles",
    title: "Muscles",
    subtitle: "Skeletal muscle",
    layer: "muscle",
    intro: "Over 600 skeletal muscles. Each has origin, insertion, nerve, and action. Tendons attach muscle to bone.",
    patterns: [/VH_F_muscles_of/i, /skeletal_muscle/i, /rectus_abdominis/i, /abdom.*oblique|oblique.*abdom/i, /deltoid/i, /gluteus/i, /diaphragm/i],
    exclude: [/ciliary_muscle/i, /conjunctiva/i, /vitreous/i],
    color: "#8f3d45",
    pins: [
      { id: "rectus", name: "Rectus abdominis", latin: "M. rectus abdominis", match: /rectus_abdominis|abdominal_rectus/i, role: "Flexes the trunk and supports the abdominal wall. The paired muscles lie on either side of the linea alba.", clinical: "The linea alba is a connective-tissue midline landmark, not the rectus muscle itself.", remember: "Rectus means straight; this is the abdominal rectus, not an eye muscle.", vein: false },
      { id: "deltoid", name: "Deltoid", latin: "M. deltoideus", match: /deltoid/i, role: "Caps the shoulder. Abducts the arm after the first 15° (supraspinatus starts the lift).", clinical: "IM injection site — avoid the axillary nerve that winds around the surgical neck of humerus.", remember: "Deltoid = triangle. Axillary nerve (C5–C6).", vein: false },
      { id: "gluteus", name: "Gluteus maximus", latin: "M. gluteus maximus", match: /gluteus_maximus/i, role: "A large superficial gluteal muscle that extends and laterally rotates the hip, especially when rising or climbing.", clinical: "The sciatic nerve passes deep to gluteus maximus, an important regional relationship.", remember: "Maximus powers hip extension; medius helps stabilize the pelvis during single-leg stance.", vein: false },
      { id: "diaphragm", name: "Diaphragm", latin: "Diaphragma", match: /diaphragm/i, role: "Dome of muscle that is the main muscle of inspiration. Phrenic nerve C3–C5.", clinical: "C3, 4, 5 keep the diaphragm alive — neck injury can stop breathing.", remember: "Contracts = flattens = air in.", vein: true }
    ]
  },
  {
    id: "eyes",
    title: "Eyes",
    subtitle: "Vision",
    layer: "organ",
    intro: "Cameras that focus light onto the retina. Cornea does most of the focusing; the lens fine-tunes; the optic nerve carries the picture.",
    patterns: [/conjunctiva/i, /vitreous/i, /optic_/i, /cornea/i, /ciliary/i, /macula/i, /retina/i, /choroid/i, /ocular/i, /palpebral/i, /(?:superior|inferior|lateral|medial)_rectus/i],
    color: "#d8a898",
    pins: [
      { id: "cornea", name: "Cornea", latin: "Cornea", match: /cornea/i, role: "Clear front window. Avascular — gets oxygen from air and tears. Does about two-thirds of the eye’s focusing.", clinical: "Corneal abrasion is extremely painful because of dense sensory nerves.", remember: "Cornea focuses. Lens accommodates.", vein: false },
      { id: "retina", name: "Retina / macula", latin: "Retina", match: /macula|retina/i, role: "Light-sensitive neural tissue. The fovea lies within the macula and supports fine central vision. The optic disc is the exit for ganglion-cell axons and has no photoreceptors.", clinical: "Retinal disease can impair vision; the choroid is a separate vascular layer beneath it.", remember: "Fovea is within macula; optic disc creates the physiological blind spot.", vein: false },
      { id: "optic", name: "Optic nerve", latin: "N. opticus", match: /optic_/i, role: "Cranial nerve II. Fibres from each nasal retina cross at the chiasm, so each occipital lobe sees the opposite visual field.", clinical: "Pituitary tumours can press the chiasm → bitemporal hemianopia.", remember: "Nasal fibres cross. Temporal fibres stay.", vein: true }
    ]
  },
  {
    id: "breast",
    title: "Breast",
    subtitle: "Mammary gland",
    layer: "organ",
    intro: "Modified sweat glands sitting on pectoralis major. 15–20 lobes drain through lactiferous ducts to the nipple.",
    patterns: [/mammary/i, /lactiferous/i, /areolar/i],
    color: "#c87888",
    pins: [
      { id: "breast", name: "Mammary tissue", latin: "Glandula mammaria", match: /mammary|lactiferous/i, role: "Glandular tissue in a fat pad. Cooper’s ligaments suspend it. Lymph mostly drains to axillary nodes.", clinical: "A new lump, skin dimpling, or nipple change needs examination — most lumps are benign, but check.", remember: "Tail of Spence reaches into the axilla — examine there too.", vein: false }
    ]
  },
  {
    id: "reproductive",
    title: "Reproductive",
    subtitle: "Female internal organs",
    layer: "organ",
    intro: "Ovaries develop oocytes and produce hormones. Uterine tubes convey oocytes toward the uterus, where implantation normally occurs. This reference model represents female anatomy.",
    patterns: [/uter/i, /ovary/i, /uterine_tube/i],
    color: "#c96a78",
    pins: [
      { id: "uterus", name: "Uterus", latin: "Uterus", match: /uterus/i, role: "Muscular pear-shaped organ. Fundus, body, cervix. Myometrium contracts in labour; endometrium sheds as periods if no pregnancy.", clinical: "Cervical screening detects pre-cancer of the cervix.", remember: "Usually anteverted (tilted forward) over the bladder.", vein: false },
      { id: "ovary", name: "Ovary", latin: "Ovarium", match: /ovary/i, role: "Contains follicles with developing oocytes and produces oestrogens and progesterone. An ovulatory cycle commonly releases one oocyte, but variation occurs. Ovarian arteries arise from the abdominal aorta.", clinical: "Most ectopic pregnancies implant in a uterine tube.", remember: "An ovulated oocyte is released near the fimbriae, which help guide it into the tube.", vein: true },
      { id: "tube", name: "Uterine tube", latin: "Tuba uterina", match: /uterine_tube|fallopian/i, role: "Infundibulum with fimbriae catches the egg. Ampulla is the usual site of fertilisation. Then the zygote travels to the uterus.", clinical: "Tubal ligation is a permanent contraceptive method.", remember: "Fertilisation usually in the ampulla.", vein: false }
    ]
  },
  {
    id: "spinal",
    title: "Spinal cord",
    subtitle: "Central nervous system",
    layer: "nerve",
    intro: "The spinal cord lies within the vertebral canal. In most adults its conus ends around L1–L2, with individual variation. Lower nerve roots continue below it as the cauda equina.",
    patterns: [/VH_F_spinal_cord/i, /segment_of_.*spinal_cord/i],
    color: "#e8c8c0",
    pins: [
      { id: "cord", name: "Spinal cord", latin: "Medulla spinalis", match: /spinal_cord/i, role: "White matter carries ascending and descending pathways; grey matter contains neuronal cell bodies and local circuits. There are 31 pairs of spinal nerves.", clinical: "The adult conus is usually above the lower lumbar cistern; anatomy varies with age and between individuals.", remember: "The spinal cord is shorter than the adult vertebral canal.", vein: false },
      { id: "cauda", name: "Cauda equina", latin: "Cauda equina", match: /cauda|lumbar_spinal/i, role: "Bundle of lumbar and sacral roots below the conus. Looks like a horse’s tail.", clinical: "Cauda equina syndrome: saddle numbness + bladder/bowel change — emergency.", remember: "Saddle anaesthesia is a red flag.", vein: true }
    ]
  },
  {
    id: "endocrine",
    title: "Endocrine",
    subtitle: "Hormone glands",
    layer: "organ",
    detailKey: "pancreas",
    intro: "Ductless glands that pour hormones into blood. Hypothalamus and pituitary command; thyroid, adrenals, pancreas, gonads carry out the work.",
    patterns: [/pancreas/i, /thymus/i, /adrenal|suprarenal/i, /thyroid/i],
    color: "#c4a070",
    pins: [
      { id: "pancreas", name: "Pancreas (islets)", latin: "Pancreas", match: /pancreas/i, role: "Pancreatic islets contain insulin-secreting β-cells and glucagon-secreting α-cells, among other cell types. Islets are microscopic and not individually shown in this model.", clinical: "Type 1 diabetes usually involves autoimmune β-cell loss; type 2 combines insulin resistance with progressive β-cell dysfunction.", remember: "The pancreas has both endocrine and exocrine functions.", vein: false },
      { id: "adrenal", name: "Adrenal gland", latin: "Glandula suprarenalis", match: /adrenal|suprarenal/i, role: "Paired glands above the kidneys. Cortex produces cortisol, aldosterone and adrenal androgens; medulla secretes catecholamines.", clinical: "Primary adrenal insufficiency can reduce cortisol and aldosterone; Cushing syndrome reflects prolonged excess glucocorticoid exposure.", remember: "Cortex makes steroid hormones; medulla makes catecholamines.", vein: true },
      { id: "thymus", name: "Thymus", latin: "Thymus", match: /thymus/i, role: "Behind the sternum. Trains T-lymphocytes in childhood, then shrinks (involution) in adults.", clinical: "Thymoma is linked with myasthenia gravis.", remember: "Thymus = T-cells. Bone marrow = B-cells.", vein: false }
    ]
  },
  {
    id: "lymph",
    title: "Lymph & spleen",
    subtitle: "Immune circulation",
    layer: "organ",
    intro: "Lymph vessels collect tissue fluid, filter it through nodes, and return it to veins. Spleen filters blood and stores platelets.",
    patterns: [/spleen/i, /lymph/i, /tonsil/i],
    color: "#a05060",
    pins: [
      { id: "spleen", name: "Spleen", latin: "Lien", match: /spleen/i, role: "Left upper abdomen, under ribs 9–11. White pulp = immune; red pulp = removes old red cells. Not essential for life but infections rise if removed.", clinical: "After splenectomy, vaccines against encapsulated bacteria are vital.", remember: "Spleen sits with the stomach — person’s LEFT.", vein: false },
      { id: "nodes", name: "Lymph nodes", latin: "Nodi lymphatici", match: /lymph_node|lymphatic_node/i, role: "Encapsulated lymphoid organs along lymph vessels. They filter lymph and support immune-cell interactions. Groups occur in cervical, axillary and inguinal regions.", clinical: "Node enlargement has many causes; tenderness or firmness alone does not establish a diagnosis.", remember: "Nodes filter lymph; spleen filters blood.", vein: true }
    ]
  },
  {
    id: "skin",
    title: "Skin",
    subtitle: "Integument",
    layer: "skin",
    intro: "The largest organ. Barrier, temperature control, vitamin D, sensation. Epidermis (keratinocytes) over dermis (collagen, vessels, nerves).",
    patterns: [/^VH_F_skin$/i],
    color: "#d4a574",
    pins: [
      { id: "epidermis", name: "Skin", latin: "Cutis", match: /skin/i, role: "Epidermis is avascular and renews from the basal layer. Dermis holds vessels, glands, and follicles. Hypodermis is fat.", clinical: "ABCDE for moles: Asymmetry, Border, Colour, Diameter, Evolving.", remember: "Vitamin D is made in skin under UVB light.", vein: false }
    ]
  }
];

const TOPIC_SOURCES = {
  heart: ["heart"], lungs: ["lungs"], brain: ["nerves"], skeleton: ["skeleton", "limbs"],
  digestion: ["digestion"], kidneys: ["kidneys", "reabsorption"], vessels: ["heart"],
  muscles: ["muscles"], eyes: ["eyes"], breast: ["ovarian"], reproductive: ["ovarian", "testicular"],
  spinal: ["nerves"], endocrine: ["endocrine", "thyroid", "lymph"], lymph: ["lymph"], skin: ["skin"]
};
for (const organ of ORGANS) {
  organ.sourceLinks = TOPIC_SOURCES[organ.id].map((id) => SOURCES.find((item) => item.id === id));
}

export const LAYERS = [
  { id: "skin", label: "Skin" },
  { id: "muscle", label: "Muscle" },
  { id: "bone", label: "Bone" },
  { id: "organ", label: "Organs" },
  { id: "vessel", label: "Vessels" },
  { id: "nerve", label: "Nerves" }
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

export function organLayer(organId) {
  if (organId === "skin") return "skin";
  return ORGANS.find((o) => o.id === organId)?.layer || "organ";
}

export function allPins() {
  const list = [];
  for (const o of ORGANS) {
    for (const p of o.pins) list.push({ ...p, organId: o.id, organTitle: o.title });
  }
  return list;
}
