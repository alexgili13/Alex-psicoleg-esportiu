import { LANGS, LANG_LABELS } from "./i18n.js";
import { ICONS, iconSVG } from "./icons.js";

const DRAFT_KEY = "psico_admin_draft";
const CONTENT_URL = "data/content.json";

let STATE = null;
let currentPanel = "info";
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Path helpers (ex: "services.2.title.ca") ---------- */
function getAt(obj, path){
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[/^\d+$/.test(k) ? Number(k) : k]), obj);
}
function setAt(obj, path, value){
  const keys = path.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++){
    const k = /^\d+$/.test(keys[i]) ? Number(keys[i]) : keys[i];
    if (cur[k] == null) cur[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    cur = cur[k];
  }
  const last = keys[keys.length - 1];
  cur[/^\d+$/.test(last) ? Number(last) : last] = value;
}
function esc(str = ""){ return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function uid(prefix){ return prefix + "-" + Math.random().toString(36).slice(2, 8); }

/* ---------- Persistence ---------- */
async function loadState(){
  const saved = localStorage.getItem(DRAFT_KEY);
  if (saved){
    try { return JSON.parse(saved); } catch(e){ console.warn("Esborrany corrupte, es recarrega el contingut original.", e); }
  }
  const res = await fetch(CONTENT_URL, { cache: "no-store" });
  const data = await res.json();
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  return data;
}

let saveTimer = null;
function scheduleSave(){
  const ind = $("#save-indicator");
  ind.textContent = "Desant…";
  ind.classList.remove("saved");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(STATE));
    ind.textContent = "Canvis desats en aquest navegador ✓ (recorda exportar el projecte quan acabis)";
    ind.classList.add("saved");
  }, 350);
}

