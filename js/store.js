/* Càrrega del contingut del lloc.
   - Visita normal: es llegeix sempre data/content.json (el fitxer que puges a GitHub).
   - Mode previsualització (?preview=1, obert des de l'admin): es llegeix el
     JSON amb els canvis encara no exportats, guardat a localStorage. Això mai
     afecta la web pública real perquè només s'activa amb aquest paràmetre. */

const DRAFT_KEY = "psico_admin_draft";
const CONTENT_URL = "data/content.json";

export async function loadContent(){
  const params = new URLSearchParams(location.search);
  if (params.get("preview") === "1"){
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft){
      try { return { data: JSON.parse(draft), source: "draft" }; }
      catch(e){ console.warn("Esborrany d'admin corrupte, es carrega el contingut publicat.", e); }
    }
  }
  const res = await fetch(CONTENT_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("No s'ha pogut carregar " + CONTENT_URL);
  const data = await res.json();
  return { data, source: "file" };
}
