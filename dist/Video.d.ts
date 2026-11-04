export class Video {
    /**
     * Static property to track YouTube API loading Promise.
     * @type {Promise<void> | null}
     */
    static youtubeApiPromise: Promise<void> | null;
    /**
     * Static property to track Vimeo API loading Promise.
     * @type {Promise<void> | null}
     */
    static vimeoApiPromise: Promise<void> | null;
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
    constructor(options: {
        playerElement: HTMLElement;
        videoId: string;
        provider: "youtube" | "vimeo" | "html5";
        facade?: HTMLElement | undefined;
        onVideoPlay?: Function | undefined;
        onVideoPause?: Function | undefined;
        onBeforeVideoPlay?: Function | undefined;
        autoplay?: boolean | undefined;
    });
    /**
     * Stores an instance of the video player, once initialized.
     * @type {YT.Player | Vimeo.Player | HTMLVideoElement | null}
     */
    player: YT.Player | Vimeo.Player | HTMLVideoElement | null;
    playerElement: HTMLElement;
    videoId: string;
    provider: "youtube" | "vimeo" | "html5";
    facade: HTMLElement | null;
    onVideoPlay: Function | null;
    onVideoPause: Function | null;
    onBeforeVideoPlay: Function | null;
    autoplay: boolean;
    hasAutoplayed: boolean;
    /**
     * Initializes the video player.
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Loads the YouTube API if it hasn't already been loaded.
     * @returns {Promise<void>}
     */
    loadYouTubeApi(): Promise<void>;
    /**
     * Loads the Vimeo API if it hasn't already been loaded.
     * @returns {Promise<void>}
     */
    loadVimeoApi(): Promise<void>;
    /**
     * Creates the Vimeo player instance.
     * @returns {Promise<void>}
     */
    createVimeoPlayer(): Promise<void>;
    /**
     * Creates the YouTube player instance.
     * @returns {Promise<void>}
     */
    createYouTubePlayer(): Promise<void>;
    /**
     * Creates the HTML5 video player instance.
     * @returns {void}
     */
    createHTML5Player(): void;
    /**
     * Hides the facade element.
     * @returns {void}
     */
    hideFacade(): void;
    /**
     * Event to fire when video is playing
     * @returns {void}
     */
    playEvent(): void;
    /**
     * Event to fire when video is paused
     * @returns {void}
     */
    pauseEvent(): void;
    /**
     * Helper function to determine if the player is paused.
     * @returns {Promise<boolean>} - Resolves to true if paused, false if playing.
     */
    isPaused(): Promise<boolean>;
    /**
     * Plays the video programmatically.
     * @returns {Promise<void>}
     */
    play(): Promise<void>;
    /**
     * Pauses the video programmatically.
     * @returns {Promise<void>}
     */
    pause(): Promise<void>;
}
