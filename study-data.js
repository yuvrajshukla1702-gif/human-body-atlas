/**
 * Original revision prompts and concise factual study notes.
 * References are further-reading sources, not an assertion of clinical review.
 * This is a foundational study companion, not a complete medical curriculum.
 * Topic IDs refer to organs-catalog.js; model coverage is separate from study coverage.
 */
const openstax = (page) => `https://openstax.org/books/anatomy-and-physiology-2e/pages/${page}`;

export const SOURCES = [
  { id: "organization", title: "Body organization and organ systems", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("1-2-structural-organization-of-the-human-body"), kind: "reading" },
  { id: "skin", title: "Layers of the skin", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("5-1-layers-of-the-skin"), kind: "reading" },
  { id: "skeleton", title: "Divisions of the skeletal system", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("7-1-divisions-of-the-skeletal-system"), kind: "reading" },
  { id: "limbs", title: "The appendicular skeleton", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("8-1-the-pectoral-girdle"), kind: "reading" },
  { id: "muscles", title: "Skeletal muscle organization", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("10-2-skeletal-muscle"), kind: "reading" },
  { id: "nerves", title: "The central nervous system", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("13-2-the-central-nervous-system"), kind: "reading" },
  { id: "eyes", title: "Simple anatomy of the retina", publisher: "Webvision · NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/NBK11533/", kind: "reading" },
  { id: "endocrine", title: "Endocrine system overview", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("17-introduction"), kind: "reading" },
  { id: "thyroid", title: "The thyroid gland", publisher: "OpenStax · Anatomy and Physiology", url: "https://openstax.org/books/anatomy-and-physiology/pages/17-4-the-thyroid-gland", kind: "reading" },
  { id: "heart", title: "Heart anatomy and circulation", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("19-1-heart-anatomy"), kind: "reading" },
  { id: "lymph", title: "Lymphatic and immune anatomy", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("21-1-anatomy-of-the-lymphatic-and-immune-systems"), kind: "reading" },
  { id: "lungs", title: "Respiratory organs and airways", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("22-1-organs-and-structures-of-the-respiratory-system"), kind: "reading" },
  { id: "digestion", title: "Digestive tract and accessory organs", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("23-1-overview-of-the-digestive-system"), kind: "reading" },
  { id: "kidneys", title: "Urine formation and filtration", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("25-5-physiology-of-urine-formation"), kind: "reading" },
  { id: "reabsorption", title: "Tubular reabsorption", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("25-6-tubular-reabsorption"), kind: "reading" },
  { id: "testicular", title: "Testicular reproductive anatomy", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("27-1-anatomy-and-physiology-of-the-testicular-reproductive-system"), kind: "reading" },
  { id: "ovarian", title: "Ovarian reproductive anatomy", publisher: "OpenStax · Anatomy and Physiology 2e", url: openstax("27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system"), kind: "reading" },
  { id: "hra", title: "Human Reference Atlas · 3D Reference Library", publisher: "Human Reference Atlas / HuBMAP", url: "https://humanatlas.io/3d-reference-library", kind: "model" },
  { id: "nih3d", title: "Human Reference Atlas collection", publisher: "NIH 3D", url: "https://3d.nih.gov/collections/hra", kind: "model" }
];

const source = (id) => SOURCES.find((item) => item.id === id);
const links = (...ids) => ids.map(source);

