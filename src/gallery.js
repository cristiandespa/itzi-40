import { assetUrl, personalize } from './config.js';

export function createPhotoGallery(container, config) {
  const viewport = container.querySelector('.photo-viewport');
  const template = container.querySelector('.photo-slide-template');
  const previous = container.querySelector('.gallery-previous');
  const next = container.querySelector('.gallery-next');
  const counter = container.querySelector('.gallery-counter');
  const status = container.querySelector('.gallery-status');
  const navigation = container.querySelector('.gallery-navigation');
  const photos = config.photos?.length ? config.photos : [{}];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentIndex = 0;
  let scrollFrame;
  let markReady;
  const ready = new Promise((resolve) => { markReady = resolve; });

  const slides = photos.map((photo, index) => {
    const slide = template.content.firstElementChild.cloneNode(true);
    const image = slide.querySelector('img');
    const fallback = slide.querySelector('.photo-fallback');
    slide.setAttribute('aria-label', `${index + 1} din ${photos.length}`);
    slide.setAttribute('aria-hidden', String(index !== 0));
    image.alt = personalize(photo.alt || `${config.name}, fotografia ${index + 1}`);
    image.style.objectPosition = photo.position || '50% 40%';
    image.loading = index === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (index === 0) image.id = 'birthday-photo';
    image.addEventListener('load', () => {
      image.hidden = false;
      image.classList.remove('is-loading');
      fallback.hidden = true;
      if (index === 0) markReady();
    }, { once: true });
    image.addEventListener('error', () => {
      image.hidden = true;
      if (index === 0) markReady();
    }, { once: true });
    viewport.append(slide);
    if (photo.src) {
      image.hidden = false;
      image.classList.add('is-loading');
      image.src = assetUrl(photo.src);
    } else if (index === 0) markReady();
    return slide;
  });
  template.remove();
  navigation.hidden = photos.length < 2;

  const updatePosition = (index) => {
    currentIndex = Math.max(0, Math.min(photos.length - 1, index));
    counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    status.textContent = `Fotografia ${currentIndex + 1} din ${photos.length}`;
    previous.setAttribute('aria-disabled', String(currentIndex === 0));
    next.setAttribute('aria-disabled', String(currentIndex === photos.length - 1));
    slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== currentIndex)));
  };
  const navigateTo = (index) => {
    const target = Math.max(0, Math.min(photos.length - 1, index));
    viewport.scrollTo({ left: target * viewport.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  viewport.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      if (viewport.clientWidth) updatePosition(Math.round(viewport.scrollLeft / viewport.clientWidth));
    });
  }, { passive: true });
  previous.addEventListener('click', () => navigateTo(currentIndex - 1));
  next.addEventListener('click', () => navigateTo(currentIndex + 1));
  container.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') navigateTo(0);
    else if (event.key === 'End') navigateTo(photos.length - 1);
    else navigateTo(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });
  const resizeObserver = new ResizeObserver(() => {
    viewport.scrollTo({ left: currentIndex * viewport.clientWidth, behavior: 'instant' });
  });
  resizeObserver.observe(viewport);
  updatePosition(0);

  return {
    ready,
    destroy() {
      resizeObserver.disconnect();
      cancelAnimationFrame(scrollFrame);
    },
  };
}