/* ---------- Field widgets (retornen HTML) ---------- */
function fieldWrap(label, id, inner, hint = ""){
  return `<div class="a-field"><label for="${id}">${esc(label)}${hint ? ` <span class="hint">— ${esc(hint)}</span>` : ""}</label>${inner}</div>`;
}
function textField(label, path, hint = "", type = "text"){
  const id = "f-" + path.replace(/\./g, "-");
  const val = getAt(STATE, path) ?? "";
  return fieldWrap(label, id, `<input type="${type}" id="${id}" data-bind="${path}" value="${esc(val)}">`, hint);
}
function textareaField(label, path, hint = ""){
  const id = "f-" + path.replace(/\./g, "-");
  const val = getAt(STATE, path) ?? "";
  return fieldWrap(label, id, `<textarea id="${id}" data-bind="${path}">${esc(val)}</textarea>`, hint);
}
function checkboxField(label, path){
  const id = "f-" + path.replace(/\./g, "-");
  const val = !!getAt(STATE, path);
  return `<label class="a-checkbox"><input type="checkbox" id="${id}" data-bind="${path}" ${val ? "checked" : ""}> ${esc(label)}</label>`;
}
function iconSelectField(label, path){
  const id = "f-" + path.replace(/\./g, "-");
  const val = getAt(STATE, path) || "target";
  const opts = Object.keys(ICONS).map(name => `<option value="${name}" ${name === val ? "selected" : ""}>${name}</option>`).join("");
  return fieldWrap(label, id, `<select id="${id}" data-bind="${path}">${opts}</select>`);
}
function i18nField(label, path, kind = "text", hint = ""){
  const groupId = "g-" + path.replace(/\./g, "-");
  const tabs = LANGS.map((l, i) => `<button type="button" data-lang="${l}" class="${i === 0 ? "active" : ""}">${LANG_LABELS[l]}</button>`).join("");
  const panes = LANGS.map((l, i) => {
    const p = `${path}.${l}`;
    const val = getAt(STATE, p) ?? "";
    const id = "f-" + p.replace(/\./g, "-");
    const control = kind === "textarea" || kind === "html"
      ? `<textarea id="${id}" data-bind="${p}" ${kind === "html" ? 'placeholder="Pots fer servir HTML senzill: <h2>, <p>, <a>"' : ""}>${esc(val)}</textarea>`
      : `<input type="text" id="${id}" data-bind="${p}" value="${esc(val)}">`;
    return `<div class="lang-pane ${i === 0 ? "active" : ""}" data-lang="${l}">${control}</div>`;
  }).join("");
  return `<div class="a-field"><label>${esc(label)}${hint ? ` <span class="hint">— ${esc(hint)}</span>` : ""}</label><div class="lang-tabs" data-group="${groupId}">${tabs}</div>${panes}</div>`;
}
function tagsField(label, path){
  const id = "f-" + path.replace(/\./g, "-");
  const val = (getAt(STATE, path) || []).join(", ");
  return fieldWrap(label, id, `<input type="text" id="${id}" data-bind-tags="${path}" value="${esc(val)}">`, "separades per comes");
}
function imageField(label, path){
  const id = "f-" + path.replace(/\./g, "-");
  const val = getAt(STATE, path) || "";
  const isData = val.startsWith("data:");
  return `<div class="a-field">
    <label>${esc(label)}</label>
    <div class="file-widget">
      <div class="prev">${val ? `<img src="${val}" alt="">` : "Sense imatge"}</div>
      <div class="file-info">
        <div class="file-actions">
          <label class="btn btn-ghost btn-sm" style="cursor:pointer;">Puja una imatge<input type="file" accept="image/*" data-image-input="${path}" hidden></label>
          ${isData ? `<button type="button" class="btn btn-ghost btn-sm" data-download-image="${path}">Descarregar fitxer</button>` : ""}
        </div>
        <small>${isData ? "⚠️ Previsualització local (data URL). Desa aquest fitxer a assets/images/ i substitueix la ruta de sota abans de publicar." : "Ruta relativa dins del projecte (p. ex. assets/images/foto.jpg)."}</small>
        <input type="text" id="${id}" data-bind="${path}" value="${esc(val)}" style="margin-top:8px;">
      </div>
    </div>
  </div>`;
}
function pdfField(label, path){
  const id = "f-" + path.replace(/\./g, "-");
  const val = getAt(STATE, path) || "";
  return `<div class="a-field">
    <label>${esc(label)}</label>
    <div class="file-widget">
      <div class="prev">📄</div>
      <div class="file-info">
        <div class="file-actions">
          <label class="btn btn-ghost btn-sm" style="cursor:pointer;">Tria un PDF<input type="file" accept="application/pdf" data-pdf-input="${path}" hidden></label>
        </div>
        <small>Copia manualment el fitxer PDF a la carpeta <code>assets/pdf/</code> del projecte; aquest camp només guarda la ruta.</small>
        <input type="text" id="${id}" data-bind="${path}" value="${esc(val)}" placeholder="assets/pdf/nom-del-fitxer.pdf" style="margin-top:8px;">
      </div>
    </div>
  </div>`;
}

