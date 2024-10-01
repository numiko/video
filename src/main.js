import { VideoEmbed } from '../lib/VideoEmbed';


/**
 * Video Embed with Facades
 */
const videoEmbedsWithFacades = document.querySelectorAll('[data-js-video-embed-with-facade]');

for (const embed of videoEmbedsWithFacades) {

  new VideoEmbed({
    playerElement: embed.querySelector('[data-js-video-embed-player]'),
    videoId: embed.getAttribute('data-js-video-embed-id'),
    provider: embed.getAttribute('data-js-video-embed-provider'),
    facade: embed.querySelector('[data-js-video-embed-facade]'),
    autoplay: true,
    onBeforeVideoPlay: () => {
      embed.querySelector('.c-icon use')?.setAttribute('href', '#animated-loader');
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
 * Video Embed without Facades
 */
const videoEmbedsWithoutFacades = document.querySelectorAll('[data-js-video-embed]');

for (const embed of videoEmbedsWithoutFacades) {
  new VideoEmbed({
    playerElement: embed.querySelector('[data-js-video-embed-player]'),
    videoId: embed.getAttribute('data-js-video-embed-id'),
    provider: embed.getAttribute('data-js-video-embed-provider'),
    autoplay: false,
    onBeforeVideoPlay: () => {
      embed.querySelector('.c-icon use')?.setAttribute('href', '#animated-loader');
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
 * Video Embed Ambient for heros
 */
const videoEmbedAmbients = document.querySelectorAll('[data-js-video-embed-ambient]');

for (const videoEmbedAmbient of videoEmbedAmbients) {

  const playPausebutton = videoEmbedAmbient.querySelector('[data-js-video-embed-button]');
  const ambientEmbed = new VideoEmbed({
    playerElement: videoEmbedAmbient.querySelector('[data-js-video-embed-player]'),
    provider: videoEmbedAmbient.getAttribute('data-js-video-embed-provider'),
    onBeforeVideoPlay: () => {},
    onVideoPlay: () => {
      playPausebutton.querySelector('.c-icon use')?.setAttribute('href', '#material-pause');
    },
    onVideoPause: () => {
      playPausebutton.querySelector('.c-icon use')?.setAttribute('href', '#material-play');
    },
  });

  playPausebutton.addEventListener('click', () => {
    ambientEmbed.isPaused().then((paused) => {
      if (paused) {
        ambientEmbed.play();
        playPausebutton.setAttribute('aria-pressed', 'false');
      } else {
        ambientEmbed.pause();
        playPausebutton.setAttribute('aria-pressed', 'true');
      }
    });
  });
}
