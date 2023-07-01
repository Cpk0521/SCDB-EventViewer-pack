import { Container, DisplayObjectEvents } from '@pixi/display';
import { FederatedPointerEvent } from '@pixi/events';
import { Assets } from '@pixi/assets';
import { Texture, extensions } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import '@pixi/sound';
import '@pixi-spine/loader-uni'
import { loadJson, loadCSVText } from './utils/loadJson';
import { CSVToJSON, searchFromMasterList } from './utils/translation';
import { Hello, TrackLog } from './utils/log';
import { updateConfig, flatten } from './utils/updateSetting';
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

import { Options } from './ViewerOptions'

interface IEventViewerOptions extends IViewerOptions {}

type TrackFrames = FrameData & translateText;

const interestedEvents : (keyof DisplayObjectEvents)[] = ['click', 'touchstart'];
const Menu : Record<string, Sprite> = {}
const AutoBtn_texture : Record<string, Texture> = {}
const SwitchLangBtn_texture : Record<string, Texture> = {}

enum translateState {
    ON = 'translated',
    OFF = 'jp'
}

export class EventViewer extends Container{

    protected _options : IEventViewerOptions = Options;
    //Controller
    protected system : ControllerSystem;
    protected _oninit : boolean = false;
    protected _bgController! : BGController;
    protected _fgController! : FGController;
    protected _spineController! : SpineController;
    protected _textController! : TextController;
    protected _selectController! : SelectController;
    protected _soundController! : SoundController;
    protected _effectController! : EffectController;
    protected _movieController! : MovieController;
    protected _stillController! : StillController;
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
    protected _language : translateState = translateState.OFF;
    protected _translationData : TranslateData | undefined | null;
    protected _mixed : boolean = false

    constructor(options? : Partial<IEventViewerOptions>){
        super();
        
        this.addChild(createEmptySprite({color : 0x000000}))
        this.sortableChildren = true

        this.system = new ControllerSystem(this);

        if(options) {this._options = updateConfig(this._options, options);}
        
        extensions.add(Mp4Assets); //增加mp4擴充 for PIXI.Assets

        if(this._options.hello) {Hello();}
    }

    public static new(options? : Partial<IEventViewerOptions>){
        return new this(options);
    }

    public addTo<T extends Container>(parent : T){
        parent.addChild(this);
        return this;
    }

    public async clearTrack() {
        this._track = [];
        this._current = 0;
        this._nextLabel = null;
        this._stopTrackIndex = -1;
        await Assets.unloadBundle('TrackBundle');
    }

    public async init(){

        this._bgController = this.system.add('bg', BGController, 1);
        this._spineController =  this.system.add('spine', SpineController, 2);
        this._fgController = this.system.add('fg', FGController, 3)
        this._stillController = this.system.add('still', StillController, 4)
        this._textController = this.system.add('text', TextController, 5)
        this._selectController = this.system.add('select', SelectController, 6)
        this._effectController = this.system.add('effect', EffectController, 7)
        this._movieController = this.system.add('movie', MovieController, 8)
        this._soundController = this.system.add('sound', SoundController)

        //load require assets and fonts file
        let fontassets : Record<string, string> = {}
        for (const key in this._options.fonts) {
            fontassets[key] = this._options.fonts[key].filepath;
        }
        
        Assets.addBundle('fonts', fontassets);
        Assets.addBundle('require_assets', flatten(this._options.assets));

        let { require_assets, fonts} = await Assets.loadBundle(['fonts', 'require_assets']);

        Menu['touchToStart'] = new Sprite(require_assets.touchToStart);
        Menu['autoBtn'] = new Sprite(this._autoPlayEnabled ? require_assets.autoBtn_On : require_assets.autoBtn_Off);
        Menu['switchLangBtn'] = new Sprite(require_assets.translationBtn_Off);

        AutoBtn_texture['On'] = require_assets.autoBtn_On;
        AutoBtn_texture['Off'] = require_assets.autoBtn_Off;

        SwitchLangBtn_texture['On'] = require_assets.translationBtn_On;
        SwitchLangBtn_texture['Off'] = require_assets.translationBtn_Off;

        this._oninit = true;
    }