export const STUDY_SYSTEMS = [
  {
    id: "integumentary", title: "Integumentary system", description: "Protection, sensation and the skin barrier.", organIds: ["skin"],
    keyFacts: [
      "The epidermis is avascular epithelium; nutrients diffuse into it from the underlying dermis.",
      "The dermis contains connective tissue, blood vessels, sensory nerves, follicles and glands.",
      "The hypodermis lies below the skin and contains loose connective tissue and fat. Thick skin on palms and soles has a stratum lucidum."
    ],
    sourceLinks: links("skin"), coverage: "Surface anatomy is visible; microscopic skin layers are study notes."
  },
  {
    id: "skeletal", title: "Skeletal system", description: "Support, protection, movement and mineral storage.", organIds: ["skeleton"],
    keyFacts: [
      "The axial skeleton includes the skull, vertebral column and thoracic cage.",
      "The appendicular skeleton includes the limbs and the pectoral and pelvic girdles.",
      "The typical adult count is 206 bones: 80 axial and 126 appendicular. Individual variation and fusion affect the count."
    ],
    sourceLinks: links("skeleton", "limbs"), coverage: "Selected bones are represented; this reference model does not contain a complete articulated skeleton."
  },
  {
    id: "muscular", title: "Muscular system", description: "How skeletal muscle transmits force.", organIds: ["muscles"],
    keyFacts: [
      "A muscle contains fascicles, each containing muscle fibres. Myofibrils within each fibre contain repeating sarcomeres.",
      "A sarcomere extends from one Z disc to the next; actin and myosin form its contractile filaments.",
      "Endomysium surrounds a fibre, perimysium a fascicle and epimysium the whole muscle. Their connective tissue helps transmit tension."
    ],
    sourceLinks: links("muscles"), coverage: "Selected muscles only; attachments, actions and innervation require further regional study."
  },
  {
    id: "nervous", title: "Nervous system", description: "Brain, spinal cord and sensory processing.", organIds: ["brain", "spinal", "eyes"],
    keyFacts: [
      "The central nervous system is the brain and spinal cord; peripheral nerves connect it to the rest of the body.",
      "The cerebellum helps coordinate movement. The spinal cord carries ascending sensory and descending motor pathways.",
      "The retina detects light. The fovea lies within the macula and supports high-acuity central vision; the optic disc has no photoreceptors."
    ],
    sourceLinks: links("nerves", "eyes"), coverage: "Brain, eyes and cord are represented; peripheral nerves, microscopic circuits and functional pathways are incomplete."
  },
  {
    id: "endocrine", title: "Endocrine system", description: "Hormones coordinate metabolism, growth and reproduction.", organIds: ["endocrine", "reproductive"],
    keyFacts: [
      "Endocrine organs release hormones into the circulation; target cells respond through appropriate receptors.",
      "The pituitary, thyroid, parathyroids, adrenals, pancreatic islets and gonads have distinct hormone roles.",
      "The thyroid has two lobes joined by an isthmus anterior to the trachea. Thyroid follicles produce T3 and T4."
    ],
    sourceLinks: links("endocrine", "thyroid"), coverage: "The study overview includes glands that are absent or not separately identifiable in the model."
  },
  {
    id: "cardiovascular", title: "Cardiovascular system", description: "A pump and two connected circulation circuits.", organIds: ["heart", "vessels"],
    keyFacts: [
      "Arteries carry blood away from the heart; veins return it. These names describe direction, not oxygen content.",
      "Right ventricle → pulmonary arteries → lung capillaries → pulmonary veins → left atrium.",
      "The left ventricle pumps into the systemic circuit. Atrioventricular and semilunar valves support one-way flow."
    ],
    sourceLinks: links("heart"), coverage: "Visible chambers and selected vessels support orientation; animated tours are schematic."
  },
  {
    id: "lymphatic", title: "Lymphatic & immune system", description: "Fluid return and immune surveillance.", organIds: ["lymph", "endocrine"],
    keyFacts: [
      "Lymphatic vessels return excess interstitial fluid to the venous circulation.",
      "Lymph nodes filter lymph; the spleen filters blood. These are different compartments.",
      "T cells mature in the thymus. Bone marrow supports blood-cell production and B-cell maturation."
    ],
    sourceLinks: links("lymph"), coverage: "Selected lymphoid organs are shown; the complete lymphatic network is not represented."
  },
  {
    id: "respiratory", title: "Respiratory system", description: "Conducting airways and gas-exchange surfaces.", organIds: ["lungs", "muscles"],
    keyFacts: [
      "Air passes through conducting airways before reaching the respiratory zone, which includes the alveoli.",
      "The main bronchi branch into each lung; air does not travel through the right lung and then the left.",
      "Tracheal cartilage supports the airway. Bronchioles lack cartilage and use smooth muscle to alter their calibre."
    ],
    sourceLinks: links("lungs"), coverage: "Major airways and lungs are visible; alveoli and respiratory membranes need microscopic study."
  },
  {
    id: "digestive", title: "Digestive system", description: "A continuous food pathway with supporting glands.", organIds: ["digestion"],
    keyFacts: [
      "The alimentary canal runs from mouth through pharynx, oesophagus, stomach and intestines to the anus.",
      "Food does not pass through the liver, gallbladder or pancreas. These accessory organs supply or support digestive secretions.",
      "Most nutrient absorption occurs in the small intestine. Venous blood from much of the gut reaches the liver through the portal circulation."
    ],
    sourceLinks: links("digestion"), coverage: "Selected digestive organs are represented; wall layers and microscopic absorption surfaces are not."
  },
  {
    id: "urinary", title: "Urinary system", description: "Filtration, reabsorption and fluid balance.", organIds: ["kidneys"],
    keyFacts: [
      "Glomerular filtration rate measures filtrate produced per unit time; it is different from renal blood flow.",
      "Healthy adult kidneys form roughly 150–180 litres of filtrate daily, with substantial variation. Most is reabsorbed; typical urine output is about 1–2 litres daily.",
      "Urine moves from collecting ducts to the renal collecting system, then through ureters to bladder and out through the urethra."
    ],
    sourceLinks: links("kidneys", "reabsorption"), coverage: "Kidneys, ureters and bladder are represented; nephron physiology is explained in study notes."
  },
  {
    id: "reproductive", title: "Reproductive system", description: "Gonads, reproductive passages and mammary glands.", organIds: ["reproductive", "breast"],
    keyFacts: [
      "Ovaries develop oocytes and secrete reproductive hormones. Uterine tubes provide a route toward the uterus; fertilisation usually occurs in a tube.",
      "Testes produce sperm in seminiferous tubules; sperm mature and are stored in the epididymis.",
      "Mammary gland lobules contain milk-secreting alveoli; ducts convey milk toward the nipple."
    ],
    sourceLinks: links("ovarian", "testicular", "organization"), coverage: "This model represents female reference anatomy. Testicular anatomy is covered in notes, not in the 3D model."
  }
];

