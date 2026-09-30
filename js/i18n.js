/* Gestió d'idioma. Cada camp de contingut multi-idioma és un objecte
   { ca, es, en, fr }. Aquest mòdul en tria el valor segons l'idioma actiu,
   amb el català com a idioma de reserva (fallback). */

export const LANGS = ["ca", "es", "en", "fr"];
export const LANG_LABELS = { ca: "CAT", es: "ES", en: "EN", fr: "FR" };
const STORAGE_KEY = "psico_lang";

export function getLang(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && LANGS.includes(saved)) return saved;
  const nav = (navigator.language || "ca").slice(0, 2);
  return LANGS.includes(nav) ? nav : "ca";
}

export function setLang(lang){
  if (!LANGS.includes(lang)) return;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

/** Tradueix un camp multi-idioma. Accepta objectes {ca,es,en,fr} o strings planes. */
export function t(field, lang = getLang()){
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.ca || field.es || field.en || field.fr || "";
}

export const NAV_LABELS = {
  ca: { about: "Qui soc", method: "Mètode", services: "Serveis", clients: "Processos compartits", testimonials: "Valoracions", articles: "Articles", news: "Actualitat", resources: "Recursos", contact: "Contacte" },
  es: { about: "Quién soy", method: "Método", services: "Servicios", clients: "Procesos compartidos", testimonials: "Valoraciones", articles: "Artículos", news: "Actualidad", resources: "Recursos", contact: "Contacto" },
  en: { about: "About", method: "Method", services: "Services", clients: "Shared processes", testimonials: "Testimonials", articles: "Articles", news: "Updates", resources: "Resources", contact: "Contact" },
  fr: { about: "Qui suis-je", method: "Méthode", services: "Services", clients: "Processus partagés", testimonials: "Témoignages", articles: "Articles", news: "Actualités", resources: "Ressources", contact: "Contact" }
};

export const UI_STRINGS = {
  ca: {
    readMore: "Llegir més", back: "Tornar", next: "Següent", testimonial: "Testimoni", allArticles: "Tots els articles", allNews: "Tota l'actualitat",
    downloadPdf: "Descarregar PDF", visitLink: "Obrir enllaç", watchVideo: "Veure vídeo",
    demo: "DEMO", recommended: "Recomanat", sendMessage: "Enviar missatge",
    formName: "Nom", formEmail: "Email", formSubject: "Assumpte", formMessage: "Missatge",
    messageSent: "Missatge enviat. Gràcies!", messageError: "No s'ha pogut enviar. Torna-ho a provar o escriu-me per email.",
    phone: "Telèfon", whatsapp: "WhatsApp", whatsappCta: "Escriu-me per WhatsApp",
    cookieText: "Utilitzem només cookies tècniques necessàries per al funcionament de la web (per exemple, per recordar la teva preferència de mode fosc i idioma). No fem servir cookies de seguiment ni analítica de tercers.",
    cookieAccept: "D'acord", cookiePolicy: "Més informació",
    emptyNews: "Encara no hi ha entrades publicades.", emptyArticles: "Encara no hi ha articles publicats.",
    emptyResources: "Encara no hi ha recursos publicats.", noTestimonials: "Encara no hi ha testimonis publicats."
  },
  es: {
    readMore: "Leer más", back: "Volver", next: "Siguiente", testimonial: "Testimonio", allArticles: "Todos los artículos", allNews: "Toda la actualidad",
    downloadPdf: "Descargar PDF", visitLink: "Abrir enlace", watchVideo: "Ver vídeo",
    demo: "DEMO", recommended: "Recomendado", sendMessage: "Enviar mensaje",
    formName: "Nombre", formEmail: "Email", formSubject: "Asunto", formMessage: "Mensaje",
    messageSent: "Mensaje enviado. ¡Gracias!", messageError: "No se ha podido enviar. Inténtalo de nuevo o escríbeme por email.",
    phone: "Teléfono", whatsapp: "WhatsApp", whatsappCta: "Escríbeme por WhatsApp",
    cookieText: "Solo usamos cookies técnicas necesarias para el funcionamiento de la web (por ejemplo, para recordar tu preferencia de modo oscuro e idioma). No usamos cookies de seguimiento ni analítica de terceros.",
    cookieAccept: "De acuerdo", cookiePolicy: "Más información",
    emptyNews: "Todavía no hay entradas publicadas.", emptyArticles: "Todavía no hay artículos publicados.",
    emptyResources: "Todavía no hay recursos publicados.", noTestimonials: "Todavía no hay testimonios publicados."
  },
  en: {
    readMore: "Read more", back: "Back", next: "Next", testimonial: "Testimonial", allArticles: "All articles", allNews: "All updates",
    downloadPdf: "Download PDF", visitLink: "Open link", watchVideo: "Watch video",
    demo: "DEMO", recommended: "Recommended", sendMessage: "Send message",
    formName: "Name", formEmail: "Email", formSubject: "Subject", formMessage: "Message",
    messageSent: "Message sent. Thank you!", messageError: "Could not send. Please try again or email me.",
    phone: "Phone", whatsapp: "WhatsApp", whatsappCta: "Message me on WhatsApp",
    cookieText: "We only use technical cookies needed for the site to work (for example, to remember your dark mode and language preference). We do not use third-party tracking or analytics cookies.",
    cookieAccept: "Got it", cookiePolicy: "Learn more",
    emptyNews: "No updates published yet.", emptyArticles: "No articles published yet.",
    emptyResources: "No resources published yet.", noTestimonials: "No testimonials published yet."
  },
  fr: {
    readMore: "Lire la suite", back: "Retour", next: "Suivant", testimonial: "Témoignage", allArticles: "Tous les articles", allNews: "Toute l'actualité",
    downloadPdf: "Télécharger le PDF", visitLink: "Ouvrir le lien", watchVideo: "Voir la vidéo",
    demo: "DÉMO", recommended: "Recommandé", sendMessage: "Envoyer le message",
    formName: "Nom", formEmail: "Email", formSubject: "Sujet", formMessage: "Message",
    messageSent: "Message envoyé. Merci !", messageError: "Échec de l'envoi. Réessayez ou écrivez-moi par email.",
    phone: "Téléphone", whatsapp: "WhatsApp", whatsappCta: "Écrivez-moi sur WhatsApp",
    cookieText: "Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du site. Aucun cookie de suivi tiers.",
    cookieAccept: "D'accord", cookiePolicy: "En savoir plus",
    emptyNews: "Aucune actualité publiée pour le moment.", emptyArticles: "Aucun article publié pour le moment.",
    emptyResources: "Aucune ressource publiée pour le moment.", noTestimonials: "Aucun témoignage publié pour le moment."
  }
};

export function ui(key, lang = getLang()){
  return (UI_STRINGS[lang] && UI_STRINGS[lang][key]) || UI_STRINGS.ca[key] || key;
}
