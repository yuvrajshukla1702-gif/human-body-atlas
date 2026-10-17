import { ORGANS, LAYERS, allPins } from "./organs-catalog.js";
import { STUDY_SYSTEMS, QUIZ, SOURCES } from "./study-data.js";
import { createScene } from "./scene.js";

const app = document.getElementById("app");
const icon = (d) => `<svg class="icon" viewBox="0 0 24 24">${d}</svg>`;
const icons = {
  body: icon('<path d="M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/><path d="M8 10h8l-1 11H9L8 10Z"/>'),
  book: icon('<path d="M4 5h7v14H4zM13 5h7v14h-7z"/>'),
  quiz: icon('<path d="M9 9a3 3 0 1 1 4.2 2.7c-.7.4-1.2 1-1.2 1.8V15"/><path d="M12 18h.01"/>'),
  search: icon('<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>'),
  eye: icon('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),
  isolate: icon('<rect x="8" y="4" width="8" height="16" rx="2"/>'),
  explode: icon('<path d="M12 12 6 6M12 12l6-6M12 12l-6 6M12 12l6 6"/>'),
  reset: icon('<path d="M4 12a8 8 0 1 0 2-5.3"/><path d="M4 4v5h5"/>'),
  download: icon('<path d="M12 4v10M8 10l4 4 4-4M5 19h14"/>'),
  info: icon('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>')
};

const state = {
  page: "explore",
  organ: null,
  pin: null,
  query: "",
  quizIndex: 0,
  quizFilter: "all",
  quizPicked: null,
  score: 0,
  offline: { ready: false, bytes: 0, missing: [] },
  toast: ""
};

let viewer;
let detailGroup = null;

function toast(message) {
  state.toast = message;
  const el = document.getElementById("toast");
  if (!el) return;
  el.hidden = !message;
  el.textContent = message;
  if (message) setTimeout(() => { if (state.toast === message) { state.toast = ""; el.hidden = true; } }, 4200);
}

function swMessage(type) {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker?.controller) return resolve(null);
    const channel = new MessageChannel();
    channel.port1.onmessage = (e) => resolve(e.data);
    navigator.serviceWorker.controller.postMessage({ type }, [channel.port2]);
  });
}

async function refreshOffline() {
  const status = await swMessage("OFFLINE_STATUS");
  if (status) state.offline = status;
  const chip = document.querySelector(".header-chip");
  if (chip) chip.innerHTML = `<i class="online-dot"></i>${status?.ready ? "Ready offline" : navigator.onLine ? "Online" : "Limited"}`;
}

function currentOrgan() {
  return ORGANS.find((o) => o.id === state.organ);
}

function currentPin() {
  const organ = currentOrgan();
  return organ?.pins.find((p) => p.id === state.pin) || null;
}

function quizPool() {
  return QUIZ.filter((q) => state.quizFilter === "all" || q.systemId === state.quizFilter);
}

function renderShell() {
  app.innerHTML = `
    <div class="shell">
      <header class="header">
        <div class="brand">
          <div class="brand-mark">${icons.body}</div>
          <div class="brand-name">Anatomy Studio<small>Human Body Atlas</small></div>
        </div>
        <nav class="topnav">
          <button type="button" data-page="explore" class="${state.page === "explore" ? "active" : ""}">${icons.body} Explore</button>
          <button type="button" data-page="study" class="${state.page === "study" ? "active" : ""}">${icons.book} Study</button>
          <button type="button" data-page="quiz" class="${state.page === "quiz" ? "active" : ""}">${icons.quiz} Quiz</button>
        </nav>
        <div class="header-end">
          <span class="chip header-chip"><i class="online-dot"></i>Online</span>
          <button type="button" class="icon-button" id="offline-btn" title="Download for offline">${icons.download}</button>
          <button type="button" class="icon-button" id="about-btn" title="About">${icons.info}</button>
        </div>
      </header>
      ${state.page === "explore" ? exploreWorkspace() : state.page === "study" ? studyView() : quizView()}
      <footer class="footer">
        <span>HuBMAP / HRA · CC BY 4.0</span>
        <span class="footer-reference">Optimized local models · schematic tours are teaching guides</span>
        <button type="button" id="sources-btn">Sources</button>
      </footer>
    </div>
    <div class="toast" id="toast" hidden></div>
    <dialog class="modal" id="modal"></dialog>
  `;
}

