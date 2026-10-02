import { loadContent } from "./store.js";
import { LANGS, LANG_LABELS, NAV_LABELS, getLang, setLang, t, ui } from "./i18n.js";
import { initTheme, toggleTheme } from "./theme.js";
import { iconSVG } from "./icons.js";
import { renderFooter } from "./footer.js";

initTheme();

let CONTENT = null;
let LANG = getLang();

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function esc(str = ""){
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtDate(iso, lang = LANG){
  try{
    const d = new Date(iso + "T00:00:00");
    return new Intl.DateTimeFormat(lang === "ca" ? "ca-ES" : lang, { day: "numeric", month: "long", year: "numeric" }).format(d);
  }catch(e){ return iso; }
}

function getPath(obj, path){
  return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

/* ---------- Navegació, idioma, tema ---------- */
function renderLangSwitch(){
  const wrap = $("#lang-switch");
  wrap.innerHTML = LANGS.map(l => `<button type="button" data-lang="${l}" aria-current="${l === LANG}">${LANG_LABELS[l]}</button>`).join("");
  wrap.addEventListener("click", e => {
    const btn = e.target.closest("button[data-lang]");
    if (!btn) return;
    LANG = btn.dataset.lang;
    setLang(LANG);
    render();
  });
}

function wireNavAndTheme(){
  const header = $("#site-header");
  const hamburger = $("#hamburger");
  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    hamburger.setAttribute("aria-expanded", "false");
  };
  hamburger.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    hamburger.setAttribute("aria-expanded", String(open));
  });
  $$("#main-nav a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  $("#theme-toggle").addEventListener("click", () => toggleTheme());

  window.addEventListener("scroll", () => {
    header.style.boxShadow = window.scrollY > 8 ? "0 1px 0 var(--line)" : "none";
  }, { passive: true });

  initScrollSpy();
}

function initScrollSpy(){
  const links = $$("#main-nav a[href^='#']");
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute("href").slice(1);
    const section = document.getElementById(id);
    if (section) map.set(section, a);
  });
  if (!map.size) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        links.forEach(l => l.removeAttribute("aria-current"));
        const active = map.get(e.target);
        if (active) active.setAttribute("aria-current", "true");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  map.forEach((_, section) => io.observe(section));
}

function initReveal(){
  const els = $$(".reveal");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("is-visible"); io.unobserve(e.target); } });
  }, { threshold: .14 });
  els.forEach(el => io.observe(el));
}