/* ---------- Binding ---------- */
function bindInputs(root){
  $$("[data-bind]", root).forEach(el => {
    const evt = el.type === "checkbox" ? "change" : "input";
    el.addEventListener(evt, () => {
      const val = el.type === "checkbox" ? el.checked : el.value;
      setAt(STATE, el.dataset.bind, val);
      scheduleSave();
    });
  });
  $$("[data-bind-tags]", root).forEach(el => {
    el.addEventListener("input", () => {
      const arr = el.value.split(",").map(s => s.trim()).filter(Boolean);
      setAt(STATE, el.dataset.bindTags, arr);
      scheduleSave();
    });
  });
  $$(".lang-tabs", root).forEach(tabs => {
    tabs.addEventListener("click", e => {
      const btn = e.target.closest("button[data-lang]");
      if (!btn) return;
      const field = tabs.closest(".a-field");
      $$("button", tabs).forEach(b => b.classList.toggle("active", b === btn));
      $$(".lang-pane", field).forEach(p => p.classList.toggle("active", p.dataset.lang === btn.dataset.lang));
    });
  });
  $$("[data-image-input]", root).forEach(input => {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setAt(STATE, input.dataset.imageInput, reader.result);
        scheduleSave();
        renderPanel(currentPanel);
      };
      reader.readAsDataURL(file);
    });
  });
  $$("[data-download-image]", root).forEach(btn => {
    btn.addEventListener("click", () => {
      const val = getAt(STATE, btn.dataset.downloadImage);
      const a = document.createElement("a");
      a.href = val;
      a.download = "imatge-" + Date.now() + (val.includes("png") ? ".png" : val.includes("webp") ? ".webp" : ".jpg");
      a.click();
    });
  });
  $$("[data-pdf-input]", root).forEach(input => {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      setAt(STATE, input.dataset.pdfInput, "assets/pdf/" + file.name);
      scheduleSave();
      renderPanel(currentPanel);
    });
  });
}

/* ---------- Collection editor (serveis, preus, testimonis, articles, actualitat, recursos) ---------- */
function renderCollectionPanel(cfg){
  const items = getAt(STATE, cfg.key) || [];
  const rows = items.map((item, idx) => {
    const base = `${cfg.key}.${idx}`;
    const s = cfg.summary(item);
    return `<details class="collection-item" ${idx === cfg.openIndex ? "open" : ""}>
      <summary>
        <span class="title">${esc(s.title || "(sense títol)")}${item.active === false ? '<span class="badge-off">Inactiu</span>' : ""}</span>
        <span class="item-actions">
          <button type="button" class="icon-btn" data-move="up" data-idx="${idx}" title="Puja" aria-label="Puja">${iconSVG("arrow-up")}</button>
          <button type="button" class="icon-btn" data-move="down" data-idx="${idx}" title="Baixa" aria-label="Baixa">${iconSVG("arrow-down")}</button>
          <button type="button" class="icon-btn danger" data-remove="${idx}" title="Elimina" aria-label="Elimina">${iconSVG("trash")}</button>
        </span>
      </summary>
      <div class="item-body">${cfg.fields.map(f => renderField(base, f)).join("")}</div>
    </details>`;
  }).join("");

  return `
    <h2>${esc(cfg.title)}</h2>
    <p class="panel-desc">${esc(cfg.desc)}</p>
    <div class="collection-toolbar">
      <span class="hint" style="font-size:.85rem;color:var(--ink-soft);">${items.length} element(s)</span>
      <button class="btn btn-accent btn-sm" id="add-item" type="button">${iconSVG("plus")} Afegeix</button>
    </div>
    <div class="collection-list">${rows || `<p class="empty-state">Encara no hi ha cap element. Fes clic a "Afegeix".</p>`}</div>`;
}

function wireCollectionPanel(cfg){
  const panel = $("#admin-panel");
  const addBtn = $("#add-item", panel);
  if (addBtn) addBtn.addEventListener("click", () => {
    const arr = getAt(STATE, cfg.key) || [];
    arr.push(cfg.factory());
    setAt(STATE, cfg.key, arr);
    cfg.openIndex = arr.length - 1;
    scheduleSave();
    renderPanel(currentPanel);
  });
  $$("[data-remove]", panel).forEach(btn => btn.addEventListener("click", () => {
    if (!confirm("Segur que vols eliminar aquest element?")) return;
    const arr = getAt(STATE, cfg.key);
    arr.splice(Number(btn.dataset.remove), 1);
    scheduleSave();
    renderPanel(currentPanel);
  }));
  $$("[data-move]", panel).forEach(btn => btn.addEventListener("click", () => {
    const arr = getAt(STATE, cfg.key);
    const i = Number(btn.dataset.idx);
    const j = btn.dataset.move === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    scheduleSave();
    renderPanel(currentPanel);
  }));
}

