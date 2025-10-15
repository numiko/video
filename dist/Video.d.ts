declare type PlayerInstance = YTPlayer | VimeoPlayer | HTMLVideoElement;

export declare class Video {
    /**
     * Static property to track YouTube API loading Promise.
     */
    static youtubeApiPromise: Promise<void> | null;
    /**
     * Static property to track Vimeo API loading Promise.
     */
    static vimeoApiPromise: Promise<void> | null;
    /**
     * Stores an instance of the video player, once initialized.
     */
    player: PlayerInstance | null;
    private playerElement;
    private videoId?;
    private provider;
    private facade;
    private onVideoPlay;
    private onVideoPause;
    private onBeforeVideoPlay;
    private autoplay;
    private hasAutoplayed;
    /**
     * Constructs a new instance of Video.
     */
    constructor(options: VideoOptions);
    /**
     * Initializes the video player.
     */
    init(): Promise<void>;
    /**
     * Loads the YouTube API if it hasn't already been loaded.
     */
    loadYouTubeApi(): Promise<void>;
    /**
     * Loads the Vimeo API if it hasn't already been loaded.
     */
    loadVimeoApi(): Promise<void>;
    /**
     * Creates the Vimeo player instance.
     */
    createVimeoPlayer(): Promise<void>;
    /**
     * Creates the YouTube player instance.
     */
    createYouTubePlayer(): Promise<void>;
    /**
     * Creates the HTML5 video player instance.
     */
    createHTML5Player(): void;
    /**
     * Hides the facade element.
     */
    hideFacade(): void;
    /**
     * Event to fire when video is playing
     */
    playEvent(): void;
    /**
     * Event to fire when video is paused
     */
    pauseEvent(): void;
    /**
     * Helper function to determine if the player is paused.
     */
    isPaused(): Promise<boolean>;
    /**
     * Plays the video programmatically.
     */
    play(): Promise<void>;
    /**
     * Pauses the video programmatically.
     */
    pause(): Promise<void>;
}

declare interface VideoOptions {
    playerElement: HTMLElement;
    videoId?: string;
    provider: VideoProvider;
    facade?: HTMLElement | null;
    onVideoPlay?: ((player: PlayerInstance) => void) | null;
    onVideoPause?: ((player: PlayerInstance) => void) | null;
    onBeforeVideoPlay?: (() => void) | null;
    autoplay?: boolean;
}

declare type VideoProvider = 'youtube' | 'vimeo' | 'html5';

declare class VimeoPlayer {
    constructor(element: HTMLElement, options: VimeoPlayerOptions);
    ready(): Promise<void>;
    on(event: string, callback: (data?: unknown) => void): void;
    play(): Promise<void>;
    pause(): Promise<void>;
    getPaused(): Promise<boolean>;
}

declare interface VimeoPlayerOptions {
    id: string;
    transparent: boolean;
    autopause: boolean;
    autoplay: number;
}

declare class YTPlayer {
    constructor(element: HTMLElement, options: YTPlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    getPlayerState(): number;
}

declare interface YTPlayerEvents {
    onReady?: () => void;
    onStateChange?: (event: {
        data: number;
    }) => void;
    onError?: (error: unknown) => void;
}

declare interface YTPlayerOptions {
    videoId: string;
    width: string;
    height: string;
    playerVars: YTPlayerVars;
    events: YTPlayerEvents;
}

declare interface YTPlayerVars {
    playsinline: number;
    rel: number;
    autoplay: number;
}

export { }
