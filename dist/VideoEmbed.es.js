var s = Object.defineProperty;
var o = (t, e, i) => e in t ? s(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var a = (t, e, i) => o(t, typeof e != "symbol" ? e + "" : e, i);
class l {
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
  constructor(e) {
    /**
     * Stores an instance of the video player, once initialised.
     * @type {YT.Player | Vimeo.Player | null}
     */
    a(this, "player", null);
    this.playerElement = e.playerElement, this.videoId = e.videoId, this.provider = e.provider, this.facade = e.facade || null, this.playPausebutton = e.playPausebutton || null, this.onVideoPlay = e.onVideoPlay || null, this.onVideoPause = e.onVideoPause || null, this.onBeforeVideoPlay = e.onBeforeVideoPlay || null, this.facade ? this.facade.addEventListener("click", () => {
      this.init();
    }) : this.init();
  }
  /**
   * Initialises the video player.
   */
  async init() {
    this.onBeforeVideoPlay && this.onBeforeVideoPlay(), this.provider === "youtube" ? (await this.loadYouTubeApi(), this.createYouTubePlayer()) : this.provider === "vimeo" && (await this.loadVimeoApi(), this.createVimeoPlayer()), this.playPausebutton && this.addEventListeners();
  }
  /**
   * Loads the YouTube API if it hasn't already been loaded.
   * @returns {Promise}
   */
  async loadYouTubeApi() {
    return window.YT && window.YT.Player ? Promise.resolve() : new Promise((e) => {
      const i = document.createElement("script");
      i.src = "https://www.youtube.com/iframe_api", document.head.appendChild(i), window.onYouTubeIframeAPIReady = () => {
        e();
      };
    });
  }
  /**
   * Loads the Vimeo API if it hasn't already been loaded.
   * @returns {Promise}
   */
  async loadVimeoApi() {
    return window.Vimeo ? Promise.resolve() : new Promise((e) => {
      const i = document.createElement("script");
      i.src = "https://player.vimeo.com/api/player.js", i.onload = () => {
        e();
      }, document.head.appendChild(i);
    });
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
   */
  playEvent() {
    var e;
    (e = this.playPausebutton) == null || e.setAttribute("aria-pressed", "false");
  }
  /**
   * Event to fire when video is paused
   */
  pauseEvent() {
    var e;
    (e = this.playPausebutton) == null || e.setAttribute("aria-pressed", "true");
  }
  /**
   * Creates the Vimeo player instance.
   */
  createVimeoPlayer() {
    this.player = new window.Vimeo.Player(this.playerElement, {
      ...this.videoId && { id: this.videoId },
      transparent: !1
    }), this.player.on("loaded", () => {
      this.player.play().then(() => {
        this.hideFacade();
      }).catch((e) => {
        console.error("Error playing the video:", e);
      });
    }), this.player.on("play", () => {
      typeof this.onVideoPlay == "function" && this.onVideoPlay(this.player);
    }), this.player.on("pause", () => {
      typeof this.onVideoPause == "function" && this.onVideoPause(this.player);
    });
  }
  /**
   * Creates the YouTube player instance.
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
        autoplay: 1
      },
      events: {
        onReady: () => {
          this.hideFacade();
        },
        onStateChange: (e) => {
          e.data === window.YT.PlayerState.PLAYING && typeof this.onVideoPlay == "function" && this.onVideoPlay(this.player), e.data === window.YT.PlayerState.PAUSED && typeof this.onVideoPause == "function" && this.onVideoPause(this.player);
        }
      }
    });
  }
  /**
   * Adds event listeners to the instance.
   */
  addEventListeners() {
    this.playPausebutton.addEventListener("click", () => {
      if (this.provider === "youtube") {
        const e = this.player.getPlayerState();
        e === window.YT.PlayerState.PAUSED || e === window.YT.PlayerState.ENDED ? (this.player.playVideo(), this.playEvent()) : e === window.YT.PlayerState.PLAYING && (this.player.pauseVideo(), this.pauseEvent());
      } else this.provider === "vimeo" && this.player.getPaused().then((e) => {
        e ? (this.player.play(), this.playEvent()) : (this.player.pause(), this.pauseEvent());
      });
    });
  }
}
export {
  l as VideoEmbed
};
