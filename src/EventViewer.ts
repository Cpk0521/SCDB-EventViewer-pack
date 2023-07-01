import { Container, DisplayObjectEvents } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Assets } from '@pixi/assets';
import { Texture, extensions } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import '@pixi/sound';
import '@pixi-spine/loader-uni'
import { ConfigSetting } from './ConfigSetting';
import { Helper } from './Helper';
import { Hello, TrackLog } from './utils/log';
import { updateConfig } from './utils/updateSetting';
import { Mp4Assets } from './utils/mp4assets';
import { createEmptySprite } from './utils/emptySprite';
import { ControllerSystem } from './ControllerSystem';
import { BGController } from './controllers/BGController'
import { EffectController } from './controllers/EffectController'
import { FGController } from './controllers/FgController';
import { MovieController } from './controllers/MovieController';
import { SelectController } from './controllers/SelectController';
import { SoundController } from './controllers/SoundController';
import { SpineController, spineAlias } from './controllers/SpineController';
import { StillController } from './controllers/StillController';
import { TextController } from './controllers/TextController';

interface IEventViewerOptions extends ISetting {}
type TrackFrames = FrameData & translateText;

const interestedEvents : (keyof DisplayObjectEvents)[] = ['click', 'touchstart'];
const Menu : Record<string, Sprite> = {}
const AutoBtn_texture : Record<string, Texture> = {}
const SwitchLangBtn_texture : Record<string, Texture> = {}

export class EventViewer extends Container{

    protected setting : IEventViewerOptions = ConfigSetting;
    //Controller
    protected system : ControllerSystem;
    //Track
    protected _track : TrackFrames[] = [];
    protected _autoPlayEnabled : boolean = true;
    protected _current : number = 0;
    protected _nextLabel : string | undefined | null;
    protected _stopTrackIndex : number = -1;
    protected _timeoutToClear : number | NodeJS.Timer | null | undefined = null;
    protected _textTypingEffect : number | NodeJS.Timer | null | undefined = null;
    protected _stopped : boolean = false;
    protected _selecting : boolean = false;
    // translation
    protected _translate : boolean = false;
    protected _language : string = 'jp';
    protected _translationData : TranslateData | undefined | null;
    protected _mixed : boolean = false

    constructor(setting? : Partial<IEventViewerOptions>){
        super();
        
        this.addChild(createEmptySprite({color : 0x000000}))
        this.sortableChildren = true

        this.system = new ControllerSystem(this);

        if(setting) {this.setting = updateConfig(this.setting, setting);}
        
        extensions.add(Mp4Assets); //增加mp4擴充 for PIXI.Assets

        if(this.setting.hello) {Hello();}
    }

    public static new(setting? : Partial<IEventViewerOptions>){
        return new this(setting);
    }

    public addTo<T extends Container>(parent : T){
        parent.addChild(this);
        return this;
    }

    public async destroy() {
        this._track = [];
        this._current = 0;
        this._nextLabel = null;
        this._stopTrackIndex = -1;
        await Assets.unloadBundle(['TrackBundle', 'fonts', 'require_assets']);
    }

    public async init(){

        this.system.add('bg', BGController, 1);
        this.system.add('spine', SpineController, 2);
        this.system.add('fg', FGController, 3);
        this.system.add('still', StillController, 4);
        this.system.add('text', TextController, 5);
        this.system.add('select', SelectController, 6);
        this.system.add('effect', EffectController, 7);
        this.system.add('movie', MovieController, 8);
        this.system.add('sound', SoundController);

        //load require assets and fonts file
        let fontassets : Record<string, string> = {}
        for (const key in this.setting.fonts) {
            fontassets[key] = this.setting.fonts[key].filepath;
        }
        Assets.addBundle('fonts', fontassets);
        Assets.addBundle('require_assets', this.setting.assets);

        let { require_assets } = await Assets.loadBundle(['fonts', 'require_assets']);

        Menu['touchToStart'] = new Sprite(require_assets.touchToStart);
        Menu['autoBtn'] = new Sprite(this._autoPlayEnabled ? require_assets.autoOn : require_assets.autoOff);
        Menu['switchLangBtn'] = new Sprite(require_assets.jpON);

        AutoBtn_texture['On'] = require_assets.autoOn;
        AutoBtn_texture['Off'] = require_assets.autoOff;

        SwitchLangBtn_texture['jp'] = require_assets.jpON;
        SwitchLangBtn_texture['zh'] = require_assets.zhOn;
    }

