import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Assets } from '@pixi/assets'
import { IController } from '../types/controller'
import { fadingEffect } from "@/utils/effect";
import type { TrackFrames } from "@/types/track";

export class FGController extends Container implements IController {

    protected readonly _fgMap : Map<string, Sprite> = new Map();
    protected _currentFg : undefined | null | Sprite;

    public addTo<C extends Container>(parent : C): this {
        parent.addChild(this);
        return this;
    }

    public reset(): void {
        this.removeChildren(0, this.children.length);
        this._fgMap.clear();
    }

    // public process(fg: string, fgEffect: string, fgEffectTime : number){
    public process({fg, fgEffect, fgEffectTime} : TrackFrames){
        if (fg == "off") {
            if (this.children.length) {
                this.removeChildren(0, this.children.length);
            }
        }
        else if (fg == "fade_out") {
            this._fadeOutFg();
        }
        else if (fg && fgEffect) {
            this._changeFgByEffect(fg, fgEffect, fgEffectTime!);
        }
        else if (fg && !fgEffect) {
            this._changeFg(fg, 0, 1);
        }
    }

    protected _changeFg(fgName : string, order: number, alphaValue:number) {
        if (!this._fgMap.has(fgName)) {
            this._fgMap.set(fgName, new Sprite(Assets.get(`fg_${fgName}`)));
        }
        this._currentFg = this._fgMap.get(fgName);
        this._currentFg!.alpha = alphaValue;

        if (this.children.length != 0 && order == 0) {
            this.removeChildAt(order);
        }

        this.addChildAt(this._fgMap.get(fgName)!, order > this.children.length ? this.children.length : order);
    }

    protected _changeFgByEffect(fgName : string, fgEffect : string, fgEffectTime : number){
        switch (fgEffect) {
            case "fade":
                this._changeFg(fgName, 1, 0);
                let newOrder : number = this.children.length == 1 ? 0 : 1;
                let origFg = this.getChildAt(0), newFg = this.getChildAt(newOrder);
                let k = setInterval(() => {
                    if (newOrder) {
                        origFg.alpha -= 0.01;
                    }
                    newFg.alpha += 0.01;
                }, 10);
                setTimeout(() => {
                    clearInterval(k);
                    if (newOrder) {
                        origFg.alpha = 0;
                    }
                    newFg.alpha = 1;
                }, fgEffectTime ? fgEffectTime : 1000);
                this.removeChildAt(0);
                break;
            case "mask":
                break;
        }
    }

    protected _fadeOutFg() {
        fadingEffect(this._currentFg!, { alpha: 0, time: 1000, type: 'to' });
    }

}