function renderField(base, f){
  const path = `${base}.${f.key}`;
  switch (f.type){
    case "text": return textField(f.label, path, f.hint);
    case "textarea": return textareaField(f.label, path, f.hint);
    case "date": return textField(f.label, path, f.hint, "date");
    case "checkbox": return checkboxField(f.label, path);
    case "icon": return iconSelectField(f.label, path);
    case "i18n": return i18nField(f.label, path, "text", f.hint);
    case "i18n-area": return i18nField(f.label, path, "textarea", f.hint);
    case "i18n-html": return i18nField(f.label, path, "html", f.hint);
    case "tags": return tagsField(f.label, path);
    case "image": return imageField(f.label, path);
    case "pdf": return pdfField(f.label, path);
    default: return "";
  }
}

/* ---------- Panel configs ---------- */
const COLLECTIONS = {
  services: {
    key: "services", title: "Serveis", desc: "Contingut de demostració editable. Elimina els serveis que no ofereixis i afegeix els teus.",
    summary: item => ({ title: item.title?.ca }),
    factory: () => ({ id: uid("svc"), active: true, icon: "target", title: { ca: "", es: "", en: "", fr: "" }, description: { ca: "", es: "", en: "", fr: "" }, price: "", duration: { ca: "", es: "", en: "", fr: "" }, cta: { ca: "Contacta'm", es: "Contáctame", en: "Get in touch", fr: "Contactez-moi" } }),
    fields: [
      { type: "checkbox", key: "active", label: "Actiu (visible a la web)" },
      { type: "icon", key: "icon", label: "Icona" },
      { type: "i18n", key: "title", label: "Títol" },
      { type: "i18n-area", key: "description", label: "Descripció" },
      { type: "text", key: "price", label: "Preu (text lliure)" },
      { type: "i18n", key: "duration", label: "Durada" },
      { type: "i18n", key: "cta", label: "Text del botó" }
    ]
  },
  pricing: {
    key: "pricing", title: "Preus", desc: "Productes o packs de preus que es mostren a la secció de tarifes.",
    summary: item => ({ title: item.name?.ca }),
    factory: () => ({ id: uid("price"), active: true, recommended: false, name: { ca: "", es: "", en: "", fr: "" }, description: { ca: "", es: "", en: "", fr: "" }, price: "", duration: { ca: "", es: "", en: "", fr: "" }, cta: { ca: "Reservar", es: "Reservar", en: "Book", fr: "Réserver" } }),
    fields: [
      { type: "checkbox", key: "active", label: "Actiu (visible a la web)" },
      { type: "checkbox", key: "recommended", label: "Marcar com a recomanat" },
      { type: "i18n", key: "name", label: "Nom" },
      { type: "i18n-area", key: "description", label: "Descripció" },
      { type: "text", key: "price", label: "Preu (text lliure)" },
      { type: "i18n", key: "duration", label: "Durada" },
      { type: "i18n", key: "cta", label: "Text del botó" }
    ]
  },
  testimonials: {
    key: "testimonials", title: "Testimonis", desc: "Recorda demanar consentiment explícit abans de publicar el nom o la fotografia de cap esportista.",
    summary: item => ({ title: item.name }),
    factory: () => ({ id: uid("test"), active: true, name: "", role: { ca: "", es: "", en: "", fr: "" }, club: "", photo: "assets/images/testimonial-1.svg", text: { ca: "", es: "", en: "", fr: "" } }),
    fields: [
      { type: "checkbox", key: "active", label: "Actiu (visible a la web)" },
      { type: "text", key: "name", label: "Nom (o inicials, si prefereix anonimat)" },
      { type: "i18n", key: "role", label: "Rol / esport" },
      { type: "text", key: "club", label: "Club (opcional)" },
      { type: "image", key: "photo", label: "Fotografia (opcional)" },
      { type: "i18n-area", key: "text", label: "Testimoni" }
    ]
  },
  gallery: {
    key: "gallery", title: "Galeria", desc: "Fotografies de sessions, ponències i dinàmiques professionals. Afegeix només imatges amb els permisos corresponents.",
    summary: item => ({ title: item.caption?.ca || item.image || "Fotografia" }),
    factory: () => ({ id: uid("gallery"), active: true, image: "", caption: { ca: "", es: "", en: "", fr: "" } }),
    fields: [
      { type: "checkbox", key: "active", label: "Activa (visible a la web)" },
      { type: "image", key: "image", label: "Fotografia" },
      { type: "i18n", key: "caption", label: "Peu de foto (opcional)" }
    ]
  },
  articles: {
    key: "articles", title: "Articles", desc: "Articles llargs amb lectura dedicada. El cos admet HTML senzill (h2, p, a, ul...).",
    summary: item => ({ title: item.title?.ca }),
    factory: () => ({ id: uid("art"), active: true, date: new Date().toISOString().slice(0, 10), author: "", image: "assets/images/article-1.svg", title: { ca: "", es: "", en: "", fr: "" }, intro: { ca: "", es: "", en: "", fr: "" }, body: { ca: "", es: "", en: "", fr: "" }, tags: [], pdf: "" }),
    fields: [
      { type: "checkbox", key: "active", label: "Publicat (visible a la web)" },
      { type: "date", key: "date", label: "Data" },
      { type: "text", key: "author", label: "Autor/a" },
      { type: "image", key: "image", label: "Imatge principal" },
      { type: "i18n", key: "title", label: "Títol" },
      { type: "i18n-area", key: "intro", label: "Introducció (resum breu)" },
      { type: "i18n-html", key: "body", label: "Cos de l'article", hint: "Admet HTML: <h2>, <p>, <a>, <ul><li>" },
      { type: "tags", key: "tags", label: "Etiquetes" },
      { type: "pdf", key: "pdf", label: "PDF descarregable (opcional)" }
    ]
  },
  news: {
    key: "news", title: "Actualitat", desc: "Entrades breus: reflexions, consells, notícies o recursos.",
    summary: item => ({ title: item.title?.ca }),
    factory: () => ({ id: uid("news"), active: true, date: new Date().toISOString().slice(0, 10), category: { ca: "Reflexió", es: "Reflexión", en: "Reflection", fr: "Réflexion" }, image: "assets/images/news-1.svg", title: { ca: "", es: "", en: "", fr: "" }, excerpt: { ca: "", es: "", en: "", fr: "" }, content: { ca: "", es: "", en: "", fr: "" }, tags: [], links: [], pdf: "", video: "" }),
    fields: [
      { type: "checkbox", key: "active", label: "Publicat (visible a la web)" },
      { type: "date", key: "date", label: "Data" },
      { type: "i18n", key: "category", label: "Categoria" },
      { type: "image", key: "image", label: "Imatge" },
      { type: "i18n", key: "title", label: "Títol" },
      { type: "i18n-area", key: "excerpt", label: "Resum" },
      { type: "i18n-html", key: "content", label: "Contingut complet" },
      { type: "tags", key: "tags", label: "Etiquetes" },
      { type: "pdf", key: "pdf", label: "PDF (opcional)" },
      { type: "text", key: "video", label: "Enllaç a vídeo (opcional)" }
    ]
  },
  resources: {
    key: "resources", title: "Recursos", desc: "Biblioteca de guies, PDFs, infografies o enllaços recomanats.",
    summary: item => ({ title: item.name?.ca }),
    factory: () => ({ id: uid("res"), active: true, date: new Date().toISOString().slice(0, 10), category: { ca: "Guia", es: "Guía", en: "Guide", fr: "Guide" }, image: "assets/images/resource-1.svg", name: { ca: "", es: "", en: "", fr: "" }, description: { ca: "", es: "", en: "", fr: "" }, link: "", pdf: "" }),
    fields: [
      { type: "checkbox", key: "active", label: "Publicat (visible a la web)" },
      { type: "date", key: "date", label: "Data" },
      { type: "i18n", key: "category", label: "Categoria" },
      { type: "image", key: "image", label: "Imatge" },
      { type: "i18n", key: "name", label: "Nom" },
      { type: "i18n-area", key: "description", label: "Descripció" },
      { type: "text", key: "link", label: "Enllaç extern (opcional)" },
      { type: "pdf", key: "pdf", label: "PDF (opcional)" }
    ]
  }
};