/* ---------- Seccions ---------- */
function renderHero(){
  const h = CONTENT.hero, site = CONTENT.site;
  $("#brand-name").textContent = site.name;
  $("#hero-eyebrow").textContent = t(h.eyebrow, LANG);
  $("#hero-headline").textContent = t(h.headline, LANG);
  $("#hero-sub").textContent = t(h.subheadline, LANG);
  $("#hero-cta-1").textContent = t(h.ctaPrimary, LANG);
  $("#hero-cta-2").textContent = t(h.ctaSecondary, LANG);
  $("#nav-cta").textContent = t(h.ctaPrimary, LANG);
  $("#hero-image").src = h.image;
  $("#hero-image").alt = site.name + " — " + t(site.role, LANG);
  $("#hero-badge-text").textContent = t(site.role, LANG);
  $("#hero-stats").innerHTML = (h.stats || []).map(s => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(t(s.label, LANG))}</span></div>`).join("");
}

function renderAbout(){
  const a = CONTENT.about;
  $("#about-kicker").textContent = t(a.kicker, LANG);
  $("#about-title").textContent = t(a.title, LANG);
  $("#about-image").src = a.image;
  $("#about-image").alt = t(a.kicker, LANG);
  $("#about-paragraphs").innerHTML = (a.paragraphs || []).map(p => `<p>${esc(t(p, LANG))}</p>`).join("");
  $("#about-credentials").innerHTML = (a.credentials || []).map(c => `<li>${iconSVG("check")}<span>${esc(t(c, LANG))}</span></li>`).join("");
}

function renderMethod(){
  const m = CONTENT.method;
  $("#method-kicker").textContent = t(m.kicker, LANG);
  $("#method-title").textContent = t(m.title, LANG);
  $("#method-list").innerHTML = (m.steps || []).map(s => `
    <div class="method-step reveal is-visible">
      <div class="num">${String(s.number).padStart(2, "0")}</div>
      <div class="content">
        <div class="icon">${iconSVG(s.icon || "target")}</div>
        <div>
          <h3>${esc(t(s.title, LANG))}</h3>
          <p>${esc(t(s.description, LANG))}</p>
        </div>
      </div>
    </div>`).join("");
}

function renderServices(){
  const list = (CONTENT.services || []).filter(s => s.active);
  const grid = $("#services-grid");
  if (!list.length){ grid.innerHTML = `<p class="empty-state">${esc(ui("emptyResources", LANG))}</p>`; return; }
  grid.innerHTML = list.map(s => `
    <article class="service-card">
      <div class="icon">${iconSVG(s.icon || "target")}</div>
      <h3>${esc(t(s.title, LANG))}</h3>
      <p>${esc(t(s.description, LANG))}</p>
      <div class="service-meta"><span>${esc(t(s.duration, LANG))}</span><b>${esc(s.price)}</b></div>
      <a class="btn btn-ghost btn-sm" href="#contact">${esc(t(s.cta, LANG))}</a>
    </article>`).join("");
}

function renderPricing(){
  const grid = $("#pricing-grid");
  if (!grid) return;
  const list = (CONTENT.pricing || []).filter(p => p.active);
  grid.innerHTML = list.map(p => `
    <div class="price-card ${p.recommended ? "recommended" : ""}">
      ${p.recommended ? `<span class="flag">${esc(ui("recommended", LANG))}</span>` : ""}
      <h3>${esc(t(p.name, LANG))}</h3>
      <div class="amount">${esc(p.price)}</div>
      <div class="duration">${esc(t(p.duration, LANG))}</div>
      <p>${esc(t(p.description, LANG))}</p>
      <a class="btn ${p.recommended ? "btn-accent" : "btn-ghost"} btn-sm" href="#contact">${esc(t(p.cta, LANG))}</a>
    </div>`).join("");
}

let slideIndex = 0;
function renderTestimonials(){
  const list = (CONTENT.testimonials || []).filter(x => x.active);
  const wrap = $("#testimonial-slider");
  if (!list.length){ wrap.innerHTML = `<p class="empty-state">${esc(ui("noTestimonials", LANG))}</p>`; return; }
  slideIndex = Math.min(slideIndex, list.length - 1);
  wrap.innerHTML = `
    <div class="testimonial-track"><div class="testimonial-slides" id="t-slides">
      ${list.map(x => `
        <div class="t-slide">
          <blockquote>"${esc(t(x.text, LANG))}"</blockquote>
          <footer>
            <div class="testimonial-avatar ${testimonialProfileIcon(x.role)}">${iconSVG(testimonialProfileIcon(x.role))}</div>
            <div class="who"><b>${esc(x.name)}</b><span>${esc(t(x.role, LANG))}${x.club ? " · " + esc(x.club) : ""}</span></div>
          </footer>
        </div>`).join("")}
    </div></div>
    <div class="slider-controls">
      <button class="slider-btn" id="t-prev" aria-label="${esc(ui("back", LANG))}">${iconSVG("arrow-left")}</button>
      <button class="slider-btn" id="t-next" aria-label="${esc(ui("next", LANG))}">${iconSVG("arrow-right")}</button>
      <div class="slider-dots" id="t-dots">${list.map((_, i) => `<button data-i="${i}" aria-current="${i === slideIndex}" aria-label="${esc(ui("testimonial", LANG))} ${i + 1}"></button>`).join("")}</div>
    </div>`;
  applySlide();
  $("#t-prev").addEventListener("click", () => moveSlide(-1, list.length));
  $("#t-next").addEventListener("click", () => moveSlide(1, list.length));
  $$("#t-dots button").forEach(b => b.addEventListener("click", () => { slideIndex = Number(b.dataset.i); applySlide(); }));
}

function testimonialProfileIcon(role){
  const label = t(role, LANG).toLowerCase();
  if (/fam|family|famille/.test(label)) return "users";
  if (/entren|coach|coordin|entra[iî]neur|coordinateur/.test(label)) return "compass";
  return "activity";
}

function renderGallery(){
  const grid = $("#gallery-grid");
  if (!grid) return;
  const list = (CONTENT.gallery || []).filter(item => item.active && item.image);
  grid.innerHTML = list.length
    ? list.map(item => `
      <figure class="gallery-item">
        <img src="${item.image}" alt="${esc(t(item.caption, LANG) || t(CONTENT.sectionHeaders.gallery.title, LANG))}" loading="lazy">
        ${t(item.caption, LANG) ? `<figcaption>${esc(t(item.caption, LANG))}</figcaption>` : ""}
      </figure>`).join("")
    : `<p class="empty-state">${esc(LANG === "ca" ? "Properament hi trobaràs una selecció de la meva activitat professional." : LANG === "es" ? "Próximamente encontrarás una selección de mi actividad profesional." : LANG === "fr" ? "Vous trouverez bientôt une sélection de mon activité professionnelle." : "A selection of my professional work will be available here soon.")}</p>`;
}

function applySlide(){
  const track = $("#t-slides");
  if (track) track.style.transform = `translateX(-${slideIndex * 100}%)`;
  $$("#t-dots button").forEach((b, i) => b.setAttribute("aria-current", String(i === slideIndex)));
}
function moveSlide(dir, len){ slideIndex = (slideIndex + dir + len) % len; applySlide(); }

function postCard(item, type, titleField, imageField, excerptField, dateField, catField){
  const url = `post.html?type=${type}&id=${encodeURIComponent(item.id)}`;
  return `
    <a class="post-card" href="${url}">
      <div class="thumb"><img src="${item[imageField]}" alt="" loading="lazy"></div>
      <div class="post-body">
        <div class="post-meta">${catField ? `<span class="cat">${esc(t(item[catField], LANG))}</span>` : ""}<span>${esc(fmtDate(item[dateField]))}</span></div>
        <h3>${esc(t(item[titleField], LANG))}</h3>
        <p>${esc(t(item[excerptField], LANG))}</p>
        ${item.tags && item.tags.length ? `<div class="post-tags">${item.tags.map(tg => `<span>${esc(tg)}</span>`).join("")}</div>` : ""}
      </div>
    </a>`;
}

function renderArticles(){
  const grid = $("#articles-grid");
  if (!grid) return;
  const list = (CONTENT.articles || []).filter(a => a.active).sort((a, b) => b.date.localeCompare(a.date));
  grid.innerHTML = list.length
    ? list.map(a => postCard(a, "article", "title", "image", "intro", "date")).join("")
    : `<p class="empty-state">${esc(ui("emptyArticles", LANG))}</p>`;
}

function renderNews(){
  const grid = $("#news-grid");
  if (!grid) return;
  const list = (CONTENT.news || []).filter(n => n.active).sort((a, b) => b.date.localeCompare(a.date));
  grid.innerHTML = list.length
    ? list.map(n => postCard(n, "news", "title", "image", "excerpt", "date", "category")).join("")
    : `<p class="empty-state">${esc(ui("emptyNews", LANG))}</p>`;
}

function renderResources(){
  const grid = $("#resources-grid");
  if (!grid) return;
  const list = (CONTENT.resources || []).filter(r => r.active).sort((a, b) => b.date.localeCompare(a.date));
  if (!list.length){ grid.innerHTML = `<p class="empty-state">${esc(ui("emptyResources", LANG))}</p>`; return; }
  grid.innerHTML = list.map(r => `
    <div class="resource-card">
      <div class="thumb"><img src="${r.image}" alt="" loading="lazy"></div>
      <div class="meta">
        <small>${esc(t(r.category, LANG))}</small>
        <h3>${esc(t(r.name, LANG))}</h3>
        <p>${esc(t(r.description, LANG))}</p>
        <div style="margin-top:10px;display:flex;gap:10px;">
          ${r.pdf ? `<a class="btn btn-ghost btn-sm" href="${r.pdf}" target="_blank" rel="noopener">${iconSVG("download")} ${esc(ui("downloadPdf", LANG))}</a>` : ""}
          ${r.link ? `<a class="btn btn-ghost btn-sm" href="${r.link}" target="_blank" rel="noopener">${iconSVG("external")} ${esc(ui("visitLink", LANG))}</a>` : ""}
        </div>
      </div>
    </div>`).join("");
}

function renderContact(){
  const c = CONTENT.contact, site = CONTENT.site, socials = CONTENT.settings.socials;
  $("#contact-kicker").textContent = t(c.kicker, LANG);
  $("#contact-title").textContent = t(c.title, LANG);
  $("#contact-text").textContent = t(c.text, LANG);
  $("#contact-email").textContent = site.email;
  $("#contact-email").href = "mailto:" + site.email;
  const locationLabels = { ca: "Ubicació", es: "Ubicación", en: "Location", fr: "Localisation" };
  $("#contact-location-label").textContent = locationLabels[LANG] || locationLabels.ca;
  $("#contact-location").textContent = t(site.location, LANG);

  const phoneWrap = $("#contact-phone-wrap");
  if (site.phone && !/\[/.test(site.phone)){
    phoneWrap.style.display = "";
    $("#contact-phone-label").textContent = ui("phone", LANG);
    $("#contact-phone").textContent = site.phone;
    $("#contact-phone").href = "tel:" + site.phone.replace(/[^+\d]/g, "");
  } else {
    phoneWrap.style.display = "none";
  }

  const waWrap = $("#contact-whatsapp-wrap");
  const waFab = $("#wa-fab");
  if (socials.whatsapp && socials.whatsapp.active && socials.whatsapp.number){
    const num = socials.whatsapp.number.replace(/[^\d]/g, "");
    const waUrl = "https://wa.me/" + num;
    waWrap.style.display = "";
    $("#contact-whatsapp").href = waUrl;
    $("#contact-whatsapp").textContent = ui("whatsappCta", LANG);
    if (waFab){ waFab.href = waUrl; waFab.hidden = false; waFab.setAttribute("aria-label", ui("whatsapp", LANG)); }
  } else {
    waWrap.style.display = "none";
    if (waFab) waFab.hidden = true;
  }

  const igWrap = $("#contact-instagram-wrap");
  if (socials.instagram && socials.instagram.active){
    igWrap.style.display = "";
    const instagramUrl = socials.instagram.url;
    const instagramUsername = new URL(instagramUrl).pathname.split("/").filter(Boolean).pop();
    $("#contact-instagram").href = instagramUrl;
    $("#contact-instagram").textContent = "@" + instagramUsername;
  } else {
    igWrap.style.display = "none";
  }

  $("#label-name").textContent = ui("formName", LANG);
  $("#label-email").textContent = ui("formEmail", LANG);
  $("#label-subject").textContent = ui("formSubject", LANG);
  $("#label-message").textContent = ui("formMessage", LANG);
  $("#form-submit").textContent = ui("sendMessage", LANG);
  $("#form-note").textContent = c.formProvider === "mailto"
    ? (LANG === "ca" ? "En enviar, s'obrirà el teu gestor de correu amb el missatge ja preparat." : LANG === "es" ? "Al enviar, se abrirá tu gestor de correo con el mensaje preparado." : LANG === "fr" ? "L'envoi ouvrira votre messagerie avec le message prêt." : "Submitting opens your email client with the message ready.")
    : "";

  renderFooter(LANG, CONTENT, { home: true });
}

function wireContactForm(){
  const form = $("#contact-form");
  const status = $("#form-status");
  const setStatus = (msg, ok = true) => {
    if (!status) return;
    status.textContent = msg;
    status.dataset.state = ok ? "ok" : "error";
  };
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const c = CONTENT.contact, site = CONTENT.site;
    const data = Object.fromEntries(new FormData(form).entries());
    try{
      if (c.formProvider === "web3forms" && c.formEndpoint){
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_key: c.formEndpoint, ...data })
        });
        if (!res.ok) throw new Error("web3forms");
        form.reset();
        setStatus(ui("messageSent", LANG), true);
      } else if (c.formProvider === "formspree" && c.formEndpoint){
        const res = await fetch(c.formEndpoint, { method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form) });
        if (!res.ok) throw new Error("formspree");
        form.reset();
        setStatus(ui("messageSent", LANG), true);
      } else {
        const subject = encodeURIComponent(`[Web] ${data.subject}`);
        const body = encodeURIComponent(`Nom: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      }
    }catch(err){
      console.error(err);
      setStatus(ui("messageError", LANG), false);
    }
  });
}

