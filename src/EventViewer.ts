import {
    Container,
    ContainerEvents,
    FederatedPointerEvent,
    Assets,
    Texture,
    Sprite,
} from "pixi.js";
import "@pixi/sound";
// import '@pixi-spine/loader-uni'
// import { loadJson, loadCSVText } from "./utils/loadJson";
// import { CSVToJSON, searchFromMasterList } from "./utils/translation";
import { Banner, TrackLog } from "./utils/log";
import { updateConfig, flatten } from "./utils/updateSetting";
import { createEmptySprite } from "./utils/emptySprite";
import type { ViewerProps, spineAlias } from "@/types/setting";
import type { TrackFrames } from "@/types/track";
import type { TranslateReader } from "@/types/translate";

import { BGController } from "./controllers/BGController";
import { EffectController } from "./controllers/EffectController";
import { FGController } from "./controllers/FgController";
import { MovieController } from "./controllers/MovieController";
import { SelectController } from "./controllers/SelectController";
import { SoundController } from "./controllers/SoundController";
import { SpineController } from "./controllers/SpineController";
import { StillController } from "./controllers/StillController";
import { TextController } from "./controllers/TextController";
import { TrackManager } from "./managers/TrackManager";
import { TranslateManager } from "./managers/TranslateManager";

const interestedEvents: (keyof ContainerEvents)[] = ["click", "touchstart"];
// const Menu: Record<string, Sprite> = {};
// const AutoBtn_texture: Record<string, Texture> = {};
// const SwitchLangBtn_texture: Record<string, Texture> = {};

const ViewerOptions : ViewerProps = {
    skipBanner : false,
    disableInfoLog : false,
    disableBlur : false,
    resourceUrl : "https://viewer.shinycolors.moe",
    assets : {
        font : {
            filepath : './assets/TsunagiGothic.ttf',
            family : 'TsunagiGothic'
        },
        touchToStart : './assets/touchToStart.png',
        autoBtn : {
            On : './assets/autoOn.png',
            Off : './assets/autoOff.png',
        },
        translationBtn : {
            On : './assets/zhOn.png',
            Off : './assets/jpOn.png',
        }
    }
}

export class EventViewer extends Container {
    protected _options: ViewerProps = ViewerOptions;
    protected _oninit: boolean = false;
    //Controller
    public bGController: BGController = new BGController(this, 1);
    public spineController: SpineController = new SpineController(this, 2);
    public fGController: FGController = new FGController(this, 3);
    public stillController: StillController = new StillController(this, 4);
    public textController: TextController = new TextController(this, 5);
    public selectController: SelectController = new SelectController(this, 6);
    public effectController: EffectController = new EffectController(this, 7);
    public movieController: MovieController = new MovieController(this, 8);
    public soundController: SoundController = new SoundController(this);
    //Manager
    public translateManager: TranslateManager = new TranslateManager(this);
    public trackManager: TrackManager = new TrackManager(this);
    //Track
    // protected _track: TrackFrames[] = [];
    // protected _autoPlayEnabled: boolean = true;
    // protected _current: number = 0;
    // protected _nextLabel: string | undefined | null;
    // protected _stopTrackIndex: number = -1;
    // protected _timeoutToClear?: string | number | NodeJS.Timeout | undefined;
    // protected _textTypingEffect?: string | number | NodeJS.Timeout | undefined;
    // protected _stopped: boolean = false;
    // protected _selecting: boolean = false;

    constructor(options?: Partial<ViewerProps>) {
        super();

        if (!this._options.skipBanner) {
            Banner();
        }

        this.addChild(createEmptySprite({color : 0x000000}))
        this.sortableChildren = true;
        this.eventMode = 'static';
        globalThis.addEventListener("blur", this._onBlur.bind(this));

        if (options) {
            this._options = updateConfig(this._options, options);
            console.log(this._options)
        }

    }

    public static create(options?: Partial<ViewerProps>) {
        return new this(options);
    }
    
    public addTo<T extends Container>(parent: T) {
        parent.addChild(this);
        return this;
    }

    public async clear() {
        
    }

    public async init() {
        this._oninit = true;
    }

    public async load(source: string | TrackFrames[]) {}

    public loadAndPlay(source: string | TrackFrames[]) {}

    public start() {}

    protected _onready() {}

    protected _play() {}

    protected _toggleAutoplay() {}

    protected _toggleLangBtn() {}

    protected _renderTrack() {}

    protected _forward() {}

    protected _jumpTo(nextLabel: string) {}

    protected _endOfEvent() {}

    protected _afterSelection() {}

    protected _tapEffect(event: FederatedPointerEvent) {}

    protected _onBlur() {}

    public addTranslateReader(...readers : TranslateReader[]){
        readers.forEach((reader : TranslateReader) => {
            this.translateManager.addReader(reader);
        })
    }

    get Options() {
        return this._options;
    }

    // get Track() {
    //     return this._track;
    // }

    // get currentTrack() {
    //     return this._track[this._current];
    // }

    // get nextTrack() {
    //     return this._track[this._current + 1];
    // }
}