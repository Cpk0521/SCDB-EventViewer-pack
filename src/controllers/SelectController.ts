import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Assets } from '@pixi/assets'
import { Text } from '@pixi/text'
import { IController } from '../types/controller'
import { gsap } from 'gsap'
import type { TrackFrames } from "@/types/track";
import type { IViewerOptions } from "@/types/setting";
import type { TextRecord } from "@/types/translate";

export class SelectController extends Container implements IController {

    public options : IViewerOptions | undefined = undefined;
    protected readonly _stMap = new Map();
    protected _neededFrame : number = 1;
    protected _language : string = 'jp';

    public addTo<C extends Container>(parent : C): this {
        parent.addChild(this);
        return this;
    }

    public reset() {
        this.removeChildren(0, this.children.length);
        this._stMap.clear();
    }

    // public process(selectDesc: string, nextLabel: string, selectonClick:Function, afterSelection:Function, translated_text?:string): void {
    public process({select, nextLabel, translated_text, selectonClick, afterSelection} : TrackFrames & Record<string, any>): void {
        if (!select) return;

        if (!this._stMap.has(`selectFrame${this.neededFrame}`)) {
            let thisSelectContainer = new Container();
            thisSelectContainer.addChild(new Sprite(Assets.get(`selectFrame_${this.neededFrame}`)))
            let currentText : TextRecord = { jp: '', translated: '' };
            this._stMap.set(`selectFrame${this.neededFrame}`, { thisSelectContainer: thisSelectContainer, currentText: currentText });
            this._stMap.set(`selectFrame${this.neededFrame}`, { thisSelectContainer: thisSelectContainer});
        }

        let { thisSelectContainer, currentText } = this._stMap.get(`selectFrame${this.neededFrame}`);
        thisSelectContainer.eventMode = 'static'; // thisSelectContainer.interactive = true;
        const localBound = thisSelectContainer.getLocalBounds();
        thisSelectContainer.pivot.set(localBound.width / 2, localBound.height / 2);

        thisSelectContainer.on('click', () => {
            this._disableInteractive();

            // TweenMax.to(thisSelectContainer, 0.1, { pixi: { scaleX: 1.2, scaleY: 1.2 } });
            gsap.to(thisSelectContainer, { pixi: { scaleX: 1.2, scaleY: 1.2 } , duration: 0.1})

            setTimeout(() => {
                selectonClick(nextLabel);
                afterSelection();

                this._fadeOutOption();
            }, 800);

        }, { once: true });

        if (translated_text) {
            currentText.jp = select;
            currentText.translated = translated_text;
            select = currentText[this._language]
        }

        let textObj = new Text(select, {
            fontFamily: this.options?.fonts[this._language].family,
            fontSize: 24,
            fill: 0x000000,
            align: 'center',
            padding: 3
        });
        thisSelectContainer.addChild(textObj);
        this.addChild(thisSelectContainer);

        // for selectFrame size is 318x172
        textObj.anchor.set(0.5);
        textObj.position.set(159, 86);

        switch (this.neededFrame) {
            case 1:
                thisSelectContainer.position.set(568, 125);
                break;
            case 2:
                thisSelectContainer.position.set(200, 240);
                break;
            case 3:
                thisSelectContainer.position.set(936, 240);
                break;
        }

        const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0 }); // const tl = new TimelineMax({ repeat: -1, yoyo: true, repeatDelay: 0 });
        const yLocation = thisSelectContainer.y;
        tl.to(thisSelectContainer, { pixi: { y: yLocation - 10 }, ease: Power1.easeInOut , direction : 1}); // tl.to(thisSelectContainer, 1, { pixi: { y: yLocation - 10 }, ease: Power1.easeInOut });
        tl.to(thisSelectContainer, { pixi: { y: yLocation }, ease: Power1.easeInOut , direction : 1}); // tl.to(thisSelectContainer, 1, { pixi: { y: yLocation }, ease: Power1.easeInOut });

        this.frameForward();
    }

    public toggleLanguage(lang : string) {
        this._language = lang
        this._stMap.forEach((value) => {
            let { thisSelectContainer, currentText } = value;
            let textObj = thisSelectContainer.getChildAt(1);
            textObj.style.fontFamily = this.options?.fonts[this._language].family;
            textObj.text = currentText[this._language];
        })
    }

    protected _disableInteractive(){
        this._stMap.forEach(st => {
            st.eventMode = 'auto'; // st.interactive = false;
        });
    }

    protected _fadeOutOption(){
        this._stMap.forEach(st => {
            // TweenMax.to(st, 1, { alpha: 0, ease: Power3.easeOut });
            // gsap.to(st, 1, { alpha: 0, ease: Power3.easeOut })
            gsap.to(st, { alpha: 0, ease: Power3.easeOut, direction : 1 })
        });
        setTimeout(() => {
            this.removeChildren(0, this.children.length);
        }, 500);
    }

    frameForward() {
        this._neededFrame++;
    }

    frameReset() {
        this._neededFrame = 1;
    }

    get neededFrame() {
        return this._neededFrame;
    }
}