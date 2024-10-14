import { Video } from '../lib/Video';


/**
 * Video with Facades
 */
const videoWithFacades = document.querySelectorAll('[data-js-video-with-facade]');

console.log(videoWithFacades);
for (const video of videoWithFacades) {
  new Video({
    playerElement: video.querySelector('[data-js-video-player]'),
    videoId: video.getAttribute('data-js-video-id'),
    provider: video.getAttribute('data-js-video-provider'),
    facade: video.querySelector('[data-js-video-facade]'),
    autoplay: true,
    onBeforeVideoPlay: () => {
      video.querySelector('.c-icon use')?.setAttribute('href', '#animated-loader');
    },
    onVideoPlay: (player) => {
      console.log('Video is playing', player);
    },
    onVideoPause: () => {
      console.log('Video is paused');
    },
  });
}

/**
 * Video without Facades
 */
const videoWithoutFacades = document.querySelectorAll('[data-js-video]');

for (const video of videoWithoutFacades) {
  new Video({
    playerElement: video.querySelector('[data-js-video-player]'),
    videoId: video.getAttribute('data-js-video-id'),
    provider: video.getAttribute('data-js-video-provider'),
    autoplay: false,
    onBeforeVideoPlay: () => {
      video.querySelector('.c-icon use')?.setAttribute('href', '#animated-loader');
    },
    onVideoPlay: (player) => {
      console.log('Video is playing', player);
    },
    onVideoPause: () => {
      console.log('Video is paused');
    },
  });
}


/**
 * Video Ambient for heros
 */
const videoAmbients = document.querySelectorAll('[data-js-video-ambient]');

for (const videoAmbient of videoAmbients) {

  const playPausebutton = videoAmbient.querySelector('[data-js-video-button]');
  const videoInstance = new Video({
    playerElement: videoAmbient.querySelector('[data-js-video-player]'),
    provider: videoAmbient.getAttribute('data-js-video-provider'),
    onBeforeVideoPlay: () => {},
    onVideoPlay: () => {
      playPausebutton.querySelector('.c-icon use')?.setAttribute('href', '#material-pause');
    },
    onVideoPause: () => {
      playPausebutton.querySelector('.c-icon use')?.setAttribute('href', '#material-play');
    },
  });

  playPausebutton.addEventListener('click', () => {
    videoInstance.isPaused().then((paused) => {
      if (paused) {
        videoInstance.play();
        playPausebutton.setAttribute('aria-pressed', 'false');
      } else {
        videoInstance.pause();
        playPausebutton.setAttribute('aria-pressed', 'true');
      }
    });
  });
}
