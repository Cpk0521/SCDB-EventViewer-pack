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
import { LoadingComponent } from './ui/loadingUI'
import { ToggleButton } from "./ui/ToggleButton";

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
        this._UIComponent['translationBtn'] = ToggleButton
            .create({
                ON : Assets.get(this._options.assets.translationBtn.On),
                OFF :Assets.get(this._options.assets.translationBtn.Off),
            })
            .setPosition(1075, 130)
            .addTo(this);

    }

    public async play(props : LoadProps) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                //load Font & setting assets
                await this._inited;

                // get urlResolver to get the assets url
                const resolver = EventStorage.UrlResolver.getResolver(props.urlResolver ?? 'default')
                if (!resolver) {
                    throw new Error("UrlResolver not found");
                }

                //load track
                let resources : Record<string, string> = {}
                props.Track.forEach((Frame : TrackFrames) => {
                    const { 
                        speaker, text, select, textFrame,
                        bg, fg, se, voice, bgm, 
                        movie, charId, charType, charLabel, charCategory, 
                        stillType, stillId, still} = Frame;
                        
                    // if (speaker && text && !this._mixed && this._translationData) {
                    //     Frame['translated_text'] = this._translationData.table.find(data => data.name == speaker && data.text == text)!['tran'];
                    // }
                    if (textFrame && textFrame != "off" && !resources[`textFrame_${textFrame}`]) {
                        resources[`textFrame_${textFrame}`] = resolver.textFrame(textFrame);
                    }
                    if (bg && !resources[`bg_${bg}`] && bg != "fade_out") {
                        resources[`bg_${bg}`] = resolver.bg(bg);
                    }
                    if (fg && !resources[`fg_${fg}`] && fg != "off" && fg != "fade_out") {
                        resources[`fg_${fg}`] = resolver.fg(fg);
                    }
                    if (se && !resources[`se_${se}`]) {
                        resources[`se_${se}`] = resolver.se(se);
                    }
                    if (voice && !resources[`voice_${voice}`]) {
                        resources[`voice_${voice}`] = resolver.voice(voice);
                    }
                    if (bgm && !resources[`bgm_${bgm}`] && bgm != "fade_out" && bgm != "off") {
                        resources[`bgm_${bgm}`] = resolver.bgm(bgm);
                    }
                    if (movie && !resources[`movie_${movie}`]) {
                        resources[`movie_${movie}`] = resolver.movie(movie);
                    }
                    if (charLabel && charId) {
                        const thisCharCategory = charCategory ? spineAlias[charCategory!] : "stand";
                        if (!resources[`${charLabel}_${charId}_${thisCharCategory}`]) {
                            resources[`${charLabel}_${charId}_${thisCharCategory}`] = resolver.spine(charType!, thisCharCategory, charId);
                        }
                    }
                    if (select && !resources[`selectFrame_${this.selectController.neededFrame}`]) {
                        resources[`selectFrame_${this.selectController.neededFrame}`] = resolver.neededFrame(`${this.selectController.neededFrame}`);
                        this.selectController.frameForward();
                        // if (!this._mixed && this._translationData) {
                        //     Frame['translated_text'] = this._translationData.table.find(data => data.id == 'select' && data.text == select)!['tran'];
                        // }
                    }
                    if (still && !resources[`still_${still}`] && still != "off") {
                        resources[`still_${still}`] = resolver.still(still);
                    }
                    if (stillType && stillId && !resources[`still_${stillType}${stillId}`]) {
                        resources[`still_${stillType}${stillId}`] = resolver.cardstill(stillType, stillId);
                    }
                });
                
                await EventStorage.addAssets(resources, (N, P) => this._UIComponent["Loading"].componentUpdate(N, P));

                resolve();
            } catch (e) {
                console.error(e);
                reject("load failed");
            }
        });
    }

    protected _onready() {
        const touchToStart = Sprite.from("touchToStart");
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
