import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-ext-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-ext-400.css';
import './styles.css';
import qrcode from 'qrcode-generator';

const form = document.querySelector('.qr-form');
const input = document.querySelector('#site-url');
const error = document.querySelector('#qr-error');
const result = document.querySelector('.qr-result');
const canvas = document.querySelector('#qr-canvas');
const download = document.querySelector('#qr-download');

if (!['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) {
  input.value = new URL('./', window.location.href).href;
}

input.addEventListener('input', () => {
  result.hidden = true;
  download.removeAttribute('href');
  input.removeAttribute('aria-invalid');
  error.textContent = '';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  error.textContent = '';
  result.hidden = true;
  let url;
  try {
    url = new URL(input.value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) throw new Error();
  } catch {
    error.textContent = 'Adaugă o adresă completă, care începe cu https:// sau http://.';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  try {
    const code = qrcode(0, 'M');
    code.addData(url.href, 'Byte');
    code.make();
    const moduleCount = code.getModuleCount();
    const quietZone = 4;
    const cellSize = Math.max(4, Math.ceil(1000 / (moduleCount + quietZone * 2)));
    const imageSize = (moduleCount + quietZone * 2) * cellSize;
    canvas.width = imageSize;
    canvas.height = imageSize;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, imageSize, imageSize);
    context.fillStyle = '#3c202b';
    for (let row = 0; row < moduleCount; row += 1) {
      for (let column = 0; column < moduleCount; column += 1) {
        if (code.isDark(row, column)) context.fillRect((column + quietZone) * cellSize, (row + quietZone) * cellSize, cellSize, cellSize);
      }
    }
    download.href = canvas.toDataURL('image/png');
    input.removeAttribute('aria-invalid');
    canvas.setAttribute('aria-label', `Cod QR către ${url.href}`);
    result.hidden = false;
    download.focus({ preventScroll: true });
  } catch {
    error.textContent = 'Adresa este prea lungă pentru codul QR. Încearcă o adresă mai scurtă.';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }
});
