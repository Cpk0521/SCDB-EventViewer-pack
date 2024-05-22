import { Container, Sprite, Assets, Text } from "pixi.js";
// import { IViewerOptions } from '@/types/setting'
import type { TrackFrames } from "@/types/track";
// import type { TextRecord } from "@/types/translate";
import type { EventViewer } from "../../EventViewer";

export class TextController extends Container {

    protected viewer: EventViewer;
    // public options : IViewerOptions | undefined = undefined;
    protected readonly _txtFrameMap = new Map();
    protected _thisWaitTime : number = 0;
    protected _typingEffect? : string | number | NodeJS.Timeout | undefined;
    protected _textObj! : Text;
    // protected _language : string = 'jp';
    // protected _currentText : TextRecord = { jp: '', translated: '' };

    constructor(viewer: EventViewer, order?: number) {
        super();
        this.viewer = viewer;
        this.addTo(viewer, order);
    }

    public addTo<C extends Container>(parent: C, order?: number): this {
        parent.addChild(this);
        this.zIndex = order ?? 0;
        return this;
    }

    public reset() {
        this.removeChildren(0, this.children.length);
        this._txtFrameMap.clear();
        this._endNotification();
    }

    // public process(textFrame: string, speaker: string, text: string, translated_text? : string){
    public process({textFrame, speaker, text, translated_text} : TrackFrames){
        this._thisWaitTime = 0;

        if (!textFrame || (textFrame == "off" && !this.children.length)) { return; }

        // if (this.children.length) {
        //     this.removeChildren(0, this.children.length);
        //     if (textFrame == "off") { return; }
        // }

        // // this._thisWaitTime = isFastForward ? 50 : text ? text.length * 300 + 500 : 50;
        // this._thisWaitTime = text ? text.length * 300 + 500 : 50;

        // if (!this._txtFrameMap.has(textFrame)) {
        //     this._txtFrameMap.set(textFrame, new Sprite(Assets.get(`textFrame_${textFrame}`)));
        // }

        // let thisTextFrame = this._txtFrameMap.get(textFrame);
        // thisTextFrame.position.set(100, 450);
        // this.addChildAt(thisTextFrame, 0);

        // let noSpeaker = true;
        // if (speaker !== "off") {
        //     noSpeaker = false;
        //     let speakerObj = new Text(speaker, {
        //         fontFamily: this.options?.fonts['jp'].family,
        //         fontSize: 24,
        //         fill: 0x000000,
        //         align: 'center',
        //         padding: 3
        //     });
        //     this.addChildAt(speakerObj, 1);
        //     speakerObj.position.set(260, 468);
        // }

        // if(text){
        //     if (translated_text) {
        //         this._currentText.jp = text;
        //         this._currentText.translated = translated_text;
        //         text = this._currentText[this._language]
        //     }
    
        //     this._textObj = new Text('', {
        //         align: "left",
        //         fontFamily: this.options?.fonts[this._language].family!,
        //         fontSize: 24,
        //         padding: 3
        //     });
        //     this.addChildAt(this._textObj, noSpeaker ? 1 : 2);
        //     this._textObj.position.set(240, 510);
    
        //     let word_index = 0;
        //     if (this._typingEffect != null) {
        //         clearInterval(this._typingEffect);
        //     }
    
        //     // if (isFastForward) {
        //     //     this._textObj.text = text;
        //     // }
        //     // else {
        //     this._typingEffect = setInterval(() => {
        //         if (word_index === text?.length) {
        //             clearInterval(this._typingEffect!);
        //             // managerSound.stop()
        //             this._typingEffect = undefined;
        //         }
        //         // if(!noSpeaker && speaker == 'プロデューサー'){
        //         //     managerSound.play()
        //         // }
        //         this._textObj.text += text?.charAt(word_index);
        //         word_index += 1;
        //     }, 65);
        //     // }
        // }

    }

    public toggleLanguage(lang : string) {
        // this._language = lang

        // if (this._typingEffect) {
        //     clearInterval(this._typingEffect);
        //     this._typingEffect = undefined;
        // }

        // if (this._textObj) {            
        //     this._textObj.text = this._currentText[this._language];
        //     this._textObj.style.fontFamily = this.options!.fonts[this._language].family || '';
        // }
    }

    _endNotification() {
        // let owariObj = new Text("End", {
        //     fontFamily: this.options?.fonts.zh.family,
        //     fontSize: 40,
        //     fill: 0xffffff,
        //     align: 'center'
        // });
        // this.addChildAt(owariObj, 0);
        // owariObj.anchor.set(0.5);
        // owariObj.position.set(568, 320);
    }

    // set languageType(type) {
    //     this._languageType = type;
    // }

    get textWaitTime() {
        return this._thisWaitTime;
    }

    get typingEffect() {
        return this._typingEffect;
    }

}