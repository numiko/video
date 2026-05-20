import { Video } from '../lib/Video';
import type { VideoProvider } from '../lib/Video';

declare global {
  interface HTMLElement {
    videoInstance?: Video;
  }
}

/**
 * Type guard to check if a value is a valid VideoProvider
 */
function isVideoProvider(value: string | null): value is VideoProvider {
  return value === 'youtube' || value === 'vimeo' || value === 'html5';
}

/**
 * Removes all [data-js-video-test-id] elements except the one with the matching
 * test query parameter. e.g. localhost:5173/?test=vimeo-facade
 */
async function setupTestingEnvironment(): Promise<void> {
  const url = new URL(window.location.href);
  const test = url.searchParams.get('test');
  if (!test) return;

  document.querySelectorAll<HTMLElement>('[data-js-video-test-id]').forEach(el => {
    if (el.dataset.jsVideoTestId !== test) el.remove();
  });
  await new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * Initialises video components
 */
function initVideoComponents(): void {
  /**
   * Video with Facades
   */
  const videosWithFacade = document.querySelectorAll<HTMLElement>('[data-js-video-with-facade]');

  videosWithFacade.forEach((video: HTMLElement): void => {
    const playerElement = video.querySelector<HTMLElement>('[data-js-video-player]');
    const videoId = video.getAttribute('data-js-video-id') || undefined;
    const providerAttr = video.getAttribute('data-js-video-provider');
    const facade = video.querySelector<HTMLElement>('[data-js-video-facade]');

    if (!playerElement || !isVideoProvider(providerAttr)) return;

    const provider = providerAttr;

    // Type guard for videoId for the providers that require it
    if (!videoId && (provider === 'youtube' || provider === 'vimeo')) return;

    video.videoInstance = new Video({
      playerElement,
      videoId,
      provider,
      facade,
      autoplay: true,
      onBeforeVideoPlay: (): void => {
        video.querySelector('.c-icon use')?.setAttribute('href', '#animated-loader');
      },
      onVideoPlay: (player): void => {
        console.log('Video is playing', player);
      },
      onVideoPause: (): void => {
        console.log('Video is paused');
      },
    });
  });

  /**
   * Video without Facades
   */
  const videosWithoutFacade = document.querySelectorAll<HTMLElement>('[data-js-video]');

  videosWithoutFacade.forEach((video: HTMLElement): void => {
    const playerElement = video.querySelector<HTMLElement>('[data-js-video-player]');
    const videoId = video.getAttribute('data-js-video-id');
    const providerAttr = video.getAttribute('data-js-video-provider');

    if (!playerElement || !videoId || !isVideoProvider(providerAttr)) return;

    const provider = providerAttr;

    video.videoInstance = new Video({
      playerElement,
      videoId,
      provider,
      autoplay: false,
      onBeforeVideoPlay: (): void => {
        video.querySelector('.c-icon use')?.setAttribute('href', '#animated-loader');
      },
      onVideoPlay: (player): void => {
        console.log('Video is playing', player);
      },
      onVideoPause: (): void => {
        console.log('Video is paused');
      },
    });
  });


  /**
   * Video Ambient for heros
   */
  const videoAmbients = document.querySelectorAll<HTMLElement>('[data-js-video-ambient]');

  videoAmbients.forEach((videoAmbient: HTMLElement): void => {
    const playPausebutton = videoAmbient.querySelector<HTMLElement>('[data-js-video-button]');
    const playerElement = videoAmbient.querySelector<HTMLElement>('[data-js-video-player]');
    const providerAttr = videoAmbient.getAttribute('data-js-video-provider');

    if (!playPausebutton || !playerElement || !isVideoProvider(providerAttr)) return;

    const provider = providerAttr;

    const videoInstance = new Video({
      playerElement,
      provider,
      onBeforeVideoPlay: (): void => { },
      onVideoPlay: (): void => {
        playPausebutton.querySelector('.c-icon use')?.setAttribute('href', '#material-pause');
      },
      onVideoPause: (): void => {
        playPausebutton.querySelector('.c-icon use')?.setAttribute('href', '#material-play');
      },
    });
    videoAmbient.videoInstance = videoInstance;

    playPausebutton.addEventListener('click', (): void => {
      videoInstance.isPaused().then((paused: boolean): void => {
        if (paused) {
          videoInstance.play();
          playPausebutton.setAttribute('aria-pressed', 'false');
        } else {
          videoInstance.pause();
          playPausebutton.setAttribute('aria-pressed', 'true');
        }
      });
    });
  });
}

async function init(): Promise<void> {
  await setupTestingEnvironment();
  initVideoComponents();
}

document.addEventListener('DOMContentLoaded', init);
