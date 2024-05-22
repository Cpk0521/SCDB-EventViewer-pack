import {
    Container,
    FederatedPointerEvent,
    Assets,
    Texture,
    Sprite,
} from "pixi.js";
import "@pixi/sound";
// import '@pixi-spine/loader-uni'
import { spineAlias } from "@/utils/spineAlias";
import { Banner, TrackLog } from "./utils/log";
import { updateConfig, flatten } from "./utils/updateSetting";
import { createEmptySprite } from "./utils/emptySprite";
import { LoadProps, ViewerProps } from "@/types/options";
import { TrackFrames, TrackFramesRecord } from "@/types/track";
import { TranslateReader, TranslateRecord } from "@/types/translate";
import {
    BGController,
    EffectController,
    FGController,
    MovieController,
    SelectController,
    SpineController,
    StillController,
    TextController,
    SoundController,
    TrackController,
} from "@/controllers";
import { EventStorage } from "./loader/EventStorage";

const Default_viewerOptions: ViewerProps = {
    skipBanner: false,
    disableInfoLog: false,
    disableBlur: false,
    resourceUrl: "https://viewer.shinycolors.moe",
    assets: {
        font: {
            filepath: "./assets/TsunagiGothic.ttf",
            family: "TsunagiGothic",
        },
        touchToStart: "./assets/touchToStart.png",
        autoBtn: {
            On: "./assets/autoOn.png",
            Off: "./assets/autoOff.png",
        },
        translationBtn: {
            On: "./assets/zhOn.png",
            Off: "./assets/jpOn.png",
        },
    },
};

export class EventViewer extends Container {
    protected _options: ViewerProps = Default_viewerOptions;
    protected _inited?: Promise<any>;
    //Controller
    public bGController = new BGController(this, 1);
    public spineController = new SpineController(this, 2);
    public fGController = new FGController(this, 3);
    public stillController = new StillController(this, 4);
    public textController = new TextController(this, 5);
    public selectController = new SelectController(this, 6);
    public effectController = new EffectController(this, 7);
    public movieController = new MovieController(this, 8);
    public soundController = new SoundController(this);
    //Track
    public trackController = new TrackController(this);

    constructor(options?: Partial<ViewerProps>) {
        super();

        if (options) {
            this._options = updateConfig(this._options, options);
        }

        if (options?.stage) {
            this.addTo(options.stage);
        }

        if (!this._options.skipBanner) {
            Banner();
        }

        this.addChild(createEmptySprite({ color: 0x000000 }));
        this.sortableChildren = true;
        this.eventMode = "static";
        globalThis.addEventListener("blur", this._onBlur.bind(this));
        this._inited = this._init();
    }

    public static create(options?: Partial<ViewerProps>) {
        return new this(options);
    }

    public addTo<T extends Container>(parent: T) {
        parent.addChild(this);
        return this;
    }

    public async clear() {}

    protected async _init() {   
        const require_assets : {[key : string] : string} = {
            touchToStart: this._options.assets.touchToStart,
            autoBtn_On: this._options.assets.autoBtn.On,
            autoBtn_Off: this._options.assets.autoBtn.Off,
            translationBtn_On: this._options.assets.translationBtn.On,
            translationBtn_Off: this._options.assets.translationBtn.Off,
            Reeor : './assets/Reeor.png',
        }
        require_assets[this.Options.assets.font.family ?? "default_font"] = this.Options.assets.font.filepath;

        await EventStorage.loadAssets(require_assets);        
    }

    public async load(props : LoadProps) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                //load Font & setting assets
                await this._inited;
                //load track
                

                
            } catch (e) {
                reject("load failed");
            }
        });
    }

    protected _onready() {
        const touchToStart = Sprite.from("./assets/touchToStart.png");
        touchToStart.anchor.set(0.5);
        touchToStart.position.set(568, 500);
        touchToStart.zIndex = 10;
        this.addChild(touchToStart);
        this.cursor = "pointer";

        const _play = () => {
            this.removeChild(touchToStart);
            touchToStart.destroy();
            this.cursor = "default";
            this._renderTrack();
        };
        this.once("pointertap", _play, this);
    }

    public seek(index : number){}

    protected _renderTrack() {}

    protected _toggleAutoplay() {}

    protected _toggleLangBtn() {}

    protected _forward() {}

    protected _jumpTo(nextLabel: string) {}

    protected _endOfEvent() {}

    protected _afterSelection() {}

    protected _tapEffect(event: FederatedPointerEvent) {}

    protected _onBlur() {}

    get Options() {
        return this._options;
    }
}
