import type { EventViewer } from "../EventViewer"
import type { TranslateData } from "@/types/translate";

enum translateState {
    ON = 'translated',
    OFF = 'jp'
}

export class TranslateController {

    protected viewer: EventViewer;
    protected _translate : boolean = false;
    protected _language : translateState = translateState.OFF;
    protected _translationData : TranslateData | undefined | null;
    protected _mixed : boolean = false

    constructor(viewer: EventViewer) {
        this.viewer = viewer;
    }

    

}