import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const QRCodeReader = require('@zxing/library/cjs/core/qrcode/QRCodeReader.js').default;
const RGBLuminanceSource = require('@zxing/library/cjs/core/RGBLuminanceSource.js').default;
const HybridBinarizer = require('@zxing/library/cjs/core/common/HybridBinarizer.js').default;
const BinaryBitmap = require('@zxing/library/cjs/core/BinaryBitmap.js').default;

async function start(page) {
  await page.clock.install();
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(700);
}

async function quiz(page) {
  await page.getByRole('button', { name: 'Începem?' }).click();
  await page.clock.runFor(600);
  for (let index = 0; index < 5; index += 1) {
    await expect(page.locator('.progress-count')).toHaveText(`${index + 1} / 5`);
    const lastAnswer = page.locator('.answer').last();
    await lastAnswer.click();
    await expect(lastAnswer).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.reaction')).not.toBeEmpty();
    await lastAnswer.dispatchEvent('click');
    await page.clock.runFor(1200);
  }
}

async function photoMoment(page) {
  await quiz(page);
  for (const duration of [1200, 1600, 1700, 2600, 3000, 900, 1400]) await page.clock.runFor(duration + 250);
  await expect(page.locator('body')).toHaveAttribute('data-screen', 'photo');
  await page.clock.runFor(8000);
}

async function audioMoment(page) {
  await photoMoment(page);
  await page.getByRole('button', { name: 'Mai departe ❤️' }).click();
  await page.clock.runFor(700);
}

async function expectFits(page) {
  const metrics = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewportWidth: innerWidth,
    height: document.documentElement.scrollHeight,
    viewportHeight: innerHeight,
  }));
  expect(metrics.width).toBeLessThanOrEqual(metrics.viewportWidth + 1);
  expect(metrics.height).toBeLessThanOrEqual(metrics.viewportHeight + 1);
}

test('complete experience, no early reveal, safe media fallbacks', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/images/birthday-photo.jpg', (route) => route.fulfill({ status: 404, body: '' }));
  await start(page);
  await expectFits(page);
  await expect(page.getByText(/mesaj|audio|surpriz/i)).toHaveCount(0);
  await photoMoment(page);
  await expect(page.getByRole('heading', { name: '40 looks good on you.' })).toBeVisible();
  await expect(page.locator('.photo-fallback')).toBeVisible();
  await expect(page.locator('#birthday-photo')).toBeHidden();
  await expectFits(page);
  await page.getByRole('button', { name: 'Mai departe ❤️' }).click();
  await page.clock.runFor(700);
  await expect(page.getByRole('heading', { name: 'La mulți ani! ❤️' })).toBeVisible();
  await expect(page.locator('.player-status')).toContainText('Amintirea ta e pe drum');
  await expect(page.locator('.play-button')).toBeDisabled();
  await expect(page.locator('#download-audio')).toHaveAttribute('aria-disabled', 'true');
  expect(await page.locator('audio').evaluate((audio) => audio.paused)).toBe(true);
  expect(errors).toEqual([]);
});

test('every question fits small portrait viewports and keyboard selection works', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await start(page);
  await expectFits(page);
  await page.getByRole('button', { name: 'Începem?' }).focus();
  await page.keyboard.press('Enter');
  await page.clock.runFor(500);
  for (let index = 0; index < 5; index += 1) {
    await expectFits(page);
    const answers = page.locator('.answer');
    await answers.first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(answers.nth(1)).toBeFocused();
    await page.keyboard.press('Enter');
    await page.clock.runFor(1200);
  }
});

test('reduced motion removes moving decorations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  expect(await page.locator('.hero-age').evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  await photoMoment(page);
  await expect(page.locator('#confetti i')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Mai departe ❤️' })).toBeVisible();
});

