import { test, expect } from '@playwright/test';

async function photoMoment(page) {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(700);
  await page.getByRole('button', { name: 'Începem?' }).click();
  await page.clock.runFor(600);
  for (let index = 0; index < 5; index += 1) {
    await page.locator('.answer').last().click();
    await page.clock.runFor(950);
    await page.getByRole('button', { name: 'Continuă', exact: true }).click();
    await page.clock.runFor(500);
  }
  for (const duration of [1200, 1600, 1700, 2600, 3000, 900, 1400]) await page.clock.runFor(duration + 250);
  await expect(page.locator('body')).toHaveAttribute('data-screen', 'photo');
  await page.locator('#birthday-photo').evaluate((image) => image.decode());
  await page.clock.runFor(8000);
  await page.clock.resume();
  await expect(page.getByRole('button', { name: 'Mai departe ❤️' })).toBeVisible();
}

test('an early tap fades out from the current appearance without a brightness flash', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const appearance = await page.locator('.landing').evaluate((screen) => {
    const entrance = screen.getAnimations().find((animation) => animation.animationName === 'enter');
    entrance.pause();
    entrance.currentTime = 120;
    const before = getComputedStyle(screen);
    const opacityBefore = Number(before.opacity);
    const translateBefore = new DOMMatrix(before.transform).m42;
    screen.querySelector('#start').click();
    const after = getComputedStyle(screen);
    return { opacityBefore, opacityAfter: Number(after.opacity), translateBefore, translateAfter: new DOMMatrix(after.transform).m42 };
  });
  expect(appearance.opacityBefore).toBeLessThan(0.9);
  expect(appearance.opacityAfter).toBeCloseTo(appearance.opacityBefore, 2);
  expect(appearance.translateAfter).toBeCloseTo(appearance.translateBefore, 1);
  await expect(page.locator('.progress-count')).toHaveText('1 / 5');
  await expect(page.locator('.screen')).toHaveCount(1);
});

test('rapid gallery arrows reach every requested photo without dropping taps', async ({ page }) => {
  await photoMoment(page);
  await page.getByRole('button', { name: 'Fotografia următoare' }).evaluate((button) => {
    button.click();
    button.click();
    button.click();
  });
  await expect(page.locator('.gallery-counter')).toHaveText('04 / 05');
  await expect.poll(() => page.locator('.photo-viewport').evaluate((element) => Math.abs(element.scrollLeft - 3 * element.clientWidth))).toBeLessThanOrEqual(2);
  await page.getByRole('button', { name: 'Fotografia anterioară' }).evaluate((button) => {
    button.click();
    button.click();
  });
  await expect(page.locator('.gallery-counter')).toHaveText('02 / 05');
  const viewport = page.locator('.photo-viewport');
  await viewport.focus();
  await page.keyboard.press('Home');
  await expect(page.locator('.gallery-counter')).toHaveText('01 / 05');
  await page.locator('.photo-gallery').evaluate((gallery) => {
    gallery.querySelector('.gallery-next').click();
    gallery.querySelector('.gallery-next').click();
    gallery.querySelector('.gallery-previous').click();
  });
  await expect(page.locator('.gallery-counter')).toHaveText('02 / 05');
  await page.locator('.photo-gallery').evaluate((gallery) => {
    gallery.querySelector('.gallery-next').click();
    const viewport = gallery.querySelector('.photo-viewport');
    viewport.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    viewport.scrollTo({ left: 0, behavior: 'instant' });
  });
  await expect(page.locator('.gallery-counter')).toHaveText('01 / 05');
  await viewport.evaluate((element) => {
    for (let count = 0; count < 3; count += 1) element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  });
  await expect(page.locator('.gallery-counter')).toHaveText('04 / 05');
});

test('height-only viewport changes do not restart gallery scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await photoMoment(page);
  const frame = page.locator('.photo-frame');
  const initialHeight = await frame.evaluate((element) => element.clientHeight);
  await page.locator('.photo-viewport').evaluate((viewport) => {
    window.galleryScrollCalls = [];
    const scrollTo = viewport.scrollTo.bind(viewport);
    viewport.scrollTo = (options) => { window.galleryScrollCalls.push(options); scrollTo(options); };
  });
  await page.setViewportSize({ width: 390, height: 824 });
  await expect.poll(() => frame.evaluate((element) => element.clientHeight)).toBeLessThan(initialHeight);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(await page.evaluate(() => window.galleryScrollCalls)).toEqual([]);
});

test('gallery retains the displayed photo through portrait and landscape rotation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await photoMoment(page);
  const viewport = page.locator('.photo-viewport');
  await viewport.focus();
  await page.keyboard.press('End');
  await expect(page.locator('.gallery-counter')).toHaveText('05 / 05');
  await expect.poll(() => viewport.evaluate((element) => Math.abs(element.scrollLeft - 4 * element.clientWidth))).toBeLessThanOrEqual(2);
  for (const size of [{ width: 844, height: 390 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(size);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await expect.poll(() => viewport.evaluate((element) => Math.abs(element.scrollLeft - 4 * element.clientWidth))).toBeLessThanOrEqual(2);
    await expect(page.locator('.gallery-counter')).toHaveText('05 / 05');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
