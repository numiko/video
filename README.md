# VideoEmbed

`VideoEmbed` is a JavaScript class for embedding and controlling video players from YouTube, Vimeo, and HTML5 video sources. It provides a consistent interface for initializing video players, handling play/pause functionality, and managing event callbacks.

## Installation
a) Install a specific tag
```shell
npm install ssh://git@bitbucket.org:numiko/video-embed.git#<TAG_NAME>
```
b) Install using semver
```shell
npm install ssh://git@bitbucket.org:numiko/video-embed.git##semver:^1.0.0
```

## Usage

```JS
import { VideoEmbed } from './path/to/VideoEmbed';
```

### Video with facade
```JS
const videoEmbed = document.querySelector('[data-js-video-embed]');
new VideoEmbed({
    playerElement: videoEmbed.querySelector('[data-js-video-embed-player]'),
    videoId: videoEmbed.getAttribute('data-js-video-embed-id'),
    provider: videoEmbed.getAttribute('data-js-video-embed-provider'),
    facade: videoEmbed.querySelector('[data-js-video-embed-facade]'),
    onBeforeVideoPlay: () => {
      videoEmbed.querySelector('.c-icon use')?.setAttribute('href', '#animated-loader');
    }
  });
```
Example HTML structure - Embed with Facade
```HTML
 <div
  class="c-video-embed-facade"
  data-js-video-embed
  data-js-video-embed-id="958291103"
  data-js-video-embed-provider="vimeo">

  <div data-js-video-embed-player></div>

  <button type="button" data-js-video-embed-facade class="h-full w-full flex items-center justify-center group"
    aria-label="Play video - [Video Name]">
    <img src="https://picsum.photos/1000/563" alt="" loading="lazy"
      class="absolute top-0 left-0 w-full h-full object-cover" />
    <span class="c-button | relative z-10">
      <svg class="c-icon" focusable="false" aria-hidden="true">
        <use href="#material-play"></use>
      </svg>
    </span>
  </button>
</div>
```

### Video for hero
```JS
const videoEmbedAmbient = document.querySelector('[data-js-video-embed-ambient]');
const playPausebutton = videoEmbedAmbient.querySelector('[data-js-video-embed-button]');
new VideoEmbed({
  playerElement: videoEmbedAmbient.querySelector('[data-js-video-embed-player]'),
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
```
```HTML
<div class="w-full aspect-[4/1] relative">
  <div
    class="c-video-embed-ambient"
    data-js-video-embed-ambient
    data-js-video-embed-provider="vimeo">

    <iframe
      data-js-video-embed-player
      src="https://player.vimeo.com/video/958291103?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&background=1"
      frameborder="0"
      title="[Video title]">
    </iframe>

    <button
      data-js-video-embed-buttontype="button"
      aria-pressed="false"
      aria-label="Play/Pause Video - Video title"
      class="absolute bottom-0 right-0 mb-5 mr-5 z-10">
        <svg class="c-icon" focusable="false" aria-hidden="true">
          <use href="#material-pause"></use>
        </svg>
    </button>

  </div>
</div>
```
### CSS
The CSS for the videos is already part of sitekit and included in the component folders.  But below is a copy of it should this been used outside of a drupal SDC project.
```CSS
@layer components {

  .c-video-embed-facade {
    @apply relative aspect-video w-full;

    iframe {
      @apply absolute top-0 left-0 w-full h-full;
    }
  }

  .c-video-embed-ambient {
    @apply relative overflow-hidden;
    @apply absolute top-0 left-0 w-full h-full;
    container-type: size;

    iframe {
      @apply relative top-1/2 left-1/2 w-full h-full -translate-y-1/2 -translate-x-1/2 pointer-events-none;

      /* Make iframe behave like object-fit:cover */
      @container (min-aspect-ratio: 16/9) {
        height: 56.25vw;
      }

      @container (max-aspect-ratio: 16/9) {
        width: 177.78vh;
      }

    }
  }
}
```

## Constructor options

|Property|Type|Description|
|-------|------|--------|
|`playerElement`|HTMLElement|The HTML element that the video is injected into.|
|`videoId`|	string	|The video's ID. Required for YouTube and Vimeo providers.|
|`provider`	| 'youtube', 'vimeo', 'html5'|	The video's provider.|
|`facade`|HTMLElement (optional)|	Optional HTML element displayed as a facade before the video is initiated.|
|`playPausebutton`|	HTMLElement (optional)|	Optional HTML element for play/pause functionality.|
|`onVideoPlay`|	Function (optional)|	Optional callback function for when the video plays.|
|`onVideoPause`|	Function (optional)|	Optional callback function for when the video pauses.|
|`onBeforeVideoPlay`|	Function (optional)|	Optional callback function for before the video plays.