function exploreWorkspace() {
  return `
    <div class="workspace">
      <aside class="sidebar" id="sidebar">
        <div class="side-title"><p class="eyebrow">Systems</p><span class="count">${ORGANS.length}</span></div>
        <div class="systems">
          ${ORGANS.map((o) => `<button type="button" class="system ${state.organ === o.id ? "active" : ""}" data-organ="${o.id}"><span class="swatch" style="background:${o.color}"></span>${o.title}<span class="count">${o.pins.length}</span></button>`).join("")}
        </div>
        <div class="divider"></div>
        <p class="eyebrow">Layers</p>
        <div class="layer-list">
          ${LAYERS.map((l) => `<button type="button" class="layer" data-layer="${l.id}" aria-pressed="true">${icons.eye}<span class="swatch"></span>${l.label}<span class="eye">on</span></button>`).join("")}
        </div>
        <div class="side-note">
          <p class="eyebrow">How to look</p>
          <p>Drag to orbit. Pinch or scroll to zoom. Tap a structure or a system to isolate it.</p>
        </div>
      </aside>
      <section class="stage">
        <div class="mobile-switcher">
          <button type="button" id="open-systems">Systems</button>
          <button type="button" class="mobile-panel-trigger" id="open-panel">Study card</button>
        </div>
        <div class="stage-heading">
          <div class="stage-tag"><span></span> Visible Human female · reference</div>
          <h1 id="stage-title">Explore the body</h1>
          <p id="stage-copy">Spin the full 3D reference. Peel layers, isolate an organ, then read the card.</p>
        </div>
        <div class="stage-meta"><button type="button" class="icon-button" id="spin-btn" aria-pressed="true">Spin</button></div>
        <div id="canvas-host"></div>
        <div class="loading-overlay" id="loading"><div class="loader"></div><h3>Loading 3D body</h3><p id="loadtext">Optimized HuBMAP model…</p><progress id="loadbar" max="100" value="8"></progress></div>
        <div class="camera-views">
          <button type="button" data-cam="front">Front</button>
          <button type="button" data-cam="side">Side</button>
          <button type="button" data-cam="top">Top</button>
        </div>
        <div class="orientation"><div class="compass">A</div>Anterior</div>
        <div class="stage-tools">
          <button type="button" id="tool-isolate">${icons.isolate}Isolate</button>
          <button type="button" id="tool-explode">${icons.explode}Explode</button>
          <span class="tool-separator"></span>
          <button type="button" id="tool-reset">${icons.reset}Reset</button>
        </div>
      </section>
      <aside class="study-panel" id="panel">${panelHTML()}</aside>
    </div>
  `;
}

function panelHTML() {
  const organ = currentOrgan();
  const pin = currentPin();
  const hits = searchHits();
  return `
    <div class="panel-close-row"><p class="eyebrow">Study</p><button type="button" class="mobile-close" id="close-panel">Close</button></div>
    <div class="search-wrap">
      <label class="search-field">${icons.search}<input id="q" type="search" placeholder="Search any structure" value="${escapeHtml(state.query)}" autocomplete="off"><kbd>/</kbd></label>
      <div class="search-results" id="hits" ${hits.length ? "" : "hidden"}>${hits.map((h) => `<button type="button" class="search-result" data-jump="${h.organId}:${h.id}"><b>${escapeHtml(h.name)}</b><small>${escapeHtml(h.organTitle)}</small></button>`).join("")}</div>
    </div>
    <div class="panel-scroll">
      ${!organ ? homePanel() : pin ? pinPanel(organ, pin) : organPanel(organ)}
    </div>
  `;
}