    public async loadTrack(source : string|TrackFrames[]|Object) {
        if(typeof source === 'string') {
            source = await Helper.loadJson<TrackFrames[]>(source);
        }

        //init
        // if(this._track.length){
        //     await this.destroy()
        // }
        await this.init();
        
        //load all assets resources
        this._track = source as TrackFrames[];
        let resources : Record<string, string> = {}
        let assetUrl : string = this.config.assetUrl;
        
        this._track.forEach((Frame : TrackFrames)=>{
            const { speaker, text, select, textFrame,
                    bg, fg, se, voice, bgm, 
                    movie, charId, charType, charLabel, charCategory, 
                    stillType, stillId, still} = Frame
            
            if (speaker && text && !this._mixed && this._translationData) {
                Frame['translate_text'] = this._translationData.table.find(data => data.name == speaker && data.text == text)!['tran'];
            }
            if (textFrame && textFrame != "off" && !resources[`textFrame_${textFrame}`]) {
                resources[`textFrame_${textFrame}`] = `${assetUrl}/images/event/text_frame/${textFrame}.png`;
            }
            if (bg && !resources[`bg_${bg}`] && bg != "fade_out") {
                resources[`bg_${bg}`] = `${assetUrl}/images/event/bg/${bg}.jpg`;
            }
            if (fg && !resources[`fg_${fg}`] && fg != "off" && fg != "fade_out") {
                resources[`fg_${fg}`] = `${assetUrl}/images/event/fg/${fg}.png`;
            }
            if (se && !resources[`se_${se}`]) {
                resources[`se_${se}`] = `${assetUrl}/sounds/se/event/${se}.m4a`;
            }
            if (voice && !resources[`voice_${voice}`]) {
                resources[`voice_${voice}`] = `${assetUrl}/sounds/voice/events/${voice}.m4a`;
            }
            if (bgm && !resources[`bgm_${bgm}`] && bgm != "fade_out" && bgm != "off") {
                resources[`bgm_${bgm}`] = `${assetUrl}/sounds/bgm/${bgm}.m4a`;
            }
            if (movie && !resources[`movie_${movie}`]) {
                resources[`movie_${movie}`] = `${assetUrl}/movies/idols/card/${movie}.mp4`;
            }
            if (charLabel && charId) {
                const thisCharCategory = charCategory ? spineAlias[charCategory!] : "stand";
                if (!resources[`${charLabel}_${charId}_${thisCharCategory}`]) {
                    resources[`${charLabel}_${charId}_${thisCharCategory}`] = `${assetUrl}/spine/${charType}/${thisCharCategory}/${charId}/data.json`;
                }
            }
            if (select && !resources[`selectFrame_${this.system.get(SelectController)?.neededFrame}`]) {
                resources[`selectFrame_${this.system.get(SelectController)?.neededFrame}`] = `${assetUrl}/images/event/select_frame/00${this.system.get(SelectController)?.neededFrame}.png`;
                this.system.get(SelectController)?.frameForward();
                if (!this._mixed && this._translationData) {
                    Frame['translate_text'] = this._translationData.table.find(data => data.id == 'select' && data.text == select)!['tran'];
                }
            }
            if (still && !resources[`still_${still}`] && still != "off") {
                resources[`still_${still}`] = `${assetUrl}/images/event/still/${still}.jpg`;
            }
            if (stillType && stillId && !resources[`still_${stillType}${stillId}`]) {
                resources[`still_${stillType}${stillId}`] = `${assetUrl}/images/content/${stillType}/card/${stillId}.jpg`;
            }
            if (Frame.label == "end"){
                Assets.addBundle('TrackBundle', resources);
            }
        })

        if(!this._mixed && this._translate) { this._mixed = true;}

        return await Assets.loadBundle('TrackBundle');
    }