/* ---------- Non-collection panels ---------- */
function renderInfoPanel(){
  return `
    <h2>Informació general</h2>
    <p class="panel-desc">Dades bàsiques que apareixen a la capçalera, el peu de pàgina i les metadades SEO.</p>
    ${textField("Nom i cognoms", "site.name")}
    ${i18nField("Professió / rol curt", "site.role")}
    ${textField("Email de contacte", "site.email", "", "email")}
    ${textField("Telèfon (opcional)", "site.phone")}
    ${i18nField("Ubicació / modalitat", "site.location")}
    <div class="a-row">
      ${checkboxField("Instagram actiu", "settings.socials.instagram.active")}
    </div>
    ${textField("URL d'Instagram", "settings.socials.instagram.url", "", "url")}
  `;
}

function renderHeroPanel(){
  return `
    <h2>Portada (Hero)</h2>
    <p class="panel-desc">La primera pantalla que veurà qui visiti la web.</p>
    ${i18nField("Etiqueta superior (eyebrow)", "hero.eyebrow")}
    ${i18nField("Frase principal (headline)", "hero.headline")}
    ${i18nField("Subtítol", "hero.subheadline", "html", "una o dues frases")}
    ${i18nField("Text botó principal", "hero.ctaPrimary")}
    ${i18nField("Text botó secundari", "hero.ctaSecondary")}
    ${imageField("Fotografia principal", "hero.image")}
    <h3 style="margin:26px 0 12px;font-family:var(--font-display);">Xifres destacades</h3>
    ${(getAt(STATE, "hero.stats") || []).map((s, i) => `
      <div class="a-row" style="margin-bottom:10px;">
        ${textField("Valor", `hero.stats.${i}.value`)}
        ${i18nField("Etiqueta", `hero.stats.${i}.label`)}
      </div>`).join("")}
  `;
}

