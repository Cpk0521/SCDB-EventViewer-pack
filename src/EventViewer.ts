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
import { Banner, TrackLog } from "@/utils/log";
import { updateConfig, flatten } from "@/utils/updateSetting";
import { createEmptySprite } from "@/utils/emptySprite";
import { StoryProps, ViewerProps } from "@/types/options";
import { TrackFrames, TrackFramesRecord } from "@/types/track";
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
import { LoadingComponent } from '@/ui/loadingUI'
import { ToggleButton } from "@/ui/ToggleButton";
import { EventStorage } from "@/helper/EventStorage";

const Default_viewerOptions: ViewerProps = {
    skipBanner: false,
    disableInfoLog: false,
    disableBlur: false,
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
    //UI
    protected _UIComponent : Record<string, any> = {};
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
        this.on('pointertap', this._tap, this);
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
        const require_assets : Record<string, string> = {
            touchToStart: this._options.assets.touchToStart,
            autoBtn_On: this._options.assets.autoBtn.On,
            autoBtn_Off: this._options.assets.autoBtn.Off,
            translationBtn_On: this._options.assets.translationBtn.On,
            translationBtn_Off: this._options.assets.translationBtn.Off,
        }
        require_assets[this._options.assets.font.family ?? "default_font"] = this._options.assets.font.filepath;

        await EventStorage.addAssets(require_assets);
        
        this._UIComponent['Loading'] = LoadingComponent.create().addTo(this);

        this._UIComponent['autoBtn'] = ToggleButton
            .create({
                ON : Assets.get(this._options.assets.autoBtn.On),
                OFF :Assets.get(this._options.assets.autoBtn.Off),
            })
            .setPosition(1075, 50)
            .addTo(this);
        this._UIComponent['autoBtn'].on('Btnclicked', this._toggleAutoplay)

        this._UIComponent['translationBtn'] = ToggleButton
            .create({
                ON : Assets.get(this._options.assets.translationBtn.On),
                OFF :Assets.get(this._options.assets.translationBtn.Off),
            })
            .setPosition(1075, 130)
            .addTo(this);
            this._UIComponent['translationBtn'].on('Btnclicked', this._toggleLangBtn)

    }

    public async play(props : StoryProps) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                //load Font & setting assets
                await this._inited;

                //load track
                const cache = this.trackController.init(props);
                await EventStorage.addAssets(flatten(cache), (N, P) => this._UIComponent["Loading"].progress(N, P));
                

                resolve();
            } catch (e) {
                console.error(e);
                reject("load failed");
            }
        }).then(() => {
            this._onready();
        })
    }

    protected _onready() {
        const touchToStart = Sprite.from("touchToStart");
        touchToStart.anchor.set(0.5);
        touchToStart.position.set(568, 500);
        touchToStart.zIndex = 10;
        this.addChild(touchToStart);
        this.cursor = "pointer";

        this.once("pointertap", ()=>{
            this.removeChild(touchToStart);
            touchToStart.destroy();
            this.cursor = "default";
            // this._renderTrack();
            this.trackController.renderTrack();
        }, this);
    }

    public seek(index : number){

    }

    protected _toggleAutoplay(bool : boolean) {
        console.log('autoBtn', bool);
    }

    protected _toggleLangBtn(bool : boolean) {
        console.log('LangBtn', bool);
    }

    protected _tap(e: FederatedPointerEvent) {
        if (e.target !== this) {
            return;
        }
        console.log('click')
    }

    protected _onBlur() {
        if(document.hidden){
            console.log('Blur')
        }
    }

    get Options() {
        return this._options;
    }
}
