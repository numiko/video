import { VideoEmbed } from '../lib/VideoEmbed';


/**
 * Video Embed with Facades
 */
const videoEmbedWithFacades = document.querySelectorAll('.c-video-embed-facade');

for (const videoEmbedWithFacade of videoEmbedWithFacades) {
  new VideoEmbed({
    playerElement: videoEmbedWithFacade.querySelector('[data-js-video-embed-player]'),
    videoId: videoEmbedWithFacade.getAttribute('data-js-video-embed-id'),
    provider: videoEmbedWithFacade.getAttribute('data-js-video-embed-provider'),
    facade: videoEmbedWithFacade.querySelector('[data-js-video-embed-facade]'),
    onBeforeVideoPlay: () => {
      videoEmbedWithFacade.querySelector('.c-icon use').setAttribute('href', '#animated-loader');
    },
    onVideoPlay: () => {},
    onVideoPause: () => {},
  });
}

/**
 * Video Embed Ambient for heros
 */
const videoEmbedAmbients = document.querySelectorAll('.c-video-embed-ambient');

for (const videoEmbedAmbient of videoEmbedAmbients) {
  const playPausebutton = videoEmbedAmbient.querySelector('[data-js-video-embed-button]');
  new VideoEmbed({
    playerElement: videoEmbedAmbient.querySelector('iframe'),
    provider: videoEmbedAmbient.getAttribute('data-js-video-embed-provider'),
    playPausebutton: playPausebutton,
    onBeforeVideoPlay: () => {},
    onVideoPlay: () => {
      playPausebutton.querySelector('.c-icon use').setAttribute('href', '#material-pause');
    },
    onVideoPause: () => {
      playPausebutton.querySelector('.c-icon use').setAttribute('href', '#material-play');
    },
  });
}