function renderAboutPanel(){
  const paragraphs = getAt(STATE, "about.paragraphs") || [];
  const credentials = getAt(STATE, "about.credentials") || [];
  return `
    <h2>Qui soc</h2>
    <p class="panel-desc">Formació, trajectòria i filosofia de treball.</p>
    ${i18nField("Etiqueta superior", "about.kicker")}
    ${i18nField("Títol", "about.title")}
    ${imageField("Fotografia", "about.image")}
    <h3 style="margin:26px 0 12px;font-family:var(--font-display);">Paràgrafs</h3>
    ${paragraphs.map((p, i) => i18nField(`Paràgraf ${i + 1}`, `about.paragraphs.${i}`, "html")).join("")}
    <h3 style="margin:26px 0 12px;font-family:var(--font-display);">Titulacions / credencials</h3>
    ${credentials.map((c, i) => i18nField(`Credencial ${i + 1}`, `about.credentials.${i}`)).join("")}
  `;
}

function renderMethodPanel(){
  const steps = getAt(STATE, "method.steps") || [];
  return `
    <h2>El mètode</h2>
    <p class="panel-desc">Les fases del teu procés de treball.</p>
    ${i18nField("Etiqueta superior", "method.kicker")}
    ${i18nField("Títol de la secció", "method.title")}
    <div class="method-steps" style="margin-top:20px;">
      ${steps.map((s, i) => `
        <div class="method-edit-card">
          <div class="a-row">
            ${iconSelectField("Icona", `method.steps.${i}.icon`)}
            <div></div>
          </div>
          ${i18nField("Títol de la fase", `method.steps.${i}.title`)}
          ${i18nField("Descripció", `method.steps.${i}.description`, "textarea")}
        </div>`).join("")}
    </div>
  `;
}

