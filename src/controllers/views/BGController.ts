import { Container, Sprite, Assets } from "pixi.js";
import { fadingEffect } from "@/utils/effect";
import type { TrackFrames } from "@/types/track";
import type { EventViewer } from "../../EventViewer";

export class BGController extends Container {
    protected readonly _bgMap: Map<string, Sprite> = new Map();
    protected viewer: EventViewer;

    constructor(viewer: EventViewer, order?: number) {
        super();
        this.viewer = viewer;
        this.addTo(viewer, order);
    }

    // public process(bg : string, bgEffect: string, bgEffectTime: number): void {
    public process({ bg, bgEffect, bgEffectTime }: TrackFrames): void {
        if (bg && bgEffect) {
            // if (isFastForward) {
            //     this._insertNewBg(bg, 1, true);
            // }else{
            this._changeBgByEffect(bg, bgEffect, bgEffectTime!);
            // }
        } else if (bg && !bgEffect) {
            this._insertNewBg(bg, 1, true);
        }
    }

    public reset(): void {
        this.removeChildren(0, this.children.length);
        this._bgMap.clear();
    }

    protected _insertNewBg(
        bgName: string,
        alphaValue: number,
        removeOld = false
    ) {
        if (!this._bgMap.has(bgName)) {
            this._bgMap.set(bgName, new Sprite(Assets.get(`bg_${bgName}`)));
        }
        this._bgMap.get(bgName)!.alpha = alphaValue;
        if (removeOld && this.children.length != 0) {
            this.removeChildAt(0);
        }
        let order = this.children.length;
        this.addChildAt(this._bgMap.get(bgName)!, order);
    }

    protected _changeBgByEffect(
        bgName: string,
        effectName: string,
        bgEffectTime: number
    ) {
        switch (effectName) {
            case "fade":
                this._insertNewBg(bgName, 0);
                let origBg, newBg;
                if (this.children.length == 1) {
                    newBg = this.getChildAt(0);
                } else {
                    origBg = this.getChildAt(0);
                    newBg = this.getChildAt(1);
                }
                if (this.children.length != 1) {
                    fadingEffect(origBg!, {
                        alpha: 0,
                        time: bgEffectTime ? bgEffectTime / 1000 : 1,
                        ease: "none",
                        type: "to",
                    });
                    setTimeout(
                        () => {
                            if (this.children.length) {
                                this.removeChildAt(0);
                            }
                        },
                        bgEffectTime ? bgEffectTime : 1000
                    );
                }
                fadingEffect(newBg, {
                    alpha: 1,
                    time: bgEffectTime ? bgEffectTime : 1,
                    ease: "none",
                    type: "to",
                });
                break;
            case "mask":
                break;
        }
    }

    public addTo<C extends Container>(parent: C, order?: number): this {
        parent.addChild(this);
        this.zIndex = order ?? 0;
        return this;
    }
}