function homePanel() {
  return `
    <div class="panel-tabs"><button type="button" class="active">Organs</button></div>
    <div class="section-title"><h3>Choose a region</h3><span>${ORGANS.length} topics</span></div>
    <p class="panel-intro">Astra’s studio layout: 3D body in the centre, systems on the left, revision cards on the right.</p>
    <div class="organ-grid">
      ${ORGANS.map((o) => `<button type="button" class="organ-tile" data-organ="${o.id}" style="--organ-color:${o.color}"><svg viewBox="0 0 48 48"><circle cx="24" cy="12" r="6"/><path d="M16 44V28c0-4 3-8 8-8s8 4 8 8v16"/></svg><span>${o.title}</span><small>${o.pins.length} labels</small></button>`).join("")}
    </div>
    <div class="learn-card">
      <p class="eyebrow">Start here</p>
      <h3>Heart tour</h3>
      <p>Open the heart, then follow the schematic right-heart path. Cards include function, a clinical line, and a memory hook.</p>
      <button type="button" class="text-button" data-organ="heart">Open Heart ${icons.book}</button>
    </div>
  `;
}

function organPanel(organ) {
  return `
    <button type="button" class="back-button" id="back-home">Back to the body</button>
    <p class="eyebrow">${escapeHtml(organ.subtitle || "")}</p>
    <h2 class="detail-title">${escapeHtml(organ.title)}</h2>
    <p>${escapeHtml(organ.intro)}</p>
    <div class="detail-actions">
      <button type="button" class="button primary" id="start-tour">Start tour</button>
      ${organ.trace ? `<button type="button" class="button" id="follow">${escapeHtml(organ.traceLabel)}</button>` : ""}
    </div>
    <div class="structure-list">
      ${organ.pins.map((p) => `<button type="button" class="structure-row" data-pin="${p.id}"><i class="dot"></i>${escapeHtml(p.name)}<small>${p.latin ? escapeHtml(p.latin) : ""}</small></button>`).join("")}
    </div>
    ${organ.coverage ? `<p class="coverage">${escapeHtml(organ.coverage)}</p>` : ""}
  `;
}

function pinPanel(organ, pin) {
  return `
    <button type="button" class="back-button" id="back-organ">Back to ${escapeHtml(organ.title)}</button>
    <p class="eyebrow">${escapeHtml(organ.subtitle || organ.title)}</p>
    <h2 class="detail-title">${escapeHtml(pin.name)}</h2>
    ${pin.latin ? `<p class="latin">${escapeHtml(pin.latin)}</p>` : ""}
    <div class="detail-tags"><span class="chip">${pin.vein ? "Vein / return" : "Structure"}</span></div>
    <p>${escapeHtml(pin.role)}</p>
    ${pin.clinical ? `<div class="detail-block"><h3>Clinical</h3><p>${escapeHtml(pin.clinical)}</p></div>` : ""}
    <p class="remember">${escapeHtml(pin.remember)}</p>
    <div class="detail-actions">
      ${organ.trace ? `<button type="button" class="button primary" id="follow">${escapeHtml(organ.traceLabel)}</button>` : ""}
      <button type="button" class="button" id="prev-pin">Prev</button>
      <button type="button" class="button" id="next-pin">Next</button>
    </div>
    ${organ.traceNote ? `<p class="coverage">${escapeHtml(organ.traceNote)}</p>` : ""}
  `;
}

