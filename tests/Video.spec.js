import { test, expect } from '@playwright/test';

const videoProviders = ['vimeo', 'html5', 'youtube'];

/**
 * Browser-side helper. Used with page.waitForFunction to obtain a JSHandle to the
 * VideoEmbed instance once it's been attached for the given provider.
 * @param {string} provider - The video provider ('vimeo', 'html5', or 'youtube').
 * @returns {VideoEmbed | undefined} The VideoEmbed instance attached to the matching
 * element, or undefined if not yet attached.
 */
const getVideoInstance = (provider) => document.querySelector('[data-js-video-provider="' + provider + '"]')?.videoInstance;

/**
 * Provider-specific "is the video actually playing" check. Each entry takes a JSHandle
 * to the video instance and returns true once the video has advanced past 0s (HTML5,
 * Vimeo) or reported a PLAYING state (YouTube).
 * @type {Record<'html5' | 'youtube' | 'vimeo', (videoInstance: import('@playwright/test').JSHandle) => Promise<boolean>>}
 */
const isPlaying = {
  html5: videoInstance => videoInstance.evaluate(vi => vi.player.currentTime > 0),
  youtube: videoInstance => videoInstance.evaluate(vi => vi.player.getPlayerState() === window.YT.PlayerState.PLAYING),
  vimeo: videoInstance => videoInstance.evaluate(async vi => (await vi.player.getCurrentTime()) > 0),
};

/**
 * Test suite for each video provider.
 * @param {string} provider - The video provider ('vimeo', 'html5', or 'youtube').
 */
videoProviders.forEach(provider => {
  test.describe(`${provider} video`, () => {
    test(`${provider} facade is hidden when clicked`, async ({ page }) => {
      // Arrange
      await page.goto(`http://localhost:5173/?test=${provider}-facade`);
      await page.waitForFunction(getVideoInstance, provider);

      const facade = page.locator(`[data-js-video-provider="${provider}"] [data-js-video-facade]`);

      // Act
      await facade.click();

      /**
       * Assert facade has been removed from the DOM.
       * Timeout bumped above the 5s default to allow the player to load.
       */
      await expect(facade).not.toBeAttached({ timeout: 15000 });
    });

    test(`${provider} player is ready after facade click`, async ({ page }) => {
      // Arrange
      await page.goto(`http://localhost:5173/?test=${provider}-facade`);
      const videoInstance = await page.waitForFunction(getVideoInstance, provider);

      // Act
      await page.locator(`[data-js-video-provider="${provider}"] [data-js-video-facade]`).click();

      /**
       * Assert the provider's SDK initialised and attached a player instance.
       * Doesn't depend on actual playback (which YouTube blocks from CI IPs).
       */
      await page.waitForFunction(vi => !!vi.player, videoInstance);
    });

    test(`${provider} video plays when facade is clicked`, async ({ page }) => {
      test.skip(provider === 'youtube' && !!process.env.CI, 'YouTube blocks embedded playback from AWS IPs');

      // Arrange
      await page.goto(`http://localhost:5173/?test=${provider}-facade`);
      const videoInstance = await page.waitForFunction(getVideoInstance, provider);

      const facade = page.locator(`[data-js-video-provider="${provider}"] [data-js-video-facade]`);

      // Act
      await facade.click();

      /**
       * Assert video is played. Polling assertion retries while the player is being
       * created (YouTube/Vimeo APIs load async after click) and until the video advances.
       */
      await expect(async () => {
        expect(await isPlaying[provider](videoInstance)).toBe(true);
      }).toPass();
    });

    test(`${provider} plain video plays when clicked`, async ({ page }) => {
      test.skip(provider === 'youtube' && !!process.env.CI, 'YouTube blocks embedded playback from AWS IPs');

      // Arrange — plain variant has no facade, init() runs immediately on construction
      await page.goto(`http://localhost:5173/?test=${provider}`);
      const videoInstance = await page.waitForFunction(getVideoInstance, provider);

      /**
       * Act + Assert — click the centre of the player and verify it played.
       * The click is inside the polling loop because the player may not be
       * interactive on the first attempt.
       */
      await expect(async () => {
        await page.locator(`[data-js-video-provider="${provider}"]`).click();
        expect(await isPlaying[provider](videoInstance)).toBe(true);
      }).toPass();
    });

    test(`${provider} ambient video play/pause button toggles the play/pause state when clicked`, async ({ page }) => {
      test.skip(provider === 'youtube' && !!process.env.CI, 'YouTube blocks embedded playback from AWS IPs');

      // Arrange
      await page.goto(`http://localhost:5173/?test=${provider}-ambient`);
      const videoInstance = await page.waitForFunction(getVideoInstance, provider);

      const playPauseButton = page.locator('[data-js-video-button]');

      // Assert video is not paused (starting state with autoplay)
      await expect(async () => {
        // Manually trigger play since autoplay doesn't work in Playwright browser
        await videoInstance.evaluate(vi => vi.play());
        expect(await videoInstance.evaluate(vi => vi.isPaused())).toBe(false);
      }).toPass();

      // Act
      await playPauseButton.click();

      // Assert video is paused
      await expect(async () => {
        expect(await videoInstance.evaluate(vi => vi.isPaused())).toBe(true);
      }).toPass();

      // Assert play/pause button state has been toggled
      await expect(playPauseButton).toHaveAttribute('aria-pressed', 'true');

      // Act
      await playPauseButton.click();

      // Assert video is playing again after a second click
      await expect(async () => {
        expect(await videoInstance.evaluate(vi => vi.isPaused())).toBe(false);
      }).toPass();

      // Assert play/pause button state has been toggled
      await expect(playPauseButton).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