    public loadAndPlayTrack(source : string|TrackFrames[]|Object) {
        this.loadTrack(source).then(() => { this.start(); })
    }

    public async loadTranslateData(source? : string|TranslateData|object) {
        if(typeof source === 'string') {
            let csvtext = await Helper.loadCSV<string>(source);
            source = Helper.CSVToJSON(csvtext);
        }
        this._translationData = source as TranslateData;
        this._translate = true;

        //load Translate to track
        if(!this._mixed && this._track){
            this._mixed = true
            this._track.forEach((Frame : TrackFrames)=>{
                const { speaker, text, select} = Frame
                if (speaker && text) {
                    Frame['translate_text'] = this._translationData!.table.find(data => data.name == speaker && data.text == text)!['tran'];
                }
                if (select) {
                    Frame['translate_text'] = this._translationData!.table.find(data => data.id == 'select' && data.text == select)!['tran'];
                }
            })
        }
    }

    public start(){
        this._onready()
    }

    protected _onready(){
        let touchToStart = Menu.touchToStart
        touchToStart.anchor.set(0.5);
        touchToStart.position.set(568, 500);
        touchToStart.zIndex = 10
        this.addChild(touchToStart)

        this.eventMode = 'static'
        interestedEvents.forEach((e) => {
            this.on(e, this._play, this);
        })
    }

    protected _play(){
        let { touchToStart, autoBtn, switchLangBtn } = Menu;
        
        this._autoPlayEnabled ? this.eventMode = 'auto' : this.eventMode = 'static';
        this.removeChild(touchToStart)
        interestedEvents.forEach((e) => {
            this.off(e, this._play, this);
        })

        autoBtn.anchor.set(0.5);
        autoBtn.position.set(1075, 50);
        autoBtn.eventMode = 'static'
        autoBtn.zIndex = 10
        this.addChild(autoBtn);

        if(this._translate){
            switchLangBtn.anchor.set(0.5);
            switchLangBtn.position.set(1075, 130);
            switchLangBtn.eventMode = 'static'
            switchLangBtn.zIndex = 10
            this.addChild(switchLangBtn);

            interestedEvents.forEach((e) => {
                switchLangBtn.on(e, this._toggleLangBtn, this);
            })
        }

        interestedEvents.forEach((e) => {
            autoBtn.on(e, this._toggleAutoplay, this);
        })

        interestedEvents.forEach((e) => {
            this.on(e, this._tapEffect, this);
        })

        if(this._autoPlayEnabled) this._renderTrack();
    }

    protected _toggleAutoplay(){
        let { autoBtn } = Menu;
        let { On, Off } = AutoBtn_texture;

        this._autoPlayEnabled = !this._autoPlayEnabled;

        if(this._autoPlayEnabled){
            if(!this._timeoutToClear){
                this._renderTrack();
            }
            autoBtn.texture = On;
            this.eventMode = 'auto';
        }
        else {
            if(this._timeoutToClear){
                clearTimeout(this._timeoutToClear); 
                this._timeoutToClear = null;
            }

            autoBtn.texture = Off;
            this.eventMode = 'static';
        }
    }

    protected _toggleLangBtn(){
        let { switchLangBtn  } = Menu;
        let texture = Object.entries(SwitchLangBtn_texture);
        let index = texture.findIndex(o => o[0] == this._language);
        
        index = (index + 1) % texture.length;
        this._language = texture[index][0];
        switchLangBtn.texture = texture[index][1];

        this.system.get(SelectController)?.toggleLanguage(this._language);
        this.system.get(TextController)?.toggleLanguage(this._language);
    }
    
