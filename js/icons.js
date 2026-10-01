/* Petita llibreria d'icones SVG en línia (sense dependències externes). */
export const ICONS = {
  connect: '<circle cx="7.5" cy="12" r="3.5"/><circle cx="16.5" cy="12" r="3.5"/><path d="M10.5 10.5l3-3M10.5 13.5l3 3"/>',
  focus: '<path d="M3 12s3.2-5 9-5 9 5 9 5-3.2 5-9 5-9-5-9-5z"/><circle cx="12" cy="12" r="2.2"/>',
  build: '<path d="M4 19h16M5 15h5v4H5zM10 11h5v4h-5zM15 7h4v4h-4z"/>',
  train: '<path d="M4 18l5-5 3 2 7-8"/><path d="M15 7h4v4"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/>',
  release: '<circle cx="12" cy="12" r="2.5"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
  presentation: '<rect x="4" y="5" width="16" height="11" rx="1"/><path d="M12 16v4M8 20h8M8 9h8M8 12h5"/>',
  podium: '<path d="M5 20h14M7 20v-6h4v6M13 20V9h4v11M10 14h3"/><circle cx="15" cy="5" r="2"/><path d="M15 7v2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 5-5 2 2-5z"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor" stroke="none"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1.2-3.3 3.8-5 6.5-5s5.3 1.7 6.5 5"/><circle cx="17.5" cy="9" r="2.8"/><path d="M15 20c.7-2.4 2.2-4 4-4.6"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h13l-3 4 3 4H5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
  location: '<path d="M12 21s7-6.3 7-12a7 7 0 10-14 0c0 5.7 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>',
  phone: '<path d="M6 3h3l2 5-2.5 1.5a12 12 0 006 6L16 13l5 2v3a2 2 0 01-2.2 2A17 17 0 014 5.2 2 2 0 016 3z"/>',
  whatsapp: '<path d="M12 3a9 9 0 00-7.7 13.6L3 21l4.6-1.2A9 9 0 1012 3z"/><path d="M8.5 8.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3-.1.5.3.6.8 1.3 1.4 1.8.5.4 1 .7 1.4.9.2.1.4 0 .5-.1l.6-.6c.2-.2.4-.2.6-.1l1.5.8c.3.2.4.4.4.6 0 .8-.6 1.5-1.3 1.6-.6.1-1.3.2-3.3-.7-2.4-1.1-3.9-3.6-4-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2z" fill="currentColor" stroke="none"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1110 3.5 6.8 6.8 0 0020 14.5z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
  'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19h16"/>',
  external: '<path d="M7 17L17 7M9 7h8v8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-9 0l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"/>',
  edit: '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/>',
  upload: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 19h16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
  link: '<path d="M9 15l6-6"/><path d="M13 6l1.5-1.5a3.5 3.5 0 015 5L18 11"/><path d="M11 18l-1.5 1.5a3.5 3.5 0 01-5-5L6 13"/>'
};

export function iconSVG(name, cls = ''){
  const body = ICONS[name] || ICONS.check;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
