# Yțy · 40

O experiență aniversară în română: cinci întrebări, o dezvăluire cinematografică, o galerie foto și mesaje audio. HTML/CSS/JavaScript vanilla, Vite pentru dezvoltare și build. Fără backend, conturi, analytics sau salvarea răspunsurilor.

## Local

Node.js 22.12+ și npm: `npm install`, apoi `npm run dev`. Pentru producție: `npm run build`, apoi `npm run preview`. Deschide URL-ul afișat în terminal; nu deschide HTML-ul prin dublu-click.

## Personalizare

Totul se modifică în `src/config.js`: `name`, `age`, `photos`, `audio`, `downloadUrl`, `texts`, `questions` și `sequence`. Textele acceptă `{name}` și `{age}`. Dacă schimbi vârsta, adaptează și subtitlul „Patru decenii”. Numele inițial este „Yțy”.

- Fotografii: sunt incluse toate cele cinci imagini din folderul `Poze`, în `public/images/`. Lista `photos` stabilește ordinea; fiecare intrare are `src` (fișier), `position` (încadrarea feței) și `alt` (descriere accesibilă). Cadrul în rochie neagră apare primul. Galeria permite swipe pe telefon, săgeți și tastele ←/→, Home/End; nu avansează automat. Dacă o fotografie lipsește, apare coperta cu numele și vârsta, iar navigarea funcționează în continuare. Pentru o singură fotografie, păstrează o singură intrare în listă.
- Mesaje: `public/audio/la-multi-ani.mp3` include compilarea celor 20 de mesaje (7:12, aproximativ 6,9 MB). Redarea este locală pe site, fără autoplay; fișierul este solicitat abia pe ecranul audio. Originalele din `Yty Audio` nu sunt publicate.
- „Descarcă amintirea” deschide `downloadUrl` (Google Drive) într-o filă nouă, fără să piardă progresul site-ului. Linkul rămâne disponibil și dacă redarea locală întâmpină o eroare. Păstrează accesul Drive pentru oricine are linkul. Cu `downloadUrl: ''`, butonul descarcă MP3-ul local și se dezactivează dacă acesta lipsește.
- Fiecare intrare din `questions[].answers` are `text` (răspunsul afișat) și `reaction` (mesajul personalizat pentru acea alegere). Reacțiile apar pe un ecran dedicat și avansează automat după 4 secunde. Un tap/click în zona mesajului trece mai repede, fără text sau buton vizibil. Zona este accesibilă și cu Tab, apoi Enter/Space. Schimbă `reactionDuration` în configurație (milisecunde). Fontul caligrafic Allura este inclus local; întrebările și butoanele păstrează fonturi ușor de citit.
- Folosește căi locale, de exemplu `images/birthday-photo.jpg`; acestea funcționează și sub adresa unui repository GitHub Pages.
- QR: deschide `/qr.html` (sau `/nume-repository/qr.html`), introdu URL-ul public final și descarcă PNG-ul. Generarea este locală în browser; verifică scanarea înainte de imprimare.

## Publicare

- **Vercel (varianta aleasă):** Add New → Project → importă repository-ul `cristiandespa/itzi-40` din contul GitHub conectat → Deploy. Configurația inclusă folosește `npm run build` și `dist`. Nu sunt necesare variabile de mediu. Ulterior, fiecare push pe `main` publică automat modificările.
- **Netlify:** importă repository-ul; setările sunt deja în `netlify.toml`. Sau publică folderul `dist` după build.
- **GitHub Pages:** Settings → Pages → Source: **GitHub Actions**. Workflow-ul inclus publică la fiecare push pe `main`. Adresa va fi `https://cristiandespa.github.io/itzi-40/` dacă repository-ul se numește `itzi-40`.

După schimbarea fotografiei, audio-ului sau configurației, publică din nou. `noindex` descurajează indexarea, dar nu restricționează accesul: fișierele unui site public pot fi accesate prin URL.

## Verificări

`npm test` rulează verificările de browser (la prima utilizare: `npx playwright install chromium webkit`). Acoperă fluxul complet, viewport-uri mobile/desktop/landscape, galeria cu swipe, fallback-uri, tastatură, reduced motion, redare/seek/pauză/descărcare și decodarea PNG-ului QR. Fișierele multimedia pentru teste sunt temporare, nu mesaje sau fotografii ale sărbătoritei.
