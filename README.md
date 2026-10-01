# Web professional — Psicòleg esportiu

Web estàtica (HTML + CSS + JavaScript, sense backend) amb un petit editor de
contingut (`admin.html`) perquè puguis actualitzar textos, imatges, articles,
serveis, preus i testimonis sense tocar el codi.

Aquest document està pensat per a **algú sense coneixements de programació**.
Segueix-lo pas a pas.

---

## 0. Com funciona això, en dues frases

- La web pública (`index.html`) mostra el contingut que hi ha al fitxer
  **`data/content.json`**.
- El panell `admin.html` és un editor visual d'aquest mateix fitxer: els
  canvis es guarden automàticament **al teu navegador** (localStorage) i, quan
  estàs content amb el resultat, prems **"Exportar projecte"** per descarregar
  el `content.json` actualitzat i pujar-lo a GitHub.

GitHub Pages només serveix fitxers; no pot executar programes al servidor. Per
això l'edició de contingut no es "guarda a internet" automàticament — es
guarda al teu navegador i tu ets qui la publica, exportant i pujant el fitxer.
Això és el disseny més segur i senzill per a una web sense servidor.

---

## 1. Descarregar el projecte i provar-lo en local

Els navegadors bloquegen la lectura de `data/content.json` quan obres
`index.html` fent doble clic (protocol `file://`). Cal servir els fitxers amb
un petit servidor local — és un sol pas i no cal instal·lar res complicat.

**Opció A — amb Python (normalment ja instal·lat a Mac/Linux):**
```bash
cd nom-de-la-carpeta-del-projecte
python3 -m http.server 8000
```
Obre després `http://localhost:8000/` al navegador.

**Opció B — amb Node.js:**
```bash
cd nom-de-la-carpeta-del-projecte
npx serve .
```

**Opció C — extensió d'editor:** si utilitzes Visual Studio Code, instal·la
l'extensió "Live Server" i prem "Go Live".

Un cop vegis la web funcionant a `localhost`, ja pots editar-la.

---

## 2. Editar el contingut amb l'admin

1. Amb el servidor local en marxa, obre `http://localhost:8000/admin.html`.
2. Al menú de l'esquerra, tria la secció que vulguis editar (Informació
   general, Portada, Qui soc, Mètode, Serveis, Preus, Testimonis, Galeria,
   Articles, Actualitat, Recursos, Contacte).
3. Escriu els teus textos. Els camps amb pestanyes **CAT | ES | EN | FR**
   tenen una versió per idioma — pots deixar-ne alguna buida i es mostrarà el
   text en català per defecte.
4. Els canvis es desen automàticament en aquest navegador (ho veuràs al
   missatge de sota del títol de cada secció).
5. Prem **"👁️ Previsualitzar web"** en qualsevol moment per veure com queda
   la web pública amb els teus canvis encara no publicats.
6. Quan estiguis satisfet/a, prem **"⬇️ Exportar projecte"**. Es descarregarà
   un fitxer `content.json`.
7. Substitueix el fitxer `data/content.json` del projecte pel que acabes de
   descarregar.
8. Puja el canvi a GitHub (secció 6). La web pública quedarà actualitzada.

> ⚠️ Si tanques el navegador o esborres les seves dades sense haver exportat,
> perdràs els canvis no publicats. Exporta sovint.

### Crear, editar, eliminar i reordenar
A les seccions amb llistes (Serveis, Preus, Testimonis, Galeria, Articles,
Actualitat, Recursos):
- **➕ Afegeix** crea un element nou en blanc.
- Fes clic sobre un element de la llista per desplegar-ne els camps.
- Les fletxes ↑ ↓ el reordenen; la paperera l'elimina (demana confirmació).
- La casella **"Actiu"** decideix si es mostra a la web pública o no — així
  pots preparar contingut sense publicar-lo encara.

---

## 3. Fotografies: com funcionen

GitHub Pages no permet que el navegador "pugi" fitxers a un servidor: només
serveix fitxers que ja existeixen dins del repositori. Per això, l'editor
funciona així:

1. A qualsevol camp d'imatge, prem **"Puja una imatge"** i tria-la del teu
   ordinador. Es mostra a l'instant a la previsualització (queda guardada
   temporalment com a "data URL" dins del navegador).