function studyView() {
  return `
    <div class="study-view">
      <div class="study-hero">
        <div>
          <p class="eyebrow">Eleven systems</p>
          <h1>Revision notes beside the model</h1>
          <p>OpenStax and NCBI readings, plus what this reference model can and cannot show.</p>
        </div>
        <button type="button" class="button primary" data-page="quiz">Open quiz</button>
      </div>
      <div class="study-grid">
        ${STUDY_SYSTEMS.map((s) => `
          <article class="system-card">
            <span class="number">${s.organIds.length} organs</span>
            ${icons.book}
            <h2>${escapeHtml(s.title)}</h2>
            <p>${escapeHtml(s.description)}</p>
            <ul>${s.keyFacts.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
            <p class="coverage">${escapeHtml(s.coverage)}</p>
            ${s.sourceLinks.map((src) => src ? `<a class="source-link" href="${src.url}" target="_blank" rel="noreferrer">${escapeHtml(src.title)}</a>` : "").join("")}
            <button type="button" class="button" data-organ="${s.organIds[0]}" data-page="explore">View in 3D</button>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function quizView() {
  const pool = quizPool();
  const q = pool[state.quizIndex % Math.max(pool.length, 1)];
  if (!q) return `<div class="study-view"><p>No questions in this set.</p></div>`;
  const picked = state.quizPicked;
  return `
    <div class="study-view">
      <div class="quiz-wrap">
        <div class="quiz-top">
          <span>Score ${state.score}</span>
          <select id="quiz-filter">
            <option value="all" ${state.quizFilter === "all" ? "selected" : ""}>All systems</option>
            ${STUDY_SYSTEMS.map((s) => `<option value="${s.id}" ${state.quizFilter === s.id ? "selected" : ""}>${escapeHtml(s.title)}</option>`).join("")}
          </select>
        </div>
        <div class="quiz-progress"><span style="width:${((state.quizIndex % pool.length) / pool.length) * 100}%"></span></div>
        <div class="quiz-card">
          <p class="eyebrow">Question ${(state.quizIndex % pool.length) + 1} / ${pool.length}</p>
          <h2>${escapeHtml(q.question)}</h2>
          <div class="answers">
            ${q.options.map((opt, i) => {
              let cls = "answer";
              if (picked != null) {
                if (i === q.answer) cls += " correct";
                else if (i === picked) cls += " wrong";
              }
              return `<button type="button" class="${cls}" data-answer="${i}" ${picked != null ? "disabled" : ""}><span>${String.fromCharCode(65 + i)}</span>${escapeHtml(opt)}</button>`;
            }).join("")}
          </div>
          ${picked != null ? `<div class="feedback"><h3>${picked === q.answer ? "Correct" : "Not quite"}</h3><p>${escapeHtml(q.explanation)}</p>${q.source ? `<a class="source-link" href="${q.source.url}" target="_blank" rel="noreferrer">${escapeHtml(q.source.title)}</a>` : ""}</div>` : ""}
        </div>
        <div class="quiz-bottom">
          <span>${SOURCES.length} linked readings</span>
          <button type="button" class="button" id="next-q" ${picked == null ? "disabled" : ""}>Next</button>
        </div>
      </div>
    </div>
  `;
}

function searchHits() {
  const q = state.query.trim().toLowerCase();
  if (q.length < 2) return [];
  return allPins().filter((p) => `${p.name} ${p.latin || ""} ${p.organTitle} ${p.role}`.toLowerCase().includes(q)).slice(0, 8);
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function openOrgan(id, pinId) {
  state.page = "explore";
  state.organ = id;
  state.pin = pinId || null;
  const organ = currentOrgan();
  if (!viewer?.state.ready) return;
  viewer.isolate(id);
  if (organ?.detailKey && MODELS_HAS(id)) {
    try {
      if (detailGroup) { detailGroup.removeFromParent(); detailGroup = null; }
      detailGroup = await viewer.loadDetail(id);
      if (detailGroup) detailGroup.userData.detail = true;
    } catch {
      toast("Detail model not found — using the body mesh.");
    }
  }
  if (state.pin) {
    const pin = currentPin();
    viewer.highlight(id, pin);
  } else viewer.highlight(id);
  refreshPanel();
  setStage(organ.title, organ.intro);
}

function MODELS_HAS(id) {
  return ["heart", "lungs", "digestion"].includes(id);
}

function setStage(title, copy) {
  const t = document.getElementById("stage-title");
  const c = document.getElementById("stage-copy");
  if (t) t.textContent = title;
  if (c) c.textContent = copy;
}

function refreshPanel() {
  const panel = document.getElementById("panel");
  if (panel) panel.innerHTML = panelHTML();
  bindPanel();
}

function bindPanel() {
  document.getElementById("q")?.addEventListener("input", (e) => {
    state.query = e.target.value;
    refreshPanel();
    document.getElementById("q")?.focus();
  });
  document.getElementById("hits")?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-jump]");
    if (!b) return;
    const [organId, pinId] = b.dataset.jump.split(":");
    state.query = "";
    openOrgan(organId, pinId);
  });
  document.getElementById("back-home")?.addEventListener("click", () => {
    state.organ = null;
    state.pin = null;
    if (detailGroup) { detailGroup.removeFromParent(); detailGroup = null; }
    viewer?.restoreBody();
    refreshPanel();
    setStage("Explore the body", "Spin the full 3D reference. Peel layers, isolate an organ, then read the card.");
  });
  document.getElementById("back-organ")?.addEventListener("click", () => {
    state.pin = null;
    viewer?.highlight(state.organ);
    refreshPanel();
  });
  document.getElementById("start-tour")?.addEventListener("click", () => {
    const organ = currentOrgan();
    if (organ?.pins[0]) openOrgan(organ.id, organ.pins[0].id);
  });
  document.getElementById("follow")?.addEventListener("click", followPath);
  document.getElementById("next-pin")?.addEventListener("click", () => stepPin(1));
  document.getElementById("prev-pin")?.addEventListener("click", () => stepPin(-1));
  document.getElementById("close-panel")?.addEventListener("click", () => document.getElementById("panel")?.classList.remove("mobile-open"));
  app.querySelectorAll("[data-organ]").forEach((b) => {
    if (b.closest(".systems") || b.classList.contains("organ-tile") || b.classList.contains("text-button")) {
      b.addEventListener("click", () => openOrgan(b.dataset.organ));
    }
  });
  app.querySelectorAll("[data-pin]").forEach((b) => b.addEventListener("click", () => {
    state.pin = b.dataset.pin;
    viewer?.highlight(state.organ, currentPin());
    refreshPanel();
  }));
}

