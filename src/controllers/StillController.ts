import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Assets } from '@pixi/assets'
import { IController } from '../types/controller'
import type { TrackFrames } from "@/types/track";

export class StillController extends Container implements IController {

    protected readonly _stMap = new Map();

    public reset(): void {
        this.removeChildren(0, this.children.length);
        this._stMap.clear();
    }

    public addTo<T extends Container>(parent : T){
        parent.addChild(this);
        return this;
    }

    // public process(still : string, stillType : string, stillId : string, stillCtrl : string) {
    public process({still, stillType, stillId, stillCtrl} : TrackFrames) {
        if (stillType && stillId) {
            this._changeStillByType(stillType, stillId);
        }

        if (still) {
            this._changeStill(still);
        }

        if (stillCtrl) {
            this._control(stillCtrl);
        }
    }

    _changeStill(stillName : string) {
        if (!stillName) { return; }
        if (stillName == "off") {
            this._control(stillName);
            return;
        }

        this._removeStill();

        if (!this._stMap.has(stillName)) {
            this._stMap.set(stillName, new Sprite(Assets.get(`still_${stillName}`)));
        }

        const thisStill = this._stMap.get(stillName);

        this.addChild(thisStill);
    }

    _changeStillByType(stillType : string, stillId : string) {
        if (!stillType || !stillId) { return; }

        this._removeStill();

        if (!this._stMap.has(`${stillType}${stillId}`)) {
            this._stMap.set(`${stillType}${stillId}`, new Sprite(Assets.get(`still_${stillType}${stillId}`)));
        }

        const thisStill = this._stMap.get(`${stillType}${stillId}`);

        this.addChild(thisStill);
    }

    _control(stillCtrl : string) {
        if (!stillCtrl) { return; }

        switch (stillCtrl) {
            case "off":
                this._removeStill();
                break;
            case "on":
                break;
        }
    }

    _removeStill() {
        if (this.children.length) {
            this.removeChildAt(0);
        }
    }
}