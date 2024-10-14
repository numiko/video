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
   * Stores an instance of the video player, once initialized.
   * @type {YT.Player | Vimeo.Player | HTMLVideoElement | null}
   */
  player = null;

  /**
   * Constructs a new instance of VideoEmbed.
   * @param {Object} options - Options for initializing the video embed.
   * @param {HTMLElement} options.playerElement - The HTML element that the video is injected into.
   * @param {string} options.videoId - The video's ID.
   * @param {'youtube' | 'vimeo' | 'html5'} options.provider - The video's provider.
   * @param {HTMLElement} [options.facade] - Optional HTML element that is displayed as a facade before the video is initiated.
   * @param {Function} [options.onVideoPlay] - Optional callback function for when the video plays.
   * @param {Function} [options.onVideoPause] - Optional callback function for when the video pauses.
   * @param {Function} [options.onBeforeVideoPlay] - Optional callback function for before the video plays.
   * @param {boolean} [options.autoplay] - Optional flag to enable autoplay.
   */
  constructor(options) {
    this.playerElement = options.playerElement;
    this.videoId = options.videoId;
    this.provider = options.provider;
    this.facade = options.facade || null;
    this.onVideoPlay = options.onVideoPlay || null;
    this.onVideoPause = options.onVideoPause || null;
    this.onBeforeVideoPlay = options.onBeforeVideoPlay || null;
    this.autoplay = options.autoplay || false;
    this.hasAutoplayed = false;

    if (this.facade) {
      this.facade.addEventListener('click', () => {
        this.init();
      });
    } else {
      this.init();
    }
  }

  /**
   * Initializes the video player.
   * @returns {Promise<void>}
   */
  async init() {
    if (this.onBeforeVideoPlay) {
      this.onBeforeVideoPlay();
    }
    try {
      if (this.provider === 'youtube') {
        await this.loadYouTubeApi();
        await this.createYouTubePlayer();
      } else if (this.provider === 'vimeo') {
        await this.loadVimeoApi();
        await this.createVimeoPlayer();
      } else if (this.provider === 'html5') {
        this.createHTML5Player();
      }
    } catch (error) {
      console.error('Error initializing the video player:', error);
      throw error;
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
   * Creates the Vimeo player instance.
   * @returns {Promise<void>}
   */
  createVimeoPlayer() {
    return new Promise((resolve, reject) => {
      this.player = new window.Vimeo.Player(this.playerElement, {
        id: this.videoId,
        transparent: false,
        autopause: true,
        autoplay: this.autoplay ? 1 : 0
      });

      this.player.ready().then(() => {
        this.player.on('loaded', () => {
          this.hideFacade();
          if (this.autoplay && !this.hasAutoplayed) {
            this.hasAutoplayed = true;
            this.player.play().then(() => {
              this.playEvent();
              resolve();
            }).catch((error) => {
              console.error('Error playing the video:', error);
              reject(error);
            });
          } else {
            resolve();
          }
        });

        this.player.on('play', this.playEvent.bind(this));
        this.player.on('pause', this.pauseEvent.bind(this));

        this.player.on('error', (error) => {
          console.error('Vimeo player error:', error);
          reject(error);
        });
      }).catch(reject);
    });
  }

  /**
   * Creates the YouTube player instance.
   * @returns {Promise<void>}
   */
  createYouTubePlayer() {
    return new Promise((resolve, reject) => {
      this.player = new window.YT.Player(this.playerElement, {
        videoId: this.videoId,
        width: '1024',
        height: '576',
        playerVars: {
          playsinline: 1,
          rel: 0,
          autoplay: this.autoplay ? 1 : 0,
        },
        events: {
          onReady: () => {
            this.hideFacade();
            if (this.autoplay && !this.hasAutoplayed) {
              this.player.playVideo();
              this.hasAutoplayed = true;
            }
            resolve();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              this.playEvent();
            }
            if (event.data === window.YT.PlayerState.PAUSED) {
              this.pauseEvent();
            }
          },
          onError: (error) => {
            console.error('YouTube player error:', error);
            reject(error);
          },
        },
      });
    });
  }

  /**
   * Creates the HTML5 video player instance.
   * @returns {void}
   */
  createHTML5Player() {
    this.player = this.playerElement;

    this.hideFacade();

    if (this.autoplay && !this.hasAutoplayed) {
      this.player.play().then(() => {
        this.hasAutoplayed = true;
        this.playEvent();
      }).catch((error) => {
        console.error('Error playing the video:', error);
      });
    }

    this.player.addEventListener('play', this.playEvent.bind(this));
    this.player.addEventListener('pause', this.pauseEvent.bind(this));

    this.player.addEventListener('error', (error) => {
      console.error('HTML5 player error:', error);
    });
  }

  /**
   * Hides the facade element.
   * @returns {void}
   */
  hideFacade() {
    if (this.facade) {
      this.facade.remove();
    }
  }

  /**
   * Event to fire when video is playing
   * @returns {void}
   */
  playEvent() {
    if (typeof this.onVideoPlay === 'function') {
      this.onVideoPlay(this.player);
    }
  }

  /**
   * Event to fire when video is paused
   * @returns {void}
   */
  pauseEvent() {
    if (typeof this.onVideoPause === 'function') {
      this.onVideoPause(this.player);
    }
  }


  /**
   * Helper function to determine if the player is paused.
   * @returns {Promise<boolean>} - Resolves to true if paused, false if playing.
   */
  isPaused() {
    if (this.provider === 'youtube') {
      return Promise.resolve(this.player.getPlayerState() !== window.YT.PlayerState.PLAYING);
    } else if (this.provider === 'vimeo') {
      return this.player.getPaused();
    } else if (this.provider === 'html5') {
      return Promise.resolve(this.player.paused);
    }
    return Promise.resolve(true);
  }

  /**
   * Plays the video programmatically.
   * @returns {Promise<void>}
   */
  play() {
    return new Promise((resolve, reject) => {
      this.isPaused().then((paused) => {
        if (paused) {
          if (this.provider === 'youtube') {
            this.player.playVideo();
            this.playEvent();
            resolve();
          } else {
            this.player.play().then(() => {
              this.playEvent();
              resolve();
            }).catch(reject);
          }
        } else {
          resolve();
        }
      }).catch(reject);
    });
  }

  /**
   * Pauses the video programmatically.
   * @returns {Promise<void>}
   */
  pause() {
    return new Promise((resolve, reject) => {
      this.isPaused().then((paused) => {
        if (!paused) {
          if (this.provider === 'youtube') {
            this.player.pauseVideo();
            this.pauseEvent();
            resolve();
          } else {
            this.player.pause().then(() => {
              this.pauseEvent();
              resolve();
            }).catch(reject);
          }
        } else {
          resolve();
        }
      }).catch(reject);
    });
  }

  /**
 * Adds event listeners to the instance.
 * @returns {Void}
 */
  addEventListeners() {
    this.playPausebutton.addEventListener('click', () => {
      this.isPaused().then((paused) => {
        if (paused) {
          this.play();
        } else {
          this.pause();
        }
      });
    });
  }
}
