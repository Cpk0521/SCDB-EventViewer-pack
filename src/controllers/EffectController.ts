import { Container } from "@pixi/display";
import { Graphics } from '@pixi/graphics'
import { IController } from '../types/controller'
import { fadingEffect } from "@/utils/effect";

export class EffectController extends Container implements IController {

    protected readonly _effectMap : Map<string, Graphics> = new Map();

    public reset(){
        this.removeChildren(0, this.children.length);
        this._effectMap.clear();
    }

    // public process(effectLabel : string, effectTarget : Optional<EffectTarget>, effectValue : Optional<EffectValue>){
    public process({effectLabel, effectTarget, effectValue} : TrackFrames){
        if(!effectLabel) return;
        if (!this._effectMap.has(effectLabel)) {
            let thisEffect : Graphics | null | undefined = null;
            switch (effectTarget?.type) {
                case "rect":
                    thisEffect = new Graphics();
                    thisEffect.beginFill(`0x${effectTarget.color}`);
                    thisEffect.drawRect(0, 0, effectTarget.width!, effectTarget.height!);
                    thisEffect.endFill();
                    break;

            }
            this._effectMap.set(effectLabel, thisEffect!);
        }

        let thisEffect = this._effectMap.get(effectLabel);
        if(thisEffect) {
            this.addChild(thisEffect);   
            fadingEffect(thisEffect!, effectValue!);
        }
    }

    public addTo<C extends Container>(parent : C): this {
        parent.addChild(this);
        return this;
    }
    
}