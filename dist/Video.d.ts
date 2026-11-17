import { default as VimeoPlayer } from '@vimeo/player';
declare global {
    interface Window {
        YT?: typeof YT;
        Vimeo?: {
            Player: typeof VimeoPlayer;
        };
        onYouTubeIframeAPIReady?: () => void;
    }
}
type VideoProvider = 'youtube' | 'vimeo' | 'html5';
type YouTubePlayer = {
    playVideo(): void;
    pauseVideo(): void;
    getPlayerState(): number;
};
type PlayerInstance = YouTubePlayer | VimeoPlayer | HTMLVideoElement;
type VideoOptions = {
    playerElement: HTMLElement;
    videoId?: string;
    provider: VideoProvider;
    facade?: HTMLElement | null;
    onVideoPlay?: ((player: PlayerInstance) => void) | null;
    onVideoPause?: ((player: PlayerInstance) => void) | null;
    onBeforeVideoPlay?: (() => void) | null;
    autoplay?: boolean;
};
declare class Video {
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
     * Type predicate to check if the player is a YouTube player.
     */
    private isYouTubePlayer;
    /**
     * Type predicate to check if the player is a Vimeo player.
     */
    private isVimeoPlayer;
    /**
     * Type predicate to check if the player is an HTML5 video element.
     */
    private isHTML5Player;
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
export { Video, type VideoProvider, type VideoOptions, type PlayerInstance, type YouTubePlayer, };
