// lib/Video.js
var e = class e {
	static youtubeApiPromise = null;
	static vimeoApiPromise = null;
	player = null;
	constructor(e) {
		this.playerElement = e.playerElement, this.videoId = e.videoId, this.provider = e.provider, this.facade = e.facade || null, this.onVideoPlay = e.onVideoPlay || null, this.onVideoPause = e.onVideoPause || null, this.onBeforeVideoPlay = e.onBeforeVideoPlay || null, this.autoplay = e.autoplay || !1, this.hasAutoplayed = !1, this.facade ? this.facade.addEventListener("click", () => {
			this.init();
		}) : this.init();
	}
	async init() {
		this.onBeforeVideoPlay && this.onBeforeVideoPlay();
		try {
			this.provider === "youtube" ? (await this.loadYouTubeApi(), await this.createYouTubePlayer()) : this.provider === "vimeo" ? (await this.loadVimeoApi(), await this.createVimeoPlayer()) : this.provider === "html5" && this.createHTML5Player();
		} catch (e) {
			throw console.error("Error initializing the video player:", e), e;
		}
	}
	async loadYouTubeApi() {
		return e.youtubeApiPromise ||= new Promise((e) => {
			if (window.YT && window.YT.Player) {
				e();
				return;
			}
			let t = document.createElement("script");
			t.src = "https://www.youtube.com/iframe_api", document.head.appendChild(t), window.onYouTubeIframeAPIReady = () => {
				e();
			};
		}), e.youtubeApiPromise;
	}
	async loadVimeoApi() {
		return e.vimeoApiPromise ||= new Promise((e) => {
			if (window.Vimeo) {
				e();
				return;
			}
			let t = document.createElement("script");
			t.src = "https://player.vimeo.com/api/player.js", t.onload = () => {
				e();
			}, document.head.appendChild(t);
		}), e.vimeoApiPromise;
	}
	createVimeoPlayer() {
		return new Promise((e, t) => {
			this.player = new window.Vimeo.Player(this.playerElement, {
				id: this.videoId,
				transparent: !1,
				autopause: !0,
				autoplay: +!!this.autoplay
			}), this.player.ready().then(() => {
				this.player.on("loaded", () => {
					this.hideFacade(), this.autoplay && !this.hasAutoplayed ? (this.hasAutoplayed = !0, this.player.play().then(() => {
						this.playEvent(), e();
					}).catch((e) => {
						console.error("Error playing the video:", e), t(e);
					})) : e();
				}), this.player.on("play", this.playEvent.bind(this)), this.player.on("pause", this.pauseEvent.bind(this)), this.player.on("error", (e) => {
					console.error("Vimeo player error:", e), t(e);
				});
			}).catch(t);
		});
	}
	createYouTubePlayer() {
		return new Promise((e, t) => {
			this.player = new window.YT.Player(this.playerElement, {
				videoId: this.videoId,
				width: "1024",
				height: "576",
				playerVars: {
					playsinline: 1,
					rel: 0,
					autoplay: +!!this.autoplay
				},
				events: {
					onReady: () => {
						this.hideFacade(), this.autoplay && !this.hasAutoplayed && (this.player.playVideo(), this.hasAutoplayed = !0), e();
					},
					onStateChange: (e) => {
						e.data === window.YT.PlayerState.PLAYING && this.playEvent(), e.data === window.YT.PlayerState.PAUSED && this.pauseEvent();
					},
					onError: (e) => {
						console.error("YouTube player error:", e), t(e);
					}
				}
			});
		});
	}
	createHTML5Player() {
		this.player = this.playerElement, this.hideFacade(), this.autoplay && !this.hasAutoplayed && this.player.play().then(() => {
			this.hasAutoplayed = !0, this.playEvent();
		}).catch((e) => {
			console.error("Error playing the video:", e);
		}), this.player.addEventListener("play", this.playEvent.bind(this)), this.player.addEventListener("pause", this.pauseEvent.bind(this)), this.player.addEventListener("error", (e) => {
			console.error("HTML5 player error:", e);
		});
	}
	hideFacade() {
		this.facade && this.facade.remove();
	}
	playEvent() {
		typeof this.onVideoPlay == "function" && this.onVideoPlay(this.player);
	}
	pauseEvent() {
		typeof this.onVideoPause == "function" && this.onVideoPause(this.player);
	}
	isPaused() {
		return this.provider === "youtube" ? Promise.resolve(this.player.getPlayerState() !== window.YT.PlayerState.PLAYING) : this.provider === "vimeo" ? this.player.getPaused() : this.provider === "html5" ? Promise.resolve(this.player.paused) : Promise.resolve(!0);
	}
	play() {
		return new Promise((e, t) => {
			this.isPaused().then((n) => {
				n ? this.provider === "youtube" ? (this.player.playVideo(), this.playEvent(), e()) : this.player.play().then(() => {
					this.playEvent(), e();
				}).catch(t) : e();
			}).catch(t);
		});
	}
	pause() {
		return new Promise((e, t) => {
			this.isPaused().then((n) => {
				n ? e() : this.provider === "youtube" ? (this.player.pauseVideo(), this.pauseEvent(), e()) : this.provider === "vimeo" ? this.player.pause().then(() => {
					this.pauseEvent(), e();
				}).catch(t) : this.provider === "html5" && (this.player.pause(), this.pauseEvent(), e());
			}).catch(t);
		});
	}
};
export { e as Video };