test('real photo loads without distortion and the button waits', async ({ page }) => {
  const png = new PNG({ width: 600, height: 300 });
  png.data.fill(180);
  for (let index = 3; index < png.data.length; index += 4) png.data[index] = 255;
  await page.route('**/images/birthday-photo.jpg', (route) => route.fulfill({ contentType: 'image/png', body: PNG.sync.write(png) }));
  await start(page);
  await quiz(page);
  for (const duration of [1200, 1600, 1700, 2600, 3000, 900, 1400]) await page.clock.runFor(duration + 250);
  await expect(page.locator('#birthday-photo')).toBeVisible();
  await expect(page.locator('.photo-fallback')).toBeHidden();
  expect(await page.locator('#birthday-photo').evaluate((element) => getComputedStyle(element).objectFit)).toBe('cover');
  await page.clock.runFor(3000);
  await expect(page.getByRole('button', { name: 'Mai departe ❤️' })).toBeVisible();
});

test('audio plays, pauses, seeks and downloads when available', async ({ page }) => {
  const audioBytes = await readFile('.local/test-audio.mp3');
  await page.route('**/src/config.js', async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace('audio/la-multi-ani.mp3', '.local/test-audio.mp3') });
  });
  await start(page);
  await audioMoment(page);
  await expect(page.locator('.play-button')).toBeEnabled();
  await expect(page.locator('.total-time')).toHaveText('0:12');
  expect(await page.locator('audio').evaluate((audio) => audio.paused)).toBe(true);
  await page.locator('.play-button').click();
  await expect(page.locator('.play-button')).toHaveAttribute('aria-label', 'Pune mesajul audio pe pauză');
  await expect(page.locator('#audio-player')).toHaveClass('is-playing');
  await page.locator('.play-button').click();
  expect(await page.locator('audio').evaluate((audio) => audio.paused)).toBe(true);
  await page.locator('#audio-progress').fill('50');
  await page.locator('#audio-progress').dispatchEvent('change');
  await expect.poll(() => page.locator('audio').evaluate((audio) => audio.currentTime)).toBeCloseTo(6, 0);
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Descarcă amintirea', { exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('la-multi-ani.mp3');
  const bytes = await readFile(await download.path());
  expect(bytes.length).toBe(audioBytes.length);
  expect(bytes.equals(audioBytes)).toBe(true);
});

test('QR validates URL, creates a scannable PNG, and invalidates stale codes', async ({ page }) => {
  await page.goto('/qr.html');
  const input = page.getByLabel('Adresa site-ului aniversar');
  await input.fill('javascript:alert(1)');
  await page.getByRole('button', { name: /Generează/ }).click();
  await expect(page.getByRole('alert')).toContainText('Adaugă o adresă completă');
  const destination = 'https://cristiandespa.github.io/itzi-40/?invitat=prietenă';
  await input.fill(destination);
  await page.getByRole('button', { name: /Generează/ }).click();
  await expect(page.locator('#qr-canvas')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Descarcă PNG' }).click();
  const download = await downloadPromise;
  const png = PNG.sync.read(await readFile(await download.path()));
  const luminance = new Uint8ClampedArray(png.width * png.height);
  for (let index = 0; index < luminance.length; index += 1) luminance[index] = Math.round((png.data[index * 4] + png.data[index * 4 + 1] * 2 + png.data[index * 4 + 2]) / 4);
  const bitmap = new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(luminance, png.width, png.height)));
  expect(new QRCodeReader().decode(bitmap).getText()).toBe(new URL(destination).href);
  await input.fill('https://example.org/');
  await expect(page.locator('.qr-result')).toBeHidden();
});

test('landscape and enlarged text remain reachable without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await start(page);
  await page.getByRole('button', { name: 'Începem?' }).click();
  await page.clock.runFor(600);
  await expect(page.locator('.answer').last()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addStyleTag({ content: 'body { zoom: 2; }' });
  await page.locator('.answer').last().click();
  await page.clock.runFor(1200);
  await expect(page.locator('.progress-count')).toHaveText('2 / 5');
});