2. Apareixerà un avís: *"Previsualització local — desa aquest fitxer a
   assets/images/"*. Prem **"Descarregar fitxer"** per baixar-lo al teu
   ordinador.
3. Mou aquest fitxer descarregat dins la carpeta `assets/images/` del
   projecte (posa-li un nom clar, per exemple `jo-hero.jpg`).
4. Al camp de text que hi ha sota la imatge, escriu la ruta final, per
   exemple: `assets/images/jo-hero.jpg`.
5. Exporta el projecte i puja tant el `content.json` com la nova imatge a
   GitHub.

Si no fas el pas 3-4, la imatge només es veurà en la previsualització del teu
navegador, no a la web publicada — perquè el fitxer real encara no existeix
al repositori.

## 4. PDFs

Igual que amb les imatges, el camp de PDF només guarda una **ruta de text**
(per exemple `assets/pdf/guia-respiracio.pdf`). Tu has de:

1. Guardar el PDF real dins de la carpeta `assets/pdf/` del projecte, amb
   aquest mateix nom.
2. Escriure la ruta corresponent al camp de l'admin.
3. Pujar tant el PDF com el `content.json` actualitzat a GitHub.

---

## 5. Publicar articles i entrades d'actualitat

- **Articles**: pensats per a textos llargs, amb imatge de portada, autor,
  introducció i cos (admet HTML senzill: `<h2>`, `<p>`, `<a href="...">`,
  `<ul><li>`).
- **Actualitat**: entrades més breus (reflexions, consells, notícies),
  amb categoria, resum i contingut, i camps opcionals per enllaçar un PDF o
  un vídeo.

Ambdós es mostren amb una pàgina de lectura pròpia (`post.html`), a la qual
s'hi arriba fent clic des de les targetes de la pàgina principal.

---

## 6. Publicar-ho a GitHub Pages

1. Crea un compte a [github.com](https://github.com) si no en tens.
2. Crea un repositori nou (per exemple `la-meva-web-psicologia`), públic.
3. Puja-hi **tots** els fitxers i carpetes d'aquest projecte (pots arrossegar
   la carpeta sencera des de la interfície web de GitHub, secció "Add file →
   Upload files", o utilitzar Git si ja el coneixes).
4. Al repositori, ves a **Settings → Pages**.
5. A "Build and deployment" → "Source", selecciona **"Deploy from a branch"**.
6. A "Branch", selecciona `main` (o `master`) i la carpeta `/ (root)`.
   Desa els canvis.
7. Espera un o dos minuts. GitHub et mostrarà la URL final, amb aquest format:
   `https://el-teu-usuari.github.io/nom-del-repositori/`
8. Torna a `index.html` i `post.html` i actualitza els camps
   `[EL-TEU-USUARI]` / `[NOM-REPO]` de les etiquetes `<link rel="canonical">`
   i `og:url` / `og:image` amb aquesta URL real (és només per a xarxes
   socials i SEO; la web funciona igualment sense fer-ho).

### Actualitzar la web més endavant
Cada cop que exportis canvis des de l'admin, només cal:
1. Substituir `data/content.json` (i afegir imatges/PDFs nous si en tens).
2. Pujar aquests fitxers al mateix repositori de GitHub (Upload files, o
   `git add` + `git commit` + `git push` si fas servir Git).
3. GitHub Pages es torna a publicar sol en un o dos minuts.

---

## 7. Còpies de seguretat

Des de la secció **"Eines i còpia de seguretat"** de l'admin:
- **Exportar projecte**: descarrega tot el contingut editable en un únic
  `content.json`. Guarda'n còpies datades de tant en tant.
- **Importar projecte**: recupera un `content.json` exportat abans.
- **Restaurar contingut de demo**: torna a l'estat inicial d'exemple
  (esborra els teus canvis; no es pot desfer).

**Què NO inclou el `content.json`:** les imatges i els PDFs reals. Aquests
fitxers viuen a `assets/images/` i `assets/pdf/` i s'han de conservar (o fer
còpia) per separat, per exemple guardant tota la carpeta del projecte en un
disc extern o repositori privat addicional.

---

