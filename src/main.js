import { VideoEmbed } from '../lib/VideoEmbed';


/**
 * Video Embed with Facades
 */
const videoEmbeds = document.querySelectorAll('[data-js-video-embed]');

for (const videoEmbed of videoEmbeds) {
  new VideoEmbed({
    playerElement: videoEmbed.querySelector('[data-js-video-embed-player]'),
    videoId: videoEmbed.getAttribute('data-js-video-embed-id'),
    provider: videoEmbed.getAttribute('data-js-video-embed-provider'),
    facade: videoEmbed.querySelector('[data-js-video-embed-facade]'),
    onBeforeVideoPlay: () => {
      videoEmbed.querySelector('.c-icon use')?.setAttribute('href', '#animated-loader');
    },
    onVideoPlay: () => {
      console.log('Video is playing');
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
  new VideoEmbed({
    playerElement: videoEmbedAmbient.querySelector('iframe, video'),
    provider: videoEmbedAmbient.getAttribute('data-js-video-embed-provider'),
    playPausebutton: playPausebutton,
    onBeforeVideoPlay: () => {},
    onVideoPlay: () => {
      playPausebutton.querySelector('.c-icon use')?.setAttribute('href', '#material-pause');
    },
    onVideoPause: () => {
      playPausebutton.querySelector('.c-icon use')?.setAttribute('href', '#material-play');
    },
  });
}