// Each item can be presented as a multiple-choice question or a reveal-answer flashcard.
export const QUIZ = [
  { id: "skin-01", systemId: "integumentary", organId: "skin", question: "Which skin layer has no blood vessels?", options: ["Dermis", "Epidermis", "Hypodermis", "All layers contain vessels"], answer: 1, explanation: "The epidermis is avascular; its nutrition depends on diffusion from vessels deeper in the skin.", source: source("skin") },
  { id: "skin-02", systemId: "integumentary", organId: "skin", question: "Which layer lies immediately beneath the epidermis?", options: ["Dermis", "Pleura", "Periosteum", "Hypodermis"], answer: 0, explanation: "The dermis supports the epidermis and contains connective tissue, vessels and nerves.", source: source("skin") },
  { id: "skin-03", systemId: "integumentary", organId: "skin", question: "Where is the stratum lucidum normally found?", options: ["Only in hair follicles", "Throughout all thin skin", "In thick skin of palms and soles", "Inside the dermis"], answer: 2, explanation: "The stratum lucidum is an extra epidermal layer characteristic of thick skin.", source: source("skin") },
  { id: "skeletal-01", systemId: "skeletal", organId: "skeleton", question: "Which structure belongs to the axial skeleton?", options: ["Femur", "Scapula", "Hip bone", "Sternum"], answer: 3, explanation: "The sternum forms part of the thoracic cage, an axial structure.", source: source("skeleton") },
  { id: "skeletal-02", systemId: "skeletal", organId: "skeleton", question: "The pelvic girdle belongs to which division?", options: ["Axial skeleton", "Appendicular skeleton", "Neither division", "Cranial skeleton"], answer: 1, explanation: "The pelvic girdle attaches the lower limbs to the axial skeleton and is appendicular.", source: source("limbs") },
  { id: "skeletal-03", systemId: "skeletal", organId: "skeleton", question: "Which pair forms a pectoral girdle?", options: ["Clavicle and scapula", "Sternum and rib", "Humerus and radius", "Sacrum and coccyx"], answer: 0, explanation: "On each side, the clavicle and scapula form the shoulder attachment to the axial skeleton.", source: source("limbs") },
  { id: "muscular-01", systemId: "muscular", organId: "muscles", question: "What is a bundle of skeletal muscle fibres called?", options: ["Sarcomere", "Fascicle", "Myofilament", "Neuron"], answer: 1, explanation: "A fascicle contains multiple fibres; each fibre contains many myofibrils.", source: source("muscles") },
  { id: "muscular-02", systemId: "muscular", organId: "muscles", question: "A sarcomere extends between which landmarks?", options: ["Two muscle tendons", "Two motor neurons", "Adjacent Z discs", "The skin and fascia"], answer: 2, explanation: "Repeating Z-disc-to-Z-disc units form the contractile organization of a myofibril.", source: source("muscles") },
  { id: "muscular-03", systemId: "muscular", organId: "muscles", question: "Which connective tissue surrounds a whole skeletal muscle?", options: ["Endomysium", "Perimysium", "Endoneurium", "Epimysium"], answer: 3, explanation: "Epimysium encloses the muscle; perimysium encloses fascicles and endomysium individual fibres.", source: source("muscles") },
  { id: "nervous-01", systemId: "nervous", organId: "brain", question: "Which structure is particularly involved in coordinating movement?", options: ["Cerebellum", "Thyroid gland", "Retina", "Spleen"], answer: 0, explanation: "Cerebellar processing helps coordinate the timing and accuracy of movement.", source: source("nerves") },
  { id: "nervous-02", systemId: "nervous", organId: "spinal", question: "Which pair constitutes the central nervous system?", options: ["Cranial and spinal nerves", "Brain and spinal cord", "Brain and all peripheral nerves", "Retina and cochlea only"], answer: 1, explanation: "The brain and spinal cord make up the CNS; peripheral nerves connect it with the body.", source: source("nerves") },
  { id: "nervous-03", systemId: "nervous", organId: "eyes", question: "Which retinal location normally lacks photoreceptors?", options: ["Fovea", "Peripheral retina", "Macula", "Optic disc"], answer: 3, explanation: "Axons leave at the optic disc, producing the physiological blind spot.", source: source("eyes") },
  { id: "endocrine-01", systemId: "endocrine", organId: "endocrine", question: "How do endocrine signals usually reach distant targets?", options: ["Through ducts to a body surface", "By entering only the airways", "Through the circulation", "Through bone marrow channels only"], answer: 2, explanation: "Hormones travel in blood and act on cells with appropriate receptors.", source: source("endocrine") },
  { id: "endocrine-02", systemId: "endocrine", organId: "endocrine", question: "Where is the thyroid isthmus located relative to the trachea?", options: ["Anterior to it", "Inside its lumen", "Behind the oesophagus", "Below the diaphragm"], answer: 0, explanation: "The isthmus crosses the front of the trachea between the two thyroid lobes.", source: source("thyroid") },
  { id: "endocrine-03", systemId: "endocrine", organId: "endocrine", question: "Which gland produces T3 and T4?", options: ["Adrenal medulla", "Thyroid", "Parathyroid", "Thymus"], answer: 1, explanation: "Thyroid follicles synthesize the thyroid hormones T3 and T4.", source: source("thyroid") },
  { id: "cardio-01", systemId: "cardiovascular", organId: "heart", question: "Which chamber pumps into the pulmonary trunk?", options: ["Left atrium", "Left ventricle", "Right ventricle", "Right atrium"], answer: 2, explanation: "The right ventricle ejects blood through the pulmonary valve toward the lungs.", source: source("heart") },
  { id: "cardio-02", systemId: "cardiovascular", organId: "vessels", question: "What defines an artery?", options: ["It always contains oxygen-rich blood", "It always has a valve", "It is always larger than a vein", "It carries blood away from the heart"], answer: 3, explanation: "Direction defines arteries. Pulmonary arteries carry relatively oxygen-poor blood after birth.", source: source("heart") },
  { id: "cardio-03", systemId: "cardiovascular", organId: "heart", question: "Pulmonary veins normally drain into which chamber?", options: ["Left atrium", "Right atrium", "Left ventricle", "Right ventricle"], answer: 0, explanation: "Blood returns from the lungs to the left atrium before entering the left ventricle.", source: source("heart") },
  { id: "lymph-01", systemId: "lymphatic", organId: "lymph", question: "Which fluid is filtered by lymph nodes?", options: ["Urine", "Lymph", "Bile", "Cerebrospinal fluid"], answer: 1, explanation: "Nodes receive lymph through afferent vessels and support immune surveillance.", source: source("lymph") },
  { id: "lymph-02", systemId: "lymphatic", organId: "lymph", question: "Which organ filters blood rather than lymph?", options: ["Axillary lymph node", "Inguinal lymph node", "Spleen", "Thoracic duct"], answer: 2, explanation: "The spleen monitors blood and removes ageing blood cells; nodes monitor lymph.", source: source("lymph") },
  { id: "lymph-03", systemId: "lymphatic", organId: "endocrine", question: "Where do T lymphocytes mature?", options: ["Gallbladder", "Thyroid", "Adrenal cortex", "Thymus"], answer: 3, explanation: "The thymus is a primary lymphoid organ involved in T-cell maturation and selection.", source: source("lymph") },
  { id: "respiratory-01", systemId: "respiratory", organId: "lungs", question: "What is a principal gas-exchange structure in the lungs?", options: ["Alveolus", "Tracheal cartilage", "Epiglottis", "Main bronchus"], answer: 0, explanation: "Alveoli provide a thin interface with capillaries for respiratory gas diffusion.", source: source("lungs") },
  { id: "respiratory-02", systemId: "respiratory", organId: "lungs", question: "Which airway normally lacks cartilage in its wall?", options: ["Trachea", "Bronchiole", "Main bronchus", "Lobar bronchus"], answer: 1, explanation: "Bronchiolar walls contain smooth muscle but no supporting cartilage.", source: source("lungs") },
  { id: "respiratory-03", systemId: "respiratory", organId: "lungs", question: "After the trachea, airflow divides into which structures?", options: ["Pulmonary veins", "Both pleural spaces", "Right and left main bronchi", "The oesophagus and stomach"], answer: 2, explanation: "The bronchial tree branches to the two lungs in parallel.", source: source("lungs") },
  { id: "digestive-01", systemId: "digestive", organId: "digestion", question: "Which is an accessory digestive organ rather than part of the food lumen?", options: ["Oesophagus", "Stomach", "Small intestine", "Liver"], answer: 3, explanation: "The liver supports digestion by producing bile; swallowed food does not pass through it.", source: source("digestion") },
  { id: "digestive-02", systemId: "digestive", organId: "digestion", question: "Where does most nutrient absorption take place?", options: ["Small intestine", "Oesophagus", "Gallbladder", "Rectum"], answer: 0, explanation: "The small intestine is the main site for digestion and absorption of nutrients.", source: source("digestion") },
  { id: "digestive-03", systemId: "digestive", organId: "digestion", question: "Gut venous blood is directed first toward which organ by the portal system?", options: ["Thyroid", "Liver", "Urinary bladder", "Brain"], answer: 1, explanation: "Portal circulation delivers absorbed substances to the liver before they reach the general circulation.", source: source("digestion") },
  { id: "urinary-01", systemId: "urinary", organId: "kidneys", question: "What does glomerular filtration rate measure?", options: ["Total blood entering the kidneys", "Bladder capacity", "Filtrate formed per unit time", "Ureter contraction frequency"], answer: 2, explanation: "GFR measures filtered fluid production, not total renal blood flow or final urine volume.", source: source("kidneys") },
  { id: "urinary-02", systemId: "urinary", organId: "kidneys", question: "What happens to most water in normal glomerular filtrate?", options: ["It immediately leaves as urine", "It becomes blood cells", "It remains permanently in the bladder", "It is reabsorbed into the circulation"], answer: 3, explanation: "Tubular reabsorption recovers most filtered water, so urine volume is much smaller than filtrate volume.", source: source("reabsorption") },
  { id: "urinary-03", systemId: "urinary", organId: "kidneys", question: "Compared with whole blood, normal initial glomerular filtrate has very little of which components?", options: ["Blood cells and large proteins", "Water and sodium", "Glucose and amino acids", "Urea and small solutes"], answer: 0, explanation: "The filtration barrier retains blood cells and most large proteins; many small solutes enter the filtrate.", source: source("reabsorption") },
  { id: "reproductive-01", systemId: "reproductive", organId: "reproductive", question: "Fertilisation usually occurs in which structure?", options: ["Uterine cervix", "Uterine tube", "Ovary", "Urinary bladder"], answer: 1, explanation: "The uterine tube, usually its ampulla, is the common site of fertilisation.", source: source("ovarian") },
  { id: "reproductive-02", systemId: "reproductive", organId: "reproductive", question: "Where are sperm produced?", options: ["Prostate ducts", "Epididymal tail", "Seminiferous tubules", "Seminal vesicles"], answer: 2, explanation: "Spermatogenesis occurs in testicular seminiferous tubules. Maturation continues in the epididymis.", source: source("testicular") },
  { id: "reproductive-03", systemId: "reproductive", organId: "breast", question: "Which mammary structures secrete milk?", options: ["Cooper's ligaments", "Pectoralis fibres", "Axillary lymph nodes", "Glandular alveoli"], answer: 3, explanation: "Secretory cells of mammary alveoli produce milk, which drains through ducts.", source: source("ovarian") }
];
