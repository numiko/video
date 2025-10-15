/// <reference types="youtube" />
import type VimeoPlayer from '@vimeo/player';

// Extend Window interface for API checks
declare global {
  interface Window {
    YT?: typeof YT;
    Vimeo?: {
      Player: typeof VimeoPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Video provider types
type VideoProvider = 'youtube' | 'vimeo' | 'html5';

// Local interface for YouTube player to avoid exposing YT namespace in public API
interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  getPlayerState(): number;
}


type PlayerInstance = YouTubePlayer | VimeoPlayer | HTMLVideoElement;

// Video options interface
interface VideoOptions {
  playerElement: HTMLElement;
  videoId?: string;
  provider: VideoProvider;
  facade?: HTMLElement | null;
  onVideoPlay?: ((player: PlayerInstance) => void) | null;
  onVideoPause?: ((player: PlayerInstance) => void) | null;
  onBeforeVideoPlay?: (() => void) | null;
  autoplay?: boolean;
}

export class Video {
  /**
   * Static property to track YouTube API loading Promise.
   */
  static youtubeApiPromise: Promise<void> | null = null;

  /**
   * Static property to track Vimeo API loading Promise.
   */
  static vimeoApiPromise: Promise<void> | null = null;

  /**
   * Stores an instance of the video player, once initialized.
   */
  player: PlayerInstance | null = null;

  private playerElement: HTMLElement;
  private videoId?: string;
  private provider: VideoProvider;
  private facade: HTMLElement | null;
  private onVideoPlay: ((player: PlayerInstance) => void) | null;
  private onVideoPause: ((player: PlayerInstance) => void) | null;
  private onBeforeVideoPlay: (() => void) | null;
  private autoplay: boolean;
  private hasAutoplayed: boolean;

  /**
   * Constructs a new instance of Video.
   */
  constructor(options: VideoOptions) {
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
   */
  async init(): Promise<void> {
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
   */
  async loadYouTubeApi(): Promise<void> {
    if (Video.youtubeApiPromise) {
      return Video.youtubeApiPromise;
    }

    Video.youtubeApiPromise = new Promise((resolve) => {
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

    return Video.youtubeApiPromise;
  }

  /**
   * Loads the Vimeo API if it hasn't already been loaded.
   */
  async loadVimeoApi(): Promise<void> {
    if (Video.vimeoApiPromise) {
      return Video.vimeoApiPromise;
    }

    Video.vimeoApiPromise = new Promise((resolve) => {
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

    return Video.vimeoApiPromise;
  }


  /**
   * Creates the Vimeo player instance.
   */
  createVimeoPlayer(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.Vimeo) {
        reject(new Error('Vimeo API not loaded'));
        return;
      }

      this.player = new window.Vimeo.Player(this.playerElement, {
        id: this.videoId,
        transparent: false,
        autopause: true,
        autoplay: this.autoplay
      });

      const vimeoPlayer = this.player;

      vimeoPlayer.ready().then(() => {
        vimeoPlayer.on('loaded', () => {
          this.hideFacade();
          if (this.autoplay && !this.hasAutoplayed) {
            this.hasAutoplayed = true;
            vimeoPlayer.play().then(() => {
              this.playEvent();
              resolve();
            }).catch((error: unknown) => {
              console.error('Error playing the video:', error);
              reject(error);
            });
          } else {
            resolve();
          }
        });

        vimeoPlayer.on('play', this.playEvent.bind(this));
        vimeoPlayer.on('pause', this.pauseEvent.bind(this));

        vimeoPlayer.on('error', (error: unknown) => {
          console.error('Vimeo player error:', error);
          reject(error);
        });
      }).catch(reject);
    });
  }

  /**
   * Creates the YouTube player instance.
   */
  createYouTubePlayer(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.YT) {
        reject(new Error('YouTube API not loaded'));
        return;
      }

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
              const ytPlayer = this.player as YT.Player;
              ytPlayer.playVideo();
              this.hasAutoplayed = true;
            }
            resolve();
          },
          onStateChange: (event: { data: number }) => {
            if (!window.YT) return;
            if (event.data === window.YT.PlayerState.PLAYING) {
              this.playEvent();
            }
            if (event.data === window.YT.PlayerState.PAUSED) {
              this.pauseEvent();
            }
          },
          onError: (error: unknown) => {
            console.error('YouTube player error:', error);
            reject(error);
          },
        },
      });
    });
  }

  /**
   * Creates the HTML5 video player instance.
   */
  createHTML5Player(): void {
    this.player = this.playerElement as HTMLVideoElement;
    const html5Player = this.player;

    this.hideFacade();

    if (this.autoplay && !this.hasAutoplayed) {
      html5Player.play().then(() => {
        this.hasAutoplayed = true;
        this.playEvent();
      }).catch((error: unknown) => {
        console.error('Error playing the video:', error);
      });
    }

    html5Player.addEventListener('play', this.playEvent.bind(this));
    html5Player.addEventListener('pause', this.pauseEvent.bind(this));

    html5Player.addEventListener('error', (error: Event) => {
      console.error('HTML5 player error:', error);
    });
  }

  /**
   * Hides the facade element.
   */
  hideFacade(): void {
    if (this.facade) {
      this.facade.remove();
    }
  }

  /**
   * Event to fire when video is playing
   */
  playEvent(): void {
    if (typeof this.onVideoPlay === 'function' && this.player) {
      this.onVideoPlay(this.player);
    }
  }

  /**
   * Event to fire when video is paused
   */
  pauseEvent(): void {
    if (typeof this.onVideoPause === 'function' && this.player) {
      this.onVideoPause(this.player);
    }
  }


  /**
   * Helper function to determine if the player is paused.
   */
  isPaused(): Promise<boolean> {
    if (!this.player) {
      return Promise.resolve(true);
    }

    if (this.provider === 'youtube' && window.YT) {
      const ytPlayer = this.player as YT.Player;
      return Promise.resolve(ytPlayer.getPlayerState() !== window.YT.PlayerState.PLAYING);
    } else if (this.provider === 'vimeo') {
      const vimeoPlayer = this.player as VimeoPlayer;
      return vimeoPlayer.getPaused();
    } else if (this.provider === 'html5') {
      const html5Player = this.player as HTMLVideoElement;
      return Promise.resolve(html5Player.paused);
    }
    return Promise.resolve(true);
  }

  /**
   * Plays the video programmatically.
   */
  play(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.player) {
        reject(new Error('Player not initialized'));
        return;
      }

      this.isPaused().then((paused: boolean) => {
        if (paused) {
          if (this.provider === 'youtube') {
            const ytPlayer = this.player as YT.Player;
            ytPlayer.playVideo();
            this.playEvent();
            resolve();
          } else if (this.provider === 'vimeo') {
            const vimeoPlayer = this.player as VimeoPlayer;
            vimeoPlayer.play().then(() => {
              this.playEvent();
              resolve();
            }).catch(reject);
          } else if (this.provider === 'html5') {
            const html5Player = this.player as HTMLVideoElement;
            html5Player.play().then(() => {
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
   */
  pause(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.player) {
        reject(new Error('Player not initialized'));
        return;
      }

      this.isPaused().then((paused: boolean) => {
        if (!paused) {
          if (this.provider === 'youtube') {
            const ytPlayer = this.player as YT.Player;
            ytPlayer.pauseVideo();
            this.pauseEvent();
            resolve();
          } else if (this.provider === 'vimeo') {
            const vimeoPlayer = this.player as VimeoPlayer;
            vimeoPlayer.pause().then(() => {
              this.pauseEvent();
              resolve();
            }).catch(reject);
          } else if (this.provider === 'html5') {
            const html5Player = this.player as HTMLVideoElement;
            html5Player.pause();
            this.pauseEvent();
            resolve();
          }
        } else {
          resolve();
        }
      }).catch(reject);
    });
  }
}
