const a = class a {
  /**
   * Constructs a new instance of Video.
   */
  constructor(e) {
    this.player = null, this.playerElement = e.playerElement, this.videoId = e.videoId, this.provider = e.provider, this.facade = e.facade || null, this.onVideoPlay = e.onVideoPlay || null, this.onVideoPause = e.onVideoPause || null, this.onBeforeVideoPlay = e.onBeforeVideoPlay || null, this.autoplay = e.autoplay || !1, this.hasAutoplayed = !1, this.facade ? this.facade.addEventListener("click", () => {
      this.init();
    }) : this.init();
  }
  /**
   * Initializes the video player.
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
   */
  createVimeoPlayer() {
    return new Promise((e, i) => {
      if (!window.Vimeo) {
        i(new Error("Vimeo API not loaded"));
        return;
      }
      this.player = new window.Vimeo.Player(this.playerElement, {
        id: this.videoId,
        transparent: !1,
        autopause: !0,
        autoplay: this.autoplay
      });
      const t = this.player;
      t.ready().then(() => {
        t.on("loaded", () => {
          this.hideFacade(), this.autoplay && !this.hasAutoplayed ? (this.hasAutoplayed = !0, t.play().then(() => {
            this.playEvent(), e();
          }).catch((r) => {
            console.error("Error playing the video:", r), i(r);
          })) : e();
        }), t.on("play", this.playEvent.bind(this)), t.on("pause", this.pauseEvent.bind(this)), t.on("error", (r) => {
          console.error("Vimeo player error:", r), i(r);
        });
      }).catch(i);
    });
  }
  /**
   * Creates the YouTube player instance.
   */
  createYouTubePlayer() {
    return new Promise((e, i) => {
      if (!window.YT) {
        i(new Error("YouTube API not loaded"));
        return;
      }
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
            window.YT && (t.data === window.YT.PlayerState.PLAYING && this.playEvent(), t.data === window.YT.PlayerState.PAUSED && this.pauseEvent());
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
   */
  createHTML5Player() {
    this.player = this.playerElement;
    const e = this.player;
    this.hideFacade(), this.autoplay && !this.hasAutoplayed && e.play().then(() => {
      this.hasAutoplayed = !0, this.playEvent();
    }).catch((i) => {
      console.error("Error playing the video:", i);
    }), e.addEventListener("play", this.playEvent.bind(this)), e.addEventListener("pause", this.pauseEvent.bind(this)), e.addEventListener("error", (i) => {
      console.error("HTML5 player error:", i);
    });
  }
  /**
   * Hides the facade element.
   */
  hideFacade() {
    this.facade && this.facade.remove();
  }
  /**
   * Event to fire when video is playing
   */
  playEvent() {
    typeof this.onVideoPlay == "function" && this.player && this.onVideoPlay(this.player);
  }
  /**
   * Event to fire when video is paused
   */
  pauseEvent() {
    typeof this.onVideoPause == "function" && this.player && this.onVideoPause(this.player);
  }
  /**
   * Helper function to determine if the player is paused.
   */
  isPaused() {
    if (!this.player)
      return Promise.resolve(!0);
    if (this.provider === "youtube" && window.YT) {
      const e = this.player;
      return Promise.resolve(e.getPlayerState() !== window.YT.PlayerState.PLAYING);
    } else {
      if (this.provider === "vimeo")
        return this.player.getPaused();
      if (this.provider === "html5") {
        const e = this.player;
        return Promise.resolve(e.paused);
      }
    }
    return Promise.resolve(!0);
  }
  /**
   * Plays the video programmatically.
   */
  play() {
    return new Promise((e, i) => {
      if (!this.player) {
        i(new Error("Player not initialized"));
        return;
      }
      this.isPaused().then((t) => {
        t ? this.provider === "youtube" ? (this.player.playVideo(), this.playEvent(), e()) : this.provider === "vimeo" ? this.player.play().then(() => {
          this.playEvent(), e();
        }).catch(i) : this.provider === "html5" && this.player.play().then(() => {
          this.playEvent(), e();
        }).catch(i) : e();
      }).catch(i);
    });
  }
  /**
   * Pauses the video programmatically.
   */
  pause() {
    return new Promise((e, i) => {
      if (!this.player) {
        i(new Error("Player not initialized"));
        return;
      }
      this.isPaused().then((t) => {
        t ? e() : this.provider === "youtube" ? (this.player.pauseVideo(), this.pauseEvent(), e()) : this.provider === "vimeo" ? this.player.pause().then(() => {
          this.pauseEvent(), e();
        }).catch(i) : this.provider === "html5" && (this.player.pause(), this.pauseEvent(), e());
      }).catch(i);
    });
  }
};
a.youtubeApiPromise = null, a.vimeoApiPromise = null;
let o = a;
export {
  o as Video
};
