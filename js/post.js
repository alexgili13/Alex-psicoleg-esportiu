import { loadContent } from "./store.js";
import { getLang, t, ui } from "./i18n.js";
import { initTheme, toggleTheme } from "./theme.js";
import { iconSVG } from "./icons.js";

initTheme();
document.getElementById("theme-toggle").addEventListener("click", () => toggleTheme());

const LANG = getLang();
const params = new URLSearchParams(location.search);
const type = params.get("type") === "news" ? "news" : "article";
const id = params.get("id");

function fmtDate(iso){
  try{ return new Intl.DateTimeFormat(LANG === "ca" ? "ca-ES" : LANG, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso + "T00:00:00")); }
  catch(e){ return iso; }
}
function esc(str = ""){ return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

(async function init(){
  const root = document.getElementById("post-root");
  try{
    const { data } = await loadContent();
    const list = type === "news" ? data.news : data.articles;
    const item = (list || []).find(x => x.id === id && x.active);
    if (!item){
      root.innerHTML = `<div class="container" style="padding:60px 0;"><h1>No s'ha trobat el contingut</h1><p><a href="index.html">Tornar a la pàgina principal</a></p></div>`;
      return;
    }

    document.title = `${t(item.title, LANG)} — ${data.site.name}`;
    document.getElementById("page-description").content = t(item.excerpt || item.intro, LANG);
    document.getElementById("brand-name").textContent = data.site.name;
    document.getElementById("footer-copy").textContent = `© ${new Date().getFullYear()} ${data.site.name}`;
    document.getElementById("back-link").textContent = "← " + ui("back", LANG);

    const body = type === "news" ? item.content : item.body;
    const author = type === "article" ? `<span>${esc(item.author || "")}</span> · ` : "";
    const category = type === "news" ? `<span class="cat">${esc(t(item.category, LANG))}</span>` : "";

    root.innerHTML = `
      <div class="article-header container">
        <div class="meta">${category}${author}<span>${esc(fmtDate(item.date))}</span></div>
        <h1>${esc(t(item.title, LANG))}</h1>
        ${item.intro ? `<p class="intro">${esc(t(item.intro, LANG))}</p>` : ""}
      </div>
      <div class="container">
        <div class="article-cover"><img src="${item.image}" alt=""></div>
        <div class="article-body">${body ? t(body, LANG) : ""}</div>
        <div class="article-footer">
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${item.pdf ? `<a class="btn btn-ghost btn-sm" href="${item.pdf}" target="_blank" rel="noopener">${iconSVG("download")} ${esc(ui("downloadPdf", LANG))}</a>` : ""}
            ${item.video ? `<a class="btn btn-ghost btn-sm" href="${item.video}" target="_blank" rel="noopener">${iconSVG("video")} ${esc(ui("watchVideo", LANG))}</a>` : ""}
            ${(item.links || []).map(l => `<a class="btn btn-ghost btn-sm" href="${l.url || l}" target="_blank" rel="noopener">${iconSVG("link")} ${esc(l.label || ui("visitLink", LANG))}</a>`).join("")}
          </div>
          ${item.tags && item.tags.length ? `<div class="post-tags">${item.tags.map(tg => `<span>${esc(tg)}</span>`).join("")}</div>` : ""}
        </div>
      </div>`;
  }catch(err){
    console.error(err);
    root.innerHTML = `<div class="container" style="padding:60px 0;"><h1>No s'ha pogut carregar el contingut</h1><p>Serveix el lloc des d'un servidor local i comprova <code>data/content.json</code>.</p></div>`;
  }
})();
