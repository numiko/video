export class VideoEmbed {
  /**
   * Static property to track YouTube API loading Promise.
   * @type {Promise<void> | null}
   */
  static youtubeApiPromise = null;

  /**
   * Static property to track Vimeo API loading Promise.
   * @type {Promise<void> | null}
   */
  static vimeoApiPromise = null;

  /**
   * Stores an instance of the video player, once initialised.
   * @type {YT.Player | Vimeo.Player | null}
   */
  player = null;

  /**
   *
   * @param {Object} options
   * @param {HTMLElement} options.playerElement the HTML element that the video is injected into.
   * @param {String} options.videoId the video's ID
   * @param {'youtube' | 'vimeo'} options.provider the video's provider
   * @param {HTMLElement} [options.facade] Optional HTML element that is displayed as a facade, before the video is initiated.
   * @param {HTMLElement} [options.playPausebutton] Optional HTML element for play/pause functionality.
   * @param {Function} [options.onVideoPlay] Optional callback function for when the video plays
   * @param {Function} [options.onVideoPause] Optional callback function for when the video pauses
   * @param {Function} [options.onBeforeVideoPlay] Optional callback function for before the video plays
   */
  constructor(options) {
    this.playerElement = options.playerElement;
    this.videoId = options.videoId;
    this.provider = options.provider;
    this.facade = options.facade || null;
    this.playPausebutton = options.playPausebutton || null;
    this.onVideoPlay = options.onVideoPlay || null;
    this.onVideoPause = options.onVideoPause || null;
    this.onBeforeVideoPlay = options.onBeforeVideoPlay || null;

    if (this.facade) {
      this.facade.addEventListener('click', () => {
        this.init();
      });
    } else {
      this.init();
    }
  }

  /**
   * Initialises the video player.
   */
  async init() {
    if (this.onBeforeVideoPlay) {
      this.onBeforeVideoPlay();
    }
    if (this.provider === 'youtube') {
      await this.loadYouTubeApi();
      this.createYouTubePlayer();
    } else if (this.provider === 'vimeo') {
      await this.loadVimeoApi();
      this.createVimeoPlayer();
    }
    if (this.playPausebutton) {
      this.addEventListeners();
    }
  }

  /**
   * Loads the YouTube API if it hasn't already been loaded.
   * @returns {Promise<void>}
   */
  async loadYouTubeApi() {
    if (VideoEmbed.youtubeApiPromise) {
      return VideoEmbed.youtubeApiPromise;
    }

    VideoEmbed.youtubeApiPromise = new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };
    });

    return VideoEmbed.youtubeApiPromise;
  }

  /**
   * Loads the Vimeo API if it hasn't already been loaded.
   * @returns {Promise<void>}
   */
  async loadVimeoApi() {
    if (VideoEmbed.vimeoApiPromise) {
      return VideoEmbed.vimeoApiPromise;
    }

    VideoEmbed.vimeoApiPromise = new Promise((resolve) => {
      if (window.Vimeo) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.onload = () => {
        resolve();
      };
      document.head.appendChild(script);
    });

    return VideoEmbed.vimeoApiPromise;
  }

  /**
   * Hides the facade element.
   * @returns {Void}
   */
  hideFacade() {
    this.facade?.remove();
  }

  /**
   * Event to fire when video is playing
   */
  playEvent() {
    this.playPausebutton?.setAttribute('aria-pressed', 'false');
  }

  /**
   * Event to fire when video is paused
   */
  pauseEvent() {
    this.playPausebutton?.setAttribute('aria-pressed', 'true');
  }

  /**
   * Creates the Vimeo player instance.
   */
  createVimeoPlayer() {
    this.player = new window.Vimeo.Player(this.playerElement, {
      ...(this.videoId && { id: this.videoId }),
      transparent: false,
    });

    this.player.on('loaded', () => {
      if (!this.facade) return;

      this.player.play().then(() => {
        this.hideFacade();
      }).catch((error) => {
        console.error('Error playing the video:', error);
      });
    });

    this.player.on('play', () => {
      if (typeof this.onVideoPlay === 'function') {
        this.onVideoPlay(this.player);
      }
    });

    this.player.on('pause', () => {
      if (typeof this.onVideoPause === 'function') {
        this.onVideoPause(this.player);
      }
    });
  }

  /**
   * Creates the YouTube player instance.
   */
  createYouTubePlayer() {
    this.player = new window.YT.Player(this.playerElement, {
      ...(this.videoId && { videoId: this.videoId }),
      width: '1024', // 16:9
      height: '576', // 16:9
      playerVars: {
        playsinline: 1,
        rel: 0,
        autoplay: 0,
      },
      events: {
        onReady: () => {
          if (this.facade) {
            this.hideFacade();
            this.player.playVideo();
          }
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING && typeof this.onVideoPlay === 'function') {
            this.onVideoPlay(this.player);
          }
          if (event.data === window.YT.PlayerState.PAUSED && typeof this.onVideoPause === 'function') {
            this.onVideoPause(this.player);
          }
        },
      },
    });
  }

  /**
   * Adds event listeners to the instance.
   */
  addEventListeners() {
    this.playPausebutton.addEventListener('click', () => {
      if (this.provider === 'youtube') {
        const playerState = this.player.getPlayerState();
        if (playerState === window.YT.PlayerState.PAUSED || playerState === window.YT.PlayerState.ENDED) {
          this.player.playVideo();
          this.playEvent();
        } else if (playerState === window.YT.PlayerState.PLAYING) {
          this.player.pauseVideo();
          this.pauseEvent();
        }
      } else if (this.provider === 'vimeo') {
        this.player.getPaused().then((paused) => {
          if (paused) {
            this.player.play();
            this.playEvent();
          } else {
            this.player.pause();
            this.pauseEvent();
          }
        });
      }
    });
  }
}
