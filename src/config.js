export const birthdayConfig = {
  name: 'Yțy',
  age: 40,
  photos: [
    { src: 'images/birthday-photo.jpg', position: '50% 40%', alt: '{name}, într-o rochie neagră' },
    { src: 'images/birthday-city-view.jpg', position: '50% 45%', alt: '{name}, deasupra orașului' },
    { src: 'images/birthday-evening.jpg', position: '50% 85%', alt: '{name}, la o plimbare de seară' },
    { src: 'images/birthday-conference.jpg', position: '50% 25%', alt: '{name}, la o conferință' },
    { src: 'images/birthday-speaking.jpg', position: '50% 45%', alt: '{name}, în timpul unei prezentări' },
  ],
  audio: 'audio/la-multi-ani.mp3',
  texts: {
    pageTitle: '{name} · Un nou capitol',
    eyebrow: 'ASTĂZI, TOTUL E DESPRE TINE',
    subtitle: 'Patru decenii. O mulțime de amintiri. Și câteva întrebări.',
    intro: 'Nu există răspunsuri greșite. Doar răspunsuri care spun câte ceva despre tine.',
    start: 'Începem?',
    duration: '5 întrebări. Aproximativ 2 minute.',
    unlocked: 'SURPRISE UNLOCKED',
    photoTitle: '{age} looks good on you.',
    photoCaption: 'Și acesta e doar începutul.',
    galleryHint: 'Glisează pentru mai multe amintiri',
    continue: 'Mai departe ❤️',
    audioTitle: 'La mulți ani! ❤️',
    audioSubtitle: 'Un mesaj de la oamenii care țin la tine.',
    audioNote: 'Păstrează-l. Noi probabil n-o să mai fim niciodată atât de drăguți. ❤️',
    download: 'Descarcă amintirea',
    audioLoading: 'Pregătim un moment doar al tău…',
    audioMissing: 'Amintirea ta e pe drum. Revino puțin mai târziu. ❤️',
    audioRetry: 'Încearcă din nou',
  },
  sequence: [
    { text: 'Perfect.', duration: 1200 },
    { text: 'Test trecut.', duration: 1600 },
    { text: 'De fapt…', duration: 1700 },
    { text: 'Nu a fost niciodată un test.', duration: 2600 },
    { text: 'Am vrut doar să-ți amintim ceva.', duration: 3000 },
  ],
  questions: [
    {
      chapter: 'DESPRE CE CONTEAZĂ',
      question: 'Ce rămâne cel mai mult dintr-o viață frumoasă?',
      answers: ['Lucrurile pe care le-ai avut', 'Locurile în care ai fost', 'Oamenii cu care ai împărțit-o ❤️'],
      reaction: 'Good answer. ❤️',
    },
    {
      chapter: 'DESPRE OAMENII TĂI',
      question: 'Ce face ca o prietenie să reziste în timp?',
      answers: ['Să vorbești în fiecare zi', 'Să fii acolo când contează', 'Să nu uiți niciodată parolele de Netflix'],
      reaction: 'Asta voiam să auzim. 😌',
    },
    {
      chapter: 'DESPRE CE LAȘI ÎN URMĂ',
      question: 'Care crezi că este cel mai frumos lucru pe care îl poți lăsa în urma ta în oamenii pe care îi întâlnești?',
      answers: ['Amintiri', 'Zâmbete', 'Felul în care i-ai făcut să se simtă'],
      reaction: 'Unele lucruri chiar rămân.',
    },
    {
      chapter: 'DESPRE NOUL CAPITOL',
      question: 'La {age} de ani, ce crezi că devine mai important?',
      answers: ['Să ai mai mult timp', 'Să ai oamenii potriviți lângă tine', 'Să știi să te bucuri de ce ai', 'Toate de mai sus ❤️'],
      reaction: 'Exact. Sau cel puțin așa sperăm. 😄',
    },
    {
      chapter: 'DESPRE MARILE MISTERE',
      question: 'Și acum întrebarea cu adevărat importantă: ce se întâmplă după {age}?',
      answers: ['Devii mai înțeleaptă', 'Devii mai frumoasă', 'Începi să spui «pe vremea mea…»', 'Nimic. Doar durează puțin mai mult să te ridici de pe canapea. 😂'],
      reaction: 'Răspuns acceptat. Nu mai putem da timpul înapoi. 😂',
    },
  ],
};

export function personalize(text) {
  return String(text).replaceAll('{name}', birthdayConfig.name).replaceAll('{age}', birthdayConfig.age);
}

export function assetUrl(path) {
  return new URL(path.replace(/^\/+/, ''), new URL(import.meta.env.BASE_URL, document.baseURI)).href;
}