## 8. Modificar colors i tipografia

Tots els colors estan definits com a variables CSS a l'inici del fitxer
`css/styles.css`, dins de `:root { ... }` (mode clar) i
`:root[data-theme="dark"] { ... }` (mode fosc). Canvia els valors hexadecimals
(per exemple `--accent: #B9852A;`) i tota la web s'actualitzarà.

Les tipografies (`Big Shoulders Display` per a titulars, `Inter` pel cos de
text) es carreguen des de Google Fonts a la capçalera de cada pàgina HTML;
pots substituir-les per unes altres seguint el mateix patró.

---

## 9. Idiomes

L'arquitectura de continguts ja preveu 4 idiomes (`ca`, `es`, `en`, `fr`): la
majoria de camps del `content.json` són objectes `{ "ca": "...", "es": "...",
"en": "...", "fr": "..." }`. El contingut de demostració està escrit
íntegrament en català; els textos de la interfície (botons, etiquetes) ja
estan traduïts als 4 idiomes a `js/i18n.js`. Per completar les traduccions del
teu propi contingut, edita cada pestanya d'idioma des de l'admin.

---

## 10. Limitacions importants (llegeix-ho abans de publicar)

- **Sense backend**: el formulari de contacte no "envia" res per si sol.
  Per defecte utilitza `mailto:` (obre el gestor de correu de qui visita la
  web). Si vols rebre els missatges directament sense que la persona hagi
  d'enviar un correu, configura un proveïdor extern gratuït com
  [Formspree](https://formspree.io) o [Web3Forms](https://web3forms.com) des
  de la secció "Contacte" de l'admin.
- **Sense autenticació real**: `admin.html` no té contrasenya ni sistema de
  login. Qualsevol persona amb accés a l'URL `/admin.html` del teu lloc en
  producció podria veure el panell (encara que no pugui publicar canvis sense
  accés al teu GitHub). Si vols mantenir-lo privat, no enllacis mai
  `admin.html` des de la web pública i considera no pujar-lo al mateix
  repositori públic, o utilitza un repositori privat amb Pages (requereix pla
  de pagament de GitHub) o allotja `admin.html` en un lloc separat i protegit.
- **Dades sensibles**: no publiquis testimonis, noms d'esportistes o detalls
  de casos sense el consentiment exprés de la persona implicada. Els
  continguts de "Clients" i "Testimonis" venen marcats com a DEMO;
   substitueix-los amb cura.
- **Legal**: `privacitat.html`, `cookies.html` i `avis-legal.html` són
  plantilles genèriques amb camps entre claudàtors. Revisa-les amb un
  professional abans de publicar-les; no és assessorament legal.

---

## 11. Estructura del projecte

```
/
├── index.html              → pàgina principal
├── post.html                → lectura d'un article o entrada d'actualitat
├── admin.html                → panell d'edició de contingut
├── privacitat.html / cookies.html / avis-legal.html → plantilles legals
├── css/
│   ├── styles.css            → estils de la web pública
│   └── admin.css             → estils del panell d'admin
├── js/
│   ├── site.js                → renderitza la pàgina principal
│   ├── post.js                → renderitza articles/actualitat
│   ├── admin.js                → lògica de l'editor
│   ├── store.js                → càrrega de content.json / esborrany
│   ├── i18n.js                  → traduccions de la interfície
│   ├── theme.js                 → mode fosc
│   └── icons.js                  → icones SVG en línia
├── data/
│   └── content.json          → TOT el contingut editable de la web
├── assets/
│   ├── images/                 → fotografies i logos (placeholders inclosos)
│   ├── pdf/                     → PDFs descarregables
│   └── icons/
└── README.md
```

**Per què aquesta estructura?** Un únic fitxer `content.json` fa que
l'admin i la web pública llegeixin exactament la mateixa font de veritat,
sense duplicar dades ni necessitar una base de dades. Els mòduls JavaScript
estan separats per responsabilitat (idioma, tema, dades, renderitzat) perquè
siguin fàcils de mantenir i ampliar.

---

Qualsevol dubte tècnic addicional, revisa els comentaris dins de cada fitxer
`.js` — estan pensats per orientar-te encara que no programis habitualment.
