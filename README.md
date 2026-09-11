# Yțy · 40

O experiență aniversară în română: cinci întrebări, o dezvăluire cinematografică, o fotografie și mesaje audio. HTML/CSS/JavaScript vanilla, Vite pentru dezvoltare și build. Fără backend, conturi, analytics sau salvarea răspunsurilor.

## Local

Node.js 22.12+ și npm: `npm install`, apoi `npm run dev`. Pentru producție: `npm run build`, apoi `npm run preview`. Deschide URL-ul afișat în terminal; nu deschide HTML-ul prin dublu-click.

## Personalizare

Totul se modifică în `src/config.js`: `name`, `age`, `photo`, `photoPosition`, `audio`, `texts`, `questions` și `sequence`. Textele acceptă `{name}` și `{age}`. Dacă schimbi vârsta, adaptează și subtitlul „Patru decenii”. Numele inițial este „Yțy”.

- Fotografie: `public/images/birthday-photo.jpg`. Pentru alt fișier, modifică doar `photo`. `photoPosition` controlează încadrarea feței. Fără fotografie apare o copertă cu numele și vârsta, fără imagine deteriorată.
- Mesaje: `public/audio/la-multi-ani.mp3`. Fișierul real nu este inclus. Până îl adaugi, playerul arată un mesaj discret și dezactivează redarea/descărcarea. Nu există autoplay.
- Folosește căi locale, de exemplu `images/birthday-photo.jpg`; acestea funcționează și sub adresa unui repository GitHub Pages.
- QR: deschide `/qr.html` (sau `/nume-repository/qr.html`), introdu URL-ul public final și descarcă PNG-ul. Generarea este locală în browser; verifică scanarea înainte de imprimare.

## Publicare

- **Vercel (varianta aleasă):** Add New → Project → importă repository-ul `cristiandespa/itzi-40` din contul GitHub conectat → Deploy. Configurația inclusă folosește `npm run build` și `dist`. Nu sunt necesare variabile de mediu. Ulterior, fiecare push pe `main` publică automat modificările.
- **Netlify:** importă repository-ul; setările sunt deja în `netlify.toml`. Sau publică folderul `dist` după build.
- **GitHub Pages:** Settings → Pages → Source: **GitHub Actions**. Workflow-ul inclus publică la fiecare push pe `main`. Adresa va fi `https://cristiandespa.github.io/itzi-40/` dacă repository-ul se numește `itzi-40`.

După schimbarea fotografiei, audio-ului sau configurației, publică din nou. `noindex` descurajează indexarea, dar nu restricționează accesul: fișierele unui site public pot fi accesate prin URL.

## Verificări

`npm test` rulează verificările de browser (la prima utilizare: `npx playwright install chromium webkit`). Acoperă fluxul complet, viewport-uri mobile/desktop/landscape, fallback-uri, tastatură, reduced motion, redare/seek/pauză/descărcare și decodarea PNG-ului QR. Fișierele multimedia pentru teste sunt temporare, nu mesaje sau fotografii ale sărbătoritei.
