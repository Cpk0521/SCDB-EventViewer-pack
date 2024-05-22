import { Container, Graphics } from "pixi.js";
import { fadingEffect } from "@/utils/effect";
import type { TrackFrames } from "@/types/track";
import type { EventViewer } from "../../EventViewer";

export class EffectController extends Container {
    protected readonly _effectMap: Map<string, Graphics> = new Map();
    protected viewer: EventViewer;

    constructor(viewer: EventViewer, order?: number) {
        super();
        this.viewer = viewer;
        this.addTo(viewer, order);
    }

    public reset() {
        this.removeChildren(0, this.children.length);
        this._effectMap.clear();
    }

    // public process(effectLabel : string, effectTarget : Optional<EffectTarget>, effectValue : Optional<EffectValue>){
    public process({ effectLabel, effectTarget, effectValue }: TrackFrames) {
        if (!effectLabel) return;
        if (!this._effectMap.has(effectLabel)) {
            let thisEffect: Graphics | null | undefined = null;
            switch (effectTarget?.type) {
                case "rect":
                    thisEffect = new Graphics()
                        .rect(0, 0, effectTarget.width!, effectTarget.height!)
                        .fill(`0x${effectTarget.color}`);
                    break;
            }
            this._effectMap.set(effectLabel, thisEffect!);
        }

        let thisEffect = this._effectMap.get(effectLabel);
        if (thisEffect) {
            this.addChild(thisEffect);
            fadingEffect(thisEffect!, effectValue!);
        }
    }

    public addTo<C extends Container>(parent: C, order?: number): this {
        parent.addChild(this);
        this.zIndex = order ?? 0;
        return this;
    }
}
