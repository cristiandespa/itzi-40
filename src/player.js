import { birthdayConfig as config, assetUrl, personalize } from './config.js';
import { icon } from './icons.js';

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

export function createAudioPlayer(container, download) {
  container.innerHTML = `<div class="player"><div class="player-heading"><span class="player-dot"></span><span class="player-label"></span><span class="player-heart">${icon('heart')}</span></div><div class="player-controls"><button class="play-button" aria-label="Redă mesajul audio" disabled>${icon('play')}</button><div class="waveform" aria-hidden="true">${Array.from({ length: 44 }, (_, index) => `<span style="--height:${20 + (Math.sin(index * 1.7) + 1) * 20 + (Math.cos(index * 0.7) + 1) * 10}%;--delay:${index * -0.08}s"></span>`).join('')}</div></div><label class="sr-only" for="audio-progress">Poziția în mesajul audio</label><input id="audio-progress" class="audio-progress" type="range" min="0" max="100" step="0.1" value="0" disabled aria-valuetext="0:00 din 0:00" /><div class="player-times"><span class="current-time">0:00</span><span class="total-time">0:00</span></div><p class="player-status" role="status" aria-live="polite"></p><button class="retry-button" hidden></button><audio preload="metadata"></audio></div>`;
  container.querySelector('.player-label').textContent = personalize(config.texts.audioPlayerLabel);
  const audio = container.querySelector('audio');
  const play = container.querySelector('.play-button');
  const slider = container.querySelector('.audio-progress');
  const status = container.querySelector('.player-status');
  const retry = container.querySelector('.retry-button');
  const current = container.querySelector('.current-time');
  const total = container.querySelector('.total-time');
  let loadTimer;
  let loading = false;
  let seeking = false;

  const updatePlayback = () => {
    const playing = !audio.paused && !audio.ended;
    play.innerHTML = icon(playing ? 'pause' : 'play');
    play.setAttribute('aria-label', playing ? 'Pune mesajul audio pe pauză' : 'Redă mesajul audio');
    container.classList.toggle('is-playing', playing);
  };
  const updateProgress = () => {
    if (seeking) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const percentage = duration ? audio.currentTime / duration * 100 : 0;
    slider.value = percentage;
    slider.style.setProperty('--progress', `${percentage}%`);
    slider.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} din ${formatTime(duration)}`);
    current.textContent = formatTime(audio.currentTime);
    total.textContent = formatTime(duration);
    container.querySelectorAll('.waveform span').forEach((bar, index, bars) => bar.classList.toggle('heard', index / bars.length * 100 <= percentage));
  };
  const unavailable = () => {
    loading = false;
    clearTimeout(loadTimer);
    audio.pause();
    play.disabled = true;
    slider.disabled = true;
    download.removeAttribute('href');
    download.setAttribute('aria-disabled', 'true');
    download.tabIndex = -1;
    status.textContent = config.texts.audioMissing;
    retry.textContent = config.texts.audioRetry;
    retry.hidden = false;
    updatePlayback();
  };
  const ready = () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    loading = false;
    clearTimeout(loadTimer);
    play.disabled = false;
    slider.disabled = false;
    status.textContent = '';
    retry.hidden = true;
    download.href = assetUrl(config.audio);
    download.download = 'la-multi-ani.mp3';
    download.removeAttribute('aria-disabled');
    download.removeAttribute('tabindex');
    updateProgress();
  };
  const load = () => {
    if (loading) return;
    loading = true;
    retry.hidden = true;
    play.disabled = true;
    status.textContent = config.texts.audioLoading;
    audio.src = assetUrl(config.audio);
    audio.load();
    clearTimeout(loadTimer);
    loadTimer = window.setTimeout(unavailable, 15000);
  };
  play.addEventListener('click', async () => {
    if (!audio.paused) { audio.pause(); return; }
    try {
      if (audio.ended) audio.currentTime = 0;
      await audio.play();
      status.textContent = '';
    } catch {
      if (audio.error) unavailable();
      else status.textContent = 'Atinge din nou butonul pentru a porni mesajul.';
    }
  });
  slider.addEventListener('input', () => {
    if (!Number.isFinite(audio.duration)) return;
    seeking = true;
    const position = Number(slider.value) / 100 * audio.duration;
    slider.style.setProperty('--progress', `${slider.value}%`);
    slider.setAttribute('aria-valuetext', `${formatTime(position)} din ${formatTime(audio.duration)}`);
    current.textContent = formatTime(position);
    audio.currentTime = position;
  });
  slider.addEventListener('change', () => { seeking = false; updateProgress(); });
  retry.addEventListener('click', load);
  audio.addEventListener('loadedmetadata', ready);
  audio.addEventListener('canplay', ready);
  audio.addEventListener('durationchange', ready);
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('error', unavailable);
  audio.addEventListener('waiting', () => { status.textContent = 'O clipă, încărcăm mesajul…'; });
  audio.addEventListener('playing', () => { status.textContent = ''; });
  ['play', 'pause', 'ended'].forEach((event) => audio.addEventListener(event, updatePlayback));
  download.addEventListener('click', (event) => { if (!download.hasAttribute('href')) event.preventDefault(); });
  load();
}