function renderContactPanel(){
  return `
    <h2>Contacte</h2>
    <p class="panel-desc">Text de la secció de contacte i configuració del formulari.</p>
    ${i18nField("Etiqueta superior", "contact.kicker")}
    ${i18nField("Títol", "contact.title")}
    ${i18nField("Text introductori", "contact.text", "textarea")}
    <h3 style="margin:26px 0 12px;font-family:var(--font-display);">Formulari de contacte</h3>
    <div class="a-field">
      <label for="f-provider">Proveïdor del formulari</label>
      <select id="f-provider" data-bind="contact.formProvider">
        <option value="mailto" ${STATE.contact.formProvider === "mailto" ? "selected" : ""}>mailto (obre el correu, sense servei extern)</option>
        <option value="formspree" ${STATE.contact.formProvider === "formspree" ? "selected" : ""}>Formspree</option>
        <option value="web3forms" ${STATE.contact.formProvider === "web3forms" ? "selected" : ""}>Web3Forms</option>
      </select>
    </div>
    ${textField("Endpoint / clau del proveïdor (si escau)", "contact.formEndpoint", "URL de Formspree o Access Key de Web3Forms")}
    <div class="admin-notice visible" style="margin-top:10px;">
      Amb <b>mailto</b> no cal configurar res: en enviar el formulari s'obrirà el gestor de correu de la persona visitant amb el missatge ja redactat.
      Amb <b>Formspree</b> o <b>Web3Forms</b>, crea un compte gratuït al seu web, obtén l'endpoint/clau i enganxa'l aquí.
    </div>
  `;
}

function renderToolsPanel(){
  return `
    <h2>Eines i còpia de seguretat</h2>
    <p class="panel-desc">Com el projecte és estàtic (sense servidor), tots els canvis viuen en aquest navegador fins que els exportes i els puges a GitHub.</p>
    <div class="tools-grid">
      <div class="tool-card">
        <h3>Exportar projecte</h3>
        <p>Descarrega <code>content.json</code> amb tots els teus canvis. Substitueix el fitxer <code>data/content.json</code> del teu repositori per aquest i puja'l a GitHub.</p>
        <button class="btn btn-primary btn-sm" id="tool-export">⬇️ Exportar content.json</button>
      </div>
      <div class="tool-card">
        <h3>Importar projecte</h3>
        <p>Recupera un <code>content.json</code> exportat anteriorment (per exemple, si canvies d'ordinador).</p>
        <button class="btn btn-ghost btn-sm" id="tool-import">⬆️ Importar content.json</button>
      </div>
      <div class="tool-card">
        <h3>Restaurar contingut de demostració</h3>
        <p>Esborra els teus canvis i torna al contingut d'exemple original. Aquesta acció no es pot desfer.</p>
        <button class="btn btn-ghost btn-sm" id="tool-restore">↺ Restaurar demo</button>
      </div>
      <div class="tool-card">
        <h3>Previsualitzar la web</h3>
        <p>Obre la web pública amb els teus canvis encara no exportats, per revisar-los abans de publicar-los.</p>
        <button class="btn btn-accent btn-sm" id="tool-preview">👁️ Previsualitzar</button>
      </div>
    </div>
    <div class="admin-notice visible" style="margin-top:22px;">
      <b>Què NO inclou aquesta còpia de seguretat:</b> les imatges i PDFs que hagis "pujat" des de l'admin només viuen com a previsualització en aquest navegador (o com a ruta de text). Per publicar-los de veritat, copia els fitxers reals dins de <code>assets/images/</code> o <code>assets/pdf/</code> al teu repositori de GitHub, amb els mateixos noms que apareixen als camps de ruta.
    </div>
  `;
}

