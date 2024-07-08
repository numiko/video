var s = Object.defineProperty;
var l = (a, e, t) => e in a ? s(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var r = (a, e, t) => l(a, typeof e != "symbol" ? e + "" : e, t);
const i = class i {
  /**
   * Constructs a new instance of VideoEmbed.
   * @param {Object} options - Options for initializing the video embed.
   * @param {HTMLElement} options.playerElement - The HTML element that the video is injected into.
   * @param {string} options.videoId - The video's ID.
   * @param {'youtube' | 'vimeo' | 'html5'} options.provider - The video's provider.
   * @param {HTMLElement} [options.facade] - Optional HTML element that is displayed as a facade before the video is initiated.
   * @param {HTMLElement} [options.playPausebutton] - Optional HTML element for play/pause functionality.
   * @param {Function} [options.onVideoPlay] - Optional callback function for when the video plays.
   * @param {Function} [options.onVideoPause] - Optional callback function for when the video pauses.
   * @param {Function} [options.onBeforeVideoPlay] - Optional callback function for before the video plays.
   */
  constructor(e) {
    /**
     * Stores an instance of the video player, once initialized.
     * @type {YT.Player | Vimeo.Player | HTMLVideoElement | null}
     */
    r(this, "player", null);
    this.playerElement = e.playerElement, this.videoId = e.videoId, this.provider = e.provider, this.facade = e.facade || null, this.playPausebutton = e.playPausebutton || null, this.onVideoPlay = e.onVideoPlay || null, this.onVideoPause = e.onVideoPause || null, this.onBeforeVideoPlay = e.onBeforeVideoPlay || null, this.facade ? this.facade.addEventListener("click", () => {
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
      this.provider === "youtube" ? (await this.loadYouTubeApi(), this.createYouTubePlayer()) : this.provider === "vimeo" ? (await this.loadVimeoApi(), this.createVimeoPlayer()) : this.provider === "html5" && this.createHTML5Player();
    } catch (e) {
      console.error("Error initializing the video player:", e);
    }
    this.playPausebutton && this.addEventListeners();
  }
  /**
   * Loads the YouTube API if it hasn't already been loaded.
   * @returns {Promise<void>}
   */
  async loadYouTubeApi() {
    return i.youtubeApiPromise || (i.youtubeApiPromise = new Promise((e) => {
      if (window.YT && window.YT.Player) {
        e();
        return;
      }
      const t = document.createElement("script");
      t.src = "https://www.youtube.com/iframe_api", document.head.appendChild(t), window.onYouTubeIframeAPIReady = () => {
        e();
      };
    })), i.youtubeApiPromise;
  }
  /**
   * Loads the Vimeo API if it hasn't already been loaded.
   * @returns {Promise<void>}
   */
  async loadVimeoApi() {
    return i.vimeoApiPromise || (i.vimeoApiPromise = new Promise((e) => {
      if (window.Vimeo) {
        e();
        return;
      }
      const t = document.createElement("script");
      t.src = "https://player.vimeo.com/api/player.js", t.onload = () => {
        e();
      }, document.head.appendChild(t);
    })), i.vimeoApiPromise;
  }
  /**
   * Hides the facade element.
   * @returns {Void}
   */
  hideFacade() {
    var e;
    (e = this.facade) == null || e.remove();
  }
  /**
   * Event to fire when video is playing
   * @returns {Void}
   */
  playEvent() {
    var e;
    (e = this.playPausebutton) == null || e.setAttribute("aria-pressed", "false");
  }
  /**
   * Event to fire when video is paused
   * @returns {Void}
   */
  pauseEvent() {
    var e;
    (e = this.playPausebutton) == null || e.setAttribute("aria-pressed", "true");
  }
  /**
   * Creates the Vimeo player instance.
   * @returns {Void}
   */
  createVimeoPlayer() {
    this.player = new window.Vimeo.Player(this.playerElement, {
      ...this.videoId && { id: this.videoId },
      transparent: !1
    }), this.player.on("loaded", () => {
      this.facade && this.player.play().then(() => {
        this.hideFacade();
      }).catch((e) => {
        console.error("Error playing the video:", e);
      });
    }), this.player.on("play", () => {
      typeof this.onVideoPlay == "function" && this.onVideoPlay(this.player);
    }), this.player.on("pause", () => {
      typeof this.onVideoPause == "function" && this.onVideoPause(this.player);
    }), this.player.on("error", (e) => {
      console.error("Vimeo player error:", e);
    });
  }
  /**
   * Creates the YouTube player instance.
   * @returns {Void}
   */
  createYouTubePlayer() {
    this.player = new window.YT.Player(this.playerElement, {
      ...this.videoId && { videoId: this.videoId },
      width: "1024",
      // 16:9
      height: "576",
      // 16:9
      playerVars: {
        playsinline: 1,
        rel: 0,
        autoplay: 0
      },
      events: {
        onReady: () => {
          this.facade && (this.hideFacade(), this.player.playVideo());
        },
        onStateChange: (e) => {
          e.data === window.YT.PlayerState.PLAYING && typeof this.onVideoPlay == "function" && this.onVideoPlay(this.player), e.data === window.YT.PlayerState.PAUSED && typeof this.onVideoPause == "function" && this.onVideoPause(this.player);
        },
        onError: (e) => {
          console.error("YouTube player error:", e);
        }
      }
    });
  }
  /**
   * Creates the HTML5 video player instance.
   * @returns {Void}
   */
  createHTML5Player() {
    this.player = this.playerElement, this.facade && this.player.play().then(() => {
      this.hideFacade();
    }).catch((e) => {
      console.error("Error playing the video:", e);
    }), this.player.addEventListener("play", () => {
      typeof this.onVideoPlay == "function" && this.onVideoPlay(this.player);
    }), this.player.addEventListener("pause", () => {
      typeof this.onVideoPause == "function" && this.onVideoPause(this.player);
    }), this.player.addEventListener("error", (e) => {
      console.error("HTML5 player error:", e);
    });
  }
  /**
   * Adds event listeners to the instance.
   * @returns {Void}
   */
  addEventListeners() {
    this.playPausebutton.addEventListener("click", () => {
      if (this.provider === "youtube") {
        const e = this.player.getPlayerState();
        e === window.YT.PlayerState.PAUSED || e === window.YT.PlayerState.ENDED ? (this.player.playVideo(), this.playEvent()) : e === window.YT.PlayerState.PLAYING && (this.player.pauseVideo(), this.pauseEvent());
      } else this.provider === "vimeo" ? this.player.getPaused().then((e) => {
        e ? (this.player.play(), this.playEvent()) : (this.player.pause(), this.pauseEvent());
      }) : this.provider === "html5" && (this.player.paused ? (this.player.play(), this.playEvent()) : (this.player.pause(), this.pauseEvent()));
    });
  }
};
/**
 * Static property to track YouTube API loading Promise.
 * @type {Promise<void> | null}
 */
r(i, "youtubeApiPromise", null), /**
 * Static property to track Vimeo API loading Promise.
 * @type {Promise<void> | null}
 */
r(i, "vimeoApiPromise", null);
let o = i;
export {
  o as VideoEmbed
};
