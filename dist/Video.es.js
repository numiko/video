var l = Object.defineProperty;
var h = (r, e, i) => e in r ? l(r, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : r[e] = i;
var s = (r, e, i) => h(r, typeof e != "symbol" ? e + "" : e, i);
const a = class a {
  /**
   * Constructs a new instance of Video.
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
  constructor(e) {
    /**
     * Stores an instance of the video player, once initialized.
     * @type {YT.Player | Vimeo.Player | HTMLVideoElement | null}
     */
    s(this, "player", null);
    this.playerElement = e.playerElement, this.videoId = e.videoId, this.provider = e.provider, this.facade = e.facade || null, this.onVideoPlay = e.onVideoPlay || null, this.onVideoPause = e.onVideoPause || null, this.onBeforeVideoPlay = e.onBeforeVideoPlay || null, this.autoplay = e.autoplay || !1, this.hasAutoplayed = !1, this.facade ? this.facade.addEventListener("click", () => {
      this.init();
    }) : this.init();
  }
  /**
   * Initializes the video player.
   * @returns {Promise<void>}
   */
  async init() {
    this.onBeforeVideoPlay && this.onBeforeVideoPlay();
    try {
      this.provider === "youtube" ? (await this.loadYouTubeApi(), await this.createYouTubePlayer()) : this.provider === "vimeo" ? (await this.loadVimeoApi(), await this.createVimeoPlayer()) : this.provider === "html5" && this.createHTML5Player();
    } catch (e) {
      throw console.error("Error initializing the video player:", e), e;
    }
  }
  /**
   * Loads the YouTube API if it hasn't already been loaded.
   * @returns {Promise<void>}
   */
  async loadYouTubeApi() {
    return a.youtubeApiPromise || (a.youtubeApiPromise = new Promise((e) => {
      if (window.YT && window.YT.Player) {
        e();
        return;
      }
      const i = document.createElement("script");
      i.src = "https://www.youtube.com/iframe_api", document.head.appendChild(i), window.onYouTubeIframeAPIReady = () => {
        e();
      };
    })), a.youtubeApiPromise;
  }
  /**
   * Loads the Vimeo API if it hasn't already been loaded.
   * @returns {Promise<void>}
   */
  async loadVimeoApi() {
    return a.vimeoApiPromise || (a.vimeoApiPromise = new Promise((e) => {
      if (window.Vimeo) {
        e();
        return;
      }
      const i = document.createElement("script");
      i.src = "https://player.vimeo.com/api/player.js", i.onload = () => {
        e();
      }, document.head.appendChild(i);
    })), a.vimeoApiPromise;
  }
  /**
   * Creates the Vimeo player instance.
   * @returns {Promise<void>}
   */
  createVimeoPlayer() {
    return new Promise((e, i) => {
      this.player = new window.Vimeo.Player(this.playerElement, {
        id: this.videoId,
        transparent: !1,
        autopause: !0,
        autoplay: this.autoplay ? 1 : 0
      }), this.player.ready().then(() => {
        this.player.on("loaded", () => {
          this.hideFacade(), this.autoplay && !this.hasAutoplayed ? (this.hasAutoplayed = !0, this.player.play().then(() => {
            this.playEvent(), e();
          }).catch((t) => {
            console.error("Error playing the video:", t), i(t);
          })) : e();
        }), this.player.on("play", this.playEvent.bind(this)), this.player.on("pause", this.pauseEvent.bind(this)), this.player.on("error", (t) => {
          console.error("Vimeo player error:", t), i(t);
        });
      }).catch(i);
    });
  }
  /**
   * Creates the YouTube player instance.
   * @returns {Promise<void>}
   */
  createYouTubePlayer() {
    return new Promise((e, i) => {
      this.player = new window.YT.Player(this.playerElement, {
        videoId: this.videoId,
        width: "1024",
        height: "576",
        playerVars: {
          playsinline: 1,
          rel: 0,
          autoplay: this.autoplay ? 1 : 0
        },
        events: {
          onReady: () => {
            this.hideFacade(), this.autoplay && !this.hasAutoplayed && (this.player.playVideo(), this.hasAutoplayed = !0), e();
          },
          onStateChange: (t) => {
            t.data === window.YT.PlayerState.PLAYING && this.playEvent(), t.data === window.YT.PlayerState.PAUSED && this.pauseEvent();
          },
          onError: (t) => {
            console.error("YouTube player error:", t), i(t);
          }
        }
      });
    });
  }
  /**
   * Creates the HTML5 video player instance.
   * @returns {void}
   */
  createHTML5Player() {
    this.player = this.playerElement, this.hideFacade(), this.autoplay && !this.hasAutoplayed && this.player.play().then(() => {
      this.hasAutoplayed = !0, this.playEvent();
    }).catch((e) => {
      console.error("Error playing the video:", e);
    }), this.player.addEventListener("play", this.playEvent.bind(this)), this.player.addEventListener("pause", this.pauseEvent.bind(this)), this.player.addEventListener("error", (e) => {
      console.error("HTML5 player error:", e);
    });
  }
  /**
   * Hides the facade element.
   * @returns {void}
   */
  hideFacade() {
    this.facade && this.facade.remove();
  }
  /**
   * Event to fire when video is playing
   * @returns {void}
   */
  playEvent() {
    typeof this.onVideoPlay == "function" && this.onVideoPlay(this.player);
  }
  /**
   * Event to fire when video is paused
   * @returns {void}
   */
  pauseEvent() {
    typeof this.onVideoPause == "function" && this.onVideoPause(this.player);
  }
  /**
   * Helper function to determine if the player is paused.
   * @returns {Promise<boolean>} - Resolves to true if paused, false if playing.
   */
  isPaused() {
    return this.provider === "youtube" ? Promise.resolve(this.player.getPlayerState() !== window.YT.PlayerState.PLAYING) : this.provider === "vimeo" ? this.player.getPaused() : this.provider === "html5" ? Promise.resolve(this.player.paused) : Promise.resolve(!0);
  }
  /**
   * Plays the video programmatically.
   * @returns {Promise<void>}
   */
  play() {
    return new Promise((e, i) => {
      this.isPaused().then((t) => {
        t ? this.provider === "youtube" ? (this.player.playVideo(), this.playEvent(), e()) : this.player.play().then(() => {
          this.playEvent(), e();
        }).catch(i) : e();
      }).catch(i);
    });
  }
  /**
   * Pauses the video programmatically.
   * @returns {Promise<void>}
   */
  pause() {
    return new Promise((e, i) => {
      this.isPaused().then((t) => {
        t ? e() : this.provider === "youtube" ? (this.player.pauseVideo(), this.pauseEvent(), e()) : this.provider === "vimeo" ? this.player.pause().then(() => {
          this.pauseEvent(), e();
        }).catch(i) : this.provider === "html5" && (this.player.pause(), this.pauseEvent(), e());
      }).catch(i);
    });
  }
};
/**
 * Static property to track YouTube API loading Promise.
 * @type {Promise<void> | null}
 */
s(a, "youtubeApiPromise", null), /**
 * Static property to track Vimeo API loading Promise.
 * @type {Promise<void> | null}
 */
s(a, "vimeoApiPromise", null);
let o = a;
export {
  o as Video
};
