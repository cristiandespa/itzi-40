const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function setupFestive() {
  const particles = document.querySelector('#particles');
  for (let index = 0; index < 22; index += 1) {
    const particle = document.createElement('span');
    particle.className = index % 4 === 0 ? 'sparkle' : 'gold-piece';
    particle.style.cssText = `--left:${(index * 37 + 9) % 100}%;--top:${(index * 23 + 7) % 100}%;--delay:${index * -0.67}s;--duration:${7 + index % 6}s;--rotation:${index * 29}deg`;
    particles.append(particle);
  }
}

export function celebrate() {
  const container = document.querySelector('#confetti');
  container.replaceChildren();
  if (motion.matches) return;
  const colors = ['#aa8651', '#d8ba80', '#703241', '#d5a7a3', '#e4d5b7'];
  for (let index = 0; index < 68; index += 1) {
    const piece = document.createElement('i');
    piece.style.cssText = `--x:${Math.random() * 100}vw;--drift:${Math.random() * 180 - 90}px;--spin:${Math.random() * 900 - 450}deg;--delay:${Math.random() * 0.65}s;--duration:${3.4 + Math.random() * 2}s;background:${colors[index % colors.length]};width:${4 + index % 4}px;height:${7 + index % 5}px;border-radius:${index % 3 === 0 ? '50%' : '1px'}`;
    container.append(piece);
  }
  window.setTimeout(() => container.replaceChildren(), 6400);
}
