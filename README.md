# Video

`Video` is a JavaScript class for embedding and controlling video players from YouTube, Vimeo, and HTML5 video sources. It provides a consistent interface for initializing video players, handling play/pause functionality, and managing event callbacks.

## Installation
a) Install a specific tag
```shell
npm install ssh://git@bitbucket.org:numiko/video.git#<TAG_NAME>
```
b) Install using semver
```shell
npm install ssh://git@bitbucket.org:numiko/video.git##semver:^1.0.0
```

## Usage

```JS
import { Video } from './path/to/Video';
```

### Video with facade
```JS
const video = document.querySelector('[data-js-video]');
new video({
    playerElement: video.querySelector('[data-js-video-player]'),
    videoId: video.getAttribute('data-js-video-id'),
    provider: video.getAttribute('data-js-video-provider'),
    facade: video.querySelector('[data-js-video-facade]'),
    onBeforeVideoPlay: () => {
      video.querySelector('.c-icon use')?.setAttribute('href', '#animated-loader');
    }
  });
```
Example HTML structure - Video with Facade
```HTML
 <div
  class="c-video"
  data-js-video
  data-js-video-id="958291103"
  data-js-video-provider="vimeo">

  <div data-js-video-player></div>

  <button type="button" data-js-video-facade class="h-full w-full flex items-center justify-center group"
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
const videoAmbient = document.querySelector('[data-js-video-ambient]');
const playPausebutton = videoAmbient.querySelector('[data-js-video-button]');
const heroVideo = new Video({
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
    heroVideo.isPaused().then((paused) => {
      if (paused) {
        heroVideo.play();
        playPausebutton.setAttribute('aria-pressed', 'false');
      } else {
        heroVideo.pause();
        playPausebutton.setAttribute('aria-pressed', 'true');
      }
    });
  });
```
```HTML
<div class="w-full aspect-[4/1] relative">
  <div
    class="c-video-ambient"
    data-js-video-ambient
    data-js-video-provider="vimeo">

    <iframe
      data-js-video-player
      src="https://player.vimeo.com/video/958291103?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&background=1"
      frameborder="0"
      title="[Video title]">
    </iframe>

    <button
      data-js-video-buttontype="button"
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

  .c-video-facade {
    @apply relative aspect-video w-full;

    iframe {
      @apply absolute top-0 left-0 w-full h-full;
    }
  }

  .c-video-ambient {
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

## API

See [documentation](https://v0-1-1--numiko-video.netlify.app/) for more detail on how to use the package.

## Tests

End-to-end tests run via [Playwright](https://playwright.dev) against the Vite dev server (started automatically).

```shell
npm test            # run the suite headless
npm run test:ui     # open Playwright's UI runner
npm run test:report # open the last HTML report
```

**YouTube playback tests are skipped in CI.** YouTube blocks embedded playback from AWS IP ranges (where CircleCI runs), returning an auth error before the player can start. These three YouTube tests are skipped in CI and should be tested locally:

- `video plays when facade is clicked`
- `plain video plays when clicked`
- `ambient video play/pause button toggles the play/pause state when clicked`