/* ---------- Router ---------- */
const PANEL_TITLES = {
  info: "Informació general", hero: "Portada (Hero)", about: "Qui soc", method: "El mètode",
  services: "Serveis", pricing: "Preus", testimonials: "Testimonis", gallery: "Galeria",
  articles: "Articles", news: "Actualitat", resources: "Recursos", contact: "Contacte i xarxes", tools: "Eines i còpia de seguretat"
};

function renderPanel(name){
  currentPanel = name;
  $$("#admin-nav button").forEach(b => b.classList.toggle("active", b.dataset.panel === name));
  $("#panel-title").textContent = PANEL_TITLES[name] || "";
  const panel = $("#admin-panel");

  if (name === "info") panel.innerHTML = renderInfoPanel();
  else if (name === "hero") panel.innerHTML = renderHeroPanel();
  else if (name === "about") panel.innerHTML = renderAboutPanel();
  else if (name === "method") panel.innerHTML = renderMethodPanel();
  else if (name === "contact") panel.innerHTML = renderContactPanel();
  else if (name === "tools") { panel.innerHTML = renderToolsPanel(); wireTools(); }
  else if (COLLECTIONS[name]) { panel.innerHTML = renderCollectionPanel(COLLECTIONS[name]); wireCollectionPanel(COLLECTIONS[name]); }

  bindInputs(panel);
}

function wireTools(){
  $("#tool-export").addEventListener("click", exportProject);
  $("#tool-import").addEventListener("click", () => $("#import-file").click());
  $("#tool-restore").addEventListener("click", restoreDemo);
  $("#tool-preview").addEventListener("click", openPreview);
}

/* ---------- Toolbar actions ---------- */
function exportProject(){
  const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "content.json";
  a.click();
  notice("Fitxer content.json descarregat. Substitueix data/content.json al teu repositori i puja els canvis a GitHub.", false);
}
async function importProject(file){
  const text = await file.text();
  try{
    const data = JSON.parse(text);
    STATE = data;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(STATE));
    renderPanel(currentPanel);
    notice("Projecte importat correctament.", false);
  }catch(e){ notice("El fitxer no és un JSON vàlid.", true); }
}
async function restoreDemo(){
  if (!confirm("Això esborrarà tots els teus canvis i tornarà al contingut de demostració. Vols continuar?")) return;
  const res = await fetch(CONTENT_URL, { cache: "no-store" });
  STATE = await res.json();
  localStorage.setItem(DRAFT_KEY, JSON.stringify(STATE));
  renderPanel(currentPanel);
  notice("Contingut de demostració restaurat.", false);
}
function openPreview(){
  localStorage.setItem(DRAFT_KEY, JSON.stringify(STATE));
  window.open("index.html?preview=1", "_blank");
}
function notice(msg, warn){
  const el = $("#admin-notice");
  el.textContent = msg;
  el.className = "admin-notice visible" + (warn ? " warn" : "");
  setTimeout(() => el.classList.remove("visible"), 6000);
}

/* ---------- Init ---------- */
(async function init(){
  try{
    STATE = await loadState();
  }catch(e){
    console.error(e);
    $("#admin-panel").innerHTML = `<p>No s'ha pogut carregar <code>data/content.json</code>. Serveix aquesta pàgina des d'un servidor local (mira el README) i torna-ho a provar.</p>`;
    return;
  }

  $("#admin-nav").addEventListener("click", e => {
    const btn = e.target.closest("button[data-panel]");
    if (btn) renderPanel(btn.dataset.panel);
  });
  $("#btn-preview").addEventListener("click", openPreview);
  $("#btn-export").addEventListener("click", exportProject);
  $("#btn-import").addEventListener("click", () => $("#import-file").click());
  $("#import-file").addEventListener("change", e => { if (e.target.files[0]) importProject(e.target.files[0]); });

  renderPanel("info");
})();