function stepPin(dir) {
  const organ = currentOrgan();
  if (!organ) return;
  const i = organ.pins.findIndex((p) => p.id === state.pin);
  const next = organ.pins[(i + dir + organ.pins.length) % organ.pins.length];
  state.pin = next.id;
  viewer?.highlight(organ.id, next);
  refreshPanel();
}

function followPath() {
  const organ = currentOrgan();
  if (!organ?.trace) return;
  let step = 0;
  const run = () => {
    const id = organ.trace[step];
    state.pin = id;
    viewer?.highlight(organ.id, organ.pins.find((p) => p.id === id));
    refreshPanel();
    step += 1;
    if (step < organ.trace.length) setTimeout(run, 1400);
  };
  run();
}

function showModal(title, html) {
  const modal = document.getElementById("modal");
  modal.innerHTML = `<button type="button" class="icon-button close" id="close-modal">Close</button><p class="eyebrow">Anatomy Studio</p><h2>${title}</h2>${html}`;
  modal.showModal();
  document.getElementById("close-modal").onclick = () => modal.close();
}

function bindChrome() {
  app.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => {
    state.page = b.dataset.page;
    boot(false);
  }));
  document.getElementById("about-btn")?.addEventListener("click", () => showModal("About this atlas", `
    <p>Interactive study atlas on the HuBMAP Visible Human female reference. Optimized GLBs stay on this device. Tours are schematic teaching guides, not physiology simulations.</p>
    <ul><li>Explore: orbit, isolate, explode, layer peel</li><li>Study: 11 systems with OpenStax / NCBI links</li><li>Quiz: multiple-choice revision</li></ul>
  `));
  document.getElementById("sources-btn")?.addEventListener("click", () => showModal("Sources", `<ul>${SOURCES.map((s) => `<li><a href="${s.url}" target="_blank" rel="noreferrer">${escapeHtml(s.title)}</a> · ${escapeHtml(s.publisher)}</li>`).join("")}</ul>`));
  document.getElementById("offline-btn")?.addEventListener("click", async () => {
    toast("Downloading models for offline…");
    const result = await swMessage("OFFLINE_DOWNLOAD");
    if (result?.type === "OFFLINE_COMPLETE") toast("Saved for offline on this device.");
    else toast(result?.message || "Start the download while online.");
    refreshOffline();
  });
  document.getElementById("open-systems")?.addEventListener("click", () => document.getElementById("sidebar")?.classList.toggle("mobile-open"));
  document.getElementById("open-panel")?.addEventListener("click", () => document.getElementById("panel")?.classList.add("mobile-open"));
  document.getElementById("quiz-filter")?.addEventListener("change", (e) => {
    state.quizFilter = e.target.value;
    state.quizIndex = 0;
    state.quizPicked = null;
    boot(false);
  });
  document.getElementById("next-q")?.addEventListener("click", () => {
    state.quizIndex += 1;
    state.quizPicked = null;
    boot(false);
  });
  app.querySelectorAll("[data-answer]").forEach((b) => b.addEventListener("click", () => {
    const pool = quizPool();
    const q = pool[state.quizIndex % pool.length];
    state.quizPicked = Number(b.dataset.answer);
    if (state.quizPicked === q.answer) state.score += 1;
    boot(false);
  }));
}

