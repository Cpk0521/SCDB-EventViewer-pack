import {
    Container,
    FederatedPointerEvent,
    Assets,
    Texture,
    Sprite,
} from "pixi.js";
import "@pixi/sound";
// import '@pixi-spine/loader-uni'
import { loadJson, loadCSVText } from "./utils/loadJson";
// import { CSVToJSON, searchFromMasterList } from "./utils/translation";
import { isUrl } from "./utils/isUrl";
import { Banner, TrackLog } from "./utils/log";
import { updateConfig, flatten } from "./utils/updateSetting";
import { createEmptySprite } from "./utils/emptySprite";
import { ViewerProps, spineAlias } from "@/types/setting";
import type { TrackFrames } from "@/types/track";
import type { TranslateReader, TranslateRecord } from "@/types/translate";

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

// const Menu: Record<string, Sprite> = {};
// const AutoBtn_texture: Record<string, Texture> = {};
// const SwitchLangBtn_texture: Record<string, Texture> = {};

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
    protected _loadPromise: Promise<any> | undefined;
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
    protected _track: TrackFrames[] = [];
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

        this.addChild(createEmptySprite({ color: 0x000000 }));
        this.sortableChildren = true;
        this.eventMode = "static";
        globalThis.addEventListener("blur", this._onBlur.bind(this));

        // this.on('pointertap', (e : FederatedPointerEvent) => {
        //     console.log(e);
        // });

        if (options) {
            this._options = updateConfig(this._options, options);
            console.log(this._options);
        }
    }

    public static create(options?: Partial<ViewerProps>) {
        return new this(options);
    }

    public addTo<T extends Container>(parent: T) {
        parent.addChild(this);
        return this;
    }

    public async clear() {}

    public async load(
        source: string | TrackFrames[],
        translate?:
            | {
                  language: string;
                  record: TranslateRecord;
              }
            | string
    ) {
        await this._load(source, translate);
        this._loadPromise?.then(this._onready.bind(this));
    }

    protected async _load(
        source: string | TrackFrames[],
        translate?:
            | {
                  language: string;
                  record: TranslateRecord;
              }
            | string
    ) {
        return (this._loadPromise = new Promise<void>(
            async (resolve, reject) => {
                try {
                    //load Font
                    if (!Assets.cache.has(this.Options.assets.font.filepath)) {
                        await Assets.load({
                            alias:
                                this.Options.assets.font.family ??
                                "default_font",
                            src: this.Options.assets.font.filepath,
                        });
                    }

                    //
                    let label: string | undefined = void 0;
                    if (typeof source === "string") {
                        if (!isUrl(source)) {
                            label = source;
                            source = `${this.Options.resourceUrl}/json/${source}`;
                        }
                        source = await loadJson<TrackFrames[]>(source).catch(
                            (e) => {
                                throw new Error(
                                    "The Track ID is wrong, please reconfirm."
                                );
                            }
                        );
                    }

                    //
                    if (translate) {
                        if (typeof translate === "string") {
                            if (label) {
                                await this.translateManager.load(label);
                            }
                        } else {
                            this.translateManager.addRecord(translate);
                        }
                    }

                    //clear all assets if loaded before
                    if (this._track.length) {
                        await this.clear();
                    }

                    //load all assets resources
                    this._track = source as TrackFrames[];
                    const resources: Record<string, string> = {};

                    this._track.forEach((frame: TrackFrames) => {
                        const {
                            speaker,
                            text,
                            select,
                            textFrame,
                            bg,
                            fg,
                            se,
                            voice,
                            bgm,
                            movie,
                            charId,
                            charType,
                            charLabel,
                            charCategory,
                            stillType,
                            stillId,
                            still,
                        } = frame;

                        // if (speaker && text && !this._mixed && this._translationData) {
                        //     Frame['translated_text'] = this._translationData.table.find(data => data.name == speaker && data.text == text)!['tran'];
                        // }
                        if (
                            textFrame &&
                            textFrame != "off" &&
                            !resources[`textFrame_${textFrame}`]
                        ) {
                            resources[
                                `textFrame_${textFrame}`
                            ] = `${this.Options.resourceUrl}/images/event/text_frame/${textFrame}.png`;
                        }
                        if (bg && !resources[`bg_${bg}`] && bg != "fade_out") {
                            resources[
                                `bg_${bg}`
                            ] = `${this.Options.resourceUrl}/images/event/bg/${bg}.jpg`;
                        }
                        if (
                            fg &&
                            !resources[`fg_${fg}`] &&
                            fg != "off" &&
                            fg != "fade_out"
                        ) {
                            resources[
                                `fg_${fg}`
                            ] = `${this.Options.resourceUrl}/images/event/fg/${fg}.png`;
                        }
                        if (se && !resources[`se_${se}`]) {
                            resources[
                                `se_${se}`
                            ] = `${this.Options.resourceUrl}/sounds/se/event/${se}.m4a`;
                        }
                        if (voice && !resources[`voice_${voice}`]) {
                            resources[
                                `voice_${voice}`
                            ] = `${this.Options.resourceUrl}/sounds/voice/events/${voice}.m4a`;
                        }
                        if (
                            bgm &&
                            !resources[`bgm_${bgm}`] &&
                            bgm != "fade_out" &&
                            bgm != "off"
                        ) {
                            resources[
                                `bgm_${bgm}`
                            ] = `${this.Options.resourceUrl}/sounds/bgm/${bgm}.m4a`;
                        }
                        if (movie && !resources[`movie_${movie}`]) {
                            resources[
                                `movie_${movie}`
                            ] = `${this.Options.resourceUrl}/movies/idols/card/${movie}.mp4`;
                        }
                        if (charLabel && charId) {
                            const thisCharCategory = charCategory
                                ? spineAlias[charCategory!]
                                : "stand";
                            if (
                                !resources[
                                    `${charLabel}_${charId}_${thisCharCategory}`
                                ]
                            ) {
                                resources[
                                    `${charLabel}_${charId}_${thisCharCategory}`
                                ] = `${this.Options.resourceUrl}/spine/${charType}/${thisCharCategory}/${charId}/data.json`;
                            }
                        }
                        if (
                            select &&
                            !resources[
                                `selectFrame_${this.selectController.neededFrame}`
                            ]
                        ) {
                            resources[
                                `selectFrame_${this.selectController.neededFrame}`
                            ] = `${this.Options.resourceUrl}/images/event/select_frame/00${this.selectController.neededFrame}.png`;
                            this.selectController.frameForward();
                            // if (!this._mixed && this._translationData) {
                            //     Frame['translated_text'] = this._translationData.table.find(data => data.id == 'select' && data.text == select)!['tran'];
                            // }
                        }
                        if (
                            still &&
                            !resources[`still_${still}`] &&
                            still != "off"
                        ) {
                            resources[
                                `still_${still}`
                            ] = `${this.Options.resourceUrl}/images/event/still/${still}.jpg`;
                        }
                        if (
                            stillType &&
                            stillId &&
                            !resources[`still_${stillType}${stillId}`]
                        ) {
                            resources[
                                `still_${stillType}${stillId}`
                            ] = `${this.Options.resourceUrl}/images/content/${stillType}/card/${stillId}.jpg`;
                        }
                        if (frame.label == "end") {
                            Assets.addBundle("TrackBundle", resources);
                        }
                    });

                    resolve(await Assets.loadBundle("TrackBundle"));
                } catch (e) {
                    reject("load failed");
                }
            }
        ));
    }

    protected _onready() {
        if (!this._loadPromise) {
            console.warn("dont repeat play");
            return;
        }
        this._loadPromise = void 0;
        // this._play(); //cover?

        // const touchToStart = Sprite.from('./assets/touchToStart.png');
        // touchToStart.anchor.set(0.5);
        // touchToStart.position.set(568, 500);
        // touchToStart.zIndex = 10;
        // this.addChild(touchToStart);

        // const _play = () => {
        //     this.removeChild(touchToStart);
        //     touchToStart.destroy();
        //     console.log()
        // };
        // this.once("pointertap", _play, this);
    }

    protected _toggleAutoplay() {}

    protected _toggleLangBtn() {}

    protected _renderTrack() {}

    protected _forward() {}

    protected _jumpTo(nextLabel: string) {}

    protected _endOfEvent() {}

    protected _afterSelection() {}

    protected _tapEffect(event: FederatedPointerEvent) {}

    protected _onBlur() {}

    public addTranslateReader(...readers: TranslateReader[]) {
        readers.forEach((reader: TranslateReader) => {
            this.translateManager.addReader(reader);
        });
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
