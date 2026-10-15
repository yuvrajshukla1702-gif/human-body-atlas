/** Full-body study catalog — HuBMAP Visible Human Female, CC BY 4.0. */
export const ORGANS = [
  {
    id: "heart",
    title: "Heart",
    subtitle: "Cardiovascular · mediastinum",
    layer: "organ",
    detailKey: "heart",
    intro: "A four-chamber muscular pump behind the sternum. The person’s right is on your left. Blood always enters atria and leaves through ventricles.",
    patterns: [/VH_F_heart/i, /cardiac_(chamber|atrium|ventricle)/i, /interventricular_septum/i, /papillary_muscle_of_heart/i, /aortic_valve|mitral_valve|tricuspid_valve|pulmonary_valve/i, /blood_vasculature_of_heart/i, /arteries_of_heart/i, /veins_of_heart/i, /cardiac_vein/i],
    color: "#b42a3a",
    trace: ["svc", "ra", "tricuspid", "rv", "pulmonary", "la", "mitral", "lv", "aortic"],
    traceLabel: "Follow the blood",
    pins: [
      { id: "svc", name: "Superior vena cava", latin: "Vena cava superior", match: /vena_cava|superior_vena/i, role: "The wide upper vein that returns deoxygenated blood from the head, neck, and arms into the right atrium. Inferior vena cava does the same from the lower body.", clinical: "SVC obstruction (e.g. lung cancer) causes facial swelling and dilated neck veins.", remember: "Vena cava = hollow vein. Superior = the upper one.", vein: true },
      { id: "aortic", name: "Aorta", latin: "Aorta", match: /aortic(?!_valve)|ascending_aorta|aorta/i, role: "The body’s largest artery. Oxygen-rich blood leaves the left ventricle, rises, arches, then descends to feed every organ.", clinical: "Aortic dissection is tearing of the wall — sudden tearing chest/back pain.", remember: "If blood is leaving the left ventricle, the next stop is the aorta.", vein: false },
      { id: "pulmonary", name: "Pulmonary trunk", latin: "Truncus pulmonalis", match: /pulmonary(?!_valve)|pulmonary_trunk/i, role: "Leaves the right ventricle and splits into right and left pulmonary arteries that carry blood to the lungs to pick up oxygen.", clinical: "Pulmonary embolism blocks these arteries — sudden breathlessness and chest pain.", remember: "The one artery that carries oxygen-poor blood.", vein: true },
      { id: "ra", name: "Right atrium", latin: "Atrium dextrum", match: /right_cardiac_atrium|right_atrium/i, role: "Thin-walled entrance hall. Receives blood from both venae cavae and the coronary sinus, then sends it through the tricuspid valve.", clinical: "SA node sits in the upper right atrium — the heart’s natural pacemaker.", remember: "Atrium means entrance hall. Right side = used blood.", vein: true },
      { id: "tricuspid", name: "Tricuspid valve", latin: "Valva tricuspidalis", match: /tricuspid/i, role: "Three cusps between right atrium and right ventricle. Stops blood falling back when the ventricle squeezes.", clinical: "Tricuspid regurgitation is common with right-heart strain.", remember: "TRI-cuspid is on the RIGHT (both have ‘r’ sounds).", vein: true },
      { id: "rv", name: "Right ventricle", latin: "Ventriculus dexter", match: /right_ventricle/i, role: "Pumps only as far as the lungs, so its wall is thinner than the left. Forms most of the front of the heart.", clinical: "Right-heart failure shows as ankle swelling and raised neck veins.", remember: "Right ventricle → lungs. Left ventricle → body.", vein: true },
      { id: "la", name: "Left atrium", latin: "Atrium sinistrum", match: /left_cardiac_atrium|left_atrium/i, role: "Receives oxygen-rich blood from four pulmonary veins after the lungs have oxygenated it.", clinical: "Atrial fibrillation often starts in pulmonary-vein sleeves of the left atrium.", remember: "Pulmonary veins are the veins that carry oxygen-rich blood.", vein: false },
      { id: "mitral", name: "Mitral valve", latin: "Valva mitralis", match: /mitral/i, role: "Two cusps (bicuspid) between left atrium and left ventricle. Named because it looks like a bishop’s mitre.", clinical: "Mitral stenosis after rheumatic fever is a classic exam case.", remember: "Mitral = left. Two cusps.", vein: false },
      { id: "lv", name: "Left ventricle", latin: "Ventriculus sinister", match: /left_ventricle/i, role: "Thickest chamber. Forms the apex (tip) and generates systemic pressure into the aorta. Wall is about three times thicker than the right.", clinical: "Left-ventricular hypertrophy follows long-standing high blood pressure.", remember: "The apex you feel at the 5th intercostal space is mostly left ventricle.", vein: false },
      { id: "ivc", name: "Inferior vena cava", latin: "Vena cava inferior", match: /inferior_vena/i, role: "Returns used blood from the abdomen, pelvis, and legs into the lower right atrium.", clinical: "IVC filter is sometimes placed after dangerous leg clots.", remember: "Inferior = from below the diaphragm.", vein: true }
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
    trace: ["trachea", "bronchi", "rlung", "llung"],
    traceLabel: "Follow the air",
    pins: [
      { id: "trachea", name: "Trachea", latin: "Trachea", match: /trachea/i, role: "The windpipe. A 10–12 cm tube held open by C-shaped cartilage rings so it never collapses during breathing.", clinical: "Tracheostomy opens this tube in the neck when the upper airway is blocked.", remember: "C-shaped rings — open at the back so the oesophagus can bulge.", vein: false },
      { id: "bronchi", name: "Main bronchi", latin: "Bronchi principales", match: /bronch/i, role: "The trachea splits at the carina into right and left main bronchi. Each then branches like a tree into every lobe.", clinical: "Inhaled objects usually fall into the right bronchus because it is wider and steeper.", remember: "Right bronchus = more vertical = more aspiration.", vein: false },
      { id: "rlung", name: "Right lung", latin: "Pulmo dexter", match: /right.*lung|_R$/i, role: "Three lobes — upper, middle, lower — separated by oblique and horizontal fissures. Slightly larger than the left.", clinical: "Middle-lobe pneumonia sits behind the right breast.", remember: "Right = three lobes. Left = two (heart takes the space).", vein: true },
      { id: "llung", name: "Left lung", latin: "Pulmo sinister", match: /left.*lung|_L$/i, role: "Two lobes with a cardiac notch that cups the heart. Has a lingula — a tongue of tissue like a spare middle lobe.", clinical: "Left lower-lobe collapse can hide behind the heart on a chest X-ray.", remember: "Cardiac notch = space gifted to the heart.", vein: false },
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
    subtitle: "206 bones · support and calcium store",
    layer: "bone",
    intro: "The living scaffold. Protects organs, levers muscles, makes blood cells in marrow, and stores calcium.",
    patterns: [/vertebra/i, /VH_F_femur/i, /VH_F_sternum/i, /VH_F_sacrum/i, /VH_F_ilium/i, /compact_bone/i, /trabecular/i, /VH_F_vertebral_column/i],
    color: "#e8dfd0",
    pins: [
      { id: "skull", name: "Skull", latin: "Cranium", match: /skull|cranium|calvaria/i, role: "Cranial bones protect the brain; facial bones form orbits, nose, and jaws. The foramen magnum is the exit for the spinal cord.", clinical: "Base-of-skull fracture may show raccoon eyes or Battle’s sign.", remember: "Foramen magnum = big hole where the brainstem leaves.", vein: false },
      { id: "spine", name: "Vertebral column", latin: "Columna vertebralis", match: /vertebra|vertebral_column/i, role: "7 cervical, 12 thoracic, 5 lumbar, then sacrum and coccyx. Curves (lordosis and kyphosis) act as a spring.", clinical: "A slipped disc usually hits L4–L5 or L5–S1.", remember: "Breakfast 7, lunch 12, dinner 5.", vein: false },
      { id: "ribs", name: "Ribs", latin: "Costae", match: /rib|costa/i, role: "Twelve pairs. 1–7 true (reach the sternum), 8–10 false (share cartilage), 11–12 floating.", clinical: "A broken rib can puncture the lung — watch for pneumothorax.", remember: "11 and 12 float free.", vein: false },
      { id: "sternum", name: "Sternum", latin: "Sternum", match: /sternum/i, role: "Breastbone: manubrium, body, xiphoid. The heart sits behind the lower body of the sternum.", clinical: "Sternal angle (of Louis) marks rib 2 and the aortic arch.", remember: "Manubrium, body, xiphoid — three pieces, one bone.", vein: false },
      { id: "pelvis", name: "Pelvis", latin: "Pelvis", match: /ilium|sacrum|pelvis/i, role: "Ilium, ischium, pubis fused into a ring that transfers weight to the legs and protects bladder and reproductive organs.", clinical: "Open-book pelvic fracture can bleed massively.", remember: "Feel the iliac crest at the waist — a landmark for IM injections.", vein: true },
      { id: "femur", name: "Femur", latin: "Os femoris", match: /femur/i, role: "Longest, strongest bone. The neck of the femur is a common fracture site in older people.", clinical: "Neck-of-femur fracture: shortened, externally rotated leg.", remember: "Neck of femur, not the shaft, is the classic fall injury.", vein: false }
    ]
  },
  {
    id: "digestion",
    title: "Digestion",
    subtitle: "Gut, liver, pancreas",
    layer: "organ",
    detailKey: "liver",
    intro: "A long muscular tube from mouth to anus, plus liver, pancreas, and gallbladder that chemically process food and blood.",
    patterns: [/digestive_system/i, /colon/i, /small_intestine/i, /VH_F_liver/i, /pancreas/i, /spleen/i, /gallbladder/i, /duodenum/i],
    exclude: [/impression/i, /esophageal_impression/i],
    color: "#9d4a52",
    trace: ["eso", "stomach", "liver", "pancreas", "bowel"],
    traceLabel: "Follow the food",
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
    intro: "Filters 180 litres of blood a day, keeps salt and water balanced, and makes urine that travels ureters → bladder → urethra.",
    patterns: [/VH_F_kidney/i, /renal_pelvis/i, /ureter/i, /urinary_bladder|bladder/i],
    exclude: [/adrenal/i],
    color: "#8b4048",
    trace: ["kidney", "ureter", "bladder"],
    traceLabel: "Follow the urine",
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
    intro: "A closed loop. Arteries carry blood away from the heart, capillaries exchange, veins return. Colour in models: red = usually oxygen-rich, blue = usually oxygen-poor (except pulmonary).",
    patterns: [/VH_F_aorta/i, /vena_cava/i, /arteries_of/i, /veins_of/i, /blood_vasculature/i, /pulmonary_artery/i, /pulmonary_vein/i],
    color: "#c43848",
    trace: ["aorta", "svc", "ivc"],
    traceLabel: "Follow the vessels",
    pins: [
      { id: "aorta", name: "Aorta", latin: "Aorta", match: /aorta/i, role: "Ascending aorta, arch (brachiocephalic, left carotid, left subclavian), then descending thoracic and abdominal aorta.", clinical: "Abdominal aortic aneurysm: pulsatile mass; rupture is a catastrophe.", remember: "Arch branches: ABC — Aorta’s Brachiocephalic, left Common carotid, left subclavian.", vein: false },
      { id: "svc", name: "Superior vena cava", latin: "Vena cava superior", match: /superior_vena|vena_cava/i, role: "Union of the two brachiocephalic veins. Drains everything above the diaphragm except the heart’s own veins.", clinical: "Central lines are often aimed toward the SVC.", remember: "SVC → right atrium. No valves in the SVC itself.", vein: true },
      { id: "ivc", name: "Inferior vena cava", latin: "Vena cava inferior", match: /inferior_vena/i, role: "Formed by the common iliac veins. Climbs the right side of the spine and pierces the diaphragm at T8.", clinical: "Deep-vein thrombosis can embolise through the IVC to the lungs.", remember: "IVC on the right of the aorta.", vein: true }
    ]
  },
  {
    id: "muscles",
    title: "Muscles",
    subtitle: "Skeletal muscle",
    layer: "muscle",
    intro: "Over 600 skeletal muscles. Each has origin, insertion, nerve, and action. Tendons attach muscle to bone.",
    patterns: [/VH_F_muscles_of/i, /skeletal_muscle/i, /rectus/i, /oblique/i, /deltoid/i, /gluteus/i],
    exclude: [/ciliary_muscle/i, /conjunctiva/i, /vitreous/i],
    color: "#8f3d45",
    pins: [
      { id: "rectus", name: "Rectus abdominis", latin: "M. rectus abdominis", match: /rectus/i, role: "The ‘six-pack’. Flexes the trunk and supports the abdominal wall. Linea alba is the midline raphe.", clinical: "Used as a landmark for midline surgical incision.", remember: "Rectus = straight. Runs straight up the abdomen.", vein: false },
      { id: "deltoid", name: "Deltoid", latin: "M. deltoideus", match: /deltoid/i, role: "Caps the shoulder. Abducts the arm after the first 15° (supraspinatus starts the lift).", clinical: "IM injection site — avoid the axillary nerve that winds around the surgical neck of humerus.", remember: "Deltoid = triangle. Axillary nerve (C5–C6).", vein: false },
      { id: "gluteus", name: "Gluteus maximus", latin: "M. gluteus maximus", match: /gluteus/i, role: "Largest muscle. Extends and laterally rotates the hip — standing from a chair, climbing stairs.", clinical: "Safe IM site is the upper outer quadrant to miss the sciatic nerve.", remember: "Maximus = power. Medius = abducts and stops Trendelenburg gait.", vein: false },
      { id: "diaphragm", name: "Diaphragm", latin: "Diaphragma", match: /diaphragm/i, role: "Dome of muscle that is the main muscle of inspiration. Phrenic nerve C3–C5.", clinical: "C3, 4, 5 keep the diaphragm alive — neck injury can stop breathing.", remember: "Contracts = flattens = air in.", vein: true }
    ]
  },
  {
    id: "eyes",
    title: "Eyes",
    subtitle: "Vision",
    layer: "organ",
    intro: "Cameras that focus light onto the retina. Cornea does most of the focusing; the lens fine-tunes; the optic nerve carries the picture.",
    patterns: [/conjunctiva/i, /vitreous/i, /optic_/i, /cornea/i, /ciliary/i, /macula/i, /choroid/i, /ocular/i, /palpebral/i],
    color: "#d8a898",
    pins: [
      { id: "cornea", name: "Cornea", latin: "Cornea", match: /cornea/i, role: "Clear front window. Avascular — gets oxygen from air and tears. Does about two-thirds of the eye’s focusing.", clinical: "Corneal abrasion is extremely painful because of dense sensory nerves.", remember: "Cornea focuses. Lens accommodates.", vein: false },
      { id: "retina", name: "Retina / macula", latin: "Retina", match: /macula|retina|choroid/i, role: "Photoreceptor sheet. Macula (fovea) is the sharp-colour centre. Optic disc is the blind spot where the nerve exits.", clinical: "Diabetic retinopathy and macular degeneration are leading causes of sight loss.", remember: "Macula = detail. Disc = blind spot.", vein: false },
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
    intro: "Ovaries make eggs and hormones. Uterine tubes catch the egg. Uterus hosts pregnancy. This model is the Visible Human female.",
    patterns: [/uter/i, /ovary/i, /uterine_tube/i],
    color: "#c96a78",
    pins: [
      { id: "uterus", name: "Uterus", latin: "Uterus", match: /uterus/i, role: "Muscular pear-shaped organ. Fundus, body, cervix. Myometrium contracts in labour; endometrium sheds as periods if no pregnancy.", clinical: "Cervical screening detects pre-cancer of the cervix.", remember: "Usually anteverted (tilted forward) over the bladder.", vein: false },
      { id: "ovary", name: "Ovary", latin: "Ovarium", match: /ovary/i, role: "Almond-sized. Each cycle one follicle ovulates. Makes oestrogen and progesterone. Blood supply from the ovarian artery (from aorta).", clinical: "Ectopic pregnancy most often sits in the uterine tube, not the ovary.", remember: "Ovaries are not covered by peritoneum — eggs burst into the peritoneal cavity.", vein: true },
      { id: "tube", name: "Uterine tube", latin: "Tuba uterina", match: /uterine_tube|fallopian/i, role: "Infundibulum with fimbriae catches the egg. Ampulla is the usual site of fertilisation. Then the zygote travels to the uterus.", clinical: "Tubal ligation is a permanent contraceptive method.", remember: "Fertilisation usually in the ampulla.", vein: false }
    ]
  },
  {
    id: "spinal",
    title: "Spinal cord",
    subtitle: "Central nervous system",
    layer: "nerve",
    intro: "The nerve highway inside the vertebral canal. Ends at L1–L2 as the conus; below that, the cauda equina (horse’s tail) of nerve roots.",
    patterns: [/VH_F_spinal_cord/i, /segment_of_.*spinal_cord/i],
    color: "#e8c8c0",
    pins: [
      { id: "cord", name: "Spinal cord", latin: "Medulla spinalis", match: /spinal_cord/i, role: "White matter tracts up and down; grey matter horns for reflexes. 31 pairs of spinal nerves.", clinical: "Lumbar puncture is done at L3–L4 or L4–L5 — below the cord.", remember: "Cord ends L1–L2. LP is lower, so you miss the cord.", vein: false },
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
      { id: "pancreas", name: "Pancreas (islets)", latin: "Pancreas", match: /pancreas/i, role: "Islets of Langerhans: β-cells insulin (lowers glucose), α-cells glucagon (raises glucose). Also a digestive gland.", clinical: "Type 1 diabetes: autoimmune loss of β-cells. Type 2: insulin resistance.", remember: "Insulin in, glucose down. Glucagon in, glucose up.", vein: false },
      { id: "adrenal", name: "Adrenal gland", latin: "Glandula suprarenalis", match: /adrenal|suprarenal/i, role: "Cap on each kidney. Cortex: cortisol, aldosterone, androgens. Medulla: adrenaline (fight-or-flight).", clinical: "Addison’s = not enough cortisol. Cushing’s = too much.", remember: "Cortex = salt, sugar, sex. Medulla = adrenaline.", vein: true },
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
      { id: "nodes", name: "Lymph nodes", latin: "Nodi lymphatici", match: /lymph/i, role: "Bean-shaped filters along lymph vessels. Trap microbes and present them to lymphocytes. Clusters: cervical, axillary, inguinal.", clinical: "A hard, fixed, painless node lasting weeks needs investigation.", remember: "Tender + mobile often infection. Hard + fixed think more seriously.", vein: true }
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