async function mountViewer() {
  const host = document.getElementById("canvas-host");
  if (!host || viewer) {
    if (viewer && host && !host.contains(viewer.state.root)) { /* already live */ }
    return;
  }
  viewer = createScene(host, {
    onSelect: (hit) => openOrgan(hit.organId),
    onReady: () => {
      document.getElementById("loading")?.setAttribute("hidden", "");
    }
  });
  document.getElementById("spin-btn")?.addEventListener("click", (e) => {
    const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
    e.currentTarget.setAttribute("aria-pressed", String(on));
    viewer.setSpin(on);
  });
  document.getElementById("tool-isolate")?.addEventListener("click", () => {
    if (state.organ) viewer.isolate(state.organ);
  });
  document.getElementById("tool-explode")?.addEventListener("click", (e) => {
    const on = !e.currentTarget.classList.contains("active");
    e.currentTarget.classList.toggle("active", on);
    viewer.explode(on ? 1 : 0);
  });
  document.getElementById("tool-reset")?.addEventListener("click", () => {
    state.organ = null;
    state.pin = null;
    if (detailGroup) { detailGroup.removeFromParent(); detailGroup = null; }
    viewer.restoreBody();
    viewer.explode(0);
    refreshPanel();
  });
  app.querySelectorAll("[data-cam]").forEach((b) => b.addEventListener("click", () => viewer.setCamera(b.dataset.cam)));
  app.querySelectorAll("[data-layer]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.layer;
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(on));
    b.querySelector(".eye").textContent = on ? "on" : "off";
    viewer.setLayer(id, on);
  }));
  const loadtext = document.getElementById("loadtext");
  const loadbar = document.getElementById("loadbar");
  try {
    await viewer.loadBody((p) => {
      if (loadbar) loadbar.value = Math.round(p * 100);
      if (loadtext) loadtext.textContent = `Loading body ${Math.round(p * 100)}%`;
    });
    document.getElementById("loading")?.setAttribute("hidden", "");
  } catch (err) {
    if (loadtext) loadtext.textContent = "Could not load models/optimized-body.glb. Keep the models folder next to this page.";
    console.error(err);
  }
}

let viewerMounted = false;
async function boot(rebuild = true) {
  if (rebuild || !document.querySelector(".shell")) {
    renderShell();
    bindChrome();
    bindPanel();
    viewerMounted = false;
    viewer = null;
    detailGroup = null;
  } else {
    renderShell();
    bindChrome();
    bindPanel();
    viewer = null;
    viewerMounted = false;
  }
  if (state.page === "explore") await mountViewer();
  refreshOffline();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

boot();
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
    e.preventDefault();
    document.getElementById("q")?.focus();
  }
});