    protected _renderTrack(){
        if(!this._track) { return; }
        if (this._stopped || this._selecting) { return; }
        if(this.config.infoLog){
            TrackLog(this._current, this._track.length - 1, this.currentTrack);
        }

        if (this.currentTrack.label == "end") {
            this._endOfEvent();
            return;
        }

        const { text, textCtrl, voice, select, nextLabel, movie, effectValue, waitType, waitTime } = this.currentTrack;

        const params = {...this.currentTrack, 
            selectonClick : this._jumpTo.bind(this),
            onMovieEnded : this._renderTrack.bind(this),
            afterSelection : this._afterSelection.bind(this),
            onVoiceEnd : this.system.get(SpineController).stopLipAnimation.bind(this.system.get(SpineController))
        }
        this.system.process(params);

        if (nextLabel == "end") { // will be handled at forward();
            this._nextLabel = "end";
        }

        this.forward();
        if (this._current - 1 == this._stopTrackIndex) { // do nothing and wait
            return;
        }
        else if (select && !textCtrl) { // turn app.stage interactive off, in case selection is appeared on stage
            // this._app.stage.interactive = false;
            this.eventMode = 'auto'
            this._renderTrack();
        }
        else if (select && textCtrl) { // do nothing, waiting for selection
            // this._app.stage.interactive = false;
            this.eventMode = 'auto'
            this._selecting = true;
        }
        else if (text && this._autoPlayEnabled && !waitType) {
            this._textTypingEffect = this.system.get(TextController).typingEffect;
            if (voice) { // here to add autoplay for both text and voice condition
                const voiceTimeout = this.system.get(SoundController).voiceDuration;
                this._timeoutToClear = setTimeout(() => {
                    if (!this._autoPlayEnabled) { return; }
                    this._renderTrack();
                    this._timeoutToClear = null;
                }, voiceTimeout);
            }
            else { // here to add autoplay for only text condition
                // const textTimeout = this._textController.textWaitTime;
                const textTimeout = this.system.get(TextController).textWaitTime;
                this._timeoutToClear = setTimeout(() => {
                    if (!this._autoPlayEnabled) { return; }
                    this._renderTrack();
                    this._timeoutToClear = null;
                }, textTimeout);
            }
        }
        else if (text && !this._autoPlayEnabled && !waitType) {
            return;
        }
        else if (movie) {
            // if (this._fastForwardMode) {
            //     this._renderTrack();
            //     return;
            // }
            // else { return; }
        }
        else if (waitType == "time") { // should be modified, add touch event to progress, not always timeout
            // if (this._fastForwardMode) {
            //     this._renderTrack();
            // }
            // else {
                this._timeoutToClear = setTimeout(() => {
                    this._renderTrack();
                    this._timeoutToClear = null;
                }, waitTime);
            // }
        }
        else if (waitType == "effect") {
            // if (this._fastForwardMode) {
            //     this._renderTrack();
            // }
            // else {
                this._timeoutToClear = setTimeout(() => {
                    this._renderTrack();
                    this._timeoutToClear = null;
                }, effectValue!.time);
            // }
        }
        else {
            this._renderTrack();
        }
    }

    protected forward() {
        if (this._nextLabel) {
            this._jumpTo(this._nextLabel);
        } else {
            this._current++;
        }
        return this.currentTrack;
    }

    protected _jumpTo(nextLabel : string) {
        const length = this._track.length;
        for (let i = 0; i < length; i++) {
            if (this._track[i].label !== nextLabel) { continue; }
            this._current = i;
            this._nextLabel = null;
            return;
        }
        throw new Error(`label ${nextLabel} is not found.`);
    }

    protected _endOfEvent() {
        this.system.reset();
        this._stopped = true;
    }

    protected _afterSelection() {
        this.eventMode = 'auto';
        this._selecting = false;
        this._renderTrack();
    }

    protected _tapEffect(e : FederatedPointerEvent) {
        // console.log(e.global.x, e.global.y);
        if(e.target !== this) {return;}
        if(this._autoPlayEnabled) {return;}
        if(this._timeoutToClear){
            clearTimeout(this._timeoutToClear);
        }
        if(this._textTypingEffect){
            clearInterval(this._textTypingEffect);
        }

        this._renderTrack();
    }

    get config(){
        return this.setting;
    }

    get Track(){
        return this._track;
    }

    get currentTrack() {
        return this._track[this._current];
    }

    get nextTrack() {
        return this._track[this._current + 1];
    }

}