    public async loadTrack(source : string|TrackFrames[]|Object) {
        if(typeof source === 'string') {
            source = await loadJson<TrackFrames[]>(source);
        }

        if(!this._oninit){
            await this.init();
        }

        if(this._track.length){
            await this.clearTrack()
        }

        //load all assets resources
        this._track = source as TrackFrames[];
        let resources : Record<string, string> = {}
        let assetUrl : string = this._options.resourceUrl;
        
        this._track.forEach((Frame : TrackFrames)=>{
            const { speaker, text, select, textFrame,
                    bg, fg, se, voice, bgm, 
                    movie, charId, charType, charLabel, charCategory, 
                    stillType, stillId, still} = Frame
            
            if (speaker && text && !this._mixed && this._translationData) {
                Frame['translated_text'] = this._translationData.table.find(data => data.name == speaker && data.text == text)!['tran'];
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
            if (select && !resources[`selectFrame_${this._selectController.neededFrame}`]) {
                resources[`selectFrame_${this._selectController.neededFrame}`] = `${assetUrl}/images/event/select_frame/00${this._selectController.neededFrame}.png`;
                this._selectController.frameForward();
                if (!this._mixed && this._translationData) {
                    Frame['translated_text'] = this._translationData.table.find(data => data.id == 'select' && data.text == select)!['tran'];
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

    public async searchAndLoadTranslation(tag : string){
        let url = await searchFromMasterList(tag, this._options.translate.master_list, this._options.translate.CSV_url);
        return await this.loadTranslation(url!);
    }

    public async loadTranslation(source : string|TranslateData|object) {
        if(typeof source === 'string') {
            let csvtext = await loadCSVText<string>(source);
            source = CSVToJSON(csvtext);
        }
        if(!source) { return; }
        this._translationData = source as TranslateData;
        this._translate = true;

        //load Translate to track
        if(!this._mixed && this._track.length){
            this._mixed = true
            this._track.forEach((Frame : TrackFrames)=>{
                const { speaker, text, select} = Frame
                if (speaker && text) {
                    Frame['translated_text'] = this._translationData!.table.find(data => data.name == speaker && data.text == text)!['tran'];
                }
                if (select) {
                    Frame['translated_text'] = this._translationData!.table.find(data => data.id == 'select' && data.text == select)!['tran'];
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
        let arr = ['Off', 'On'];
        let states = Object.values(translateState);
        let index = states.indexOf(this._language);
        this._language = states[(index + 1) % states.length] as translateState
        switchLangBtn.texture = SwitchLangBtn_texture[arr[index]]

        this._selectController.toggleLanguage(this._language as string);
        this._textController.toggleLanguage(this._language as string);
    }
    
    protected _renderTrack(){
        if(!this._track) { return; }
        if (this._stopped || this._selecting) { return; }
        if(this._options.infoLog){
            TrackLog(this._current, this._track.length - 1, this.currentTrack);
        }

        if (this.currentTrack.label == "end") {
            this._endOfEvent();
            return;
        }

        // const { text, textCtrl, voice, select, nextLabel, effectValue, waitType, waitTime } = this.currentTrack;

        // const params = {...this.currentTrack, 
        //     selectonClick : this._jumpTo.bind(this),
        //     onMovieEnded : this._renderTrack.bind(this),
        //     afterSelection : this._afterSelection.bind(this),
        //     onVoiceEnd : this.system.get(SpineController).stopLipAnimation.bind(this.system.get(SpineController))
        // }

        // this.system.process(params);

        const { speaker, text, textCtrl, textFrame,
            bg, bgEffect, bgEffectTime, fg, fgEffect, fgEffectTime, bgm, se, voice, select, nextLabel, stillId, stillCtrl, still, stillType, movie,
            charLabel, charId, charCategory, charPosition, charScale, charAnim1, charAnim2, charAnim3, charAnim4, charAnim5,
            charAnim1Loop, charAnim2Loop, charAnim3Loop, charAnim4Loop, charAnim5Loop, charLipAnim, lipAnimDuration, charEffect,
            effectLabel, effectTarget, effectValue, waitType, waitTime, translated_text} = this.currentTrack;

        this._bgController.process(bg!, bgEffect!, bgEffectTime!);
        this._fgController.process(fg!, fgEffect!, fgEffectTime!);
        this._movieController.process(movie!, this._renderTrack.bind(this));
        this._textController.process(textFrame!, speaker!, text!, translated_text!);
        this._selectController.process(select!, nextLabel!, this._jumpTo.bind(this), this._afterSelection.bind(this), translated_text!)
        this._stillController.process(still!, stillType!, stillId!, stillCtrl!)
        this._soundController.process(bgm!, se!, voice!, charLabel!, this._spineController.stopLipAnimation.bind(this._spineController));
        this._spineController.process(charLabel!, charId!, charCategory!, charPosition!, charScale!, charAnim1!, charAnim2!, charAnim3!, charAnim4!, charAnim5!,
            charAnim1Loop!, charAnim2Loop!, charAnim3Loop!, charAnim4Loop!, charAnim5Loop!, charLipAnim!, lipAnimDuration!, charEffect!);
        this._effectController.process(effectLabel!, effectTarget!, effectValue!)


        if (nextLabel == "end") { // will be handled at forward();
            this._nextLabel = "end";
        }

        this.forward();
        if (this._current - 1 == this._stopTrackIndex) { // do nothing and wait
            return;
        }
        else if (select && !textCtrl) { // turn app.stage interactive off, in case selection is appeared on stage
            this.eventMode = 'auto';
            this._renderTrack();
        }
        else if (select && textCtrl) { // do nothing, waiting for selection
            this.eventMode = 'auto';
            this._selecting = true;
        }
        else if (text && this._autoPlayEnabled && !waitType) {
            this._textTypingEffect = this._textController.typingEffect;
            if (voice) { 
                // here to add autoplay for both text and voice condition
                const voiceTimeout = this._soundController.voiceDuration;
                this._timeoutToClear = setTimeout(() => {
                    if (!this._autoPlayEnabled) { return; }
                    this._renderTrack();
                    this._timeoutToClear = null;
                }, voiceTimeout);
            }
            else { 
                // here to add autoplay for only text condition
                const textTimeout = this._textController.textWaitTime;
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
        else if (waitType == "time") {  // should be modified, add touch event to progress, not always timeout
            this._timeoutToClear = setTimeout(() => {
                this._renderTrack();
                this._timeoutToClear = null;
            }, waitTime)
        }
        else if (waitType == "effect") {

            this._timeoutToClear = setTimeout(() => {
                this._renderTrack();
                this._timeoutToClear = null;
            }, effectValue!.time)
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

    get Options(){
        return this._options;
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
