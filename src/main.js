import '@fontsource/allura/latin-400.css';
import '@fontsource/allura/latin-ext-400.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-ext-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-ext-400-italic.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-ext-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-ext-500.css';
import './styles.css';
import { birthdayConfig as config, personalize } from './config.js';
import { icon } from './icons.js';
import { setupFestive, celebrate } from './festive.js';
import { createAudioPlayer } from './player.js';
import { createPhotoGallery } from './gallery.js';

const main = document.querySelector('#experience');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const text = config.texts;
let questionIndex = 0;
let transitionPending = false;

const escapeHtml = (value) => personalize(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const displayText = (value) => escapeHtml(value).replace(/[\p{L}\p{M}]+(?:-[\p{L}\p{M}]+)+/gu, '<span class="keep-together">$&</span>');
const elegantText = (value) => displayText(value).replaceAll('❤️', '<span class="inline-heart" aria-hidden="true">♥</span><span class="sr-only">❤️</span>');
const sleep = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

async function showScreen(content, screenName, focus = true) {
  const previous = main.firstElementChild;
  if (previous) {
    previous.classList.add('leaving');
    await sleep(reducedMotion.matches ? 0 : 220);
  }
  document.body.dataset.screen = screenName;
  main.innerHTML = content;
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (focus) main.querySelector('[data-focus]')?.focus({ preventScroll: true });
}

function renderLanding() {
  showScreen(`<section class="screen landing" aria-labelledby="landing-title">
    <p class="eyebrow">${escapeHtml(text.eyebrow)}</p>
    <div class="age-composition"><span class="age-side">UN NOU CAPITOL</span><h1 id="landing-title" class="hero-age">${config.age}<span>.</span></h1><span class="age-sparkle" aria-hidden="true"></span><span class="age-side age-side-right">ACEIAȘI OCHI. ALTĂ POVESTE.</span></div>
    <h2 class="landing-subtitle">${escapeHtml(text.subtitle)}</h2>
    <div class="little-divider" aria-hidden="true"><span></span>✧<span></span></div>
    <p class="intro">${displayText(text.intro)}</p>
    <button class="button primary" id="start">${escapeHtml(text.start)}${icon('arrow')}</button>
    <p class="duration">${escapeHtml(text.duration)}</p>
  </section>`, 'landing', false);
  main.querySelector('#start').addEventListener('click', () => {
    if (transitionPending) return;
    transitionPending = true;
    renderQuestion();
  });
}

async function renderQuestion() {
  const question = config.questions[questionIndex];
  const total = config.questions.length;
  await showScreen(`<section class="screen quiz" aria-labelledby="question-title">
    <div class="quiz-progress"><span class="eyebrow">CÂTE PUȚIN DESPRE TINE</span><span class="progress-count" aria-label="Întrebarea ${questionIndex + 1} din ${total}">${questionIndex + 1}<span> / ${total}</span></span></div>
    <div class="progress-track" role="progressbar" aria-label="Progresul întrebărilor" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${questionIndex + 1}"><span style="width:${((questionIndex + 1) / total) * 100}%"></span></div>
    <p class="chapter">${escapeHtml(question.chapter)}</p>
    <h1 id="question-title" class="question-title" tabindex="-1" data-focus>${displayText(question.question)}</h1>
    <div class="answers" role="group" aria-labelledby="question-title">${question.answers.map((answer, index) => `<button class="answer" aria-pressed="false" data-answer="${index}"><span class="answer-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span>${displayText(answer)}</span><span class="answer-check">${icon('check')}</span></button>`).join('')}</div>
    <span class="quiz-footnote">Doar tu. Așa cum ești.</span>
  </section>`, 'quiz');
  transitionPending = false;
  const answers = [...main.querySelectorAll('.answer')];
  answers.forEach((button, index) => {
    button.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1);
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = answers.length - 1;
      answers[(nextIndex + answers.length) % answers.length].focus();
    });
    button.addEventListener('click', async () => {
      if (transitionPending) return;
      transitionPending = true;
      button.classList.add('selected');
      button.setAttribute('aria-pressed', 'true');
      answers.forEach((answer) => answer.setAttribute('aria-disabled', 'true'));
      await sleep(300);
      await showScreen(`<section class="screen reaction-screen" aria-labelledby="reaction-title"><span class="cinematic-star" aria-hidden="true">✧</span><h1 id="reaction-title" class="reaction" tabindex="-1" data-focus>${elegantText(question.reaction).replace(/[😌😄😂]/gu, '<span class="reaction-emoji">$&</span>')}</h1><span class="cinematic-rule" aria-hidden="true"></span></section>`, 'reaction');
      await sleep(reducedMotion.matches ? 0 : 350);
      await sleep(config.reactionDuration);
      questionIndex += 1;
      if (questionIndex < total) await renderQuestion();
      else await renderSequence();
    });
  });
}

async function renderSequence() {
  for (const moment of config.sequence) {
    await showScreen(`<section class="screen cinematic"><span class="cinematic-star" aria-hidden="true">✧</span><h1 class="cinematic-text" tabindex="-1" data-focus>${displayText(moment.text)}</h1><span class="cinematic-rule" aria-hidden="true"></span></section>`, 'cinematic');
    await sleep(moment.duration);
  }
  await showScreen(`<section class="screen unlock"><div class="unlock-symbol">${icon('lock')}</div><p class="eyebrow" lang="en" tabindex="-1" data-focus>${escapeHtml(text.unlocked)}</p><span class="unlock-line" aria-hidden="true"></span></section>`, 'unlock');
  await sleep(900);
  main.querySelector('.unlock-symbol').classList.add('unlocked');
  celebrate();
  await sleep(1400);
  await renderPhoto();
}

async function renderPhoto() {
  await showScreen(`<section class="screen photo-screen" aria-labelledby="photo-title">
    <p class="eyebrow">${escapeHtml(config.name)}, ACESTA E MOMENTUL TĂU</p>
    <h1 id="photo-title" class="photo-title" lang="en" tabindex="-1" data-focus>${escapeHtml(text.photoTitle)}</h1>
    <div class="photo-gallery" role="region" aria-roledescription="carusel" aria-labelledby="photo-title">
      <div class="photo-frame"><div class="photo-viewport" tabindex="0" aria-label="Fotografii cu ${escapeHtml(config.name)}" aria-describedby="gallery-status"></div><span class="frame-sparkle frame-sparkle-one" aria-hidden="true"></span><span class="frame-sparkle frame-sparkle-two" aria-hidden="true"></span></div>
      <template class="photo-slide-template"><div class="photo-slide" role="group" aria-roledescription="diapozitiv"><div class="photo-fallback"><span class="fallback-top">O EDIȚIE DE NEÎNLOCUIT</span><span class="fallback-age">${config.age}</span><span class="fallback-name">${escapeHtml(config.name)}</span><span class="fallback-bottom">CU DRAG, DE LA OAMENII TĂI</span></div><img hidden draggable="false" /></div></template>
      <div class="gallery-navigation"><button class="gallery-arrow gallery-previous" aria-label="Fotografia anterioară">${icon('arrow')}</button><div class="gallery-position"><span class="gallery-counter" aria-hidden="true"></span><p class="gallery-hint">${escapeHtml(text.galleryHint)}</p></div><button class="gallery-arrow gallery-next" aria-label="Fotografia următoare">${icon('arrow')}</button></div>
      <p class="sr-only gallery-status" id="gallery-status" role="status" aria-live="polite" aria-atomic="true"></p>
    </div>
    <p class="photo-caption">${escapeHtml(text.photoCaption)}</p>
    <div class="continue-slot"><button class="button primary photo-continue" id="continue" hidden>${escapeHtml(text.continue)}${icon('arrow')}</button></div>
  </section>`, 'photo');
  const gallery = createPhotoGallery(main.querySelector('.photo-gallery'), config);
  await Promise.race([gallery.ready, sleep(5000)]);
  await sleep(2600);
  const next = main.querySelector('#continue');
  next.hidden = false;
  next.addEventListener('click', async () => {
    if (next.disabled) return;
    next.disabled = true;
    gallery.destroy();
    await renderAudio();
  });
}

async function renderAudio() {
  await showScreen(`<section class="screen audio-screen" aria-labelledby="audio-title">
    <div class="heart-seal" aria-hidden="true">${icon('heart')}</div>
    <p class="audio-quote">${displayText(text.audioQuote)}</p>
    <h1 id="audio-title" class="audio-title" tabindex="-1" data-focus>${elegantText(text.audioTitle)}</h1>
    <div id="audio-player"></div>
    <p class="audio-note">${elegantText(text.audioNote)}</p>
    <a class="download-link" id="download-audio" aria-disabled="true" tabindex="-1">${icon('download')}${escapeHtml(text.download)}</a>
    <p class="audio-signature">Cu noi, în fiecare capitol.</p>
  </section>`, 'audio');
  createAudioPlayer(main.querySelector('#audio-player'), main.querySelector('#download-audio'));
}

document.title = personalize(text.pageTitle);
document.querySelector('[data-name]').textContent = config.name;
setupFestive();
renderLanding();
