import { test, expect } from '@playwright/test';
import { copyFile, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const driveUrl = 'https://drive.google.com/file/d/1FjNqsMgjK2gfSB5j_enOUtgS51UfEa45/view';

async function mountPlayer(page, options = {}) {
  await page.goto('/');
  await page.evaluate(async (overrides) => {
    const { birthdayConfig } = await import('/src/config.js');
    const { createAudioPlayer } = await import('/src/player.js');
    Object.assign(birthdayConfig, overrides);
    const main = document.querySelector('#experience');
    main.innerHTML = '<section class="screen audio-screen"><div id="audio-player"></div><a class="download-link" id="download-audio">Descarcă amintirea</a></section>';
    createAudioPlayer(main.querySelector('#audio-player'), main.querySelector('#download-audio'));
  }, { audio: '.local/test-audio.mp3', ...options });
}

test('Drive link remains available if the local audio fails and opens without leaving the site', async ({ page, context }) => {
  await context.route('https://drive.google.com/**', (route) => route.fulfill({ contentType: 'text/html', body: '<title>Google Drive</title>' }));
  await mountPlayer(page, { audio: 'audio/missing-test.mp3' });
  await expect(page.locator('.player-status')).toContainText('Amintirea ta e pe drum');
  const download = page.getByRole('link', { name: 'Descarcă amintirea' });
  await expect(download).toHaveAttribute('href', driveUrl);
  await expect(download).toHaveAttribute('target', '_blank');
  await expect(download).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(download).not.toHaveAttribute('download');
  await expect(download).not.toHaveAttribute('aria-disabled');
  const popupEvent = page.waitForEvent('popup');
  await download.click();
  const popup = await popupEvent;
  await expect(popup).toHaveURL(driveUrl);
  await expect(page.locator('#audio-player')).toBeVisible();
  await popup.close();
});

test('published compilation plays locally without autoplay and supports seeking', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const range = await request.get('/audio/la-multi-ani.mp3', { headers: { Range: 'bytes=0-1023' } });
  expect(range.status()).toBe(206);
  expect((await range.body()).length).toBe(1024);
  await mountPlayer(page, { audio: 'audio/la-multi-ani.mp3' });
  const audio = page.locator('audio');
  await expect(page.locator('.play-button')).toBeEnabled();
  await expect(page.locator('.total-time')).toHaveText('7:12');
  await expect(audio).toHaveAttribute('preload', 'metadata');
  expect(await audio.evaluate((element) => element.paused)).toBe(true);
  await page.locator('.play-button').click();
  await expect.poll(() => audio.evaluate((element) => element.currentTime)).toBeGreaterThan(0.15);
  await page.locator('.play-button').click();
  expect(await audio.evaluate((element) => element.paused)).toBe(true);
  await page.locator('#audio-progress').fill('50');
  await page.locator('#audio-progress').dispatchEvent('change');
  await expect.poll(() => audio.evaluate((element) => Math.abs(element.currentTime - element.duration / 2))).toBeLessThan(0.1);
  await expect(page.locator('#download-audio')).toHaveAttribute('href', driveUrl);
  expect(errors).toEqual([]);
});

test('interrupted playback does not show a misleading audio error', async ({ page }) => {
  await mountPlayer(page);
  await expect(page.locator('.play-button')).toBeEnabled();
  await page.locator('audio').evaluate((audio) => {
    audio.play = () => Promise.reject(new DOMException('Playback interrupted by a pause', 'AbortError'));
  });
  await page.locator('.play-button').click();
  await expect(page.locator('.player-status')).toHaveText('');
  await expect(page.locator('.play-button')).toHaveAttribute('aria-label', 'Redă mesajul audio');
});

test('a cancelled seek gesture does not freeze the progress display', async ({ page }) => {
  await mountPlayer(page);
  await expect(page.locator('.play-button')).toBeEnabled();
  await page.locator('#audio-progress').evaluate((slider) => {
    slider.value = '50';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    slider.dispatchEvent(new Event('pointercancel', { bubbles: true }));
  });
  await expect.poll(() => page.locator('audio').evaluate((audio) => Math.abs(audio.currentTime - audio.duration / 2))).toBeLessThan(0.1);
  await page.locator('audio').evaluate((audio) => {
    audio.currentTime = 2;
    audio.dispatchEvent(new Event('timeupdate'));
  });
  await expect(page.locator('.current-time')).toHaveText('0:02');
});

test('audio recovers after retry while the Drive link stays available', async ({ page }) => {
  const retryPath = `.local/retry-${randomUUID()}.mp3`;
  try {
    await mountPlayer(page, { audio: retryPath });
    await expect(page.locator('.retry-button')).toBeVisible();
    await copyFile('.local/test-audio.mp3', retryPath);
    await page.locator('.retry-button').click();
    await expect(page.locator('.play-button')).toBeEnabled();
    await expect(page.locator('.retry-button')).toBeHidden();
    await expect(page.locator('.total-time')).toHaveText('0:12');
    await expect(page.locator('#download-audio')).toHaveAttribute('href', driveUrl);
    await expect(page.locator('.player-status')).toHaveText('');
  } finally {
    await rm(retryPath, { force: true });
  }
});

test('local download fallback stays disabled when no external link or audio is available', async ({ page }) => {
  await mountPlayer(page, { audio: 'audio/missing-test.mp3', downloadUrl: '' });
  await expect(page.locator('.retry-button')).toBeVisible();
  await expect(page.locator('#download-audio')).not.toHaveAttribute('href');
  await expect(page.locator('#download-audio')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('.play-button')).toBeDisabled();
});