function wireCookies(){
  const KEY = "psico_cookies_ok";
  const banner = $("#cookie-banner");
  $("#cookie-text").textContent = ui("cookieText", LANG);
  $("#cookie-accept").textContent = ui("cookieAccept", LANG);
  $("#cookie-policy").textContent = ui("cookiePolicy", LANG);
  if (!localStorage.getItem(KEY)) setTimeout(() => banner.classList.add("is-visible"), 900);
  $("#cookie-accept").addEventListener("click", () => { localStorage.setItem(KEY, "1"); banner.classList.remove("is-visible"); });
}

function renderNavLabels(){
  const labels = NAV_LABELS[LANG] || NAV_LABELS.ca;
  $$("[data-nav]").forEach(a => { if (labels[a.dataset.nav]) a.textContent = labels[a.dataset.nav]; });
}

function renderDataT(){
  $$("[data-t]").forEach(el => { el.textContent = t(getPath(CONTENT, el.dataset.t), LANG); });
}

function render(){
  document.documentElement.lang = LANG;
  renderLangSwitch();
  renderNavLabels();
  renderHero();
  renderAbout();
  renderMethod();
  renderDataT();
  renderServices();
  if ($("#pricing-grid")) renderPricing();
  renderTestimonials();
  renderGallery();
  if ($("#articles-grid")) renderArticles();
  if ($("#news-grid")) renderNews();
  if ($("#resources-grid")) renderResources();
  renderContact();
}

(async function init(){
  wireNavAndTheme();
  wireContactForm();
  try{
    const { data } = await loadContent();
    CONTENT = data;
    render();
    wireCookies();
    initReveal();
    // Les seccions es pinten per JS: cal reposicionar l'àncora un cop tenen alçada real.
    if (location.hash){
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  }catch(err){
    console.error(err);
    $("#main").innerHTML = `<div class="container" style="padding:80px 0;"><h2>No s'ha pogut carregar el contingut</h2><p>Comprova que estàs servint aquesta pàgina des d'un servidor local (no obrint l'index.html directament amb doble clic) i que el fitxer <code>data/content.json</code> existeix. Consulta el README per a instruccions.</p></div>`;
  }
})();
