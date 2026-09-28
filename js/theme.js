/* Mode fosc. Preferència guardada a localStorage; si no n'hi ha, es respecta
   prefers-color-scheme del sistema operatiu. */
const KEY = "psico_theme";

export function initTheme(){
  const saved = localStorage.getItem(KEY);
  if (saved === "dark" || saved === "light"){
    document.documentElement.setAttribute("data-theme", saved);
  }
}

export function currentTheme(){
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr) return attr;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function toggleTheme(){
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(KEY, next);
  return next;
}
