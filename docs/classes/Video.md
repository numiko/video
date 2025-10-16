[**@numiko/video**](../README.md)

***

[@numiko/video](../README.md) / Video

# Class: Video

Defined in: [Video.ts:41](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-41)

## Constructors

### Constructor

> **new Video**(`options`): `Video`

Defined in: [Video.ts:70](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-70)

Constructs a new instance of Video.

#### Parameters

##### options

[`VideoOptions`](../type-aliases/VideoOptions.md)

#### Returns

`Video`

## Properties

### player

> **player**: [`PlayerInstance`](../type-aliases/PlayerInstance.md) \| `null` = `null`

Defined in: [Video.ts:55](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-55)

Stores an instance of the video player, once initialized.

***

### vimeoApiPromise

> `static` **vimeoApiPromise**: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\> \| `null` = `null`

Defined in: [Video.ts:50](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-50)

Static property to track Vimeo API loading Promise.

***

### youtubeApiPromise

> `static` **youtubeApiPromise**: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\> \| `null` = `null`

Defined in: [Video.ts:45](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-45)

Static property to track YouTube API loading Promise.

## Methods

### createHTML5Player()

> **createHTML5Player**(): `void`

Defined in: [Video.ts:262](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-262)

Creates the HTML5 video player instance.

#### Returns

`void`

***

### createVimeoPlayer()

> **createVimeoPlayer**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [Video.ts:168](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-168)

Creates the Vimeo player instance.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### createYouTubePlayer()

> **createYouTubePlayer**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [Video.ts:215](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-215)

Creates the YouTube player instance.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### hideFacade()

> **hideFacade**(): `void`

Defined in: [Video.ts:288](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-288)

Hides the facade element.

#### Returns

`void`

***

### init()

> **init**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [Video.ts:93](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-93)

Initializes the video player.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### isPaused()

> **isPaused**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

Defined in: [Video.ts:316](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-316)

Helper function to determine if the player is paused.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

***

### loadVimeoApi()

> **loadVimeoApi**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [Video.ts:142](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-142)

Loads the Vimeo API if it hasn't already been loaded.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### loadYouTubeApi()

> **loadYouTubeApi**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [Video.ts:116](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-116)

Loads the YouTube API if it hasn't already been loaded.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### pause()

> **pause**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [Video.ts:374](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-374)

Pauses the video programmatically.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### pauseEvent()

> **pauseEvent**(): `void`

Defined in: [Video.ts:306](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-306)

Event to fire when video is paused

#### Returns

`void`

***

### play()

> **play**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Defined in: [Video.ts:337](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-337)

Plays the video programmatically.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### playEvent()

> **playEvent**(): `void`

Defined in: [Video.ts:297](https://bitbucket.org/numiko/video/src/11f6bab07f320b53cc99907fa465dc0618bc3178/lib/Video.ts#lines-297)

Event to fire when video is playing

#### Returns

`void`
