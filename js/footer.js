/* Peu de pàgina compartit per totes les pàgines. Es pinta segons l'idioma actiu.
   `data` és el contingut de content.json (pot ser null si encara no s'ha carregat). */

import { FOOTER_STRINGS, NAV_LABELS, t } from "./i18n.js";

const esc = (str = "") => String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function renderFooter(lang, data = null, { home = false } = {}){
  const root = document.getElementById("site-footer");
  if (!root) return;
  const s = FOOTER_STRINGS[lang] || FOOTER_STRINGS.ca;
  const nav = NAV_LABELS[lang] || NAV_LABELS.ca;
  const base = home ? "" : "index.html";
  const name = data ? data.site.name : "Àlex Gili";
  const tagline = data && data.footer ? t(data.footer.tagline, lang) : "";
  const email = data ? data.site.email : "";
  const ig = data && data.settings && data.settings.socials && data.settings.socials.instagram;
  let instagram = "";
  if (ig && ig.active){
    const username = new URL(ig.url).pathname.split("/").filter(Boolean).pop();
    instagram = `<li><a href="${esc(ig.url)}" target="_blank" rel="noopener">@${esc(username)}</a></li>`;
  }

  root.innerHTML = `
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="${home ? "#top" : "index.html"}" class="brand"><span class="dot" aria-hidden="true"></span><span>${esc(name)}</span></a>
        <p>${esc(tagline)}</p>
      </div>
      <div class="footer-col">
        <h4>${esc(s.navigation)}</h4>
        <ul>
          <li><a href="${base}#about">${esc(nav.about)}</a></li>
          <li><a href="${base}#method">${esc(nav.method)}</a></li>
          <li><a href="${base}#services">${esc(nav.services)}</a></li>
          <li><a href="${base}#contact">${esc(nav.contact)}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>${esc(s.contact)}</h4>
        <ul>
          ${email ? `<li><a href="mailto:${esc(email)}">${esc(email)}</a></li>` : ""}
          ${instagram}
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${esc(name)}</span>
      <div class="legal-links">
        <a href="privacitat.html">${esc(s.privacy)}</a>
        <a href="cookies.html">${esc(s.cookies)}</a>
        <a href="avis-legal.html">${esc(s.legal)}</a>
      </div>
    </div>
  </div>`;
}
