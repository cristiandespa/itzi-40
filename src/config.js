export const birthdayConfig = {
  name: 'Yțy',
  age: 40,
  reactionDuration: 4000,
  photos: [
    { src: 'images/birthday-photo.jpg', position: '50% 40%', alt: '{name}, într-o rochie neagră' },
    { src: 'images/birthday-city-view.jpg', position: '50% 45%', alt: '{name}, deasupra orașului' },
    { src: 'images/birthday-evening.jpg', position: '50% 85%', alt: '{name}, la o plimbare de seară' },
    { src: 'images/birthday-conference.jpg', position: '50% 25%', alt: '{name}, la o conferință' },
    { src: 'images/birthday-speaking.jpg', position: '50% 45%', alt: '{name}, în timpul unei prezentări' },
  ],
  audio: 'audio/la-multi-ani.mp3',
  texts: {
    pageTitle: '{name} · Povestea continuă',
    eyebrow: 'ASTĂZI, TOTUL E DESPRE TINE',
    subtitle: 'Patru decenii. O mulțime de amintiri. Și câteva întrebări.',
    intro: 'Nu există răspunsuri greșite. Doar răspunsuri care spun câte ceva despre tine.',
    start: 'Începem?',
    duration: '5 întrebări. Aproximativ 2 minute.',
    reactionContinue: 'Continuă',
    unlocked: 'SURPRISE UNLOCKED',
    photoTitle: '{age} looks good on you.',
    photoCaption: 'Și acesta e doar începutul.',
    galleryHint: 'Glisează pentru mai multe amintiri',
    continue: 'Mai departe ❤️',
    audioTitle: 'La mulți ani! ❤️',
    audioQuote: 'Viața chiar începe cu adevărat la {age} de ani. Până atunci faci cercetare.',
    audioPlayerLabel: 'Câteva voci de la oamenii care țin la tine',
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
      answers: [
        { text: 'Lucrurile pe care le-ai avut', reaction: 'Mai ales cele care vin cu o poveste.' },
        { text: 'Locurile în care ai fost', reaction: 'Unele locuri rămân cu tine mult după ce pleci.' },
        { text: 'Oamenii cu care ai împărțit-o ❤️', reaction: 'Cu oamenii potriviți, și zilele obișnuite devin amintiri. ❤️' },
      ],
    },
    {
      chapter: 'DESPRE OAMENII TĂI',
      question: 'Ce face ca o prietenie să reziste în timp?',
      answers: [
        { text: 'Să vorbești în fiecare zi', reaction: 'Un «ce faci?» care se transformă în două ore de povești.' },
        { text: 'Să fii acolo când contează', reaction: 'Uneori, un «sunt aici» spune tot. ❤️' },
        { text: 'Să nu uiți niciodată parolele de Netflix', reaction: 'Încredere, loialitate și acces la sezonul următor. 😄' },
      ],
    },
    {
      chapter: 'DESPRE CE LAȘI ÎN URMĂ',
      question: 'Care crezi că este cel mai frumos lucru pe care îl poți lăsa în urma ta în oamenii pe care îi întâlnești?',
      answers: [
        { text: 'Amintiri', reaction: 'Cele care încep cu «mai ții minte când…?»' },
        { text: 'Zâmbete', reaction: 'Și uite-așa, ziua cuiva devine un pic mai frumoasă.' },
        { text: 'Felul în care i-ai făcut să se simtă', reaction: 'Văzuți. Ascultați. Iubiți. Asta nu se uită.' },
      ],
    },
    {
      chapter: 'DESPRE NOUL CAPITOL',
      question: 'La {age} de ani, ce crezi că devine mai important?',
      answers: [
        { text: 'Să ai mai mult timp', reaction: 'Pentru tine. Pentru ai tăi. Pentru încă o poveste.' },
        { text: 'Să ai oamenii potriviți lângă tine', reaction: 'Cei lângă care poți fi tu. Fără filtre. ❤️' },
        { text: 'Să știi să te bucuri de ce ai', reaction: 'O cafea bună. O masă împreună. O zi fără grabă.' },
        { text: 'Toate de mai sus ❤️', reaction: 'Le luăm pe toate. La {age} știm ce vrem. 😄' },
      ],
    },
    {
      chapter: 'DESPRE MARILE MISTERE',
      question: 'Și acum întrebarea cu adevărat importantă: ce se întâmplă după {age}?',
      answers: [
        { text: 'Devii mai înțeleaptă', reaction: 'Mai înțeleaptă, da. Mai cuminte? Nu promitem.' },
        { text: 'Devii mai frumoasă', reaction: 'În cazul tău, avem deja dovezi. ❤️' },
        { text: 'Începi să spui «pe vremea mea…»', reaction: 'Și, partea gravă, începi să ai și dreptate. 😂' },
        { text: 'Nimic. Doar durează puțin mai mult să te ridici de pe canapea. 😂', reaction: 'Nu e vârsta. E o relație tot mai serioasă cu canapeaua. 😂' },
      ],
    },
  ],
};

export function personalize(text) {
  return String(text).replaceAll('{name}', birthdayConfig.name).replaceAll('{age}', birthdayConfig.age);
}

export function assetUrl(path) {
  return new URL(path.replace(/^\/+/, ''), new URL(import.meta.env.BASE_URL, document.baseURI)).href;
}
