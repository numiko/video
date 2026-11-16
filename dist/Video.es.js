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
   * Type predicate to check if the player is a YouTube player.
   */
  isYouTubePlayer(e) {
    return this.provider === "youtube" && e !== null;
  }
  /**
   * Type predicate to check if the player is a Vimeo player.
   */
  isVimeoPlayer(e) {
    return this.provider === "vimeo" && e !== null;
  }
  /**
   * Type predicate to check if the player is an HTML5 video element.
   */
  isHTML5Player(e) {
    return this.provider === "html5" && e !== null;
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
      const t = this.facade && this.autoplay;
      this.player = new window.Vimeo.Player(this.playerElement, {
        id: this.videoId,
        transparent: !1,
        autopause: !0,
        autoplay: t ? !1 : this.autoplay,
        ...t && { playsinline: !0 }
      });
      const r = this.player;
      r.ready().then(() => {
        r.on("loaded", () => {
          this.hideFacade(), this.autoplay && !this.hasAutoplayed ? (this.hasAutoplayed = !0, r.play().then(() => {
            e();
          }).catch((s) => {
            if (t) {
              e();
              return;
            }
            console.error("Error playing the video:", s), i(s);
          })) : e();
        }), r.on("play", () => {
          this.autoplay && !this.hasAutoplayed && (this.hasAutoplayed = !0), this.playEvent();
        }), r.on("pause", this.pauseEvent.bind(this)), r.on("error", (s) => {
          t || (console.error("Vimeo player error:", s), i(s));
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
            this.hideFacade(), this.autoplay && !this.hasAutoplayed && this.isYouTubePlayer(this.player) && (this.player.playVideo(), this.hasAutoplayed = !0), e();
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
    if (this.player = this.playerElement, !this.isHTML5Player(this.player)) {
      console.error("Failed to initialize HTML5 player");
      return;
    }
    this.hideFacade(), this.autoplay && !this.hasAutoplayed && this.player.play().then(() => {
      this.hasAutoplayed = !0;
    }).catch((e) => {
      console.error("Error playing the video:", e);
    }), this.player.addEventListener("play", this.playEvent.bind(this)), this.player.addEventListener("pause", this.pauseEvent.bind(this)), this.player.addEventListener("error", (e) => {
      console.error("HTML5 player error:", e);
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
    return this.player ? this.isYouTubePlayer(this.player) && window.YT ? Promise.resolve(this.player.getPlayerState() !== window.YT.PlayerState.PLAYING) : this.isVimeoPlayer(this.player) ? this.player.getPaused() : this.isHTML5Player(this.player) ? Promise.resolve(this.player.paused) : Promise.resolve(!0) : Promise.resolve(!0);
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
        t ? this.isYouTubePlayer(this.player) ? (this.player.playVideo(), e()) : this.isVimeoPlayer(this.player) ? this.player.play().then(() => {
          e();
        }).catch(i) : this.isHTML5Player(this.player) && this.player.play().then(() => {
          e();
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
        t ? e() : this.isYouTubePlayer(this.player) ? (this.player.pauseVideo(), e()) : this.isVimeoPlayer(this.player) ? this.player.pause().then(() => {
          e();
        }).catch(i) : this.isHTML5Player(this.player) && (this.player.pause(), e());
      }).catch(i);
    });
  }
};
a.youtubeApiPromise = null, a.vimeoApiPromise = null;
let o = a;
export {
  o as Video
};
