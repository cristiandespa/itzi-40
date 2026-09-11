const paths = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  play: '<path d="m9 5 11 7-11 7Z" fill="currentColor" stroke-linejoin="round"/>',
  pause: '<path d="M9 5v14M16 5v14" stroke-width="3"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path class="lock-shackle" d="M8 10V6a4 4 0 0 1 8 0v4"/><path d="M12 14v3"/>',
};

export function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">${paths[name] || paths.heart}</svg>`;
}
